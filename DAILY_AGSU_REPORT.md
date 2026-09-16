# AGS-Unified — V12 Daily Monitor

**Generated:** Wednesday, September 16, 2026 at 1:13 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (108 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (108 days ago), V12 has evaluated **3816** picks, shipped **1052** for real money (27.6% ship rate), and muted the other **2764**. On the shipped picks V12 has gone **581-471** (55.2% win), staked **2919.15u**, and returned **+175.43u** at **+6.0% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            108 |
| Picks V12 has evaluated             |                           3816 |
| Picks SHIPPED (units > 0)           |                           1052 |
| Picks MUTED (score ≤ 0, FADE)       |                           2764 |
| Ship rate                           |                          27.6% |
| Live W-L                            |                        581-471 |
| Live Win %                          |                          55.2% |
| Live PnL (units)                    |                        +175.43 |
| Live ROI                            |                          +6.0% |
| Avg PnL / day                       |                         +1.62u |
| Most recent action (2026-09-17)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **6.0% ROI** across 1052 live picks (+175.43u real PnL).
- Mute rule is **saving money** — the 1899 muted picks would have lost -108.61u at flat 1u (-5.7% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.62u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **345-278** · +7.4% ROI · +128.82u on 623 graded — see § 5.

### What to watch

- 🟡 Weakest sport: **CFB** — 9 live, 3-6, -54.6% ROI, -13.10u.

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

**Full book:** 108d · 1052 live · 581-471 · **+175.43u** · +6.0% ROI · +1.62u/day.

_Prior to table (2026-06-01 → 2026-08-27): 867 live · 476-391 · +124.39u · cum through prior = +124.39u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-09-09 |        52 |    5 |    33 | 2-3        |  40.0% |     13.00 |      -2.44 |    -18.8% |    +172.47 |
| 2026-09-10 |        19 |    5 |     8 | 0-5        |   0.0% |     13.50 |     -13.50 |   -100.0% |    +158.97 |
| 2026-09-11 |        58 |   10 |    32 | 5-5        |  50.0% |     37.00 |      -6.08 |    -16.4% |    +152.89 |
| 2026-09-12 |       155 |   18 |   113 | 12-6       |  66.7% |     55.90 |     +25.91 |     46.4% |    +178.80 |
| 2026-09-13 |        85 |   16 |    50 | 9-7        |  56.3% |     55.90 |      +7.01 |     12.5% |    +185.81 |
| 2026-09-14 |        41 |    7 |    23 | 4-3        |  57.1% |     23.75 |      +0.91 |      3.8% |    +186.72 |
| 2026-09-15 |        53 |   11 |    29 | 4-7        |  36.4% |     34.50 |     -11.29 |    -32.7% |    +175.43 |
| 2026-09-16 |        45 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +175.43 |
| 2026-09-17 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +175.43 |

> **Trajectory.** 🟡 Last 3 days (-32.7% ROI) **-39.2pp** vs prior (6.5%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-15**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 22 | 16-6 | +44.0% | +39.81u | +1.81u | -100.0% |
| 🟢 2 | RANK 2-for-0 rescue | B | 111 | 66-45 | +14.9% | +59.85u | +0.54u | -1.3% |
| 🟢 3 | DISSENT rescue | D | 24 | 13-11 | +12.0% | +3.05u | +0.13u | — |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 132 | 82-50 | +11.5% | +69.98u | sized UP after path |
| 2 | Tape HOLD (mid) | 429 | 235-194 | +7.8% | +78.43u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 30 | 13-17 | -33.4% | -21.57u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 60 | 26-34 | -7.5% | -4.50u | 🟢 saving $ |
| 2 | Score FADE (≤0 → 0u) | 977 | 493-484 | -0.1% | -0.87u | 🟡 flat |
| 3 | Tape MUTE (tape<0 → 0u) | 197 | 108-89 | +2.8% | +5.51u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 22 | 16-6 | 72.7% | 90.5u | +39.81u | +44.0% | +1.81u | 2 | -100.0% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 0 | — | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 111 | 66-45 | 59.5% | 401.0u | +59.85u | +14.9% | +0.54u | 9 | -1.3% | — | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 91 | 44-47 | 48.4% | 315.4u | -13.48u | -4.3% | -0.15u | 4 | -24.0% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 113 | 58-55 | 51.3% | 316.3u | -1.69u | -0.5% | -0.01u | 5 | -14.7% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 107 | 62-45 | 57.9% | 287.5u | +21.31u | +7.4% | +0.20u | 11 | +7.4% | -1.09u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 0 | — | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 0 | — | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 132 | 82-50 | 62.1% | 611.1u | +69.98u | +11.5% | 11 | -12.6% | — |
| Tape HOLD (mid) | TAPE | staked | 429 | 235-194 | 54.8% | 1008.8u | +78.43u | +7.8% | 62 | +6.5% | -2.79u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 30 | 13-17 | 43.3% | 64.5u | -21.57u | -33.4% | 3 | -64.0% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 197 | 108-89 | 54.8% | 197.0u | +5.51u | +2.8% | 44 | +16.2% | -3.30u |
| fadeTop≥60 MUTE | E | CF 1u | 60 | 26-34 | 43.3% | 60.0u | -4.50u | -7.5% | 15 | -32.5% | -2.00u |
| Score FADE (≤0 → 0u) | score | CF 1u | 977 | 493-484 | 50.5% | 977.0u | -0.87u | -0.1% | 129 | -5.5% | +4.03u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 1 / -100% | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 62 / +13% | 10 / +27% | — |
| SHARP | 20 / -14% | 45 / +2% | 1 / -100% |
| SHARP-LEAN | 83 / +0% | 26 / +2% | 4 / -63% |
| MINI | 53 / +3% | 12 / +51% | 5 / -25% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-15)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| MINI (gate-pass) | 2 | 1-1 | -1.09u | -15.6% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  32 | 16-6   |  72.7% |       90.50 |     +39.81 |     44.0% |
| TOP PICK (TOP+/TOP)       |  4-5u | 228 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 782 | 174-155 |  52.9% |     1081.65 |     +38.07 |      3.5% |
| STRONG (MINI)             |    3u | 183 | 62-45  |  57.9% |      287.45 |     +21.31 |      7.4% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 144 | 27-22  |  55.1% |       56.85 |      +4.15 |      7.3% |
| **STAKED TOTAL** |     — | 642 | 357-285 |  55.6% |     2038.65 |    +109.78 |     +5.4% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  32 | 16-6   |  72.7% |       90.50 |     +39.81 |     44.0% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 199 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 185 | 66-45  |  59.5% |      400.95 |     +59.85 |     14.9% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 442 | 58-55  |  51.3% |      316.34 |      -1.69 |     -0.5% |
| C · proven-$ consensus | SHARP       |    3u | 141 | 44-47  |  48.4% |      315.36 |     -13.48 |     -4.3% |
| A · mini-HC (gate-pass) | MINI        |    3u | 183 | 62-45  |  57.9% |      287.45 |     +21.31 |      7.4% |
| C · mini gate-cut     | MINI-       |    1u |  35 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |  14 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  95 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 705 picks tracked at 0u (would-be 331-374, 47.0% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (21-11, +39.81u)  ·  🟢 TOP PICK (122-106, +6.44u)  ·  🟠 SHARP PLAY (386-396, +38.07u)  ·  🔴 STRONG (102-81, +21.31u)  ·  🟣 LEAN (83-61, +4.15u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81, 39.81, 39.81, 39.81]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 37.04, 38.07, 38.07, 38.07]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 14.28, 22.4, 22.4, 21.31]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66, 66, 66, 66]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 49]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 55, 56, 56, 56]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 58, 57, 58, 58]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 2504 | 2494 | 2436 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 197 | 108-89 | 54.8% | 44.00u | -1.40u | -3.2% |
| HOLD      | 804 | 407-397 | 50.6% | 1011.82u | +75.43u | +7.5% |
| BOOST     | 236 | 134-102 | 56.8% | 614.58u | +72.06u | +11.7% |
| FAIL_OPEN | 59 | 33-26 | 55.9% | 64.50u | -21.57u | -33.4% |
| PASS      | 1140 | 564-576 | 49.5% | 12.00u | -0.02u | -0.2% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 889 | 462-427 | 52.0% | +18.73u |
| hold (0–2.89) | path u | 1003 | 489-514 | 48.8% | +58.18u |
| boost (≥2.89) | ×1.35 | 293 | 162-131 | 55.3% | +70.01u |

