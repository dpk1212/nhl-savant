# AGS-Unified — V12 Daily Monitor

**Generated:** Thursday, July 23, 2026 at 6:12 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (53 days) · **Tape / side-profile era:** 2026-07-15+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (53 days ago), V12 has evaluated **1498** picks, shipped **497** for real money (33.2% ship rate), and muted the other **1001**. On the shipped picks V12 has gone **276-221** (55.5% win), staked **1373.40u**, and returned **+59.74u** at **+4.3% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             53 |
| Picks V12 has evaluated             |                           1498 |
| Picks SHIPPED (units > 0)           |                            497 |
| Picks MUTED (score ≤ 0, FADE)       |                           1001 |
| Ship rate                           |                          33.2% |
| Live W-L                            |                        276-221 |
| Live Win %                          |                          55.5% |
| Live PnL (units)                    |                         +59.74 |
| Live ROI                            |                          +4.3% |
| Avg PnL / day                       |                         +1.13u |
| Most recent action (2026-07-23)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.3% ROI** across 497 live picks (+59.74u real PnL).
- Mute rule is **saving money** — the 632 muted picks would have lost -50.00u at flat 1u (-7.9% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.13u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **40-28** · +6.7% ROI · +13.13u on 68 graded — see § 5.

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

Odds cap still clamps long dogs (+100 / +151 / +200 → max 2.5 / 1.5 / 1.0u). Legacy ELITE→WEAK score-ladder units are **not** the live sizer — ignore them if you see them in old notes.

## § 3 — Daily Scoreboard

**Full book:** 53d · 497 live · 276-221 · **+59.74u** · +4.3% ROI · +1.13u/day.

_Prior to table (2026-06-01 → 2026-07-01): 331 live · 184-147 · +38.21u · cum through prior = +38.21u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-07-02 |        40 |   11 |    13 | 5-6        |  45.5% |     38.50 |      -6.89 |    -17.9% |     +31.32 |
| 2026-07-03 |        31 |   12 |    11 | 8-4        |  66.7% |     46.50 |     +16.11 |     34.6% |     +47.43 |
| 2026-07-04 |        36 |   12 |    12 | 8-4        |  66.7% |     49.50 |      +6.34 |     12.8% |     +53.77 |
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
| 2026-07-23 |         5 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +59.74 |

> **Trajectory.** 🟢 Last 3 days (32.9% ROI) **+29.8pp** vs prior (3.1%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-07-22**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | +136.0% |
| 🟢 2 | SHARP-LEAN EDGE/net ONE | C | 15 | 10-5 | +40.9% | +11.41u | +0.76u | +40.9% |
| 🟢 3 | MINI- (gate-cut) | C | 11 | 8-3 | +24.8% | +2.73u | +0.25u | +0.0% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP EDGE/net BOTH | C | 36 | 14-22 | -19.6% | -19.12u | -0.53u | -31.8% |
| 🔴 3 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 15 | 10-5 | +25.7% | +15.99u | sized UP after path |
| 2 | Tape HOLD (mid) | 42 | 23-19 | -0.9% | -0.93u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 10 | 6-4 | -16.9% | -5.33u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 442 | 212-230 | -4.9% | -21.45u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 9 | 6-3 | +24.3% | +2.19u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 1 | +136.0% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 59 | 37-22 | 62.7% | 219.1u | +16.82u | +7.7% | +0.29u | 20 | -7.1% | +1.00u | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 45 | 28-17 | 62.2% | 178.4u | +25.60u | +14.3% | +0.57u | 7 | +31.5% | +2.78u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 36 | 14-22 | 38.9% | 97.4u | -19.12u | -19.6% | -0.53u | 11 | -31.8% | +4.60u | 🔴 cut |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 15 | 10-5 | 66.7% | 27.9u | +11.41u | +40.9% | +0.76u | 15 | +40.9% | +5.75u | 🟢 OK |
| MINI (gate-pass) | `MINI` | A | 3u | 44 | 23-21 | 52.3% | 127.5u | -6.42u | -5.0% | -0.15u | 7 | +16.0% | — | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 11 | 8-3 | 72.7% | 11.0u | +2.73u | +24.8% | +0.25u | 1 | +0.0% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 7 | 4-3 | 57.1% | 7.3u | +1.16u | +15.8% | +0.17u | 6 | +34.0% | +1.01u | 🟢 room |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 15 | 10-5 | 66.7% | 62.3u | +15.99u | +25.7% | 15 | +25.7% | +10.04u |
| Tape HOLD (mid) | TAPE | staked | 42 | 23-19 | 54.8% | 100.9u | -0.93u | -0.9% | 42 | -0.9% | +5.10u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 10 | 6-4 | 60.0% | 31.5u | -5.33u | -16.9% | 10 | -16.9% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 9 | 6-3 | 66.7% | 9.0u | +2.19u | +24.3% | 9 | +24.3% | — |
| fadeTop≥60 MUTE | E | CF 1u | 1 | 0-1 | 0.0% | 1.0u | -1.00u | -100.0% | 1 | -100.0% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 442 | 212-230 | 48.0% | 442.0u | -21.45u | -4.9% | 36 | +1.2% | -1.01u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 10 / -20% | 6 / +16% | 4 / -16% |
| RANK | 6 / +19% | 1 / +86% | — |
| SHARP | 5 / -72% | 5 / +2% | 1 / -100% |
| SHARP-LEAN | 13 / +33% | 2 / +54% | — |
| MINI | 3 / +36% | — | 4 / +1% |
| MINI- | — | — | 1 / +0% |
| DISSENT | 5 / +19% | 1 / +91% | — |

### (D) Last graded day movers (2026-07-22)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP-LEAN EDGE/net ONE | 6 | 4-2 | +5.75u | +39.6% |
| SHARP EDGE/net BOTH | 1 | 1-0 | +4.60u | +90.9% |
| RANK 2-for-0 rescue | 1 | 1-0 | +2.78u | +92.7% |
| DISSENT rescue | 3 | 2-1 | +1.01u | +33.7% |
| HC-1 TOP | 1 | 1-0 | +1.00u | +20.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u |  97 | 52-36  |  59.1% |      351.60 |      +4.88 |      1.4% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 123 | 58-52  |  52.7% |      352.70 |     +11.28 |      3.2% |
| STRONG (MINI)             |    3u |  46 | 23-21  |  52.3% |      127.50 |      -6.42 |     -5.0% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  26 | 14-9   |  60.9% |       23.35 |      +1.87 |      8.0% |
| **STAKED TOTAL** |     — | 278 | 157-121 |  56.5% |      916.65 |     +39.49 |     +4.3% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u |  68 | 37-22  |  62.7% |      219.10 |     +16.82 |      7.7% |
| B · 2-for-0 rescue    | RANK        |    4u |  47 | 28-17  |  62.2% |      178.40 |     +25.60 |     14.3% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u |  25 | 10-5   |  66.7% |       27.90 |     +11.41 |     40.9% |
| C · proven-$ consensus | SHARP       |    3u |  37 | 14-22  |  38.9% |       97.40 |     -19.12 |    -19.6% |
| A · mini-HC (gate-pass) | MINI        |    3u |  46 | 23-21  |  52.3% |      127.50 |      -6.42 |     -5.0% |
| C · mini gate-cut     | MINI-       |    1u |  12 | 8-3    |  72.7% |       11.00 |      +2.73 |     24.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |   8 | 4-3    |  57.1% |        7.35 |      +1.16 |     15.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 364 picks tracked at 0u (would-be 174-190, 47.8% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (55-42, +4.88u)  ·  🟠 SHARP PLAY (65-58, +11.28u)  ·  🔴 STRONG (25-21, -6.42u)  ·  🟣 LEAN (14-12, +1.87u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 186 | 181 | 173 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 9 | 6-3 | 66.7% | 0.00u | +0.00u | — |
| HOLD      | 43 | 23-20 | 53.5% | 103.90u | -3.93u | -3.8% |
| BOOST     | 15 | 10-5 | 66.7% | 62.25u | +15.99u | +25.7% |
| FAIL_OPEN | 10 | 6-4 | 60.0% | 31.50u | -5.33u | -16.9% |
| PASS      | 96 | 49-47 | 51.0% | 0.00u | +0.00u | — |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 45 | 29-16 | 64.4% | -6.06u |
| hold (0–2.89) | path u | 74 | 38-36 | 51.4% | +3.63u |
| boost (≥2.89) | ×1.35 | 25 | 13-12 | 52.0% | +10.34u |

_Score coverage: **144/173** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 9 | +9.22u | -9.22u | +2.50u | +11.72u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 15 | +10.18u | +15.99u | +5.81u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-07-22 | WNBA | Indiana Fever | SHARP~ | 3.76 | BOOST | 1.88u | 5.00u | WIN |
| 2026-07-22 | WNBA | Chicago Sky | SHARP~ | 3.43 | BOOST | 1.88u | 5.00u | WIN |
| 2026-07-22 | MLB | Under 7.5 | SHARP | 4.80 | BOOST | 3.75u | 5.06u | WIN |
| 2026-07-21 | MLB | Los Angeles Dodgers | HC-1 | 3.04 | BOOST | 1.25u | 2.50u | WIN |
| 2026-07-21 | MLB | Under 8.5 | SHARP~ | -1.33 | MUTE | 0.75u | 0.00u | LOSS |
| 2026-07-21 | MLB | Under 9.5 | SHARP | 5.50 | BOOST | 3.75u | 5.06u | WIN |
| 2026-07-21 | MLB | Under 13.5 | SHARP | 5.55 | BOOST | 3.75u | 5.06u | LOSS |
| 2026-07-20 | MLB | Chicago Cubs | SHARP~ | -0.29 | MUTE | 0.75u | 0.00u | LOSS |
| 2026-07-20 | MLB | Los Angeles Dodgers | PATH-D | -0.13 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-07-20 | MLB | New York Yankees | PATH-D | -0.72 | MUTE | 1.00u | 0.00u | WIN |
| 2026-07-20 | MLB | Milwaukee Brewers | SHARP~ | -0.29 | MUTE | 0.75u | 0.00u | WIN |
| 2026-07-20 | MLB | Over 10.5 | SHARP | 3.02 | BOOST | 1.25u | 1.69u | LOSS |
| 2026-07-20 | MLB | Over 12.5 | SHARP | 4.56 | BOOST | 1.50u | 2.03u | LOSS |
| 2026-07-19 | MLB | Los Angeles Dodgers | SHARP~ | -1.73 | MUTE | 1.50u | 0.00u | WIN |
| 2026-07-19 | MLB | Pittsburgh Pirates | HC-1 | -1.35 | MUTE | 4.00u | 0.00u | WIN |

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 54–23 · 70.1% · +30.7%); **5–10 is the hole** (33–29 · 53.2% · -4.9%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 279 tickets · cov 269/279 (stamp 69 / as-of 200)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 130 | 65–65 | 50.0% | -7.9% |
| 5–10 | 62 | 33–29 | 53.2% | -4.9% |
| ≥10 | 77 | 54–23 | 70.1% | +30.7% |
| All | 279 | 158–121 | 56.6% | +4.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.7% (71) | 58.3% (36) | 70.8% (48) |
| B | 56.3% (32) | 80% (5) | 75% (8) |
| C | 37.5% (24) | 36.8% (19) | 66.7% (18) |

##### Jul 15+ · 68 tickets · cov 64/68 (stamp 64 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 24 | 12–12 | 50.0% | -10.9% |
| 5–10 | 23 | 10–13 | 43.5% | -27.2% |
| ≥10 | 17 | 15–2 | 88.2% | +49.0% |
| All | 68 | 40–28 | 58.8% | +6.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 41.7% (12) | 57.1% (7) | 85.7% (7) |
| B | 66.7% (6) | — | 100% (1) |
| C | 33.3% (3) | 35.7% (14) | 87.5% (8) |

##### Yesterday (Jul 22) · 12 tickets · cov 12/12 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 4 | 3–1 | 75.0% | +63.2% |
| 5–10 | 4 | 2–2 | 50.0% | +6.9% |
| ≥10 | 4 | 4–0 | 100.0% | +55.0% |
| All | 12 | 9–3 | 75.0% | +49.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | 100% (1) | — | — |
| C | — | 50% (4) | 100% (3) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 279 tickets · cov 278/279 (stamp 67 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 187 | 102–85 | 54.5% | -0.6% |
| 5–10 | 44 | 25–19 | 56.8% | +10.4% |
| ≥10 | 47 | 31–16 | 66.0% | +19.7% |
| All | 279 | 158–121 | 56.6% | +4.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 55.7% (106) | 55.6% (27) | 77.8% (27) |
| B | 63.6% (33) | 66.7% (6) | 50% (6) |
| C | 45.2% (42) | 50% (10) | 46.2% (13) |

##### Jul 15+ · 68 tickets · cov 68/68 (stamp 67 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 37 | 24–13 | 64.9% | +16.5% |
| 5–10 | 21 | 12–9 | 57.1% | +13.3% |
| ≥10 | 10 | 4–6 | 40.0% | -33.8% |
| All | 68 | 40–28 | 58.8% | +6.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 75% (12) | 54.5% (11) | 50% (6) |
| B | 60% (5) | 100% (2) | — |
| C | 60% (15) | 42.9% (7) | 25% (4) |

##### Yesterday (Jul 22) · 12 tickets · cov 12/12 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 11 | 8–3 | 72.7% | +41.3% |
| 5–10 | 1 | 1–0 | 100.0% | +90.9% |
| All | 12 | 9–3 | 75.0% | +49.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (1) | — | — |
| B | 100% (1) | — | — |
| C | 66.7% (6) | 100% (1) | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 279 tickets · cov 269/279 (stamp 63 / as-of 206)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 72 | 29–43 | 40.3% | -28.0% |
| 0–2.89 | 133 | 78–55 | 58.6% | +12.6% |
| ≥2.89 | 64 | 45–19 | 70.3% | +27.6% |
| All | 279 | 158–121 | 56.6% | +4.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 63.9% (72) | 72.5% (40) |
| B | 61.1% (18) | 57.9% (19) | 75% (8) |
| C | 18.2% (11) | 48.6% (37) | 61.5% (13) |

##### Jul 15+ · 68 tickets · cov 64/68 (stamp 63 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 3 | 1–2 | 33.3% | -50.5% |
| 0–2.89 | 42 | 24–18 | 57.1% | +6.6% |
| ≥2.89 | 19 | 12–7 | 63.2% | +18.5% |
| All | 68 | 40–28 | 58.8% | +6.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 60% (15) | 60% (10) |
| B | 50% (2) | 75% (4) | 100% (1) |
| C | — | 50% (18) | 57.1% (7) |

##### Yesterday (Jul 22) · 12 tickets · cov 12/12 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| 0–2.89 | 9 | 6–3 | 66.7% | +32.9% |
| ≥2.89 | 3 | 3–0 | 100.0% | +66.7% |
| All | 12 | 9–3 | 75.0% | +49.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 100% (1) | — |
| B | — | 100% (1) | — |
| C | — | 50% (4) | 100% (3) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 68 | 40-28 | 58.8% | 197.15u | +13.13u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 68/68 | 1.80 | 2.21 | -0.41 | 1.50 | 1.50 |
| depth   | #A sharps        | 68/68 | 0.93 | 1.29 | -0.36 | 1.00 | 0.00 |
| depth   | #F − #A          | 68/68 | 0.88 | 0.93 | -0.05 | 1.00 | 1.00 |
| depth   | proven F         | 68/68 | 1.23 | 1.29 | -0.06 | 1.00 | 1.00 |
| depth   | proven A         | 68/68 | 0.25 | 0.36 | -0.11 | 0.00 | 0.00 |
| depth   | proven F−A       | 68/68 | 0.97 | 0.93 | +0.05 | 1.00 | 1.00 |
| depth   | v12 F count      | 68/68 | 1.65 | 2.18 | -0.53 | 1.50 | 1.50 |
| depth   | v12 A count      | 68/68 | 1.02 | 1.11 | -0.08 | 1.00 | 0.00 |
| depth   | WA ForN          | 68/68 | 1.32 | 1.89 | -0.57 | 1.00 | 1.00 |
| depth   | WA AgN           | 68/68 | 0.78 | 0.93 | -0.15 | 0.00 | 0.00 |
| depth   | CLV ForN         | 67/68 | 1.74 | 2.25 | -0.51 | 1.00 | 2.00 |
| depth   | CLV AgN          | 67/68 | 1.00 | 1.18 | -0.18 | 1.00 | 0.00 |
| depth   | unopposed (A=0)  | 68/68 | 0.47 | 0.54 | -0.06 | 0.00 | 1.00 |
| quality | ForWR            | 64/68 | 55.74 | 53.12 | +2.62 | 54.45 | 53.80 |
| quality | AgWR             | 26/68 | 40.96 | 44.81 | -3.85 | 37.95 | 46.01 |
| quality | TopFor WR        | 64/68 | 56.75 | 56.04 | +0.70 | 55.60 | 55.60 |
| quality | TopAg WR         | 26/68 | 44.15 | 49.16 | -5.01 | 42.55 | 50.45 |
| quality | EDGE             | 64/68 | 9.65 | 5.04 | +4.60 | 8.40 | 5.70 |
| quality | ForCLV           | 67/68 | 65.59 | 67.56 | -1.97 | 66.28 | 68.93 |
| quality | AgCLV            | 33/68 | 61.83 | 58.52 | +3.31 | 64.42 | 62.90 |
| quality | netCLV           | 67/68 | 3.68 | 7.18 | -3.50 | 3.97 | 5.80 |
| quality | Tape             | 63/68 | 2.42 | 2.17 | +0.25 | 2.16 | 1.92 |
| quality | V12 score        | 68/68 | 0.92 | 0.87 | +0.05 | 0.97 | 0.96 |
| quality | V12 forMean      | 68/68 | 20.30 | 15.70 | +4.60 | 16.95 | 14.06 |
| quality | V12 agMean       | 68/68 | 0.62 | 0.10 | +0.52 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 64/68 | 0.676 | +0.361 | +0.333 | +4.60 | 🟢 sep OK |
|    2 | AgWR             | quality | 26/68 | 0.362 | +0.042 | -0.282 | -3.85 | 🟢 sep OK |
|    3 | WA ForN          | depth   | 68/68 | 0.385 | +0.108 | -0.235 | -0.57 | 🔴 inverted |
|    4 | V12 forMean      | quality | 68/68 | 0.603 | +0.310 | +0.149 | +4.60 | 🟢 sep OK |
|    5 | netCLV           | quality | 67/68 | 0.397 | -0.253 | -0.155 | -3.50 | 🔴 inverted |
|    6 | TopAg WR         | quality | 26/68 | 0.400 | +0.024 | -0.274 | -5.01 | 🟢 sep OK |
|    7 | ForCLV           | quality | 67/68 | 0.401 | -0.257 | -0.154 | -1.97 | 🔴 inverted |
|    8 | ForWR            | quality | 64/68 | 0.595 | +0.375 | +0.252 | +2.62 | 🟢 sep OK |
|    9 | unopposed (A=0)  | depth   | 68/68 | 0.421 | +0.399 | -0.059 | -0.06 | mild LOSS↑ |
|   10 | CLV ForN         | depth   | 67/68 | 0.427 | +0.023 | -0.193 | -0.51 | 🟡 mild inv |
|   11 | proven F         | depth   | 68/68 | 0.429 | +0.234 | -0.064 | -0.06 | 🟡 mild inv |
|   12 | v12 F count      | depth   | 68/68 | 0.437 | +0.059 | -0.213 | -0.53 | 🟡 mild inv |
|   13 | V12 score        | quality | 68/68 | 0.562 | +0.243 | +0.135 | +0.05 | 🟡 mild OK |
|   14 | proven F−A       | depth   | 68/68 | 0.440 | +0.339 | +0.028 | +0.05 | 🟡 mild inv |
|   15 | proven A         | depth   | 68/68 | 0.446 | +0.352 | -0.070 | -0.11 | 🟡 mild OK |
|   16 | #F sharps        | depth   | 68/68 | 0.448 | +0.048 | -0.151 | -0.41 | 🟡 mild inv |
|   17 | AgCLV            | quality | 33/68 | 0.546 | +0.115 | +0.131 | +3.31 | 🟡 mild inv |
|   18 | #A sharps        | depth   | 68/68 | 0.455 | +0.066 | -0.113 | -0.36 | 🟡 mild OK |
|   19 | V12 agMean       | quality | 68/68 | 0.456 | +0.419 | +0.121 | +0.52 | 🟡 mild OK |
|   20 | Tape             | quality | 63/68 | 0.543 | +0.021 | +0.065 | +0.25 | 🟡 mild OK |
|   21 | #F − #A          | depth   | 68/68 | 0.462 | +0.044 | -0.013 | -0.05 | flat |
|   22 | CLV AgN          | depth   | 67/68 | 0.467 | +0.107 | -0.054 | -0.18 | flat |
|   23 | v12 A count      | depth   | 68/68 | 0.475 | +0.113 | -0.026 | -0.08 | flat |
|   24 | WA AgN           | depth   | 68/68 | 0.477 | +0.239 | -0.051 | -0.15 | flat |
|   25 | TopFor WR        | quality | 64/68 | 0.512 | +0.283 | +0.088 | +0.70 | flat |

### (C) Working read

_N=68 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.676 · Δ +4.60 · higher on WINs (cov 64/68)
- **V12 forMean** — AUC 0.603 · Δ +4.60 · higher on WINs (cov 68/68)
- **ForWR** — AUC 0.595 · Δ +2.62 · higher on WINs (cov 64/68)
- **unopposed (A=0)** — AUC 0.421 · Δ -0.06 · higher on LOSSes (cov 68/68)
- **V12 score** — AUC 0.562 · Δ +0.05 · higher on WINs (cov 68/68)
- **proven A** — AUC 0.446 · Δ -0.11 · higher on LOSSes (cov 68/68)
- **#A sharps** — AUC 0.455 · Δ -0.36 · higher on LOSSes (cov 68/68)
- **V12 agMean** — AUC 0.456 · Δ +0.52 · higher on LOSSes (cov 68/68)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 232n · 53.0% · +1.2%   | 53n · 60.4% · +4.1%    | 151n · 53.6% · +1.4%   | 436n · 54.1% · +1.6%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 3n · 66.7% · -13.1%    | —                      | —                      | 3n · 66.7% · -13.1%    |
| WNBA  | 4n · 100.0% · +40.2%   | 3n · 66.7% · +17.2%    | —                      | 7n · 85.7% · +30.9%    |
| **All** | **281n · 55.2% · +5.0%** | **60n · 61.7% · +9.0%** | **156n · 53.8% · +1.9%** | **497n · 55.5% · +4.3%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **632** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  632 |
| Muted W-L                           |              306-326 |
| Muted Win %                         |                48.4% |
| Counterfactual PnL at flat 1u       |               -50.00 |
| Counterfactual ROI at flat 1u       |                -7.9% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-50.00u** at a flat 1u stake — a counterfactual ROI of **-7.9%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-07-22 | MLB   | ML     | Texas Rangers           |  +104 | +0.954 | SHARP~   |   1/3 |   1/0 |  54.4 |   56.5 |   +9.1 |  0.86 | HOLD     | 1.13u | LOSS    |      -1.13 |
| 2026-07-22 | MLB   | ML     | Detroit Tigers          |  +113 | +0.981 | PATH-D   |   1/3 |   1/0 |  53.5 |   64.2 |   +2.3 |  1.05 | HOLD     | 1.00u | WIN     |      +1.13 |
| 2026-07-22 | MLB   | ML     | Houston Astros          |  -114 | +0.411 | PATH-D   |   1/4 |   1/3 |  53.5 |   64.2 |   +3.4 |  0.46 | HOLD     | 1.00u | WIN     |      +0.88 |
| 2026-07-22 | MLB   | ML     | Cleveland Guardians     |  -137 | +0.930 | PATH-D   |   2/2 |   1/0 |  48.5 |   66.4 |   +4.7 |  0.84 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-07-22 | MLB   | ML     | Tampa Bay Rays          |  -108 | +0.932 | 2-for-0  |   2/0 |   1/0 |  52.3 |   63.0 |   +2.3 |  0.62 | HOLD     | 3.00u | WIN     |      +2.78 |
| 2026-07-22 | WNBA  | ML     | Indiana Fever           |  -512 | +0.981 | SHARP~   |   3/0 |   1/0 |  66.7 |   64.8 |  +16.7 |  3.76 | BOOST    | 5.00u | WIN     |      +0.98 |
| 2026-07-22 | WNBA  | ML     | Minnesota Lynx          |  -499 | +0.984 | HC-1     |   4/0 |   1/0 |  66.7 |   54.9 |  +16.7 |  2.27 | HOLD     | 5.00u | WIN     |      +1.00 |
| 2026-07-22 | MLB   | SPREAD | Boston Red Sox          |  +122 | +0.971 | SHARP~   |   1/0 |   1/0 |  58.4 |   65.2 |   +8.4 |  2.16 | HOLD     | 1.13u | WIN     |      +1.38 |
| 2026-07-22 | MLB   | SPREAD | Seattle Mariners        |  +136 | +0.971 | SHARP~   |   1/0 |   1/0 |  58.4 |   65.2 |   +8.4 |  2.16 | HOLD     | 1.13u | LOSS    |      -1.13 |
| 2026-07-22 | MLB   | SPREAD | Washington Nationals    |  +105 | +0.971 | SHARP~   |   1/0 |   1/0 |  58.4 |   65.2 |   +8.4 |  2.16 | HOLD     | 1.13u | WIN     |      +1.19 |
| 2026-07-22 | WNBA  | SPREAD | Chicago Sky             |  -112 | +0.968 | SHARP~   |   2/0 |   1/0 |  66.7 |   62.6 |  +16.7 |  3.43 | BOOST    | 5.00u | WIN     |      +4.46 |
| 2026-07-22 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.981 | SHARP    |   1/1 |   1/0 |  55.3 |   72.6 |  +18.1 |  4.80 | BOOST    | 5.06u | WIN     |      +4.60 |
| 2026-07-21 | MLB   | ML     | Los Angeles Dodgers     |  +100 | +0.988 | HC-1     |   2/1 |   2/1 |  54.5 |   72.0 |   +9.7 |  3.04 | BOOST    | 2.50u | WIN     |      +2.50 |
| 2026-07-21 | MLB   | ML     | Cleveland Guardians     |  -145 | +0.994 | HC-1     |   1/1 |   1/0 |  58.3 |   66.3 |   +7.7 |  1.02 | HOLD     | 2.00u | WIN     |      +1.38 |
| 2026-07-21 | MLB   | ML     | Toronto Blue Jays       |  -105 | +0.898 | SHARP~   |   2/4 |   1/2 |  55.7 |   61.4 |   +6.4 |  0.59 | HOLD     | 0.75u | LOSS    |      -0.75 |
| 2026-07-21 | MLB   | SPREAD | Boston Red Sox          |  +149 | +0.971 | SHARP~   |   1/0 |   1/0 |  58.3 |   66.3 |   +8.3 |  2.30 | HOLD     | 0.75u | WIN     |      +1.12 |
| 2026-07-21 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.971 | SHARP~   |   1/0 |   1/0 |  58.3 |   66.3 |   +8.3 |  2.30 | HOLD     | 0.75u | WIN     |      +0.68 |
| 2026-07-21 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.788 | SHARP    |   1/2 |   1/1 |  66.7 |   76.7 |  +16.9 |  5.50 | BOOST    | 5.06u | WIN     |      +4.60 |
| 2026-07-21 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.986 | 2-for-0  |   2/0 |   2/0 |  52.3 |   65.9 |   +2.3 |  1.03 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-21 | MLB   | TOTAL  | Under 9.5               |  -109 | +0.978 | SHARP~   |   1/0 |   1/0 |  55.7 |   56.6 |   +5.7 |  0.33 | HOLD     | 0.75u | LOSS    |      -0.75 |
| 2026-07-21 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.947 | SHARP~   |   1/1 |   1/0 |  51.2 |   50.4 |  +13.5 |  0.46 | HOLD     | 4.00u | WIN     |      +3.64 |
| 2026-07-21 | MLB   | TOTAL  | Under 13.5              |  -110 | +0.987 | SHARP    |   1/0 |   1/0 |  66.7 |   76.7 |  +16.7 |  5.55 | BOOST    | 5.06u | LOSS    |      -5.06 |
| 2026-07-20 | MLB   | ML     | Milwaukee Brewers       |  -206 | +0.889 | 2-for-0  |   2/0 |   1/0 |  54.3 |   56.8 |   +4.3 | -0.39 | HOLD     | 4.00u | WIN     |      +1.94 |
| 2026-07-20 | MLB   | SPREAD | Seattle Mariners        |  +149 | +0.984 | SHARP    |   1/0 |   1/0 |  58.8 |   69.5 |   +8.8 |  2.82 | HOLD     | 1.25u | WIN     |      +1.86 |
| 2026-07-20 | MLB   | SPREAD | Miami Marlins           |  -187 | +0.971 | SHARP    |   1/0 |   1/0 |  58.8 |   69.5 |   +8.8 |  2.82 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-07-20 | MLB   | SPREAD | St. Louis Cardinals     |  -206 | +0.983 | SHARP~   |   1/0 |   1/0 |  63.8 |   53.0 |  +13.8 |  0.27 | HOLD     | 1.88u | WIN     |      +0.91 |
| 2026-07-20 | MLB   | TOTAL  | Over 11.5               |  +104 | +0.982 | 2-for-0  |   3/0 |   2/0 |  53.1 |   65.4 |   +3.1 |  1.14 | HOLD     | 4.00u | WIN     |      +4.16 |
| 2026-07-20 | MLB   | TOTAL  | Over 10.5               |  +100 | +0.982 | SHARP    |   1/0 |   1/0 |  55.8 |   72.8 |   +5.8 |  3.02 | BOOST    | 1.69u | LOSS    |      -1.69 |
| 2026-07-20 | MLB   | TOTAL  | Over 12.5               |  -109 | +0.959 | SHARP    |   1/1 |   1/0 |  55.8 |   72.8 |   +5.8 |  4.56 | BOOST    | 2.03u | LOSS    |      -2.03 |
| 2026-07-19 | MLB   | ML     | Colorado Rockies        |  +141 | +0.974 | HC-1     |   5/0 |   3/0 |  50.8 |   71.0 |   +0.8 |  1.92 | HOLD     | 2.50u | LOSS    |      -2.50 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.526 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.076 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.008 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.007 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.034 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  492 |    +0.0856 |    -0.0381 | 0.0004 |  +0.019 |   0.953 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  492 |    +0.0816 |    +0.4837 | 0.0012 |  +0.034 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  492 |    -0.1773 |    +0.2703 | 0.0002 |  -0.013 |   2.900 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 492 |          +0.060 |           +0.010 |                   +0.044 |                   -0.011 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 492 |          -0.014 |           +0.324 |                   +0.002 |                   +0.103 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 492 |          -0.002 |           +0.185 |                   -0.026 |                   +0.022 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 492 |          -0.025 |           +0.122 |                   +0.001 |                   +0.068 | count of contributing AGAINST-side wallets                     |
| provenFor         | 492 |          +0.014 |           +0.195 |                   -0.003 |                   +0.056 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 492 |          -0.008 |           +0.098 |                   +0.007 |                   +0.036 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.890          | 166 | 91-75   |   54.8% |     +2.0% |
| MID (p33–p67)     | 19.950 … 26.070        | 162 | 89-73   |   54.9% |     +1.3% |
| HIGH (> p67)      | 48.906 … 31.193        | 164 | 93-71   |   56.7% |     +0.9% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       492 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8720 | average score across live picks                                 |
| SD                |    0.2098 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.378 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.921 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.554 / +0.962 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  432 | 234-198 |   54.2% |     +1.4% |  0.509 |        -0.028 | noise                                     |
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
    x-axis ["07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22"]
    y-axis "AUC" 0.4 --> 0.8
    line [0.469, 0.54, 0.539, 0.551, 0.542, 0.553, 0.611, 0.76, 0.719, 0.63, 0.581, 0.567, 0.535, 0.567]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22"]
    y-axis "edge (pp)" -15 --> 7
    line [2.3, 5.8, 5.3, -0.4, -3, -5.3, -0.6, -8.9, -13.8, -13.3, -4.4, -0.9, 1.5, 4.1]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-07-08 |    7 |   72 | 41-31  |   56.9% |     +9.5% |  0.469 |      +2.3pp |
| 2026-07-09 |    7 |   68 | 41-27  |   60.3% |    +16.2% |  0.540 |      +5.8pp |
| 2026-07-10 |    7 |   64 | 38-26  |   59.4% |    +12.0% |  0.539 |      +5.3pp |
| 2026-07-11 |    7 |   57 | 30-27  |   52.6% |     +1.2% |  0.551 |      -0.4pp |
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

> 🟢 **AUC is trending UP** — V12 is sharpening (0.516 avg in first half → 0.539 avg in second half · Δ = +0.023)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.3% | [-5.2%, +13.2%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.5% | [51.0%, 60.2%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.526 | [0.473, 0.576]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             55 | [10, 100]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       497 |
| Unique wallets ever on a FOR side            |                                                       148 |
| Avg FOR-side wallets per pick                |                                                      2.91 |
| Top-5 wallets' share of all FOR appearances  |                                                     29.7% |
| Top-10 wallets' share of all FOR appearances |                                                     46.8% |
| Top-20 wallets' share of all FOR appearances |                                                     65.1% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    2 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    3 | 4c64aa  | MLB        |   90 |   11 | 48-42  |   53.3% |     -0.9% |     -1.54 |     0.84× | WR50        |     -2.0% |     317 | 2026-07-22 |
|    4 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     501 | 2026-07-10 |
|    5 | 2f2a9e  | MLB,SOC,WNBA |   68 |   28 | 36-32  |   52.9% |     -7.2% |    -13.95 |     2.12× | CONFIRMED   |     -9.7% |     234 | 2026-07-20 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   62 |   34 | 33-29  |   53.2% |    +13.8% |    +23.92 |     1.48× | CONFIRMED   |    +11.5% |     402 | 2026-07-22 |
|    7 | 0cd77e  | MLB,SOC,UFC |   53 |    4 | 32-21  |   60.4% |    +11.9% |    +20.57 |     1.42× | CONFIRMED   |     +9.6% |     103 | 2026-07-22 |
|    8 | eeabaf  | MLB,NBA,SOC |   51 |    8 | 29-22  |   56.9% |     +9.1% |    +13.21 |     1.31× | CONFIRMED   |    +17.9% |     188 | 2026-07-22 |
|    9 | 0f9d74  | MLB,NBA,SOC,UFC |   46 |   26 | 22-24  |   47.8% |     -1.9% |     -2.57 |     0.53× | CONFIRMED   |    +24.0% |     199 | 2026-07-22 |
|   10 | 7923c4  | MLB,NBA,UFC |   36 |   13 | 22-14  |   61.1% |    +40.5% |    +30.33 |     0.75× | CONFIRMED   |     +9.0% |     170 | 2026-07-22 |
|   11 | 4b912c  | MLB,SOC    |   35 |   12 | 19-16  |   54.3% |     +3.3% |     +4.00 |     1.32× | CONFIRMED   |    -11.1% |     115 | 2026-07-21 |
|   12 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   13 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   30 |   21 | 16-14  |   53.3% |     -2.3% |     -2.03 |     1.29× | CONFIRMED   |    +10.2% |     130 | 2026-07-22 |
|   14 | 7da3d5  | MLB,SOC,UFC,WNBA |   27 |   27 | 10-17  |   37.0% |    -31.6% |    -26.35 |     4.92× | CONFIRMED   |     -9.4% |     129 | 2026-07-22 |
|   15 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   16 | 491f30  | MLB,SOC    |   25 |    4 | 17-8   |   68.0% |    +43.8% |    +35.89 |     0.95× | CONFIRMED   |     -8.8% |      64 | 2026-07-01 |
|   17 | bc35e3  | MLB,SOC,WNBA |   25 |   12 | 14-11  |   56.0% |     +6.1% |     +4.81 |     1.26× | CONFIRMED   |     +6.5% |     108 | 2026-07-19 |
|   18 | a82a75  | MLB,SOC,UFC |   23 |    8 | 12-11  |   52.2% |     +2.5% |     +2.00 |     0.85× | CONFIRMED   |     -8.7% |      72 | 2026-07-22 |
|   19 | f2f960  | MLB        |   22 |   10 | 11-11  |   50.0% |     -9.0% |     -6.89 |     2.41× | FLAT        |     +1.5% |      61 | 2026-07-22 |
|   20 | c911a4  | MLB,NBA,SOC |   21 |   12 | 11-10  |   52.4% |    +17.0% |    +10.19 |     4.63× | CONFIRMED   |    +54.3% |      77 | 2026-07-14 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-07-21 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | 7923c4  | MLB,NBA,UFC |   36 | 22-14  |   61.1% |     +40.5% |    +30.33 |     0.75× | 2026-07-22 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    6 | f2d227  | MLB,NBA    |   10 | 7-3    |   70.0% |     +27.3% |     +6.45 |     0.56× | 2026-07-20 |
|    7 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    8 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-07-14 |
|    9 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|   10 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |
|   11 | cd2f63  | MLB,NBA,SOC,WNBA |   62 | 33-29  |   53.2% |     +13.8% |    +23.92 |     1.48× | 2026-07-22 |
|   12 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   13 | b839b3  | MLB,NBA,SOC,UFC |   15 | 9-6    |   60.0% |     +12.2% |     +6.13 |     1.43× | 2026-07-21 |
|   14 | 0cd77e  | MLB,SOC,UFC |   53 | 32-21  |   60.4% |     +11.9% |    +20.57 |     1.42× | 2026-07-22 |
|   15 | eeabaf  | MLB,NBA,SOC |   51 | 29-22  |   56.9% |      +9.1% |    +13.21 |     1.31× | 2026-07-22 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 7da3d5  | MLB,SOC,UFC,WNBA |   27 | 10-17  |   37.0% |     -31.6% |    -26.35 |     4.92× | 2026-07-22 |
|    3 | 8ec926  | MLB,WNBA   |   12 | 5-7    |   41.7% |     -30.1% |    -11.75 |     6.21× | 2026-07-22 |
|    4 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-07-10 |
|    5 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    6 | c9bba3  | MLB,SOC    |   10 | 6-4    |   60.0% |      -9.9% |     -2.36 |     0.82× | 2026-07-18 |
|    7 | f2f960  | MLB        |   22 | 11-11  |   50.0% |      -9.0% |     -6.89 |     2.41× | 2026-07-22 |
|    8 | 2f2a9e  | MLB,SOC,WNBA |   68 | 36-32  |   52.9% |      -7.2% |    -13.95 |     2.12× | 2026-07-20 |
|    9 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   30 | 16-14  |   53.3% |      -2.3% |     -2.03 |     1.29× | 2026-07-22 |
|   10 | 0f9d74  | MLB,NBA,SOC,UFC |   46 | 22-24  |   47.8% |      -1.9% |     -2.57 |     0.53× | 2026-07-22 |
|   11 | ad88a3  | MLB,SOC    |   17 | 9-8    |   52.9% |      -1.2% |     -0.73 |     0.27× | 2026-07-07 |
|   12 | 4c64aa  | MLB        |   90 | 48-42  |   53.3% |      -0.9% |     -1.54 |     0.84× | 2026-07-22 |
|   13 | a82a75  | MLB,SOC,UFC |   23 | 12-11  |   52.2% |      +2.5% |     +2.00 |     0.85× | 2026-07-22 |
|   14 | 4b912c  | MLB,SOC    |   35 | 19-16  |   54.3% |      +3.3% |     +4.00 |     1.32× | 2026-07-21 |
|   15 | 70135d  | MLB,NBA    |   77 | 42-35  |   54.5% |      +4.7% |     +8.93 |     1.30× | 2026-07-10 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 27, ROI -31.6%), `1e8f33` (FOR# 94, ROI -10.7%), `f2f960` (FOR# 22, ROI -9.0%), `2f2a9e` (FOR# 68, ROI -7.2%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   990 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   171 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     4 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    44 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   217 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

> **Odds cap** (still live): ≤2.5u at +100 · ≤1.5u at +151 · ≤1.0u at +200.

### Wallet pool

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            172 |        42 |   19 |    7 |  104 |                     68 |
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
| v12     | 06-01 → present      |   53 |    497 | 632 | 276-221 |  55.5% |      4.3% |     +59.74 |    +0.12 | 0.502 |        0.2497 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  437 |    +2.2pp |    +13.3pp |          +0.293 |   -0.047 |    +0.0903 | 🟡 mixed |
| v12 − v10          | +  435 |    +7.1pp |    +23.1pp |          +0.433 |   +0.108 |    +0.0307 | 🟢 better |
| v12 − v11          | +  386 |    +0.6pp |     +1.5pp |          +0.059 |   +0.058 |    +0.0145 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 436n 54.1% +2% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 3n 66.7% -13%  | 7n 85.7% +31%  | 497n 55.5% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 101n +1%      | 150n +2%      | 107n +15%     | 70n -3%       | 64n +11%      | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1411 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 731 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 492 / 731 (67%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 492 / 731 (67%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 492 / 731 (67%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 492 / 731 (67%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 492 / 731 (67%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 492 / 731 (67%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 492 / 731 (67%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 731 / 731 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 731 / 731 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 731 / 731 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 731 / 731 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 731 / 731 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 731 / 731 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 724 / 731 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 722 / 731 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 731 / 731 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 730 / 731 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 433 / 731 (59%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 730 / 731 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 433 / 731 (59%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 432 / 731 (59%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 731 / 731 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 731 / 731 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 731 / 731 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 730 / 731 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 731 / 731 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd maxForContrib     | 730 |      |    -0.069 |    -0.073 |      -0.071 |      -0.055 |  0.480 |
|    2 | wd contribMargin     | 731 |      |    -0.041 |    -0.126 |      -0.070 |      -0.113 |  0.460 |
|    3 | wd forAvgSize        | 730 |      |    -0.034 |    +0.022 |      -0.056 |      -0.029 |  0.503 |
|    4 | wd contribFor        | 731 |      |    -0.043 |    -0.075 |      -0.053 |      -0.090 |  0.466 |
|    5 | qMargin              | 492 |  🟢  |    +0.067 |    +0.013 |      +0.046 |      -0.010 |  0.523 |
|    6 | V12 forMean          | 492 |  🟢  |    +0.060 |    +0.010 |      +0.044 |      -0.011 |  0.521 |
|    7 | wd forCount          | 730 |      |    -0.026 |    +0.089 |      -0.040 |      -0.030 |  0.467 |
|    8 | wd agCount           | 433 |      |    +0.008 |    +0.275 |      +0.038 |      +0.110 |  0.486 |
|    9 | hcMargin             | 731 |      |    -0.017 |    +0.215 |      -0.038 |      +0.055 |  0.506 |
|   10 | wd sizeMargin        | 432 |      |    -0.002 |    -0.007 |      -0.036 |      -0.063 |  0.497 |
|   11 | provenFor            | 731 |      |    -0.022 |    +0.051 |      -0.033 |      -0.041 |  0.488 |
|   12 | provenTotal          | 731 |      |    -0.027 |    +0.018 |      -0.029 |      -0.038 |  0.489 |
|   13 | countMargin          | 492 |      |    +0.014 |    +0.140 |      -0.028 |      -0.005 |  0.489 |
|   14 | provenMargin         | 731 |      |    -0.006 |    +0.074 |      -0.028 |      -0.020 |  0.494 |
|   15 | V12 forCount         | 492 |  🟢  |    -0.002 |    +0.185 |      -0.026 |      +0.022 |  0.501 |
|   16 | ags (v11)            | 731 |      |    -0.000 |    -0.002 |      -0.025 |      -0.064 |  0.507 |
|   17 | wd maxShare          | 731 |      |    +0.016 |    -0.040 |      +0.021 |      +0.022 |  0.515 |
|   18 | agsV12               | 492 |  🟢  |    +0.034 |    +0.008 |      +0.019 |      +0.007 |  0.526 |
|   19 | peakStars            | 731 |      |    +0.001 |    +0.085 |      -0.018 |      -0.008 |  0.494 |
|   20 | wd agAvgSize         | 433 |      |    -0.043 |    -0.001 |      -0.018 |      +0.009 |  0.491 |
|   21 | provenAg             | 731 |      |    -0.027 |    +0.156 |      -0.015 |      +0.057 |  0.490 |
|   22 | wd contribAg         | 731 |      |    -0.012 |    +0.143 |      +0.010 |      +0.054 |  0.498 |
|   23 | lockPinnProb         | 724 |      |    +0.147 |    +0.146 |      +0.008 |      -0.142 |  0.576 |
|   24 | clv                  | 722 |      |    +0.011 |    -0.020 |      -0.002 |      -0.001 |  0.519 |
|   25 | V12 agMean           | 492 |  🟢  |    -0.014 |    +0.324 |      +0.002 |      +0.103 |  0.486 |
|   26 | V12 agCount          | 492 |  🟢  |    -0.025 |    +0.122 |      +0.001 |      +0.068 |  0.504 |

> **Top 3 univariate features by PnL correlation:** `wd maxForContrib` (r = -0.071), `wd contribMargin` (r = -0.070), `wd forAvgSize` (r = -0.056).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd maxForContrib` — r(unit-ret) = -0.071, AUC = 0.480. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd maxForContrib` · r(unit-ret) = -0.071 · AUC = 0.480

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 36.900          | 245 | 134-111 |   54.7% |     +1.1% |
| MID (p33–p67)     | 52.400 … 53.000          | 243 | 140-103 |   57.6% |     +2.9% |
| HIGH (> p67)      | 100.000 … 132.400        | 242 | 126-116 |   52.1% |     -1.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.070 · AUC = 0.460

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -22.500        | 244 | 142-102 |   58.2% |     +4.3% |
| MID (p33–p67)     | 57.800 … 45.600          | 243 | 137-106 |   56.4% |     +1.6% |
| HIGH (> p67)      | 174.100 … 138.100        | 244 | 121-123 |   49.6% |     -3.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd forAvgSize` · r(unit-ret) = -0.056 · AUC = 0.503

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.675 … 0.235            | 244 | 131-113 |   53.7% |     +0.9% |
| MID (p33–p67)     | 0.777 … 0.800            | 243 | 136-107 |   56.0% |     +2.0% |
| HIGH (> p67)      | 3.837 … 1.650            | 243 | 133-110 |   54.7% |     -0.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribFor` · r(unit-ret) = -0.053 · AUC = 0.466

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 53.000          | 244 | 134-110 |   54.9% |     +2.0% |
| MID (p33–p67)     | 89.000 … 64.300          | 243 | 152-91  |   62.6% |     +5.7% |
| HIGH (> p67)      | 212.200 … 138.100        | 244 | 114-130 |   46.7% |     -5.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.046 · AUC = 0.523

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.890            | 164 | 92-72   |   56.1% |     +3.4% |
| MID (p33–p67)     | 19.950 … 26.070          | 164 | 86-78   |   52.4% |     -0.6% |
| HIGH (> p67)      | 46.556 … 31.193          | 164 | 95-69   |   57.9% |     +1.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd maxForContrib | wd contribMargin | wd forAvgSize  | wd contribFor  | qMargin        | V12 forMean    | wd forCount    | wd agCount     |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd maxForContrib |  1.000         |         +0.524 |         +0.479 |         +0.674 |         +0.230 |         +0.310 |         +0.590 |         +0.360 |
| wd contribMargin |         +0.524 |  1.000         |         +0.282 |         +0.784 |         +0.066 |         +0.096 |         +0.744 |         -0.091 |
| wd forAvgSize |         +0.479 |         +0.282 |  1.000         |         +0.418 |         +0.254 |         +0.331 |         +0.386 |         +0.248 |
| wd contribFor |         +0.674 |         +0.784 |         +0.418 |  1.000         |         +0.095 |         +0.207 |         +0.964 |         +0.514 |
| qMargin     |         +0.230 |         +0.066 |         +0.254 |         +0.095 |  1.000         |         +0.964 |         +0.047 |         +0.075 |
| V12 forMean |         +0.310 |         +0.096 |         +0.331 |         +0.207 |         +0.964 |  1.000         |         +0.155 |         +0.199 |
| wd forCount |         +0.590 |         +0.744 |         +0.386 |         +0.964 |         +0.047 |         +0.155 |  1.000         |         +0.508 |
| wd agCount  |         +0.360 |         -0.091 |         +0.248 |         +0.514 |         +0.075 |         +0.199 |         +0.508 |  1.000         |

> 🔴 **Strong collinearity detected:** `wd contribFor` and `wd forCount` have r = +0.964. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 315 picks · features = 8 (+ intercept) · multiple R² = **0.0233** · adjusted R² = **-0.0055** · residual sd = 0.952

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.5998 |   0.3736 | -1.61 (~sig) |        1 |
|    2 | wd forCount          |     |    +0.2559 |   0.2160 | +1.18        |        2 |
|    3 | wd agCount           |     |    +0.2341 |   0.1703 | +1.37        |        3 |
|    4 | wd contribMargin     |     |    +0.2194 |   0.2412 | +0.91        |        4 |
|    5 | V12 forMean          |  🟢 |    +0.1183 |   0.2467 | +0.48        |        5 |
|    6 | qMargin              |  🟢 |    -0.0431 |   0.2388 | -0.18        |        6 |
|    7 | wd forAvgSize        |     |    -0.0324 |   0.0644 | -0.50        |        7 |
|    8 | wd maxForContrib     |     |    -0.0017 |   0.0805 | -0.02        |        8 |
| —    | (intercept)          |     |    +0.0477 |   0.0536 |    +0.89 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.118), `qMargin` (β = -0.043)
- V12 IGNORES: `wd contribFor` (β = -0.600, t = -1.61), `wd forCount` (β = +0.256, t = +1.18), `wd agCount` (β = +0.234, t = +1.37), `wd contribMargin` (β = +0.219, t = +0.91), `wd forAvgSize` (β = -0.032, t = -0.50), `wd maxForContrib` (β = -0.002, t = -0.02)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.530 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.574 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.043.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.3pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd contribFor` (β = -0.600, t = -1.61). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0055 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*