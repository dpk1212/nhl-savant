# AGS-Unified — V12 Daily Monitor

**Generated:** Friday, August 28, 2026 at 6:33 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (89 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (89 days ago), V12 has evaluated **2681** picks, shipped **870** for real money (32.5% ship rate), and muted the other **1811**. On the shipped picks V12 has gone **477-393** (54.8% win), staked **2367.80u**, and returned **+123.02u** at **+5.2% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             89 |
| Picks V12 has evaluated             |                           2681 |
| Picks SHIPPED (units > 0)           |                            870 |
| Picks MUTED (score ≤ 0, FADE)       |                           1811 |
| Ship rate                           |                          32.5% |
| Live W-L                            |                        477-393 |
| Live Win %                          |                          54.8% |
| Live PnL (units)                    |                        +123.02 |
| Live ROI                            |                          +5.2% |
| Avg PnL / day                       |                         +1.38u |
| Most recent action (2026-08-28)  |            3 live, 1-2, -1.37u |

### What's working

- V12 is profitable at **5.2% ROI** across 870 live picks (+123.02u real PnL).
- Mute rule is **saving money** — the 1192 muted picks would have lost -68.45u at flat 1u (-5.7% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.38u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **241-200** · +6.4% ROI · +76.41u on 441 graded — see § 5.

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

**Full book:** 89d · 870 live · 477-393 · **+123.02u** · +5.2% ROI · +1.38u/day.

_Prior to table (2026-06-01 → 2026-08-07): 605 live · 336-269 · +79.75u · cum through prior = +79.75u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-08-08 |        29 |    6 |    18 | 4-2        |  66.7% |     22.70 |      +3.65 |     16.1% |     +83.40 |
| 2026-08-09 |        15 |    6 |     6 | 2-4        |  33.3% |     10.00 |      -5.78 |    -57.8% |     +77.62 |
| 2026-08-10 |        17 |    6 |     8 | 2-4        |  33.3% |     14.00 |      -3.58 |    -25.6% |     +74.04 |
| 2026-08-11 |        14 |    1 |    12 | 0-1        |   0.0% |      1.00 |      -1.00 |   -100.0% |     +73.04 |
| 2026-08-12 |        24 |    6 |    16 | 2-4        |  33.3% |     10.00 |      -5.58 |    -55.8% |     +67.46 |
| 2026-08-13 |        27 |   15 |     6 | 10-5       |  66.7% |     38.20 |     +14.06 |     36.8% |     +81.52 |
| 2026-08-14 |        19 |   10 |     8 | 6-4        |  60.0% |     19.90 |      +8.04 |     40.4% |     +89.56 |
| 2026-08-15 |        49 |   25 |    18 | 13-12      |  52.0% |     56.50 |      -1.79 |     -3.2% |     +87.77 |
| 2026-08-16 |        38 |   14 |    14 | 7-7        |  50.0% |     29.80 |      +0.93 |      3.1% |     +88.70 |
| 2026-08-17 |        26 |   13 |     6 | 6-7        |  46.2% |     34.80 |      +8.82 |     25.3% |     +97.52 |
| 2026-08-18 |        51 |   24 |    12 | 13-11      |  54.2% |     45.90 |      +3.07 |      6.7% |    +100.59 |
| 2026-08-19 |        41 |   13 |    18 | 6-7        |  46.2% |     18.50 |      +1.20 |      6.5% |    +101.79 |
| 2026-08-20 |        35 |   12 |    17 | 4-8        |  33.3% |     37.60 |      -5.27 |    -14.0% |     +96.52 |
| 2026-08-21 |        47 |   18 |    23 | 10-8       |  55.6% |     42.20 |      -5.56 |    -13.2% |     +90.96 |
| 2026-08-22 |        69 |   20 |    36 | 12-8       |  60.0% |     58.80 |      +7.20 |     12.2% |     +98.16 |
| 2026-08-23 |        58 |   21 |    23 | 12-9       |  57.1% |     36.40 |     +12.00 |     33.0% |    +110.16 |
| 2026-08-24 |        45 |   12 |    22 | 7-5        |  58.3% |     28.40 |      -2.12 |     -7.5% |    +108.04 |
| 2026-08-25 |        56 |   15 |    30 | 7-8        |  46.7% |     51.60 |      -7.95 |    -15.4% |    +100.09 |
| 2026-08-26 |        46 |   16 |    19 | 10-6       |  62.5% |     36.40 |     +12.91 |     35.5% |    +113.00 |
| 2026-08-27 |        26 |    9 |    12 | 7-2        |  77.8% |     29.40 |     +11.39 |     38.7% |    +124.39 |
| 2026-08-28 |        58 |    3 |     2 | 1-2        |  33.3% |      3.00 |      -1.37 |    -45.7% |    +123.02 |

> **Trajectory.** 🟢 Last 3 days (33.3% ROI) **+29.0pp** vs prior (4.4%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-28**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 18 | 14-4 | +46.2% | +35.36u | +1.96u | +49.9% |
| 🟢 2 | RANK 2-for-0 rescue | B | 95 | 55-40 | +14.0% | +48.56u | +0.51u | +20.3% |
| 🟢 3 | MINI- (gate-cut) | C | 20 | 12-8 | +11.8% | +3.12u | +0.16u | +85.0% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 105 | 67-38 | +14.7% | +71.92u | sized UP after path |
| 2 | Tape HOLD (mid) | 293 | 154-139 | +3.1% | +19.46u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 6 | 3-3 | -2.6% | -0.15u | 🟡 flat |
| 2 | Score FADE (≤0 → 0u) | 676 | 338-338 | -0.7% | -4.95u | 🟡 flat |
| 3 | Tape MUTE (tape<0 → 0u) | 78 | 41-37 | +2.6% | +1.99u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 18 | 14-4 | 77.8% | 76.5u | +35.36u | +46.2% | +1.96u | 5 | +49.9% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 104 | 61-43 | 58.7% | 378.9u | +16.90u | +4.5% | +0.16u | 12 | -6.1% | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 95 | 55-40 | 57.9% | 347.0u | +48.56u | +14.0% | +0.51u | 14 | +20.3% | — | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 75 | 36-39 | 48.0% | 251.2u | -12.93u | -5.1% | -0.17u | 10 | +5.8% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 97 | 52-45 | 53.6% | 267.0u | +10.57u | +4.0% | +0.11u | 13 | -0.9% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 88 | 51-37 | 58.0% | 227.2u | +12.54u | +5.5% | +0.14u | 15 | +8.8% | -1.00u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 1 | +85.0% | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 23 | 12-11 | 52.2% | 23.4u | +0.89u | +3.8% | +0.04u | 1 | -100.0% | — | 🟡 flat |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 105 | 67-38 | 63.8% | 488.5u | +71.92u | +14.7% | 24 | +10.5% | — |
| Tape HOLD (mid) | TAPE | staked | 293 | 154-139 | 52.6% | 626.1u | +19.46u | +3.1% | 80 | +9.9% | -1.37u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 0 | — | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 78 | 41-37 | 52.6% | 78.0u | +1.99u | +2.6% | 25 | -3.2% | — |
| fadeTop≥60 MUTE | E | CF 1u | 6 | 3-3 | 50.0% | 6.0u | -0.15u | -2.6% | 0 | — | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 676 | 338-338 | 50.0% | 676.0u | -4.95u | -0.7% | 77 | +18.7% | — |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 5 / +50% | — | — |
| TOP | 38 / -2% | 22 / +3% | 4 / -16% |
| RANK | 48 / +8% | 8 / +43% | — |
| SHARP | 15 / -9% | 34 / +1% | 1 / -100% |
| SHARP-LEAN | 71 / +0% | 23 / +11% | 3 / -30% |
| MINI | 38 / +7% | 9 / +38% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 14 / +10% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-28)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| MINI (gate-pass) | 1 | 0-1 | -1.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  19 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 178 | 76-57  |  57.1% |      511.40 |      +4.96 |      1.0% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 488 | 149-132 |  53.0% |      914.15 |     +39.59 |      4.3% |
| STRONG (MINI)             |    3u | 105 | 51-37  |  58.0% |      227.15 |     +12.54 |      5.5% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  88 | 26-22  |  54.2% |       54.85 |      +1.99 |      3.6% |
| **STAKED TOTAL** |     — | 568 | 316-252 |  55.6% |     1784.05 |     +94.44 |     +5.3% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  19 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 149 | 61-43  |  58.7% |      378.90 |     +16.90 |      4.5% |
| B · 2-for-0 rescue    | RANK        |    4u | 136 | 55-40  |  57.9% |      346.95 |     +48.56 |     14.0% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 238 | 52-45  |  53.6% |      267.04 |     +10.57 |      4.0% |
| C · proven-$ consensus | SHARP       |    3u | 100 | 36-39  |  48.0% |      251.16 |     -12.93 |     -5.1% |
| A · mini-HC (gate-pass) | MINI        |    3u | 105 | 51-37  |  58.0% |      227.15 |     +12.54 |      5.5% |
| C · mini gate-cut     | MINI-       |    1u |  25 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  57 | 12-11  |  52.2% |       23.35 |      +0.89 |      3.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 570 picks tracked at 0u (would-be 278-292, 48.8% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (14-5, +35.36u)  ·  🟢 TOP PICK (98-80, +4.96u)  ·  🟠 SHARP PLAY (245-243, +39.59u)  ·  🔴 STRONG (63-42, +12.54u)  ·  🟣 LEAN (47-41, +1.99u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28"]
    y-axis "PnL (u)" -14 --> 44
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 4.96]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 39.59]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 12.54]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 74]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 55]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 60]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 53]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1369 | 1361 | 1299 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 78 | 41-37 | 52.6% | 12.00u | -1.08u | -9.0% |
| HOLD      | 403 | 197-206 | 48.9% | 629.07u | +16.46u | +2.6% |
| BOOST     | 135 | 82-53 | 60.7% | 491.98u | +74.00u | +15.0% |
| FAIL_OPEN | 37 | 20-17 | 54.1% | 54.50u | -15.17u | -27.8% |
| PASS      | 646 | 334-312 | 51.7% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 415 | 220-195 | 53.0% | +1.17u |
| hold (0–2.89) | path u | 577 | 282-295 | 48.9% | +18.59u |
| boost (≥2.89) | ×1.35 | 155 | 91-64 | 58.7% | +68.35u |

