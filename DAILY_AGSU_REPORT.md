# AGS-Unified — V12 Daily Monitor

**Generated:** Thursday, September 17, 2026 at 1:13 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (109 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (109 days ago), V12 has evaluated **3864** picks, shipped **1068** for real money (27.6% ship rate), and muted the other **2796**. On the shipped picks V12 has gone **585-483** (54.8% win), staked **2974.05u**, and returned **+145.52u** at **+4.9% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            109 |
| Picks V12 has evaluated             |                           3864 |
| Picks SHIPPED (units > 0)           |                           1068 |
| Picks MUTED (score ≤ 0, FADE)       |                           2796 |
| Ship rate                           |                          27.6% |
| Live W-L                            |                        585-483 |
| Live Win %                          |                          54.8% |
| Live PnL (units)                    |                        +145.52 |
| Live ROI                            |                          +4.9% |
| Avg PnL / day                       |                         +1.34u |
| Most recent action (2026-09-20)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.9% ROI** across 1068 live picks (+145.52u real PnL).
- Mute rule is **saving money** — the 1923 muted picks would have lost -102.32u at flat 1u (-5.3% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.34u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **349-290** · +5.5% ROI · +98.91u on 639 graded — see § 5.

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

**Full book:** 109d · 1068 live · 585-483 · **+145.52u** · +4.9% ROI · +1.34u/day.

_Prior to table (2026-06-01 → 2026-08-29): 902 live · 493-409 · +105.67u · cum through prior = +105.67u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-09-16 |        56 |   16 |    24 | 4-12       |  25.0% |     54.90 |     -29.91 |    -54.5% |    +145.52 |
| 2026-09-17 |        35 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +145.52 |
| 2026-09-19 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +145.52 |
| 2026-09-20 |         2 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +145.52 |

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-16**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 23 | 17-6 | +43.6% | +42.11u | +1.83u | +3.7% |
| 🟢 2 | RANK 2-for-0 rescue | B | 113 | 66-47 | +12.7% | +51.85u | +0.46u | -36.4% |
| 🟢 3 | DISSENT rescue | D | 24 | 13-11 | +12.0% | +3.05u | +0.13u | — |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 135 | 83-52 | +9.9% | +61.88u | sized UP after path |
| 2 | Tape HOLD (mid) | 440 | 238-202 | +5.9% | +61.12u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 30 | 13-17 | -33.4% | -21.57u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 62 | 27-35 | -6.5% | -4.01u | 🟢 saving $ |
| 2 | Score FADE (≤0 → 0u) | 993 | 504-489 | +0.7% | +6.71u | 🟡 flat |
| 3 | Tape MUTE (tape<0 → 0u) | 200 | 108-92 | +1.3% | +2.51u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 23 | 17-6 | 73.9% | 96.5u | +42.11u | +43.6% | +1.83u | 2 | +3.7% | +2.30u | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 0 | — | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 113 | 66-47 | 58.4% | 409.0u | +51.85u | +12.7% | +0.46u | 10 | -36.4% | -8.00u | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 93 | 44-49 | 47.3% | 323.8u | -21.88u | -6.8% | -0.24u | 6 | -54.7% | -8.40u | 🔻 cooling |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 113 | 58-55 | 51.3% | 316.3u | -1.69u | -0.5% | -0.01u | 4 | -2.5% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 107 | 62-45 | 57.9% | 287.5u | +21.31u | +7.4% | +0.20u | 10 | -1.5% | — | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 0 | — | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 0 | — | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 135 | 83-52 | 61.5% | 627.5u | +61.88u | +9.9% | 14 | -23.0% | -8.10u |
| Tape HOLD (mid) | TAPE | staked | 440 | 238-202 | 54.1% | 1042.8u | +61.12u | +5.9% | 65 | -0.1% | -17.31u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 30 | 13-17 | 43.3% | 64.5u | -21.57u | -33.4% | 3 | -64.0% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 200 | 108-92 | 54.0% | 200.0u | +2.51u | +1.3% | 41 | +7.8% | -3.00u |
| fadeTop≥60 MUTE | E | CF 1u | 62 | 27-35 | 43.5% | 62.0u | -4.01u | -6.5% | 17 | -25.8% | +0.49u |
| Score FADE (≤0 → 0u) | score | CF 1u | 993 | 504-489 | 50.8% | 993.0u | +6.71u | +0.7% | 133 | +3.2% | +7.58u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 2 / +4% | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 64 / +9% | 10 / +27% | — |
| SHARP | 21 / -20% | 46 / -1% | 1 / -100% |
| SHARP-LEAN | 83 / +0% | 26 / +2% | 4 / -63% |
| MINI | 53 / +3% | 12 / +51% | 5 / -25% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-16)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| HC-2 SUPER | 1 | 1-0 | +2.30u | +38.3% |
| RANK 2-for-0 rescue | 2 | 0-2 | -8.00u | -100.0% |
| SHARP EDGE/net BOTH | 2 | 0-2 | -8.40u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  33 | 17-6   |  73.9% |       96.50 |     +42.11 |     43.6% |
| TOP PICK (TOP+/TOP)       |  4-5u | 232 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 797 | 174-159 |  52.3% |     1098.05 |     +21.67 |      2.0% |
| STRONG (MINI)             |    3u | 183 | 62-45  |  57.9% |      287.45 |     +21.31 |      7.4% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 144 | 27-22  |  55.1% |       56.85 |      +4.15 |      7.3% |
| **STAKED TOTAL** |     — | 647 | 358-289 |  55.3% |     2061.05 |     +95.68 |     +4.6% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  33 | 17-6   |  73.9% |       96.50 |     +42.11 |     43.6% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 203 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 188 | 66-47  |  58.4% |      408.95 |     +51.85 |     12.7% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 452 | 58-55  |  51.3% |      316.34 |      -1.69 |     -0.5% |
| C · proven-$ consensus | SHARP       |    3u | 143 | 44-49  |  47.3% |      323.76 |     -21.88 |     -6.8% |
| A · mini-HC (gate-pass) | MINI        |    3u | 183 | 62-45  |  57.9% |      287.45 |     +21.31 |      7.4% |
| C · mini gate-cut     | MINI-       |    1u |  35 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |  14 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  95 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 709 picks tracked at 0u (would-be 334-375, 47.1% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (22-11, +42.11u)  ·  🟢 TOP PICK (125-107, +6.44u)  ·  🟠 SHARP PLAY (392-405, +21.67u)  ·  🔴 STRONG (102-81, +21.31u)  ·  🟣 LEAN (83-61, +4.15u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81, 39.81, 39.81, 39.81, 42.11]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 37.04, 38.07, 38.07, 38.07, 21.67]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 14.28, 22.4, 22.4, 21.31, 21.31]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66, 66, 66, 66, 67]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 49, 49]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 55, 56, 56, 56, 56]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 58, 57, 58, 58, 58]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 2552 | 2540 | 2492 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 200 | 108-92 | 54.0% | 47.00u | -4.40u | -9.4% |
| HOLD      | 830 | 421-409 | 50.7% | 1045.82u | +58.12u | +5.6% |
| BOOST     | 240 | 136-104 | 56.7% | 630.98u | +63.96u | +10.1% |
| FAIL_OPEN | 60 | 34-26 | 56.7% | 64.50u | -21.57u | -33.4% |
| PASS      | 1162 | 579-583 | 49.8% | 13.50u | -1.52u | -11.3% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 911 | 477-434 | 52.4% | +13.01u |
| hold (0–2.89) | path u | 1031 | 503-528 | 48.8% | +42.09u |
| boost (≥2.89) | ×1.35 | 297 | 164-133 | 55.2% | +61.91u |

