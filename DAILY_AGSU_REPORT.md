# AGS-Unified — V12 Daily Monitor

**Generated:** Sunday, September 27, 2026 at 1:12 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (119 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (119 days ago), V12 has evaluated **4758** picks, shipped **1159** for real money (24.4% ship rate), and muted the other **3599**. On the shipped picks V12 has gone **634-525** (54.7% win), staked **3259.85u**, and returned **+149.68u** at **+4.6% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            119 |
| Picks V12 has evaluated             |                           4758 |
| Picks SHIPPED (units > 0)           |                           1159 |
| Picks MUTED (score ≤ 0, FADE)       |                           3599 |
| Ship rate                           |                          24.4% |
| Live W-L                            |                        634-525 |
| Live Win %                          |                          54.7% |
| Live PnL (units)                    |                        +149.68 |
| Live ROI                            |                          +4.6% |
| Avg PnL / day                       |                         +1.26u |
| Most recent action (2026-09-28)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.6% ROI** across 1159 live picks (+149.68u real PnL).
- Mute rule is **saving money** — the 2465 muted picks would have lost -79.04u at flat 1u (-3.2% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.26u/day** on average since launch.
- Best sport: **NBA** — 10 live, 3-7, 29.1% ROI, +2.33u.
- Tape era (2026-07-15+): **398-332** · +4.9% ROI · +103.07u on 730 graded — see § 5.

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

**Full book:** 119d · 1159 live · 634-525 · **+149.68u** · +4.6% ROI · +1.26u/day.

_Prior to table (2026-06-01 → 2026-09-07): 971 live · 541-430 · +176.50u · cum through prior = +176.50u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-09-08 |        46 |    9 |    25 | 4-5        |  44.4% |     26.00 |      -1.59 |     -6.1% |    +174.91 |
| 2026-09-09 |        52 |    5 |    33 | 2-3        |  40.0% |     13.00 |      -2.44 |    -18.8% |    +172.47 |
| 2026-09-10 |        19 |    5 |     8 | 0-5        |   0.0% |     13.50 |     -13.50 |   -100.0% |    +158.97 |
| 2026-09-11 |        58 |   10 |    32 | 5-5        |  50.0% |     37.00 |      -6.08 |    -16.4% |    +152.89 |
| 2026-09-12 |       155 |   18 |   113 | 12-6       |  66.7% |     55.90 |     +25.91 |     46.4% |    +178.80 |
| 2026-09-13 |        85 |   16 |    50 | 9-7        |  56.3% |     55.90 |      +7.01 |     12.5% |    +185.81 |
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
| 2026-09-27 |        66 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +149.68 |
| 2026-09-28 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +149.68 |

> **Trajectory.** Last 3 days (5.0% ROI) ≈ prior book (4.6%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-26**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 25 | 18-7 | +41.4% | +43.46u | +1.74u | +15.9% |
| 🟢 2 | MINI- (gate-cut) | C | 23 | 14-9 | +24.8% | +9.41u | +0.41u | +55.2% |
| 🟢 3 | DISSENT rescue | D | 24 | 13-11 | +12.0% | +3.05u | +0.13u | — |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 142 | 87-55 | +9.3% | +61.60u | sized UP after path |
| 2 | Tape HOLD (mid) | 517 | 278-239 | +4.9% | +63.02u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 31 | 14-17 | -31.1% | -20.68u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 89 | 40-49 | -5.6% | -5.00u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 259 | 136-123 | -1.9% | -4.79u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 1213 | 609-604 | -0.3% | -4.04u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 25 | 18-7 | 72.0% | 105.0u | +43.46u | +41.4% | +1.74u | 2 | +15.9% | +3.85u | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 110 | 66-44 | 60.0% | 404.7u | +22.85u | +5.6% | +0.21u | 4 | +29.8% | -1.20u | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 120 | 68-52 | 56.7% | 440.0u | +33.95u | +7.7% | +0.28u | 7 | -57.7% | -9.00u | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 94 | 44-50 | 46.8% | 326.8u | -24.88u | -7.6% | -0.26u | 1 | -100.0% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 122 | 63-59 | 51.6% | 340.3u | -1.71u | -0.5% | -0.01u | 9 | -0.1% | +2.20u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 115 | 65-50 | 56.5% | 313.9u | +17.42u | +5.6% | +0.15u | 8 | -14.7% | +2.19u | 🔻 cooling |
| MINI- (gate-cut) | `MINI-` | C | 1u | 23 | 14-9 | 60.9% | 37.9u | +9.41u | +24.8% | +0.41u | 3 | +55.2% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 0 | — | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 142 | 87-55 | 61.3% | 663.8u | +61.60u | +9.3% | 7 | -0.8% | +1.16u |
| Tape HOLD (mid) | TAPE | staked | 517 | 278-239 | 53.8% | 1274.8u | +63.02u | +4.9% | 69 | +3.3% | -1.32u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 31 | 14-17 | 45.2% | 66.5u | -20.68u | -31.1% | 1 | +44.5% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 259 | 136-123 | 52.5% | 259.0u | -4.79u | -1.9% | 51 | -16.6% | -1.76u |
| fadeTop≥60 MUTE | E | CF 1u | 89 | 40-49 | 44.9% | 89.0u | -5.00u | -5.6% | 19 | +1.1% | -1.09u |
| Score FADE (≤0 → 0u) | score | CF 1u | 1213 | 609-604 | 50.2% | 1213.0u | -4.04u | -0.3% | 185 | -5.9% | -7.21u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 4 / +10% | — |
| TOP | 42 / +1% | 24 / +4% | 4 / -16% |
| RANK | 69 / +5% | 12 / +4% | — |
| SHARP | 22 / -25% | 46 / -1% | 1 / -100% |
| SHARP-LEAN | 91 / -0% | 26 / +2% | 4 / -63% |
| MINI | 60 / -3% | 13 / +52% | 5 / -25% |
| MINI- | 8 / +10% | 2 / +52% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-26)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| HC-2 SUPER | 1 | 1-0 | +3.85u | +64.2% |
| SHARP-LEAN EDGE/net ONE | 3 | 2-1 | +2.20u | +27.5% |
| MINI (gate-pass) | 3 | 2-1 | +2.19u | +17.7% |
| HC-1 TOP | 2 | 1-1 | -1.20u | -17.1% |
| RANK 2-for-0 rescue | 2 | 0-2 | -9.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  42 | 18-7   |  72.0% |      105.00 |     +43.46 |     41.4% |
| TOP PICK (TOP+/TOP)       |  4-5u | 262 | 81-58  |  58.3% |      537.20 |     +10.91 |      2.0% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 1013 | 181-169 |  51.7% |     1156.05 |      +0.75 |      0.1% |
| STRONG (MINI)             |    3u | 220 | 65-50  |  56.5% |      313.85 |     +17.42 |      5.6% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 183 | 29-23  |  55.8% |       68.25 |     +10.44 |     15.3% |
| **STAKED TOTAL** |     — | 681 | 374-307 |  54.9% |     2180.35 |     +82.98 |     +3.8% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  42 | 18-7   |  72.0% |      105.00 |     +43.46 |     41.4% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 233 | 66-44  |  60.0% |      404.70 |     +22.85 |      5.6% |
| B · 2-for-0 rescue    | RANK        |    4u | 228 | 68-52  |  56.7% |      439.95 |     +33.95 |      7.7% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 590 | 63-59  |  51.6% |      340.34 |      -1.71 |     -0.5% |
| C · proven-$ consensus | SHARP       |    3u | 181 | 44-50  |  46.8% |      326.76 |     -24.88 |     -7.6% |
| A · mini-HC (gate-pass) | MINI        |    3u | 220 | 65-50  |  56.5% |      313.85 |     +17.42 |      5.6% |
| C · mini gate-cut     | MINI-       |    1u |  54 | 14-9   |  60.9% |       37.90 |      +9.41 |     24.8% |
| A · margin 3+         | CONFIRMED   |    1u |  16 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u | 113 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 782 picks tracked at 0u (would-be 379-403, 48.5% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (30-12, +43.46u)  ·  🟢 TOP PICK (142-120, +10.91u)  ·  🟠 SHARP PLAY (510-503, +0.75u)  ·  🔴 STRONG (115-105, +17.42u)  ·  🟣 LEAN (100-83, +10.44u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81, 39.81, 39.81, 39.81, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 39.61, 39.61, 39.61, 43.46]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 8.23, 8.23, 8.23, 8.23, 8.23, 12.11, 10.91]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 37.04, 38.07, 38.07, 38.07, 21.67, 21.67, 21.67, 15.67, 15.67, 17.52, 13.52, 13.78, 13.56, 7.55, 0.75]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 14.28, 22.4, 22.4, 21.31, 21.31, 21.31, 21.31, 22.23, 17.23, 17.23, 17.23, 17.23, 17.23, 15.23, 17.42]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66, 66, 66, 66, 67, 69, 69, 70, 70, 70, 71, 69, 69, 70, 71]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 53, 54, 54, 54, 54, 54, 54, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 49, 49, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 55, 56, 56, 56, 56, 56, 56, 56, 55, 55, 54, 55, 55, 55, 52]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 58, 57, 58, 58, 58, 57, 57, 58, 56, 56, 55, 54, 55, 55, 55]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 3446 | 3436 | 3330 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 259 | 136-123 | 52.5% | 62.50u | -2.75u | -4.4% |
| HOLD      | 1159 | 600-559 | 51.8% | 1277.82u | +60.02u | +4.7% |
| BOOST     | 344 | 190-154 | 55.2% | 667.28u | +63.68u | +9.5% |
| FAIL_OPEN | 84 | 44-40 | 52.4% | 68.50u | -19.79u | -28.9% |
| PASS      | 1484 | 743-741 | 50.1% | 13.50u | -1.52u | -11.3% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 1225 | 637-588 | 52.0% | +11.83u |
| hold (0–2.89) | path u | 1377 | 689-688 | 50.0% | +46.82u |
| boost (≥2.89) | ×1.35 | 419 | 226-193 | 53.9% | +61.63u |