_Score coverage: **1147/1299** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 78 | +11.97u | -11.97u | +41.75u | +53.72u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 107 | +51.78u | +74.00u | +22.22u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-28 | MLB | San Diego Padres | MINI | -0.64 | MUTE | 1.00u | 0.00u | — |
| 2026-08-28 | MLB | Toronto Blue Jays | SHARP~ | 3.58 | BOOST | 1.00u | 0.00u | — |
| 2026-08-28 | NFL | Buccaneers | SHARP~ | -1.91 | MUTE | 4.00u | 0.00u | — |
| 2026-08-28 | NFL | Commanders | CONFIRMED-UNOPP | -1.65 | MUTE | 1.00u | 1.00u | — |
| 2026-08-28 | WNBA | Atlanta Dream | SHARP~ | 3.20 | BOOST | 4.00u | 5.40u | — |
| 2026-08-28 | WNBA | Atlanta Dream | HC-1 | 3.21 | BOOST | 1.00u | 0.00u | — |
| 2026-08-28 | WNBA | Los Angeles Sparks | HC-1 | -1.01 | MUTE | 4.00u | 0.00u | — |
| 2026-08-28 | NFL | Under 36.5 | SHARP~ | -7.59 | MUTE | 1.00u | 0.00u | — |
| 2026-08-28 | NFL | Over 33.5 | SHARP~ | 3.47 | BOOST | 4.00u | 0.00u | — |
| 2026-08-27 | MLB | San Francisco Giants | PATH-D | -1.54 | MUTE | 1.00u | 0.00u | WIN |
| 2026-08-27 | MLB | Washington Nationals | CONFIRMED-Q1 | 3.09 | BOOST | 3.00u | 5.00u | WIN |
| 2026-08-27 | MLB | New York Yankees | CONFIRMED-UNOPP | -0.15 | MUTE | 1.00u | 1.00u | LOSS |
| 2026-08-27 | MLB | Milwaukee Brewers | CONFIRMED-UNOPP | -0.65 | MUTE | 1.00u | 1.00u | WIN |
| 2026-08-27 | SOC | FC Barcelona | HC-1 | 5.26 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-27 | WNBA | Phoenix Mercury | HC-1 | 3.62 | BOOST | 3.00u | 0.00u | LOSS |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.31** · nPriors=545 · source=expanding_q1 · asOf=2026-08-28 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 923 | 844 | 789 | 163 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 67 | 25-42 | 37.3% | 10.00u | -4.22u | -42.2% |
| HOLD      | 192 | 104-88 | 54.2% | 222.10u | +28.95u | +13.0% |
| FAIL_OPEN | 25 | 12-13 | 48.0% | 41.90u | -2.08u | -5.0% |
| EXEMPT    | 286 | 144-142 | 50.3% | 396.40u | +24.16u | +6.1% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -48.5 … -1.4 | 29 | 7-22 | 24.1% | 0.0u | +0.00u | — |
| Q2 | -1.3 … 1.3 | 29 | 15-14 | 51.7% | 29.9u | +21.63u | +72.3% |
| Q3 | 1.5 … 6.5 | 30 | 13-17 | 43.3% | 40.1u | -6.28u | -15.7% |
| Q4 | 6.5 … 16.4 | 29 | 16-13 | 55.2% | 56.3u | -2.60u | -4.6% |
| Q5 | 16.8 … 1802.6 | 30 | 17-13 | 56.7% | 57.3u | +12.20u | +21.3% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 67 | 25-42 | -19.11u | +19.11u | +46.50u | +27.39u |