_Score coverage: **2239/2492** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 200 | +14.30u | -14.30u | +120.75u | +135.05u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 137 | +44.46u | +63.96u | +19.50u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-17 | MLB | Minnesota Twins | PATH-D | -3.25 | MUTE | 1.00u | 0.00u | — |
| 2026-09-17 | NFL | Bills | SHARP | 3.29 | BOOST | 3.00u | 0.00u | — |
| 2026-09-17 | SOC | Villarreal CF | HC-2 | 3.93 | BOOST | 6.00u | 0.00u | — |
| 2026-09-17 | WNBA | Las Vegas Aces | SHARP~ | 4.39 | BOOST | 4.00u | 0.00u | — |
| 2026-09-17 | WNBA | Phoenix Mercury | SHARP~ | 4.11 | BOOST | 4.00u | 0.00u | — |
| 2026-09-17 | MLB | Milwaukee Brewers | CONFIRMED-UNOPP | 3.11 | BOOST | 2.50u | 0.00u | — |
| 2026-09-17 | MLB | Colorado Rockies | PATH-D | -1.22 | MUTE | 1.00u | 0.00u | — |
| 2026-09-17 | NFL | Bills | HC-1 | 3.96 | BOOST | 2.50u | 0.00u | — |
| 2026-09-17 | MLB | Over 7.5 | CONFIRMED-UNOPP | -1.15 | MUTE | 1.00u | 0.00u | — |
| 2026-09-16 | MLB | St. Louis Cardinals | SHARP~ | -0.33 | MUTE | 2.00u | 0.00u | LOSS |
| 2026-09-16 | SOC | Club Atlético de Madri | HC-2 | 11.88 | BOOST | 6.00u | 6.00u | WIN |
| 2026-09-16 | SOC | FC Barcelona | 2-for-0 | 6.26 | BOOST | 5.00u | 0.00u | WIN |
| 2026-09-16 | MLB | Over 8.5 | SHARP | 7.61 | BOOST | 4.00u | 5.40u | LOSS |
| 2026-09-16 | MLB | Under 8.5 | CONFIRMED-Q1 | 3.00 | BOOST | 2.00u | 5.00u | LOSS |
| 2026-09-16 | MLB | Over 9.5 | SHARP~ | -0.01 | MUTE | 1.00u | 0.00u | LOSS |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.79** · nPriors=625 · source=expanding_q1 · asOf=2026-09-17 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 2106 | 1995 | 1954 | 416 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 150 | 62-88 | 41.3% | 13.00u | -5.29u | -40.7% |
| HOLD      | 419 | 216-203 | 51.6% | 343.50u | +8.24u | +2.4% |
| FAIL_OPEN | 56 | 24-32 | 42.9% | 44.90u | -5.08u | -11.3% |
| EXEMPT    | 845 | 457-388 | 54.1% | 874.25u | +72.44u | +8.3% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -107.3 … -3.0 | 77 | 27-50 | 35.1% | 0.0u | +0.00u | — |
| Q2 | -2.9 … 0.9 | 77 | 36-41 | 46.8% | 36.9u | +14.66u | +39.7% |
| Q3 | 0.9 … 5.7 | 77 | 36-41 | 46.8% | 63.5u | -2.37u | -3.7% |
| Q4 | 6.0 … 18.5 | 77 | 39-38 | 50.6% | 86.6u | -9.79u | -11.3% |
| Q5 | 18.8 … 1802.6 | 78 | 45-33 | 57.7% | 116.5u | +3.24u | +2.8% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 150 | 62-88 | -25.87u | +25.87u | +106.90u | +81.03u |

