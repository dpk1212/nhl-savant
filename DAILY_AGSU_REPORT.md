# AGS-Unified — V12 Daily Monitor

**Generated:** Sunday, July 26, 2026 at 7:50 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (56 days) · **Tape / side-profile era:** 2026-07-15+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (56 days ago), V12 has evaluated **1595** picks, shipped **518** for real money (32.5% ship rate), and muted the other **1077**. On the shipped picks V12 has gone **288-230** (55.6% win), staked **1453.77u**, and returned **+63.65u** at **+4.4% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             56 |
| Picks V12 has evaluated             |                           1595 |
| Picks SHIPPED (units > 0)           |                            518 |
| Picks MUTED (score ≤ 0, FADE)       |                           1077 |
| Ship rate                           |                          32.5% |
| Live W-L                            |                        288-230 |
| Live Win %                          |                          55.6% |
| Live PnL (units)                    |                         +63.65 |
| Live ROI                            |                          +4.4% |
| Avg PnL / day                       |                         +1.14u |
| Most recent action (2026-07-26)  |            4 live, 3-1, +8.50u |

### What's working

- V12 is profitable at **4.4% ROI** across 518 live picks (+63.65u real PnL).
- Mute rule is **saving money** — the 689 muted picks would have lost -51.73u at flat 1u (-7.5% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.14u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **52-37** · +6.1% ROI · +17.04u on 89 graded — see § 5.

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

**Stamps we keep for analysis (every shipped side):** depth (`#F/#A`, proven, V12 counts) + quality (ForWR, ForCLV, EDGE, Tape). Unopposed sides still get FOR numbers (EDGE uses AG prior 50). Compare WIN vs LOSS in § 5.

Odds cap clamps long dogs only (+121 / +151 / +200 → max 2.5 / 1.5 / 1.0u). **+120 or shorter is uncapped by odds** (still ≤6u global). Legacy ELITE→WEAK score-ladder units are **not** the live sizer — ignore them if you see them in old notes.

## § 3 — Daily Scoreboard

**Full book:** 56d · 518 live · 288-230 · **+63.65u** · +4.4% ROI · +1.14u/day.

_Prior to table (2026-06-01 → 2026-07-04): 366 live · 205-161 · +53.77u · cum through prior = +53.77u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-07-05 |        26 |   12 |     9 | 6-6        |  50.0% |     37.00 |      +0.44 |      1.2% |     +54.21 |
| 2026-07-06 |        26 |    7 |     9 | 4-3        |  57.1% |     20.50 |      +5.67 |     27.7% |     +59.88 |
| 2026-07-07 |        38 |   10 |    18 | 4-6        |  40.0% |     30.50 |     -11.21 |    -36.8% |     +48.67 |
| 2026-07-08 |        37 |    8 |    11 | 6-2        |  75.0% |     24.50 |     +12.97 |     52.9% |     +61.64 |
| 2026-07-09 |        25 |    7 |    11 | 5-2        |  71.4% |     25.00 |      +7.44 |     29.8% |     +69.08 |
| 2026-07-10 |        37 |    8 |    16 | 5-3        |  62.5% |     34.00 |      +4.96 |     14.6% |     +74.04 |
| 2026-07-11 |        23 |    5 |    10 | 0-5        |   0.0% |     18.00 |     -18.00 |   -100.0% |     +56.04 |
| 2026-07-12 |        29 |    5 |    16 | 1-4        |  20.0% |     13.50 |      -8.43 |    -62.4% |     +47.61 |
| 2026-07-14 |         3 |    1 |     0 | 0-1        |   0.0% |      1.00 |      -1.00 |   -100.0% |     +46.61 |
| 2026-07-15 |         5 |    1 |     1 | 1-0        | 100.0% |      2.50 |      +3.40 |    136.0% |     +50.01 |
| 2026-07-16 |         8 |    1 |     4 | 0-1        |   0.0% |      5.40 |      -5.40 |   -100.0% |     +44.61 |
| 2026-07-17 |        26 |   10 |    13 | 5-5        |  50.0% |     35.90 |      -4.93 |    -13.7% |     +39.68 |
| 2026-07-18 |        41 |   14 |    21 | 8-6        |  57.1% |     46.70 |      +4.91 |     10.5% |     +44.59 |
| 2026-07-19 |        24 |   13 |     7 | 7-6        |  53.8% |     34.10 |      -7.00 |    -20.5% |     +37.59 |
| 2026-07-20 |        22 |    7 |    12 | 4-3        |  57.1% |     16.35 |      +3.65 |     22.3% |     +41.24 |
| 2026-07-21 |        21 |   10 |     9 | 6-4        |  60.0% |     25.62 |      +3.36 |     13.1% |     +44.60 |
| 2026-07-22 |        34 |   12 |    19 | 9-3        |  75.0% |     30.58 |     +15.14 |     49.5% |     +59.74 |
| 2026-07-23 |        16 |    5 |     7 | 3-2        |  60.0% |     14.75 |      -0.55 |     -3.7% |     +59.19 |
| 2026-07-24 |        29 |    6 |    18 | 3-3        |  50.0% |     25.00 |      -1.99 |     -8.0% |     +57.20 |
| 2026-07-25 |        31 |    6 |    21 | 3-3        |  50.0% |     19.56 |      -2.05 |    -10.5% |     +55.15 |
| 2026-07-26 |        26 |    4 |    10 | 3-1        |  75.0% |     21.06 |      +8.50 |     40.4% |     +63.65 |

> **Trajectory.** Last 3 days (6.8% ROI) ≈ prior book (4.3%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-07-26**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | — |
| 🟢 2 | DISSENT rescue | D | 9 | 6-3 | +31.0% | +2.90u | +0.32u | +62.7% |
| 🟢 3 | MINI- (gate-cut) | C | 11 | 8-3 | +24.8% | +2.73u | +0.25u | +0.0% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP EDGE/net BOTH | C | 38 | 15-23 | -21.1% | -22.73u | -0.60u | -18.5% |
| 🔴 3 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 23 | 16-7 | +30.1% | +30.98u | sized UP after path |
| 2 | Tape HOLD (mid) | 54 | 28-26 | -9.3% | -12.95u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 11 | 7-4 | -13.5% | -4.39u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 467 | 224-243 | -5.4% | -25.08u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 11 | 7-4 | +20.5% | +2.26u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 0 | — | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 62 | 40-22 | 64.5% | 233.1u | +27.28u | +11.7% | +0.44u | 9 | +31.4% | +5.88u | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 51 | 31-20 | 60.8% | 201.9u | +30.93u | +15.3% | +0.61u | 12 | +20.7% | +5.17u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 38 | 15-23 | 39.5% | 107.5u | -22.73u | -21.1% | -0.60u | 10 | -18.5% | +1.45u | 🔴 cut |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 22 | 13-9 | 59.1% | 56.4u | +3.65u | +6.5% | +0.17u | 22 | +6.5% | -4.00u | 🟢 OK |
| MINI (gate-pass) | `MINI` | A | 3u | 45 | 23-22 | 51.1% | 129.8u | -8.67u | -6.7% | -0.19u | 3 | -27.6% | — | 🔻 cooling |
| MINI- (gate-cut) | `MINI-` | C | 1u | 11 | 8-3 | 72.7% | 11.0u | +2.73u | +24.8% | +0.25u | 1 | +0.0% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 9 | 6-3 | 66.7% | 9.3u | +2.90u | +31.0% | +0.32u | 6 | +62.7% | — | 🟢 room |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 23 | 16-7 | 69.6% | 102.9u | +30.98u | +30.1% | 17 | +33.5% | +12.50u |
| Tape HOLD (mid) | TAPE | staked | 54 | 28-26 | 51.9% | 139.6u | -12.95u | -9.3% | 44 | -5.8% | -4.00u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 11 | 7-4 | 63.6% | 32.5u | -4.39u | -13.5% | 2 | +47.0% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 11 | 7-4 | 63.6% | 11.0u | +2.26u | +20.5% | 9 | +9.9% | — |
| fadeTop≥60 MUTE | E | CF 1u | 1 | 0-1 | 0.0% | 1.0u | -1.00u | -100.0% | 0 | — | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 467 | 224-243 | 48.0% | 467.0u | -25.08u | -5.4% | 43 | -16.2% | -2.18u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 12 / -6% | 7 / +31% | 4 / -16% |
| RANK | 10 / -3% | 3 / +88% | — |
| SHARP | 5 / -72% | 7 / -11% | 1 / -100% |
| SHARP-LEAN | 17 / -11% | 5 / +34% | — |
| MINI | 4 / +7% | — | 4 / +1% |
| MINI- | — | — | 1 / +0% |
| DISSENT | 6 / +29% | 1 / +91% | 1 / +94% |

### (D) Last graded day movers (2026-07-26)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| HC-1 TOP | 1 | 1-0 | +5.88u | +98.0% |
| RANK 2-for-0 rescue | 1 | 1-0 | +5.17u | +86.2% |
| SHARP EDGE/net BOTH | 1 | 1-0 | +1.45u | +28.7% |
| SHARP-LEAN EDGE/net ONE | 1 | 0-1 | -4.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u | 106 | 55-36  |  60.4% |      365.60 |     +15.34 |      4.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 159 | 65-60  |  52.0% |      414.82 |      +5.24 |      1.3% |
| STRONG (MINI)             |    3u |  50 | 23-22  |  51.1% |      129.75 |      -8.67 |     -6.7% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  30 | 16-9   |  64.0% |       25.35 |      +3.61 |     14.2% |
| **STAKED TOTAL** |     — | 299 | 169-130 |  56.5% |      997.02 |     +43.40 |     +4.4% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u |  77 | 40-22  |  64.5% |      233.10 |     +27.28 |     11.7% |
| B · 2-for-0 rescue    | RANK        |    4u |  55 | 31-20  |  60.8% |      201.90 |     +30.93 |     15.3% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u |  47 | 13-9   |  59.1% |       56.40 |      +3.65 |      6.5% |
| C · proven-$ consensus | SHARP       |    3u |  43 | 15-23  |  39.5% |      107.52 |     -22.73 |    -21.1% |
| A · mini-HC (gate-pass) | MINI        |    3u |  50 | 23-22  |  51.1% |      129.75 |      -8.67 |     -6.7% |
| C · mini gate-cut     | MINI-       |    1u |  13 | 8-3    |  72.7% |       11.00 |      +2.73 |     24.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  11 | 6-3    |  66.7% |        9.35 |      +2.90 |     31.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 382 picks tracked at 0u (would-be 183-199, 47.9% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (61-45, +15.34u)  ·  🟠 SHARP PLAY (83-76, +5.24u)  ·  🔴 STRONG (28-22, -8.67u)  ·  🟣 LEAN (17-13, +3.61u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 57]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 283 | 278 | 268 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 11 | 7-4 | 63.6% | 0.00u | +0.00u | — |
| HOLD      | 57 | 30-27 | 52.6% | 142.65u | -15.95u | -11.2% |
| BOOST     | 23 | 16-7 | 69.6% | 102.87u | +30.98u | +30.1% |
| FAIL_OPEN | 11 | 7-4 | 63.6% | 32.50u | -4.39u | -13.5% |
| PASS      | 166 | 84-82 | 50.6% | 0.00u | +0.00u | — |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 73 | 42-31 | 57.5% | -9.06u |
| hold (0–2.89) | path u | 116 | 56-60 | 48.3% | -5.39u |
| boost (≥2.89) | ×1.35 | 35 | 20-15 | 57.1% | +25.33u |

_Score coverage: **224/268** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 11 | +9.54u | -9.54u | +3.25u | +12.79u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 23 | +23.03u | +30.98u | +7.95u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-07-26 | MLB | Milwaukee Brewers | SHARP | 6.63 | BOOST | 3.75u | 5.06u | WIN |
| 2026-07-26 | MLB | Los Angeles Angels | 2-for-0 | 4.85 | BOOST | 5.00u | 6.00u | WIN |
| 2026-07-26 | MLB | Milwaukee Brewers | HC-1 | 3.34 | BOOST | 5.00u | 6.00u | WIN |
| 2026-07-26 | MLB | New York Yankees | PATH-D | -5.47 | MUTE | 1.00u | 0.00u | — |
| 2026-07-25 | MLB | Houston Astros | PATH-D | -1.44 | MUTE | 1.00u | 0.00u | WIN |
| 2026-07-25 | MLB | Under 8.5 | SHARP | 4.30 | BOOST | 3.75u | 5.06u | LOSS |
| 2026-07-25 | MLB | Over 8.5 | SHARP~ | 3.20 | BOOST | 1.88u | 5.00u | WIN |
| 2026-07-24 | MLB | Over 9.5 | SHARP~ | 4.89 | BOOST | 1.88u | 5.00u | LOSS |
| 2026-07-24 | MLB | Over 7.5 | 2-for-0 | 3.58 | BOOST | 5.00u | 6.00u | WIN |
| 2026-07-23 | MLB | Arizona Diamondbacks | SHARP~ | 3.31 | BOOST | 1.88u | 2.50u | WIN |
| 2026-07-23 | MLB | Detroit Tigers | MINI- | -0.03 | MUTE | 0.75u | 0.00u | LOSS |
| 2026-07-22 | WNBA | Indiana Fever | SHARP~ | 3.76 | BOOST | 1.88u | 5.00u | WIN |
| 2026-07-22 | WNBA | Chicago Sky | SHARP~ | 3.43 | BOOST | 1.88u | 5.00u | WIN |
| 2026-07-22 | MLB | Under 7.5 | SHARP | 4.80 | BOOST | 3.75u | 5.06u | WIN |
| 2026-07-21 | MLB | Los Angeles Dodgers | HC-1 | 3.04 | BOOST | 1.25u | 2.50u | WIN |

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 62–28 · 68.9% · +27.3%); **5–10 is the hole** (34–30 · 53.1% · -4.7%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 300 tickets · cov 289/300 (stamp 89 / as-of 200)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 135 | 67–68 | 49.6% | -8.7% |
| 5–10 | 64 | 34–30 | 53.1% | -4.7% |
| ≥10 | 90 | 62–28 | 68.9% | +27.3% |
| All | 300 | 170–130 | 56.7% | +4.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.7% (71) | 57.9% (38) | 72% (50) |
| B | 52.8% (36) | 80% (5) | 80% (10) |
| C | 37.5% (24) | 36.8% (19) | 59.3% (27) |

##### Jul 15+ · 89 tickets · cov 84/89 (stamp 84 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 29 | 14–15 | 48.3% | -14.8% |
| 5–10 | 25 | 11–14 | 44.0% | -24.2% |
| ≥10 | 30 | 23–7 | 76.7% | +31.7% |
| All | 89 | 52–37 | 58.4% | +6.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 41.7% (12) | 55.6% (9) | 88.9% (9) |
| B | 50% (10) | — | 100% (3) |
| C | 33.3% (3) | 35.7% (14) | 64.7% (17) |

##### Yesterday (Jul 25) · 6 tickets · cov 6/6 (stamp 6 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 4 | 2–2 | 50.0% | -15.7% |
| ≥10 | 2 | 1–1 | 50.0% | -5.6% |
| All | 6 | 3–3 | 50.0% | -10.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| B | 33.3% (3) | — | — |
| C | — | — | 50% (2) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 300 tickets · cov 299/300 (stamp 88 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 203 | 110–93 | 54.2% | -1.5% |
| 5–10 | 45 | 26–19 | 57.8% | +13.6% |
| ≥10 | 51 | 34–17 | 66.7% | +20.3% |
| All | 300 | 170–130 | 56.7% | +4.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 56.4% (110) | 55.6% (27) | 77.8% (27) |
| B | 58.3% (36) | 71.4% (7) | 62.5% (8) |
| C | 44.9% (49) | 50% (10) | 46.7% (15) |

##### Jul 15+ · 89 tickets · cov 89/89 (stamp 88 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 53 | 32–21 | 60.4% | +6.2% |
| 5–10 | 22 | 13–9 | 59.1% | +19.6% |
| ≥10 | 14 | 7–7 | 50.0% | -12.7% |
| All | 89 | 52–37 | 58.4% | +6.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 75% (16) | 54.5% (11) | 50% (6) |
| B | 37.5% (8) | 100% (3) | 100% (2) |
| C | 54.5% (22) | 42.9% (7) | 33.3% (6) |

##### Yesterday (Jul 25) · 6 tickets · cov 6/6 (stamp 6 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 4 | 2–2 | 50.0% | -1.7% |
| ≥10 | 2 | 1–1 | 50.0% | -23.0% |
| All | 6 | 3–3 | 50.0% | -10.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| B | 0% (2) | — | 100% (1) |
| C | 100% (1) | — | 0% (1) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 300 tickets · cov 289/300 (stamp 83 / as-of 206)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 73 | 29–44 | 39.7% | -28.8% |
| 0–2.89 | 144 | 83–61 | 57.6% | +9.5% |
| ≥2.89 | 72 | 51–21 | 70.8% | +29.0% |
| All | 300 | 170–130 | 56.7% | +4.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 64% (75) | 73.2% (41) |
| B | 57.9% (19) | 54.5% (22) | 80% (10) |
| C | 18.2% (11) | 46.3% (41) | 61.1% (18) |

##### Jul 15+ · 89 tickets · cov 84/89 (stamp 83 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 4 | 1–3 | 25.0% | -60.4% |
| 0–2.89 | 53 | 29–24 | 54.7% | -1.7% |
| ≥2.89 | 27 | 18–9 | 66.7% | +25.0% |
| All | 89 | 52–37 | 58.4% | +6.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 61.1% (18) | 63.6% (11) |
| B | 33.3% (3) | 57.1% (7) | 100% (3) |
| C | — | 45.5% (22) | 58.3% (12) |

##### Yesterday (Jul 25) · 6 tickets · cov 6/6 (stamp 6 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 1 | 0–1 | 0.0% | -100.0% |
| 0–2.89 | 3 | 2–1 | 66.7% | +23.2% |
| ≥2.89 | 2 | 1–1 | 50.0% | -5.6% |
| All | 6 | 3–3 | 50.0% | -10.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| B | 0% (1) | 50% (2) | — |
| C | — | — | 50% (2) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 89 | 52-37 | 58.4% | 277.52u | +17.04u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 89/89 | 1.81 | 2.16 | -0.35 | 2.00 | 2.00 |
| depth   | #A sharps        | 89/89 | 1.12 | 1.27 | -0.15 | 1.00 | 1.00 |
| depth   | #F − #A          | 89/89 | 0.69 | 0.89 | -0.20 | 1.00 | 1.00 |
| depth   | proven F         | 89/89 | 1.29 | 1.35 | -0.06 | 1.00 | 1.00 |
| depth   | proven A         | 89/89 | 0.37 | 0.41 | -0.04 | 0.00 | 0.00 |
| depth   | proven F−A       | 89/89 | 0.92 | 0.95 | -0.02 | 1.00 | 1.00 |
| depth   | v12 F count      | 89/89 | 1.67 | 2.11 | -0.44 | 2.00 | 2.00 |
| depth   | v12 A count      | 89/89 | 1.17 | 1.16 | +0.01 | 1.00 | 1.00 |
| depth   | WA ForN          | 89/89 | 1.38 | 1.89 | -0.51 | 1.00 | 1.00 |
| depth   | WA AgN           | 89/89 | 0.88 | 1.00 | -0.12 | 0.50 | 0.00 |
| depth   | CLV ForN         | 88/89 | 1.75 | 2.16 | -0.42 | 2.00 | 2.00 |
| depth   | CLV AgN          | 88/89 | 1.16 | 1.19 | -0.03 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 89/89 | 0.40 | 0.46 | -0.06 | 0.00 | 0.00 |
| quality | ForWR            | 84/89 | 55.58 | 53.67 | +1.92 | 54.52 | 54.35 |
| quality | AgWR             | 42/89 | 41.53 | 44.05 | -2.53 | 42.60 | 45.31 |
| quality | TopFor WR        | 84/89 | 56.74 | 56.48 | +0.26 | 55.75 | 55.70 |
| quality | TopAg WR         | 42/89 | 43.81 | 48.59 | -4.79 | 44.00 | 50.30 |
| quality | EDGE             | 84/89 | 10.16 | 6.31 | +3.85 | 9.26 | 5.80 |
| quality | ForCLV           | 88/89 | 65.09 | 66.58 | -1.49 | 66.00 | 66.00 |
| quality | AgCLV            | 49/89 | 61.96 | 60.92 | +1.04 | 64.72 | 65.59 |
| quality | netCLV           | 88/89 | 3.11 | 5.13 | -2.02 | 3.37 | 3.87 |
| quality | Tape             | 83/89 | 2.54 | 2.09 | +0.45 | 2.27 | 1.78 |
| quality | V12 score        | 89/89 | 0.88 | 0.87 | +0.01 | 0.97 | 0.97 |
| quality | V12 forMean      | 89/89 | 22.25 | 18.93 | +3.32 | 16.95 | 15.06 |
| quality | V12 agMean       | 89/89 | 1.22 | 0.86 | +0.36 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 84/89 | 0.655 | +0.361 | +0.274 | +3.85 | 🟢 sep OK |
|    2 | TopAg WR         | quality | 42/89 | 0.361 | -0.201 | -0.274 | -4.79 | 🟢 sep OK |
|    3 | WA ForN          | depth   | 89/89 | 0.412 | +0.123 | -0.222 | -0.51 | 🔴 inverted |
|    4 | Tape             | quality | 83/89 | 0.582 | +0.123 | +0.118 | +0.45 | 🟢 sep OK |
|    5 | AgWR             | quality | 42/89 | 0.421 | -0.062 | -0.192 | -2.53 | 🟡 mild OK |
|    6 | ForWR            | quality | 84/89 | 0.575 | +0.274 | +0.192 | +1.92 | 🟡 mild OK |
|    7 | V12 forMean      | quality | 89/89 | 0.568 | +0.266 | +0.096 | +3.32 | 🟡 mild OK |
|    8 | #F − #A          | depth   | 89/89 | 0.445 | -0.052 | -0.050 | -0.20 | 🟡 mild inv |
|    9 | unopposed (A=0)  | depth   | 89/89 | 0.451 | +0.241 | -0.055 | -0.06 | mild LOSS↑ |
|   10 | proven F−A       | depth   | 89/89 | 0.452 | +0.254 | -0.012 | -0.02 | 🟡 mild inv |
|   11 | CLV ForN         | depth   | 88/89 | 0.453 | +0.081 | -0.172 | -0.42 | 🟡 mild inv |
|   12 | netCLV           | quality | 88/89 | 0.454 | -0.203 | -0.088 | -2.02 | 🟡 mild inv |
|   13 | ForCLV           | quality | 88/89 | 0.457 | -0.218 | -0.112 | -1.49 | 🟡 mild inv |
|   14 | V12 score        | quality | 89/89 | 0.540 | +0.138 | +0.024 | +0.01 | flat |
|   15 | v12 F count      | depth   | 89/89 | 0.461 | +0.110 | -0.189 | -0.44 | flat |
|   16 | proven F         | depth   | 89/89 | 0.462 | +0.286 | -0.060 | -0.06 | flat |
|   17 | #F sharps        | depth   | 89/89 | 0.472 | +0.100 | -0.139 | -0.35 | flat |
|   18 | proven A         | depth   | 89/89 | 0.480 | +0.360 | -0.025 | -0.04 | flat |
|   19 | AgCLV            | quality | 49/89 | 0.511 | +0.113 | +0.045 | +1.04 | flat |
|   20 | CLV AgN          | depth   | 88/89 | 0.507 | +0.207 | -0.010 | -0.03 | flat |
|   21 | #A sharps        | depth   | 89/89 | 0.495 | +0.169 | -0.050 | -0.15 | flat |
|   22 | TopFor WR        | quality | 84/89 | 0.505 | +0.199 | +0.032 | +0.26 | flat |
|   23 | V12 agMean       | quality | 89/89 | 0.503 | +0.422 | +0.042 | +0.36 | flat |
|   24 | WA AgN           | depth   | 89/89 | 0.503 | +0.272 | -0.041 | -0.12 | flat |
|   25 | v12 A count      | depth   | 89/89 | 0.502 | +0.209 | +0.004 | +0.01 | flat |

### (C) Working read

_N=89 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.655 · Δ +3.85 · higher on WINs (cov 84/89)
- **Tape** — AUC 0.582 · Δ +0.45 · higher on WINs (cov 83/89)
- **ForWR** — AUC 0.575 · Δ +1.92 · higher on WINs (cov 84/89)
- **V12 forMean** — AUC 0.568 · Δ +3.32 · higher on WINs (cov 89/89)
- **unopposed (A=0)** — AUC 0.451 · Δ -0.06 · higher on LOSSes (cov 89/89)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 244n · 53.7% · +1.9%   | 55n · 61.8% · +9.3%    | 158n · 52.5% · -0.6%   | 457n · 54.3% · +1.8%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 3n · 66.7% · -13.1%    | —                      | —                      | 3n · 66.7% · -13.1%    |
| WNBA  | 4n · 100.0% · +40.2%   | 3n · 66.7% · +17.2%    | —                      | 7n · 85.7% · +30.9%    |
| **All** | **293n · 55.6% · +5.4%** | **62n · 62.9% · +13.3%** | **163n · 52.8% · +0.0%** | **518n · 55.6% · +4.4%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **689** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  689 |
| Muted W-L                           |              337-352 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |               -51.73 |
| Counterfactual ROI at flat 1u       |                -7.5% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-51.73u** at a flat 1u stake — a counterfactual ROI of **-7.5%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-07-26 | MLB   | ML     | Milwaukee Brewers       |  -350 | +0.322 | SHARP    |   2/2 |   1/2 |  43.7 |   75.0 |  +10.4 |  6.63 | BOOST    | 5.06u | WIN     |      +1.45 |
| 2026-07-26 | MLB   | ML     | Los Angeles Angels      |  -116 | +0.063 | 2-for-0  |   2/2 |   2/1 |  54.0 |   60.4 |  +11.0 |  4.85 | BOOST    | 6.00u | WIN     |      +5.17 |
| 2026-07-26 | MLB   | ML     | Texas Rangers           |  -106 | +0.983 | SHARP~   |   1/2 |   1/1 |  54.3 |   64.5 |  +12.5 |  1.79 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-26 | MLB   | SPREAD | Milwaukee Brewers       |  -102 | +0.990 | HC-1     |   2/1 |   2/1 |  56.3 |   61.0 |  +23.0 |  3.34 | BOOST    | 6.00u | WIN     |      +5.88 |
| 2026-07-25 | MLB   | ML     | Chicago Cubs            |  +107 | +0.858 | 2-for-0  |   3/0 |   2/0 |  51.7 |   72.8 |   +1.7 |  1.95 | HOLD     | 3.00u | WIN     |      +3.21 |
| 2026-07-25 | MLB   | ML     | New York Mets           |  +135 | +0.920 | 2-for-0  |   2/0 |   1/0 |  51.8 |   61.9 |   +1.8 |  0.35 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-07-25 | MLB   | ML     | New York Yankees        |  -125 | +0.353 | PATH-D   |   2/2 |   1/2 |  54.6 |   65.0 |   +3.8 |  0.68 | HOLD     | 1.00u | WIN     |      +0.80 |
| 2026-07-25 | MLB   | TOTAL  | Under 8.5               |  +102 | +0.737 | SHARP    |   1/2 |   1/1 |  55.9 |   72.7 |  +12.1 |  4.30 | BOOST    | 5.06u | LOSS    |      -5.06 |
| 2026-07-25 | MLB   | TOTAL  | Over 7.5                |  -116 | +0.896 | 2-for-0  |   4/1 |   2/0 |  50.4 |   61.4 |   +0.4 | -0.01 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-07-25 | MLB   | TOTAL  | Over 8.5                |  -111 | +0.988 | SHARP~   |   1/3 |   1/0 |  54.2 |   62.2 |  +21.4 |  3.20 | BOOST    | 5.00u | WIN     |      +4.50 |
| 2026-07-24 | MLB   | ML     | Arizona Diamondbacks    |  -124 | +0.993 | HC-1     |   1/1 |   1/0 |  57.9 |   65.6 |   +7.0 |  0.82 | HOLD     | 3.00u | WIN     |      +2.42 |
| 2026-07-24 | MLB   | ML     | Milwaukee Brewers       |  -242 | +0.988 | 2-for-0  |   2/0 |   2/0 |  54.5 |   63.2 |   +4.5 |  1.08 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-07-24 | MLB   | ML     | Philadelphia Phillies   |  -134 | +0.987 | SHARP~   |   2/1 |   2/1 |  56.9 |   60.0 |  +10.2 |  0.31 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-24 | MLB   | SPREAD | Atlanta Braves          |  -187 | +0.970 | SHARP~   |   1/1 |   1/0 |  57.9 |   65.6 |  +12.9 |  2.54 | HOLD     | 4.00u | WIN     |      +2.14 |
| 2026-07-24 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.990 | SHARP~   |   1/1 |   1/0 |  59.1 |   63.4 |  +25.2 |  4.89 | BOOST    | 5.00u | LOSS    |      -5.00 |
| 2026-07-24 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.981 | 2-for-0  |   3/0 |   2/0 |  61.3 |   70.8 |  +11.3 |  3.58 | BOOST    | 6.00u | WIN     |      +5.45 |
| 2026-07-23 | MLB   | ML     | Arizona Diamondbacks    |  +104 | +0.991 | SHARP~   |   2/3 |   2/1 |  60.3 |   65.0 |  +16.4 |  3.31 | BOOST    | 2.50u | WIN     |      +2.60 |
| 2026-07-23 | MLB   | ML     | Detroit Tigers          |  -232 | +0.973 | HC-1     |   2/1 |   2/0 |  53.7 |   58.0 |  +11.5 |  1.13 | HOLD     | 5.00u | WIN     |      +2.16 |
| 2026-07-23 | MLB   | ML     | Toronto Blue Jays       |  -106 | +0.642 | PATH-D   |   1/5 |   1/2 |     — |   40.0 |      — |     — | FAIL_OPEN | 1.00u | WIN     |      +0.94 |
| 2026-07-23 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.965 | MINI     |   4/1 |   3/0 |  51.6 |   59.5 |   +9.4 |  0.94 | HOLD     | 2.25u | LOSS    |      -2.25 |
| 2026-07-23 | MLB   | TOTAL  | Under 8.5               |  -102 | +0.401 | SHARP~   |   1/3 |   1/2 |  63.2 |   65.0 |  +14.8 |  2.88 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-22 | MLB   | ML     | Texas Rangers           |  +104 | +0.954 | SHARP~   |   1/3 |   1/0 |  54.4 |   56.5 |   +9.1 |  0.86 | HOLD     | 1.13u | LOSS    |      -1.13 |
| 2026-07-22 | MLB   | ML     | Detroit Tigers          |  +113 | +0.981 | PATH-D   |   1/3 |   1/0 |  53.5 |   64.2 |   +2.3 |  1.05 | HOLD     | 1.00u | WIN     |      +1.13 |
| 2026-07-22 | MLB   | ML     | Houston Astros          |  -114 | +0.411 | PATH-D   |   1/4 |   1/3 |  53.5 |   64.2 |   +3.4 |  0.46 | HOLD     | 1.00u | WIN     |      +0.88 |
| 2026-07-22 | MLB   | ML     | Cleveland Guardians     |  -137 | +0.930 | PATH-D   |   2/2 |   1/0 |  48.5 |   66.4 |   +4.7 |  0.84 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-07-22 | MLB   | ML     | Tampa Bay Rays          |  -108 | +0.932 | 2-for-0  |   2/0 |   1/0 |  52.3 |   63.0 |   +2.3 |  0.62 | HOLD     | 3.00u | WIN     |      +2.78 |
| 2026-07-22 | WNBA  | ML     | Indiana Fever           |  -512 | +0.981 | SHARP~   |   3/0 |   1/0 |  66.7 |   64.8 |  +16.7 |  3.76 | BOOST    | 5.00u | WIN     |      +0.98 |
| 2026-07-22 | WNBA  | ML     | Minnesota Lynx          |  -499 | +0.984 | HC-1     |   4/0 |   1/0 |  66.7 |   54.9 |  +16.7 |  2.27 | HOLD     | 5.00u | WIN     |      +1.00 |
| 2026-07-22 | MLB   | SPREAD | Boston Red Sox          |  +122 | +0.971 | SHARP~   |   1/0 |   1/0 |  58.4 |   65.2 |   +8.4 |  2.16 | HOLD     | 1.13u | WIN     |      +1.38 |
| 2026-07-22 | MLB   | SPREAD | Seattle Mariners        |  +136 | +0.971 | SHARP~   |   1/0 |   1/0 |  58.4 |   65.2 |   +8.4 |  2.16 | HOLD     | 1.13u | LOSS    |      -1.13 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.525 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.078 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.009 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.012 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.021 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  513 |    +0.0436 |    -0.0018 | 0.0001 |  +0.010 |   0.951 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  513 |    +0.0498 |    +0.5123 | 0.0005 |  +0.021 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  513 |    -0.2646 |    +0.3486 | 0.0004 |  -0.019 |   2.932 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 513 |          +0.058 |           +0.015 |                   +0.044 |                   -0.006 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 513 |          -0.013 |           +0.325 |                   +0.001 |                   +0.102 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 513 |          -0.003 |           +0.174 |                   -0.026 |                   +0.019 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 513 |          -0.020 |           +0.137 |                   +0.005 |                   +0.072 | count of contributing AGAINST-side wallets                     |
| provenFor         | 513 |          +0.013 |           +0.186 |                   -0.003 |                   +0.055 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 513 |          -0.005 |           +0.104 |                   +0.009 |                   +0.038 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 4.300          | 171 | 94-77   |   55.0% |     +2.2% |
| MID (p33–p67)     | 19.950 … 28.078        | 171 | 94-77   |   55.0% |     +1.0% |
| HIGH (> p67)      | 48.906 … 49.225        | 171 | 97-74   |   56.7% |     +1.0% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       513 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8694 | average score across live picks                                 |
| SD                |    0.2133 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.325 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.617 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.530 / +0.963 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  453 | 246-207 |   54.3% |     +1.6% |  0.508 |        -0.025 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   34 | 23-11  |   67.6% |    +22.6% |  0.522 |        -0.183 | noise                                     |
| UFC   |    3 | 2-1    |   66.7% |    -13.1% |  1.000 |        +1.000 | strong (N<20)                             |
| WNBA  |    7 | 6-1    |   85.7% |    +30.9% |  0.500 |        +0.571 | noise (N<20)                              |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26"]
    y-axis "AUC" 0.4 --> 0.8
    line [0.542, 0.553, 0.611, 0.76, 0.719, 0.63, 0.581, 0.567, 0.535, 0.567, 0.573, 0.532, 0.52, 0.514]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26"]
    y-axis "edge (pp)" -15 --> 9
    line [-3, -5.3, -0.6, -8.9, -13.8, -13.3, -4.4, -0.9, 1.5, 4.1, 5, 5.1, 5.7, 7.2]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-07-12 |    7 |   50 | 25-25  |   50.0% |     -4.0% |  0.542 |      -3.0pp |
| 2026-07-14 |    7 |   44 | 21-23  |   47.7% |     -9.1% |  0.553 |      -5.3pp |
| 2026-07-15 |    7 |   35 | 18-17  |   51.4% |     +1.1% |  0.611 |      -0.6pp |
| 2026-07-16 |    7 |   28 | 12-16  |   42.9% |    -17.1% |  0.760 |      -8.9pp |
| 2026-07-17 |    7 |   31 | 12-19  |   38.7% |    -26.7% |  0.719 |     -13.8pp |
| 2026-07-18 |    7 |   37 | 15-22  |   40.5% |    -23.9% |  0.630 |     -13.3pp |
| 2026-07-19 |    7 |   45 | 22-23  |   48.9% |    -13.3% |  0.581 |      -4.4pp |
| 2026-07-20 |    7 |   47 | 25-22  |   53.2% |     -4.5% |  0.567 |      -0.9pp |
| 2026-07-21 |    7 |   56 | 31-25  |   55.4% |     -1.2% |  0.535 |      +1.5pp |
| 2026-07-22 |    7 |   67 | 39-28  |   58.2% |     +5.0% |  0.567 |      +4.1pp |
| 2026-07-23 |    7 |   71 | 42-29  |   59.2% |     +7.1% |  0.573 |      +5.0pp |
| 2026-07-24 |    7 |   67 | 40-27  |   59.7% |     +9.1% |  0.532 |      +5.1pp |
| 2026-07-25 |    7 |   59 | 35-24  |   59.3% |     +6.4% |  0.520 |      +5.7pp |
| 2026-07-26 |    7 |   50 | 31-19  |   62.0% |    +17.0% |  0.514 |      +7.2pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.514 avg in first half → 0.543 avg in second half · Δ = +0.029)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.4% | [-4.7%, +13.3%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.6% | [51.3%, 60.2%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.525 | [0.473, 0.571]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             58 | [13, 105]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       518 |
| Unique wallets ever on a FOR side            |                                                       152 |
| Avg FOR-side wallets per pick                |                                                      2.87 |
| Top-5 wallets' share of all FOR appearances  |                                                     29.0% |
| Top-10 wallets' share of all FOR appearances |                                                     46.9% |
| Top-20 wallets' share of all FOR appearances |                                                     65.1% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    2 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    3 | 4c64aa  | MLB        |   91 |   11 | 49-42  |   53.8% |     -0.4% |     -0.74 |     0.83× | WR50        |     -2.1% |     325 | 2026-07-25 |
|    4 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|    5 | 2f2a9e  | MLB,SOC,WNBA |   69 |   28 | 36-33  |   52.2% |     -8.3% |    -16.20 |     2.09× | CONFIRMED   |    -10.1% |     237 | 2026-07-23 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   66 |   35 | 35-31  |   53.0% |    +14.5% |    +27.97 |     1.40× | CONFIRMED   |     +9.7% |     422 | 2026-07-26 |
|    7 | 0cd77e  | MLB,SOC,UFC |   60 |    5 | 38-22  |   63.3% |    +18.9% |    +38.22 |     1.44× | CONFIRMED   |    +11.5% |     121 | 2026-07-26 |
|    8 | eeabaf  | MLB,NBA,SOC |   53 |    8 | 30-23  |   56.6% |     +9.3% |    +14.38 |     1.34× | CONFIRMED   |    +17.9% |     188 | 2026-07-26 |
|    9 | 0f9d74  | MLB,NBA,SOC,UFC |   48 |   28 | 23-25  |   47.9% |     -1.3% |     -1.86 |     0.53× | CONFIRMED   |    +20.9% |     215 | 2026-07-26 |
|   10 | 7923c4  | MLB,NBA,UFC |   39 |   13 | 24-15  |   61.5% |    +34.9% |    +29.28 |     0.76× | CONFIRMED   |     +8.3% |     178 | 2026-07-25 |
|   11 | 4b912c  | MLB,SOC    |   36 |   15 | 19-17  |   52.8% |     +1.4% |     +1.75 |     1.31× | CONFIRMED   |     -8.8% |     124 | 2026-07-23 |
|   12 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   31 |   21 | 17-14  |   54.8% |     -0.6% |     -0.58 |     1.41× | CONFIRMED   |    +11.1% |     132 | 2026-07-26 |
|   13 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   14 | 7da3d5  | MLB,SOC,UFC,WNBA |   28 |   33 | 10-18  |   35.7% |    -34.0% |    -29.35 |     4.77× | CONFIRMED   |     -9.6% |     146 | 2026-07-26 |
|   15 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   16 | 491f30  | MLB,SOC    |   25 |    4 | 17-8   |   68.0% |    +43.8% |    +35.89 |     0.95× | CONFIRMED   |     -8.8% |      64 | 2026-07-01 |
|   17 | bc35e3  | MLB,SOC,WNBA |   25 |   13 | 14-11  |   56.0% |     +6.1% |     +4.81 |     1.26× | CONFIRMED   |     +3.4% |     115 | 2026-07-23 |
|   18 | a82a75  | MLB,SOC,UFC |   24 |   10 | 13-11  |   54.2% |     +6.4% |     +5.21 |     0.83× | CONFIRMED   |     -5.4% |      82 | 2026-07-25 |
|   19 | f2f960  | MLB        |   24 |   12 | 11-13  |   45.8% |    -14.3% |    -11.64 |     2.67× | FLAT        |     +0.7% |      71 | 2026-07-25 |
|   20 | c911a4  | MLB,NBA,SOC |   21 |   12 | 11-10  |   52.4% |    +17.0% |    +10.19 |     4.63× | CONFIRMED   |    +54.3% |      77 | 2026-07-14 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-07-21 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | 7923c4  | MLB,NBA,UFC |   39 | 24-15  |   61.5% |     +34.9% |    +29.28 |     0.76× | 2026-07-25 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    6 | f2d227  | MLB,NBA    |   10 | 7-3    |   70.0% |     +27.3% |     +6.45 |     0.56× | 2026-07-20 |
|    7 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    8 | 0cd77e  | MLB,SOC,UFC |   60 | 38-22  |   63.3% |     +18.9% |    +38.22 |     1.44× | 2026-07-26 |
|    9 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-07-14 |
|   10 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|   11 | b839b3  | MLB,NBA,SOC,UFC |   16 | 10-6   |   62.5% |     +15.0% |     +8.29 |     1.56× | 2026-07-23 |
|   12 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |
|   13 | cd2f63  | MLB,NBA,SOC,WNBA |   66 | 35-31  |   53.0% |     +14.5% |    +27.97 |     1.40× | 2026-07-26 |
|   14 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   15 | eeabaf  | MLB,NBA,SOC |   53 | 30-23  |   56.6% |      +9.3% |    +14.38 |     1.34× | 2026-07-26 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 7da3d5  | MLB,SOC,UFC,WNBA |   28 | 10-18  |   35.7% |     -34.0% |    -29.35 |     4.77× | 2026-07-26 |
|    3 | 705ba1  | MLB        |   12 | 4-8    |   33.3% |     -31.1% |    -13.45 |     1.28× | 2026-07-25 |
|    4 | 8ec926  | MLB,WNBA   |   12 | 5-7    |   41.7% |     -30.1% |    -11.75 |     6.21× | 2026-07-25 |
|    5 | f2f960  | MLB        |   24 | 11-13  |   45.8% |     -14.3% |    -11.64 |     2.67× | 2026-07-25 |
|    6 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-07-10 |
|    7 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    8 | c9bba3  | MLB,SOC    |   10 | 6-4    |   60.0% |      -9.9% |     -2.36 |     0.82× | 2026-07-18 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   69 | 36-33  |   52.2% |      -8.3% |    -16.20 |     2.09× | 2026-07-23 |
|   10 | 0f9d74  | MLB,NBA,SOC,UFC |   48 | 23-25  |   47.9% |      -1.3% |     -1.86 |     0.53× | 2026-07-26 |
|   11 | ad88a3  | MLB,SOC    |   17 | 9-8    |   52.9% |      -1.2% |     -0.73 |     0.27× | 2026-07-07 |
|   12 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   31 | 17-14  |   54.8% |      -0.6% |     -0.58 |     1.41× | 2026-07-26 |
|   13 | 4c64aa  | MLB        |   91 | 49-42  |   53.8% |      -0.4% |     -0.74 |     0.83× | 2026-07-25 |
|   14 | 4b912c  | MLB,SOC    |   36 | 19-17  |   52.8% |      +1.4% |     +1.75 |     1.31× | 2026-07-23 |
|   15 | 70135d  | MLB,NBA    |   77 | 42-35  |   54.5% |      +4.7% |     +8.93 |     1.30× | 2026-07-10 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 28, ROI -34.0%), `f2f960` (FOR# 24, ROI -14.3%), `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 69, ROI -8.3%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1065 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   183 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     1 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    46 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   222 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            177 |        40 |   21 |   10 |  106 |                     71 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |            220 |        53 |   37 |    7 |  123 |                     97 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   56 |    518 | 689 | 288-230 |  55.6% |      4.4% |     +63.65 |    +0.12 | 0.504 |        0.2496 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  458 |    +2.3pp |    +13.3pp |          +0.296 |   -0.045 |    +0.0904 | 🟡 mixed |
| v12 − v10          | +  456 |    +7.2pp |    +23.1pp |          +0.436 |   +0.110 |    +0.0308 | 🟢 better |
| v12 − v11          | +  407 |    +0.6pp |     +1.6pp |          +0.062 |   +0.060 |    +0.0146 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 457n 54.3% +2% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 3n 66.7% -13%  | 7n 85.7% +31%  | 518n 55.6% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 108n +2%      | 155n +3%      | 109n +12%     | 72n -4%       | 69n +13%      | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1489 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 752 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 513 / 752 (68%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 513 / 752 (68%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 513 / 752 (68%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 513 / 752 (68%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 513 / 752 (68%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 513 / 752 (68%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 513 / 752 (68%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 752 / 752 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 752 / 752 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 752 / 752 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 752 / 752 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 752 / 752 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 752 / 752 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 745 / 752 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 743 / 752 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 752 / 752 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 751 / 752 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 450 / 752 (60%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 751 / 752 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 450 / 752 (60%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 449 / 752 (60%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 752 / 752 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 752 / 752 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 752 / 752 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 751 / 752 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 752 / 752 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd maxForContrib     | 751 |      |    -0.077 |    -0.080 |      -0.078 |      -0.058 |  0.475 |
|    2 | wd contribMargin     | 752 |      |    -0.048 |    -0.144 |      -0.076 |      -0.117 |  0.455 |
|    3 | wd forAvgSize        | 751 |      |    -0.035 |    +0.024 |      -0.057 |      -0.032 |  0.501 |
|    4 | wd contribFor        | 752 |      |    -0.045 |    -0.080 |      -0.055 |      -0.089 |  0.465 |
|    5 | qMargin              | 513 |  🟢  |    +0.064 |    +0.010 |      +0.045 |      -0.007 |  0.519 |
|    6 | V12 forMean          | 513 |  🟢  |    +0.058 |    +0.015 |      +0.044 |      -0.006 |  0.520 |
|    7 | wd agCount           | 450 |      |    +0.012 |    +0.274 |      +0.043 |      +0.111 |  0.492 |
|    8 | wd forCount          | 751 |      |    -0.027 |    +0.083 |      -0.040 |      -0.031 |  0.467 |
|    9 | hcMargin             | 752 |      |    -0.015 |    +0.212 |      -0.036 |      +0.052 |  0.507 |
|   10 | wd sizeMargin        | 449 |      |    +0.000 |    -0.008 |      -0.034 |      -0.064 |  0.498 |
|   11 | provenFor            | 752 |      |    -0.022 |    +0.047 |      -0.032 |      -0.040 |  0.487 |
|   12 | countMargin          | 513 |      |    +0.009 |    +0.111 |      -0.031 |      -0.014 |  0.485 |
|   13 | provenMargin         | 752 |      |    -0.008 |    +0.067 |      -0.029 |      -0.020 |  0.492 |
|   14 | provenTotal          | 752 |      |    -0.026 |    +0.018 |      -0.028 |      -0.036 |  0.490 |
|   15 | V12 forCount         | 513 |  🟢  |    -0.003 |    +0.174 |      -0.026 |      +0.019 |  0.501 |
|   16 | ags (v11)            | 752 |      |    -0.000 |    -0.011 |      -0.024 |      -0.066 |  0.508 |
|   17 | peakStars            | 752 |      |    -0.004 |    +0.084 |      -0.021 |      -0.006 |  0.492 |
|   18 | wd contribAg         | 752 |      |    -0.004 |    +0.156 |      +0.017 |      +0.057 |  0.502 |
|   19 | wd agAvgSize         | 450 |      |    -0.040 |    +0.012 |      -0.014 |      +0.014 |  0.495 |
|   20 | provenAg             | 752 |      |    -0.024 |    +0.158 |      -0.013 |      +0.057 |  0.492 |
|   21 | wd maxShare          | 752 |      |    +0.006 |    -0.061 |      +0.013 |      +0.012 |  0.508 |
|   22 | lockPinnProb         | 745 |      |    +0.149 |    +0.152 |      +0.010 |      -0.139 |  0.578 |
|   23 | agsV12               | 513 |  🟢  |    +0.021 |    +0.009 |      +0.010 |      +0.012 |  0.525 |
|   24 | V12 agCount          | 513 |  🟢  |    -0.020 |    +0.137 |      +0.005 |      +0.072 |  0.507 |
|   25 | clv                  | 743 |      |    +0.010 |    -0.018 |      -0.003 |      -0.003 |  0.517 |
|   26 | V12 agMean           | 513 |  🟢  |    -0.013 |    +0.325 |      +0.001 |      +0.102 |  0.490 |

> **Top 3 univariate features by PnL correlation:** `wd maxForContrib` (r = -0.078), `wd contribMargin` (r = -0.076), `wd forAvgSize` (r = -0.057).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd maxForContrib` — r(unit-ret) = -0.078, AUC = 0.475. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd maxForContrib` · r(unit-ret) = -0.078 · AUC = 0.475

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 21.300          | 251 | 139-112 |   55.4% |     +1.5% |
| MID (p33–p67)     | 52.400 … 56.900          | 250 | 143-107 |   57.2% |     +2.5% |
| HIGH (> p67)      | 100.000 … 91.500         | 250 | 130-120 |   52.0% |     -1.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.076 · AUC = 0.455

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -28.700        | 251 | 148-103 |   59.0% |     +4.6% |
| MID (p33–p67)     | 57.800 … 56.200          | 250 | 140-110 |   56.0% |     +1.4% |
| HIGH (> p67)      | 174.100 … 182.500        | 251 | 124-127 |   49.4% |     -3.2% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd forAvgSize` · r(unit-ret) = -0.057 · AUC = 0.501

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.675 … 0.465            | 251 | 135-116 |   53.8% |     +1.0% |
| MID (p33–p67)     | 0.777 … 1.370            | 250 | 141-109 |   56.4% |     +2.2% |
| HIGH (> p67)      | 3.837 … 1.435            | 250 | 136-114 |   54.4% |     -0.6% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribFor` · r(unit-ret) = -0.055 · AUC = 0.465

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 47.400          | 251 | 137-114 |   54.6% |     +1.5% |
| MID (p33–p67)     | 89.000 … 95.100          | 250 | 160-90  |   64.0% |     +6.8% |
| HIGH (> p67)      | 212.200 … 196.700        | 251 | 115-136 |   45.8% |     -5.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.045 · AUC = 0.519

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 3.316            | 171 | 97-74   |   56.7% |     +3.7% |
| MID (p33–p67)     | 19.950 … 14.576          | 171 | 91-80   |   53.2% |     -0.1% |
| HIGH (> p67)      | 46.556 … 49.225          | 171 | 97-74   |   56.7% |     +1.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd maxForContrib | wd contribMargin | wd forAvgSize  | wd contribFor  | qMargin        | V12 forMean    | wd agCount     | wd forCount    |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd maxForContrib |  1.000         |         +0.529 |         +0.471 |         +0.673 |         +0.223 |         +0.300 |         +0.345 |         +0.589 |
| wd contribMargin |         +0.529 |  1.000         |         +0.278 |         +0.784 |         +0.066 |         +0.092 |         -0.096 |         +0.745 |
| wd forAvgSize |         +0.471 |         +0.278 |  1.000         |         +0.412 |         +0.255 |         +0.331 |         +0.240 |         +0.379 |
| wd contribFor |         +0.673 |         +0.784 |         +0.412 |  1.000         |         +0.091 |         +0.200 |         +0.509 |         +0.964 |
| qMargin     |         +0.223 |         +0.066 |         +0.255 |         +0.091 |  1.000         |         +0.962 |         +0.071 |         +0.042 |
| V12 forMean |         +0.300 |         +0.092 |         +0.331 |         +0.200 |         +0.962 |  1.000         |         +0.194 |         +0.148 |
| wd agCount  |         +0.345 |         -0.096 |         +0.240 |         +0.509 |         +0.071 |         +0.194 |  1.000         |         +0.503 |
| wd forCount |         +0.589 |         +0.745 |         +0.379 |         +0.964 |         +0.042 |         +0.148 |         +0.503 |  1.000         |

> 🔴 **Strong collinearity detected:** `wd contribFor` and `wd forCount` have r = +0.964. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 332 picks · features = 8 (+ intercept) · multiple R² = **0.0231** · adjusted R² = **-0.0042** · residual sd = 0.948

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.4832 |   0.3564 | -1.36        |        1 |
|    2 | wd forCount          |     |    +0.2374 |   0.2094 | +1.13        |        2 |
|    3 | wd agCount           |     |    +0.1886 |   0.1621 | +1.16        |        3 |
|    4 | wd contribMargin     |     |    +0.1370 |   0.2309 | +0.59        |        4 |
|    5 | V12 forMean          |  🟢 |    +0.0781 |   0.2338 | +0.33        |        5 |
|    6 | wd forAvgSize        |     |    -0.0232 |   0.0621 | -0.37        |        6 |
|    7 | wd maxForContrib     |     |    -0.0162 |   0.0777 | -0.21        |        7 |
|    8 | qMargin              |  🟢 |    -0.0028 |   0.2267 | -0.01        |        8 |
| —    | (intercept)          |     |    +0.0470 |   0.0520 |    +0.90 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.078), `qMargin` (β = -0.003)
- V12 IGNORES: `wd contribFor` (β = -0.483, t = -1.36), `wd forCount` (β = +0.237, t = +1.13), `wd agCount` (β = +0.189, t = +1.16), `wd contribMargin` (β = +0.137, t = +0.59), `wd forAvgSize` (β = -0.023, t = -0.37), `wd maxForContrib` (β = -0.016, t = -0.21)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.529 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.571 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.042.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.2pp.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `qMargin`. They may be contributing noise rather than information.
- Adjusted R² of -0.0042 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*