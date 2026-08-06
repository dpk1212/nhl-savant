# AGS-Unified — V12 Daily Monitor

**Generated:** Thursday, August 6, 2026 at 5:44 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (67 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (67 days ago), V12 has evaluated **1836** picks, shipped **592** for real money (32.2% ship rate), and muted the other **1244**. On the shipped picks V12 has gone **332-260** (56.1% win), staked **1713.20u**, and returned **+83.67u** at **+4.9% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             67 |
| Picks V12 has evaluated             |                           1836 |
| Picks SHIPPED (units > 0)           |                            592 |
| Picks MUTED (score ≤ 0, FADE)       |                           1244 |
| Ship rate                           |                          32.2% |
| Live W-L                            |                        332-260 |
| Live Win %                          |                          56.1% |
| Live PnL (units)                    |                         +83.67 |
| Live ROI                            |                          +4.9% |
| Avg PnL / day                       |                         +1.25u |
| Most recent action (2026-08-06)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.9% ROI** across 592 live picks (+83.67u real PnL).
- Mute rule is **saving money** — the 829 muted picks would have lost -63.93u at flat 1u (-7.7% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.25u/day** on average since launch.
- Best sport: **WNBA** — 9 live, 8-1, 40.3% ROI, +14.53u.
- Tape era (2026-07-15+): **96-67** · +6.9% ROI · +37.06u on 163 graded — see § 5.

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
| qConv | From **2026-08-03**: mute qConv &lt; expanding Q1 thr (Path A/B/C) | → 0u |

**Stamps we keep for analysis (every shipped side):** depth (`#F/#A`, proven, V12 counts) + quality (ForWR, ForCLV, EDGE, Tape, qConv). Unopposed sides still get FOR numbers (EDGE uses AG prior 50). Compare WIN vs LOSS in § 5 / § 5q.

Odds cap clamps long dogs only (+121 / +151 / +200 → max 2.5 / 1.5 / 1.0u). **+120 or shorter is uncapped by odds** (still ≤6u global). Legacy ELITE→WEAK score-ladder units are **not** the live sizer — ignore them if you see them in old notes.

## § 3 — Daily Scoreboard

**Full book:** 67d · 592 live · 332-260 · **+83.67u** · +4.9% ROI · +1.25u/day.

_Prior to table (2026-06-01 → 2026-07-16): 431 live · 237-194 · +44.61u · cum through prior = +44.61u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-05 |        24 |    4 |    18 | 3-1        |  75.0% |     17.80 |      +6.95 |     39.0% |     +83.67 |
| 2026-08-06 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +83.67 |

> **Trajectory.** 🟡 Last 3 days (-8.5% ROI) **-13.8pp** vs prior (5.3%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-05**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | — |
| 🟢 2 | DISSENT rescue | D | 12 | 9-3 | +45.2% | +5.58u | +0.46u | +89.3% |
| 🟢 3 | MINI- (gate-cut) | C | 12 | 9-3 | +31.3% | +5.00u | +0.42u | +45.4% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | SHARP EDGE/net BOTH | C | 51 | 23-28 | -9.7% | -15.10u | -0.30u | +28.0% |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 47 | 31-16 | +17.1% | +37.16u | sized UP after path |
| 2 | Tape HOLD (mid) | 103 | 56-47 | -0.1% | -0.33u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 12 | 8-4 | -9.5% | -3.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 508 | 245-263 | -5.1% | -25.72u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 18 | 10-8 | +4.6% | +0.82u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 0 | — | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 67 | 43-24 | 64.2% | 257.1u | +30.26u | +11.8% | +0.45u | 2 | -27.3% | — | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 64 | 39-25 | 60.9% | 244.5u | +41.14u | +16.8% | +0.64u | 11 | +13.3% | +2.65u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 51 | 23-28 | 45.1% | 156.2u | -15.10u | -9.7% | -0.30u | 9 | +28.0% | +4.39u | 🟠 watch |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 54 | 28-26 | 51.9% | 159.3u | -10.49u | -6.6% | -0.19u | 22 | +0.6% | -0.09u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 52 | 29-23 | 55.8% | 163.1u | -0.28u | -0.2% | -0.01u | 7 | +25.2% | — | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 12 | 9-3 | 75.0% | 16.0u | +5.00u | +31.3% | +0.42u | 1 | +45.4% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 12 | 9-3 | 75.0% | 12.3u | +5.58u | +45.2% | +0.46u | 3 | +89.3% | — | 🟢 room |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 47 | 31-16 | 66.0% | 216.9u | +37.16u | +17.1% | 22 | +15.6% | +8.30u |
| Tape HOLD (mid) | TAPE | staked | 103 | 56-47 | 54.4% | 284.1u | -0.33u | -0.1% | 32 | +9.6% | -1.35u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 12 | 8-4 | 66.7% | 33.5u | -3.17u | -9.5% | 1 | +122.0% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 18 | 10-8 | 55.6% | 18.0u | +0.82u | +4.6% | 5 | +11.3% | -0.09u |
| fadeTop≥60 MUTE | E | CF 1u | 1 | 0-1 | 0.0% | 1.0u | -1.00u | -100.0% | 0 | — | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 508 | 245-263 | 48.2% | 508.0u | -25.72u | -5.1% | 33 | -4.8% | +3.37u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 16 / -3% | 8 / +31% | 4 / -16% |
| RANK | 22 / +18% | 4 / +52% | — |
| SHARP | 9 / -23% | 16 / +1% | 1 / -100% |
| SHARP-LEAN | 42 / -11% | 12 / +1% | — |
| MINI | 6 / +2% | 5 / +35% | 4 / +1% |
| MINI- | — | 1 / +45% | 1 / +0% |
| DISSENT | 8 / +40% | 1 / +91% | 2 / +108% |

### (D) Last graded day movers (2026-08-05)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP EDGE/net BOTH | 1 | 1-0 | +4.39u | +81.3% |
| RANK 2-for-0 rescue | 1 | 1-0 | +2.65u | +88.3% |
| SHARP-LEAN EDGE/net ONE | 2 | 1-1 | -0.09u | -1.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u | 126 | 58-38  |  60.4% |      389.60 |     +18.32 |      4.7% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 264 | 96-87  |  52.5% |      608.95 |      +8.94 |      1.5% |
| STRONG (MINI)             |    3u |  62 | 29-23  |  55.8% |      163.05 |      -0.28 |     -0.2% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  41 | 20-9   |  69.0% |       33.35 |      +8.56 |     25.7% |
| **STAKED TOTAL** |     — | 373 | 213-160 |  57.1% |     1256.45 |     +63.42 |     +5.0% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u |  97 | 43-24  |  64.2% |      257.10 |     +30.26 |     11.8% |
| B · 2-for-0 rescue    | RANK        |    4u |  73 | 39-25  |  60.9% |      244.45 |     +41.14 |     16.8% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 119 | 28-26  |  51.9% |      159.34 |     -10.49 |     -6.6% |
| C · proven-$ consensus | SHARP       |    3u |  58 | 23-28  |  45.1% |      156.16 |     -15.10 |     -9.7% |
| A · mini-HC (gate-pass) | MINI        |    3u |  62 | 29-23  |  55.8% |      163.05 |      -0.28 |     -0.2% |
| C · mini gate-cut     | MINI-       |    1u |  15 | 9-3    |  75.0% |       16.00 |      +5.00 |     31.3% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  20 | 9-3    |  75.0% |       12.35 |      +5.58 |     45.2% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 435 picks tracked at 0u (would-be 203-232, 46.7% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (72-54, +18.32u)  ·  🟠 SHARP PLAY (139-125, +8.94u)  ·  🔴 STRONG (37-25, -0.28u)  ·  🟣 LEAN (23-18, +8.56u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 524 | 519 | 512 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 18 | 10-8 | 55.6% | 0.00u | +0.00u | — |
| HOLD      | 111 | 60-51 | 54.1% | 287.07u | -3.33u | -1.2% |
| BOOST     | 50 | 33-17 | 66.0% | 220.38u | +39.24u | +17.8% |
| FAIL_OPEN | 12 | 8-4 | 66.7% | 33.50u | -3.17u | -9.5% |
| PASS      | 321 | 157-164 | 48.9% | 0.00u | +0.00u | — |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 131 | 66-65 | 50.4% | -6.68u |
| hold (0–2.89) | path u | 246 | 121-125 | 49.2% | +4.85u |
| boost (≥2.89) | ×1.35 | 66 | 41-25 | 62.1% | +33.59u |

_Score coverage: **443/512** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 18 | +8.22u | -8.22u | +7.25u | +15.47u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 49 | +31.49u | +39.24u | +7.75u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-05 | MLB | Boston Red Sox | SHARP~ | 3.77 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-05 | MLB | Los Angeles Dodgers | PATH-D | -0.14 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-05 | MLB | Atlanta Braves | SHARP | 4.75 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-05 | MLB | Under 7.5 | SHARP | 4.21 | BOOST | 4.00u | 0.00u | WIN |
| 2026-08-05 | MLB | Under 11.5 | PATH-D | -3.13 | MUTE | 1.00u | 0.00u | WIN |
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

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path A/B/C when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-2.13** · nPriors=362 · source=expanding_q1 · asOf=2026-08-06 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Path A/B/C graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 78 | 29 | 28 | 9 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| HOLD      | 11 | 6-5 | 54.5% | 17.80u | +6.95u | +39.0% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

_Need ≥10 Path A/B/C graded rows with `v8_qConv` (have 9)._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 0 | 0-0 | +0.00u | +0.00u | +0.00u | +0.00u |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 4 | 3-1 | 75.0% | 17.8u | +6.95u | +39.0% |
| Muted (Q1 → 0u) | 0 | 0-0 | — | 0.0u | +0.00u | — |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 89–47 · 65.4% · +20.6%); **5–10 is the hole** (42–37 · 53.2% · -6.9%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 374 tickets · cov 362/374 (stamp 162 / as-of 200)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 147 | 75–72 | 51.0% | -6.9% |
| 5–10 | 79 | 42–37 | 53.2% | -6.9% |
| ≥10 | 136 | 89–47 | 65.4% | +20.6% |
| All | 374 | 214–160 | 57.2% | +5.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.7% (71) | 56.4% (39) | 74.2% (62) |
| B | 54.3% (46) | 66.7% (6) | 83.3% (12) |
| C | 37.5% (24) | 46.9% (32) | 52.5% (59) |

##### Jul 15+ · 163 tickets · cov 157/163 (stamp 157 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 41 | 22–19 | 53.7% | -5.3% |
| 5–10 | 40 | 19–21 | 47.5% | -23.2% |
| ≥10 | 76 | 50–26 | 65.8% | +18.3% |
| All | 163 | 96–67 | 58.9% | +6.9% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 41.7% (12) | 50% (10) | 85.7% (21) |
| B | 55% (20) | 0% (1) | 100% (5) |
| C | 33.3% (3) | 48.1% (27) | 53.1% (49) |

##### Yesterday (Aug 5) · 4 tickets · cov 4/4 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 1 | 1–0 | 100.0% | +88.3% |
| ≥10 | 3 | 2–1 | 66.7% | +29.1% |
| All | 4 | 3–1 | 75.0% | +39.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| B | 100% (1) | — | — |
| C | — | — | 66.7% (3) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 374 tickets · cov 372/374 (stamp 161 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 256 | 140–116 | 54.7% | -0.1% |
| 5–10 | 56 | 35–21 | 62.5% | +20.8% |
| ≥10 | 60 | 38–22 | 63.3% | +12.2% |
| All | 374 | 214–160 | 57.2% | +5.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.6% (118) | 56.7% (30) | 79.3% (29) |
| B | 59.6% (47) | 75% (8) | 55.6% (9) |
| C | 45.7% (81) | 64.7% (17) | 42.9% (21) |

##### Jul 15+ · 163 tickets · cov 162/163 (stamp 161 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 106 | 62–44 | 58.5% | +5.7% |
| 5–10 | 33 | 22–11 | 66.7% | +29.4% |
| ≥10 | 23 | 11–12 | 47.8% | -17.8% |
| All | 163 | 96–67 | 58.9% | +6.9% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 75% (24) | 57.1% (14) | 62.5% (8) |
| B | 52.6% (19) | 100% (4) | 66.7% (3) |
| C | 50% (54) | 64.3% (14) | 33.3% (12) |

##### Yesterday (Aug 5) · 4 tickets · cov 4/4 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 3 | 2–1 | 66.7% | +20.6% |
| 5–10 | 1 | 1–0 | 100.0% | +81.3% |
| All | 4 | 3–1 | 75.0% | +39.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| B | 100% (1) | — | — |
| C | 50% (2) | 100% (1) | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 374 tickets · cov 362/374 (stamp 156 / as-of 206)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 74 | 30–44 | 40.5% | -27.6% |
| 0–2.89 | 192 | 110–82 | 57.3% | +8.9% |
| ≥2.89 | 96 | 66–30 | 68.8% | +22.0% |
| All | 374 | 214–160 | 57.2% | +5.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 63% (81) | 77.1% (48) |
| B | 60% (20) | 57.6% (33) | 72.7% (11) |
| C | 18.2% (11) | 48.6% (70) | 55.9% (34) |

##### Jul 15+ · 163 tickets · cov 157/163 (stamp 156 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 5 | 2–3 | 40.0% | -37.1% |
| 0–2.89 | 101 | 56–45 | 55.4% | +2.8% |
| ≥2.89 | 51 | 33–18 | 64.7% | +15.3% |
| All | 163 | 96–67 | 58.9% | +6.9% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 58.3% (24) | 77.8% (18) |
| B | 50% (4) | 61.1% (18) | 75% (4) |
| C | — | 49% (51) | 53.6% (28) |

##### Yesterday (Aug 5) · 4 tickets · cov 4/4 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| 0–2.89 | 2 | 1–1 | 50.0% | -19.3% |
| ≥2.89 | 2 | 2–0 | 100.0% | +76.9% |
| All | 4 | 3–1 | 75.0% | +39.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| B | — | 100% (1) | — |
| C | — | 0% (1) | 100% (2) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 163 | 96-67 | 58.9% | 536.95u | +37.06u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 163/163 | 1.91 | 1.88 | +0.03 | 2.00 | 1.00 |
| depth   | #A sharps        | 163/163 | 1.38 | 1.31 | +0.06 | 1.00 | 1.00 |
| depth   | #F − #A          | 163/163 | 0.53 | 0.57 | -0.04 | 1.00 | 1.00 |
| depth   | proven F         | 163/163 | 1.28 | 1.28 | -0.00 | 1.00 | 1.00 |
| depth   | proven A         | 163/163 | 0.42 | 0.39 | +0.03 | 0.00 | 0.00 |
| depth   | proven F−A       | 163/163 | 0.86 | 0.90 | -0.03 | 1.00 | 1.00 |
| depth   | v12 F count      | 163/163 | 1.83 | 1.87 | -0.03 | 2.00 | 1.00 |
| depth   | v12 A count      | 163/163 | 1.43 | 1.25 | +0.17 | 1.00 | 1.00 |
| depth   | WA ForN          | 163/163 | 1.45 | 1.70 | -0.25 | 1.00 | 1.00 |
| depth   | WA AgN           | 163/163 | 1.09 | 1.12 | -0.03 | 1.00 | 1.00 |
| depth   | CLV ForN         | 162/163 | 1.85 | 1.88 | -0.03 | 2.00 | 1.00 |
| depth   | CLV AgN          | 162/163 | 1.42 | 1.25 | +0.17 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 163/163 | 0.35 | 0.37 | -0.02 | 0.00 | 0.00 |
| quality | ForWR            | 157/163 | 58.38 | 54.97 | +3.41 | 54.85 | 55.00 |
| quality | AgWR             | 86/163 | 42.73 | 43.13 | -0.41 | 43.15 | 43.75 |
| quality | TopFor WR        | 157/163 | 59.79 | 57.55 | +2.24 | 55.90 | 55.80 |
| quality | TopAg WR         | 86/163 | 46.64 | 46.90 | -0.27 | 49.10 | 47.90 |
| quality | EDGE             | 157/163 | 12.39 | 8.61 | +3.78 | 10.48 | 8.30 |
| quality | ForCLV           | 161/163 | 65.75 | 66.22 | -0.47 | 65.67 | 66.00 |
| quality | AgCLV            | 101/163 | 63.44 | 62.46 | +0.97 | 65.35 | 65.71 |
| quality | netCLV           | 161/163 | 2.82 | 3.94 | -1.13 | 2.77 | 2.64 |
| quality | Tape             | 156/163 | 2.92 | 2.34 | +0.58 | 2.28 | 2.07 |
| quality | V12 score        | 163/163 | 0.86 | 0.90 | -0.04 | 0.96 | 0.97 |
| quality | V12 forMean      | 163/163 | 23.37 | 19.87 | +3.50 | 16.95 | 15.06 |
| quality | V12 agMean       | 163/163 | 1.53 | 0.65 | +0.88 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 157/163 | 0.611 | +0.338 | +0.222 | +3.78 | 🟢 sep OK |
|    2 | Tape             | quality | 156/163 | 0.559 | +0.139 | +0.126 | +0.58 | 🟡 mild OK |
|    3 | ForWR            | quality | 157/163 | 0.555 | +0.220 | +0.208 | +3.41 | 🟡 mild OK |
|    4 | #F sharps        | depth   | 163/163 | 0.555 | +0.210 | +0.010 | +0.03 | 🟡 mild OK |
|    5 | CLV AgN          | depth   | 162/163 | 0.545 | +0.295 | +0.054 | +0.17 | 🟡 mild inv |
|    6 | V12 forMean      | quality | 163/163 | 0.545 | +0.094 | +0.089 | +3.50 | 🟡 mild OK |
|    7 | v12 F count      | depth   | 163/163 | 0.543 | +0.216 | -0.014 | -0.03 | 🟡 mild OK |
|    8 | v12 A count      | depth   | 163/163 | 0.540 | +0.292 | +0.056 | +0.17 | flat |
|    9 | TopAg WR         | quality | 86/163 | 0.534 | +0.127 | -0.016 | -0.27 | flat |
|   10 | WA ForN          | depth   | 163/163 | 0.467 | +0.172 | -0.125 | -0.25 | flat |
|   11 | #A sharps        | depth   | 163/163 | 0.533 | +0.265 | +0.020 | +0.06 | flat |
|   12 | TopFor WR        | quality | 157/163 | 0.533 | +0.175 | +0.133 | +2.24 | flat |
|   13 | ForCLV           | quality | 161/163 | 0.470 | -0.146 | -0.032 | -0.47 | flat |
|   14 | V12 agMean       | quality | 163/163 | 0.530 | +0.422 | +0.109 | +0.88 | flat |
|   15 | CLV ForN         | depth   | 162/163 | 0.530 | +0.170 | -0.011 | -0.03 | flat |
|   16 | proven F         | depth   | 163/163 | 0.522 | +0.308 | -0.002 | -0.00 | flat |
|   17 | proven A         | depth   | 163/163 | 0.521 | +0.369 | +0.020 | +0.03 | flat |
|   18 | netCLV           | quality | 161/163 | 0.483 | -0.122 | -0.053 | -1.13 | flat |
|   19 | unopposed (A=0)  | depth   | 163/163 | 0.483 | +0.194 | -0.019 | -0.02 | flat |
|   20 | #F − #A          | depth   | 163/163 | 0.487 | -0.032 | -0.009 | -0.04 | flat |
|   21 | V12 score        | quality | 163/163 | 0.505 | -0.006 | -0.083 | -0.04 | flat |
|   22 | proven F−A       | depth   | 163/163 | 0.495 | +0.152 | -0.018 | -0.03 | flat |
|   23 | AgWR             | quality | 86/163 | 0.497 | +0.001 | -0.032 | -0.41 | flat |
|   24 | WA AgN           | depth   | 163/163 | 0.501 | +0.270 | -0.009 | -0.03 | flat |
|   25 | AgCLV            | quality | 101/163 | 0.501 | +0.077 | +0.048 | +0.97 | flat |

### (C) Working read

_N=163 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.611 · Δ +3.78 · higher on WINs (cov 157/163)
- **Tape** — AUC 0.559 · Δ +0.58 · higher on WINs (cov 156/163)
- **ForWR** — AUC 0.555 · Δ +3.41 · higher on WINs (cov 157/163)
- **#F sharps** — AUC 0.555 · Δ +0.03 · higher on WINs (cov 163/163)
- **V12 forMean** — AUC 0.545 · Δ +3.50 · higher on WINs (cov 163/163)
- **v12 F count** — AUC 0.543 · Δ -0.03 · higher on WINs (cov 163/163)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 279n · 55.2% · +3.9%   | 63n · 57.1% · +3.3%    | 178n · 51.7% · -2.4%   | 520n · 54.2% · +1.4%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 12n · 83.3% · +30.1%   | —                      | —                      | 12n · 83.3% · +30.1%   |
| WNBA  | 6n · 100.0% · +49.8%   | 3n · 66.7% · +17.2%    | —                      | 9n · 88.9% · +40.3%    |
| **All** | **339n · 57.8% · +8.8%** | **70n · 58.6% · +7.3%** | **183n · 51.9% · -1.9%** | **592n · 56.1% · +4.9%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **829** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  829 |
| Muted W-L                           |              404-425 |
| Muted Win %                         |                48.7% |
| Counterfactual PnL at flat 1u       |               -63.93 |
| Counterfactual ROI at flat 1u       |                -7.7% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-63.93u** at a flat 1u stake — a counterfactual ROI of **-7.7%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-05 | MLB   | ML     | Boston Red Sox          |  -138 | +0.965 | SHARP~   |   2/5 |   2/0 |  66.7 |   58.4 |  +18.1 |  3.77 | BOOST    | 5.40u | WIN     |      +3.91 |
| 2026-08-05 | MLB   | ML     | Atlanta Braves          |  -123 | +0.982 | SHARP    |   1/1 |   1/0 |  66.7 |   71.4 |  +16.7 |  4.75 | BOOST    | 5.40u | WIN     |      +4.39 |
| 2026-08-05 | MLB   | ML     | Houston Astros          |  -208 | +0.841 | SHARP~   |   1/2 |   1/2 |  61.3 |   61.4 |  +14.5 |  1.88 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-05 | MLB   | TOTAL  | Under 8.5               |  -113 | +0.952 | 2-for-0  |   2/0 |   2/0 |  53.3 |   64.5 |   +3.3 |  1.02 | HOLD     | 3.00u | WIN     |      +2.65 |
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

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.517 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.066 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.001 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.007 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   -0.007 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟠 **Random** — score is not predicting outcomes; PnL is variance, not edge

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  587 |    -0.1108 |    +0.1348 | 0.0006 |  -0.025 |   0.944 | negative (higher score ⇒ WORSE outcome)                  |
| won (binary)        |  587 |    -0.0167 |    +0.5750 | 0.0001 |  -0.007 |   0.496 | negative (higher score ⇒ WORSE outcome)                  |
| per-pick PnL (u)    |  587 |    -0.7080 |    +0.7538 | 0.0026 |  -0.051 |   2.970 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 587 |          +0.059 |           -0.004 |                   +0.045 |                   -0.012 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 587 |          +0.001 |           +0.332 |                   +0.018 |                   +0.100 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 587 |          +0.005 |           +0.158 |                   -0.018 |                   +0.008 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 587 |          -0.003 |           +0.173 |                   +0.021 |                   +0.085 | count of contributing AGAINST-side wallets                     |
| provenFor         | 587 |          +0.010 |           +0.149 |                   -0.001 |                   +0.048 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 587 |          -0.004 |           +0.108 |                   +0.015 |                   +0.046 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.013         | 199 | 112-87  |   56.3% |     +2.8% |
| MID (p33–p67)     | 19.950 … 13.900        | 192 | 104-88  |   54.2% |     +0.1% |
| HIGH (> p67)      | 48.906 … 47.347        | 196 | 113-83  |   57.7% |     +1.4% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       587 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8701 | average score across live picks                                 |
| SD                |    0.2138 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.342 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.633 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.534 / +0.963 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  516 | 280-236 |   54.3% |     +1.2% |  0.494 |        -0.059 | noise                                     |
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
    x-axis ["07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "08-01", "08-02", "08-03", "08-04", "08-05"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.567, 0.573, 0.532, 0.52, 0.514, 0.54, 0.502, 0.487, 0.448, 0.514, 0.483, 0.47, 0.416, 0.474]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "08-01", "08-02", "08-03", "08-04", "08-05"]
    y-axis "edge (pp)" -1 --> 9
    line [4.1, 5, 5.1, 5.7, 7.2, 6.8, 3.2, 3.2, 3.1, 7, 4.4, 6.8, 4.5, 8]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-08-05 |    7 |   55 | 35-20  |   63.6% |    +13.3% |  0.474 |      +8.0pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.503 avg in first half → 0.539 avg in second half · Δ = +0.036)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.9% | [-3.9%, +12.9%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          56.1% | [52.0%, 60.0%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.517 | [0.472, 0.565]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             72 | [23, 117]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       592 |
| Unique wallets ever on a FOR side            |                                                       160 |
| Avg FOR-side wallets per pick                |                                                      2.75 |
| Top-5 wallets' share of all FOR appearances  |                                                     27.4% |
| Top-10 wallets' share of all FOR appearances |                                                     46.1% |
| Top-20 wallets' share of all FOR appearances |                                                     64.3% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    2 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    3 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.9% |     332 | 2026-08-05 |
|    4 | 0cd77e  | MLB,SOC,UFC |   82 |    9 | 50-32  |   61.0% |    +13.9% |    +39.09 |     1.40× | CONFIRMED   |     +4.7% |     201 | 2026-08-05 |
|    5 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   71 |   38 | 39-32  |   54.9% |    +16.8% |    +35.45 |     1.31× | CONFIRMED   |     +9.1% |     460 | 2026-08-03 |
|    7 | 2f2a9e  | MLB,SOC,WNBA |   69 |   29 | 36-33  |   52.2% |     -8.3% |    -16.20 |     2.09× | CONFIRMED   |     -8.8% |     244 | 2026-08-01 |
|    8 | 0f9d74  | MLB,NBA,SOC,UFC |   60 |   38 | 32-28  |   53.3% |    +10.1% |    +17.59 |     0.49× | CONFIRMED   |    +16.9% |     265 | 2026-08-05 |
|    9 | eeabaf  | MLB,NBA,SOC |   58 |   10 | 32-26  |   55.2% |     +6.8% |    +11.67 |     1.29× | CONFIRMED   |    +12.3% |     214 | 2026-08-05 |
|   10 | 7923c4  | MLB,NBA,UFC |   47 |   13 | 29-18  |   61.7% |    +25.7% |    +29.06 |     0.77× | CONFIRMED   |    +10.1% |     200 | 2026-08-04 |
|   11 | 4b912c  | MLB,SOC    |   36 |   15 | 19-17  |   52.8% |     +1.4% |     +1.75 |     1.31× | CONFIRMED   |     -8.8% |     124 | 2026-07-23 |
|   12 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   13 | 7da3d5  | MLB,SOC,UFC,WNBA |   31 |   50 | 13-18  |   41.9% |    -21.1% |    -20.59 |     4.77× | CONFIRMED   |    -10.6% |     208 | 2026-08-05 |
|   14 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   15 | 705ba1  | MLB        |   30 |    7 | 15-15  |   50.0% |     -4.1% |     -3.80 |     1.22× | FLAT        |     +2.8% |     113 | 2026-08-05 |
|   16 | a82a75  | MLB,SOC,UFC |   29 |   22 | 15-14  |   51.7% |     +3.4% |     +3.40 |     0.95× | CONFIRMED   |    -14.5% |     112 | 2026-08-05 |
|   17 | bc35e3  | MLB,SOC,UFC,WNBA |   28 |   17 | 15-13  |   53.6% |     +0.3% |     +0.31 |     1.26× | CONFIRMED   |     -2.1% |     139 | 2026-08-04 |
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
|   14 | 0cd77e  | MLB,SOC,UFC |   82 | 50-32  |   61.0% |     +13.9% |    +39.09 |     1.40× | 2026-08-05 |
|   15 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | c9bba3  | MLB,SOC    |   12 | 6-6    |   50.0% |     -30.4% |     -9.36 |     0.78× | 2026-08-05 |
|    3 | 8ec926  | MLB,WNBA   |   12 | 5-7    |   41.7% |     -30.1% |    -11.75 |     6.21× | 2026-08-03 |
|    4 | 7da3d5  | MLB,SOC,UFC,WNBA |   31 | 13-18  |   41.9% |     -21.1% |    -20.59 |     4.77× | 2026-08-05 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-08-02 |
|    7 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    8 | 2f2a9e  | MLB,SOC,WNBA |   69 | 36-33  |   52.2% |      -8.3% |    -16.20 |     2.09× | 2026-08-01 |
|    9 | 705ba1  | MLB        |   30 | 15-15  |   50.0% |      -4.1% |     -3.80 |     1.22× | 2026-08-05 |
|   10 | ad88a3  | MLB,SOC    |   19 | 10-9   |   52.6% |      -1.5% |     -1.05 |     0.27× | 2026-08-04 |
|   11 | bc35e3  | MLB,SOC,UFC,WNBA |   28 | 15-13  |   53.6% |      +0.3% |     +0.31 |     1.26× | 2026-08-04 |
|   12 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 | 19-15  |   55.9% |      +0.8% |     +0.85 |     1.36× | 2026-07-30 |
|   13 | 4c64aa  | MLB        |   92 | 50-42  |   54.3% |      +1.1% |     +1.94 |     0.84× | 2026-08-05 |
|   14 | 4b912c  | MLB,SOC    |   36 | 19-17  |   52.8% |      +1.4% |     +1.75 |     1.31× | 2026-07-23 |
|   15 | a82a75  | MLB,SOC,UFC |   29 | 15-14  |   51.7% |      +3.4% |     +3.40 |     0.95× | 2026-08-05 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 31, ROI -21.1%), `f2f960` (FOR# 26, ROI -15.0%), `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 69, ROI -8.3%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1235 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   240 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     1 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    49 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   261 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            188 |        41 |   20 |   10 |  117 |                     71 |
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
| v12     | 06-01 → present      |   67 |    592 | 829 | 332-260 |  56.1% |      4.9% |     +83.67 |    +0.14 | 0.501 |        0.2495 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  532 |    +2.7pp |    +13.8pp |          +0.314 |   -0.048 |    +0.0905 | 🟡 mixed |
| v12 − v10          | +  530 |    +7.7pp |    +23.6pp |          +0.455 |   +0.107 |    +0.0309 | 🟢 better |
| v12 − v11          | +  481 |    +1.1pp |     +2.1pp |          +0.080 |   +0.057 |    +0.0147 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 520n 54.2% +1% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 12n 83.3% +30% | 9n 88.9% +40%  | 592n 56.1% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 121n +3%      | 179n +1%      | 132n +11%     | 78n -6%       | 77n +23%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1703 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 826 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 587 / 826 (71%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 587 / 826 (71%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 587 / 826 (71%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 587 / 826 (71%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 587 / 826 (71%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 587 / 826 (71%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 587 / 826 (71%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 826 / 826 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 826 / 826 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 826 / 826 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 826 / 826 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 826 / 826 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 826 / 826 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 819 / 826 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 817 / 826 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 826 / 826 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 825 / 826 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 504 / 826 (61%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 825 / 826 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 504 / 826 (61%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 503 / 826 (61%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 826 / 826 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 826 / 826 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 826 / 826 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 825 / 826 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 826 / 826 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 826 |      |    -0.037 |    -0.162 |      -0.063 |      -0.121 |  0.465 |
|    2 | wd agCount           | 504 |      |    +0.026 |    +0.290 |      +0.055 |      +0.115 |  0.518 |
|    3 | wd maxForContrib     | 825 |      |    -0.054 |    -0.075 |      -0.055 |      -0.050 |  0.488 |
|    4 | wd forAvgSize        | 825 |      |    -0.028 |    +0.010 |      -0.048 |      -0.026 |  0.507 |
|    5 | V12 forMean          | 587 |  🟢  |    +0.059 |    -0.004 |      +0.045 |      -0.012 |  0.518 |
|    6 | wd contribFor        | 826 |      |    -0.035 |    -0.085 |      -0.045 |      -0.085 |  0.479 |
|    7 | qMargin              | 587 |  🟢  |    +0.061 |    -0.017 |      +0.042 |      -0.023 |  0.512 |
|    8 | hcMargin             | 826 |      |    -0.018 |    +0.194 |      -0.036 |      +0.042 |  0.500 |
|    9 | wd forCount          | 825 |      |    -0.018 |    +0.074 |      -0.033 |      -0.041 |  0.480 |
|   10 | peakStars            | 826 |      |    -0.011 |    +0.082 |      -0.032 |      -0.017 |  0.488 |
|   11 | countMargin          | 587 |      |    +0.007 |    +0.058 |      -0.032 |      -0.046 |  0.485 |
|   12 | wd sizeMargin        | 503 |      |    +0.004 |    -0.048 |      -0.031 |      -0.074 |  0.503 |
|   13 | provenFor            | 826 |      |    -0.024 |    +0.022 |      -0.031 |      -0.042 |  0.487 |
|   14 | provenMargin         | 826 |      |    -0.011 |    +0.041 |      -0.030 |      -0.033 |  0.490 |
|   15 | agsV12               | 587 |  🟢  |    -0.007 |    -0.001 |      -0.025 |      -0.007 |  0.517 |
|   16 | ags (v11)            | 826 |      |    -0.002 |    -0.028 |      -0.025 |      -0.069 |  0.507 |
|   17 | provenTotal          | 826 |      |    -0.026 |    -0.009 |      -0.024 |      -0.033 |  0.491 |
|   18 | lockPinnProb         | 819 |      |    +0.169 |    +0.175 |      +0.023 |      -0.132 |  0.591 |
|   19 | V12 agCount          | 587 |  🟢  |    -0.003 |    +0.173 |      +0.021 |      +0.085 |  0.516 |
|   20 | V12 forCount         | 587 |  🟢  |    +0.005 |    +0.158 |      -0.018 |      +0.008 |  0.513 |
|   21 | V12 agMean           | 587 |  🟢  |    +0.001 |    +0.332 |      +0.018 |      +0.100 |  0.495 |
|   22 | wd contribAg         | 826 |      |    -0.002 |    +0.172 |      +0.017 |      +0.062 |  0.499 |
|   23 | wd maxShare          | 826 |      |    +0.007 |    -0.071 |      +0.014 |      +0.006 |  0.510 |
|   24 | clv                  | 817 |      |    +0.006 |    +0.005 |      -0.010 |      -0.010 |  0.510 |
|   25 | provenAg             | 826 |      |    -0.022 |    +0.155 |      -0.008 |      +0.059 |  0.494 |
|   26 | wd agAvgSize         | 504 |      |    -0.031 |    +0.052 |      -0.001 |      +0.039 |  0.498 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.063), `wd agCount` (r = +0.055), `wd maxForContrib` (r = -0.055).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.063, AUC = 0.465. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.063 · AUC = 0.465

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -53.400        | 276 | 162-114 |   58.7% |     +3.7% |
| MID (p33–p67)     | 57.800 … 73.500          | 275 | 153-122 |   55.6% |     +1.0% |
| HIGH (> p67)      | 174.100 … 231.200        | 275 | 141-134 |   51.3% |     -2.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd agCount` · r(unit-ret) = +0.055 · AUC = 0.518

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 252 | 134-118 |   53.2% |     -0.8% |
| MID (p33–p67)     | 2.000 … 2.000            | 125 | 69-56   |   55.2% |     +0.4% |
| HIGH (> p67)      | 3.000 … 5.000            | 127 | 74-53   |   58.3% |     +3.3% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd maxForContrib` · r(unit-ret) = -0.055 · AUC = 0.488

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 11.500          | 275 | 152-123 |   55.3% |     +1.1% |
| MID (p33–p67)     | 52.400 … 43.500          | 275 | 155-120 |   56.4% |     +1.7% |
| HIGH (> p67)      | 100.000 … 104.400        | 275 | 149-126 |   54.2% |     -0.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forAvgSize` · r(unit-ret) = -0.048 · AUC = 0.507

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.675 … 0.220            | 278 | 148-130 |   53.2% |     +0.2% |
| MID (p33–p67)     | 0.777 … 0.845            | 272 | 159-113 |   58.5% |     +3.4% |
| HIGH (> p67)      | 3.837 … 3.242            | 275 | 149-126 |   54.2% |     -0.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.045 · AUC = 0.518

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.013           | 199 | 112-87  |   56.3% |     +2.8% |
| MID (p33–p67)     | 19.950 … 13.900          | 192 | 104-88  |   54.2% |     +0.1% |
| HIGH (> p67)      | 48.906 … 47.347          | 196 | 113-83  |   57.7% |     +1.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd agCount     | wd maxForContrib | wd forAvgSize  | V12 forMean    | wd contribFor  | qMargin        | hcMargin       |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         -0.104 |         +0.518 |         +0.275 |         +0.087 |         +0.781 |         +0.059 |         +0.656 |
| wd agCount  |         -0.104 |  1.000         |         +0.347 |         +0.254 |         +0.198 |         +0.502 |         +0.079 |         +0.180 |
| wd maxForContrib |         +0.518 |         +0.347 |  1.000         |         +0.496 |         +0.268 |         +0.665 |         +0.195 |         +0.461 |
| wd forAvgSize |         +0.275 |         +0.254 |         +0.496 |  1.000         |         +0.334 |         +0.417 |         +0.262 |         +0.440 |
| V12 forMean |         +0.087 |         +0.198 |         +0.268 |         +0.334 |  1.000         |         +0.197 |         +0.963 |         +0.296 |
| wd contribFor |         +0.781 |         +0.502 |         +0.665 |         +0.417 |         +0.197 |  1.000         |         +0.090 |         +0.682 |
| qMargin     |         +0.059 |         +0.079 |         +0.195 |         +0.262 |         +0.963 |         +0.090 |  1.000         |         +0.233 |
| hcMargin    |         +0.656 |         +0.180 |         +0.461 |         +0.440 |         +0.296 |         +0.682 |         +0.233 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.963. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 386 picks · features = 8 (+ intercept) · multiple R² = **0.0197** · adjusted R² = **-0.0037** · residual sd = 0.942

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.3633 |   0.2366 | -1.54 (~sig) |        1 |
|    2 | wd agCount           |     |    +0.2502 |   0.1413 | +1.77 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.2300 |   0.2014 | +1.14        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.1515 |   0.2143 | +0.71        |        4 |
|    5 | qMargin              |  🟢 |    -0.0950 |   0.2077 | -0.46        |        5 |
|    6 | wd forAvgSize        |     |    -0.0194 |   0.0596 | -0.33        |        6 |
|    7 | wd maxForContrib     |     |    +0.0146 |   0.0688 | +0.21        |        7 |
|    8 | hcMargin             |     |    -0.0046 |   0.0728 | -0.06        |        8 |
| —    | (intercept)          |     |    +0.0414 |   0.0479 |    +0.86 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.152), `qMargin` (β = -0.095)
- V12 IGNORES: `wd contribFor` (β = -0.363, t = -1.54), `wd agCount` (β = +0.250, t = +1.77), `wd contribMargin` (β = +0.230, t = +1.14), `wd forAvgSize` (β = -0.019, t = -0.33), `wd maxForContrib` (β = +0.015, t = +0.21), `hcMargin` (β = -0.005, t = -0.06)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.519 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.565 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.046.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.6pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd contribFor` (β = -0.363, t = -1.54), `wd agCount` (β = +0.250, t = +1.77). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0037 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*