> 🟢 **Mute is saving money** (Δ +25.87u · muted WR 41.3%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 70 | 25-45 | 35.7% | 83.4u | -26.02u |
| CFB | 9 | 3-6 | 33.3% | 15.9u | +1.63u |
| MLB | 100 | 44-56 | 44.0% | 116.5u | -11.62u |
| NFL | 13 | 4-9 | 30.8% | 18.4u | -9.77u |
| SOC | 6 | 2-4 | 33.3% | 6.0u | -0.94u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-17 | MLB | Kansas City Royals | SHARP~ | -3.9 | -0.8 | 1.00u | pending |
| 2026-09-17 | MLB | Milwaukee Brewers | CONFIRMED-UNOPP | -5.0 | -0.8 | 2.50u | pending |
| 2026-09-17 | MLB | Colorado Rockies | PATH-D | -6.3 | -0.8 | 1.00u | pending |
| 2026-09-17 | MLB | Under 8.5 | SHARP~ | -2.3 | -0.8 | 1.00u | pending |
| 2026-09-16 | MLB | Baltimore Orioles | — | -50.9 | -0.9 | 1.00u | WIN |
| 2026-09-16 | MLB | Atlanta Braves | SHARP~ | -1.2 | -0.9 | 1.00u | LOSS |
| 2026-09-16 | MLB | Minnesota Twins | CONFIRMED-UNOPP | -1.2 | -0.9 | 1.00u | WIN |
| 2026-09-16 | MLB | Under 6.5 | SHARP~ | -5.7 | -0.9 | 1.00u | WIN |
| 2026-09-16 | MLB | Over 9.5 | SHARP~ | -0.9 | -0.9 | 1.00u | LOSS |
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

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 96 | 49-47 | 51.0% | 303.5u | +5.74u | +1.9% |
| Muted (Q1 → 0u) | 150 | 62-88 | 41.3% | 13.0u | -5.29u | -40.7% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 162–93 · 63.5% · +14.5%); **5–10 is the hole** (97–88 · 52.4% · +1.0%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 850 tickets · cov 822/850 (stamp 620 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 382 | 195–187 | 51.0% | -3.0% |
| 5–10 | 185 | 97–88 | 52.4% | +1.0% |
| ≥10 | 255 | 162–93 | 63.5% | +14.5% |
| All | 850 | 467–383 | 54.9% | +5.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 57.5% (73) | 70.1% (97) |
| B | 54.5% (77) | 61.5% (13) | 69.6% (23) |
| C | 37.5% (40) | 44.1% (59) | 56.1% (114) |

##### Jul 15+ · 639 tickets · cov 617/639 (stamp 615 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 276 | 142–134 | 51.4% | -0.1% |
| 5–10 | 146 | 74–72 | 50.7% | +0.1% |
| ≥10 | 195 | 123–72 | 63.1% | +12.2% |
| All | 639 | 349–290 | 54.6% | +5.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 56.8% (44) | 71.4% (56) |
| B | 54.9% (51) | 50% (8) | 68.8% (16) |
| C | 36.8% (19) | 44.4% (54) | 56.7% (104) |

##### Yesterday (Sep 16) · 16 tickets · cov 16/16 (stamp 16 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 9 | 1–8 | 11.1% | -83.2% |
| 5–10 | 3 | 1–2 | 33.3% | -34.0% |
| ≥10 | 4 | 2–2 | 50.0% | -27.6% |
| All | 16 | 4–12 | 25.0% | -54.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | 0% (2) | — | — |
| C | — | 0% (1) | 0% (1) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 850 tickets · cov 842/850 (stamp 631 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 559 | 313–246 | 56.0% | +5.7% |
| 5–10 | 145 | 75–70 | 51.7% | +4.4% |
| ≥10 | 138 | 77–61 | 55.8% | +5.5% |
| All | 850 | 467–383 | 54.9% | +5.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 58.3% (180) | 50% (52) | 71.4% (56) |
| B | 60.5% (86) | 50% (14) | 53.8% (13) |
| C | 50% (120) | 56% (50) | 40.8% (49) |

##### Jul 15+ · 639 tickets · cov 632/639 (stamp 631 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 409 | 235–174 | 57.5% | +10.1% |
| 5–10 | 122 | 62–60 | 50.8% | +3.7% |
| ≥10 | 101 | 50–51 | 49.5% | -5.1% |
| All | 639 | 349–290 | 54.6% | +5.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 64% (86) | 47.2% (36) | 62.9% (35) |
| B | 58.6% (58) | 50% (10) | 57.1% (7) |
| C | 53.8% (93) | 55.3% (47) | 37.5% (40) |

##### Yesterday (Sep 16) · 16 tickets · cov 16/16 (stamp 16 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 11 | 2–9 | 18.2% | -70.1% |
| 5–10 | 3 | 1–2 | 33.3% | -20.8% |
| ≥10 | 2 | 1–1 | 50.0% | -27.2% |
| All | 16 | 4–12 | 25.0% | -54.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | 0% (2) | — | — |
| C | — | 0% (1) | 0% (1) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 850 tickets · cov 820/850 (stamp 612 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 178 | 89–89 | 50.0% | -11.1% |
| 0–2.89 | 457 | 246–211 | 53.8% | +7.1% |
| ≥2.89 | 185 | 119–66 | 64.3% | +14.2% |
| All | 850 | 467–383 | 54.9% | +5.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.9% (164) | 75.3% (73) |
| B | 62.9% (35) | 54.1% (61) | 64.7% (17) |
| C | 18.2% (11) | 49.6% (123) | 53.8% (78) |

##### Jul 15+ · 639 tickets · cov 615/639 (stamp 612 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 109 | 61–48 | 56.0% | +5.5% |
| 0–2.89 | 366 | 192–174 | 52.5% | +4.5% |
| ≥2.89 | 140 | 86–54 | 61.4% | +9.8% |
| All | 639 | 349–290 | 54.6% | +5.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 54.2% (107) | 74.4% (43) |
| B | 63.2% (19) | 54.3% (46) | 60% (10) |
| C | — | 50% (104) | 52.8% (72) |

##### Yesterday (Sep 16) · 16 tickets · cov 16/16 (stamp 16 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 4 | 1–3 | 25.0% | -57.2% |
| 0–2.89 | 9 | 2–7 | 22.2% | -56.5% |
| ≥2.89 | 3 | 1–2 | 33.3% | -49.4% |
| All | 16 | 4–12 | 25.0% | -54.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | — | 0% (2) | — |
| C | — | 0% (1) | 0% (1) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 639 | 349-290 | 54.6% | 1797.80u | +98.91u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 639/639 | 2.96 | 2.87 | +0.08 | 2.00 | 2.00 |
| depth   | #A sharps        | 639/639 | 1.59 | 1.70 | -0.11 | 1.00 | 1.00 |
| depth   | #F − #A          | 639/639 | 1.37 | 1.17 | +0.20 | 1.00 | 1.00 |
| depth   | proven F         | 639/639 | 2.11 | 2.09 | +0.03 | 2.00 | 2.00 |
| depth   | proven A         | 639/639 | 0.82 | 0.86 | -0.04 | 0.00 | 0.00 |
| depth   | proven F−A       | 639/639 | 1.30 | 1.23 | +0.06 | 1.00 | 1.00 |
| depth   | v12 F count      | 639/639 | 2.93 | 2.87 | +0.06 | 2.00 | 2.00 |
| depth   | v12 A count      | 639/639 | 1.65 | 1.75 | -0.09 | 1.00 | 1.00 |
| depth   | WA ForN          | 639/639 | 2.32 | 2.35 | -0.03 | 2.00 | 2.00 |
| depth   | WA AgN           | 639/639 | 1.36 | 1.49 | -0.13 | 1.00 | 1.00 |
| depth   | CLV ForN         | 638/639 | 2.66 | 2.60 | +0.06 | 2.00 | 2.00 |
| depth   | CLV AgN          | 638/639 | 1.56 | 1.66 | -0.10 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 639/639 | 0.34 | 0.30 | +0.03 | 0.00 | 0.00 |
| quality | ForWR            | 615/639 | 56.87 | 55.37 | +1.50 | 54.80 | 54.34 |
| quality | AgWR             | 415/639 | 46.39 | 47.59 | -1.20 | 47.90 | 48.49 |
| quality | TopFor WR        | 615/639 | 61.82 | 60.77 | +1.05 | 58.40 | 57.83 |
| quality | TopAg WR         | 415/639 | 49.85 | 50.82 | -0.97 | 51.00 | 50.89 |
| quality | EDGE             | 615/639 | 9.15 | 6.88 | +2.27 | 7.00 | 5.10 |
| quality | ForCLV           | 631/639 | 63.92 | 64.00 | -0.08 | 64.19 | 64.69 |
| quality | AgCLV            | 441/639 | 62.27 | 61.05 | +1.23 | 63.22 | 62.40 |
| quality | netCLV           | 631/639 | 1.74 | 2.68 | -0.95 | 2.21 | 2.79 |
| quality | Tape             | 612/639 | 2.09 | 1.75 | +0.34 | 1.51 | 1.37 |
| quality | V12 score        | 639/639 | 0.78 | 0.76 | +0.02 | 0.95 | 0.93 |
| quality | V12 forMean      | 639/639 | 29.83 | 25.02 | +4.81 | 24.31 | 18.26 |
| quality | V12 agMean       | 639/639 | 4.20 | 3.95 | +0.25 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 615/639 | 0.555 | +0.002 | +0.109 | +2.27 | 🟡 mild OK |
|    2 | V12 score        | quality | 639/639 | 0.547 | -0.062 | +0.035 | +0.02 | 🟡 mild OK |
|    3 | AgCLV            | quality | 441/639 | 0.546 | -0.033 | +0.081 | +1.23 | 🟡 mild inv |
|    4 | V12 forMean      | quality | 639/639 | 0.541 | +0.207 | +0.089 | +4.81 | 🟡 mild OK |
|    5 | V12 agMean       | quality | 639/639 | 0.460 | +0.348 | +0.015 | +0.25 | flat |
|    6 | AgWR             | quality | 415/639 | 0.461 | +0.193 | -0.088 | -1.20 | flat |
|    7 | ForWR            | quality | 615/639 | 0.534 | +0.088 | +0.083 | +1.50 | flat |
|    8 | netCLV           | quality | 631/639 | 0.469 | -0.127 | -0.041 | -0.95 | flat |
|    9 | TopFor WR        | quality | 615/639 | 0.530 | +0.204 | +0.050 | +1.05 | flat |
|   10 | Tape             | quality | 612/639 | 0.528 | -0.084 | +0.059 | +0.34 | flat |
|   11 | proven A         | depth   | 639/639 | 0.473 | +0.326 | -0.015 | -0.04 | flat |
|   12 | unopposed (A=0)  | depth   | 639/639 | 0.526 | +0.223 | +0.037 | +0.03 | flat |
|   13 | WA AgN           | depth   | 639/639 | 0.475 | +0.207 | -0.039 | -0.13 | flat |
|   14 | TopAg WR         | quality | 415/639 | 0.479 | +0.153 | -0.055 | -0.97 | flat |
|   15 | ForCLV           | quality | 631/639 | 0.482 | -0.189 | -0.004 | -0.08 | flat |
|   16 | #A sharps        | depth   | 639/639 | 0.483 | +0.197 | -0.031 | -0.11 | flat |
|   17 | WA ForN          | depth   | 639/639 | 0.483 | +0.289 | -0.008 | -0.03 | flat |
|   18 | v12 A count      | depth   | 639/639 | 0.484 | +0.185 | -0.027 | -0.09 | flat |
|   19 | CLV AgN          | depth   | 638/639 | 0.486 | +0.184 | -0.028 | -0.10 | flat |
|   20 | proven F−A       | depth   | 639/639 | 0.507 | +0.209 | +0.021 | +0.06 | flat |
|   21 | proven F         | depth   | 639/639 | 0.493 | +0.352 | +0.008 | +0.03 | flat |
|   22 | CLV ForN         | depth   | 638/639 | 0.505 | +0.274 | +0.015 | +0.06 | flat |
|   23 | v12 F count      | depth   | 639/639 | 0.495 | +0.280 | +0.013 | +0.06 | flat |
|   24 | #F − #A          | depth   | 639/639 | 0.502 | +0.169 | +0.040 | +0.20 | flat |
|   25 | #F sharps        | depth   | 639/639 | 0.501 | +0.283 | +0.018 | +0.08 | flat |

### (C) Working read

_N=639 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.555 · Δ +2.27 · higher on WINs (cov 615/639)
- **V12 score** — AUC 0.547 · Δ +0.02 · higher on WINs (cov 639/639)
- **V12 forMean** — AUC 0.541 · Δ +4.81 · higher on WINs (cov 639/639)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1136 | 341 | 341 | 334 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 65 | 34-31 | 52.3% | 201.45u | +5.97u | +3.0% | -0.4 |
| on→off | 13 | 5-8 | 38.5% | 38.70u | -9.20u | -23.8% | -5.1 |
| off→on | 65 | 38-27 | 58.5% | 205.60u | +22.50u | +10.9% | +1.7 |
| off→off | 191 | 105-86 | 55.0% | 498.30u | +21.88u | +4.4% | -0.6 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 206 | 110-96 | 53.4% | 615.30u | +10.27u | +1.7% |
| 0–2 | 89 | 53-36 | 59.6% | 238.35u | +55.55u | +23.3% |
| 2–4 | 20 | 11-9 | 55.0% | 53.90u | -2.87u | -5.3% |
| 4+ | 19 | 8-11 | 42.1% | 36.50u | -21.80u | -59.7% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 4 | 3-1 | 75.0% | 10.00u | +3.72u | +37.2% |
| gold, limits flat | 8 | 5-3 | 62.5% | 24.30u | +10.59u | +43.6% |
| steam, not gold | 118 | 64-54 | 54.2% | 372.75u | +14.16u | +3.8% |
| limits↑, no steam | 11 | 5-6 | 45.5% | 28.90u | +1.60u | +5.5% |
| neither | 193 | 105-88 | 54.4% | 508.10u | +11.08u | +2.2% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 123 | 68-55 | 55.3% | 392.65u | +23.94u | +6.1% |
| A/B + no steam | 183 | 101-82 | 55.2% | 474.80u | +33.73u | +7.1% |
| A/B + steam arriving | 63 | 37-26 | 58.7% | 203.60u | +22.24u | +10.9% |
| A/B + gold | 9 | 5-4 | 55.6% | 24.90u | +7.30u | +29.3% |
| steam at lock, no A/B | 7 | 4-3 | 57.1% | 14.40u | +4.53u | +31.5% |
| Source B + steam arriving | 61 | 36-25 | 59.0% | 197.60u | +22.10u | +11.2% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 3n · 66.7% · -14.7%    | 3n · 33.3% · -47.5%    | 3n · 0.0% · -100.0%    | 9n · 33.3% · -54.6%    |
| MLB   | 433n · 54.5% · +7.4%   | 100n · 55.0% · +1.0%   | 337n · 51.0% · +1.4%   | 870n · 53.2% · +4.1%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 12n · 58.3% · +3.0%    | 6n · 50.0% · -29.1%    | 4n · 50.0% · +6.7%     | 22n · 54.5% · -2.9%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 55n · 67.3% · +15.7%   | —                      | —                      | 55n · 67.3% · +15.7%   |
| UFC   | 35n · 77.1% · +20.5%   | —                      | —                      | 35n · 77.1% · +20.5%   |
| WNBA  | 27n · 74.1% · +3.2%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 61n · 57.4% · -0.5%    |
| **All** | **572n · 57.9% · +9.0%** | **132n · 53.0% · +0.1%** | **364n · 50.5% · +0.6%** | **1068n · 54.8% · +4.9%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.
> **V12's weakest sub-market:** CFB TOTAL — 3 live, 0-3, -100.0% ROI, -7.00u PnL. Consider tightening V12's threshold here.

## § 7 — Mute Audit

V12 muted **1923** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1923 |
| Muted W-L                           |              945-978 |
| Muted Win %                         |                49.1% |
| Counterfactual PnL at flat 1u       |              -102.32 |
| Counterfactual ROI at flat 1u       |                -5.3% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-102.32u** at a flat 1u stake — a counterfactual ROI of **-5.3%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-09-16 | MLB   | ML     | Chicago Cubs            |  -162 | +0.210 | CONFIRMED-Q1 |   3/3 |   2/2 |  67.5 |   56.9 |  +16.2 |  2.06 | HOLD     | 4.00u | WIN     |      +2.47 |
| 2026-09-16 | MLB   | ML     | New York Mets           |  -110 | +0.472 | CONFIRMED-Q1 |   7/3 |   6/2 |  54.2 |   57.3 |   +4.9 | -0.67 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-16 | MLB   | ML     | Houston Astros          |  -162 | +0.775 | CONFIRMED-Q1 |   6/3 |   4/1 |  52.1 |   61.3 |   +3.9 |  0.70 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-16 | MLB   | ML     | Los Angeles Dodgers     |  -220 | +0.299 | CONFIRMED-Q1 |   9/3 |   9/3 |  56.1 |   50.8 |   +5.0 | -0.32 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-16 | MLB   | ML     | Pittsburgh Pirates      |  +112 | +0.049 | CONFIRMED-Q1 |   4/6 |   4/6 |  54.7 |   63.8 |   +4.4 |  1.16 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-16 | MLB   | ML     | Washington Nationals    |  +164 | +0.049 | CONFIRMED-Q1 |   5/4 |   5/4 |  54.7 |   56.0 |   -5.0 |  0.20 | PASS     | 1.50u | LOSS    |      -1.50 |
| 2026-09-16 | SOC   | ML     | Club Atlético de Madrid |  -261 | +0.653 | HC-2     |  11/2 |   8/1 |  61.2 |   66.0 |  +50.1 | 11.88 | BOOST    | 6.00u | WIN     |      +2.30 |
| 2026-09-16 | MLB   | TOTAL  | Over 7.5                |  -102 | +0.677 | CONFIRMED-Q1 |   3/2 |   3/2 |  61.9 |   69.0 |   +5.5 |  2.08 | HOLD     | 3.00u | WIN     |      +2.94 |
| 2026-09-16 | MLB   | TOTAL  | Over 8.5                |  -129 | +0.376 | SHARP    |   2/3 |   1/3 |  79.8 |   77.8 |  +26.4 |  7.61 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-09-16 | MLB   | TOTAL  | Under 8.5               |  -113 | +0.326 | CONFIRMED-Q1 |   1/6 |   2/4 |  64.9 |   65.0 |  +13.2 |  3.00 | BOOST    | 5.00u | LOSS    |      -5.00 |
| 2026-09-16 | MLB   | TOTAL  | Over 7.5                |  +104 | +0.975 | 2-for-0  |   3/0 |   3/0 |  51.8 |   63.7 |   +1.8 |  0.61 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-16 | MLB   | TOTAL  | Over 8.5                |  +110 | +0.973 | 2-for-0  |   3/1 |   3/1 |  50.5 |   63.9 |   +1.3 |  0.40 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-16 | MLB   | TOTAL  | Over 8.5                |  +114 | +0.382 | CONFIRMED-Q1 |   4/1 |   2/1 |  51.2 |   60.4 |   -3.7 | -2.35 | HOLD     | 2.00u | WIN     |      +2.28 |
| 2026-09-16 | MLB   | TOTAL  | Over 8.5                |  -119 | +0.302 | SHARP    |   6/3 |   4/5 |  62.3 |   67.8 |   +7.7 |  2.42 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-16 | MLB   | TOTAL  | Under 11.5              |  -113 | +0.461 | CONFIRMED-Q1 |   4/4 |   4/3 |  54.6 |   67.0 |   +3.0 |  0.86 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-16 | MLB   | TOTAL  | Under 8.5               |  -108 | +0.829 | CONFIRMED-Q1 |   3/2 |   2/1 |  54.9 |   50.6 |   +4.5 | -1.74 | MUTE     | 3.00u | LOSS    |      -3.00 |
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

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.539 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.075 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.057 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.023 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.030 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return | 1063 |    +0.0451 |    -0.0225 | 0.0002 |  +0.013 |   0.950 | positive (higher score ⇒ better outcome)                 |
| won (binary)        | 1063 |    +0.0566 |    +0.5016 | 0.0009 |  +0.030 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    | 1063 |    -0.1727 |    +0.2744 | 0.0003 |  -0.016 |   2.873 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 1063 |          +0.076 |           +0.096 |                   +0.044 |                   +0.047 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 1063 |          +0.003 |           +0.327 |                   +0.017 |                   +0.128 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 1063 |          +0.014 |           +0.220 |                   -0.007 |                   +0.063 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 1063 |          -0.026 |           +0.188 |                   +0.003 |                   +0.107 | count of contributing AGAINST-side wallets                     |
| provenFor         | 1063 |          +0.016 |           +0.217 |                   +0.006 |                   +0.093 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 1063 |          -0.007 |           +0.179 |                   +0.013 |                   +0.089 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 12.602         | 355 | 189-166 |   53.2% |     -0.0% |
| MID (p33–p67)     | 19.950 … 26.306        | 354 | 189-165 |   53.4% |     -0.3% |
| HIGH (> p67)      | 48.906 … 31.900        | 354 | 204-150 |   57.6% |     +1.6% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |      1063 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8120 | average score across live picks                                 |
| SD                |    0.2655 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.596 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +1.287 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.352 / +0.954 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.004 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |    9 | 3-6    |   33.3% |    -54.6% |  1.000 |        +0.917 | strong (N<20)                             |
| MLB   |  866 | 461-405 |   53.2% |     +4.0% |  0.523 |        -0.116 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   22 | 12-10  |   54.5% |     -2.9% |  0.583 |        -0.177 | strong                                    |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   54 | 36-18  |   66.7% |    +15.4% |  0.566 |        +0.057 | real                                      |
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
    x-axis ["09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16"]
    y-axis "AUC" 0.4 --> 0.7
    line [0.558, 0.538, 0.587, 0.659, 0.591, 0.588, 0.597, 0.613, 0.53, 0.494, 0.453, 0.435, 0.417, 0.431]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16"]
    y-axis "edge (pp)" -8 --> 22
    line [2.9, 12.4, 15.5, 20.9, 20.6, 13.5, 10.9, 2.8, 0, 1.5, 0.5, -1, -2, -6.4]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-09-16 |    7 |   83 | 38-45  |   45.8% |     -9.8% |  0.431 |      -6.4pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.529 avg in first half → 0.533 avg in second half · Δ = +0.004)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.9% | [-1.0%, +10.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.8% | [51.8%, 57.7%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.539 | [0.503, 0.575]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            102 | [39, 163]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1068 |
| Unique wallets ever on a FOR side            |                                                       314 |
| Avg FOR-side wallets per pick                |                                                      3.01 |
| Top-5 wallets' share of all FOR appearances  |                                                     20.6% |
| Top-10 wallets' share of all FOR appearances |                                                     34.3% |
| Top-20 wallets' share of all FOR appearances |                                                     49.9% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,SOC,WNBA |  196 |   91 | 101-95 |   51.5% |     +3.5% |    +16.63 |     1.48× | CONFIRMED   |     -5.7% |     752 | 2026-09-16 |
|    2 | 0cd77e  | MLB,SOC,UFC,WNBA |  157 |   26 | 86-71  |   54.8% |    +13.3% |    +58.24 |     1.59× | CONFIRMED   |     -5.1% |     399 | 2026-09-16 |
|    3 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  105 |   55 | 59-46  |   56.2% |    +16.1% |    +48.31 |     1.19× | CONFIRMED   |     +5.5% |     677 | 2026-09-14 |
|    4 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    5 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |  101 |   72 | 48-53  |   47.5% |     -2.4% |     -6.84 |     1.18× | CONFIRMED   |     -0.2% |     536 | 2026-09-16 |
|    6 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    7 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |   93 |   68 | 51-42  |   54.8% |    +11.3% |    +26.45 |     0.52× | CONFIRMED   |     +8.1% |     447 | 2026-09-16 |
|    8 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   84 |   32 | 44-40  |   52.4% |     -6.7% |    -15.05 |     1.99× | CONFIRMED   |     -9.6% |     301 | 2026-09-07 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   63 |   70 | 28-35  |   44.4% |    -11.0% |    -19.05 |     3.49× | CONFIRMED   |     -5.5% |     371 | 2026-09-16 |
|   12 | 7923c4  | MLB,NBA,UFC |   62 |   17 | 38-24  |   61.3% |    +28.2% |    +44.14 |     0.92× | CONFIRMED   |     +8.7% |     250 | 2026-09-15 |
|   13 | 705ba1  | MLB        |   59 |   44 | 28-31  |   47.5% |     -4.1% |     -6.65 |     1.12× | CONFIRMED   |     +2.7% |     310 | 2026-09-16 |
|   14 | bc35e3  | CFB,MLB,NFL,SOC,UFC,WNBA |   51 |   27 | 23-28  |   45.1% |     -3.8% |     -5.46 |     1.14× | CONFIRMED   |     -5.4% |     235 | 2026-09-15 |
|   15 | 69f882  | MLB,SOC,UFC,WNBA |   51 |   32 | 33-18  |   64.7% |    +14.8% |    +21.67 |     2.48× | CONFIRMED   |     +8.3% |     207 | 2026-09-16 |
|   16 | 9214c2  | MLB        |   51 |   10 | 22-29  |   43.1% |    -10.9% |    -15.57 |     1.09× | CONFIRMED   |     +3.7% |     167 | 2026-09-16 |
|   17 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   18 | 621848  | MLB,SOC,UFC,WNBA |   43 |   13 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +7.5% |     121 | 2026-09-15 |
|   19 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.8% |     148 | 2026-09-02 |
|   20 | 51176e  | MLB        |   37 |    3 | 22-15  |   59.5% |     +9.1% |    +12.52 |     0.99× | CONFIRMED   |     +6.4% |      65 | 2026-09-16 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    2 | d66e28  | MLB,WNBA   |   17 | 13-4   |   76.5% |     +57.1% |    +24.73 |     0.75× | 2026-09-07 |
|    3 | ba8492  | MLB,NFL    |   12 | 9-3    |   75.0% |     +56.8% |    +20.95 |     1.58× | 2026-09-16 |
|    4 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    5 | 199296  | MLB        |   10 | 7-3    |   70.0% |     +43.0% |    +16.71 |     2.76× | 2026-09-15 |
|    6 | 718cd6  | MLB,NFL,SOC,UFC |   10 | 7-3    |   70.0% |     +40.0% |     +9.61 |     1.29× | 2026-09-09 |
|    7 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    8 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    9 | 2dc4f6  | MLB,WNBA   |   12 | 7-5    |   58.3% |     +33.7% |     +9.56 |     0.68× | 2026-09-15 |
|   10 | 62941a  | MLB,NFL    |   17 | 11-6   |   64.7% |     +30.8% |    +16.12 |     0.92× | 2026-09-16 |
|   11 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   12 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   13 | 7923c4  | MLB,NBA,UFC |   62 | 38-24  |   61.3% |     +28.2% |    +44.14 |     0.92× | 2026-09-15 |
|   14 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   15 | 4c8ed9  | CFB,MLB,NFL,SOC,UFC,WNBA |   21 | 12-9   |   57.1% |     +23.5% |     +8.83 |     2.92× | 2026-09-16 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    3 | 2a8409  | MLB,NFL,WNBA |   25 | 8-17   |   32.0% |     -32.6% |    -19.06 |     1.55× | 2026-09-16 |
|    4 | 8e6753  | CFB,MLB,NFL |   18 | 7-11   |   38.9% |     -22.0% |     -8.59 |     0.92× | 2026-09-16 |
|    5 | 120215  | MLB,SOC    |   12 | 6-6    |   50.0% |     -15.2% |     -5.08 |     1.40× | 2026-09-16 |
|    6 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    7 | c9bba3  | CFB,MLB,NFL,SOC |   22 | 12-10  |   54.5% |     -14.7% |     -7.11 |     1.12× | 2026-09-16 |
|    8 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   63 | 28-35  |   44.4% |     -11.0% |    -19.05 |     3.49× | 2026-09-16 |
|    9 | 9214c2  | MLB        |   51 | 22-29  |   43.1% |     -10.9% |    -15.57 |     1.09× | 2026-09-16 |
|   10 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   11 | df8add  | MLB,SOC    |   20 | 10-10  |   50.0% |     -10.7% |     -4.97 |     1.54× | 2026-09-16 |
|   12 | 45fc26  | MLB,UFC,WNBA |   12 | 6-6    |   50.0% |     -10.4% |     -2.52 |     0.85× | 2026-09-16 |
|   13 | 2f2a9e  | MLB,SOC,WNBA |   84 | 44-40  |   52.4% |      -6.7% |    -15.05 |     1.99× | 2026-09-07 |
|   14 | e55973  | MLB,NFL,SOC |   13 | 6-7    |   46.2% |      -4.3% |     -1.66 |     0.69× | 2026-09-16 |
|   15 | 705ba1  | MLB        |   59 | 28-31  |   47.5% |      -4.1% |     -6.65 |     1.12× | 2026-09-16 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 63, ROI -11.0%), `9214c2` (FOR# 51, ROI -10.9%), `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 84, ROI -6.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  2749 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   762 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   118 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |    10 | 🟡 some picks missing tier classification |
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
| MLB   |            346 |        92 |   33 |   25 |  196 |                    150 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            345 |        95 |   49 |   20 |  181 |                    164 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  109 |   1068 | 1923 | 585-483 |  54.8% |      4.9% |    +145.52 |    +0.14 | 0.511 |        0.2499 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | + 1008 |    +1.4pp |    +13.8pp |          +0.309 |   -0.038 |    +0.0901 | 🟡 mixed |
| v12 − v10          | + 1006 |    +6.4pp |    +23.6pp |          +0.449 |   +0.117 |    +0.0305 | 🟢 better |
| v12 − v11          | +  957 |    -0.2pp |     +2.1pp |          +0.075 |   +0.067 |    +0.0143 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 9n 33.3% -55%  | 870n 53.2% +4% | 10n 30.0% +29% | 22n 54.5% -3%  | 6n 83.3% +38%  | 55n 67.3% +16% | 35n 77.1% +20% | 61n 57.4% -0%  | 1068n 54.8% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 199n +9%      | 272n +2%      | 223n +7%      | 143n -3%      | 226n +7%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~3273 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1302 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 1063 / 1302 (82%) | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 1063 / 1302 (82%) | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 1063 / 1302 (82%) | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 1063 / 1302 (82%) | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 1063 / 1302 (82%) | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 1063 / 1302 (82%) | Count of proven AGAINST-side wallets                                 |
| countMargin          | 1063 / 1302 (82%) | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1302 / 1302 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1302 / 1302 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1302 / 1302 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1302 / 1302 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1302 / 1302 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1302 / 1302 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1295 / 1302 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1293 / 1302 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1302 / 1302 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1301 / 1302 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 836 / 1302 (64%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1301 / 1302 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 836 / 1302 (64%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 835 / 1302 (64%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1302 / 1302 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1302 / 1302 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1302 / 1302 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1301 / 1302 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1302 / 1302 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd sizeMargin        | 835 |      |    -0.022 |    -0.020 |      -0.047 |      -0.062 |  0.491 |
|    2 | V12 forMean          | 1063 |  🟢  |    +0.076 |    +0.096 |      +0.044 |      +0.047 |  0.531 |
|    3 | qMargin              | 1063 |  🟢  |    +0.078 |    +0.025 |      +0.041 |      +0.009 |  0.525 |
|    4 | wd agAvgSize         | 836 |      |    +0.019 |    +0.018 |      +0.039 |      +0.040 |  0.507 |
|    5 | wd maxForContrib     | 1301 |      |    -0.041 |    -0.081 |      -0.037 |      -0.042 |  0.488 |
|    6 | wd contribMargin     | 1302 |      |    -0.007 |    -0.083 |      -0.035 |      -0.080 |  0.482 |
|    7 | wd agCount           | 836 |      |    +0.009 |    +0.264 |      +0.035 |      +0.133 |  0.509 |
|    8 | wd contribFor        | 1302 |      |    -0.017 |    -0.023 |      -0.027 |      -0.033 |  0.481 |
|    9 | lockPinnProb         | 1295 |      |    +0.192 |    +0.159 |      +0.026 |      -0.127 |  0.598 |
|   10 | clv                  | 1293 |      |    -0.025 |    +0.077 |      -0.025 |      +0.024 |  0.517 |
|   11 | hcMargin             | 1302 |      |    +0.004 |    +0.206 |      -0.025 |      +0.054 |  0.511 |
|   12 | wd maxShare          | 1302 |      |    +0.027 |    -0.079 |      +0.021 |      -0.023 |  0.514 |
|   13 | ags (v11)            | 1302 |      |    +0.007 |    +0.056 |      -0.017 |      -0.017 |  0.515 |
|   14 | V12 agMean           | 1063 |  🟢  |    +0.003 |    +0.327 |      +0.017 |      +0.128 |  0.469 |
|   15 | wd forCount          | 1301 |      |    -0.000 |    +0.162 |      -0.016 |      +0.028 |  0.489 |
|   16 | provenMargin         | 1302 |      |    +0.006 |    +0.096 |      -0.016 |      +0.008 |  0.501 |
|   17 | provenFor            | 1302 |      |    -0.008 |    +0.121 |      -0.014 |      +0.024 |  0.493 |
|   18 | wd forAvgSize        | 1301 |      |    +0.004 |    +0.057 |      -0.013 |      +0.002 |  0.516 |
|   19 | agsV12               | 1063 |  🟢  |    +0.030 |    -0.057 |      +0.013 |      -0.023 |  0.539 |
|   20 | peakStars            | 1302 |      |    +0.032 |    +0.030 |      +0.011 |      -0.017 |  0.517 |
|   21 | provenTotal          | 1302 |      |    -0.014 |    +0.091 |      -0.010 |      +0.030 |  0.490 |
|   22 | countMargin          | 1063 |      |    +0.032 |    +0.121 |      -0.010 |      -0.001 |  0.504 |
|   23 | V12 forCount         | 1063 |  🟢  |    +0.014 |    +0.220 |      -0.007 |      +0.063 |  0.503 |
|   24 | wd contribAg         | 1302 |      |    -0.015 |    +0.132 |      +0.007 |      +0.062 |  0.487 |
|   25 | V12 agCount          | 1063 |  🟢  |    -0.026 |    +0.188 |      +0.003 |      +0.107 |  0.493 |
|   26 | provenAg             | 1302 |      |    -0.018 |    +0.184 |      -0.001 |      +0.083 |  0.485 |

> **Top 3 univariate features by PnL correlation:** `wd sizeMargin` (r = -0.047), `V12 forMean` (r = +0.044), `qMargin` (r = +0.041).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd sizeMargin` · r(unit-ret) = -0.047 · AUC = 0.491

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.451          | 279 | 156-123 |   55.9% |     +2.2% |
| MID (p33–p67)     | 0.078 … 0.056            | 278 | 144-134 |   51.8% |     -0.0% |
| HIGH (> p67)      | 3.728 … 0.851            | 278 | 149-129 |   53.6% |     -2.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.044 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 12.602           | 355 | 189-166 |   53.2% |     -0.0% |
| MID (p33–p67)     | 19.950 … 26.306          | 354 | 189-165 |   53.4% |     -0.3% |
| HIGH (> p67)      | 48.906 … 31.900          | 354 | 204-150 |   57.6% |     +1.6% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.041 · AUC = 0.525

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.818           | 355 | 194-161 |   54.6% |     +1.1% |
| MID (p33–p67)     | 19.950 … 16.769          | 354 | 186-168 |   52.5% |     -0.7% |
| HIGH (> p67)      | 46.556 … 29.150          | 354 | 202-152 |   57.1% |     +1.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd agAvgSize` · r(unit-ret) = +0.039 · AUC = 0.507

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.110 … 0.391            | 281 | 147-134 |   52.3% |     -2.3% |
| MID (p33–p67)     | 0.699 … 0.755            | 276 | 149-127 |   54.0% |     +0.1% |
| HIGH (> p67)      | 6.557 … 1.377            | 279 | 153-126 |   54.8% |     +2.1% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd maxForContrib` · r(unit-ret) = -0.037 · AUC = 0.488

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 36.300          | 434 | 244-190 |   56.2% |     +1.8% |
| MID (p33–p67)     | 52.400 … 54.800          | 433 | 233-200 |   53.8% |     -0.3% |
| HIGH (> p67)      | 100.000 … 74.800         | 434 | 232-202 |   53.5% |     -0.4% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd sizeMargin  | V12 forMean    | qMargin        | wd agAvgSize   | wd maxForContrib | wd contribMargin | wd agCount     | wd contribFor  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd sizeMargin |  1.000         |         +0.179 |         +0.170 |         -0.679 |         +0.229 |         +0.236 |         +0.041 |         +0.203 |
| V12 forMean |         +0.179 |  1.000         |         +0.938 |         -0.034 |         +0.183 |         +0.058 |         +0.140 |         +0.141 |
| qMargin     |         +0.170 |         +0.938 |  1.000         |         -0.054 |         +0.137 |         +0.047 |         +0.003 |         +0.057 |
| wd agAvgSize |         -0.679 |         -0.034 |         -0.054 |  1.000         |         +0.058 |         -0.141 |         +0.093 |         +0.004 |
| wd maxForContrib |         +0.229 |         +0.183 |         +0.137 |         +0.058 |  1.000         |         +0.503 |         +0.268 |         +0.644 |
| wd contribMargin |         +0.236 |         +0.058 |         +0.047 |         -0.141 |         +0.503 |  1.000         |         -0.146 |         +0.770 |
| wd agCount  |         +0.041 |         +0.140 |         +0.003 |         +0.093 |         +0.268 |         -0.146 |  1.000         |         +0.451 |
| wd contribFor |         +0.203 |         +0.141 |         +0.057 |         +0.004 |         +0.644 |         +0.770 |         +0.451 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.938. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 718 picks · features = 8 (+ intercept) · multiple R² = **0.0105** · adjusted R² = **-0.0021** · residual sd = 0.956

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.1569 |   0.1325 | -1.18        |        1 |
|    2 | wd agCount           |     |    +0.1117 |   0.0839 | +1.33        |        2 |
|    3 | wd contribMargin     |     |    +0.0994 |   0.1171 | +0.85        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.0465 |   0.1126 | +0.41        |        4 |
|    5 | wd agAvgSize         |     |    +0.0410 |   0.0528 | +0.78        |        5 |
|    6 | wd sizeMargin        |     |    -0.0270 |   0.0531 | -0.51        |        6 |
|    7 | wd maxForContrib     |     |    +0.0107 |   0.0486 | +0.22        |        7 |
|    8 | qMargin              |  🟢 |    +0.0081 |   0.1113 | +0.07        |        8 |
| —    | (intercept)          |     |    +0.0122 |   0.0357 |    +0.34 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.047), `qMargin` (β = +0.008)
- V12 IGNORES: `wd contribFor` (β = -0.157, t = -1.18), `wd agCount` (β = +0.112, t = +1.33), `wd contribMargin` (β = +0.099, t = +0.85), `wd agAvgSize` (β = +0.041, t = +0.78), `wd sizeMargin` (β = -0.027, t = -0.51), `wd maxForContrib` (β = +0.011, t = +0.22)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.537 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.544 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `qMargin`. They may be contributing noise rather than information.
- Adjusted R² of -0.0021 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*