_Score coverage: **2185/2436** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 197 | +18.30u | -18.30u | +116.75u | +135.05u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 134 | +48.16u | +72.06u | +23.90u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-16 | MLB | Baltimore Orioles | SHARP | 3.80 | BOOST | 1.00u | 0.00u | — |
| 2026-09-16 | MLB | Toronto Blue Jays | CONFIRMED-Q1 | 3.91 | BOOST | 1.00u | 0.00u | — |
| 2026-09-16 | MLB | Milwaukee Brewers | PATH-D | -2.97 | MUTE | 1.00u | 0.00u | — |
| 2026-09-16 | MLB | St. Louis Cardinals | SHARP~ | -0.33 | MUTE | 2.00u | 0.00u | — |
| 2026-09-16 | SOC | Athletic Club | SHARP~ | -0.95 | MUTE | 1.00u | 0.00u | — |
| 2026-09-16 | SOC | Club Atlético de Madri | HC-2 | 11.88 | BOOST | 6.00u | 6.00u | — |
| 2026-09-16 | SOC | FC Barcelona | SHARP~ | 5.78 | BOOST | 4.00u | 0.00u | — |
| 2026-09-16 | MLB | Under 8.5 | CONFIRMED-Q1 | 3.00 | BOOST | 2.00u | 5.00u | — |
| 2026-09-16 | MLB | Over 9.5 | CONFIRMED-UNOPP | -0.25 | MUTE | 1.00u | 0.00u | — |
| 2026-09-16 | MLB | Over 9.5 | SHARP~ | -0.16 | MUTE | 1.00u | 0.00u | — |
| 2026-09-16 | MLB | Under 8.5 | CONFIRMED-Q1 | -1.74 | MUTE | 1.00u | 3.00u | — |
| 2026-09-15 | MLB | Arizona Diamondbacks | PATH-D | -1.14 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-15 | MLB | Tampa Bay Rays | CONFIRMED-UNOPP | -0.39 | MUTE | 4.00u | 0.00u | WIN |
| 2026-09-15 | MLB | Philadelphia Phillies | 2-for-0 | 3.48 | BOOST | 5.00u | 0.00u | LOSS |
| 2026-09-15 | MLB | Colorado Rockies | PATH-D | -1.34 | MUTE | 1.00u | 0.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.89** · nPriors=620 · source=expanding_q1 · asOf=2026-09-16 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 2058 | 1949 | 1898 | 404 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 145 | 59-86 | 40.7% | 13.00u | -5.29u | -40.7% |
| HOLD      | 406 | 207-199 | 51.0% | 335.10u | +16.64u | +5.0% |
| FAIL_OPEN | 55 | 23-32 | 41.8% | 44.90u | -5.08u | -11.3% |
| EXEMPT    | 817 | 443-374 | 54.2% | 827.75u | +93.95u | +11.4% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -107.3 … -3.2 | 75 | 26-49 | 34.7% | 0.0u | +0.00u | — |
| Q2 | -3.0 … 0.9 | 75 | 34-41 | 45.3% | 36.9u | +14.66u | +39.7% |
| Q3 | 1.0 … 6.2 | 75 | 37-38 | 49.3% | 63.5u | -2.37u | -3.7% |
| Q4 | 6.3 … 18.5 | 75 | 38-37 | 50.7% | 86.6u | -9.79u | -11.3% |
| Q5 | 18.8 … 1802.6 | 75 | 44-31 | 58.7% | 108.1u | +11.64u | +10.8% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 145 | 59-86 | -26.86u | +26.86u | +104.90u | +78.04u |

