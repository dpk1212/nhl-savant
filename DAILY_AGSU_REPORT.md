# AGS-Unified — V12 Daily Monitor

**Generated:** Wednesday, August 5, 2026 at 10:56 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (66 days) · **Tape / side-profile era:** 2026-07-15+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (66 days ago), V12 has evaluated **1812** picks, shipped **588** for real money (32.5% ship rate), and muted the other **1224**. On the shipped picks V12 has gone **329-259** (56.0% win), staked **1695.40u**, and returned **+76.72u** at **+4.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             66 |
| Picks V12 has evaluated             |                           1812 |
| Picks SHIPPED (units > 0)           |                            588 |
| Picks MUTED (score ≤ 0, FADE)       |                           1224 |
| Ship rate                           |                          32.5% |
| Live W-L                            |                        329-259 |
| Live Win %                          |                          56.0% |
| Live PnL (units)                    |                         +76.72 |
| Live ROI                            |                          +4.5% |
| Avg PnL / day                       |                         +1.16u |
| Most recent action (2026-08-05)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.5% ROI** across 588 live picks (+76.72u real PnL).
- Mute rule is **saving money** — the 811 muted picks would have lost -65.25u at flat 1u (-8.0% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.16u/day** on average since launch.
- Best sport: **WNBA** — 9 live, 8-1, 40.3% ROI, +14.53u.
- Tape era (2026-07-15+): **93-66** · +5.8% ROI · +30.11u on 159 graded — see § 5.

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

**Full book:** 66d · 588 live · 329-259 · **+76.72u** · +4.5% ROI · +1.16u/day.

_Prior to table (2026-06-01 → 2026-07-15): 430 live · 237-193 · +50.01u · cum through prior = +50.01u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-07-26 |        26 |    4 |    13 | 3-1        |  75.0% |     21.06 |      +8.50 |     40.4% |     +63.65 |
| 2026-07-27 |        17 |    8 |     8 | 4-4        |  50.0% |     27.63 |      +0.28 |      1.0% |     +63.93 |
| 2026-07-28 |        26 |   11 |    11 | 5-6        |  45.5% |     34.82 |      -6.54 |    -18.8% |     +57.39 |
| 2026-07-29 |        18 |    7 |    10 | 6-1        |  85.7% |     17.08 |      +9.32 |     54.6% |     +66.71 |
| 2026-07-30 |        16 |    5 |    10 | 3-2        |  60.0% |     17.50 |      +0.10 |      0.6% |     +66.81 |
| 2026-07-31 |        16 |    0 |    15 | 0-0        |      — |      0.00 |      +0.00 |         — |     +66.81 |
| 2026-08-01 |        39 |   18 |    18 | 13-5       |  72.2% |     69.10 |     +18.21 |     26.4% |     +85.02 |
| 2026-08-02 |        31 |    7 |    20 | 2-5        |  28.6% |     25.63 |     -10.18 |    -39.7% |     +74.84 |
| 2026-08-03 |        21 |    4 |    11 | 4-0        | 100.0% |     13.06 |     +13.45 |    103.0% |     +88.29 |
| 2026-08-04 |        32 |   10 |    16 | 4-6        |  40.0% |     36.81 |     -11.57 |    -31.4% |     +76.72 |
| 2026-08-05 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +76.72 |

> **Trajectory.** Last 3 days (3.8% ROI) ≈ prior book (4.5%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-04**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | — |
| 🟢 2 | DISSENT rescue | D | 12 | 9-3 | +45.2% | +5.58u | +0.46u | +89.3% |
| 🟢 3 | MINI- (gate-cut) | C | 12 | 9-3 | +31.3% | +5.00u | +0.42u | +45.4% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | SHARP EDGE/net BOTH | C | 50 | 22-28 | -12.9% | -19.49u | -0.39u | +7.5% |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 45 | 29-16 | +14.0% | +28.86u | sized UP after path |
| 2 | Tape HOLD (mid) | 101 | 55-46 | +0.4% | +1.02u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 12 | 8-4 | -9.5% | -3.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 503 | 241-262 | -5.8% | -29.09u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 16 | 9-7 | +5.7% | +0.91u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 0 | — | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 67 | 43-24 | 64.2% | 257.1u | +30.26u | +11.8% | +0.45u | 3 | -42.9% | +2.00u | 🔻 cooling |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 63 | 38-25 | 60.3% | 241.5u | +38.49u | +15.9% | +0.61u | 11 | +11.8% | -5.50u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 50 | 22-28 | 44.0% | 150.8u | -19.49u | -12.9% | -0.39u | 12 | +7.5% | -3.49u | 🟠 watch |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 52 | 27-25 | 51.9% | 149.9u | -10.40u | -6.9% | -0.20u | 25 | -2.7% | -4.58u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 52 | 29-23 | 55.8% | 163.1u | -0.28u | -0.2% | -0.01u | 7 | +25.2% | — | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 12 | 9-3 | 75.0% | 16.0u | +5.00u | +31.3% | +0.42u | 1 | +45.4% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 12 | 9-3 | 75.0% | 12.3u | +5.58u | +45.2% | +0.46u | 3 | +89.3% | — | 🟢 room |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 45 | 29-16 | 64.4% | 206.1u | +28.86u | +14.0% | 22 | -2.1% | -8.06u |
| Tape HOLD (mid) | TAPE | staked | 101 | 55-46 | 54.5% | 277.1u | +1.02u | +0.4% | 39 | +12.5% | -3.51u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 12 | 8-4 | 66.7% | 33.5u | -3.17u | -9.5% | 1 | +122.0% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 16 | 9-7 | 56.3% | 16.0u | +0.91u | +5.7% | 4 | -8.6% | -0.09u |
| fadeTop≥60 MUTE | E | CF 1u | 1 | 0-1 | 0.0% | 1.0u | -1.00u | -100.0% | 0 | — | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 503 | 241-262 | 47.9% | 503.0u | -29.09u | -5.8% | 32 | -18.5% | -0.70u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 16 / -3% | 8 / +31% | 4 / -16% |
| RANK | 21 / +15% | 4 / +52% | — |
| SHARP | 9 / -23% | 15 / -6% | 1 / -100% |
| SHARP-LEAN | 41 / -7% | 11 / -6% | — |
| MINI | 6 / +2% | 5 / +35% | 4 / +1% |
| MINI- | — | 1 / +45% | 1 / +0% |
| DISSENT | 8 / +40% | 1 / +91% | 2 / +108% |

### (D) Last graded day movers (2026-08-04)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| HC-1 TOP | 1 | 1-0 | +2.00u | +33.3% |
| SHARP EDGE/net BOTH | 2 | 1-1 | -3.49u | -47.7% |
| SHARP-LEAN EDGE/net ONE | 5 | 2-3 | -4.58u | -25.4% |
| RANK 2-for-0 rescue | 2 | 0-2 | -5.50u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u | 126 | 58-38  |  60.4% |      389.60 |     +18.32 |      4.7% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 255 | 93-86  |  52.0% |      591.15 |      +1.99 |      0.3% |
| STRONG (MINI)             |    3u |  62 | 29-23  |  55.8% |      163.05 |      -0.28 |     -0.2% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  39 | 20-9   |  69.0% |       33.35 |      +8.56 |     25.7% |
| **STAKED TOTAL** |     — | 369 | 210-159 |  56.9% |     1238.65 |     +56.47 |     +4.6% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u |  97 | 43-24  |  64.2% |      257.10 |     +30.26 |     11.8% |
| B · 2-for-0 rescue    | RANK        |    4u |  71 | 38-25  |  60.3% |      241.45 |     +38.49 |     15.9% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 114 | 27-25  |  51.9% |      149.94 |     -10.40 |     -6.9% |
| C · proven-$ consensus | SHARP       |    3u |  56 | 22-28  |  44.0% |      150.76 |     -19.49 |    -12.9% |
| A · mini-HC (gate-pass) | MINI        |    3u |  62 | 29-23  |  55.8% |      163.05 |      -0.28 |     -0.2% |
| C · mini gate-cut     | MINI-       |    1u |  15 | 9-3    |  75.0% |       16.00 |      +5.00 |     31.3% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  18 | 9-3    |  75.0% |       12.35 |      +5.58 |     45.2% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 427 picks tracked at 0u (would-be 200-227, 46.8% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (72-54, +18.32u)  ·  🟠 SHARP PLAY (133-122, +1.99u)  ·  🔴 STRONG (37-25, -0.28u)  ·  🟣 LEAN (22-17, +8.56u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 500 | 495 | 488 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 16 | 9-7 | 56.3% | 0.00u | +0.00u | — |
| HOLD      | 105 | 57-48 | 54.3% | 280.07u | -1.98u | -0.7% |
| BOOST     | 47 | 30-17 | 63.8% | 209.58u | +30.94u | +14.8% |
| FAIL_OPEN | 12 | 8-4 | 66.7% | 33.50u | -3.17u | -9.5% |
| PASS      | 308 | 150-158 | 48.7% | 0.00u | +0.00u | — |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 125 | 62-63 | 49.6% | -6.68u |
| hold (0–2.89) | path u | 234 | 116-118 | 49.6% | +6.20u |
| boost (≥2.89) | ×1.35 | 63 | 38-25 | 60.3% | +25.29u |

_Score coverage: **422/488** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 16 | +8.31u | -8.31u | +6.25u | +14.56u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 47 | +25.34u | +30.94u | +5.60u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-04 | MLB | Seattle Mariners | PATH-D | -1.19 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-04 | MLB | Philadelphia Phillies | HC-1 | 4.45 | BOOST | 5.00u | 6.00u | WIN |
| 2026-08-04 | MLB | Under 9.5 | SHARP~ | -0.60 | MUTE | 1.13u | 0.00u | WIN |
| 2026-08-04 | MLB | Under 8.5 | SHARP | 7.13 | BOOST | 3.75u | 5.06u | LOSS |
| 2026-08-04 | MLB | Under 8.5 | SHARP~ | 3.50 | BOOST | 1.88u | 5.00u | LOSS |
| 2026-08-03 | MLB | Chicago Cubs | SHARP | 5.77 | BOOST | 3.75u | 5.06u | WIN |
| 2026-08-02 | MLB | Seattle Mariners | PATH-D | -1.07 | MUTE | 1.00u | 0.00u | WIN |
| 2026-08-02 | MLB | Over 8.5 | SHARP~ | 3.22 | BOOST | 1.88u | 5.00u | LOSS |
| 2026-08-01 | MLB | Los Angeles Dodgers | 2-for-0 | 6.45 | BOOST | 3.00u | 4.05u | LOSS |
| 2026-08-01 | MLB | Colorado Rockies | SHARP | 7.26 | BOOST | 3.75u | 5.06u | WIN |
| 2026-08-01 | UFC | Alexander Poppeck | SHARP | 7.85 | BOOST | 1.00u | 1.00u | LOSS |
| 2026-08-01 | UFC | Bogdan Grad | SHARP~ | 5.26 | BOOST | 1.88u | 5.00u | WIN |
| 2026-08-01 | UFC | Nina Miloševic | MINI | 8.72 | BOOST | 3.75u | 5.06u | WIN |
| 2026-08-01 | UFC | Mateusz Rebecki | SHARP | 12.46 | BOOST | 3.75u | 5.06u | WIN |
| 2026-08-01 | UFC | Michael Oliveira | MINI | 8.80 | BOOST | 3.75u | 5.06u | WIN |

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 87–46 · 65.4% · +20.4%); **5–10 is the hole** (42–37 · 53.2% · -6.9%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 370 tickets · cov 358/370 (stamp 158 / as-of 200)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 146 | 74–72 | 50.7% | -7.5% |
| 5–10 | 79 | 42–37 | 53.2% | -6.9% |
| ≥10 | 133 | 87–46 | 65.4% | +20.4% |
| All | 370 | 211–159 | 57.0% | +4.6% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.7% (71) | 56.4% (39) | 74.2% (62) |
| B | 53.3% (45) | 66.7% (6) | 83.3% (12) |
| C | 37.5% (24) | 46.9% (32) | 51.8% (56) |

##### Jul 15+ · 159 tickets · cov 153/159 (stamp 153 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 40 | 21–19 | 52.5% | -7.9% |
| 5–10 | 40 | 19–21 | 47.5% | -23.2% |
| ≥10 | 73 | 48–25 | 65.8% | +17.8% |
| All | 159 | 93–66 | 58.5% | +5.8% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 41.7% (12) | 50% (10) | 85.7% (21) |
| B | 52.6% (19) | 0% (1) | 100% (5) |
| C | 33.3% (3) | 48.1% (27) | 52.2% (46) |

##### Yesterday (Aug 4) · 10 tickets · cov 10/10 (stamp 10 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 2 | 0–2 | 0.0% | -100.0% |
| 5–10 | 1 | 1–0 | 100.0% | +69.8% |
| ≥10 | 7 | 3–4 | 42.9% | -26.3% |
| All | 10 | 4–6 | 40.0% | -31.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | 0% (2) | — | — |
| C | — | 100% (1) | 33.3% (6) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 370 tickets · cov 368/370 (stamp 157 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 253 | 138–115 | 54.5% | -0.4% |
| 5–10 | 55 | 34–21 | 61.8% | +19.0% |
| ≥10 | 60 | 38–22 | 63.3% | +12.2% |
| All | 370 | 211–159 | 57.0% | +4.6% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.6% (118) | 56.7% (30) | 79.3% (29) |
| B | 58.7% (46) | 75% (8) | 55.6% (9) |
| C | 45.6% (79) | 62.5% (16) | 42.9% (21) |

##### Jul 15+ · 159 tickets · cov 158/159 (stamp 157 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 103 | 60–43 | 58.3% | +5.1% |
| 5–10 | 32 | 21–11 | 65.6% | +26.8% |
| ≥10 | 23 | 11–12 | 47.8% | -17.8% |
| All | 159 | 93–66 | 58.5% | +5.8% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 75% (24) | 57.1% (14) | 62.5% (8) |
| B | 50% (18) | 100% (4) | 66.7% (3) |
| C | 50% (52) | 61.5% (13) | 33.3% (12) |

##### Yesterday (Aug 4) · 10 tickets · cov 10/10 (stamp 10 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 8 | 3–5 | 37.5% | -27.4% |
| 5–10 | 1 | 1–0 | 100.0% | +69.8% |
| ≥10 | 1 | 0–1 | 0.0% | -100.0% |
| All | 10 | 4–6 | 40.0% | -31.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (1) | — | — |
| B | 0% (2) | — | — |
| C | 40% (5) | 100% (1) | 0% (1) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 370 tickets · cov 358/370 (stamp 152 / as-of 206)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 74 | 30–44 | 40.5% | -27.6% |
| 0–2.89 | 190 | 109–81 | 57.4% | +9.3% |
| ≥2.89 | 94 | 64–30 | 68.1% | +20.5% |
| All | 370 | 211–159 | 57.0% | +4.6% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 63% (81) | 77.1% (48) |
| B | 60% (20) | 56.3% (32) | 72.7% (11) |
| C | 18.2% (11) | 49.3% (69) | 53.1% (32) |

##### Jul 15+ · 159 tickets · cov 153/159 (stamp 152 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 5 | 2–3 | 40.0% | -37.1% |
| 0–2.89 | 99 | 55–44 | 55.6% | +3.4% |
| ≥2.89 | 49 | 31–18 | 63.3% | +12.2% |
| All | 159 | 93–66 | 58.5% | +5.8% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 58.3% (24) | 77.8% (18) |
| B | 50% (4) | 58.8% (17) | 75% (4) |
| C | — | 50% (50) | 50% (26) |

##### Yesterday (Aug 4) · 10 tickets · cov 10/10 (stamp 10 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| 0–2.89 | 7 | 3–4 | 42.9% | -16.9% |
| ≥2.89 | 3 | 1–2 | 33.3% | -50.2% |
| All | 10 | 4–6 | 40.0% | -31.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | — | 0% (2) | — |
| C | — | 60% (5) | 0% (2) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 159 | 93-66 | 58.5% | 519.15u | +30.11u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 159/159 | 1.91 | 1.89 | +0.02 | 2.00 | 1.00 |
| depth   | #A sharps        | 159/159 | 1.35 | 1.30 | +0.05 | 1.00 | 1.00 |
| depth   | #F − #A          | 159/159 | 0.56 | 0.59 | -0.03 | 1.00 | 1.00 |
| depth   | proven F         | 159/159 | 1.27 | 1.29 | -0.02 | 1.00 | 1.00 |
| depth   | proven A         | 159/159 | 0.43 | 0.36 | +0.07 | 0.00 | 0.00 |
| depth   | proven F−A       | 159/159 | 0.84 | 0.92 | -0.09 | 1.00 | 1.00 |
| depth   | v12 F count      | 159/159 | 1.84 | 1.86 | -0.02 | 2.00 | 1.00 |
| depth   | v12 A count      | 159/159 | 1.42 | 1.21 | +0.21 | 1.00 | 1.00 |
| depth   | WA ForN          | 159/159 | 1.45 | 1.70 | -0.25 | 1.00 | 1.00 |
| depth   | WA AgN           | 159/159 | 1.08 | 1.08 | -0.00 | 1.00 | 1.00 |
| depth   | CLV ForN         | 158/159 | 1.86 | 1.88 | -0.02 | 2.00 | 1.00 |
| depth   | CLV AgN          | 158/159 | 1.41 | 1.21 | +0.20 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 159/159 | 0.35 | 0.38 | -0.02 | 0.00 | 0.00 |
| quality | ForWR            | 153/159 | 58.24 | 54.87 | +3.37 | 54.83 | 54.80 |
| quality | AgWR             | 84/159 | 42.61 | 43.03 | -0.42 | 43.08 | 43.35 |
| quality | TopFor WR        | 153/159 | 59.70 | 57.41 | +2.29 | 55.90 | 55.80 |
| quality | TopAg WR         | 84/159 | 46.50 | 46.74 | -0.25 | 48.85 | 47.75 |
| quality | EDGE             | 153/159 | 12.38 | 8.52 | +3.86 | 10.44 | 8.20 |
| quality | ForCLV           | 157/159 | 65.78 | 66.29 | -0.51 | 65.71 | 66.00 |
| quality | AgCLV            | 99/159 | 63.53 | 62.32 | +1.22 | 65.47 | 65.69 |
| quality | netCLV           | 157/159 | 2.77 | 4.11 | -1.34 | 2.78 | 2.93 |
| quality | Tape             | 152/159 | 2.91 | 2.35 | +0.57 | 2.27 | 2.11 |
| quality | V12 score        | 159/159 | 0.86 | 0.90 | -0.04 | 0.96 | 0.97 |
| quality | V12 forMean      | 159/159 | 23.57 | 19.96 | +3.61 | 16.95 | 15.24 |
| quality | V12 agMean       | 159/159 | 1.58 | 0.64 | +0.93 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 153/159 | 0.614 | +0.344 | +0.225 | +3.86 | 🟢 sep OK |
|    2 | CLV AgN          | depth   | 158/159 | 0.560 | +0.309 | +0.066 | +0.20 | 🟡 mild inv |
|    3 | ForWR            | quality | 153/159 | 0.554 | +0.206 | +0.205 | +3.37 | 🟡 mild OK |
|    4 | Tape             | quality | 152/159 | 0.554 | +0.129 | +0.122 | +0.57 | 🟡 mild OK |
|    5 | #F sharps        | depth   | 159/159 | 0.553 | +0.201 | +0.008 | +0.02 | 🟡 mild OK |
|    6 | V12 agMean       | quality | 159/159 | 0.553 | +0.414 | +0.115 | +0.93 | 🟡 mild inv |
|    7 | v12 A count      | depth   | 159/159 | 0.550 | +0.296 | +0.068 | +0.21 | 🟡 mild inv |
|    8 | v12 F count      | depth   | 159/159 | 0.548 | +0.207 | -0.011 | -0.02 | 🟡 mild OK |
|    9 | V12 forMean      | quality | 159/159 | 0.545 | +0.101 | +0.091 | +3.61 | 🟡 mild OK |
|   10 | proven A         | depth   | 159/159 | 0.544 | +0.372 | +0.047 | +0.07 | 🟡 mild inv |
|   11 | #A sharps        | depth   | 159/159 | 0.538 | +0.265 | +0.017 | +0.05 | flat |
|   12 | CLV ForN         | depth   | 158/159 | 0.536 | +0.160 | -0.008 | -0.02 | flat |
|   13 | ForCLV           | quality | 157/159 | 0.466 | -0.148 | -0.035 | -0.51 | flat |
|   14 | TopFor WR        | quality | 153/159 | 0.533 | +0.161 | +0.135 | +2.29 | flat |
|   15 | TopAg WR         | quality | 84/159 | 0.532 | +0.109 | -0.015 | -0.25 | flat |
|   16 | netCLV           | quality | 157/159 | 0.474 | -0.140 | -0.063 | -1.34 | flat |
|   17 | WA ForN          | depth   | 159/159 | 0.477 | +0.166 | -0.120 | -0.25 | flat |
|   18 | proven F−A       | depth   | 159/159 | 0.483 | +0.111 | -0.049 | -0.09 | flat |
|   19 | unopposed (A=0)  | depth   | 159/159 | 0.484 | +0.184 | -0.024 | -0.02 | flat |
|   20 | proven F         | depth   | 159/159 | 0.515 | +0.287 | -0.018 | -0.02 | flat |
|   21 | #F − #A          | depth   | 159/159 | 0.486 | -0.028 | -0.008 | -0.03 | flat |
|   22 | WA AgN           | depth   | 159/159 | 0.514 | +0.275 | -0.000 | -0.00 | flat |
|   23 | AgCLV            | quality | 99/159 | 0.512 | +0.104 | +0.059 | +1.22 | flat |
|   24 | AgWR             | quality | 84/159 | 0.496 | -0.020 | -0.033 | -0.42 | flat |
|   25 | V12 score        | quality | 159/159 | 0.499 | -0.016 | -0.092 | -0.04 | flat |

### (C) Working read

_N=159 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.614 · Δ +3.86 · higher on WINs (cov 153/159)
- **ForWR** — AUC 0.554 · Δ +3.37 · higher on WINs (cov 153/159)
- **Tape** — AUC 0.554 · Δ +0.57 · higher on WINs (cov 152/159)
- **#F sharps** — AUC 0.553 · Δ +0.02 · higher on WINs (cov 159/159)
- **v12 F count** — AUC 0.548 · Δ -0.02 · higher on WINs (cov 159/159)
- **V12 forMean** — AUC 0.545 · Δ +3.61 · higher on WINs (cov 159/159)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 276n · 55.1% · +3.4%   | 63n · 57.1% · +3.3%    | 177n · 51.4% · -2.9%   | 516n · 54.1% · +0.9%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 12n · 83.3% · +30.1%   | —                      | —                      | 12n · 83.3% · +30.1%   |
| WNBA  | 6n · 100.0% · +49.8%   | 3n · 66.7% · +17.2%    | —                      | 9n · 88.9% · +40.3%    |
| **All** | **336n · 57.7% · +8.5%** | **70n · 58.6% · +7.3%** | **182n · 51.6% · -2.3%** | **588n · 56.0% · +4.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **811** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  811 |
| Muted W-L                           |              394-417 |
| Muted Win %                         |                48.6% |
| Counterfactual PnL at flat 1u       |               -65.25 |
| Counterfactual ROI at flat 1u       |                -8.0% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-65.25u** at a flat 1u stake — a counterfactual ROI of **-8.0%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-04 | MLB   | ML     | Los Angeles Dodgers     |  -186 | +0.950 | 2-for-0  |   5/1 |   4/0 |  54.7 |   61.0 |   +4.7 |  0.79 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-04 | MLB   | ML     | Kansas City Royals      |  +131 | +0.198 | SHARP~   |   1/3 |   1/1 |  52.9 |   56.0 |  +11.4 |  1.70 | HOLD     | 2.50u | WIN     |      +3.28 |
| 2026-08-04 | MLB   | ML     | Athletics               |  +122 | +0.979 | SHARP~   |   1/1 |   1/0 |  54.1 |   64.7 |  +12.3 |  2.11 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-08-04 | MLB   | ML     | Milwaukee Brewers       |  -143 | +0.135 | SHARP    |   4/3 |   1/1 |  52.6 |   65.6 |   +7.7 |  2.81 | HOLD     | 2.25u | WIN     |      +1.57 |
| 2026-08-04 | MLB   | ML     | Toronto Blue Jays       |  +128 | +0.903 | 2-for-0  |   1/0 |   1/0 |  52.3 |   65.9 |   +2.3 |  1.05 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-08-04 | MLB   | ML     | Philadelphia Phillies   |  -300 | +0.911 | HC-1     |   5/2 |   2/0 |  50.0 |   62.3 |  +19.6 |  4.45 | BOOST    | 6.00u | WIN     |      +2.00 |
| 2026-08-04 | MLB   | TOTAL  | Under 8.5               |  -109 | +0.949 | SHARP~   |   1/1 |   1/0 |  54.1 |   64.7 |  +12.3 |  2.11 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-04 | MLB   | TOTAL  | Under 8.5               |  -112 | +0.966 | SHARP    |   1/2 |   1/0 |  56.6 |   70.6 |  +25.7 |  7.13 | BOOST    | 5.06u | LOSS    |      -5.06 |
| 2026-08-04 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.957 | SHARP~   |   1/2 |   1/1 |  54.1 |   64.7 |  +11.3 |  1.33 | HOLD     | 4.00u | WIN     |      +3.64 |
| 2026-08-04 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.971 | SHARP~   |   1/1 |   1/0 |  56.6 |   70.6 |  +14.8 |  3.50 | BOOST    | 5.00u | LOSS    |      -5.00 |
| 2026-08-03 | MLB   | ML     | Chicago Cubs            |  +112 | +0.467 | SHARP    |   4/4 |   2/1 |  47.7 |   69.0 |  +12.4 |  5.77 | BOOST    | 5.06u | WIN     |      +5.67 |
| 2026-08-03 | MLB   | ML     | Arizona Diamondbacks    |  -112 | +0.825 | 2-for-0  |   3/0 |   1/0 |  54.4 |   57.2 |   +4.4 |  0.16 | HOLD     | 3.00u | WIN     |      +2.68 |
| 2026-08-03 | MLB   | ML     | Toronto Blue Jays       |  +122 | +0.965 | PATH-D   |   1/4 |   1/2 |     — |      — |      — |     — | FAIL_OPEN | 1.00u | WIN     |      +1.22 |
| 2026-08-03 | MLB   | TOTAL  | Over 7.5                |  -103 | +0.155 | SHARP~   |   2/1 |   2/1 |  54.5 |   64.5 |  +11.3 |  2.06 | HOLD     | 4.00u | WIN     |      +3.88 |
| 2026-08-02 | MLB   | ML     | Colorado Rockies        |  -120 | +0.943 | SHARP~   |   1/1 |   1/0 |  54.4 |   58.6 |  +12.0 |  1.21 | HOLD     | 4.00u | WIN     |      +3.33 |
| 2026-08-02 | MLB   | ML     | Pittsburgh Pirates      |  +122 | +0.847 | 2-for-0  |   4/0 |   1/0 |  51.2 |   66.9 |   +1.2 |  0.97 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-08-02 | MLB   | ML     | San Francisco Giants    |  +110 | +0.981 | MINI     |   1/7 |   1/1 |  55.6 |   66.2 |  +13.8 |  2.68 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-02 | MLB   | TOTAL  | Over 11.5               |  -110 | +0.943 | SHARP~   |   1/1 |   1/1 |  54.4 |   58.6 |   +7.5 |  0.55 | HOLD     | 1.13u | LOSS    |      -1.13 |
| 2026-08-02 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.943 | SHARP~   |   1/1 |   1/0 |  54.4 |   58.6 |  +20.6 |  3.22 | BOOST    | 5.00u | LOSS    |      -5.00 |
| 2026-08-02 | MLB   | TOTAL  | Over 6.5                |  -110 | +0.989 | HC-1     |   1/2 |   1/1 |  55.6 |   66.2 |  +12.6 |  1.77 | HOLD     | 5.00u | LOSS    |      -5.00 |
| 2026-08-02 | MLB   | TOTAL  | Over 8.5                |  +103 | +0.308 | SHARP~   |   1/4 |   1/1 |  54.4 |   58.6 |  +13.5 |  1.13 | HOLD     | 4.00u | WIN     |      +4.12 |
| 2026-08-01 | MLB   | ML     | Los Angeles Dodgers     |  -174 | +0.966 | 2-for-0  |   2/1 |   2/0 |  56.0 |   63.6 |   +6.0 |  6.45 | BOOST    | 4.05u | LOSS    |      -4.05 |
| 2026-08-01 | MLB   | ML     | Chicago White Sox       |  +146 | +0.907 | 2-for-0  |   2/0 |   1/0 |  53.0 |   63.6 |   +3.0 |  0.85 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-08-01 | MLB   | ML     | Colorado Rockies        |  -122 | +0.955 | SHARP    |   1/1 |   1/0 |  55.1 |   56.4 |  +30.1 |  7.26 | BOOST    | 5.06u | WIN     |      +4.15 |
| 2026-08-01 | MLB   | ML     | Chicago Cubs            |  -124 | +0.968 | PATH-D   |   3/3 |   2/0 |  53.9 |   65.7 |   +2.6 |  1.17 | HOLD     | 1.00u | WIN     |      +0.81 |
| 2026-08-01 | MLB   | ML     | Toronto Blue Jays       |  -154 | +0.961 | PATH-D   |   2/3 |   2/1 |  54.8 |   59.7 |   +1.6 |  0.08 | HOLD     | 1.00u | WIN     |      +0.65 |
| 2026-08-01 | UFC   | ML     | Alexander Poppeck       |  +251 | +0.966 | SHARP    |   3/1 |   1/1 |  73.8 |   88.1 |  +23.8 |  7.85 | BOOST    | 1.00u | LOSS    |      -1.00 |
| 2026-08-01 | UFC   | ML     | Bogdan Grad             |  -192 | +0.964 | SHARP~   |   5/3 |   1/1 |  87.5 |   68.9 |  +27.5 |  5.26 | BOOST    | 5.00u | WIN     |      +2.44 |
| 2026-08-01 | UFC   | ML     | Nina Miloševic          |  -535 | +0.986 | MINI     |   2/1 |   1/0 |  87.5 |   75.9 |  +37.5 |  8.72 | BOOST    | 5.06u | WIN     |      +0.95 |
| 2026-08-01 | UFC   | ML     | Mateusz Rebecki         |  -720 | +0.976 | SHARP    |   2/2 |   1/0 |  87.5 |  100.0 |  +37.5 | 12.46 | BOOST    | 5.06u | WIN     |      +0.70 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.515 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.067 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.004 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.008 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   -0.010 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟠 **Random** — score is not predicting outcomes; PnL is variance, not edge

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  583 |    -0.1204 |    +0.1409 | 0.0007 |  -0.027 |   0.945 | negative (higher score ⇒ WORSE outcome)                  |
| won (binary)        |  583 |    -0.0221 |    +0.5784 | 0.0001 |  -0.010 |   0.496 | negative (higher score ⇒ WORSE outcome)                  |
| per-pick PnL (u)    |  583 |    -0.7524 |    +0.7811 | 0.0030 |  -0.054 |   2.963 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 583 |          +0.060 |           -0.002 |                   +0.046 |                   -0.011 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 583 |          +0.002 |           +0.330 |                   +0.019 |                   +0.100 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 583 |          +0.006 |           +0.159 |                   -0.017 |                   +0.010 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 583 |          -0.001 |           +0.172 |                   +0.024 |                   +0.086 | count of contributing AGAINST-side wallets                     |
| provenFor         | 583 |          +0.010 |           +0.147 |                   -0.001 |                   +0.048 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 583 |          +0.001 |           +0.110 |                   +0.019 |                   +0.047 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.160         | 198 | 111-87  |   56.1% |     +2.6% |
| MID (p33–p67)     | 19.950 … 16.800        | 191 | 104-87  |   54.5% |     +0.3% |
| HIGH (> p67)      | 48.906 … 47.347        | 194 | 111-83  |   57.2% |     +1.2% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       583 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8697 | average score across live picks                                 |
| SD                |    0.2144 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.332 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.578 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.530 / +0.963 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  512 | 277-235 |   54.1% |     +0.8% |  0.492 |        -0.063 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   34 | 23-11  |   67.6% |    +22.6% |  0.522 |        -0.183 | noise                                     |
| UFC   |   12 | 10-2   |   83.3% |    +30.1% |  0.850 |        +0.343 | strong (N<20)                             |
| WNBA  |    9 | 8-1    |   88.9% |    +40.3% |  0.625 |        +0.800 | strong (N<20)                             |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "08-01", "08-02", "08-03", "08-04"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.535, 0.567, 0.573, 0.532, 0.52, 0.514, 0.54, 0.502, 0.487, 0.448, 0.514, 0.483, 0.47, 0.416]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "08-01", "08-02", "08-03", "08-04"]
    y-axis "edge (pp)" -1 --> 9
    line [1.5, 4.1, 5, 5.1, 5.7, 7.2, 6.8, 3.2, 3.2, 3.1, 7, 4.4, 6.8, 4.5]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-07-21 |    7 |   56 | 31-25  |   55.4% |     -1.2% |  0.535 |      +1.5pp |
| 2026-07-22 |    7 |   67 | 39-28  |   58.2% |     +5.0% |  0.567 |      +4.1pp |
| 2026-07-23 |    7 |   71 | 42-29  |   59.2% |     +7.1% |  0.573 |      +5.0pp |
| 2026-07-24 |    7 |   67 | 40-27  |   59.7% |     +9.1% |  0.532 |      +5.1pp |
| 2026-07-25 |    7 |   59 | 35-24  |   59.3% |     +6.4% |  0.520 |      +5.7pp |
| 2026-07-26 |    7 |   50 | 31-19  |   62.0% |    +17.0% |  0.514 |      +7.2pp |
| 2026-07-27 |    7 |   51 | 31-20  |   60.8% |    +13.8% |  0.540 |      +6.8pp |
| 2026-07-28 |    7 |   52 | 30-22  |   57.7% |     +7.4% |  0.502 |      +3.2pp |
| 2026-07-29 |    7 |   47 | 27-20  |   57.4% |     +4.4% |  0.487 |      +3.2pp |
| 2026-07-30 |    7 |   47 | 27-20  |   57.4% |     +4.7% |  0.448 |      +3.1pp |
| 2026-08-01 |    7 |   59 | 37-22  |   62.7% |    +13.5% |  0.514 |      +7.0pp |
| 2026-08-02 |    7 |   60 | 36-24  |   60.0% |     +9.3% |  0.483 |      +4.4pp |
| 2026-08-03 |    7 |   60 | 37-23  |   61.7% |    +12.0% |  0.470 |      +6.8pp |
| 2026-08-04 |    7 |   62 | 37-25  |   59.7% |     +6.0% |  0.416 |      +4.5pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.505 avg in first half → 0.538 avg in second half · Δ = +0.033)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.5% | [-3.4%, +12.0%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          56.0% | [52.0%, 59.9%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.515 | [0.462, 0.562]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             70 | [23, 115]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       588 |
| Unique wallets ever on a FOR side            |                                                       160 |
| Avg FOR-side wallets per pick                |                                                      2.76 |
| Top-5 wallets' share of all FOR appearances  |                                                     27.5% |
| Top-10 wallets' share of all FOR appearances |                                                     46.1% |
| Top-20 wallets' share of all FOR appearances |                                                     64.3% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    2 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    3 | 4c64aa  | MLB        |   92 |   12 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.3% |     330 | 2026-08-03 |
|    4 | 0cd77e  | MLB,SOC,UFC |   81 |    9 | 49-32  |   60.5% |    +13.1% |    +36.44 |     1.41× | CONFIRMED   |     +3.9% |     197 | 2026-08-04 |
|    5 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   71 |   38 | 39-32  |   54.9% |    +16.8% |    +35.45 |     1.31× | CONFIRMED   |     +9.1% |     460 | 2026-08-03 |
|    7 | 2f2a9e  | MLB,SOC,WNBA |   69 |   29 | 36-33  |   52.2% |     -8.3% |    -16.20 |     2.09× | CONFIRMED   |     -8.8% |     244 | 2026-08-01 |
|    8 | 0f9d74  | MLB,NBA,SOC,UFC |   59 |   37 | 31-28  |   52.5% |     +8.1% |    +13.68 |     0.50× | CONFIRMED   |    +17.0% |     259 | 2026-08-04 |
|    9 | eeabaf  | MLB,NBA,SOC |   57 |   10 | 31-26  |   54.4% |     +5.4% |     +9.02 |     1.29× | CONFIRMED   |    +13.0% |     206 | 2026-08-04 |
|   10 | 7923c4  | MLB,NBA,UFC |   47 |   13 | 29-18  |   61.7% |    +25.7% |    +29.06 |     0.77× | CONFIRMED   |     +9.5% |     197 | 2026-08-04 |
|   11 | 4b912c  | MLB,SOC    |   36 |   15 | 19-17  |   52.8% |     +1.4% |     +1.75 |     1.31× | CONFIRMED   |     -8.8% |     124 | 2026-07-23 |
|   12 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   13 | 7da3d5  | MLB,SOC,UFC,WNBA |   31 |   49 | 13-18  |   41.9% |    -21.1% |    -20.59 |     4.77× | CONFIRMED   |    -11.9% |     197 | 2026-08-04 |
|   14 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   15 | 705ba1  | MLB        |   30 |    6 | 15-15  |   50.0% |     -4.1% |     -3.80 |     1.22× | FLAT        |     +3.9% |     109 | 2026-08-04 |
|   16 | a82a75  | MLB,SOC,UFC |   29 |   21 | 15-14  |   51.7% |     +3.4% |     +3.40 |     0.95× | CONFIRMED   |    -16.8% |     109 | 2026-08-04 |
|   17 | bc35e3  | MLB,SOC,UFC,WNBA |   28 |   17 | 15-13  |   53.6% |     +0.3% |     +0.31 |     1.26× | CONFIRMED   |     -1.4% |     135 | 2026-08-04 |
|   18 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   19 | f2f960  | MLB        |   26 |   16 | 12-14  |   46.2% |    -15.0% |    -13.64 |     2.90× | —           |     -6.2% |      91 | 2026-08-04 |
|   20 | 491f30  | MLB,SOC    |   25 |    4 | 17-8   |   68.0% |    +43.8% |    +35.89 |     0.95× | CONFIRMED   |     -8.8% |      64 | 2026-07-01 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-07-21 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | b839b3  | MLB,NBA,SOC,UFC |   22 | 16-6   |   72.7% |     +31.6% |    +23.59 |     1.38× | 2026-08-04 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    6 | f2d227  | MLB,NBA    |   10 | 7-3    |   70.0% |     +27.3% |     +6.45 |     0.56× | 2026-07-20 |
|    7 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    8 | 7923c4  | MLB,NBA,UFC |   47 | 29-18  |   61.7% |     +25.7% |    +29.06 |     0.77× | 2026-08-04 |
|    9 | f9e3d0  | MLB,NBA    |   10 | 5-5    |   50.0% |     +23.2% |     +7.23 |     1.43× | 2026-08-01 |
|   10 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-08-01 |
|   11 | cd2f63  | MLB,NBA,SOC,WNBA |   71 | 39-32  |   54.9% |     +16.8% |    +35.45 |     1.31× | 2026-08-03 |
|   12 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|   13 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |
|   14 | 0cd77e  | MLB,SOC,UFC |   81 | 49-32  |   60.5% |     +13.1% |    +36.44 |     1.41× | 2026-08-04 |
|   15 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | c9bba3  | MLB,SOC    |   12 | 6-6    |   50.0% |     -30.4% |     -9.36 |     0.78× | 2026-08-04 |
|    3 | 8ec926  | MLB,WNBA   |   12 | 5-7    |   41.7% |     -30.1% |    -11.75 |     6.21× | 2026-08-03 |
|    4 | 7da3d5  | MLB,SOC,UFC,WNBA |   31 | 13-18  |   41.9% |     -21.1% |    -20.59 |     4.77× | 2026-08-04 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-08-02 |
|    7 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    8 | 2f2a9e  | MLB,SOC,WNBA |   69 | 36-33  |   52.2% |      -8.3% |    -16.20 |     2.09× | 2026-08-01 |
|    9 | 705ba1  | MLB        |   30 | 15-15  |   50.0% |      -4.1% |     -3.80 |     1.22× | 2026-08-04 |
|   10 | ad88a3  | MLB,SOC    |   19 | 10-9   |   52.6% |      -1.5% |     -1.05 |     0.27× | 2026-08-04 |
|   11 | bc35e3  | MLB,SOC,UFC,WNBA |   28 | 15-13  |   53.6% |      +0.3% |     +0.31 |     1.26× | 2026-08-04 |
|   12 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 | 19-15  |   55.9% |      +0.8% |     +0.85 |     1.36× | 2026-07-30 |
|   13 | 4c64aa  | MLB        |   92 | 50-42  |   54.3% |      +1.1% |     +1.94 |     0.84× | 2026-08-03 |
|   14 | 4b912c  | MLB,SOC    |   36 | 19-17  |   52.8% |      +1.4% |     +1.75 |     1.31× | 2026-07-23 |
|   15 | a82a75  | MLB,SOC,UFC |   29 | 15-14  |   51.7% |      +3.4% |     +3.40 |     0.95× | 2026-08-04 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 31, ROI -21.1%), `f2f960` (FOR# 26, ROI -15.0%), `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 69, ROI -8.3%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1215 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   232 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     1 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    49 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   260 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            188 |        42 |   19 |   11 |  116 |                     72 |
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
| v12     | 06-01 → present      |   66 |    588 | 811 | 329-259 |  56.0% |      4.5% |     +76.72 |    +0.13 | 0.501 |        0.2496 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  528 |    +2.6pp |    +13.5pp |          +0.303 |   -0.048 |    +0.0904 | 🟡 mixed |
| v12 − v10          | +  526 |    +7.6pp |    +23.3pp |          +0.444 |   +0.107 |    +0.0308 | 🟢 better |
| v12 − v11          | +  477 |    +1.0pp |     +1.7pp |          +0.070 |   +0.057 |    +0.0146 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 516n 54.1% +1% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 12n 83.3% +30% | 9n 88.9% +40%  | 588n 56.0% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 121n +3%      | 177n -0%      | 131n +10%     | 77n -4%       | 77n +23%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1681 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 822 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 583 / 822 (71%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 583 / 822 (71%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 583 / 822 (71%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 583 / 822 (71%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 583 / 822 (71%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 583 / 822 (71%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 583 / 822 (71%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 822 / 822 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 822 / 822 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 822 / 822 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 822 / 822 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 822 / 822 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 822 / 822 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 815 / 822 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 813 / 822 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 822 / 822 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 821 / 822 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 501 / 822 (61%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 821 / 822 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 501 / 822 (61%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 500 / 822 (61%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 822 / 822 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 822 / 822 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 822 / 822 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 821 / 822 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 822 / 822 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 822 |      |    -0.036 |    -0.160 |      -0.063 |      -0.122 |  0.465 |
|    2 | wd maxForContrib     | 821 |      |    -0.054 |    -0.071 |      -0.055 |      -0.049 |  0.488 |
|    3 | wd agCount           | 501 |      |    +0.024 |    +0.289 |      +0.054 |      +0.116 |  0.518 |
|    4 | wd forAvgSize        | 821 |      |    -0.027 |    +0.016 |      -0.047 |      -0.025 |  0.508 |
|    5 | V12 forMean          | 583 |  🟢  |    +0.060 |    -0.002 |      +0.046 |      -0.011 |  0.518 |
|    6 | wd contribFor        | 822 |      |    -0.035 |    -0.083 |      -0.044 |      -0.084 |  0.479 |
|    7 | qMargin              | 583 |  🟢  |    +0.062 |    -0.016 |      +0.043 |      -0.022 |  0.512 |
|    8 | hcMargin             | 822 |      |    -0.017 |    +0.194 |      -0.035 |      +0.042 |  0.502 |
|    9 | peakStars            | 822 |      |    -0.014 |    +0.080 |      -0.035 |      -0.017 |  0.488 |
|   10 | wd forCount          | 821 |      |    -0.018 |    +0.073 |      -0.033 |      -0.041 |  0.480 |
|   11 | countMargin          | 583 |      |    +0.007 |    +0.062 |      -0.033 |      -0.046 |  0.485 |
|   12 | provenMargin         | 822 |      |    -0.013 |    +0.037 |      -0.033 |      -0.035 |  0.489 |
|   13 | provenFor            | 822 |      |    -0.024 |    +0.020 |      -0.030 |      -0.043 |  0.487 |
|   14 | wd sizeMargin        | 500 |      |    +0.006 |    -0.040 |      -0.030 |      -0.073 |  0.504 |
|   15 | agsV12               | 583 |  🟢  |    -0.010 |    -0.004 |      -0.027 |      -0.008 |  0.515 |
|   16 | ags (v11)            | 822 |      |    -0.002 |    -0.031 |      -0.025 |      -0.070 |  0.506 |
|   17 | lockPinnProb         | 815 |      |    +0.171 |    +0.172 |      +0.025 |      -0.133 |  0.592 |
|   18 | V12 agCount          | 583 |  🟢  |    -0.001 |    +0.172 |      +0.024 |      +0.086 |  0.519 |
|   19 | provenTotal          | 822 |      |    -0.025 |    -0.008 |      -0.023 |      -0.032 |  0.493 |
|   20 | V12 agMean           | 583 |  🟢  |    +0.002 |    +0.330 |      +0.019 |      +0.100 |  0.501 |
|   21 | V12 forCount         | 583 |  🟢  |    +0.006 |    +0.159 |      -0.017 |      +0.010 |  0.514 |
|   22 | wd contribAg         | 822 |      |    -0.003 |    +0.173 |      +0.017 |      +0.063 |  0.500 |
|   23 | wd maxShare          | 822 |      |    +0.006 |    -0.072 |      +0.012 |      +0.005 |  0.508 |
|   24 | clv                  | 813 |      |    +0.007 |    +0.000 |      -0.009 |      -0.011 |  0.510 |
|   25 | provenAg             | 822 |      |    -0.019 |    +0.157 |      -0.005 |      +0.060 |  0.498 |
|   26 | wd agAvgSize         | 501 |      |    -0.033 |    +0.048 |      -0.003 |      +0.038 |  0.496 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.063), `wd maxForContrib` (r = -0.055), `wd agCount` (r = +0.054).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.063, AUC = 0.465. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.063 · AUC = 0.465

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -51.100        | 274 | 161-113 |   58.8% |     +3.8% |
| MID (p33–p67)     | 57.800 … 30.900          | 274 | 152-122 |   55.5% |     +0.9% |
| HIGH (> p67)      | 174.100 … 231.200        | 274 | 140-134 |   51.1% |     -2.2% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd maxForContrib` · r(unit-ret) = -0.055 · AUC = 0.488

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 33.600          | 277 | 153-124 |   55.2% |     +1.1% |
| MID (p33–p67)     | 52.400 … 52.500          | 271 | 153-118 |   56.5% |     +1.8% |
| HIGH (> p67)      | 100.000 … 104.400        | 273 | 147-126 |   53.8% |     -0.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd agCount` · r(unit-ret) = +0.054 · AUC = 0.518

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 251 | 133-118 |   53.0% |     -0.9% |
| MID (p33–p67)     | 2.000 … 2.000            | 124 | 69-55   |   55.6% |     +0.7% |
| HIGH (> p67)      | 3.000 … 3.000            | 126 | 73-53   |   57.9% |     +3.1% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd forAvgSize` · r(unit-ret) = -0.047 · AUC = 0.508

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.675 … 0.600            | 275 | 146-129 |   53.1% |     +0.1% |
| MID (p33–p67)     | 0.777 … 0.840            | 272 | 158-114 |   58.1% |     +3.1% |
| HIGH (> p67)      | 3.837 … 3.242            | 274 | 149-125 |   54.4% |     -0.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.046 · AUC = 0.518

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.160           | 198 | 111-87  |   56.1% |     +2.6% |
| MID (p33–p67)     | 19.950 … 16.800          | 191 | 104-87  |   54.5% |     +0.3% |
| HIGH (> p67)      | 48.906 … 47.347          | 194 | 111-83  |   57.2% |     +1.2% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd maxForContrib | wd agCount     | wd forAvgSize  | V12 forMean    | wd contribFor  | qMargin        | hcMargin       |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         +0.519 |         -0.101 |         +0.272 |         +0.084 |         +0.782 |         +0.057 |         +0.656 |
| wd maxForContrib |         +0.519 |  1.000         |         +0.348 |         +0.492 |         +0.267 |         +0.665 |         +0.194 |         +0.461 |
| wd agCount  |         -0.101 |         +0.348 |  1.000         |         +0.256 |         +0.200 |         +0.503 |         +0.080 |         +0.181 |
| wd forAvgSize |         +0.272 |         +0.492 |         +0.256 |  1.000         |         +0.332 |         +0.415 |         +0.260 |         +0.439 |
| V12 forMean |         +0.084 |         +0.267 |         +0.200 |         +0.332 |  1.000         |         +0.196 |         +0.963 |         +0.295 |
| wd contribFor |         +0.782 |         +0.665 |         +0.503 |         +0.415 |         +0.196 |  1.000         |         +0.089 |         +0.682 |
| qMargin     |         +0.057 |         +0.194 |         +0.080 |         +0.260 |         +0.963 |         +0.089 |  1.000         |         +0.232 |
| hcMargin    |         +0.656 |         +0.461 |         +0.181 |         +0.439 |         +0.295 |         +0.682 |         +0.232 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.963. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 383 picks · features = 8 (+ intercept) · multiple R² = **0.0196** · adjusted R² = **-0.0040** · residual sd = 0.942

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.3688 |   0.2377 | -1.55 (~sig) |        1 |
|    2 | wd agCount           |     |    +0.2521 |   0.1418 | +1.78 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.2355 |   0.2023 | +1.16        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.1581 |   0.2154 | +0.73        |        4 |
|    5 | qMargin              |  🟢 |    -0.1020 |   0.2087 | -0.49        |        5 |
|    6 | wd forAvgSize        |     |    -0.0180 |   0.0598 | -0.30        |        6 |
|    7 | wd maxForContrib     |     |    +0.0120 |   0.0691 | +0.17        |        7 |
|    8 | hcMargin             |     |    -0.0047 |   0.0731 | -0.06        |        8 |
| —    | (intercept)          |     |    +0.0403 |   0.0482 |    +0.84 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.158), `qMargin` (β = -0.102)
- V12 IGNORES: `wd contribFor` (β = -0.369, t = -1.55), `wd agCount` (β = +0.252, t = +1.78), `wd contribMargin` (β = +0.235, t = +1.16), `wd forAvgSize` (β = -0.018, t = -0.30), `wd maxForContrib` (β = +0.012, t = +0.17), `hcMargin` (β = -0.005, t = -0.06)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.516 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.563 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.047.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.7pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd contribFor` (β = -0.369, t = -1.55), `wd agCount` (β = +0.252, t = +1.78). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0040 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*