_Score coverage: **3021/3330** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 259 | +4.42u | -4.42u | +164.75u | +169.17u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 144 | +42.41u | +63.68u | +21.27u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-27 | MLB | Arizona Diamondbacks | SHARP~ | 3.05 | BOOST | 1.00u | 0.00u | — |
| 2026-09-27 | MLB | Baltimore Orioles | CONFIRMED-UNOPP | -0.17 | MUTE | 2.00u | 2.50u | — |
| 2026-09-27 | MLB | Kansas City Royals - P | SHARP~ | -1.22 | MUTE | 2.00u | 0.00u | — |
| 2026-09-27 | MLB | Washington Nationals - | HC-1 | 2.90 | BOOST | 1.00u | 0.00u | — |
| 2026-09-27 | MLB | Detroit Tigers - Playe | CONFIRMED-UNOPP | -1.01 | MUTE | 1.00u | 0.00u | — |
| 2026-09-27 | MLB | Minnesota Twins - Play | PATH-D | -1.23 | MUTE | 1.00u | 1.00u | — |
| 2026-09-27 | NFL | 49ers | SHARP~ | 6.27 | BOOST | 1.00u | 0.00u | — |
| 2026-09-27 | NFL | Ravens | SHARP~ | 4.34 | BOOST | 1.00u | 0.00u | — |
| 2026-09-27 | NFL | Colts | CONFIRMED-Q1 | 3.17 | BOOST | 2.00u | 0.00u | — |
| 2026-09-27 | NFL | Rams | MINI- | 3.92 | BOOST | 4.00u | 0.00u | — |
| 2026-09-27 | NFL | Raiders | SHARP | 4.50 | BOOST | 1.50u | 0.00u | — |
| 2026-09-27 | NFL | Jaguars | HC-1 | 6.51 | BOOST | 4.00u | 5.40u | — |
| 2026-09-27 | MLB | Colorado Rockies | SHARP~ | -0.96 | MUTE | 2.00u | 0.00u | — |
| 2026-09-27 | MLB | Detroit Tigers - Playe | PATH-D | -1.78 | MUTE | 1.00u | 0.00u | — |
| 2026-09-27 | NFL | Ravens | CONFIRMED-UNOPP | -0.38 | MUTE | 1.00u | 0.00u | — |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.57** · nPriors=660 · source=expanding_q1 · asOf=2026-09-27 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 3000 | 2882 | 2784 | 595 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 234 | 106-128 | 45.3% | 15.00u | -7.29u | -48.6% |
| HOLD      | 597 | 310-287 | 51.9% | 366.50u | +2.35u | +0.6% |
| FAIL_OPEN | 70 | 31-39 | 44.3% | 48.90u | -2.73u | -5.6% |
| EXEMPT    | 1244 | 662-582 | 53.2% | 1133.05u | +83.03u | +7.3% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -249.7 … -3.8 | 111 | 46-65 | 41.4% | 0.0u | +0.00u | — |
| Q2 | -3.5 … 1.1 | 111 | 51-60 | 45.9% | 37.9u | +15.57u | +41.1% |
| Q3 | 1.2 … 6.2 | 111 | 63-48 | 56.8% | 66.5u | -4.29u | -6.5% |
| Q4 | 6.3 … 19.2 | 111 | 57-54 | 51.4% | 106.0u | -23.50u | -22.2% |
| Q5 | 19.3 … 1802.6 | 112 | 64-48 | 57.1% | 116.1u | +12.59u | +10.8% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 234 | 106-128 | -12.99u | +12.99u | +157.40u | +144.41u |

