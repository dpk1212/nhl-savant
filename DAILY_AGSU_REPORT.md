# AGS-Unified — V12 Daily Monitor

**Generated:** Thursday, September 10, 2026 at 12:36 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (102 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (102 days ago), V12 has evaluated **3372** picks, shipped **985** for real money (29.2% ship rate), and muted the other **2387**. On the shipped picks V12 has gone **547-438** (55.5% win), staked **2698.60u**, and returned **+172.47u** at **+6.4% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            102 |
| Picks V12 has evaluated             |                           3372 |
| Picks SHIPPED (units > 0)           |                            985 |
| Picks MUTED (score ≤ 0, FADE)       |                           2387 |
| Ship rate                           |                          29.2% |
| Live W-L                            |                        547-438 |
| Live Win %                          |                          55.5% |
| Live PnL (units)                    |                        +172.47 |
| Live ROI                            |                          +6.4% |
| Avg PnL / day                       |                         +1.69u |
| Most recent action (2026-09-10)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **6.4% ROI** across 985 live picks (+172.47u real PnL).
- Mute rule is **saving money** — the 1644 muted picks would have lost -102.22u at flat 1u (-6.2% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.69u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **311-245** · +8.3% ROI · +125.86u on 556 graded — see § 5.

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

**Full book:** 102d · 985 live · 547-438 · **+172.47u** · +6.4% ROI · +1.69u/day.

_Prior to table (2026-06-01 → 2026-08-20): 756 live · 411-345 · +96.52u · cum through prior = +96.52u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-08-21 |        47 |   18 |    23 | 10-8       |  55.6% |     42.20 |      -5.56 |    -13.2% |     +90.96 |
| 2026-08-22 |        69 |   20 |    36 | 12-8       |  60.0% |     58.80 |      +7.20 |     12.2% |     +98.16 |
| 2026-08-23 |        58 |   21 |    23 | 12-9       |  57.1% |     36.40 |     +12.00 |     33.0% |    +110.16 |
| 2026-08-24 |        45 |   12 |    22 | 7-5        |  58.3% |     28.40 |      -2.12 |     -7.5% |    +108.04 |
| 2026-08-25 |        56 |   15 |    30 | 7-8        |  46.7% |     51.60 |      -7.95 |    -15.4% |    +100.09 |
| 2026-08-26 |        46 |   16 |    19 | 10-6       |  62.5% |     36.40 |     +12.91 |     35.5% |    +113.00 |
| 2026-08-27 |        26 |    9 |    12 | 7-2        |  77.8% |     29.40 |     +11.39 |     38.7% |    +124.39 |
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
| 2026-09-10 |        13 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +172.47 |

> **Trajectory.** 🟡 Last 3 days (-10.3% ROI) **-17.0pp** vs prior (6.6%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-09**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 21 | 16-5 | +47.2% | +41.81u | +1.99u | +4.5% |
| 🟢 2 | RANK 2-for-0 rescue | B | 104 | 63-41 | +16.9% | +64.43u | +0.62u | +87.3% |
| 🟢 3 | DISSENT rescue | D | 24 | 13-11 | +12.0% | +3.05u | +0.13u | +108.0% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 121 | 78-43 | +13.2% | +75.24u | sized UP after path |
| 2 | Tape HOLD (mid) | 380 | 207-173 | +6.9% | +58.91u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 874 | 442-432 | +0.5% | +4.09u | 🟡 flat |
| 2 | Tape MUTE (tape<0 → 0u) | 163 | 86-77 | +0.6% | +1.04u | 🟡 flat |
| 3 | fadeTop≥60 MUTE | 47 | 23-24 | +0.9% | +0.43u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 21 | 16-5 | 76.2% | 88.5u | +41.81u | +47.2% | +1.99u | 2 | +4.5% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 0 | — | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 104 | 63-41 | 60.6% | 380.5u | +64.43u | +16.9% | +0.62u | 5 | +87.3% | +1.11u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 87 | 43-44 | 49.4% | 303.0u | -10.51u | -3.5% | -0.12u | 8 | -3.5% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 110 | 56-54 | 50.9% | 304.3u | -3.34u | -1.1% | -0.03u | 2 | -100.0% | -2.00u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 97 | 57-40 | 58.8% | 250.1u | +21.88u | +8.8% | +0.23u | 2 | +108.5% | — | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 0 | — | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 1 | +108.0% | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 121 | 78-43 | 64.5% | 569.3u | +75.24u | +13.2% | 3 | +12.5% | — |
| Tape HOLD (mid) | TAPE | staked | 380 | 207-173 | 54.5% | 851.1u | +58.91u | +6.9% | 46 | +22.8% | -2.44u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 0 | — | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 163 | 86-77 | 52.8% | 163.0u | +1.04u | +0.6% | 48 | +10.7% | +1.71u |
| fadeTop≥60 MUTE | E | CF 1u | 47 | 23-24 | 48.9% | 47.0u | +0.43u | +0.9% | 14 | +31.0% | +0.06u |
| Score FADE (≤0 → 0u) | score | CF 1u | 874 | 442-432 | 50.6% | 874.0u | +4.09u | +0.5% | 134 | -5.9% | +1.67u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | — | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 55 / +17% | 10 / +27% | — |
| SHARP | 20 / -14% | 41 / +3% | 1 / -100% |
| SHARP-LEAN | 81 / -3% | 26 / +2% | 3 / -30% |
| MINI | 46 / +10% | 10 / +45% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-09)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| RANK 2-for-0 rescue | 1 | 1-0 | +1.11u | +37.0% |
| SHARP-LEAN EDGE/net ONE | 1 | 0-1 | -2.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  30 | 16-5   |  76.2% |       88.50 |     +41.81 |     47.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 218 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 670 | 168-147 |  53.3% |     1036.75 |     +43.97 |      4.2% |
| STRONG (MINI)             |    3u | 164 | 57-40  |  58.8% |      250.05 |     +21.88 |      8.8% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 127 | 27-22  |  55.1% |       56.85 |      +4.15 |      7.3% |
| **STAKED TOTAL** |     — | 617 | 346-271 |  56.1% |     1954.35 |    +118.25 |     +6.1% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  30 | 16-5   |  76.2% |       88.50 |     +41.81 |     47.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 189 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 161 | 63-41  |  60.6% |      380.45 |     +64.43 |     16.9% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 372 | 56-54  |  50.9% |      304.34 |      -3.34 |     -1.1% |
| C · proven-$ consensus | SHARP       |    3u | 123 | 43-44  |  49.4% |      302.96 |     -10.51 |     -3.5% |
| A · mini-HC (gate-pass) | MINI        |    3u | 164 | 57-40  |  58.8% |      250.05 |     +21.88 |      8.8% |
| C · mini gate-cut     | MINI-       |    1u |  32 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |  12 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  83 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 643 picks tracked at 0u (would-be 302-341, 47.0% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (21-9, +41.81u)  ·  🟢 TOP PICK (116-102, +6.44u)  ·  🟠 SHARP PLAY (333-337, +43.97u)  ·  🔴 STRONG (91-73, +21.88u)  ·  🟣 LEAN (72-55, +4.15u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 2060 | 2051 | 2027 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 163 | 86-77 | 52.8% | 37.00u | +5.60u | +15.1% |
| HOLD      | 672 | 341-331 | 50.7% | 854.07u | +55.91u | +6.5% |
| BOOST     | 185 | 110-75 | 59.5% | 572.78u | +77.32u | +13.5% |
| FAIL_OPEN | 49 | 27-22 | 55.1% | 54.50u | -15.17u | -27.8% |
| PASS      | 958 | 480-478 | 50.1% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 720 | 375-345 | 52.1% | +15.72u |
| hold (0–2.89) | path u | 862 | 424-438 | 49.2% | +50.17u |
| boost (≥2.89) | ×1.35 | 230 | 129-101 | 56.1% | +71.67u |

_Score coverage: **1812/2027** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 163 | +6.07u | -6.07u | +103.75u | +109.82u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 123 | +57.25u | +77.32u | +20.07u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-09 | MLB | Philadelphia Phillies | SHARP~ | -3.05 | MUTE | 2.00u | 0.00u | WIN |
| 2026-09-09 | MLB | Cincinnati Reds | MINI | 4.76 | BOOST | 3.00u | 0.00u | LOSS |
| 2026-09-09 | MLB | Over 7.5 | CONFIRMED-Q1 | 3.29 | BOOST | 2.00u | 0.00u | WIN |
| 2026-09-09 | MLB | Over 8.5 | MINI | -0.35 | MUTE | 1.00u | 0.00u | WIN |
| 2026-09-09 | MLB | Under 8.5 | PATH-D | -1.42 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-09 | MLB | Under 9.5 | PATH-D | -1.71 | MUTE | 1.00u | 0.00u | WIN |
| 2026-09-09 | MLB | Under 8.5 | CONF | 3.06 | BOOST | 1.00u | 0.00u | LOSS |
| 2026-09-08 | MLB | Arizona Diamondbacks | CONFIRMED-Q1 | -1.42 | MUTE | 1.00u | 3.00u | WIN |
| 2026-09-08 | MLB | Milwaukee Brewers | SHARP~ | -0.30 | MUTE | 4.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Baltimore Orioles | PATH-D | -3.02 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-08 | MLB | New York Yankees | SHARP~ | -0.08 | MUTE | 2.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Houston Astros | PATH-D | -2.37 | MUTE | 1.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Colorado Rockies | MINI | 4.79 | BOOST | 1.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Under 7.5 | CONFIRMED-UNOPP | -0.20 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-07 | MLB | Boston Red Sox | CONFIRMED-UNOPP | -2.52 | MUTE | 3.00u | 0.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.06** · nPriors=594 · source=expanding_q1 · asOf=2026-09-10 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 1614 | 1515 | 1497 | 317 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 114 | 49-65 | 43.0% | 11.00u | -3.29u | -29.9% |
| HOLD      | 326 | 166-160 | 50.9% | 309.20u | +19.46u | +6.3% |
| FAIL_OPEN | 47 | 20-27 | 42.6% | 44.90u | -5.08u | -11.3% |
| EXEMPT    | 648 | 352-296 | 54.3% | 635.10u | +86.17u | +13.6% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -69.5 … -3.5 | 58 | 19-39 | 32.8% | 0.0u | +0.00u | — |
| Q2 | -3.4 … 0.9 | 59 | 27-32 | 45.8% | 36.9u | +14.66u | +39.7% |
| Q3 | 1.0 … 5.3 | 58 | 27-31 | 46.6% | 58.5u | +2.63u | +4.5% |
| Q4 | 5.5 … 16.8 | 59 | 31-28 | 52.5% | 76.6u | -13.44u | -17.5% |
| Q5 | 18.2 … 1802.6 | 59 | 34-25 | 57.6% | 98.7u | +11.61u | +11.8% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 114 | 49-65 | -12.41u | +12.41u | +73.50u | +61.09u |

> 🟢 **Mute is saving money** (Δ +12.41u · muted WR 43.0%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 51 | 19-32 | 37.3% | 56.0u | -13.01u |
| CFB | 5 | 1-4 | 20.0% | 6.5u | -4.33u |
| MLB | 79 | 36-43 | 45.6% | 90.5u | -2.14u |
| NFL | 4 | 2-2 | 50.0% | 4.0u | +0.10u |
| SOC | 4 | 1-3 | 25.0% | 4.0u | -0.87u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-09 | MLB | Kansas City Royals | SHARP~ | -33.5 | -1.2 | 1.00u | WIN |
| 2026-09-09 | MLB | Colorado Rockies | SHARP~ | -11.1 | -1.2 | 1.00u | LOSS |
| 2026-09-09 | MLB | St. Louis Cardinals | SHARP | -7.7 | -1.2 | 3.00u | LOSS |
| 2026-09-07 | CFB | Florida State | — | -124.3 | -1.2 | 1.00u | LOSS |
| 2026-09-07 | MLB | Cleveland Guardians | SHARP~ | -8.1 | -1.2 | 1.00u | LOSS |
| 2026-09-07 | SOC | Elche CF | — | -49.3 | -1.2 | 1.00u | LOSS |
| 2026-09-07 | MLB | Baltimore Orioles | — | -1.7 | -1.2 | 1.00u | WIN |
| 2026-09-06 | CFB | Wisconsin | SHARP~ | -16.2 | -1.2 | 1.00u | LOSS |
| 2026-09-06 | CFB | Over 46.5 | SHARP~ | -4.4 | -1.2 | 1.00u | WIN |
| 2026-09-06 | CFB | Over 51.5 | SHARP | -5.2 | -1.2 | 1.00u | LOSS |
| 2026-09-06 | MLB | Over 7.5 | SHARP~ | -22.7 | -1.2 | 1.00u | LOSS |
| 2026-09-06 | MLB | Under 7.5 | SHARP~ | -17.4 | -1.2 | 1.00u | WIN |
| 2026-09-05 | CFB | Hawai'i | CONFIRMED-UNOPP | -2.0 | -1.3 | 2.50u | LOSS |
| 2026-09-05 | MLB | Minnesota Twins | SHARP~ | -2.1 | -1.3 | 1.00u | WIN |
| 2026-09-05 | MLB | Seattle Mariners | SHARP~ | -4.4 | -1.3 | 1.00u | LOSS |
| 2026-09-05 | SOC | Tottenham Hotspur FC | — | -2.2 | -1.3 | 1.00u | LOSS |
| 2026-09-03 | MLB | Boston Red Sox | — | 16.5 | -1.3 | 3.00u | WIN |
| 2026-09-03 | MLB | Pittsburgh Pirates | SHARP~ | -8.2 | -1.3 | 1.00u | WIN |
| 2026-09-03 | MLB | Cleveland Guardians | SHARP~ | -9.8 | -1.3 | 1.00u | LOSS |
| 2026-09-03 | MLB | Under 9.5 | SHARP~ | -32.4 | -1.3 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 87 | 46-41 | 52.9% | 270.7u | +15.46u | +5.7% |
| Muted (Q1 → 0u) | 114 | 49-65 | 43.0% | 11.0u | -3.29u | -29.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 150–81 · 64.9% · +16.7%); **5–10 is the hole** (85–80 · 51.5% · -0.5%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 767 tickets · cov 740/767 (stamp 538 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 344 | 182–162 | 52.9% | -0.1% |
| 5–10 | 165 | 85–80 | 51.5% | -0.5% |
| ≥10 | 231 | 150–81 | 64.9% | +16.7% |
| All | 767 | 429–338 | 55.9% | +6.8% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.9% (110) | 57.1% (70) | 71.9% (89) |
| B | 57.7% (71) | 60% (10) | 69.6% (23) |
| C | 37.5% (40) | 43.9% (57) | 57.9% (107) |

##### Jul 15+ · 556 tickets · cov 535/556 (stamp 533 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 238 | 129–109 | 54.2% | +6.2% |
| 5–10 | 126 | 62–64 | 49.2% | -2.3% |
| ≥10 | 171 | 111–60 | 64.9% | +14.7% |
| All | 556 | 311–245 | 55.9% | +8.3% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 49% (51) | 56.1% (41) | 75% (48) |
| B | 60% (45) | 40% (5) | 68.8% (16) |
| C | 36.8% (19) | 44.2% (52) | 58.8% (97) |

##### Yesterday (Sep 9) · 5 tickets · cov 5/5 (stamp 5 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 3 | 1–2 | 33.3% | -48.6% |
| 5–10 | 2 | 1–1 | 50.0% | +29.0% |
| All | 5 | 2–3 | 40.0% | -18.8% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| B | 100% (1) | — | — |
| C | 0% (1) | — | — |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 767 tickets · cov 761/767 (stamp 550 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 500 | 283–217 | 56.6% | +7.0% |
| 5–10 | 137 | 73–64 | 53.3% | +7.9% |
| ≥10 | 124 | 71–53 | 57.3% | +6.1% |
| All | 767 | 429–338 | 55.9% | +6.8% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 58.7% (172) | 50% (52) | 71.7% (53) |
| B | 63.6% (77) | 50% (14) | 53.8% (13) |
| C | 49.2% (118) | 58.3% (48) | 42.2% (45) |

##### Jul 15+ · 556 tickets · cov 551/556 (stamp 550 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 350 | 205–145 | 58.6% | +13.1% |
| 5–10 | 114 | 60–54 | 52.6% | +7.9% |
| ≥10 | 87 | 44–43 | 50.6% | -6.0% |
| All | 556 | 311–245 | 55.9% | +8.3% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 65.4% (78) | 47.2% (36) | 62.5% (32) |
| B | 63.3% (49) | 50% (10) | 57.1% (7) |
| C | 52.7% (91) | 57.8% (45) | 38.9% (36) |

##### Yesterday (Sep 9) · 5 tickets · cov 5/5 (stamp 5 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 4 | 2–2 | 50.0% | -4.0% |
| 5–10 | 1 | 0–1 | 0.0% | -100.0% |
| All | 5 | 2–3 | 40.0% | -18.8% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| B | 100% (1) | — | — |
| C | — | 0% (1) | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 767 tickets · cov 740/767 (stamp 532 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 154 | 78–76 | 50.6% | -12.4% |
| 0–2.89 | 416 | 226–190 | 54.3% | +8.8% |
| ≥2.89 | 170 | 113–57 | 66.5% | +16.7% |
| All | 767 | 429–338 | 55.9% | +6.8% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 58.6% (157) | 75.4% (69) |
| B | 66.7% (30) | 56.1% (57) | 64.7% (17) |
| C | 18.2% (11) | 49.2% (120) | 56.2% (73) |

##### Jul 15+ · 556 tickets · cov 535/556 (stamp 532 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 85 | 50–35 | 58.8% | +9.6% |
| 0–2.89 | 325 | 172–153 | 52.9% | +6.4% |
| ≥2.89 | 125 | 80–45 | 64.0% | +12.6% |
| All | 556 | 311–245 | 55.9% | +8.3% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 55% (100) | 74.4% (39) |
| B | 71.4% (14) | 57.1% (42) | 60% (10) |
| C | — | 49.5% (101) | 55.2% (67) |

##### Yesterday (Sep 9) · 5 tickets · cov 5/5 (stamp 5 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 2 | 1–1 | 50.0% | -31.5% |
| 0–2.89 | 3 | 1–2 | 33.3% | -7.9% |
| All | 5 | 2–3 | 40.0% | -18.8% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| B | 100% (1) | — | — |
| C | — | 0% (1) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 556 | 311-245 | 55.9% | 1522.35u | +125.86u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 556/556 | 2.91 | 2.65 | +0.26 | 2.00 | 2.00 |
| depth   | #A sharps        | 556/556 | 1.48 | 1.50 | -0.02 | 1.00 | 1.00 |
| depth   | #F − #A          | 556/556 | 1.43 | 1.15 | +0.28 | 1.00 | 1.00 |
| depth   | proven F         | 556/556 | 2.04 | 1.91 | +0.13 | 1.00 | 2.00 |
| depth   | proven A         | 556/556 | 0.70 | 0.66 | +0.04 | 0.00 | 0.00 |
| depth   | proven F−A       | 556/556 | 1.34 | 1.25 | +0.08 | 1.00 | 1.00 |
| depth   | v12 F count      | 556/556 | 2.88 | 2.66 | +0.23 | 2.00 | 2.00 |
| depth   | v12 A count      | 556/556 | 1.57 | 1.60 | -0.03 | 1.00 | 1.00 |
| depth   | WA ForN          | 556/556 | 2.26 | 2.16 | +0.10 | 2.00 | 2.00 |
| depth   | WA AgN           | 556/556 | 1.25 | 1.33 | -0.08 | 1.00 | 1.00 |
| depth   | CLV ForN         | 555/556 | 2.63 | 2.45 | +0.18 | 2.00 | 2.00 |
| depth   | CLV AgN          | 555/556 | 1.45 | 1.51 | -0.06 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 556/556 | 0.37 | 0.33 | +0.04 | 0.00 | 0.00 |
| quality | ForWR            | 533/556 | 56.69 | 54.87 | +1.82 | 54.40 | 54.00 |
| quality | AgWR             | 345/556 | 45.81 | 46.63 | -0.82 | 46.85 | 47.78 |
| quality | TopFor WR        | 533/556 | 61.29 | 59.78 | +1.51 | 58.07 | 56.51 |
| quality | TopAg WR         | 345/556 | 49.27 | 49.69 | -0.43 | 49.12 | 50.00 |
| quality | EDGE             | 533/556 | 9.27 | 6.96 | +2.31 | 7.00 | 5.21 |
| quality | ForCLV           | 550/556 | 64.50 | 64.47 | +0.03 | 64.61 | 65.06 |
| quality | AgCLV            | 373/556 | 62.54 | 61.10 | +1.44 | 63.29 | 62.65 |
| quality | netCLV           | 550/556 | 2.14 | 3.09 | -0.95 | 2.61 | 3.06 |
| quality | Tape             | 532/556 | 2.17 | 1.85 | +0.32 | 1.59 | 1.44 |
| quality | V12 score        | 556/556 | 0.82 | 0.79 | +0.03 | 0.96 | 0.94 |
| quality | V12 forMean      | 556/556 | 29.30 | 23.80 | +5.50 | 22.09 | 16.80 |
| quality | V12 agMean       | 556/556 | 3.27 | 3.07 | +0.21 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 533/556 | 0.552 | -0.023 | +0.108 | +2.31 | 🟡 mild OK |
|    2 | V12 agMean       | quality | 556/556 | 0.448 | +0.364 | +0.014 | +0.21 | 🟡 mild OK |
|    3 | V12 score        | quality | 556/556 | 0.551 | -0.003 | +0.048 | +0.03 | 🟡 mild OK |
|    4 | V12 forMean      | quality | 556/556 | 0.550 | +0.209 | +0.099 | +5.50 | 🟡 mild OK |
|    5 | AgCLV            | quality | 373/556 | 0.550 | -0.046 | +0.095 | +1.44 | 🟡 mild inv |
|    6 | TopFor WR        | quality | 533/556 | 0.541 | +0.167 | +0.071 | +1.51 | 🟡 mild OK |
|    7 | ForWR            | quality | 533/556 | 0.537 | +0.043 | +0.099 | +1.82 | flat |
|    8 | Tape             | quality | 532/556 | 0.528 | -0.092 | +0.055 | +0.32 | flat |
|    9 | AgWR             | quality | 345/556 | 0.473 | +0.171 | -0.061 | -0.82 | flat |
|   10 | proven A         | depth   | 556/556 | 0.473 | +0.337 | +0.018 | +0.04 | flat |
|   11 | WA AgN           | depth   | 556/556 | 0.474 | +0.195 | -0.027 | -0.08 | flat |
|   12 | netCLV           | quality | 550/556 | 0.475 | -0.106 | -0.040 | -0.95 | flat |
|   13 | CLV ForN         | depth   | 555/556 | 0.515 | +0.300 | +0.046 | +0.18 | flat |
|   14 | v12 A count      | depth   | 556/556 | 0.486 | +0.173 | -0.009 | -0.03 | flat |
|   15 | #F sharps        | depth   | 556/556 | 0.514 | +0.312 | +0.055 | +0.26 | flat |
|   16 | #A sharps        | depth   | 556/556 | 0.486 | +0.183 | -0.006 | -0.02 | flat |
|   17 | CLV AgN          | depth   | 555/556 | 0.486 | +0.171 | -0.018 | -0.06 | flat |
|   18 | unopposed (A=0)  | depth   | 556/556 | 0.513 | +0.267 | +0.037 | +0.04 | flat |
|   19 | ForCLV           | quality | 550/556 | 0.489 | -0.166 | +0.002 | +0.03 | flat |
|   20 | #F − #A          | depth   | 556/556 | 0.511 | +0.231 | +0.057 | +0.28 | flat |
|   21 | WA ForN          | depth   | 556/556 | 0.491 | +0.313 | +0.028 | +0.10 | flat |
|   22 | v12 F count      | depth   | 556/556 | 0.509 | +0.315 | +0.051 | +0.23 | flat |
|   23 | proven F−A       | depth   | 556/556 | 0.508 | +0.284 | +0.030 | +0.08 | flat |
|   24 | TopAg WR         | quality | 345/556 | 0.495 | +0.128 | -0.025 | -0.43 | flat |
|   25 | proven F         | depth   | 556/556 | 0.502 | +0.381 | +0.041 | +0.13 | flat |

### (C) Working read

_N=556 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.552 · Δ +2.31 · higher on WINs (cov 533/556)
- **V12 agMean** — AUC 0.448 · Δ +0.21 · higher on LOSSes (cov 556/556)
- **V12 score** — AUC 0.551 · Δ +0.03 · higher on WINs (cov 556/556)
- **V12 forMean** — AUC 0.550 · Δ +5.50 · higher on WINs (cov 556/556)
- **TopFor WR** — AUC 0.541 · Δ +1.51 · higher on WINs (cov 533/556)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1050 | 255 | 255 | 251 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 36 | 21-15 | 58.3% | 105.40u | +16.43u | +15.6% | -0.7 |
| on→off | 11 | 4-7 | 36.4% | 35.20u | -9.86u | -28.0% | -5.6 |
| off→on | 36 | 26-10 | 72.2% | 92.20u | +42.74u | +46.4% | +2.3 |
| off→off | 168 | 93-75 | 55.4% | 435.80u | +18.79u | +4.3% | -0.7 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 162 | 87-75 | 53.7% | 475.60u | +12.17u | +2.6% |
| 0–2 | 62 | 40-22 | 64.5% | 146.10u | +51.45u | +35.2% |
| 2–4 | 12 | 9-3 | 75.0% | 27.40u | +9.28u | +33.9% |
| 4+ | 15 | 8-7 | 53.3% | 19.50u | -4.80u | -24.6% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 3 | 2-1 | 66.7% | 6.00u | +0.41u | +6.8% |
| gold, limits flat | 7 | 5-2 | 71.4% | 20.30u | +14.59u | +71.9% |
| steam, not gold | 62 | 40-22 | 64.5% | 171.30u | +44.17u | +25.8% |
| limits↑, no steam | 6 | 3-3 | 50.0% | 15.40u | +3.23u | +21.0% |
| neither | 173 | 94-79 | 54.3% | 455.60u | +5.70u | +1.3% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 67 | 45-22 | 67.2% | 189.60u | +60.22u | +31.8% |
| A/B + no steam | 164 | 92-72 | 56.1% | 422.20u | +29.55u | +7.0% |
| A/B + steam arriving | 35 | 26-9 | 74.3% | 91.20u | +43.74u | +48.0% |
| A/B + gold | 9 | 6-3 | 66.7% | 23.30u | +13.57u | +58.2% |
| steam at lock, no A/B | 5 | 2-3 | 40.0% | 8.00u | -1.05u | -13.1% |
| Source B + steam arriving | 34 | 26-8 | 76.5% | 89.20u | +45.74u | +51.3% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 3n · 66.7% · -14.7%    | —                      | —                      | 3n · 66.7% · -14.7%    |
| MLB   | 406n · 54.2% · +6.2%   | 95n · 55.8% · +2.5%    | 301n · 52.5% · +5.9%   | 802n · 53.7% · +5.6%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 10n · 60.0% · +7.9%    | 3n · 66.7% · -28.0%    | 3n · 33.3% · -20.2%    | 16n · 56.3% · -4.6%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 53n · 67.9% · +15.9%   | —                      | —                      | 53n · 67.9% · +15.9%   |
| UFC   | 34n · 76.5% · +16.6%   | —                      | —                      | 34n · 76.5% · +16.6%   |
| WNBA  | 27n · 74.1% · +3.2%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 61n · 57.4% · -0.5%    |
| **All** | **540n · 57.8% · +8.0%** | **121n · 54.5% · +3.4%** | **324n · 52.2% · +5.1%** | **985n · 55.5% · +6.4%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1644** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1644 |
| Muted W-L                           |              800-844 |
| Muted Win %                         |                48.7% |
| Counterfactual PnL at flat 1u       |              -102.22 |
| Counterfactual ROI at flat 1u       |                -6.2% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-102.22u** at a flat 1u stake — a counterfactual ROI of **-6.2%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-09-09 | MLB   | ML     | Los Angeles Dodgers     |  -270 | +0.989 | 2-for-0  |   2/0 |   2/0 |  54.5 |   39.3 |   +4.5 | -2.50 | HOLD     | 3.00u | WIN     |      +1.11 |
| 2026-09-09 | MLB   | ML     | Pittsburgh Pirates      |  +115 | +0.391 | CONFIRMED-Q1 |   2/5 |   1/4 |  60.9 |   62.8 |   +8.0 |  1.29 | HOLD     | 3.00u | WIN     |      +3.45 |
| 2026-09-09 | MLB   | ML     | Toronto Blue Jays       |  -160 | +0.481 | CONFIRMED-Q1 |   3/2 |   3/2 |  61.8 |   50.8 |   +3.4 | -0.55 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-09 | MLB   | TOTAL  | Under 8.5               |  -102 | +0.289 | SHARP~   |   9/5 |   7/3 |  52.0 |   66.1 |   +0.4 |  1.49 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-09 | NFL   | TOTAL  | Over 44.5               |  +105 | +0.985 | CONFIRMED-Q1 |  14/2 |   5/1 |  55.0 |   60.1 |   +5.0 |  1.21 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-08 | MLB   | ML     | Arizona Diamondbacks    |  -105 | +0.838 | CONFIRMED-Q1 |   9/4 |   9/7 |  55.1 |   55.7 |   -0.9 | -1.42 | MUTE     | 3.00u | WIN     |      +2.86 |
| 2026-09-08 | MLB   | ML     | Boston Red Sox          |  -134 | +0.891 | CONFIRMED-Q1 |   4/1 |   2/1 |  58.5 |   50.7 |   +5.0 |  0.66 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | ML     | Detroit Tigers          |  -130 | +0.386 | SHARP~   |   6/1 |   6/1 |  59.5 |   52.0 |   +9.9 |  0.96 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-08 | MLB   | ML     | Texas Rangers           |  +119 | +0.987 | MINI     |   5/0 |   4/0 |  58.8 |   58.6 |   +8.8 |  1.25 | HOLD     | 3.00u | WIN     |      +3.57 |
| 2026-09-08 | MLB   | SPREAD | Chicago Cubs            |  -105 | +0.025 | CONFIRMED-Q1 |   7/2 |   6/2 |  56.4 |   62.1 |   +9.9 |  1.84 | HOLD     | 3.00u | WIN     |      +2.86 |
| 2026-09-08 | MLB   | TOTAL  | Over 7.5                |  +106 | +0.755 | HC-2     |   5/2 |   3/2 |  60.2 |   60.2 |   +8.6 |  1.87 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | TOTAL  | Over 8.5                |  +118 | +0.744 | CONFIRMED-Q1 |   2/1 |   2/1 |  55.8 |   69.0 |   +4.0 |  1.72 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | TOTAL  | Under 8.5               |  +107 | +0.395 | CONFIRMED-Q1 |   2/2 |   1/2 |  53.4 |   57.0 |   +1.8 |  0.02 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | TOTAL  | Under 9.5               |  +104 | +0.989 | 2-for-0  |   2/0 |   2/0 |  51.7 |   64.4 |   +1.7 |  0.69 | HOLD     | 3.00u | WIN     |      +3.12 |
| 2026-09-07 | MLB   | ML     | Arizona Diamondbacks    |  -104 | +0.229 | CONFIRMED-Q1 |   5/5 |   3/5 |  65.1 |   60.9 |   +8.0 |  1.51 | HOLD     | 3.00u | WIN     |      +2.88 |
| 2026-09-07 | MLB   | ML     | Philadelphia Phillies   |  -184 | +0.532 | CONFIRMED-Q1 |   7/4 |   6/4 |  56.4 |   61.0 |   +2.6 |  1.48 | HOLD     | 3.00u | WIN     |      +1.63 |
| 2026-09-07 | MLB   | ML     | Toronto Blue Jays       |  -205 | +0.541 | CONFIRMED-Q1 |   8/2 |   8/2 |  57.9 |   58.3 |   +6.8 |  1.94 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-07 | MLB   | TOTAL  | Under 9.5               |  -117 | +0.982 | SHARP    |   1/0 |   1/0 |  59.3 |   67.6 |   +9.3 |  2.69 | HOLD     | 3.00u | WIN     |      +2.56 |
| 2026-09-07 | MLB   | TOTAL  | Over 9.5                |  +105 | +0.192 | CONFIRMED-Q1 |  15/6 |  11/5 |  55.7 |   63.3 |   +2.7 |  1.76 | HOLD     | 3.00u | WIN     |      +3.15 |
| 2026-09-07 | MLB   | TOTAL  | Under 9.5               |  -100 | +0.221 | CONFIRMED-Q1 |  10/7 |   9/5 |  55.0 |   63.1 |   +4.6 |  1.65 | HOLD     | 3.00u | WIN     |      +3.00 |
| 2026-09-07 | MLB   | TOTAL  | Under 8.5               |  +113 | +0.477 | CONFIRMED-Q1 |   2/3 |   1/2 |  59.6 |   60.4 |   +7.1 |  1.93 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-06 | MLB   | ML     | Boston Red Sox          |  -134 | +0.474 | CONFIRMED-Q1 |   7/3 |   6/1 |  54.7 |   59.4 |   +5.9 |  0.85 | HOLD     | 3.00u | WIN     |      +2.24 |
| 2026-09-06 | MLB   | ML     | Detroit Tigers          |  +141 | +0.113 | CONFIRMED-Q1 |  10/8 |   7/7 |  54.3 |   62.1 |   -1.3 |  0.87 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-09-06 | MLB   | ML     | Milwaukee Brewers       |  -146 | +0.739 | CONFIRMED-Q1 |   8/6 |   7/4 |  57.5 |   47.8 |   +7.8 | -0.76 | MUTE     | 3.00u | LOSS    |      -3.00 |
| 2026-09-06 | MLB   | TOTAL  | Under 7.5               |  -117 | +0.957 | CONFIRMED-Q1 |   5/2 |   5/1 |  52.3 |   57.6 |   -1.6 | -2.06 | MUTE     | 3.00u | WIN     |      +2.56 |
| 2026-09-06 | MLB   | TOTAL  | Over 7.5                |  -127 | +0.044 | SHARP    |   1/2 |   1/1 |  58.2 |   66.7 |   +8.5 |  2.83 | HOLD     | 3.00u | WIN     |      +2.36 |
| 2026-09-06 | MLB   | TOTAL  | Over 7.5                |  -127 | +0.990 | CONFIRMED-Q1 |   2/0 |   2/1 |  55.4 |   68.6 |   +5.4 |  2.07 | HOLD     | 3.00u | WIN     |      +2.36 |
| 2026-09-06 | MLB   | TOTAL  | Over 8.5                |  +107 | +0.910 | CONFIRMED-Q1 |   5/1 |   3/0 |  52.1 |   56.7 |   +6.4 | -0.14 | MUTE     | 3.00u | WIN     |      +3.21 |
| 2026-09-05 | CFB   | ML     | James Madison           |  -203 | +0.996 | CONFIRMED-Q1 |   1/0 |   1/0 |  48.5 |   62.8 |   -1.5 | -0.17 | HOLD     | 2.00u | WIN     |      +0.99 |
| 2026-09-05 | CFB   | ML     | California              |  +129 | +0.202 | SHARP    |   2/3 |   1/3 |  66.7 |   64.7 |   +7.7 |  2.84 | HOLD     | 2.00u | LOSS    |      -2.00 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.539 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.072 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.018 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.010 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.036 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  980 |    +0.0739 |    -0.0358 | 0.0004 |  +0.020 |   0.947 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  980 |    +0.0709 |    +0.4962 | 0.0013 |  +0.036 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  980 |    -0.1488 |    +0.2968 | 0.0002 |  -0.013 |   2.831 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 980 |          +0.080 |           +0.082 |                   +0.043 |                   +0.035 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 980 |          +0.001 |           +0.332 |                   +0.011 |                   +0.126 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 980 |          +0.032 |           +0.226 |                   +0.012 |                   +0.068 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 980 |          -0.014 |           +0.177 |                   +0.015 |                   +0.106 | count of contributing AGAINST-side wallets                     |
| provenFor         | 980 |          +0.028 |           +0.215 |                   +0.021 |                   +0.096 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 980 |          +0.008 |           +0.161 |                   +0.026 |                   +0.082 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 5.050          | 327 | 175-152 |   53.5% |     +0.3% |
| MID (p33–p67)     | 19.950 … 15.620        | 327 | 181-146 |   55.4% |     +0.8% |
| HIGH (> p67)      | 48.906 … 32.425        | 326 | 188-138 |   57.7% |     +1.4% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       980 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8311 | average score across live picks                                 |
| SD                |    0.2507 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.794 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +2.045 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.391 / +0.958 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |    3 | 2-1    |   66.7% |    -14.7% |  1.000 |        +0.500 | strong (N<20)                             |
| MLB   |  798 | 429-369 |   53.8% |     +5.5% |  0.520 |        -0.076 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   16 | 9-7    |   56.3% |     -4.6% |  0.556 |        -0.112 | real (N<20)                               |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   52 | 35-17  |   67.3% |    +15.6% |  0.580 |        +0.083 | real                                      |
| UFC   |   34 | 26-8   |   76.5% |    +16.6% |  0.596 |        +0.046 | strong                                    |
| WNBA  |   61 | 35-26  |   57.4% |     -0.5% |  0.548 |        +0.051 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09"]
    y-axis "AUC" 0.4 --> 0.7
    line [0.538, 0.599, 0.596, 0.581, 0.594, 0.619, 0.586, 0.558, 0.538, 0.587, 0.659, 0.591, 0.588, 0.597]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09"]
    y-axis "edge (pp)" -3 --> 22
    line [3, -1.2, -0.5, -0.2, 0.3, 3.3, 2.4, 2.9, 12.4, 15.5, 20.9, 20.6, 13.5, 10.9]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-27 |    7 |  111 | 65-46  |   58.6% |     +9.8% |  0.538 |      +3.0pp |
| 2026-08-28 |    7 |  115 | 64-51  |   55.7% |     +1.0% |  0.599 |      -1.2pp |
| 2026-08-29 |    7 |  108 | 60-48  |   55.6% |     +2.8% |  0.596 |      -0.5pp |
| 2026-08-30 |    7 |  106 | 59-47  |   55.7% |     +1.2% |  0.581 |      -0.2pp |
| 2026-08-31 |    7 |   99 | 56-43  |   56.6% |     +3.4% |  0.594 |      +0.3pp |
| 2026-09-01 |    7 |   88 | 53-35  |   60.2% |    +14.4% |  0.619 |      +3.3pp |
| 2026-09-02 |    7 |   77 | 46-31  |   59.7% |    +12.0% |  0.586 |      +2.4pp |
| 2026-09-03 |    7 |   74 | 44-30  |   59.5% |    +11.7% |  0.558 |      +2.9pp |
| 2026-09-04 |    7 |   59 | 40-19  |   67.8% |    +35.3% |  0.538 |     +12.4pp |
| 2026-09-05 |    7 |   55 | 38-17  |   69.1% |    +34.2% |  0.587 |     +15.5pp |
| 2026-09-06 |    7 |   43 | 32-11  |   74.4% |    +42.0% |  0.659 |     +20.9pp |
| 2026-09-07 |    7 |   45 | 33-12  |   73.3% |    +41.9% |  0.591 |     +20.6pp |
| 2026-09-08 |    7 |   50 | 33-17  |   66.0% |    +27.1% |  0.588 |     +13.5pp |
| 2026-09-09 |    7 |   50 | 32-18  |   64.0% |    +22.9% |  0.597 |     +10.9pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.529 avg in first half → 0.540 avg in second half · Δ = +0.011)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +6.4% | [-0.3%, +12.7%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.5% | [52.3%, 58.6%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.539 | [0.504, 0.575]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            109 | [46, 168]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       985 |
| Unique wallets ever on a FOR side            |                                                       288 |
| Avg FOR-side wallets per pick                |                                                      2.94 |
| Top-5 wallets' share of all FOR appearances  |                                                     21.5% |
| Top-10 wallets' share of all FOR appearances |                                                     36.6% |
| Top-20 wallets' share of all FOR appearances |                                                     52.0% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | MLB,NFL,SOC,WNBA |  173 |   57 | 94-79  |   54.3% |    +12.3% |    +50.95 |     1.52× | CONFIRMED   |     -2.8% |     588 | 2026-09-09 |
|    2 | 0cd77e  | MLB,SOC,UFC,WNBA |  155 |   25 | 85-70  |   54.8% |    +13.6% |    +58.90 |     1.59× | CONFIRMED   |     -3.0% |     377 | 2026-09-08 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  102 |   64 | 65-37  |   63.7% |    +16.6% |    +56.36 |     1.54× | CONFIRMED   |     +7.8% |     345 | 2026-09-09 |
|    4 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   99 |   53 | 55-44  |   55.6% |    +16.1% |    +45.13 |     1.02× | CONFIRMED   |     +7.5% |     577 | 2026-09-09 |
|    5 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   95 |   70 | 46-49  |   48.4% |     -1.0% |     -2.63 |     1.22× | CONFIRMED   |     +1.0% |     492 | 2026-09-09 |
|    6 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    7 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    8 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |   88 |   64 | 48-40  |   54.5% |    +11.4% |    +24.90 |     0.49× | CONFIRMED   |     +9.9% |     407 | 2026-09-09 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   84 |   32 | 44-40  |   52.4% |     -6.7% |    -15.05 |     1.99× | CONFIRMED   |     -9.3% |     300 | 2026-09-07 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   59 |   16 | 36-23  |   61.0% |    +28.8% |    +42.47 |     0.93× | CONFIRMED   |    +10.7% |     238 | 2026-09-06 |
|   12 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   56 |   66 | 26-30  |   46.4% |     -8.1% |    -12.76 |     3.74× | CONFIRMED   |     -6.2% |     321 | 2026-09-09 |
|   13 | 705ba1  | MLB        |   55 |   37 | 27-28  |   49.1% |     -0.1% |     -0.13 |     1.13× | CONFIRMED   |     +6.0% |     279 | 2026-09-09 |
|   14 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   15 | bc35e3  | MLB,NFL,SOC,UFC,WNBA |   48 |   26 | 22-26  |   45.8% |     -1.5% |     -2.05 |     1.15× | CONFIRMED   |     -4.3% |     213 | 2026-09-09 |
|   16 | 621848  | MLB,SOC,UFC,WNBA |   43 |   12 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +7.4% |     117 | 2026-09-03 |
|   17 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.8% |     148 | 2026-09-02 |
|   18 | 69f882  | MLB,SOC,UFC,WNBA |   36 |   24 | 26-10  |   72.2% |    +21.0% |    +21.49 |     3.24× | CONFIRMED   |    +10.6% |     151 | 2026-09-09 |
|   19 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   20 | 9214c2  | MLB        |   31 |    2 | 15-16  |   48.4% |    +12.3% |     +9.65 |     1.12× | CONFIRMED   |     +4.5% |     102 | 2026-09-09 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 62941a  | MLB,NFL    |   12 | 9-3    |   75.0% |     +65.8% |    +20.67 |     0.74× | 2026-09-07 |
|    2 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    3 | d66e28  | MLB,WNBA   |   17 | 13-4   |   76.5% |     +57.1% |    +24.73 |     0.75× | 2026-09-07 |
|    4 | aa894c  | MLB        |   16 | 11-5   |   68.8% |     +45.5% |    +17.47 |     0.78× | 2026-09-08 |
|    5 | 579e12  | MLB        |   14 | 9-5    |   64.3% |     +45.1% |    +17.09 |     0.68× | 2026-09-09 |
|    6 | ba8492  | MLB        |   10 | 7-3    |   70.0% |     +44.3% |    +12.80 |     1.86× | 2026-09-08 |
|    7 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    8 | 4c8ed9  | MLB,SOC,UFC,WNBA |   19 | 12-7   |   63.2% |     +43.5% |    +14.08 |     2.86× | 2026-09-08 |
|    9 | 718cd6  | MLB,NFL,SOC,UFC |   10 | 7-3    |   70.0% |     +40.0% |     +9.61 |     1.29× | 2026-09-09 |
|   10 | 2cbcf8  | MLB,NFL,UFC |   15 | 10-5   |   66.7% |     +38.3% |    +20.77 |     1.08× | 2026-09-09 |
|   11 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|   12 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   13 | e8e2cc  | MLB,NFL,WNBA |   17 | 12-5   |   70.6% |     +34.3% |    +17.08 |     1.08× | 2026-09-09 |
|   14 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   15 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    3 | 2a8409  | MLB,NFL,WNBA |   18 | 6-12   |   33.3% |     -26.2% |     -8.91 |     1.56× | 2026-09-09 |
|    4 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    5 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    6 | c9bba3  | MLB,NFL,SOC |   18 | 11-7   |   61.1% |      -8.7% |     -3.39 |     0.77× | 2026-09-08 |
|    7 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   56 | 26-30  |   46.4% |      -8.1% |    -12.76 |     3.74× | 2026-09-09 |
|    8 | ac9705  | MLB,WNBA   |   22 | 10-12  |   45.5% |      -7.6% |     -6.00 |     2.16× | 2026-09-03 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   84 | 44-40  |   52.4% |      -6.7% |    -15.05 |     1.99× | 2026-09-07 |
|   10 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   11 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 | 20-17  |   54.1% |      -1.6% |     -1.88 |     1.36× | 2026-09-02 |
|   12 | bc35e3  | MLB,NFL,SOC,UFC,WNBA |   48 | 22-26  |   45.8% |      -1.5% |     -2.05 |     1.15× | 2026-09-09 |
|   13 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   95 | 46-49  |   48.4% |      -1.0% |     -2.63 |     1.22× | 2026-09-09 |
|   14 | 705ba1  | MLB        |   55 | 27-28  |   49.1% |      -0.1% |     -0.13 |     1.13× | 2026-09-09 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   43 | 26-17  |   60.5% |      +1.0% |     +1.27 |     0.58× | 2026-09-03 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `7da3d5` (FOR# 56, ROI -8.1%), `2f2a9e` (FOR# 84, ROI -6.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  2367 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   657 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     3 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   104 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   376 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            323 |        83 |   33 |   19 |  188 |                    135 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            298 |        81 |   46 |   20 |  151 |                    147 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  102 |    985 | 1644 | 547-438 |  55.5% |      6.4% |    +172.47 |    +0.18 | 0.515 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  925 |    +2.2pp |    +15.3pp |          +0.348 |   -0.034 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  923 |    +7.1pp |    +25.1pp |          +0.488 |   +0.121 |    +0.0305 | 🟢 better |
| v12 − v11          | +  874 |    +0.6pp |     +3.6pp |          +0.114 |   +0.071 |    +0.0144 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 3n 66.7% -15%  | 802n 53.7% +6% | 10n 30.0% +29% | 16n 56.3% -5%  | 6n 83.3% +38%  | 53n 67.9% +16% | 34n 76.5% +17% | 61n 57.4% -0%  | 985n 55.5% +6% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 193n +7%      | 262n +4%      | 214n +9%      | 129n -1%      | 182n +11%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2911 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1219 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 980 / 1219 (80%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 980 / 1219 (80%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 980 / 1219 (80%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 980 / 1219 (80%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 980 / 1219 (80%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 980 / 1219 (80%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 980 / 1219 (80%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1219 / 1219 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1219 / 1219 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1219 / 1219 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1219 / 1219 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1219 / 1219 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1219 / 1219 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1212 / 1219 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1210 / 1219 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1219 / 1219 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1218 / 1219 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 764 / 1219 (63%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1218 / 1219 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 764 / 1219 (63%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 763 / 1219 (63%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1219 / 1219 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1219 / 1219 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1219 / 1219 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1218 / 1219 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1219 / 1219 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 764 |      |    +0.029 |    +0.270 |      +0.055 |      +0.136 |  0.518 |
|    2 | V12 forMean          | 980 |  🟢  |    +0.080 |    +0.082 |      +0.043 |      +0.035 |  0.534 |
|    3 | qMargin              | 980 |  🟢  |    +0.082 |    +0.033 |      +0.042 |      +0.009 |  0.530 |
|    4 | wd maxForContrib     | 1218 |      |    -0.043 |    -0.098 |      -0.037 |      -0.046 |  0.489 |
|    5 | wd sizeMargin        | 763 |      |    -0.009 |    -0.007 |      -0.037 |      -0.058 |  0.498 |
|    6 | wd contribMargin     | 1219 |      |    -0.006 |    -0.085 |      -0.033 |      -0.082 |  0.483 |
|    7 | wd agAvgSize         | 764 |      |    +0.011 |    +0.008 |      +0.032 |      +0.035 |  0.503 |
|    8 | lockPinnProb         | 1212 |      |    +0.195 |    +0.167 |      +0.028 |      -0.128 |  0.602 |
|    9 | clv                  | 1210 |      |    -0.021 |    +0.074 |      -0.021 |      +0.025 |  0.520 |
|   10 | wd contribFor        | 1219 |      |    -0.011 |    -0.039 |      -0.020 |      -0.037 |  0.487 |
|   11 | agsV12               | 980 |  🟢  |    +0.036 |    -0.018 |      +0.020 |      -0.010 |  0.539 |
|   12 | hcMargin             | 1219 |      |    +0.009 |    +0.234 |      -0.018 |      +0.068 |  0.510 |
|   13 | ags (v11)            | 1219 |      |    +0.008 |    +0.084 |      -0.015 |      -0.006 |  0.519 |
|   14 | V12 agCount          | 980 |  🟢  |    -0.014 |    +0.177 |      +0.015 |      +0.106 |  0.496 |
|   15 | wd contribAg         | 1219 |      |    -0.009 |    +0.130 |      +0.014 |      +0.062 |  0.489 |
|   16 | wd maxShare          | 1219 |      |    +0.018 |    -0.067 |      +0.013 |      -0.020 |  0.508 |
|   17 | V12 forCount         | 980 |  🟢  |    +0.032 |    +0.226 |      +0.012 |      +0.068 |  0.512 |
|   18 | V12 agMean           | 980 |  🟢  |    +0.001 |    +0.332 |      +0.011 |      +0.126 |  0.465 |
|   19 | provenMargin         | 1219 |      |    +0.007 |    +0.115 |      -0.011 |      +0.017 |  0.500 |
|   20 | provenAg             | 1219 |      |    -0.007 |    +0.170 |      +0.008 |      +0.076 |  0.487 |
|   21 | wd forAvgSize        | 1218 |      |    +0.012 |    +0.063 |      -0.008 |      +0.002 |  0.518 |
|   22 | peakStars            | 1219 |      |    +0.027 |    +0.063 |      +0.006 |      -0.008 |  0.511 |
|   23 | provenFor            | 1219 |      |    +0.001 |    +0.110 |      -0.004 |      +0.021 |  0.497 |
|   24 | countMargin          | 980 |      |    +0.042 |    +0.144 |      +0.001 |      +0.007 |  0.509 |
|   25 | wd forCount          | 1218 |      |    +0.015 |    +0.158 |      +0.001 |      +0.027 |  0.495 |
|   26 | provenTotal          | 1219 |      |    -0.003 |    +0.063 |      +0.001 |      +0.019 |  0.494 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.055), `V12 forMean` (r = +0.043), `qMargin` (r = +0.042).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd agCount` — r(unit-ret) = +0.055, AUC = 0.518. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.055 · AUC = 0.518

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 356 | 190-166 |   53.4% |     -0.6% |
| MID (p33–p67)     | 2.000 … 2.000            | 183 | 95-88   |   51.9% |     -1.4% |
| HIGH (> p67)      | 3.000 … 6.000            | 225 | 130-95  |   57.8% |     +3.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.043 · AUC = 0.534

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 5.050            | 327 | 175-152 |   53.5% |     +0.3% |
| MID (p33–p67)     | 19.950 … 15.620          | 327 | 181-146 |   55.4% |     +0.8% |
| HIGH (> p67)      | 48.906 … 32.425          | 326 | 188-138 |   57.7% |     +1.4% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `qMargin` · r(unit-ret) = +0.042 · AUC = 0.530

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 8.995            | 327 | 179-148 |   54.7% |     +1.1% |
| MID (p33–p67)     | 19.950 … 15.968          | 326 | 176-150 |   54.0% |     +0.4% |
| HIGH (> p67)      | 46.556 … 32.425          | 327 | 189-138 |   57.8% |     +1.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.037 · AUC = 0.489

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 16.500          | 407 | 228-179 |   56.0% |     +1.5% |
| MID (p33–p67)     | 52.400 … 51.338          | 405 | 222-183 |   54.8% |     +0.4% |
| HIGH (> p67)      | 100.000 … 68.155         | 406 | 221-185 |   54.4% |     +0.2% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd sizeMargin` · r(unit-ret) = -0.037 · AUC = 0.498

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.231          | 255 | 142-113 |   55.7% |     +1.9% |
| MID (p33–p67)     | 0.078 … 0.262            | 254 | 133-121 |   52.4% |     +0.4% |
| HIGH (> p67)      | 3.728 … 1.210            | 254 | 140-114 |   55.1% |     -1.2% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | V12 forMean    | qMargin        | wd maxForContrib | wd sizeMargin  | wd contribMargin | wd agAvgSize   | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.136 |         +0.003 |         +0.283 |         +0.028 |         -0.135 |         +0.094 |         -0.066 |
| V12 forMean |         +0.136 |  1.000         |         +0.947 |         +0.187 |         +0.220 |         +0.083 |         -0.033 |         +0.113 |
| qMargin     |         +0.003 |         +0.947 |  1.000         |         +0.144 |         +0.204 |         +0.066 |         -0.049 |         +0.119 |
| wd maxForContrib |         +0.283 |         +0.187 |         +0.144 |  1.000         |         +0.261 |         +0.510 |         +0.053 |         +0.046 |
| wd sizeMargin |         +0.028 |         +0.220 |         +0.204 |         +0.261 |  1.000         |         +0.272 |         -0.756 |         +0.152 |
| wd contribMargin |         -0.135 |         +0.083 |         +0.066 |         +0.510 |         +0.272 |  1.000         |         -0.147 |         +0.193 |
| wd agAvgSize |         +0.094 |         -0.033 |         -0.049 |         +0.053 |         -0.756 |         -0.147 |  1.000         |         -0.089 |
| lockPinnProb |         -0.066 |         +0.113 |         +0.119 |         +0.046 |         +0.152 |         +0.193 |         -0.089 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.947. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 643 picks · features = 8 (+ intercept) · multiple R² = **0.0101** · adjusted R² = **-0.0040** · residual sd = 0.953

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.0654 |   0.1289 | +0.51        |        1 |
|    2 | wd agCount           |     |    +0.0615 |   0.0457 | +1.34        |        2 |
|    3 | wd agAvgSize         |     |    +0.0279 |   0.0642 | +0.43        |        3 |
|    4 | wd sizeMargin        |     |    -0.0202 |   0.0672 | -0.30        |        4 |
|    5 | wd contribMargin     |     |    -0.0175 |   0.0485 | -0.36        |        5 |
|    6 | wd maxForContrib     |     |    -0.0125 |   0.0524 | -0.24        |        6 |
|    7 | V12 forMean          |  🟢 |    -0.0091 |   0.1310 | -0.07        |        7 |
|    8 | lockPinnProb         |     |    +0.0067 |   0.0389 | +0.17        |        8 |
| —    | (intercept)          |     |    +0.0264 |   0.0376 |    +0.70 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.065), `V12 forMean` (β = -0.009)
- V12 IGNORES: `wd agCount` (β = +0.061, t = +1.34), `wd agAvgSize` (β = +0.028, t = +0.43), `wd sizeMargin` (β = -0.020, t = -0.30), `wd contribMargin` (β = -0.018, t = -0.36), `wd maxForContrib` (β = -0.012, t = -0.24), `lockPinnProb` (β = +0.007, t = +0.17)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.539 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.554 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `V12 forMean`. They may be contributing noise rather than information.
- Adjusted R² of -0.0040 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*