> 🟢 **Mute is saving money** (Δ +19.11u · muted WR 37.3%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 25 | 6-19 | 24.0% | 27.5u | -13.96u |
| MLB | 43 | 15-28 | 34.9% | 48.5u | -13.90u |
| NFL | 2 | 1-1 | 50.0% | 2.0u | -0.04u |
| SOC | 1 | 0-1 | 0.0% | 1.0u | -1.00u |
| WNBA | 21 | 9-12 | 42.9% | 23.0u | -4.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-28 | MLB | San Francisco Giants | SHARP~ | -1.3 | -1.3 | 1.00u | pending |
| 2026-08-28 | MLB | Pittsburgh Pirates | SHARP~ | -1.7 | -1.3 | 1.00u | pending |
| 2026-08-28 | MLB | Toronto Blue Jays | SHARP~ | -18.5 | -1.3 | 1.00u | pending |
| 2026-08-28 | MLB | Texas Rangers | SHARP~ | -30.3 | -1.3 | 1.00u | pending |
| 2026-08-28 | MLB | Cincinnati Reds | SHARP~ | -2.7 | -1.3 | 1.00u | WIN |
| 2026-08-28 | NFL | Jaguars | — | -4.2 | -1.3 | 1.00u | pending |
| 2026-08-27 | WNBA | Golden State Valkyries | — | -97.4 | -1.3 | 1.00u | WIN |
| 2026-08-27 | NFL | Bills | SHARP~ | -1.5 | -1.3 | 1.00u | LOSS |
| 2026-08-27 | WNBA | Golden State Valkyries | — | -6.0 | -1.3 | 1.00u | WIN |
| 2026-08-27 | MLB | Over 9.5 | SHARP | -6.5 | -1.3 | 1.00u | LOSS |
| 2026-08-27 | MLB | Over 7.5 | — | -47.5 | -1.3 | 1.00u | LOSS |
| 2026-08-27 | NFL | Over 35.5 | PASS | -2.4 | -1.3 | 1.00u | WIN |
| 2026-08-26 | MLB | Chicago Cubs | SHARP~ | -10.9 | -1.0 | 1.00u | LOSS |
| 2026-08-26 | WNBA | Toronto Tempo | SHARP~ | -1.1 | -1.0 | 1.00u | LOSS |
| 2026-08-26 | MLB | Under 8.5 | CONFIRMED-UNOPP | -1.3 | -1.0 | 1.00u | LOSS |
| 2026-08-26 | MLB | Under 8.5 | CONFIRMED-UNOPP | -14.1 | -1.0 | 1.00u | WIN |
| 2026-08-26 | WNBA | Under 150.5 | — | -29.5 | -1.0 | 1.00u | WIN |
| 2026-08-26 | WNBA | Over 177.5 | — | -1.8 | -1.0 | 1.00u | LOSS |
| 2026-08-25 | MLB | Over 8.5 | SHARP~ | -2.2 | -1.0 | 1.00u | LOSS |
| 2026-08-25 | MLB | Under 8.5 | SHARP~ | -1.3 | -1.0 | 1.00u | WIN |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 63 | 35-28 | 55.6% | 183.6u | +24.95u | +13.6% |
| Muted (Q1 → 0u) | 67 | 25-42 | 37.3% | 10.0u | -4.22u | -42.2% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 132–73 · 64.4% · +17.3%); **5–10 is the hole** (66–62 · 51.6% · -4.1%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 652 tickets · cov 625/652 (stamp 423 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 292 | 149–143 | 51.0% | -3.4% |
| 5–10 | 128 | 66–62 | 51.6% | -4.1% |
| ≥10 | 205 | 132–73 | 64.4% | +17.3% |
| All | 652 | 359–293 | 55.1% | +5.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (107) | 57.1% (63) | 70.6% (85) |
| B | 54.5% (66) | 55.6% (9) | 70% (20) |
| C | 40.5% (37) | 46.9% (49) | 57% (93) |

##### Jul 15+ · 441 tickets · cov 420/441 (stamp 418 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 186 | 96–90 | 51.6% | +1.1% |
| 5–10 | 89 | 43–46 | 48.3% | -9.5% |
| ≥10 | 145 | 93–52 | 64.1% | +15.1% |
| All | 441 | 241–200 | 54.6% | +6.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 47.9% (48) | 55.9% (34) | 72.7% (44) |
| B | 55% (40) | 25% (4) | 69.2% (13) |
| C | 43.8% (16) | 47.7% (44) | 57.8% (83) |

##### Yesterday (Aug 27) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 5 | 3–2 | 60.0% | +5.0% |
| ≥10 | 4 | 4–0 | 100.0% | +58.9% |
| All | 9 | 7–2 | 77.8% | +38.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | 100% (1) | — | — |
| C | — | — | 100% (2) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 652 tickets · cov 646/652 (stamp 435 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 418 | 230–188 | 55.0% | +3.5% |
| 5–10 | 117 | 64–53 | 54.7% | +13.2% |
| ≥10 | 111 | 63–48 | 56.8% | +5.9% |
| All | 652 | 359–293 | 55.1% | +5.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.7% (163) | 51% (49) | 70.6% (51) |
| B | 59.4% (69) | 50% (14) | 58.3% (12) |
| C | 50% (108) | 64.1% (39) | 38.5% (39) |

##### Jul 15+ · 441 tickets · cov 436/441 (stamp 435 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 268 | 152–116 | 56.7% | +8.8% |
| 5–10 | 94 | 51–43 | 54.3% | +14.8% |
| ≥10 | 74 | 36–38 | 48.6% | -8.9% |
| All | 441 | 241–200 | 54.6% | +6.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 63.8% (69) | 48.5% (33) | 60% (30) |
| B | 56.1% (41) | 50% (10) | 66.7% (6) |
| C | 54.3% (81) | 63.9% (36) | 33.3% (30) |

##### Yesterday (Aug 27) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 8 | 6–2 | 75.0% | +33.2% |
| 5–10 | 1 | 1–0 | 100.0% | +87.7% |
| All | 9 | 7–2 | 77.8% | +38.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (1) | — | — |
| B | 100% (1) | — | — |
| C | 100% (2) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 652 tickets · cov 625/652 (stamp 417 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 115 | 54–61 | 47.0% | -20.2% |
| 0–2.89 | 356 | 191–165 | 53.7% | +6.8% |
| ≥2.89 | 154 | 102–52 | 66.2% | +18.2% |
| All | 652 | 359–293 | 55.1% | +5.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 58.2% (146) | 74.2% (66) |
| B | 61.5% (26) | 53.7% (54) | 66.7% (15) |
| C | 18.2% (11) | 51.4% (105) | 55.6% (63) |

##### Jul 15+ · 441 tickets · cov 420/441 (stamp 417 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 46 | 26–20 | 56.5% | +1.5% |
| 0–2.89 | 265 | 137–128 | 51.7% | +2.8% |
| ≥2.89 | 109 | 69–40 | 63.3% | +13.9% |
| All | 441 | 241–200 | 54.6% | +6.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.9% (89) | 72.2% (36) |
| B | 60% (10) | 53.8% (39) | 62.5% (8) |
| C | — | 52.3% (86) | 54.4% (57) |

##### Yesterday (Aug 27) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 4 | 2–2 | 50.0% | -26.0% |
| 0–2.89 | 3 | 3–0 | 100.0% | +78.0% |
| ≥2.89 | 2 | 2–0 | 100.0% | +47.0% |
| All | 9 | 7–2 | 77.8% | +38.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | 100% (1) | — | — |
| C | — | 100% (2) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 441 | 241-200 | 54.6% | 1191.55u | +76.41u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 441/441 | 2.54 | 2.28 | +0.26 | 2.00 | 2.00 |
| depth   | #A sharps        | 441/441 | 1.36 | 1.34 | +0.02 | 1.00 | 1.00 |
| depth   | #F − #A          | 441/441 | 1.18 | 0.94 | +0.24 | 1.00 | 1.00 |
| depth   | proven F         | 441/441 | 1.73 | 1.64 | +0.10 | 1.00 | 1.00 |
| depth   | proven A         | 441/441 | 0.52 | 0.49 | +0.02 | 0.00 | 0.00 |
| depth   | proven F−A       | 441/441 | 1.21 | 1.14 | +0.07 | 1.00 | 1.00 |
| depth   | v12 F count      | 441/441 | 2.57 | 2.35 | +0.22 | 2.00 | 2.00 |
| depth   | v12 A count      | 441/441 | 1.49 | 1.47 | +0.02 | 1.00 | 1.00 |
| depth   | WA ForN          | 441/441 | 1.96 | 1.88 | +0.08 | 1.00 | 2.00 |
| depth   | WA AgN           | 441/441 | 1.13 | 1.19 | -0.06 | 1.00 | 1.00 |
| depth   | CLV ForN         | 440/441 | 2.42 | 2.20 | +0.22 | 2.00 | 2.00 |
| depth   | CLV AgN          | 440/441 | 1.40 | 1.41 | -0.01 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 441/441 | 0.37 | 0.36 | +0.01 | 0.00 | 0.00 |
| quality | ForWR            | 418/441 | 56.37 | 54.62 | +1.75 | 54.10 | 53.26 |
| quality | AgWR             | 268/441 | 44.61 | 45.51 | -0.91 | 45.50 | 46.70 |
| quality | TopFor WR        | 418/441 | 59.92 | 58.37 | +1.55 | 55.90 | 55.60 |
| quality | TopAg WR         | 268/441 | 47.65 | 48.50 | -0.85 | 48.94 | 49.12 |
| quality | EDGE             | 418/441 | 9.67 | 7.36 | +2.31 | 7.51 | 5.17 |
| quality | ForCLV           | 435/441 | 66.16 | 65.88 | +0.27 | 65.63 | 65.97 |
| quality | AgCLV            | 294/441 | 62.88 | 61.75 | +1.13 | 63.52 | 63.48 |
| quality | netCLV           | 435/441 | 3.56 | 4.05 | -0.49 | 3.40 | 3.47 |
| quality | Tape             | 417/441 | 2.47 | 2.08 | +0.39 | 1.75 | 1.46 |
| quality | V12 score        | 441/441 | 0.84 | 0.83 | +0.02 | 0.96 | 0.95 |
| quality | V12 forMean      | 441/441 | 26.99 | 21.93 | +5.06 | 18.29 | 15.47 |
| quality | V12 agMean       | 441/441 | 2.04 | 1.90 | +0.15 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 418/441 | 0.558 | -0.032 | +0.108 | +2.31 | 🟡 mild OK |
|    2 | V12 forMean      | quality | 441/441 | 0.552 | +0.153 | +0.095 | +5.06 | 🟡 mild OK |
|    3 | Tape             | quality | 417/441 | 0.543 | -0.048 | +0.067 | +0.39 | 🟡 mild OK |
|    4 | AgWR             | quality | 268/441 | 0.461 | +0.062 | -0.072 | -0.91 | flat |
|    5 | V12 score        | quality | 441/441 | 0.538 | +0.011 | +0.038 | +0.02 | flat |
|    6 | TopFor WR        | quality | 418/441 | 0.535 | +0.055 | +0.077 | +1.55 | flat |
|    7 | ForWR            | quality | 418/441 | 0.533 | -0.059 | +0.094 | +1.75 | flat |
|    8 | CLV ForN         | depth   | 440/441 | 0.530 | +0.291 | +0.068 | +0.22 | flat |
|    9 | #F sharps        | depth   | 441/441 | 0.530 | +0.289 | +0.073 | +0.26 | flat |
|   10 | AgCLV            | quality | 294/441 | 0.526 | -0.046 | +0.072 | +1.13 | flat |
|   11 | v12 F count      | depth   | 441/441 | 0.523 | +0.301 | +0.062 | +0.22 | flat |
|   12 | V12 agMean       | quality | 441/441 | 0.479 | +0.348 | +0.014 | +0.15 | flat |
|   13 | proven F−A       | depth   | 441/441 | 0.515 | +0.263 | +0.031 | +0.07 | flat |
|   14 | #A sharps        | depth   | 441/441 | 0.514 | +0.173 | +0.005 | +0.02 | flat |
|   15 | v12 A count      | depth   | 441/441 | 0.513 | +0.197 | +0.006 | +0.02 | flat |
|   16 | unopposed (A=0)  | depth   | 441/441 | 0.513 | +0.235 | +0.014 | +0.01 | flat |
|   17 | proven F         | depth   | 441/441 | 0.512 | +0.353 | +0.045 | +0.10 | flat |
|   18 | #F − #A          | depth   | 441/441 | 0.511 | +0.191 | +0.057 | +0.24 | flat |
|   19 | CLV AgN          | depth   | 440/441 | 0.510 | +0.190 | -0.003 | -0.01 | flat |
|   20 | netCLV           | quality | 435/441 | 0.491 | -0.032 | -0.022 | -0.49 | flat |
|   21 | proven A         | depth   | 441/441 | 0.506 | +0.321 | +0.015 | +0.02 | flat |
|   22 | WA AgN           | depth   | 441/441 | 0.495 | +0.194 | -0.021 | -0.06 | flat |
|   23 | TopAg WR         | quality | 268/441 | 0.498 | +0.048 | -0.055 | -0.85 | flat |
|   24 | ForCLV           | quality | 435/441 | 0.498 | -0.063 | +0.016 | +0.27 | flat |
|   25 | WA ForN          | depth   | 441/441 | 0.500 | +0.278 | +0.028 | +0.08 | flat |

### (C) Working read

_N=441 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.558 · Δ +2.31 · higher on WINs (cov 418/441)
- **V12 forMean** — AUC 0.552 · Δ +5.06 · higher on WINs (cov 441/441)
- **Tape** — AUC 0.543 · Δ +0.39 · higher on WINs (cov 417/441)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. See `docs/SKILL_FEATURES.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 940 | 145 | 145 | 136 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 21 | 11-10 | 52.4% | 54.20u | +1.39u | +2.6% | -0.7 |
| on→off | 7 | 3-4 | 42.9% | 19.80u | -5.69u | -28.7% | -3.4 |
| off→on | 19 | 13-6 | 68.4% | 45.80u | +17.97u | +39.2% | +2.1 |
| off→off | 89 | 47-42 | 52.8% | 218.00u | +4.98u | +2.3% | -0.7 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 82 | 40-42 | 48.8% | 244.60u | -4.57u | -1.9% |
| 0–2 | 36 | 23-13 | 63.9% | 67.20u | +25.87u | +38.5% |
| 2–4 | 7 | 5-2 | 71.4% | 12.00u | +0.70u | +5.8% |
| 4+ | 11 | 6-5 | 54.5% | 14.00u | -3.35u | -23.9% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 369n · 53.1% · +4.2%   | 90n · 54.4% · -1.3%    | 256n · 51.6% · +2.7%   | 715n · 52.7% · +3.0%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 7n · 57.1% · -2.8%     | 1n · 100.0% · +85.0%   | 2n · 50.0% · -5.4%     | 10n · 60.0% · -1.2%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 44n · 72.7% · +24.1%   | —                      | —                      | 44n · 72.7% · +24.1%   |
| UFC   | 30n · 73.3% · +13.2%   | —                      | —                      | 30n · 73.3% · +13.2%   |
| WNBA  | 22n · 77.3% · +14.4%   | 19n · 42.1% · +1.0%    | 14n · 50.0% · +4.3%    | 55n · 58.2% · +7.4%    |
| **All** | **479n · 57.0% · +7.5%** | **114n · 53.5% · +1.6%** | **277n · 51.6% · +3.0%** | **870n · 54.8% · +5.2%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1192** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1192 |
| Muted W-L                           |              584-608 |
| Muted Win %                         |                49.0% |
| Counterfactual PnL at flat 1u       |               -68.45 |
| Counterfactual ROI at flat 1u       |                -5.7% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-68.45u** at a flat 1u stake — a counterfactual ROI of **-5.7%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-28 | MLB   | ML     | Chicago Cubs            |  -177 | +0.950 | MINI     |   4/1 |   2/0 |  50.9 |   62.7 |   +2.3 |  0.38 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | SOC   | ML     | Manchester City FC      |  -160 | +0.948 | CONFIRMED-UNOPP |   4/0 |   4/0 |  40.6 |   42.1 |   -9.4 | -4.88 | HOLD     | 1.00u | WIN     |      +0.63 |
| 2026-08-28 | MLB   | TOTAL  | Under 8.5               |  -120 | +0.556 | CONFIRMED-UNOPP |   3/1 |   3/1 |  53.3 |   62.7 |   +3.9 |  0.32 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-27 | MLB   | ML     | Washington Nationals    |  -138 | +0.903 | CONFIRMED-Q1 |   6/4 |   6/2 |  60.7 |   66.1 |  +12.8 |  3.09 | BOOST    | 5.00u | WIN     |      +3.62 |
| 2026-08-27 | MLB   | ML     | New York Yankees        |  -150 | +0.966 | CONFIRMED-UNOPP |   3/1 |   2/0 |  48.8 |   63.1 |   +3.8 | -0.15 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-27 | MLB   | ML     | Atlanta Braves          |  -114 | +0.579 | CONFIRMED-Q1 |  12/3 |  12/3 |  53.2 |   61.8 |   +4.7 |  1.84 | HOLD     | 3.00u | WIN     |      +2.63 |
| 2026-08-27 | MLB   | ML     | Milwaukee Brewers       |  -205 | +0.986 | CONFIRMED-UNOPP |   7/3 |   5/2 |  49.3 |   61.3 |   +2.2 | -0.65 | MUTE     | 1.00u | WIN     |      +0.49 |
| 2026-08-27 | SOC   | ML     | FC Barcelona            |  -425 | +0.981 | HC-1     |   5/1 |   5/1 |  52.0 |   57.7 |  +33.8 |  5.26 | BOOST    | 5.40u | WIN     |      +1.27 |
| 2026-08-27 | WNBA  | ML     | Washington Mystics      |  -210 | +0.979 | 2-for-0  |   2/0 |   2/0 |  51.0 |   56.2 |   +3.9 | -1.47 | HOLD     | 3.00u | WIN     |      +1.43 |
| 2026-08-27 | MLB   | TOTAL  | Under 9.5               |  -178 | +0.979 | SHARP~   |   1/1 |   1/0 |  62.8 |   60.6 |  +12.8 |  2.35 | HOLD     | 4.00u | WIN     |      +2.25 |
| 2026-08-27 | MLB   | TOTAL  | Under 6.5               |  -108 | +0.044 | SHARP~   |   4/6 |   3/2 |  57.4 |   59.9 |  +11.8 |  1.09 | HOLD     | 4.00u | WIN     |      +3.70 |
| 2026-08-27 | WNBA  | TOTAL  | Over 166.5              |  -108 | +0.242 | CONFIRMED-Q1 |   2/3 |   2/3 |  54.6 |   65.0 |   +2.0 | -1.32 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-26 | MLB   | ML     | Boston Red Sox          |  -124 | +0.469 | SHARP~   |   2/3 |   2/2 |  52.2 |   55.4 |   +9.9 |  1.48 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-26 | MLB   | ML     | Cleveland Guardians     |  -134 | +0.134 | CONFIRMED-Q1 |   3/1 |   3/1 |  55.9 |   70.9 |   -6.6 |  3.08 | BOOST    | 4.00u | WIN     |      +2.99 |
| 2026-08-26 | MLB   | ML     | Atlanta Braves          |  +122 | +0.971 | MINI     |   6/4 |   2/0 |  48.9 |   65.3 |   -0.0 |  0.26 | HOLD     | 1.00u | WIN     |      +1.22 |
| 2026-08-26 | MLB   | ML     | Seattle Mariners        |  +122 | +0.884 | CONFIRMED-UNOPP |   2/3 |   1/1 |  46.7 |   63.4 |   -2.7 | -0.38 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-26 | MLB   | ML     | Chicago White Sox       |  -113 | +0.946 | 2-for-0  |   4/1 |   1/0 |  51.5 |   59.5 |   +2.6 | -0.09 | HOLD     | 3.00u | WIN     |      +2.65 |
| 2026-08-26 | SOC   | ML     | Real Madrid CF          |  -443 | +0.989 | CONFIRMED-Q1 |  12/3 |   4/0 |  49.4 |   55.0 |  +29.4 |  5.22 | BOOST    | 5.00u | WIN     |      +1.13 |
| 2026-08-26 | MLB   | SPREAD | Atlanta Braves          |  -133 | +0.986 | 2-for-0  |   3/1 |   2/1 |  50.7 |   66.8 |   +1.7 |  0.84 | HOLD     | 3.00u | WIN     |      +2.26 |
| 2026-08-26 | MLB   | SPREAD | Pittsburgh Pirates      |  -163 | +0.682 | MINI     |   1/1 |   1/1 |  61.6 |   57.1 |   +8.4 |  0.28 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-26 | WNBA  | SPREAD | Connecticut Sun         |  -104 | +0.957 | MINI     |   2/0 |   2/0 |  49.6 |   75.6 |   -0.4 |  1.95 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-26 | MLB   | TOTAL  | Under 8.5               |  -107 | +0.976 | 2-for-0  |   3/1 |   2/0 |  52.1 |   59.3 |   +3.2 |  0.01 | HOLD     | 3.00u | WIN     |      +2.80 |
| 2026-08-26 | MLB   | TOTAL  | Under 8.5               |  -102 | +0.972 | MINI     |   2/0 |   2/0 |  43.6 |   63.5 |   +3.2 |  0.68 | HOLD     | 1.00u | WIN     |      +0.98 |
| 2026-08-26 | MLB   | TOTAL  | Over 8.5                |  -100 | +0.616 | SHARP~   |   5/1 |   4/1 |  54.2 |   67.9 |   +1.8 |  2.38 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-26 | MLB   | TOTAL  | Under 8.5               |  +113 | +0.596 | CONFIRMED-UNOPP |   3/1 |   2/1 |  51.2 |   68.1 |   -1.2 |  1.81 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-26 | MLB   | TOTAL  | Under 7.5               |  +127 | +0.668 | CONFIRMED-UNOPP |   3/2 |   1/2 |  46.0 |   57.6 |   -6.5 | -1.08 | HOLD     | 1.00u | WIN     |      +1.27 |
| 2026-08-26 | MLB   | TOTAL  | Under 8.5               |  -101 | +0.551 | CONFIRMED-UNOPP |   6/2 |   5/1 |  53.7 |   67.2 |   +1.3 |  2.17 | HOLD     | 1.00u | WIN     |      +0.99 |
| 2026-08-26 | MLB   | TOTAL  | Under 8.5               |  +104 | +0.826 | SHARP    |   8/3 |   5/2 |  57.6 |   68.8 |  +12.7 |  3.69 | BOOST    | 5.40u | WIN     |      +5.62 |
| 2026-08-25 | MLB   | ML     | Boston Red Sox          |  -140 | +0.772 | SHARP    |   5/1 |   5/1 |  59.8 |   63.6 |  +15.4 |  4.51 | BOOST    | 5.40u | WIN     |      +3.86 |
| 2026-08-25 | MLB   | ML     | San Francisco Giants    |  -105 | +0.865 | 2-for-0  |   2/0 |   2/0 |  59.9 |   73.3 |  +27.7 |  8.64 | BOOST    | 6.00u | WIN     |      +5.71 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.530 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.063 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.006 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.009 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.030 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  865 |    +0.0502 |    -0.0274 | 0.0001 |  +0.012 |   0.950 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  865 |    +0.0645 |    +0.4931 | 0.0009 |  +0.030 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  865 |    -0.3557 |    +0.4417 | 0.0008 |  -0.029 |   2.837 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 865 |          +0.076 |           +0.034 |                   +0.043 |                   +0.010 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 865 |          -0.004 |           +0.311 |                   +0.009 |                   +0.115 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 865 |          +0.032 |           +0.198 |                   +0.010 |                   +0.051 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 865 |          -0.009 |           +0.181 |                   +0.019 |                   +0.105 | count of contributing AGAINST-side wallets                     |
| provenFor         | 865 |          +0.027 |           +0.177 |                   +0.016 |                   +0.074 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 865 |          +0.006 |           +0.129 |                   +0.022 |                   +0.066 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 9.205          | 289 | 156-133 |   54.0% |     +0.8% |
| MID (p33–p67)     | 19.950 … 16.587        | 288 | 153-135 |   53.1% |     -0.4% |
| HIGH (> p67)      | 48.906 … 44.487        | 288 | 165-123 |   57.3% |     +1.2% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       865 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8513 | average score across live picks                                 |
| SD                |    0.2295 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.047 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +3.198 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.467 / +0.960 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  711 | 375-336 |   52.7% |     +2.8% |  0.512 |        -0.061 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   10 | 6-4    |   60.0% |     -1.2% |  0.417 |        -0.515 | anti-signal (N<20)                        |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   43 | 31-12  |   72.1% |    +23.8% |  0.586 |        +0.076 | strong                                    |
| UFC   |   30 | 22-8   |   73.3% |    +13.2% |  0.619 |        +0.163 | strong                                    |
| WNBA  |   55 | 32-23  |   58.2% |     +7.4% |  0.535 |        -0.006 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.582, 0.546, 0.564, 0.545, 0.577, 0.543, 0.537, 0.521, 0.537, 0.536, 0.539, 0.515, 0.538, 0.569]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28"]
    y-axis "edge (pp)" -4 --> 4
    line [-3, -1.3, -0.2, 1.1, 1.6, -2.5, -2.5, -1.8, -1.2, -0.9, -2.3, -0.6, 3, 2.1]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-15 |    7 |   69 | 35-34  |   50.7% |     +2.9% |  0.582 |      -3.0pp |
| 2026-08-16 |    7 |   77 | 40-37  |   51.9% |     +6.5% |  0.546 |      -1.3pp |
| 2026-08-17 |    7 |   84 | 44-40  |   52.4% |    +12.3% |  0.564 |      -0.2pp |
| 2026-08-18 |    7 |  107 | 57-50  |   53.3% |    +11.7% |  0.545 |      +1.1pp |
| 2026-08-19 |    7 |  114 | 61-53  |   53.5% |    +14.1% |  0.577 |      +1.6pp |
| 2026-08-20 |    7 |  111 | 55-56  |   49.5% |     +6.2% |  0.543 |      -2.5pp |
| 2026-08-21 |    7 |  119 | 59-60  |   49.6% |     +0.5% |  0.537 |      -2.5pp |
| 2026-08-22 |    7 |  114 | 58-56  |   50.9% |     +3.9% |  0.521 |      -1.8pp |
| 2026-08-23 |    7 |  121 | 63-58  |   52.1% |     +7.8% |  0.537 |      -1.2pp |
| 2026-08-24 |    7 |  120 | 64-56  |   53.3% |     +3.9% |  0.536 |      -0.9pp |
| 2026-08-25 |    7 |  111 | 58-53  |   52.3% |     -0.2% |  0.539 |      -2.3pp |
| 2026-08-26 |    7 |  114 | 62-52  |   54.4% |     +3.8% |  0.515 |      -0.6pp |
| 2026-08-27 |    7 |  111 | 65-46  |   58.6% |     +9.8% |  0.538 |      +3.0pp |
| 2026-08-28 |    7 |   96 | 56-40  |   58.3% |    +13.1% |  0.569 |      +2.1pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.522 avg in first half → 0.529 avg in second half · Δ = +0.007)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.2% | [-1.5%, +11.9%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.8% | [51.6%, 58.2%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.530 | [0.495, 0.569]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             84 | [27, 141]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       870 |
| Unique wallets ever on a FOR side            |                                                       233 |
| Avg FOR-side wallets per pick                |                                                      2.76 |
| Top-5 wallets' share of all FOR appearances  |                                                     23.5% |
| Top-10 wallets' share of all FOR appearances |                                                     40.8% |
| Top-20 wallets' share of all FOR appearances |                                                     57.3% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  144 |   19 | 78-66  |   54.2% |    +12.1% |    +49.63 |     1.60× | CONFIRMED   |     -0.2% |     333 | 2026-08-27 |
|    2 | 4b912c  | MLB,NFL,SOC,WNBA |  133 |   41 | 72-61  |   54.1% |     +9.3% |    +28.86 |     1.54× | CONFIRMED   |     -6.8% |     353 | 2026-08-28 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    6 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   88 |   44 | 47-41  |   53.4% |    +13.0% |    +32.24 |     1.11× | CONFIRMED   |     +8.6% |     506 | 2026-08-28 |
|    7 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   87 |   54 | 41-46  |   47.1% |     -3.1% |     -7.59 |     1.28× | CONFIRMED   |     +2.8% |     377 | 2026-08-28 |
|    8 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   81 |   56 | 45-36  |   55.6% |    +13.7% |    +28.43 |     0.47× | CONFIRMED   |    +15.5% |     345 | 2026-08-26 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   81 |   32 | 44-37  |   54.3% |     -4.1% |     -9.05 |     2.04× | CONFIRMED   |     -7.2% |     287 | 2026-08-27 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   54 |   16 | 33-21  |   61.1% |    +28.3% |    +38.34 |     0.83× | CONFIRMED   |    +10.4% |     221 | 2026-08-27 |
|   12 | 705ba1  | MLB        |   46 |   24 | 21-25  |   45.7% |     -6.4% |     -8.26 |     1.12× | FLAT        |     +6.8% |     201 | 2026-08-28 |
|   13 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 |   59 | 21-24  |   46.7% |     -8.6% |    -10.89 |     4.37× | CONFIRMED   |     -6.4% |     265 | 2026-08-27 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   44 |   22 | 22-22  |   50.0% |     +4.8% |     +5.95 |     1.17× | CONFIRMED   |     -4.9% |     182 | 2026-08-27 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   43 |   11 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +9.0% |     108 | 2026-08-28 |
|   16 | 3bdd7e  | MLB,NFL,SOC,WNBA |   41 |   13 | 24-17  |   58.5% |    +10.4% |     +8.19 |     3.00× | CONFIRMED   |     -1.2% |     131 | 2026-08-26 |
|   17 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 |   23 | 20-16  |   55.6% |     +1.0% |     +1.12 |     1.35× | CONFIRMED   |    +14.2% |     145 | 2026-08-28 |
|   18 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   19 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   20 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | d66e28  | MLB,WNBA   |   11 | 8-3    |   72.7% |     +63.6% |    +20.24 |     0.74× | 2026-08-27 |
|    2 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    3 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    4 | 9a4d38  | MLB,UFC,WNBA |   26 | 17-9   |   65.4% |     +35.4% |    +26.24 |     0.11× | 2026-08-27 |
|    5 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    6 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    7 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    8 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   17 | 12-5   |   70.6% |     +28.6% |    +11.97 |     4.60× | 2026-08-26 |
|    9 | 7923c4  | MLB,NBA,UFC |   54 | 33-21  |   61.1% |     +28.3% |    +38.34 |     0.83× | 2026-08-27 |
|   10 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|   11 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   12 | fcc12b  | MLB,UFC    |   12 | 9-3    |   75.0% |     +25.4% |     +7.77 |     0.90× | 2026-08-28 |
|   13 | 07152f  | MLB,SOC    |   12 | 8-4    |   66.7% |     +23.8% |     +8.98 |     1.98× | 2026-08-26 |
|   14 | 4c8ed9  | MLB,SOC,UFC,WNBA |   16 | 9-7    |   56.3% |     +21.7% |     +5.07 |     2.86× | 2026-08-26 |
|   15 | 69f882  | MLB,SOC,UFC,WNBA |   24 | 18-6   |   75.0% |     +21.6% |    +13.65 |     3.94× | 2026-08-28 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 2a8409  | MLB,WNBA   |   11 | 3-8    |   27.3% |     -48.5% |     -8.49 |     1.21× | 2026-08-25 |
|    2 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    3 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    4 | c9bba3  | MLB,NFL,SOC |   16 | 9-7    |   56.3% |     -22.0% |     -7.65 |     0.80× | 2026-08-27 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    7 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    8 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 | 21-24  |   46.7% |      -8.6% |    -10.89 |     4.37× | 2026-08-27 |
|    9 | 705ba1  | MLB        |   46 | 21-25  |   45.7% |      -6.4% |     -8.26 |     1.12× | 2026-08-28 |
|   10 | 2f2a9e  | MLB,SOC,WNBA |   81 | 44-37  |   54.3% |      -4.1% |     -9.05 |     2.04× | 2026-08-27 |
|   11 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   87 | 41-46  |   47.1% |      -3.1% |     -7.59 |     1.28× | 2026-08-28 |
|   12 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   13 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 | 20-16  |   55.6% |      +1.0% |     +1.12 |     1.35× | 2026-08-28 |
|   14 | 621848  | MLB,SOC,UFC,WNBA |   43 | 26-17  |   60.5% |      +1.0% |     +1.27 |     0.58× | 2026-08-28 |
|   15 | 4c64aa  | MLB        |   92 | 50-42  |   54.3% |      +1.1% |     +1.94 |     0.84× | 2026-08-05 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `7da3d5` (FOR# 45, ROI -8.6%), `705ba1` (FOR# 46, ROI -6.4%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1750 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   431 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    10 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    68 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   358 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            277 |        65 |   25 |   16 |  171 |                    106 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            256 |        67 |   40 |    9 |  140 |                    116 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   89 |    870 | 1192 | 477-393 |  54.8% |      5.2% |    +123.02 |    +0.14 | 0.510 |        0.2497 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  810 |    +1.5pp |    +14.2pp |          +0.314 |   -0.039 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  808 |    +6.4pp |    +23.9pp |          +0.455 |   +0.116 |    +0.0306 | 🟢 better |
| v12 − v11          | +  759 |    -0.1pp |     +2.4pp |          +0.081 |   +0.066 |    +0.0145 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 715n 52.7% +3% | 10n 30.0% +29% | 10n 60.0% -1%  | 6n 83.3% +38%  | 44n 72.7% +24% | 30n 73.3% +13% | 55n 58.2% +7%  | 870n 54.8% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 173n +2%      | 243n +3%      | 194n +8%      | 122n +2%      | 133n +17%     | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2344 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1104 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 865 / 1104 (78%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 865 / 1104 (78%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 865 / 1104 (78%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 865 / 1104 (78%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 865 / 1104 (78%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 865 / 1104 (78%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 865 / 1104 (78%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1104 / 1104 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1104 / 1104 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1104 / 1104 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1104 / 1104 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1104 / 1104 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1104 / 1104 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1097 / 1104 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1095 / 1104 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1104 / 1104 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1103 / 1104 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 681 / 1104 (62%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1103 / 1104 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 681 / 1104 (62%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 680 / 1104 (62%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1104 / 1104 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1104 / 1104 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1104 / 1104 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1103 / 1104 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1104 / 1104 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 681 |      |    +0.028 |    +0.261 |      +0.057 |      +0.131 |  0.527 |
|    2 | wd contribMargin     | 1104 |      |    -0.021 |    -0.128 |      -0.045 |      -0.101 |  0.471 |
|    3 | wd maxForContrib     | 1103 |      |    -0.050 |    -0.106 |      -0.044 |      -0.050 |  0.485 |
|    4 | V12 forMean          | 865 |  🟢  |    +0.076 |    +0.034 |      +0.043 |      +0.010 |  0.533 |
|    5 | qMargin              | 865 |  🟢  |    +0.080 |    +0.019 |      +0.043 |      +0.000 |  0.532 |
|    6 | wd sizeMargin        | 680 |      |    -0.012 |    -0.009 |      -0.041 |      -0.062 |  0.496 |
|    7 | wd agAvgSize         | 681 |      |    +0.013 |    +0.011 |      +0.036 |      +0.038 |  0.503 |
|    8 | clv                  | 1095 |      |    -0.032 |    +0.054 |      -0.031 |      +0.015 |  0.512 |
|    9 | wd contribFor        | 1104 |      |    -0.020 |    -0.076 |      -0.027 |      -0.056 |  0.481 |
|   10 | lockPinnProb         | 1097 |      |    +0.187 |    +0.160 |      +0.026 |      -0.130 |  0.598 |
|   11 | hcMargin             | 1104 |      |    +0.004 |    +0.217 |      -0.022 |      +0.058 |  0.512 |
|   12 | wd contribAg         | 1104 |      |    -0.001 |    +0.133 |      +0.020 |      +0.062 |  0.501 |
|   13 | V12 agCount          | 865 |  🟢  |    -0.009 |    +0.181 |      +0.019 |      +0.105 |  0.511 |
|   14 | wd forAvgSize        | 1103 |      |    +0.002 |    +0.055 |      -0.019 |      -0.006 |  0.512 |
|   15 | ags (v11)            | 1104 |      |    +0.007 |    +0.068 |      -0.015 |      -0.013 |  0.514 |
|   16 | provenMargin         | 1104 |      |    +0.005 |    +0.087 |      -0.014 |      -0.000 |  0.502 |
|   17 | agsV12               | 865 |  🟢  |    +0.030 |    -0.006 |      +0.012 |      -0.009 |  0.530 |
|   18 | peakStars            | 1104 |      |    +0.012 |    +0.070 |      -0.011 |      -0.012 |  0.504 |
|   19 | provenFor            | 1104 |      |    -0.004 |    +0.066 |      -0.011 |      -0.007 |  0.501 |
|   20 | V12 forCount         | 865 |  🟢  |    +0.032 |    +0.198 |      +0.010 |      +0.051 |  0.519 |
|   21 | V12 agMean           | 865 |  🟢  |    -0.004 |    +0.311 |      +0.009 |      +0.115 |  0.485 |
|   22 | provenTotal          | 1104 |      |    -0.008 |    +0.022 |      -0.007 |      -0.006 |  0.501 |
|   23 | wd maxShare          | 1104 |      |    +0.009 |    -0.059 |      +0.005 |      -0.013 |  0.504 |
|   24 | wd forCount          | 1103 |      |    +0.011 |    +0.122 |      -0.003 |      +0.006 |  0.499 |
|   25 | countMargin          | 865 |      |    +0.038 |    +0.106 |      -0.002 |      -0.011 |  0.508 |
|   26 | provenAg             | 1104 |      |    -0.012 |    +0.148 |      +0.001 |      +0.065 |  0.501 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.057), `wd contribMargin` (r = -0.045), `wd maxForContrib` (r = -0.044).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd agCount` — r(unit-ret) = +0.057, AUC = 0.527. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.057 · AUC = 0.527

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 331 | 174-157 |   52.6% |     -1.3% |
| MID (p33–p67)     | 2.000 … 2.000            | 163 | 85-78   |   52.1% |     -1.5% |
| HIGH (> p67)      | 3.000 … 3.000            | 187 | 109-78  |   58.3% |     +4.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.045 · AUC = 0.471

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -40.900        | 368 | 211-157 |   57.3% |     +2.6% |
| MID (p33–p67)     | 57.800 … 30.900          | 368 | 203-165 |   55.2% |     +1.0% |
| HIGH (> p67)      | 174.100 … 94.123         | 368 | 187-181 |   50.8% |     -2.7% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd maxForContrib` · r(unit-ret) = -0.044 · AUC = 0.485

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 34.500          | 368 | 207-161 |   56.3% |     +1.8% |
| MID (p33–p67)     | 52.400 … 56.400          | 367 | 198-169 |   54.0% |     -0.2% |
| HIGH (> p67)      | 100.000 … 66.900         | 368 | 196-172 |   53.3% |     -0.5% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.043 · AUC = 0.533

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 9.205            | 289 | 156-133 |   54.0% |     +0.8% |
| MID (p33–p67)     | 19.950 … 16.587          | 288 | 153-135 |   53.1% |     -0.4% |
| HIGH (> p67)      | 48.906 … 44.487          | 288 | 165-123 |   57.3% |     +1.2% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.043 · AUC = 0.532

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 9.205            | 289 | 154-135 |   53.3% |     +0.1% |
| MID (p33–p67)     | 19.950 … 19.921          | 288 | 158-130 |   54.9% |     +1.2% |
| HIGH (> p67)      | 46.556 … 31.963          | 288 | 162-126 |   56.3% |     +0.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd contribMargin | wd maxForContrib | V12 forMean    | qMargin        | wd sizeMargin  | wd agAvgSize   | clv            |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         -0.151 |         +0.308 |         +0.137 |         +0.031 |         +0.028 |         +0.106 |         +0.013 |
| wd contribMargin |         -0.151 |  1.000         |         +0.510 |         +0.088 |         +0.073 |         +0.272 |         -0.144 |         -0.051 |
| wd maxForContrib |         +0.308 |         +0.510 |  1.000         |         +0.208 |         +0.157 |         +0.267 |         +0.048 |         -0.048 |
| V12 forMean |         +0.137 |         +0.088 |         +0.208 |  1.000         |         +0.962 |         +0.216 |         -0.020 |         -0.007 |
| qMargin     |         +0.031 |         +0.073 |         +0.157 |         +0.962 |  1.000         |         +0.201 |         -0.042 |         -0.000 |
| wd sizeMargin |         +0.028 |         +0.272 |         +0.267 |         +0.216 |         +0.201 |  1.000         |         -0.750 |         -0.052 |
| wd agAvgSize |         +0.106 |         -0.144 |         +0.048 |         -0.020 |         -0.042 |         -0.750 |  1.000         |         +0.043 |
| clv         |         +0.013 |         -0.051 |         -0.048 |         -0.007 |         -0.000 |         -0.052 |         +0.043 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.962. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 559 picks · features = 8 (+ intercept) · multiple R² = **0.0142** · adjusted R² = **-0.0020** · residual sd = 0.953

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.1027 |   0.1600 | +0.64        |        1 |
|    2 | wd agCount           |     |    +0.0650 |   0.0491 | +1.32        |        2 |
|    3 | V12 forMean          |  🟢 |    -0.0403 |   0.1630 | -0.25        |        3 |
|    4 | wd agAvgSize         |     |    +0.0368 |   0.0679 | +0.54        |        4 |
|    5 | wd contribMargin     |     |    -0.0321 |   0.0517 | -0.62        |        5 |
|    6 | clv                  |     |    -0.0239 |   0.0405 | -0.59        |        6 |
|    7 | wd sizeMargin        |     |    -0.0177 |   0.0709 | -0.25        |        7 |
|    8 | wd maxForContrib     |     |    -0.0145 |   0.0567 | -0.26        |        8 |
| —    | (intercept)          |     |    +0.0241 |   0.0403 |    +0.60 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.103), `V12 forMean` (β = -0.040)
- V12 IGNORES: `wd agCount` (β = +0.065, t = +1.32), `wd agAvgSize` (β = +0.037, t = +0.54), `wd contribMargin` (β = -0.032, t = -0.62), `clv` (β = -0.024, t = -0.59), `wd sizeMargin` (β = -0.018, t = -0.25), `wd maxForContrib` (β = -0.015, t = -0.26)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.536 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.563 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.027.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Adjusted R² of -0.0020 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*