> 🟢 **Mute is saving money** (Δ +26.86u · muted WR 40.7%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 67 | 24-43 | 35.8% | 80.4u | -24.88u |
| CFB | 9 | 3-6 | 33.3% | 15.9u | +1.63u |
| MLB | 95 | 41-54 | 43.2% | 111.5u | -12.61u |
| NFL | 13 | 4-9 | 30.8% | 18.4u | -9.77u |
| SOC | 6 | 2-4 | 33.3% | 6.0u | -0.94u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-16 | MLB | Baltimore Orioles | SHARP | -13.7 | -0.9 | 1.00u | pending |
| 2026-09-16 | MLB | Minnesota Twins | CONFIRMED-UNOPP | -1.2 | -0.9 | 1.00u | pending |
| 2026-09-15 | MLB | Minnesota Twins | SHARP~ | -28.0 | -1.0 | 1.00u | LOSS |
| 2026-09-15 | SOC | Deportivo Alavés | SHARP~ | -107.3 | -1.0 | 1.00u | LOSS |
| 2026-09-15 | MLB | Under 8.5 | — | -5.2 | -1.0 | 1.00u | LOSS |
| 2026-09-15 | MLB | Under 8.5 | SHARP~ | -8.2 | -1.0 | 1.00u | WIN |
| 2026-09-15 | MLB | Under 8.5 | — | -4.4 | -1.0 | 1.00u | WIN |
| 2026-09-14 | MLB | Over 9.5 | SHARP~ | -9.5 | -1.0 | 1.00u | WIN |
| 2026-09-14 | MLB | Under 7.5 | — | -4.7 | -1.0 | 1.00u | LOSS |
| 2026-09-13 | MLB | Kansas City Royals | SHARP~ | -6.9 | -0.9 | 1.00u | LOSS |
| 2026-09-13 | MLB | New York Mets | SHARP~ | -1.2 | -0.9 | 1.00u | LOSS |
| 2026-09-13 | MLB | Seattle Mariners | — | -19.0 | -0.9 | 1.00u | LOSS |
| 2026-09-13 | NFL | Giants | — | -5.1 | -0.9 | 1.00u | WIN |
| 2026-09-13 | NFL | Commanders | SHARP~ | -1.2 | -0.9 | 1.00u | LOSS |
| 2026-09-13 | SOC | Brighton & Hove Albion | CONFIRMED-UNOPP | -11.7 | -0.9 | 1.00u | WIN |
| 2026-09-13 | NFL | Cardinals | SHARP~ | -2.1 | -0.9 | 1.00u | WIN |
| 2026-09-13 | NFL | Falcons | SHARP~ | -3.8 | -0.9 | 1.00u | LOSS |
| 2026-09-13 | NFL | Texans | — | 0.8 | -0.9 | 1.00u | LOSS |
| 2026-09-13 | NFL | Lions | SHARP | -8.0 | -0.9 | 5.40u | LOSS |
| 2026-09-13 | NFL | Buccaneers | SHARP~ | -19.7 | -0.9 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 94 | 49-45 | 52.1% | 295.1u | +14.14u | +4.8% |
| Muted (Q1 → 0u) | 145 | 59-86 | 40.7% | 13.0u | -5.29u | -40.7% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 160–91 · 63.7% · +15.3%); **5–10 is the hole** (96–86 · 52.7% · +1.7%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 834 tickets · cov 806/834 (stamp 604 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 373 | 194–179 | 52.0% | -0.7% |
| 5–10 | 182 | 96–86 | 52.7% | +1.7% |
| ≥10 | 251 | 160–91 | 63.7% | +15.3% |
| All | 834 | 463–371 | 55.5% | +6.3% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 57.5% (73) | 69.8% (96) |
| B | 56% (75) | 61.5% (13) | 69.6% (23) |
| C | 37.5% (40) | 44.8% (58) | 56.6% (113) |

##### Jul 15+ · 623 tickets · cov 601/623 (stamp 599 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 267 | 141–126 | 52.8% | +4.1% |
| 5–10 | 143 | 73–70 | 51.0% | +1.0% |
| ≥10 | 191 | 121–70 | 63.4% | +13.1% |
| All | 623 | 345–278 | 55.4% | +7.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 56.8% (44) | 70.9% (55) |
| B | 57.1% (49) | 50% (8) | 68.8% (16) |
| C | 36.8% (19) | 45.3% (53) | 57.3% (103) |

##### Yesterday (Sep 15) · 11 tickets · cov 11/11 (stamp 11 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 8 | 2–6 | 25.0% | -48.5% |
| 5–10 | 3 | 2–1 | 66.7% | +11.9% |
| All | 11 | 4–7 | 36.4% | -32.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | 50% (2) | — |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 834 tickets · cov 826/834 (stamp 615 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 548 | 311–237 | 56.8% | +7.4% |
| 5–10 | 142 | 74–68 | 52.1% | +4.9% |
| ≥10 | 136 | 76–60 | 55.9% | +6.3% |
| All | 834 | 463–371 | 55.5% | +6.3% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 58.3% (180) | 50% (52) | 70.9% (55) |
| B | 61.9% (84) | 50% (14) | 53.8% (13) |
| C | 50% (120) | 57.1% (49) | 41.7% (48) |

##### Jul 15+ · 623 tickets · cov 616/623 (stamp 615 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 398 | 233–165 | 58.5% | +12.8% |
| 5–10 | 119 | 61–58 | 51.3% | +4.2% |
| ≥10 | 99 | 49–50 | 49.5% | -4.3% |
| All | 623 | 345–278 | 55.4% | +7.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 64% (86) | 47.2% (36) | 61.8% (34) |
| B | 60.7% (56) | 50% (10) | 57.1% (7) |
| C | 53.8% (93) | 56.5% (46) | 38.5% (39) |

##### Yesterday (Sep 15) · 11 tickets · cov 11/11 (stamp 11 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 7 | 4–3 | 57.1% | +0.9% |
| 5–10 | 2 | 0–2 | 0.0% | -100.0% |
| ≥10 | 2 | 0–2 | 0.0% | -100.0% |
| All | 11 | 4–7 | 36.4% | -32.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (2) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 834 tickets · cov 804/834 (stamp 596 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 174 | 88–86 | 50.6% | -10.1% |
| 0–2.89 | 448 | 244–204 | 54.5% | +8.6% |
| ≥2.89 | 182 | 118–64 | 64.8% | +15.5% |
| All | 834 | 463–371 | 55.5% | +6.3% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.9% (164) | 75% (72) |
| B | 62.9% (35) | 55.9% (59) | 64.7% (17) |
| C | 18.2% (11) | 50% (122) | 54.5% (77) |

##### Jul 15+ · 623 tickets · cov 599/623 (stamp 596 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 105 | 60–45 | 57.1% | +8.3% |
| 0–2.89 | 357 | 190–167 | 53.2% | +6.5% |
| ≥2.89 | 137 | 85–52 | 62.0% | +11.4% |
| All | 623 | 345–278 | 55.4% | +7.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 54.2% (107) | 73.8% (42) |
| B | 63.2% (19) | 56.8% (44) | 60% (10) |
| C | — | 50.5% (103) | 53.5% (71) |

##### Yesterday (Sep 15) · 11 tickets · cov 11/11 (stamp 11 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 3 | 1–2 | 33.3% | -39.7% |
| 0–2.89 | 8 | 3–5 | 37.5% | -29.4% |
| All | 11 | 4–7 | 36.4% | -32.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 50% (2) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 623 | 345-278 | 55.4% | 1742.90u | +128.82u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 623/623 | 2.93 | 2.81 | +0.12 | 2.00 | 2.00 |
| depth   | #A sharps        | 623/623 | 1.58 | 1.64 | -0.05 | 1.00 | 1.00 |
| depth   | #F − #A          | 623/623 | 1.35 | 1.17 | +0.18 | 1.00 | 1.00 |
| depth   | proven F         | 623/623 | 2.09 | 2.01 | +0.09 | 2.00 | 2.00 |
| depth   | proven A         | 623/623 | 0.81 | 0.77 | +0.04 | 0.00 | 0.00 |
| depth   | proven F−A       | 623/623 | 1.28 | 1.23 | +0.05 | 1.00 | 1.00 |
| depth   | v12 F count      | 623/623 | 2.91 | 2.79 | +0.12 | 2.00 | 2.00 |
| depth   | v12 A count      | 623/623 | 1.65 | 1.69 | -0.04 | 1.00 | 1.00 |
| depth   | WA ForN          | 623/623 | 2.31 | 2.26 | +0.04 | 2.00 | 2.00 |
| depth   | WA AgN           | 623/623 | 1.35 | 1.41 | -0.06 | 1.00 | 1.00 |
| depth   | CLV ForN         | 622/623 | 2.65 | 2.55 | +0.10 | 2.00 | 2.00 |
| depth   | CLV AgN          | 622/623 | 1.56 | 1.60 | -0.04 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 623/623 | 0.34 | 0.31 | +0.03 | 0.00 | 0.00 |
| quality | ForWR            | 599/623 | 56.82 | 55.27 | +1.55 | 54.73 | 54.27 |
| quality | AgWR             | 400/623 | 46.45 | 47.34 | -0.89 | 47.89 | 48.14 |
| quality | TopFor WR        | 599/623 | 61.68 | 60.44 | +1.24 | 58.30 | 57.36 |
| quality | TopAg WR         | 400/623 | 49.95 | 50.41 | -0.46 | 50.85 | 50.41 |
| quality | EDGE             | 599/623 | 9.06 | 6.93 | +2.13 | 7.00 | 5.17 |
| quality | ForCLV           | 615/623 | 63.93 | 64.09 | -0.15 | 64.19 | 64.79 |
| quality | AgCLV            | 426/623 | 62.26 | 60.99 | +1.27 | 63.22 | 62.40 |
| quality | netCLV           | 615/623 | 1.76 | 2.80 | -1.04 | 2.21 | 2.90 |
| quality | Tape             | 596/623 | 2.08 | 1.78 | +0.30 | 1.50 | 1.43 |
| quality | V12 score        | 623/623 | 0.79 | 0.78 | +0.01 | 0.95 | 0.93 |
| quality | V12 forMean      | 623/623 | 29.75 | 24.88 | +4.87 | 24.25 | 18.01 |
| quality | V12 agMean       | 623/623 | 4.12 | 3.65 | +0.47 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 599/623 | 0.553 | -0.005 | +0.103 | +2.13 | 🟡 mild OK |
|    2 | AgCLV            | quality | 426/623 | 0.547 | -0.041 | +0.083 | +1.27 | 🟡 mild inv |
|    3 | V12 forMean      | quality | 623/623 | 0.545 | +0.208 | +0.089 | +4.87 | 🟡 mild OK |
|    4 | V12 score        | quality | 623/623 | 0.542 | -0.057 | +0.021 | +0.01 | 🟡 mild OK |
|    5 | V12 agMean       | quality | 623/623 | 0.463 | +0.360 | +0.029 | +0.47 | flat |
|    6 | TopFor WR        | quality | 599/623 | 0.536 | +0.203 | +0.059 | +1.24 | flat |
|    7 | ForWR            | quality | 599/623 | 0.535 | +0.083 | +0.086 | +1.55 | flat |
|    8 | netCLV           | quality | 615/623 | 0.466 | -0.131 | -0.045 | -1.04 | flat |
|    9 | AgWR             | quality | 400/623 | 0.470 | +0.202 | -0.068 | -0.89 | flat |
|   10 | Tape             | quality | 596/623 | 0.523 | -0.094 | +0.052 | +0.30 | flat |
|   11 | ForCLV           | quality | 615/623 | 0.479 | -0.197 | -0.008 | -0.15 | flat |
|   12 | proven A         | depth   | 623/623 | 0.481 | +0.340 | +0.014 | +0.04 | flat |
|   13 | WA AgN           | depth   | 623/623 | 0.483 | +0.216 | -0.018 | -0.06 | flat |
|   14 | unopposed (A=0)  | depth   | 623/623 | 0.514 | +0.238 | +0.031 | +0.03 | flat |
|   15 | WA ForN          | depth   | 623/623 | 0.488 | +0.298 | +0.012 | +0.04 | flat |
|   16 | #A sharps        | depth   | 623/623 | 0.489 | +0.204 | -0.015 | -0.05 | flat |
|   17 | v12 A count      | depth   | 623/623 | 0.490 | +0.192 | -0.012 | -0.04 | flat |
|   18 | CLV ForN         | depth   | 622/623 | 0.509 | +0.283 | +0.027 | +0.10 | flat |
|   19 | TopAg WR         | quality | 400/623 | 0.492 | +0.162 | -0.027 | -0.46 | flat |
|   20 | CLV AgN          | depth   | 622/623 | 0.493 | +0.194 | -0.011 | -0.04 | flat |
|   21 | #F sharps        | depth   | 623/623 | 0.506 | +0.292 | +0.026 | +0.12 | flat |
|   22 | proven F−A       | depth   | 623/623 | 0.505 | +0.219 | +0.017 | +0.05 | flat |
|   23 | proven F         | depth   | 623/623 | 0.501 | +0.366 | +0.028 | +0.09 | flat |
|   24 | #F − #A          | depth   | 623/623 | 0.500 | +0.174 | +0.037 | +0.18 | flat |
|   25 | v12 F count      | depth   | 623/623 | 0.500 | +0.289 | +0.026 | +0.12 | flat |

### (C) Working read

_N=623 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.553 · Δ +2.13 · higher on WINs (cov 599/623)
- **V12 forMean** — AUC 0.545 · Δ +4.87 · higher on WINs (cov 623/623)
- **V12 score** — AUC 0.542 · Δ +0.01 · higher on WINs (cov 623/623)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1121 | 326 | 326 | 318 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 61 | 33-28 | 54.1% | 185.05u | +14.07u | +7.6% | -0.4 |
| on→off | 12 | 5-7 | 41.7% | 37.20u | -7.70u | -20.7% | -5.1 |
| off→on | 60 | 37-23 | 61.7% | 184.60u | +37.03u | +20.1% | +1.9 |
| off→off | 185 | 103-82 | 55.7% | 482.30u | +27.66u | +5.7% | -0.6 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 195 | 107-88 | 54.9% | 573.90u | +30.96u | +5.4% |
| 0–2 | 86 | 52-34 | 60.5% | 231.85u | +57.77u | +24.9% |
| 2–4 | 19 | 11-8 | 57.9% | 51.90u | -0.87u | -1.7% |
| 4+ | 18 | 8-10 | 44.4% | 31.50u | -16.80u | -53.3% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 4 | 3-1 | 75.0% | 10.00u | +3.72u | +37.2% |
| gold, limits flat | 8 | 5-3 | 62.5% | 24.30u | +10.59u | +43.6% |
| steam, not gold | 109 | 62-47 | 56.9% | 335.35u | +36.79u | +11.0% |
| limits↑, no steam | 10 | 5-5 | 50.0% | 25.90u | +4.60u | +17.8% |
| neither | 187 | 103-84 | 55.1% | 493.60u | +15.36u | +3.1% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 114 | 66-48 | 57.9% | 355.25u | +46.57u | +13.1% |
| A/B + no steam | 178 | 101-77 | 56.7% | 462.30u | +42.55u | +9.2% |
| A/B + steam arriving | 58 | 36-22 | 62.1% | 182.60u | +36.77u | +20.1% |
| A/B + gold | 9 | 5-4 | 55.6% | 24.90u | +7.30u | +29.3% |
| steam at lock, no A/B | 7 | 4-3 | 57.1% | 14.40u | +4.53u | +31.5% |
| Source B + steam arriving | 56 | 35-21 | 62.5% | 176.60u | +36.63u | +20.7% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 3n · 66.7% · -14.7%    | 3n · 33.3% · -47.5%    | 3n · 0.0% · -100.0%    | 9n · 33.3% · -54.6%    |
| MLB   | 427n · 55.0% · +8.5%   | 100n · 55.0% · +1.0%   | 328n · 51.8% · +3.7%   | 855n · 53.8% · +5.6%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 12n · 58.3% · +3.0%    | 6n · 50.0% · -29.1%    | 4n · 50.0% · +6.7%     | 22n · 54.5% · -2.9%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 54n · 66.7% · +14.8%   | —                      | —                      | 54n · 66.7% · +14.8%   |
| UFC   | 35n · 77.1% · +20.5%   | —                      | —                      | 35n · 77.1% · +20.5%   |
| WNBA  | 27n · 74.1% · +3.2%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 61n · 57.4% · -0.5%    |
| **All** | **565n · 58.2% · +9.7%** | **132n · 53.0% · +0.1%** | **355n · 51.3% · +2.7%** | **1052n · 55.2% · +6.0%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.
> **V12's weakest sub-market:** CFB TOTAL — 3 live, 0-3, -100.0% ROI, -7.00u PnL. Consider tightening V12's threshold here.

## § 7 — Mute Audit

V12 muted **1899** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1899 |
| Muted W-L                           |              928-971 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |              -108.61 |
| Counterfactual ROI at flat 1u       |                -5.7% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-108.61u** at a flat 1u stake — a counterfactual ROI of **-5.7%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-09-15 | MLB   | ML     | Cleveland Guardians     |  -152 | +0.066 | CONFIRMED-Q1 |   6/2 |   5/2 |  49.9 |   57.2 |   -0.9 | -1.06 | HOLD     | 4.00u | WIN     |      +2.63 |
| 2026-09-15 | MLB   | ML     | Pittsburgh Pirates      |  +197 | +0.004 | CONFIRMED-Q1 |   4/6 |   3/5 |  56.0 |   57.0 |   -1.0 |  1.59 | PASS     | 1.50u | LOSS    |      -1.50 |
| 2026-09-15 | MLB   | SPREAD | Cleveland Guardians     |  +158 | +0.787 | CONFIRMED-Q1 |   2/1 |   1/1 |  51.9 |   60.9 |   +0.8 | -1.26 | MUTE     | 4.00u | LOSS    |      -4.00 |
| 2026-09-15 | MLB   | SPREAD | Pittsburgh Pirates      |  +114 | +0.061 | CONFIRMED-Q1 |   3/2 |   3/1 |  58.3 |   65.8 |   -0.1 |  1.70 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-15 | MLB   | TOTAL  | Over 8.5                |  -103 | +0.985 | MINI     |   3/0 |   3/0 |  59.2 |   65.4 |   +9.2 |  2.36 | HOLD     | 3.00u | WIN     |      +2.91 |
| 2026-09-15 | MLB   | TOTAL  | Over 7.5                |  +117 | +0.183 | CONFIRMED-Q1 |   3/3 |   2/3 |  57.2 |   66.6 |   +3.0 |  1.20 | HOLD     | 3.00u | WIN     |      +3.51 |
| 2026-09-15 | MLB   | TOTAL  | Over 8.5                |  +108 | +0.147 | CONFIRMED-Q1 |   3/1 |   3/1 |  60.7 |   70.1 |   +9.0 |  1.91 | HOLD     | 2.00u | WIN     |      +2.16 |
| 2026-09-15 | MLB   | TOTAL  | Over 8.5                |  +118 | +0.487 | CONFIRMED-Q1 |   9/5 |   7/4 |  56.4 |   64.4 |   +1.5 |  1.14 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-15 | MLB   | TOTAL  | Over 6.5                |  +108 | +0.938 | CONFIRMED-Q1 |   3/0 |   2/0 |  53.4 |   52.7 |   +3.4 | -0.71 | MUTE     | 3.00u | LOSS    |      -3.00 |
| 2026-09-15 | MLB   | TOTAL  | Over 7.5                |  -122 | +0.923 | MINI     |   3/1 |   3/1 |  55.1 |   60.3 |   +7.4 |  2.09 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-15 | MLB   | TOTAL  | Under 11.5              |  -111 | +0.278 | CONFIRMED-Q1 |   7/1 |   5/1 |  52.6 |   67.0 |   -1.9 |  0.38 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-14 | MLB   | ML     | San Diego Padres        |  -177 | +0.444 | CONFIRMED-Q1 |   4/5 |   3/3 |  63.9 |   54.7 |  +14.8 |  2.26 | HOLD     | 4.00u | WIN     |      +2.26 |
| 2026-09-14 | MLB   | TOTAL  | Under 8.5               |  -133 | +0.515 | CONFIRMED-Q1 |   4/5 |   3/3 |  54.4 |   58.5 |   +2.3 | -0.26 | HOLD     | 2.00u | WIN     |      +1.50 |
| 2026-09-14 | MLB   | TOTAL  | Over 7.5                |  -125 | +0.041 | CONFIRMED-Q1 |   3/4 |   2/3 |  54.2 |   58.3 |   +3.6 | -0.09 | HOLD     | 4.00u | WIN     |      +3.20 |
| 2026-09-14 | MLB   | TOTAL  | Under 8.5               |  -105 | +0.441 | CONFIRMED-Q1 |   3/2 |   1/2 |  57.2 |   62.1 |   +4.2 | -0.32 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-14 | MLB   | TOTAL  | Under 10.5              |  -110 | +0.986 | CONFIRMED-Q1 |   7/4 |   5/0 |  52.9 |   67.0 |   +5.9 |  2.59 | HOLD     | 3.75u | LOSS    |      -3.75 |
| 2026-09-14 | MLB   | TOTAL  | Under 8.5               |  -129 | +0.596 | CONFIRMED-Q1 |   4/4 |   1/3 |  53.9 |   63.9 |   -0.4 |  0.66 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-14 | NFL   | TOTAL  | Under 43.5              |  -108 | +0.230 | CONFIRMED-Q1 |   5/2 |   5/2 |  49.3 |   55.2 |   +3.6 | -0.59 | HOLD     | 4.00u | WIN     |      +3.70 |
| 2026-09-13 | MLB   | ML     | Chicago White Sox       |  -105 | +0.955 | 2-for-0  |   3/1 |   2/0 |  50.0 |   60.7 |   +3.3 |  1.08 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-13 | MLB   | ML     | Washington Nationals    |  -134 | +0.412 | SHARP    |   2/3 |   1/2 |  69.6 |   66.7 |  +19.6 |  5.61 | BOOST    | 5.40u | WIN     |      +4.03 |
| 2026-09-13 | MLB   | ML     | Chicago Cubs            |  -162 | +0.531 | CONFIRMED-Q1 |   3/3 |   3/3 |  59.3 |   58.5 |   +7.4 |  1.20 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-13 | MLB   | ML     | Athletics               |  +116 | +0.019 | CONFIRMED-Q1 |   3/2 |   2/1 |  56.0 |   56.9 |   +5.8 |  1.29 | HOLD     | 3.00u | WIN     |      +3.48 |
| 2026-09-13 | MLB   | ML     | Texas Rangers           |  +125 | +0.894 | MINI     |   3/2 |   2/1 |  69.4 |   64.1 |  +20.3 |  5.86 | BOOST    | 4.00u | WIN     |      +5.00 |
| 2026-09-13 | NFL   | ML     | Cowboys                 |  -166 | +0.143 | CONFIRMED-Q1 |  12/7 |   6/2 |  28.3 |   41.9 |  -16.1 | -5.66 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-13 | NFL   | ML     | Vikings                 |  -125 | +0.795 | CONFIRMED-UNOPP |   3/3 |   1/0 |     — |   48.3 |      — |     — | FAIL_OPEN | 2.00u | WIN     |      +1.60 |
| 2026-09-13 | MLB   | SPREAD | Detroit Tigers          |  +138 | +0.045 | CONFIRMED-Q1 |   2/2 |   2/2 |  60.3 |   66.1 |   +7.7 |  0.36 | HOLD     | 4.00u | WIN     |      +5.52 |
| 2026-09-13 | MLB   | SPREAD | Athletics               |  -127 | +0.125 | CONFIRMED-Q1 |   2/1 |   2/1 |  63.0 |   47.4 |  +10.7 | -1.21 | HOLD     | 4.00u | WIN     |      +3.15 |
| 2026-09-13 | NFL   | SPREAD | Bills                   |  +108 | +0.366 | CONFIRMED-Q1 |   2/6 |   1/2 |  51.3 |   66.1 |   -5.5 | -0.01 | HOLD     | 2.00u | WIN     |      +2.16 |
| 2026-09-13 | NFL   | SPREAD | Eagles                  |  -107 | +0.310 | CONFIRMED-Q1 |   7/3 |   2/1 |  48.8 |   51.9 |   -1.2 | -0.49 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-13 | MLB   | TOTAL  | Under 8.5               |  +122 | +0.464 | CONFIRMED-Q1 |   3/2 |   2/2 |  52.4 |   65.5 |   -0.9 |  1.58 | HOLD     | 2.50u | LOSS    |      -2.50 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.535 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.073 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.053 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.024 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.020 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return | 1047 |    +0.0064 |    +0.0176 | 0.0000 |  +0.002 |   0.949 | positive (higher score ⇒ better outcome)                 |
| won (binary)        | 1047 |    +0.0376 |    +0.5213 | 0.0004 |  +0.020 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    | 1047 |    -0.3065 |    +0.4153 | 0.0008 |  -0.028 |   2.864 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 1047 |          +0.076 |           +0.094 |                   +0.043 |                   +0.047 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 1047 |          +0.012 |           +0.335 |                   +0.026 |                   +0.133 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 1047 |          +0.021 |           +0.223 |                   -0.000 |                   +0.065 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 1047 |          -0.016 |           +0.192 |                   +0.014 |                   +0.111 | count of contributing AGAINST-side wallets                     |
| provenFor         | 1047 |          +0.023 |           +0.221 |                   +0.015 |                   +0.096 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 1047 |          +0.008 |           +0.182 |                   +0.028 |                   +0.092 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 7.618          | 349 | 188-161 |   53.9% |     +0.4% |
| MID (p33–p67)     | 19.950 … 20.303        | 349 | 188-161 |   53.9% |     +0.0% |
| HIGH (> p67)      | 48.906 … 33.555        | 349 | 202-147 |   57.9% |     +1.8% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |      1047 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8170 | average score across live picks                                 |
| SD                |    0.2621 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.649 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +1.484 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.364 / +0.954 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.004 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |    9 | 3-6    |   33.3% |    -54.6% |  1.000 |        +0.917 | strong (N<20)                             |
| MLB   |  851 | 458-393 |   53.8% |     +5.5% |  0.517 |        -0.114 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   22 | 12-10  |   54.5% |     -2.9% |  0.583 |        -0.177 | strong                                    |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   53 | 35-18  |   66.0% |    +14.5% |  0.575 |        +0.084 | real                                      |
| UFC   |   35 | 27-8   |   77.1% |    +20.5% |  0.602 |        +0.086 | strong                                    |
| WNBA  |   61 | 35-26  |   57.4% |     -0.5% |  0.548 |        +0.051 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15"]
    y-axis "AUC" 0.4 --> 0.7
    line [0.586, 0.558, 0.538, 0.587, 0.659, 0.591, 0.588, 0.597, 0.613, 0.53, 0.494, 0.453, 0.435, 0.417]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15"]
    y-axis "edge (pp)" -3 --> 22
    line [2.4, 2.9, 12.4, 15.5, 20.9, 20.6, 13.5, 10.9, 2.8, 0, 1.5, 0.5, -1, -2]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-09-02 |    7 |   77 | 46-31  |   59.7% |    +12.0% |  0.586 |      +2.4pp |
| 2026-09-03 |    7 |   74 | 44-30  |   59.5% |    +11.7% |  0.558 |      +2.9pp |
| 2026-09-04 |    7 |   59 | 40-19  |   67.8% |    +35.3% |  0.538 |     +12.4pp |
| 2026-09-05 |    7 |   55 | 38-17  |   69.1% |    +34.2% |  0.587 |     +15.5pp |
| 2026-09-06 |    7 |   43 | 32-11  |   74.4% |    +42.0% |  0.659 |     +20.9pp |
| 2026-09-07 |    7 |   45 | 33-12  |   73.3% |    +41.9% |  0.591 |     +20.6pp |
| 2026-09-08 |    7 |   50 | 33-17  |   66.0% |    +27.1% |  0.588 |     +13.5pp |
| 2026-09-09 |    7 |   50 | 32-18  |   64.0% |    +22.9% |  0.597 |     +10.9pp |
| 2026-09-10 |    7 |   49 | 27-22  |   55.1% |     +7.5% |  0.613 |      +2.8pp |
| 2026-09-11 |    7 |   52 | 27-25  |   51.9% |     -0.9% |  0.530 |      +0.0pp |
| 2026-09-12 |    7 |   61 | 33-28  |   54.1% |     +9.0% |  0.494 |      +1.5pp |
| 2026-09-13 |    7 |   70 | 37-33  |   52.9% |     +7.4% |  0.453 |      +0.5pp |
| 2026-09-14 |    7 |   70 | 36-34  |   51.4% |     +4.5% |  0.435 |      -1.0pp |
| 2026-09-15 |    7 |   72 | 36-36  |   50.0% |     +0.2% |  0.417 |      -2.0pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.528 avg in first half → 0.535 avg in second half · Δ = +0.006)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +6.0% | [-0.1%, +12.0%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.2% | [52.2%, 58.3%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.535 | [0.501, 0.569]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            110 | [47, 173]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1052 |
| Unique wallets ever on a FOR side            |                                                       307 |
| Avg FOR-side wallets per pick                |                                                      2.98 |
| Top-5 wallets' share of all FOR appearances  |                                                     20.8% |
| Top-10 wallets' share of all FOR appearances |                                                     34.7% |
| Top-20 wallets' share of all FOR appearances |                                                     50.4% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,SOC,WNBA |  189 |   86 | 99-90  |   52.4% |     +5.9% |    +27.41 |     1.48× | CONFIRMED   |     -5.5% |     731 | 2026-09-15 |
|    2 | 0cd77e  | MLB,SOC,UFC,WNBA |  156 |   25 | 86-70  |   55.1% |    +14.0% |    +61.24 |     1.58× | CONFIRMED   |     -5.1% |     394 | 2026-09-11 |
|    3 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  105 |   55 | 59-46  |   56.2% |    +16.1% |    +48.31 |     1.19× | CONFIRMED   |     +5.7% |     676 | 2026-09-14 |
|    4 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    5 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |   99 |   72 | 47-52  |   47.5% |     -2.2% |     -6.12 |     1.19× | CONFIRMED   |     +0.2% |     528 | 2026-09-15 |
|    6 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    7 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    8 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |   92 |   67 | 51-41  |   55.4% |    +13.3% |    +30.45 |     0.51× | CONFIRMED   |     +8.5% |     443 | 2026-09-13 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   84 |   32 | 44-40  |   52.4% |     -6.7% |    -15.05 |     1.99× | CONFIRMED   |     -9.6% |     301 | 2026-09-07 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   62 |   17 | 38-24  |   61.3% |    +28.2% |    +44.14 |     0.92× | CONFIRMED   |     +9.1% |     249 | 2026-09-15 |
|   12 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   62 |   69 | 28-34  |   45.2% |     -9.9% |    -17.05 |     3.54× | CONFIRMED   |     -5.8% |     368 | 2026-09-14 |
|   13 | 705ba1  | MLB        |   56 |   44 | 28-28  |   50.0% |     +2.2% |     +3.35 |     1.11× | CONFIRMED   |     +3.7% |     305 | 2026-09-15 |
|   14 | bc35e3  | CFB,MLB,NFL,SOC,UFC,WNBA |   51 |   27 | 23-28  |   45.1% |     -3.8% |     -5.46 |     1.14× | CONFIRMED   |     -5.4% |     235 | 2026-09-15 |
|   15 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   16 | 69f882  | MLB,SOC,UFC,WNBA |   49 |   31 | 33-16  |   67.3% |    +18.4% |    +26.17 |     2.57× | CONFIRMED   |     +8.6% |     202 | 2026-09-15 |
|   17 | 9214c2  | MLB        |   47 |    7 | 21-26  |   44.7% |     -4.5% |     -5.85 |     1.12× | CONFIRMED   |     +3.8% |     157 | 2026-09-15 |
|   18 | 621848  | MLB,SOC,UFC,WNBA |   43 |   13 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +7.9% |     119 | 2026-09-15 |
|   19 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.8% |     148 | 2026-09-02 |
|   20 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    2 | d66e28  | MLB,WNBA   |   17 | 13-4   |   76.5% |     +57.1% |    +24.73 |     0.75× | 2026-09-07 |
|    3 | ba8492  | MLB,NFL    |   12 | 9-3    |   75.0% |     +56.8% |    +20.95 |     1.58× | 2026-09-15 |
|    4 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    5 | 199296  | MLB        |   10 | 7-3    |   70.0% |     +43.0% |    +16.71 |     2.76× | 2026-09-15 |
|    6 | 62941a  | MLB,NFL    |   16 | 11-5   |   68.8% |     +41.6% |    +20.12 |     0.84× | 2026-09-13 |
|    7 | 718cd6  | MLB,NFL,SOC,UFC |   10 | 7-3    |   70.0% |     +40.0% |     +9.61 |     1.29× | 2026-09-09 |
|    8 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    9 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   10 | 2dc4f6  | MLB,WNBA   |   12 | 7-5    |   58.3% |     +33.7% |     +9.56 |     0.68× | 2026-09-15 |
|   11 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   12 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   13 | 4c8ed9  | CFB,MLB,NFL,SOC,UFC,WNBA |   20 | 12-8   |   60.0% |     +28.6% |    +10.33 |     3.01× | 2026-09-14 |
|   14 | 7923c4  | MLB,NBA,UFC |   62 | 38-24  |   61.3% |     +28.2% |    +44.14 |     0.92× | 2026-09-15 |
|   15 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    3 | 2a8409  | MLB,NFL,WNBA |   25 | 8-17   |   32.0% |     -32.6% |    -19.06 |     1.55× | 2026-09-13 |
|    4 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    5 | 8e6753  | CFB,MLB,NFL |   17 | 7-10   |   41.2% |     -13.1% |     -4.59 |     0.96× | 2026-09-15 |
|    6 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    7 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   62 | 28-34  |   45.2% |      -9.9% |    -17.05 |     3.54× | 2026-09-14 |
|    8 | 120215  | MLB,SOC    |   11 | 6-5    |   54.5% |      -9.8% |     -3.08 |     1.43× | 2026-09-15 |
|    9 | c9bba3  | CFB,MLB,NFL,SOC |   21 | 12-9   |   57.1% |      -9.1% |     -4.11 |     1.14× | 2026-09-15 |
|   10 | 2f2a9e  | MLB,SOC,WNBA |   84 | 44-40  |   52.4% |      -6.7% |    -15.05 |     1.99× | 2026-09-07 |
|   11 | 9214c2  | MLB        |   47 | 21-26  |   44.7% |      -4.5% |     -5.85 |     1.12× | 2026-09-15 |
|   12 | bc35e3  | CFB,MLB,NFL,SOC,UFC,WNBA |   51 | 23-28  |   45.1% |      -3.8% |     -5.46 |     1.14× | 2026-09-15 |
|   13 | fb3150  | MLB,NFL,SOC |   16 | 9-7    |   56.3% |      -3.8% |     -1.15 |     1.12× | 2026-09-15 |
|   14 | ad88a3  | MLB,NFL,SOC |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-09-13 |
|   15 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |   99 | 47-52  |   47.5% |      -2.2% |     -6.12 |     1.19× | 2026-09-15 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `7da3d5` (FOR# 62, ROI -9.9%), `2f2a9e` (FOR# 84, ROI -6.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  2709 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   750 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     7 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   118 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     8 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   381 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            340 |        89 |   32 |   22 |  197 |                    143 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            338 |        93 |   50 |   20 |  175 |                    163 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  108 |   1052 | 1899 | 581-471 |  55.2% |      6.0% |    +175.43 |    +0.17 | 0.510 |        0.2499 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  992 |    +1.9pp |    +15.0pp |          +0.340 |   -0.038 |    +0.0901 | 🟡 mixed |
| v12 − v10          | +  990 |    +6.8pp |    +24.8pp |          +0.480 |   +0.117 |    +0.0305 | 🟢 better |
| v12 − v11          | +  941 |    +0.3pp |     +3.2pp |          +0.106 |   +0.067 |    +0.0143 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 9n 33.3% -55%  | 855n 53.8% +6% | 10n 30.0% +29% | 22n 54.5% -3%  | 6n 83.3% +38%  | 54n 66.7% +15% | 35n 77.1% +20% | 61n 57.4% -0%  | 1052n 55.2% +6% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 199n +9%      | 270n +3%      | 223n +7%      | 139n -3%      | 216n +12%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~3233 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1286 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 1047 / 1286 (81%) | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 1047 / 1286 (81%) | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 1047 / 1286 (81%) | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 1047 / 1286 (81%) | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 1047 / 1286 (81%) | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 1047 / 1286 (81%) | Count of proven AGAINST-side wallets                                 |
| countMargin          | 1047 / 1286 (81%) | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1286 / 1286 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1286 / 1286 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1286 / 1286 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1286 / 1286 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1286 / 1286 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1286 / 1286 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1279 / 1286 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1277 / 1286 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1286 / 1286 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1285 / 1286 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 821 / 1286 (64%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1285 / 1286 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 821 / 1286 (64%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 820 / 1286 (64%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1286 / 1286 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1286 / 1286 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1286 / 1286 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1285 / 1286 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1286 / 1286 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd sizeMargin        | 820 |      |    -0.023 |    -0.024 |      -0.048 |      -0.064 |  0.490 |
|    2 | wd agCount           | 821 |      |    +0.020 |    +0.273 |      +0.046 |      +0.139 |  0.515 |
|    3 | V12 forMean          | 1047 |  🟢  |    +0.076 |    +0.094 |      +0.043 |      +0.047 |  0.533 |
|    4 | wd maxForContrib     | 1285 |      |    -0.044 |    -0.083 |      -0.040 |      -0.042 |  0.486 |
|    5 | wd contribMargin     | 1286 |      |    -0.012 |    -0.087 |      -0.039 |      -0.082 |  0.479 |
|    6 | wd agAvgSize         | 821 |      |    +0.018 |    +0.023 |      +0.038 |      +0.042 |  0.508 |
|    7 | qMargin              | 1047 |  🟢  |    +0.075 |    +0.024 |      +0.037 |      +0.008 |  0.524 |
|    8 | wd contribFor        | 1286 |      |    -0.019 |    -0.025 |      -0.028 |      -0.034 |  0.482 |
|    9 | V12 agMean           | 1047 |  🟢  |    +0.012 |    +0.335 |      +0.026 |      +0.133 |  0.472 |
|   10 | lockPinnProb         | 1279 |      |    +0.191 |    +0.160 |      +0.025 |      -0.130 |  0.598 |
|   11 | hcMargin             | 1286 |      |    +0.003 |    +0.209 |      -0.025 |      +0.056 |  0.510 |
|   12 | clv                  | 1277 |      |    -0.021 |    +0.077 |      -0.022 |      +0.024 |  0.520 |
|   13 | ags (v11)            | 1286 |      |    +0.005 |    +0.056 |      -0.018 |      -0.018 |  0.514 |
|   14 | provenMargin         | 1286 |      |    +0.003 |    +0.098 |      -0.018 |      +0.008 |  0.499 |
|   15 | wd maxShare          | 1286 |      |    +0.021 |    -0.078 |      +0.015 |      -0.023 |  0.510 |
|   16 | wd forAvgSize        | 1285 |      |    +0.002 |    +0.057 |      -0.015 |      +0.003 |  0.517 |
|   17 | V12 agCount          | 1047 |  🟢  |    -0.016 |    +0.192 |      +0.014 |      +0.111 |  0.497 |
|   18 | provenAg             | 1286 |      |    -0.007 |    +0.186 |      +0.011 |      +0.085 |  0.489 |
|   19 | wd forCount          | 1285 |      |    +0.004 |    +0.163 |      -0.011 |      +0.029 |  0.492 |
|   20 | wd contribAg         | 1286 |      |    -0.012 |    +0.136 |      +0.010 |      +0.065 |  0.490 |
|   21 | countMargin          | 1047 |      |    +0.032 |    +0.122 |      -0.010 |      -0.002 |  0.504 |
|   22 | provenFor            | 1286 |      |    -0.002 |    +0.122 |      -0.008 |      +0.026 |  0.497 |
|   23 | peakStars            | 1286 |      |    +0.025 |    +0.035 |      +0.004 |      -0.016 |  0.512 |
|   24 | agsV12               | 1047 |  🟢  |    +0.020 |    -0.053 |      +0.002 |      -0.024 |  0.535 |
|   25 | V12 forCount         | 1047 |  🟢  |    +0.021 |    +0.223 |      -0.000 |      +0.065 |  0.506 |
|   26 | provenTotal          | 1286 |      |    -0.004 |    +0.090 |      -0.000 |      +0.032 |  0.495 |

> **Top 3 univariate features by PnL correlation:** `wd sizeMargin` (r = -0.048), `wd agCount` (r = +0.046), `V12 forMean` (r = +0.043).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd sizeMargin` · r(unit-ret) = -0.048 · AUC = 0.490

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.203          | 274 | 155-119 |   56.6% |     +2.6% |
| MID (p33–p67)     | 0.078 … 0.140            | 273 | 143-130 |   52.4% |     +0.4% |
| HIGH (> p67)      | 3.728 … 0.663            | 273 | 147-126 |   53.8% |     -1.8% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd agCount` · r(unit-ret) = +0.046 · AUC = 0.515

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 369 | 196-173 |   53.1% |     -0.8% |
| MID (p33–p67)     | 2.000 … 2.000            | 200 | 106-94  |   53.0% |     -0.4% |
| HIGH (> p67)      | 3.000 … 5.000            | 252 | 143-109 |   56.7% |     +2.6% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `V12 forMean` · r(unit-ret) = +0.043 · AUC = 0.533

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 7.618            | 349 | 188-161 |   53.9% |     +0.4% |
| MID (p33–p67)     | 19.950 … 20.303          | 349 | 188-161 |   53.9% |     +0.0% |
| HIGH (> p67)      | 48.906 … 33.555          | 349 | 202-147 |   57.9% |     +1.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.040 · AUC = 0.486

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 35.700          | 429 | 243-186 |   56.6% |     +2.1% |
| MID (p33–p67)     | 52.400 … 53.700          | 432 | 237-195 |   54.9% |     +0.5% |
| HIGH (> p67)      | 100.000 … 69.900         | 424 | 225-199 |   53.1% |     -0.7% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd contribMargin` · r(unit-ret) = -0.039 · AUC = 0.479

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 9.550          | 430 | 246-184 |   57.2% |     +2.6% |
| MID (p33–p67)     | 57.800 … 54.300          | 427 | 236-191 |   55.3% |     +1.0% |
| HIGH (> p67)      | 174.100 … 111.400        | 429 | 223-206 |   52.0% |     -2.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd sizeMargin  | wd agCount     | V12 forMean    | wd maxForContrib | wd contribMargin | wd agAvgSize   | qMargin        | wd contribFor  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd sizeMargin |  1.000         |         +0.043 |         +0.179 |         +0.229 |         +0.234 |         -0.679 |         +0.170 |         +0.203 |
| wd agCount  |         +0.043 |  1.000         |         +0.142 |         +0.273 |         -0.142 |         +0.093 |         +0.008 |         +0.457 |
| V12 forMean |         +0.179 |         +0.142 |  1.000         |         +0.185 |         +0.059 |         -0.035 |         +0.939 |         +0.142 |
| wd maxForContrib |         +0.229 |         +0.273 |         +0.185 |  1.000         |         +0.503 |         +0.057 |         +0.136 |         +0.644 |
| wd contribMargin |         +0.234 |         -0.142 |         +0.059 |         +0.503 |  1.000         |         -0.139 |         +0.045 |         +0.769 |
| wd agAvgSize |         -0.679 |         +0.093 |         -0.035 |         +0.057 |         -0.139 |  1.000         |         -0.056 |         +0.005 |
| qMargin     |         +0.170 |         +0.008 |         +0.939 |         +0.136 |         +0.045 |         -0.056 |  1.000         |         +0.056 |
| wd contribFor |         +0.203 |         +0.457 |         +0.142 |         +0.644 |         +0.769 |         +0.005 |         +0.056 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.939. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 703 picks · features = 8 (+ intercept) · multiple R² = **0.0137** · adjusted R² = **0.0009** · residual sd = 0.954

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.2275 |   0.1356 | -1.68 (~sig) |        1 |
|    2 | wd agCount           |     |    +0.1618 |   0.0857 | +1.89 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.1574 |   0.1194 | +1.32        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.0694 |   0.1143 | +0.61        |        4 |
|    5 | wd agAvgSize         |     |    +0.0435 |   0.0532 | +0.82        |        5 |
|    6 | wd sizeMargin        |     |    -0.0269 |   0.0535 | -0.50        |        6 |
|    7 | qMargin              |  🟢 |    -0.0169 |   0.1130 | -0.15        |        7 |
|    8 | wd maxForContrib     |     |    +0.0068 |   0.0490 | +0.14        |        8 |
| —    | (intercept)          |     |    +0.0236 |   0.0360 |    +0.66 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.069), `qMargin` (β = -0.017)
- V12 IGNORES: `wd contribFor` (β = -0.227, t = -1.68), `wd agCount` (β = +0.162, t = +1.89), `wd contribMargin` (β = +0.157, t = +1.32), `wd agAvgSize` (β = +0.043, t = +0.82), `wd sizeMargin` (β = -0.027, t = -0.50), `wd maxForContrib` (β = +0.007, t = +0.14)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.532 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.553 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.021.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd contribFor` (β = -0.227, t = -1.68), `wd agCount` (β = +0.162, t = +1.89). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of 0.0009 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*