> 🟢 **Mute is saving money** (Δ +12.99u · muted WR 45.3%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 106 | 43-63 | 40.6% | 130.9u | -18.39u |
| CFB | 28 | 13-15 | 46.4% | 51.9u | +12.54u |
| MLB | 144 | 68-76 | 47.2% | 163.5u | -7.17u |
| NFL | 24 | 8-16 | 33.3% | 32.9u | -16.24u |
| SOC | 9 | 4-5 | 44.4% | 12.5u | +2.90u |
| UFC | 1 | 0-1 | 0.0% | 1.0u | -1.00u |
| WNBA | 28 | 13-15 | 46.4% | 30.0u | -4.02u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-26 | CFB | Hawai'i | SHARP~ | -7.8 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | CFB | USC | SHARP~ | -53.6 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | UFC | Sedriques Dumas | CONFIRMED-Q1 | -27.5 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | CFB | Ole Miss | — | 0.0 | -0.7 | 2.00u | LOSS |
| 2026-09-26 | CFB | Missouri State | SHARP | -11.3 | -0.7 | 3.00u | WIN |
| 2026-09-26 | CFB | Nebraska | — | 8.7 | -0.7 | 4.00u | WIN |
| 2026-09-26 | CFB | Boston College | SHARP | -5.3 | -0.7 | 2.50u | WIN |
| 2026-09-26 | MLB | Colorado Rockies | — | 16.5 | -0.7 | 1.00u | WIN |
| 2026-09-26 | MLB | San Francisco Giants | CONFIRMED-UNOPP | -8.8 | -0.7 | 1.00u | WIN |
| 2026-09-26 | MLB | Minnesota Twins | SHARP~ | -2.0 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | MLB | Over 8.5 | SHARP~ | -0.8 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | MLB | Under 7.5 | SHARP~ | -4.9 | -0.7 | 1.00u | WIN |
| 2026-09-25 | MLB | Boston Red Sox | CONFIRMED-UNOPP | -2.8 | -0.7 | 1.00u | WIN |
| 2026-09-25 | MLB | Los Angeles Dodgers | SHARP~ | -22.5 | -0.7 | 1.00u | WIN |
| 2026-09-25 | MLB | Philadelphia Phillies | SHARP~ | -1.3 | -0.7 | 1.00u | LOSS |
| 2026-09-25 | CFB | Over 49.5 | — | -1.6 | -0.7 | 4.00u | WIN |
| 2026-09-25 | MLB | Over 6.5 | SHARP~ | -10.0 | -0.7 | 1.00u | WIN |
| 2026-09-25 | MLB | Over 6.5 | SHARP~ | -12.8 | -0.7 | 1.00u | WIN |
| 2026-09-24 | MLB | Atlanta Braves | SHARP~ | -80.1 | -0.7 | 1.00u | LOSS |
| 2026-09-24 | MLB | Boston Red Sox | — | -5.6 | -0.7 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 104 | 52-52 | 50.0% | 324.5u | -1.48u | -0.5% |
| Muted (Q1 → 0u) | 234 | 106-128 | 45.3% | 15.0u | -7.29u | -48.6% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 177–103 · 63.2% · +13.7%); **5–10 is the hole** (112–103 · 52.1% · +0.4%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 941 tickets · cov 912/941 (stamp 710 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 417 | 213–204 | 51.1% | -2.8% |
| 5–10 | 215 | 112–103 | 52.1% | +0.4% |
| ≥10 | 280 | 177–103 | 63.2% | +13.7% |
| All | 941 | 516–425 | 54.8% | +4.6% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 55.7% (79) | 69.4% (108) |
| B | 54.4% (79) | 57.1% (14) | 63% (27) |
| C | 37.5% (40) | 44.8% (67) | 56% (116) |

##### Jul 15+ · 730 tickets · cov 707/730 (stamp 705 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 311 | 160–151 | 51.4% | -0.2% |
| 5–10 | 176 | 89–87 | 50.6% | -0.5% |
| ≥10 | 220 | 138–82 | 62.7% | +11.5% |
| All | 730 | 398–332 | 54.5% | +4.9% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 54% (50) | 70.1% (67) |
| B | 54.7% (53) | 44.4% (9) | 60% (20) |
| C | 36.8% (19) | 45.2% (62) | 56.6% (106) |

##### Yesterday (Sep 26) · 18 tickets · cov 18/18 (stamp 18 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 3 | 1–2 | 33.3% | -44.5% |
| 5–10 | 8 | 5–3 | 62.5% | +11.0% |
| ≥10 | 7 | 5–2 | 71.4% | +10.1% |
| All | 18 | 11–7 | 61.1% | +5.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | 50% (2) | 75% (4) |
| B | — | 0% (1) | 0% (1) |
| C | — | 50% (2) | 100% (1) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 941 tickets · cov 932/941 (stamp 721 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 635 | 354–281 | 55.7% | +5.1% |
| 5–10 | 155 | 79–76 | 51.0% | +2.4% |
| ≥10 | 142 | 80–62 | 56.3% | +7.0% |
| All | 941 | 516–425 | 54.8% | +4.6% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.9% (195) | 49.1% (53) | 71.9% (57) |
| B | 58.1% (93) | 50% (14) | 53.8% (13) |
| C | 50.4% (129) | 54.9% (51) | 40.8% (49) |

##### Jul 15+ · 730 tickets · cov 722/730 (stamp 721 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 485 | 276–209 | 56.9% | +8.5% |
| 5–10 | 132 | 66–66 | 50.0% | +1.3% |
| ≥10 | 105 | 53–52 | 50.5% | -2.7% |
| All | 730 | 398–332 | 54.5% | +4.9% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 62.4% (101) | 45.9% (37) | 63.9% (36) |
| B | 55.4% (65) | 50% (10) | 57.1% (7) |
| C | 53.9% (102) | 54.2% (48) | 37.5% (40) |

##### Yesterday (Sep 26) · 18 tickets · cov 18/18 (stamp 18 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 15 | 9–6 | 60.0% | -1.2% |
| 5–10 | 2 | 1–1 | 50.0% | -4.2% |
| ≥10 | 1 | 1–0 | 100.0% | +64.2% |
| All | 18 | 11–7 | 61.1% | +5.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 60% (5) | — | 100% (1) |
| B | 0% (2) | — | — |
| C | 66.7% (3) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 941 tickets · cov 910/941 (stamp 702 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 205 | 103–102 | 50.2% | -9.9% |
| 0–2.89 | 513 | 276–237 | 53.8% | +6.5% |
| ≥2.89 | 192 | 123–69 | 64.1% | +13.5% |
| All | 941 | 516–425 | 54.8% | +4.6% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.1% (177) | 75.3% (77) |
| B | 59.5% (37) | 54.7% (64) | 57.9% (19) |
| C | 25% (12) | 49.2% (132) | 53.8% (78) |

##### Jul 15+ · 730 tickets · cov 705/730 (stamp 702 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 136 | 75–61 | 55.1% | +3.8% |
| 0–2.89 | 422 | 222–200 | 52.6% | +4.2% |
| ≥2.89 | 147 | 90–57 | 61.2% | +9.3% |
| All | 730 | 398–332 | 54.5% | +4.9% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.3% (120) | 74.5% (47) |
| B | 57.1% (21) | 55.1% (49) | 50% (12) |
| C | 100% (1) | 49.6% (113) | 52.8% (72) |

##### Yesterday (Sep 26) · 18 tickets · cov 18/18 (stamp 18 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 5 | 2–3 | 40.0% | -34.7% |
| 0–2.89 | 10 | 7–3 | 70.0% | +17.8% |
| ≥2.89 | 3 | 2–1 | 66.7% | +6.7% |
| All | 18 | 11–7 | 61.1% | +5.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 50% (4) | 100% (2) |
| B | 0% (1) | — | 0% (1) |
| C | 100% (1) | 50% (2) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 730 | 398-332 | 54.5% | 2083.60u | +103.07u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 730/730 | 3.16 | 3.01 | +0.15 | 2.00 | 2.00 |
| depth   | #A sharps        | 730/730 | 1.74 | 1.72 | +0.01 | 1.00 | 1.00 |
| depth   | #F − #A          | 730/730 | 1.42 | 1.29 | +0.14 | 1.00 | 1.00 |
| depth   | proven F         | 730/730 | 2.20 | 2.17 | +0.03 | 2.00 | 2.00 |
| depth   | proven A         | 730/730 | 0.86 | 0.89 | -0.02 | 0.00 | 0.00 |
| depth   | proven F−A       | 730/730 | 1.34 | 1.29 | +0.05 | 1.00 | 1.00 |
| depth   | v12 F count      | 730/730 | 3.14 | 2.97 | +0.18 | 2.00 | 2.00 |
| depth   | v12 A count      | 730/730 | 1.79 | 1.77 | +0.03 | 1.00 | 1.00 |
| depth   | WA ForN          | 730/730 | 2.45 | 2.42 | +0.03 | 2.00 | 2.00 |
| depth   | WA AgN           | 730/730 | 1.39 | 1.47 | -0.07 | 1.00 | 1.00 |
| depth   | CLV ForN         | 729/730 | 2.82 | 2.68 | +0.14 | 2.00 | 2.00 |
| depth   | CLV AgN          | 729/730 | 1.66 | 1.65 | +0.01 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 730/730 | 0.31 | 0.29 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 705/730 | 56.63 | 55.53 | +1.10 | 54.80 | 54.59 |
| quality | AgWR             | 481/730 | 46.62 | 47.95 | -1.33 | 47.97 | 48.84 |
| quality | TopFor WR        | 705/730 | 62.28 | 61.17 | +1.11 | 58.63 | 58.41 |
| quality | TopAg WR         | 481/730 | 50.02 | 51.11 | -1.09 | 50.89 | 51.20 |
| quality | EDGE             | 705/730 | 8.84 | 6.81 | +2.03 | 7.00 | 5.17 |
| quality | ForCLV           | 721/730 | 63.22 | 63.43 | -0.21 | 63.60 | 63.92 |
| quality | AgCLV            | 513/730 | 62.16 | 61.42 | +0.74 | 63.13 | 62.78 |
| quality | netCLV           | 721/730 | 1.11 | 1.85 | -0.73 | 1.15 | 1.70 |
| quality | Tape             | 702/730 | 1.93 | 1.61 | +0.32 | 1.47 | 1.26 |
| quality | V12 score        | 730/730 | 0.77 | 0.75 | +0.02 | 0.95 | 0.92 |
| quality | V12 forMean      | 730/730 | 31.28 | 27.32 | +3.96 | 25.82 | 20.05 |
| quality | V12 agMean       | 730/730 | 4.73 | 4.76 | -0.03 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 705/730 | 0.552 | +0.012 | +0.098 | +2.03 | 🟡 mild OK |
|    2 | AgWR             | quality | 481/730 | 0.452 | +0.149 | -0.097 | -1.33 | 🟡 mild OK |
|    3 | V12 score        | quality | 730/730 | 0.541 | -0.053 | +0.032 | +0.02 | 🟡 mild OK |
|    4 | V12 forMean      | quality | 730/730 | 0.533 | +0.224 | +0.072 | +3.96 | flat |
|    5 | V12 agMean       | quality | 730/730 | 0.469 | +0.334 | -0.002 | -0.03 | flat |
|    6 | TopAg WR         | quality | 481/730 | 0.469 | +0.114 | -0.062 | -1.09 | flat |
|    7 | Tape             | quality | 702/730 | 0.529 | -0.095 | +0.057 | +0.32 | flat |
|    8 | TopFor WR        | quality | 705/730 | 0.527 | +0.210 | +0.053 | +1.11 | flat |
|    9 | AgCLV            | quality | 513/730 | 0.526 | -0.018 | +0.049 | +0.74 | flat |
|   10 | proven A         | depth   | 730/730 | 0.475 | +0.310 | -0.008 | -0.02 | flat |
|   11 | netCLV           | quality | 721/730 | 0.475 | -0.154 | -0.032 | -0.73 | flat |
|   12 | ForCLV           | quality | 721/730 | 0.479 | -0.221 | -0.011 | -0.21 | flat |
|   13 | ForWR            | quality | 705/730 | 0.521 | +0.071 | +0.063 | +1.10 | flat |
|   14 | unopposed (A=0)  | depth   | 730/730 | 0.518 | +0.217 | +0.027 | +0.02 | flat |
|   15 | proven F−A       | depth   | 730/730 | 0.514 | +0.196 | +0.016 | +0.05 | flat |
|   16 | CLV ForN         | depth   | 729/730 | 0.513 | +0.277 | +0.035 | +0.14 | flat |
|   17 | WA AgN           | depth   | 730/730 | 0.490 | +0.205 | -0.022 | -0.07 | flat |
|   18 | WA ForN          | depth   | 730/730 | 0.493 | +0.291 | +0.007 | +0.03 | flat |
|   19 | #F sharps        | depth   | 730/730 | 0.507 | +0.291 | +0.030 | +0.15 | flat |
|   20 | v12 F count      | depth   | 730/730 | 0.507 | +0.285 | +0.036 | +0.18 | flat |
|   21 | #F − #A          | depth   | 730/730 | 0.506 | +0.174 | +0.027 | +0.14 | flat |
|   22 | #A sharps        | depth   | 730/730 | 0.495 | +0.209 | +0.003 | +0.01 | flat |
|   23 | v12 A count      | depth   | 730/730 | 0.497 | +0.197 | +0.007 | +0.03 | flat |
|   24 | proven F         | depth   | 730/730 | 0.502 | +0.336 | +0.009 | +0.03 | flat |
|   25 | CLV AgN          | depth   | 729/730 | 0.499 | +0.193 | +0.002 | +0.01 | flat |

### (C) Working read

_N=730 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.552 · Δ +2.03 · higher on WINs (cov 705/730)
- **AgWR** — AUC 0.452 · Δ -1.33 · higher on LOSSes (cov 481/730)
- **V12 score** — AUC 0.541 · Δ +0.02 · higher on WINs (cov 730/730)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1241 | 446 | 446 | 426 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 88 | 47-41 | 53.4% | 281.25u | +12.81u | +4.6% | -0.6 |
| on→off | 15 | 7-8 | 46.7% | 46.70u | -3.56u | -7.6% | -4.7 |
| off→on | 87 | 49-38 | 56.3% | 271.10u | +19.51u | +7.2% | +1.5 |
| off→off | 236 | 129-107 | 54.7% | 632.80u | +17.44u | +2.8% | -0.5 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 256 | 136-120 | 53.1% | 775.10u | +9.54u | +1.2% |
| 0–2 | 124 | 72-52 | 58.1% | 342.35u | +52.63u | +15.4% |
| 2–4 | 27 | 16-11 | 59.3% | 77.90u | +5.83u | +7.5% |
| 4+ | 19 | 8-11 | 42.1% | 36.50u | -21.80u | -59.7% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 8 | 5-3 | 62.5% | 27.00u | +2.45u | +9.1% |
| gold, limits flat | 8 | 5-3 | 62.5% | 24.30u | +10.59u | +43.6% |
| steam, not gold | 159 | 86-73 | 54.1% | 501.05u | +19.28u | +3.8% |
| limits↑, no steam | 13 | 6-7 | 46.2% | 34.40u | +1.98u | +5.8% |
| neither | 238 | 130-108 | 54.6% | 645.10u | +11.90u | +1.8% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 146 | 82-64 | 56.2% | 482.55u | +26.15u | +5.4% |
| A/B + no steam | 188 | 103-85 | 54.8% | 510.10u | +21.92u | +4.3% |
| A/B + steam arriving | 70 | 40-30 | 57.1% | 229.70u | +15.22u | +6.6% |
| A/B + gold | 10 | 6-4 | 60.0% | 32.90u | +9.17u | +27.9% |
| steam at lock, no A/B | 29 | 14-15 | 48.3% | 69.80u | +6.17u | +8.8% |
| Source B + steam arriving | 70 | 40-30 | 57.1% | 229.70u | +15.22u | +6.6% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 14n · 64.3% · +7.9%    | 14n · 57.1% · +5.3%    | 6n · 33.3% · -24.8%    | 34n · 55.9% · +2.3%    |
| MLB   | 453n · 54.7% · +7.8%   | 106n · 53.8% · -2.1%   | 359n · 50.7% · +0.8%   | 918n · 53.1% · +3.7%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 16n · 50.0% · -12.3%   | 8n · 62.5% · -3.1%     | 6n · 66.7% · +32.1%    | 30n · 56.7% · +1.3%    |
| NHL   | 3n · 66.7% · -64.8%    | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 7n · 71.4% · +23.2%    |
| SOC   | 56n · 66.1% · +13.5%   | —                      | —                      | 56n · 66.1% · +13.5%   |
| UFC   | 39n · 74.4% · +17.3%   | —                      | —                      | 39n · 74.4% · +17.3%   |
| WNBA  | 30n · 73.3% · +3.4%    | 20n · 40.0% · -2.3%    | 15n · 46.7% · -10.3%   | 65n · 56.9% · -1.1%    |
| **All** | **616n · 57.6% · +8.2%** | **152n · 53.3% · +0.2%** | **391n · 50.6% · +0.9%** | **1159n · 54.7% · +4.6%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **2465** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 2465 |
| Muted W-L                           |            1233-1232 |
| Muted Win %                         |                50.0% |
| Counterfactual PnL at flat 1u       |               -79.04 |
| Counterfactual ROI at flat 1u       |                -3.2% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-79.04u** at a flat 1u stake — a counterfactual ROI of **-3.2%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-09-26 | CFB   | ML     | Ball State              |  +120 | +0.097 | 2-for-0  |   3/1 |   2/1 |  59.0 |   67.5 |  +16.9 |  3.55 | BOOST    | 6.00u | LOSS    |      -6.00 |
| 2026-09-26 | CFB   | ML     | UConn                   |  +114 | +0.921 | CONFIRMED-UNOPP |   4/2 |   1/0 |  47.1 |   60.1 |   -2.9 | -2.39 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-09-26 | CFB   | ML     | McNeese                 |  -146 | +0.969 | HC-1     |   3/1 |   1/0 |  49.5 |   54.0 |  +11.2 |  0.69 | HOLD     | 4.00u | WIN     |      +1.80 |
| 2026-09-26 | CFB   | ML     | Michigan                |  -199 | +0.987 | MINI     |   3/1 |   1/0 |  85.7 |   33.3 |  +35.7 |  1.82 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-26 | CFB   | ML     | Florida                 |  -170 | +0.972 | MINI     |   9/3 |   1/0 |  61.5 |   54.8 |  +29.6 |  4.71 | BOOST    | 5.40u | WIN     |      +3.31 |
| 2026-09-26 | CFB   | ML     | Mississippi State       |  -175 | +0.992 | HC-2     |   5/1 |   2/0 |  50.6 |   65.0 |  +12.1 |  5.41 | BOOST    | 6.00u | WIN     |      +3.85 |
| 2026-09-26 | CFB   | ML     | LSU                     |  -316 | +0.994 | CONFIRMED-Q1 |   3/1 |   1/0 |  56.8 |   58.2 |   +6.8 |  1.86 | HOLD     | 3.00u | WIN     |      +0.93 |
| 2026-09-26 | CFB   | ML     | Texas                   |  -192 | +0.989 | CONFIRMED-Q1 |   9/2 |   5/0 |  65.2 |   60.2 |  +15.2 |  1.76 | HOLD     | 4.00u | WIN     |      +2.08 |
| 2026-09-26 | MLB   | ML     | Kansas City Royals      |  -104 | +0.991 | SHARP~   |   1/1 |   1/0 |  60.0 |   55.8 |   +9.9 |  0.01 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-26 | MLB   | ML     | Houston Astros          |  -158 | +0.972 | CONFIRMED-UNOPP |   4/1 |   3/0 |  49.8 |   51.1 |   -4.6 | -3.90 | MUTE     | 2.00u | WIN     |      +1.33 |
| 2026-09-26 | MLB   | ML     | Detroit Tigers          |  -108 | +0.562 | SHARP~   |   1/1 |   1/1 |  59.7 |   55.8 |   +9.5 | -0.06 | MUTE     | 2.00u | WIN     |      +1.85 |
| 2026-09-26 | CFB   | SPREAD | Georgia Southern        |  -109 | +0.991 | CONFIRMED-Q1 |   2/0 |   1/0 |  56.7 |   68.8 |   +6.7 |  2.36 | HOLD     | 3.00u | WIN     |      +2.75 |
| 2026-09-26 | CFB   | SPREAD | Michigan State          |  -104 | +0.057 | CONFIRMED-Q1 |   3/2 |   1/1 |  45.0 |   68.0 |  -16.0 | -2.38 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-26 | CFB   | SPREAD | Northern Illinois       |  -113 | +0.953 | 2-for-0  |   4/4 |   1/1 |  47.8 |   53.3 |   +5.7 | -0.85 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-26 | CFB   | SPREAD | Texas Tech              |  +117 | +0.991 | CONFIRMED-Q1 |   3/0 |   2/0 |  57.6 |   64.3 |   +7.6 |  1.87 | HOLD     | 2.00u | WIN     |      +1.89 |
| 2026-09-26 | CFB   | SPREAD | South Alabama           |  +117 | +0.989 | HC-1     |   4/0 |   3/0 |  58.2 |   62.5 |   +8.2 |  1.72 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-26 | CFB   | SPREAD | Southern Miss           |  -104 | +0.975 | MINI     |   2/1 |   1/0 |  54.0 |   61.1 |   +8.6 |  0.92 | HOLD     | 3.00u | WIN     |      +2.88 |
| 2026-09-26 | CFB   | SPREAD | Southeast Missouri Stat |  -170 | +0.986 | SHARP~   |   1/0 |   1/0 |  66.7 |   50.0 |  +16.7 |  1.54 | HOLD     | 4.00u | WIN     |      +2.35 |
| 2026-09-25 | CFB   | ML     | Clemson                 |  -126 | +0.510 | CONFIRMED-Q1 |  16/9 |   6/1 |  57.2 |   59.2 |  +20.2 |  3.42 | BOOST    | 5.00u | WIN     |      +3.97 |
| 2026-09-25 | MLB   | ML     | Chicago White Sox       |  -221 | +0.987 | CONFIRMED-UNOPP |   3/1 |   2/0 |  45.0 |   34.0 |   +1.3 | -4.43 | MUTE     | 4.00u | WIN     |      +1.81 |
| 2026-09-25 | MLB   | ML     | Philadelphia Phillies   |  -157 | +0.991 | 2-for-0  |   3/0 |   2/0 |  69.5 |   43.9 |  +19.5 |  1.19 | HOLD     | 5.00u | LOSS    |      -5.00 |
| 2026-09-25 | NHL   | ML     | Wild                    |  -129 | +0.988 | MINI     |   2/2 |   1/0 |  55.5 |   59.8 |   +5.5 |  0.37 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-25 | MLB   | SPREAD | Baltimore Orioles       |  -203 | +0.487 | SHARP~   |   1/1 |   1/1 |  58.3 |   70.0 |   +8.1 |  1.81 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-25 | MLB   | SPREAD | Baltimore Orioles       |  -203 | +0.487 | SHARP~   |   1/1 |   1/1 |  58.3 |   70.0 |   +8.1 |  1.81 | HOLD     | 2.00u | WIN     |      +0.99 |
| 2026-09-25 | CFB   | TOTAL  | Under 48.5              |  -103 | +0.952 | HC-1     |   2/2 |   1/1 |  52.9 |   58.0 |  +12.1 |  2.12 | HOLD     | 4.00u | WIN     |      +3.88 |
| 2026-09-25 | MLB   | TOTAL  | Over 7.5                |  -107 | +0.242 | CONFIRMED-Q1 |   5/2 |   3/2 |  57.4 |   55.0 |   +5.0 | -1.39 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-25 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.198 | CONFIRMED-Q1 |   3/3 |   3/2 |  67.1 |   57.7 |  +16.4 |  2.22 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-24 | MLB   | ML     | Arizona Diamondbacks    |  -176 | +0.290 | 2-for-0  |   4/2 |   3/1 |  60.9 |   44.4 |  +15.6 |  2.55 | HOLD     | 5.00u | WIN     |      +2.84 |
| 2026-09-24 | MLB   | ML     | Cleveland Guardians     |  +120 | +0.477 | CONFIRMED-Q1 |   2/4 |   1/1 |  55.0 |   60.9 |   +3.9 |  0.54 | HOLD     | 2.00u | WIN     |      +2.40 |
| 2026-09-24 | MLB   | ML     | Chicago White Sox       |  -136 | +0.295 | SHARP~   |   3/3 |   3/2 |  57.0 |   60.9 |   +8.8 |  1.40 | HOLD     | 4.00u | WIN     |      +2.94 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.536 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.071 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.059 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.026 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.028 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return | 1154 |    +0.0373 |    -0.0175 | 0.0001 |  +0.011 |   0.949 | positive (higher score ⇒ better outcome)                 |
| won (binary)        | 1154 |    +0.0513 |    +0.5057 | 0.0008 |  +0.028 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    | 1154 |    -0.1109 |    +0.2161 | 0.0001 |  -0.011 |   2.883 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 1154 |          +0.067 |           +0.123 |                   +0.039 |                   +0.063 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 1154 |          -0.007 |           +0.327 |                   +0.008 |                   +0.130 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 1154 |          +0.027 |           +0.235 |                   +0.007 |                   +0.073 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 1154 |          -0.004 |           +0.201 |                   +0.021 |                   +0.111 | count of contributing AGAINST-side wallets                     |
| provenFor         | 1154 |          +0.016 |           +0.224 |                   +0.008 |                   +0.097 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 1154 |          -0.004 |           +0.186 |                   +0.018 |                   +0.094 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.100         | 387 | 201-186 |   51.9% |     -0.9% |
| MID (p33–p67)     | 19.950 … 19.229        | 382 | 211-171 |   55.2% |     +0.7% |
| HIGH (> p67)      | 48.906 … 34.857        | 385 | 219-166 |   56.9% |     +1.1% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |      1154 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8011 | average score across live picks                                 |
| SD                |    0.2738 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.485 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +0.903 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.309 / +0.953 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.000 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |   34 | 19-15  |   55.9% |     +2.3% |  0.649 |        +0.227 | strong                                    |
| MLB   |  914 | 485-429 |   53.1% |     +3.6% |  0.520 |        -0.131 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   30 | 17-13  |   56.7% |     +1.3% |  0.489 |        -0.294 | noise                                     |
| NHL   |    7 | 5-2    |   71.4% |    +23.2% |  0.000 |        -0.607 | anti-signal (N<20)                        |
| SOC   |   55 | 36-19  |   65.5% |    +13.3% |  0.573 |        +0.062 | real                                      |
| UFC   |   39 | 29-10  |   74.4% |    +17.3% |  0.562 |        -0.040 | real                                      |
| WNBA  |   65 | 37-28  |   56.9% |     -1.1% |  0.577 |        +0.110 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.453, 0.435, 0.417, 0.431, 0.442, 0.479, 0.44, 0.461, 0.486, 0.48, 0.429, 0.413, 0.402, 0.531]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26"]
    y-axis "edge (pp)" -10 --> 4
    line [0.5, -1, -2, -6.4, -5.5, -4.7, -8.3, -8.1, -6.1, -5.1, 1.7, 2.3, -0.9, 0.1]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-09-13 |    7 |   70 | 37-33  |   52.9% |     +7.4% |  0.453 |      +0.5pp |
| 2026-09-14 |    7 |   70 | 36-34  |   51.4% |     +4.5% |  0.435 |      -1.0pp |
| 2026-09-15 |    7 |   72 | 36-36  |   50.0% |     +0.2% |  0.417 |      -2.0pp |
| 2026-09-16 |    7 |   83 | 38-45  |   45.8% |     -9.8% |  0.431 |      -6.4pp |
| 2026-09-17 |    7 |   83 | 39-44  |   47.0% |     -7.9% |  0.442 |      -5.5pp |
| 2026-09-18 |    7 |   76 | 36-40  |   47.4% |     -5.0% |  0.479 |      -4.7pp |
| 2026-09-19 |    7 |   72 | 32-40  |   44.4% |    -14.4% |  0.440 |      -8.3pp |
| 2026-09-20 |    7 |   72 | 32-40  |   44.4% |    -14.4% |  0.461 |      -8.1pp |
| 2026-09-21 |    7 |   69 | 32-37  |   46.4% |    -11.6% |  0.486 |      -6.1pp |
| 2026-09-22 |    7 |   62 | 30-32  |   48.4% |     -7.9% |  0.480 |      -5.1pp |
| 2026-09-23 |    7 |   55 | 30-25  |   54.5% |     +8.0% |  0.429 |      +1.7pp |
| 2026-09-24 |    7 |   59 | 33-26  |   55.9% |     +8.2% |  0.413 |      +2.3pp |
| 2026-09-25 |    7 |   65 | 35-30  |   53.8% |     +3.0% |  0.402 |      -0.9pp |
| 2026-09-26 |    7 |   69 | 38-31  |   55.1% |     +2.1% |  0.531 |      +0.1pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.525 avg in first half → 0.523 avg in second half · Δ = -0.002)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.6% | [-1.1%, +9.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.7% | [51.9%, 57.4%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.536 | [0.504, 0.569]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            109 | [44, 170]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1159 |
| Unique wallets ever on a FOR side            |                                                       360 |
| Avg FOR-side wallets per pick                |                                                      3.12 |
| Top-5 wallets' share of all FOR appearances  |                                                     19.3% |
| Top-10 wallets' share of all FOR appearances |                                                     31.8% |
| Top-20 wallets' share of all FOR appearances |                                                     47.6% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,SOC,WNBA |  212 |  118 | 108-104 |   50.9% |     +1.8% |     +9.44 |     1.45× | WR50        |     -4.3% |     990 | 2026-09-26 |
|    2 | 0cd77e  | CFB,MLB,SOC,UFC,WNBA |  160 |   27 | 88-72  |   55.0% |    +14.0% |    +62.86 |     1.57× | WR50        |     -4.6% |     441 | 2026-09-26 |
|    3 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  113 |   68 | 63-50  |   55.8% |    +15.1% |    +48.98 |     1.16× | CONFIRMED   |     +5.6% |     807 | 2026-09-23 |
|    4 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |  111 |   74 | 54-57  |   48.6% |     +0.3% |     +0.99 |     1.21× | CONFIRMED   |     +2.0% |     588 | 2026-09-26 |
|    5 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |  103 |   77 | 57-46  |   55.3% |    +13.0% |    +34.75 |     0.57× | CONFIRMED   |     +8.0% |     557 | 2026-09-26 |
|    6 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    7 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | WR50        |     +5.5% |     201 | 2026-07-05 |
|    8 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    9 | 2f2a9e  | CFB,MLB,NFL,SOC,WNBA |   86 |   33 | 45-41  |   52.3% |     -7.7% |    -18.05 |     1.97× | WR50        |     -8.2% |     310 | 2026-09-26 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | WR50        |     -4.3% |     502 | 2026-07-10 |
|   11 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   70 |   71 | 34-36  |   48.6% |     -2.6% |     -4.99 |     3.25× | CONFIRMED   |     -2.2% |     451 | 2026-09-23 |
|   12 | 7923c4  | MLB,NBA,UFC |   65 |   18 | 39-26  |   60.0% |    +24.5% |    +40.92 |     0.93× | CONFIRMED   |     +7.3% |     268 | 2026-09-26 |
|   13 | 69f882  | CFB,MLB,NFL,SOC,UFC,WNBA |   64 |   34 | 38-26  |   59.4% |     +5.5% |    +10.44 |     2.07× | CONFIRMED   |     +4.1% |     287 | 2026-09-25 |
|   14 | 9214c2  | MLB        |   64 |   15 | 29-35  |   45.3% |     -5.0% |     -8.93 |     1.22× | CONFIRMED   |     +5.8% |     239 | 2026-09-25 |
|   15 | 705ba1  | MLB        |   63 |   45 | 31-32  |   49.2% |     -1.2% |     -2.12 |     1.10× | WR50        |     +3.2% |     341 | 2026-09-23 |
|   16 | 51176e  | CFB,MLB,NFL |   59 |    6 | 34-25  |   57.6% |     +5.6% |    +11.43 |     0.99× | CONFIRMED   |     +3.4% |     168 | 2026-09-26 |
|   17 | bc35e3  | CFB,MLB,NFL,SOC,UFC,WNBA |   52 |   28 | 24-28  |   46.2% |     -1.7% |     -2.52 |     1.13× | CONFIRMED   |     -4.7% |     260 | 2026-09-20 |
|   18 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   19 | 621848  | MLB,SOC,UFC,WNBA |   44 |   14 | 27-17  |   61.4% |     +2.1% |     +2.60 |     0.57× | CONFIRMED   |     +6.0% |     140 | 2026-09-26 |
|   20 | a0cff6  | MLB,NBA,NFL,SOC,UFC,WNBA |   39 |   32 | 26-13  |   66.7% |    +18.9% |    +20.92 |     2.25× | WR50        |     -5.3% |     281 | 2026-09-24 |

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
|    8 | 718cd6  | CFB,MLB,NFL,SOC,UFC |   13 | 9-4    |   69.2% |     +39.0% |    +14.39 |     1.26× | 2026-09-26 |
|    9 | 4c8ed9  | CFB,MLB,NFL,SOC,UFC,WNBA |   28 | 17-11  |   60.7% |     +37.7% |    +22.32 |     3.25× | 2026-09-25 |
|   10 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|   11 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   12 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   13 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   14 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   15 | 7923c4  | MLB,NBA,UFC |   65 | 39-26  |   60.0% |     +24.5% |    +40.92 |     0.93× | 2026-09-26 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    3 | 2a8409  | MLB,NFL,WNBA |   27 | 9-18   |   33.3% |     -27.6% |    -17.78 |     1.47× | 2026-09-20 |
|    4 | 120215  | MLB,SOC    |   13 | 6-7    |   46.2% |     -22.1% |     -8.08 |     1.39× | 2026-09-20 |
|    5 | 767ff5  | CFB,MLB,NFL,SOC |   12 | 5-7    |   41.7% |     -19.9% |     -7.27 |     1.52× | 2026-09-26 |
|    6 | 7cc9a7  | CFB,MLB,NFL |   13 | 5-8    |   38.5% |     -18.4% |     -6.81 |     1.97× | 2026-09-26 |
|    7 | df8add  | MLB,NFL,SOC |   21 | 10-11  |   47.6% |     -16.1% |     -7.97 |     1.57× | 2026-09-20 |
|    8 | e55973  | MLB,NFL,SOC,UFC |   15 | 6-9    |   40.0% |     -15.3% |     -6.66 |     0.63× | 2026-09-19 |
|    9 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|   10 | cc63b8  | CFB,MLB,NFL,NHL,WNBA |   14 | 7-7    |   50.0% |     -13.2% |     -6.79 |     1.28× | 2026-09-26 |
|   11 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   12 | 2f2a9e  | CFB,MLB,NFL,SOC,WNBA |   86 | 45-41  |   52.3% |      -7.7% |    -18.05 |     1.97× | 2026-09-26 |
|   13 | c9bba3  | CFB,MLB,NFL,SOC |   23 | 13-10  |   56.5% |      -5.9% |     -3.14 |     1.08× | 2026-09-25 |
|   14 | 9214c2  | MLB        |   64 | 29-35  |   45.3% |      -5.0% |     -8.93 |     1.22× | 2026-09-25 |
|   15 | fb3150  | MLB,NFL,SOC |   16 | 9-7    |   56.3% |      -3.8% |     -1.15 |     1.12× | 2026-09-15 |

> 🔴 **2 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 86, ROI -7.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  3498 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   940 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    18 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   148 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     8 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   407 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            378 |        51 |    0 |  107 |  220 |                    158 |
| NBA   |            211 |        24 |    0 |   71 |  116 |                     95 |
| NHL   |            114 |         9 |    0 |   41 |   64 |                     50 |
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
| v12     | 06-01 → present      |  119 |   1159 | 2465 | 634-525 |  54.7% |      4.6% |    +149.68 |    +0.13 | 0.513 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | + 1099 |    +1.4pp |    +13.5pp |          +0.302 |   -0.036 |    +0.0902 | 🟡 mixed |
| v12 − v10          | + 1097 |    +6.3pp |    +23.3pp |          +0.442 |   +0.119 |    +0.0306 | 🟢 better |
| v12 − v11          | + 1048 |    -0.3pp |     +1.8pp |          +0.068 |   +0.069 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 34n 55.9% +2%  | 918n 53.1% +4% | 10n 30.0% +29% | 30n 56.7% +1%  | 7n 71.4% +23%  | 56n 66.1% +14% | 39n 74.4% +17% | 65n 56.9% -1%  | 1159n 54.7% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 221n +8%      | 283n +3%      | 232n +5%      | 151n -4%      | 266n +7%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~3906 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1393 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 1154 / 1393 (83%) | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 1154 / 1393 (83%) | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 1154 / 1393 (83%) | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 1154 / 1393 (83%) | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 1154 / 1393 (83%) | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 1154 / 1393 (83%) | Count of proven AGAINST-side wallets                                 |
| countMargin          | 1154 / 1393 (83%) | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1393 / 1393 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1393 / 1393 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1393 / 1393 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1393 / 1393 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1393 / 1393 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1393 / 1393 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1386 / 1393 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1379 / 1393 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1393 / 1393 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1392 / 1393 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 913 / 1393 (66%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1392 / 1393 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 913 / 1393 (66%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 912 / 1393 (65%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1393 / 1393 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1393 / 1393 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1393 / 1393 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1392 / 1393 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1393 / 1393 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 913 |      |    +0.025 |    +0.260 |      +0.049 |      +0.134 |  0.511 |
|    2 | wd sizeMargin        | 912 |      |    -0.018 |    -0.020 |      -0.040 |      -0.057 |  0.490 |
|    3 | V12 forMean          | 1154 |  🟢  |    +0.067 |    +0.123 |      +0.039 |      +0.063 |  0.527 |
|    4 | wd agAvgSize         | 913 |      |    +0.021 |    +0.027 |      +0.038 |      +0.043 |  0.512 |
|    5 | qMargin              | 1154 |  🟢  |    +0.072 |    +0.049 |      +0.038 |      +0.022 |  0.522 |
|    6 | wd contribMargin     | 1393 |      |    -0.007 |    -0.067 |      -0.033 |      -0.068 |  0.484 |
|    7 | lockPinnProb         | 1386 |      |    +0.193 |    +0.170 |      +0.029 |      -0.119 |  0.600 |
|    8 | clv                  | 1379 |      |    -0.029 |    +0.080 |      -0.028 |      +0.027 |  0.514 |
|    9 | wd maxForContrib     | 1392 |      |    -0.034 |    -0.065 |      -0.027 |      -0.030 |  0.492 |
|   10 | hcMargin             | 1393 |      |    +0.002 |    +0.210 |      -0.026 |      +0.060 |  0.512 |
|   11 | V12 agCount          | 1154 |  🟢  |    -0.004 |    +0.201 |      +0.021 |      +0.111 |  0.500 |
|   12 | wd maxShare          | 1393 |      |    +0.024 |    -0.096 |      +0.019 |      -0.031 |  0.511 |
|   13 | ags (v11)            | 1393 |      |    +0.005 |    +0.035 |      -0.019 |      -0.027 |  0.514 |
|   14 | wd contribAg         | 1393 |      |    -0.003 |    +0.133 |      +0.018 |      +0.062 |  0.489 |
|   15 | wd contribFor        | 1393 |      |    -0.008 |    +0.002 |      -0.017 |      -0.017 |  0.486 |
|   16 | provenMargin         | 1393 |      |    +0.005 |    +0.099 |      -0.016 |      +0.009 |  0.505 |
|   17 | provenFor            | 1393 |      |    -0.006 |    +0.136 |      -0.011 |      +0.033 |  0.498 |
|   18 | agsV12               | 1154 |  🟢  |    +0.028 |    -0.059 |      +0.011 |      -0.026 |  0.536 |
|   19 | peakStars            | 1393 |      |    +0.030 |    +0.024 |      +0.009 |      -0.020 |  0.516 |
|   20 | wd forAvgSize        | 1392 |      |    +0.007 |    +0.059 |      -0.008 |      +0.008 |  0.517 |
|   21 | V12 agMean           | 1154 |  🟢  |    -0.007 |    +0.327 |      +0.008 |      +0.130 |  0.473 |
|   22 | V12 forCount         | 1154 |  🟢  |    +0.027 |    +0.235 |      +0.007 |      +0.073 |  0.510 |
|   23 | countMargin          | 1154 |      |    +0.031 |    +0.126 |      -0.007 |      +0.007 |  0.506 |
|   24 | wd forCount          | 1392 |      |    +0.009 |    +0.184 |      -0.006 |      +0.040 |  0.493 |
|   25 | provenTotal          | 1393 |      |    -0.011 |    +0.105 |      -0.006 |      +0.039 |  0.491 |
|   26 | provenAg             | 1393 |      |    -0.015 |    +0.189 |      +0.004 |      +0.087 |  0.486 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.049), `wd sizeMargin` (r = -0.040), `V12 forMean` (r = +0.039).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.049 · AUC = 0.511

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 401 | 213-188 |   53.1% |     -0.9% |
| MID (p33–p67)     | 2.000 … 2.000            | 219 | 115-104 |   52.5% |     -0.8% |
| HIGH (> p67)      | 3.000 … 5.000            | 293 | 163-130 |   55.6% |     +1.8% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd sizeMargin` · r(unit-ret) = -0.040 · AUC = 0.490

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.256          | 304 | 171-133 |   56.3% |     +2.2% |
| MID (p33–p67)     | 0.078 … 0.462            | 304 | 158-146 |   52.0% |     +0.2% |
| HIGH (> p67)      | 3.728 … 1.129            | 304 | 162-142 |   53.3% |     -2.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.039 · AUC = 0.527

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.100           | 387 | 201-186 |   51.9% |     -0.9% |
| MID (p33–p67)     | 19.950 … 19.229          | 382 | 211-171 |   55.2% |     +0.7% |
| HIGH (> p67)      | 48.906 … 34.857          | 385 | 219-166 |   56.9% |     +1.1% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd agAvgSize` · r(unit-ret) = +0.038 · AUC = 0.512

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.110 … 0.344            | 305 | 157-148 |   51.5% |     -2.8% |
| MID (p33–p67)     | 0.699 … 1.008            | 304 | 164-140 |   53.9% |     +0.1% |
| HIGH (> p67)      | 6.557 … 1.251            | 304 | 170-134 |   55.9% |     +2.6% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `qMargin` · r(unit-ret) = +0.038 · AUC = 0.522

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.100           | 385 | 210-175 |   54.5% |     +0.9% |
| MID (p33–p67)     | 19.950 … 19.229          | 385 | 204-181 |   53.0% |     -0.4% |
| HIGH (> p67)      | 46.556 … 34.857          | 384 | 217-167 |   56.5% |     +0.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd sizeMargin  | V12 forMean    | wd agAvgSize   | qMargin        | wd contribMargin | lockPinnProb   | clv            |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.031 |         +0.090 |         +0.086 |         -0.032 |         -0.151 |         -0.082 |         +0.026 |
| wd sizeMargin |         +0.031 |  1.000         |         +0.181 |         -0.679 |         +0.177 |         +0.233 |         +0.122 |         -0.014 |
| V12 forMean |         +0.090 |         +0.181 |  1.000         |         -0.043 |         +0.928 |         +0.058 |         +0.093 |         +0.010 |
| wd agAvgSize |         +0.086 |         -0.679 |         -0.043 |  1.000         |         -0.062 |         -0.138 |         -0.086 |         +0.036 |
| qMargin     |         -0.032 |         +0.177 |         +0.928 |         -0.062 |  1.000         |         +0.053 |         +0.108 |         +0.010 |
| wd contribMargin |         -0.151 |         +0.233 |         +0.058 |         -0.138 |         +0.053 |  1.000         |         +0.188 |         -0.055 |
| lockPinnProb |         -0.082 |         +0.122 |         +0.093 |         -0.086 |         +0.108 |         +0.188 |  1.000         |         -0.188 |
| clv         |         +0.026 |         -0.014 |         +0.010 |         +0.036 |         +0.010 |         -0.055 |         -0.188 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.928. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 787 picks · features = 8 (+ intercept) · multiple R² = **0.0105** · adjusted R² = **-0.0010** · residual sd = 0.954

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.0542 |   0.0963 | +0.56        |        1 |
|    2 | wd agCount           |     |    +0.0519 |   0.0369 | +1.41        |        2 |
|    3 | wd agAvgSize         |     |    +0.0403 |   0.0472 | +0.85        |        3 |
|    4 | wd contribMargin     |     |    -0.0241 |   0.0361 | -0.67        |        4 |
|    5 | wd sizeMargin        |     |    -0.0234 |   0.0488 | -0.48        |        5 |
|    6 | clv                  |     |    -0.0211 |   0.0347 | -0.61        |        6 |
|    7 | lockPinnProb         |     |    +0.0165 |   0.0356 | +0.46        |        7 |
|    8 | V12 forMean          |  🟢 |    -0.0064 |   0.0967 | -0.07        |        8 |
| —    | (intercept)          |     |    +0.0129 |   0.0340 |    +0.38 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.054), `V12 forMean` (β = -0.006)
- V12 IGNORES: `wd agCount` (β = +0.052, t = +1.41), `wd agAvgSize` (β = +0.040, t = +0.85), `wd contribMargin` (β = -0.024, t = -0.67), `wd sizeMargin` (β = -0.023, t = -0.48), `clv` (β = -0.021, t = -0.61), `lockPinnProb` (β = +0.017, t = +0.46)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.535 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.560 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.025.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `V12 forMean`. They may be contributing noise rather than information.
- Adjusted R² of -0.0010 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*