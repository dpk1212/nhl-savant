# AGS-Unified — V12 Daily Monitor

**Generated:** Thursday, September 3, 2026 at 12:37 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (95 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (95 days ago), V12 has evaluated **2979** picks, shipped **935** for real money (31.4% ship rate), and muted the other **2044**. On the shipped picks V12 has gone **515-420** (55.1% win), staked **2552.80u**, and returned **+139.05u** at **+5.4% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             95 |
| Picks V12 has evaluated             |                           2979 |
| Picks SHIPPED (units > 0)           |                            935 |
| Picks MUTED (score ≤ 0, FADE)       |                           2044 |
| Ship rate                           |                          31.4% |
| Live W-L                            |                        515-420 |
| Live Win %                          |                          55.1% |
| Live PnL (units)                    |                        +139.05 |
| Live ROI                            |                          +5.4% |
| Avg PnL / day                       |                         +1.46u |
| Most recent action (2026-09-05)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.4% ROI** across 935 live picks (+139.05u real PnL).
- Mute rule is **saving money** — the 1380 muted picks would have lost -73.60u at flat 1u (-5.3% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.46u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **279-227** · +6.7% ROI · +92.44u on 506 graded — see § 5.

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

**Full book:** 95d · 935 live · 515-420 · **+139.05u** · +5.4% ROI · +1.46u/day.

_Prior to table (2026-06-01 → 2026-08-15): 680 live · 375-305 · +87.77u · cum through prior = +87.77u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-28 |        70 |   22 |    35 | 9-13       |  40.9% |     58.60 |     -30.30 |    -51.7% |     +94.09 |
| 2026-08-29 |        74 |   13 |    42 | 8-5        |  61.5% |     29.70 |     +11.58 |     39.0% |    +105.67 |
| 2026-08-30 |        49 |   19 |    26 | 11-8       |  57.9% |     52.90 |      +7.94 |     15.0% |    +113.61 |
| 2026-08-31 |        39 |    5 |    22 | 4-1        |  80.0% |     12.50 |      +3.74 |     29.9% |    +117.35 |
| 2026-09-01 |        44 |    4 |    31 | 4-0        | 100.0% |     16.90 |     +16.82 |     99.5% |    +134.17 |
| 2026-09-02 |        49 |    5 |    33 | 3-2        |  60.0% |     17.40 |      +4.88 |     28.0% |    +139.05 |
| 2026-09-03 |        27 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +139.05 |
| 2026-09-04 |         2 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +139.05 |
| 2026-09-05 |         2 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +139.05 |

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-02**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 19 | 15-4 | +50.4% | +41.54u | +2.19u | +103.0% |
| 🟢 2 | RANK 2-for-0 rescue | B | 99 | 58-41 | +13.6% | +49.59u | +0.50u | +35.7% |
| 🟢 3 | MINI- (gate-cut) | C | 20 | 12-8 | +11.8% | +3.12u | +0.16u | — |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 119 | 77-42 | +13.9% | +77.88u | sized UP after path |
| 2 | Tape HOLD (mid) | 338 | 180-158 | +4.0% | +29.24u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Tape MUTE (tape<0 → 0u) | 119 | 59-60 | -5.1% | -6.05u | 🟢 saving $ |
| 2 | fadeTop≥60 MUTE | 36 | 17-19 | +0.6% | +0.21u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 751 | 381-370 | +1.2% | +8.78u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 19 | 15-4 | 78.9% | 82.5u | +41.54u | +50.4% | +2.19u | 1 | +103.0% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 3 | +17.0% | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 99 | 58-41 | 58.6% | 363.5u | +49.59u | +13.6% | +0.50u | 8 | +35.7% | — | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 80 | 40-40 | 50.0% | 278.2u | -4.79u | -1.7% | -0.06u | 6 | +42.5% | +4.66u | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 108 | 56-52 | 51.9% | 300.3u | +0.66u | +0.2% | +0.01u | 15 | -15.7% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 95 | 55-40 | 57.9% | 244.1u | +15.37u | +6.3% | +0.16u | 12 | +0.1% | — | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 0 | — | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 23 | 12-11 | 52.2% | 23.4u | +0.89u | +3.8% | +0.04u | 0 | — | — | 🟡 flat |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 119 | 77-42 | 64.7% | 558.5u | +77.88u | +13.9% | 19 | +21.7% | +4.66u |
| Tape HOLD (mid) | TAPE | staked | 338 | 180-158 | 53.3% | 732.1u | +29.24u | +4.0% | 65 | +13.3% | +0.22u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 0 | — | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 119 | 59-60 | 49.6% | 119.0u | -6.05u | -5.1% | 48 | -11.7% | -1.96u |
| fadeTop≥60 MUTE | E | CF 1u | 36 | 17-19 | 47.2% | 36.0u | +0.21u | +0.6% | 30 | +1.2% | +4.12u |
| Score FADE (≤0 → 0u) | score | CF 1u | 751 | 381-370 | 50.7% | 751.0u | +8.78u | +1.2% | 93 | +19.5% | -4.16u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 6 / +65% | — | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 50 / +10% | 10 / +27% | — |
| SHARP | 15 / -9% | 39 / +5% | 1 / -100% |
| SHARP-LEAN | 79 / -0% | 26 / +2% | 3 / -30% |
| MINI | 44 / +2% | 10 / +45% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 14 / +10% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-02)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP EDGE/net BOTH | 1 | 1-0 | +4.66u | +86.3% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  24 | 15-4   |  78.9% |       82.50 |     +41.54 |     50.4% |
| TOP PICK (TOP+/TOP)       |  4-5u | 197 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 582 | 160-141 |  53.2% |      990.95 |     +38.85 |      3.9% |
| STRONG (MINI)             |    3u | 133 | 55-40  |  57.9% |      244.05 |     +15.37 |      6.3% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 102 | 26-22  |  54.2% |       54.85 |      +1.99 |      3.6% |
| **STAKED TOTAL** |     — | 598 | 334-264 |  55.9% |     1894.55 |    +104.19 |     +5.5% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  24 | 15-4   |  78.9% |       82.50 |     +41.54 |     50.4% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 168 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 147 | 58-41  |  58.6% |      363.45 |     +49.59 |     13.6% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 312 | 56-52  |  51.9% |      300.34 |      +0.66 |      0.2% |
| C · proven-$ consensus | SHARP       |    3u | 109 | 40-40  |  50.0% |      278.16 |      -4.79 |     -1.7% |
| A · mini-HC (gate-pass) | MINI        |    3u | 133 | 55-40  |  57.9% |      244.05 |     +15.37 |      6.3% |
| C · mini gate-cut     | MINI-       |    1u |  30 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |   8 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  64 | 12-11  |  52.2% |       23.35 |      +0.89 |      3.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 598 picks tracked at 0u (would-be 290-308, 48.5% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (17-7, +41.54u)  ·  🟢 TOP PICK (103-94, +6.44u)  ·  🟠 SHARP PLAY (291-291, +38.85u)  ·  🔴 STRONG (76-57, +15.37u)  ·  🟣 LEAN (55-47, +1.99u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02"]
    y-axis "PnL (u)" -14 --> 46
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1667 | 1654 | 1616 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 119 | 59-60 | 49.6% | 21.00u | -0.79u | -3.8% |
| HOLD      | 510 | 251-259 | 49.2% | 735.07u | +26.24u | +3.6% |
| BOOST     | 165 | 100-65 | 60.6% | 561.98u | +79.96u | +14.2% |
| FAIL_OPEN | 44 | 23-21 | 52.3% | 54.50u | -15.17u | -27.8% |
| PASS      | 778 | 401-377 | 51.5% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 550 | 290-260 | 52.7% | +8.45u |
| hold (0–2.89) | path u | 688 | 333-355 | 48.4% | +21.38u |
| boost (≥2.89) | ×1.35 | 203 | 116-87 | 57.1% | +74.31u |

_Score coverage: **1441/1616** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 119 | -4.86u | +4.86u | +81.25u | +76.39u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 121 | +59.21u | +79.96u | +20.75u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-03 | MLB | Texas Rangers | SHARP | 3.82 | BOOST | 3.00u | 0.00u | — |
| 2026-09-03 | MLB | Over 8.5 | PATH-D | -0.66 | MUTE | 1.00u | 0.00u | — |
| 2026-09-03 | MLB | Under 8.5 | PATH-D | -0.71 | MUTE | 1.00u | 0.00u | — |
| 2026-09-02 | MLB | Minnesota Twins | SHARP~ | -1.44 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-02 | MLB | New York Yankees | SHARP~ | 3.73 | BOOST | 1.00u | 0.00u | WIN |
| 2026-09-02 | MLB | Colorado Rockies | CONFIRMED-UNOPP | -0.90 | MUTE | 1.00u | 0.00u | WIN |
| 2026-09-02 | MLB | Under 8.5 | PATH-D | -0.99 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-02 | MLB | Under 9.5 | SHARP | 4.26 | BOOST | 4.00u | 5.40u | WIN |
| 2026-09-02 | MLB | Under 8.5 | HC-1 | -0.06 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-01 | MLB | Kansas City Royals | SHARP | 3.95 | BOOST | 3.00u | 0.00u | LOSS |
| 2026-09-01 | MLB | Milwaukee Brewers | SHARP~ | 3.04 | BOOST | 1.00u | 0.00u | WIN |
| 2026-09-01 | MLB | Tampa Bay Rays | SHARP~ | -0.56 | MUTE | 2.00u | 0.00u | WIN |
| 2026-09-01 | MLB | Cleveland Guardians | CONFIRMED-UNOPP | -1.11 | MUTE | 1.00u | 0.00u | WIN |
| 2026-09-01 | MLB | Washington Nationals | SHARP | 7.18 | BOOST | 4.00u | 5.40u | WIN |
| 2026-09-01 | MLB | Los Angeles Angels | SHARP~ | -0.01 | MUTE | 1.00u | 0.00u | LOSS |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.31** · nPriors=576 · source=expanding_q1 · asOf=2026-09-03 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 1221 | 1133 | 1101 | 245 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 94 | 42-52 | 44.7% | 11.00u | -3.29u | -29.9% |
| HOLD      | 262 | 134-128 | 51.1% | 282.40u | +27.18u | +9.6% |
| FAIL_OPEN | 26 | 12-14 | 46.2% | 42.90u | -3.08u | -7.2% |
| EXEMPT    | 447 | 233-214 | 52.1% | 518.10u | +43.03u | +8.3% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -69.5 … -2.7 | 45 | 15-30 | 33.3% | 0.0u | +0.00u | — |
| Q2 | -2.2 … 1.2 | 46 | 20-26 | 43.5% | 37.9u | +15.57u | +41.1% |
| Q3 | 1.2 … 5.3 | 46 | 21-25 | 45.7% | 49.5u | -1.20u | -2.4% |
| Q4 | 5.6 … 14.9 | 46 | 22-24 | 47.8% | 71.6u | -10.96u | -15.3% |
| Q5 | 16.3 … 1802.6 | 46 | 28-18 | 60.9% | 84.9u | +19.77u | +23.3% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 94 | 42-52 | -5.63u | +5.63u | +57.00u | +51.37u |

> 🟢 **Mute is saving money** (Δ +5.63u · muted WR 44.7%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 37 | 14-23 | 37.8% | 40.0u | -7.41u |
| MLB | 66 | 30-36 | 45.5% | 73.5u | -1.69u |
| NFL | 4 | 2-2 | 50.0% | 4.0u | +0.10u |
| SOC | 2 | 1-1 | 50.0% | 2.0u | +1.13u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-03 | MLB | Boston Red Sox | — | -18.2 | -1.3 | 3.00u | pending |
| 2026-09-03 | MLB | Pittsburgh Pirates | SHARP~ | -8.2 | -1.3 | 1.00u | pending |
| 2026-09-03 | MLB | Cleveland Guardians | SHARP~ | -9.8 | -1.3 | 1.00u | pending |
| 2026-09-03 | MLB | Under 9.5 | SHARP~ | -1.4 | -1.3 | 1.00u | pending |
| 2026-09-02 | MLB | Colorado Rockies | SHARP~ | -3.4 | -1.4 | 1.50u | WIN |
| 2026-09-02 | MLB | New York Yankees | SHARP~ | -69.5 | -1.4 | 1.00u | WIN |
| 2026-09-02 | MLB | Over 8.5 | SHARP~ | -12.0 | -1.4 | 1.00u | WIN |
| 2026-09-02 | MLB | Under 6.5 | CONFIRMED-UNOPP | -10.7 | -1.4 | 1.00u | LOSS |
| 2026-09-01 | MLB | Houston Astros | WATCH | -15.3 | -1.4 | 1.00u | LOSS |
| 2026-09-01 | MLB | Detroit Tigers | — | -46.3 | -1.4 | 1.00u | LOSS |
| 2026-09-01 | MLB | Milwaukee Brewers | SHARP~ | -3.5 | -1.4 | 1.00u | WIN |
| 2026-09-01 | MLB | Colorado Rockies | CONFIRMED-UNOPP | -2.0 | -1.4 | 1.00u | WIN |
| 2026-09-01 | MLB | Over 7.5 | WATCH | -5.5 | -1.4 | 1.00u | WIN |
| 2026-08-31 | MLB | Chicago White Sox | SHARP~ | -4.4 | -1.4 | 1.00u | LOSS |
| 2026-08-31 | MLB | Detroit Tigers | HC-2 | -13.9 | -1.4 | 1.00u | LOSS |
| 2026-08-31 | MLB | New York Mets | — | -67.7 | -1.4 | 1.00u | WIN |
| 2026-08-31 | MLB | Seattle Mariners | — | -19.2 | -1.4 | 1.00u | LOSS |
| 2026-08-31 | MLB | Chicago Cubs | SHARP~ | -1.5 | -1.4 | 1.00u | WIN |
| 2026-08-31 | MLB | Over 8.5 | SHARP~ | -17.1 | -1.4 | 1.00u | WIN |
| 2026-08-30 | MLB | Detroit Tigers | — | -55.8 | -1.4 | 1.50u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 79 | 43-36 | 54.4% | 243.9u | +23.18u | +9.5% |
| Muted (Q1 → 0u) | 94 | 42-52 | 44.7% | 11.0u | -3.29u | -29.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 148–80 · 64.9% · +16.7%); **5–10 is the hole** (71–70 · 50.4% · -4.9%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 717 tickets · cov 690/717 (stamp 488 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 321 | 166–155 | 51.7% | -2.3% |
| 5–10 | 141 | 71–70 | 50.4% | -4.9% |
| ≥10 | 228 | 148–80 | 64.9% | +16.7% |
| All | 717 | 397–320 | 55.4% | +5.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.9% (110) | 56.1% (66) | 71.9% (89) |
| B | 55.2% (67) | 60% (10) | 68.2% (22) |
| C | 38.5% (39) | 45.1% (51) | 58.1% (105) |

##### Jul 15+ · 506 tickets · cov 485/506 (stamp 483 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 215 | 113–102 | 52.6% | +2.9% |
| 5–10 | 102 | 48–54 | 47.1% | -10.1% |
| ≥10 | 168 | 109–59 | 64.9% | +14.6% |
| All | 506 | 279–227 | 55.1% | +6.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 49% (51) | 54.1% (37) | 75% (48) |
| B | 56.1% (41) | 40% (5) | 66.7% (15) |
| C | 38.9% (18) | 45.7% (46) | 58.9% (95) |

##### Yesterday (Sep 2) · 5 tickets · cov 5/5 (stamp 5 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 2 | 1–1 | 50.0% | -2.8% |
| 5–10 | 2 | 1–1 | 50.0% | +6.5% |
| ≥10 | 1 | 1–0 | 100.0% | +86.3% |
| All | 5 | 3–2 | 60.0% | +28.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| C | — | — | 100% (1) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 717 tickets · cov 711/717 (stamp 500 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 464 | 258–206 | 55.6% | +4.8% |
| 5–10 | 126 | 68–58 | 54.0% | +9.6% |
| ≥10 | 121 | 69–52 | 57.0% | +6.2% |
| All | 717 | 397–320 | 55.4% | +5.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 58.3% (168) | 50% (52) | 71.7% (53) |
| B | 61.1% (72) | 50% (14) | 53.8% (13) |
| C | 49.6% (117) | 61.9% (42) | 41.9% (43) |

##### Jul 15+ · 506 tickets · cov 501/506 (stamp 500 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 314 | 180–134 | 57.3% | +10.2% |
| 5–10 | 103 | 55–48 | 53.4% | +10.0% |
| ≥10 | 84 | 42–42 | 50.0% | -6.4% |
| All | 506 | 279–227 | 55.1% | +6.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 64.9% (74) | 47.2% (36) | 62.5% (32) |
| B | 59.1% (44) | 50% (10) | 57.1% (7) |
| C | 53.3% (90) | 61.5% (39) | 38.2% (34) |

##### Yesterday (Sep 2) · 5 tickets · cov 5/5 (stamp 5 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 3 | 2–1 | 66.7% | +35.8% |
| 5–10 | 2 | 1–1 | 50.0% | +19.8% |
| All | 5 | 3–2 | 60.0% | +28.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| C | — | 100% (1) | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 717 tickets · cov 690/717 (stamp 482 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 141 | 69–72 | 48.9% | -15.5% |
| 0–2.89 | 381 | 204–177 | 53.5% | +6.6% |
| ≥2.89 | 168 | 112–56 | 66.7% | +17.3% |
| All | 717 | 397–320 | 55.4% | +5.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 58.2% (153) | 75.4% (69) |
| B | 64.3% (28) | 53.7% (54) | 64.7% (17) |
| C | 18.2% (11) | 50.4% (113) | 56.3% (71) |

##### Jul 15+ · 506 tickets · cov 485/506 (stamp 482 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 72 | 41–31 | 56.9% | +6.6% |
| 0–2.89 | 290 | 150–140 | 51.7% | +2.9% |
| ≥2.89 | 123 | 79–44 | 64.2% | +13.3% |
| All | 506 | 279–227 | 55.1% | +6.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 54.2% (96) | 74.4% (39) |
| B | 66.7% (12) | 53.8% (39) | 60% (10) |
| C | — | 51.1% (94) | 55.4% (65) |

##### Yesterday (Sep 2) · 5 tickets · cov 5/5 (stamp 5 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| 0–2.89 | 4 | 2–2 | 50.0% | +1.8% |
| ≥2.89 | 1 | 1–0 | 100.0% | +86.3% |
| All | 5 | 3–2 | 60.0% | +28.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| C | — | — | 100% (1) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 506 | 279-227 | 55.1% | 1376.55u | +92.44u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 506/506 | 2.77 | 2.40 | +0.37 | 2.00 | 2.00 |
| depth   | #A sharps        | 506/506 | 1.35 | 1.38 | -0.02 | 1.00 | 1.00 |
| depth   | #F − #A          | 506/506 | 1.41 | 1.02 | +0.39 | 1.00 | 1.00 |
| depth   | proven F         | 506/506 | 1.85 | 1.73 | +0.12 | 1.00 | 1.00 |
| depth   | proven A         | 506/506 | 0.54 | 0.55 | -0.01 | 0.00 | 0.00 |
| depth   | proven F−A       | 506/506 | 1.31 | 1.19 | +0.12 | 1.00 | 1.00 |
| depth   | v12 F count      | 506/506 | 2.74 | 2.44 | +0.29 | 2.00 | 2.00 |
| depth   | v12 A count      | 506/506 | 1.46 | 1.51 | -0.05 | 1.00 | 1.00 |
| depth   | WA ForN          | 506/506 | 2.09 | 1.97 | +0.11 | 2.00 | 2.00 |
| depth   | WA AgN           | 506/506 | 1.12 | 1.24 | -0.12 | 1.00 | 1.00 |
| depth   | CLV ForN         | 505/506 | 2.50 | 2.25 | +0.25 | 2.00 | 2.00 |
| depth   | CLV AgN          | 505/506 | 1.36 | 1.43 | -0.07 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 506/506 | 0.37 | 0.36 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 483/506 | 56.75 | 54.67 | +2.08 | 54.18 | 53.50 |
| quality | AgWR             | 308/506 | 45.02 | 46.01 | -0.99 | 45.90 | 47.36 |
| quality | TopFor WR        | 483/506 | 60.89 | 58.86 | +2.02 | 57.00 | 55.70 |
| quality | TopAg WR         | 308/506 | 48.06 | 49.01 | -0.96 | 48.90 | 49.43 |
| quality | EDGE             | 483/506 | 9.79 | 7.09 | +2.70 | 7.25 | 5.21 |
| quality | ForCLV           | 500/506 | 64.82 | 64.90 | -0.08 | 65.23 | 65.46 |
| quality | AgCLV            | 335/506 | 62.65 | 61.43 | +1.22 | 63.38 | 63.29 |
| quality | netCLV           | 500/506 | 2.39 | 3.29 | -0.90 | 3.20 | 3.06 |
| quality | Tape             | 482/506 | 2.31 | 1.91 | +0.40 | 1.72 | 1.44 |
| quality | V12 score        | 506/506 | 0.83 | 0.81 | +0.03 | 0.96 | 0.95 |
| quality | V12 forMean      | 506/506 | 27.26 | 22.46 | +4.80 | 18.68 | 15.57 |
| quality | V12 agMean       | 506/506 | 2.51 | 2.36 | +0.15 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 483/506 | 0.561 | -0.002 | +0.124 | +2.70 | 🟡 mild OK |
|    2 | TopFor WR        | quality | 483/506 | 0.547 | +0.140 | +0.098 | +2.02 | 🟡 mild OK |
|    3 | V12 forMean      | quality | 506/506 | 0.546 | +0.149 | +0.091 | +4.80 | 🟡 mild OK |
|    4 | V12 score        | quality | 506/506 | 0.540 | -0.003 | +0.052 | +0.03 | 🟡 mild OK |
|    5 | AgWR             | quality | 308/506 | 0.460 | +0.092 | -0.076 | -0.99 | flat |
|    6 | ForWR            | quality | 483/506 | 0.540 | +0.007 | +0.110 | +2.08 | flat |
|    7 | Tape             | quality | 482/506 | 0.539 | -0.066 | +0.068 | +0.40 | flat |
|    8 | V12 agMean       | quality | 506/506 | 0.464 | +0.348 | +0.012 | +0.15 | flat |
|    9 | AgCLV            | quality | 335/506 | 0.535 | -0.051 | +0.078 | +1.22 | flat |
|   10 | CLV ForN         | depth   | 505/506 | 0.525 | +0.286 | +0.073 | +0.25 | flat |
|   11 | #F sharps        | depth   | 506/506 | 0.524 | +0.298 | +0.088 | +0.37 | flat |
|   12 | netCLV           | quality | 500/506 | 0.480 | -0.092 | -0.038 | -0.90 | flat |
|   13 | TopAg WR         | quality | 308/506 | 0.482 | +0.044 | -0.059 | -0.96 | flat |
|   14 | WA AgN           | depth   | 506/506 | 0.482 | +0.177 | -0.043 | -0.12 | flat |
|   15 | v12 F count      | depth   | 506/506 | 0.517 | +0.302 | +0.072 | +0.29 | flat |
|   16 | #F − #A          | depth   | 506/506 | 0.516 | +0.228 | +0.084 | +0.39 | flat |
|   17 | ForCLV           | quality | 500/506 | 0.486 | -0.147 | -0.004 | -0.08 | flat |
|   18 | proven A         | depth   | 506/506 | 0.488 | +0.315 | -0.003 | -0.01 | flat |
|   19 | WA ForN          | depth   | 506/506 | 0.493 | +0.286 | +0.036 | +0.11 | flat |
|   20 | unopposed (A=0)  | depth   | 506/506 | 0.507 | +0.254 | +0.016 | +0.02 | flat |
|   21 | proven F−A       | depth   | 506/506 | 0.507 | +0.288 | +0.049 | +0.12 | flat |
|   22 | CLV AgN          | depth   | 505/506 | 0.498 | +0.163 | -0.024 | -0.07 | flat |
|   23 | v12 A count      | depth   | 506/506 | 0.498 | +0.170 | -0.016 | -0.05 | flat |
|   24 | proven F         | depth   | 506/506 | 0.501 | +0.357 | +0.047 | +0.12 | flat |
|   25 | #A sharps        | depth   | 506/506 | 0.501 | +0.166 | -0.007 | -0.02 | flat |

### (C) Working read

_N=506 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.561 · Δ +2.70 · higher on WINs (cov 483/506)
- **TopFor WR** — AUC 0.547 · Δ +2.02 · higher on WINs (cov 483/506)
- **V12 forMean** — AUC 0.546 · Δ +4.80 · higher on WINs (cov 506/506)
- **V12 score** — AUC 0.540 · Δ +0.03 · higher on WINs (cov 506/506)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1000 | 205 | 205 | 201 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 29 | 17-12 | 58.6% | 83.00u | +16.44u | +19.8% | -0.5 |
| on→off | 10 | 4-6 | 40.0% | 32.20u | -6.86u | -21.3% | -2.7 |
| off→on | 26 | 19-7 | 73.1% | 64.30u | +30.55u | +47.5% | +2.7 |
| off→off | 136 | 72-64 | 52.9% | 343.30u | -5.45u | -1.6% | -0.6 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 129 | 67-62 | 51.9% | 374.80u | -0.10u | -0.0% |
| 0–2 | 48 | 29-19 | 60.4% | 109.10u | +28.16u | +25.8% |
| 2–4 | 10 | 8-2 | 80.0% | 22.40u | +8.42u | +37.6% |
| 4+ | 14 | 8-6 | 57.1% | 16.50u | -1.80u | -10.9% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 2 | 2-0 | 100.0% | 4.00u | +2.41u | +60.3% |
| gold, limits flat | 6 | 4-2 | 66.7% | 17.30u | +12.32u | +71.2% |
| steam, not gold | 47 | 30-17 | 63.8% | 126.00u | +32.26u | +25.6% |
| limits↑, no steam | 5 | 2-3 | 40.0% | 12.40u | +0.37u | +3.0% |
| neither | 141 | 74-67 | 52.5% | 363.10u | -12.68u | -3.5% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 50 | 34-16 | 68.0% | 139.30u | +48.04u | +34.5% |
| A/B + no steam | 133 | 72-61 | 54.1% | 331.70u | +8.65u | +2.6% |
| A/B + steam arriving | 25 | 19-6 | 76.0% | 63.30u | +31.55u | +49.8% |
| A/B + gold | 7 | 5-2 | 71.4% | 18.30u | +13.30u | +72.7% |
| steam at lock, no A/B | 5 | 2-3 | 40.0% | 8.00u | -1.05u | -13.1% |
| Source B + steam arriving | 25 | 19-6 | 76.0% | 63.30u | +31.55u | +49.8% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 386n · 53.4% · +4.7%   | 94n · 55.3% · +1.3%    | 280n · 51.4% · +3.4%   | 760n · 52.9% · +3.8%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 10n · 60.0% · +7.9%    | 3n · 66.7% · -28.0%    | 2n · 50.0% · -5.4%     | 15n · 60.0% · -0.8%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 50n · 72.0% · +24.4%   | —                      | —                      | 50n · 72.0% · +24.4%   |
| UFC   | 33n · 75.8% · +15.3%   | —                      | —                      | 33n · 75.8% · +15.3%   |
| WNBA  | 27n · 74.1% · +3.2%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 61n · 57.4% · -0.5%    |
| **All** | **513n · 57.5% · +7.8%** | **120n · 54.2% · +2.5%** | **302n · 51.3% · +3.0%** | **935n · 55.1% · +5.4%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1380** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1380 |
| Muted W-L                           |              673-707 |
| Muted Win %                         |                48.8% |
| Counterfactual PnL at flat 1u       |               -73.60 |
| Counterfactual ROI at flat 1u       |                -5.3% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-73.60u** at a flat 1u stake — a counterfactual ROI of **-5.3%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-09-02 | MLB   | TOTAL  | Under 8.5               |  -106 | +0.597 | CONFIRMED-Q1 |  11/3 |   7/2 |  53.7 |   61.5 |   +3.2 |  1.17 | HOLD     | 3.00u | WIN     |      +2.83 |
| 2026-09-02 | MLB   | TOTAL  | Under 9.5               |  -116 | +0.121 | SHARP    |   6/3 |   6/1 |  57.2 |   56.5 |  +16.0 |  4.26 | BOOST    | 5.40u | WIN     |      +4.66 |
| 2026-09-02 | MLB   | TOTAL  | Under 9.5               |  -106 | +0.448 | CONFIRMED-Q1 |   8/6 |   7/5 |  55.6 |   62.3 |   +2.9 |  1.50 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-02 | MLB   | TOTAL  | Under 7.5               |  +118 | +0.971 | CONFIRMED-Q1 |   2/0 |   2/0 |  55.1 |   64.3 |   +5.1 |  1.37 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-02 | MLB   | TOTAL  | Over 7.5                |  +113 | +0.972 | CONFIRMED-Q1 |   2/0 |   2/0 |  55.1 |   64.3 |   +5.1 |  1.37 | HOLD     | 3.00u | WIN     |      +3.39 |
| 2026-09-01 | MLB   | ML     | Cincinnati Reds         |  +128 | +0.262 | CONFIRMED-Q1 |   6/7 |   5/5 |  57.1 |   60.8 |   +2.2 |  2.44 | HOLD     | 2.50u | WIN     |      +3.20 |
| 2026-09-01 | MLB   | SPREAD | Washington Nationals    |  -116 | +0.885 | SHARP    |   1/0 |   1/0 |  73.5 |   78.6 |  +23.5 |  7.18 | BOOST    | 5.40u | WIN     |      +4.66 |
| 2026-09-01 | MLB   | TOTAL  | Over 8.5                |  -108 | +0.983 | 2-for-0  |   2/2 |   2/0 |  52.8 |   55.7 |   +6.1 | -0.98 | HOLD     | 3.00u | WIN     |      +2.78 |
| 2026-09-01 | MLB   | TOTAL  | Over 7.5                |  +103 | +0.939 | HC-2     |   3/1 |   2/1 |  63.6 |   51.4 |  +12.5 |  1.79 | HOLD     | 6.00u | WIN     |      +6.18 |
| 2026-08-31 | MLB   | ML     | Baltimore Orioles       |  -118 | +0.963 | MINI     |   5/1 |   5/0 |  56.0 |   50.5 |   +8.4 |  1.77 | HOLD     | 3.00u | WIN     |      +2.54 |
| 2026-08-31 | MLB   | ML     | Arizona Diamondbacks    |  +100 | +0.236 | CONFIRMED-Q1 |   5/3 |   4/2 |  51.3 |   60.2 |   -5.4 |  1.88 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-31 | SOC   | ML     | Arsenal FC              |  -188 | +0.985 | CONFIRMED-Q1 |  23/1 |  11/0 |  48.6 |   50.5 |   -1.4 | -2.00 | MUTE     | 3.00u | WIN     |      +1.60 |
| 2026-08-31 | SOC   | ML     | FC Barcelona            |  -752 | +0.553 | CONFIRMED-Q1 |   8/4 |   6/4 |  52.6 |   51.8 |   +0.0 |  0.85 | HOLD     | 3.00u | WIN     |      +0.40 |
| 2026-08-31 | MLB   | TOTAL  | Under 9.5               |  -125 | +0.984 | 2-for-0  |   2/0 |   2/0 |  51.3 |   52.6 |   +1.3 | -1.14 | HOLD     | 1.50u | WIN     |      +1.20 |
| 2026-08-30 | MLB   | ML     | Baltimore Orioles       |  -144 | +0.961 | CONFIRMED-Q1 |   1/0 |   1/0 |  68.6 |   20.0 |  +18.6 | -2.58 | HOLD     | 4.00u | WIN     |      +2.78 |
| 2026-08-30 | MLB   | ML     | Chicago Cubs            |  -150 | +0.517 | CONFIRMED-Q1 |   3/4 |   3/4 |  56.1 |   58.9 |   +6.6 |  1.50 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-30 | MLB   | ML     | New York Mets           |  -117 | +0.952 | CONFIRMED-Q1 |   2/1 |   2/0 |  62.6 |   42.0 |  +14.3 | -0.62 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-30 | MLB   | ML     | Cleveland Guardians     |  -178 | +0.933 | CONFIRMED-Q1 |   2/0 |   2/0 |  59.2 |   41.3 |   +9.2 | -1.26 | MUTE     | 3.00u | WIN     |      +1.69 |
| 2026-08-30 | MLB   | ML     | Los Angeles Dodgers     |  -163 | +0.497 | CONFIRMED-Q1 |   3/2 |   2/1 |  56.2 |   51.3 |   -7.7 | -4.77 | HOLD     | 3.00u | WIN     |      +1.84 |
| 2026-08-30 | MLB   | ML     | Philadelphia Phillies   |  -158 | +0.615 | CONFIRMED-Q1 |   5/1 |   2/1 |  53.4 |   51.8 |   +0.3 | -0.89 | HOLD     | 3.00u | WIN     |      +1.90 |
| 2026-08-30 | MLB   | ML     | Tampa Bay Rays          |  -150 | +0.950 | CONFIRMED-Q1 |   1/0 |   1/0 |  68.6 |   20.0 |  +18.6 | -2.58 | HOLD     | 4.00u | WIN     |      +2.67 |
| 2026-08-30 | SOC   | ML     | RC Celta de Vigo        |  +167 | +0.980 | CONFIRMED-Q1 |   3/1 |   1/0 |  44.4 |   52.6 |   -5.6 | -2.52 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-08-30 | SOC   | ML     | Manchester United FC    |  -275 | +0.591 | CONFIRMED-Q1 |   7/3 |   3/1 |  49.5 |   47.7 |   -0.5 | -4.94 | HOLD     | 3.00u | WIN     |      +1.09 |
| 2026-08-30 | WNBA  | ML     | Golden State Valkyries  |  -197 | +0.971 | 2-for-0  |   2/1 |   1/0 |  67.9 |   58.3 |  +32.8 |  6.04 | BOOST    | 6.00u | WIN     |      +3.05 |
| 2026-08-30 | MLB   | SPREAD | Chicago Cubs            |  +142 | +0.963 | CONFIRMED-UNOPP |   4/2 |   1/0 |  48.2 |   65.1 |   -1.3 | -0.02 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-30 | MLB   | TOTAL  | Over 10.5               |  +115 | +0.967 | CONFIRMED-UNOPP |   3/0 |   2/0 |  41.4 |   49.3 |   -8.6 | -3.63 | HOLD     | 1.00u | WIN     |      +1.15 |
| 2026-08-30 | MLB   | TOTAL  | Under 8.5               |  +133 | +0.401 | CONFIRMED-Q1 |   5/4 |   3/2 |  47.6 |   41.4 |   -2.4 | -3.37 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-30 | MLB   | TOTAL  | Over 8.5                |  +104 | +0.982 | CONFIRMED-UNOPP |   4/0 |   2/0 |  43.8 |   57.4 |   -6.2 | -1.94 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-30 | MLB   | TOTAL  | Under 8.5               |  +117 | +0.958 | CONFIRMED-UNOPP |   2/0 |   2/0 |  49.2 |   48.0 |   -0.8 | -2.25 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-30 | MLB   | TOTAL  | Under 7.5               |  -108 | +0.931 | CONFIRMED-Q1 |   1/0 |   1/0 |  68.6 |   20.0 |  +18.6 | -2.58 | HOLD     | 4.00u | LOSS    |      -4.00 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.532 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.060 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.018 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.012 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.038 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  930 |    +0.0826 |    -0.0539 | 0.0004 |  +0.021 |   0.946 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  930 |    +0.0802 |    +0.4830 | 0.0015 |  +0.039 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  930 |    -0.2002 |    +0.3152 | 0.0003 |  -0.017 |   2.831 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 930 |          +0.075 |           +0.040 |                   +0.041 |                   +0.013 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 930 |          -0.003 |           +0.318 |                   +0.008 |                   +0.114 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 930 |          +0.039 |           +0.210 |                   +0.016 |                   +0.054 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 930 |          -0.019 |           +0.173 |                   +0.010 |                   +0.101 | count of contributing AGAINST-side wallets                     |
| provenFor         | 930 |          +0.029 |           +0.190 |                   +0.018 |                   +0.078 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 930 |          -0.000 |           +0.136 |                   +0.016 |                   +0.067 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 3.834          | 310 | 168-142 |   54.2% |     +0.8% |
| MID (p33–p67)     | 19.950 … 17.250        | 310 | 165-145 |   53.2% |     -0.5% |
| HIGH (> p67)      | 48.906 … 37.204        | 310 | 179-131 |   57.7% |     +1.3% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       930 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8427 | average score across live picks                                 |
| SD                |    0.2392 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.937 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +2.674 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.436 / +0.959 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  756 | 400-356 |   52.9% |     +3.7% |  0.513 |        -0.075 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   15 | 9-6    |   60.0% |     -0.8% |  0.630 |        -0.104 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   49 | 35-14  |   71.4% |    +24.2% |  0.565 |        +0.066 | real                                      |
| UFC   |   33 | 25-8   |   75.8% |    +15.3% |  0.615 |        +0.134 | strong                                    |
| WNBA  |   61 | 35-26  |   57.4% |     -0.5% |  0.548 |        +0.051 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.543, 0.537, 0.521, 0.537, 0.536, 0.539, 0.515, 0.538, 0.599, 0.596, 0.581, 0.594, 0.619, 0.586]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02"]
    y-axis "edge (pp)" -4 --> 5
    line [-2.5, -2.5, -1.8, -1.2, -0.9, -2.3, -0.6, 3, -1.2, -0.5, -0.2, 0.3, 3.3, 2.4]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-20 |    7 |  111 | 55-56  |   49.5% |     +6.2% |  0.543 |      -2.5pp |
| 2026-08-21 |    7 |  119 | 59-60  |   49.6% |     +0.5% |  0.537 |      -2.5pp |
| 2026-08-22 |    7 |  114 | 58-56  |   50.9% |     +3.9% |  0.521 |      -1.8pp |
| 2026-08-23 |    7 |  121 | 63-58  |   52.1% |     +7.8% |  0.537 |      -1.2pp |
| 2026-08-24 |    7 |  120 | 64-56  |   53.3% |     +3.9% |  0.536 |      -0.9pp |
| 2026-08-25 |    7 |  111 | 58-53  |   52.3% |     -0.2% |  0.539 |      -2.3pp |
| 2026-08-26 |    7 |  114 | 62-52  |   54.4% |     +3.8% |  0.515 |      -0.6pp |
| 2026-08-27 |    7 |  111 | 65-46  |   58.6% |     +9.8% |  0.538 |      +3.0pp |
| 2026-08-28 |    7 |  115 | 64-51  |   55.7% |     +1.0% |  0.599 |      -1.2pp |
| 2026-08-29 |    7 |  108 | 60-48  |   55.6% |     +2.8% |  0.596 |      -0.5pp |
| 2026-08-30 |    7 |  106 | 59-47  |   55.7% |     +1.2% |  0.581 |      -0.2pp |
| 2026-08-31 |    7 |   99 | 56-43  |   56.6% |     +3.4% |  0.594 |      +0.3pp |
| 2026-09-01 |    7 |   88 | 53-35  |   60.2% |    +14.4% |  0.619 |      +3.3pp |
| 2026-09-02 |    7 |   77 | 46-31  |   59.7% |    +12.0% |  0.586 |      +2.4pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.527 avg in first half → 0.533 avg in second half · Δ = +0.006)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.4% | [-1.3%, +12.0%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.1% | [52.0%, 58.2%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.532 | [0.491, 0.567]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             95 | [38, 152]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       935 |
| Unique wallets ever on a FOR side            |                                                       273 |
| Avg FOR-side wallets per pick                |                                                      2.84 |
| Top-5 wallets' share of all FOR appearances  |                                                     22.3% |
| Top-10 wallets' share of all FOR appearances |                                                     38.4% |
| Top-20 wallets' share of all FOR appearances |                                                     54.1% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  153 |   21 | 83-70  |   54.2% |    +12.6% |    +53.70 |     1.60× | CONFIRMED   |     -2.3% |     360 | 2026-08-30 |
|    2 | 4b912c  | MLB,NFL,SOC,WNBA |  151 |   49 | 79-72  |   52.3% |     +6.6% |    +22.96 |     1.52× | CONFIRMED   |     -6.1% |     462 | 2026-09-02 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.7% |     335 | 2026-08-05 |
|    6 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   92 |   47 | 50-42  |   54.3% |    +14.5% |    +37.70 |     1.08× | CONFIRMED   |     +8.3% |     540 | 2026-09-02 |
|    7 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   91 |   63 | 43-48  |   47.3% |     -3.6% |     -9.32 |     1.24× | CONFIRMED   |     +1.1% |     450 | 2026-09-02 |
|    8 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   84 |   60 | 47-37  |   56.0% |    +13.9% |    +29.24 |     0.48× | CONFIRMED   |    +12.9% |     376 | 2026-08-30 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   82 |   32 | 44-38  |   53.7% |     -4.6% |    -10.05 |     2.03× | CONFIRMED   |     -7.5% |     288 | 2026-08-30 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   55 |   16 | 33-22  |   60.0% |    +27.8% |    +37.84 |     0.83× | CONFIRMED   |     +9.3% |     225 | 2026-08-29 |
|   12 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   50 |   61 | 24-26  |   48.0% |     -6.4% |     -9.12 |     4.00× | CONFIRMED   |     -6.5% |     288 | 2026-09-02 |
|   13 | 705ba1  | MLB        |   50 |   28 | 23-27  |   46.0% |     -5.9% |     -8.08 |     1.17× | CONFIRMED   |     +4.8% |     237 | 2026-09-02 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   45 |   25 | 22-23  |   48.9% |     +3.9% |     +4.95 |     1.16× | CONFIRMED   |     -6.4% |     197 | 2026-09-01 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   43 |   11 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +7.9% |     115 | 2026-08-28 |
|   16 | 3bdd7e  | MLB,NFL,SOC,WNBA |   42 |   13 | 25-17  |   59.5% |    +11.4% |     +9.11 |     2.97× | CONFIRMED   |     -2.0% |     134 | 2026-08-28 |
|   17 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.8% |     148 | 2026-09-02 |
|   18 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   19 | 69f882  | MLB,SOC,UFC,WNBA |   33 |   15 | 24-9   |   72.7% |    +18.8% |    +17.80 |     3.42× | CONFIRMED   |    +13.4% |     109 | 2026-09-02 |
|   20 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | d66e28  | MLB,WNBA   |   15 | 12-3   |   80.0% |     +65.9% |    +24.58 |     0.71× | 2026-09-02 |
|    2 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    3 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    4 | 2cbcf8  | MLB,UFC    |   14 | 10-4   |   71.4% |     +43.5% |    +22.77 |     1.13× | 2026-09-02 |
|    5 | 487b8b  | MLB,NFL,SOC,UFC,WNBA |   11 | 9-2    |   81.8% |     +41.0% |    +16.08 |     1.22× | 2026-08-30 |
|    6 | df8add  | MLB,SOC    |   10 | 7-3    |   70.0% |     +37.6% |     +6.20 |     1.73× | 2026-08-31 |
|    7 | e8e2cc  | MLB,NFL,WNBA |   12 | 9-3    |   75.0% |     +36.5% |    +13.07 |     0.82× | 2026-09-02 |
|    8 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    9 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   10 | aa894c  | MLB        |   10 | 6-4    |   60.0% |     +32.3% |     +6.75 |     0.70× | 2026-09-02 |
|   11 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   12 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   20 | 15-5   |   75.0% |     +29.6% |    +15.06 |     3.99× | 2026-08-31 |
|   13 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   14 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|   15 | 7923c4  | MLB,NBA,UFC |   55 | 33-22  |   60.0% |     +27.8% |    +37.84 |     0.83× | 2026-08-29 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    3 | 2a8409  | MLB,WNBA   |   15 | 5-10   |   33.3% |     -27.7% |     -7.75 |     1.35× | 2026-09-02 |
|    4 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    5 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    6 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    7 | c9bba3  | MLB,NFL,SOC |   18 | 11-7   |   61.1% |      -8.7% |     -3.39 |     0.77× | 2026-08-29 |
|    8 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   50 | 24-26  |   48.0% |      -6.4% |     -9.12 |     4.00× | 2026-09-02 |
|    9 | 705ba1  | MLB        |   50 | 23-27  |   46.0% |      -5.9% |     -8.08 |     1.17× | 2026-09-02 |
|   10 | 2f2a9e  | MLB,SOC,WNBA |   82 | 44-38  |   53.7% |      -4.6% |    -10.05 |     2.03× | 2026-08-30 |
|   11 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   91 | 43-48  |   47.3% |      -3.6% |     -9.32 |     1.24× | 2026-09-02 |
|   12 | 9214c2  | MLB        |   17 | 6-11   |   35.3% |      -3.4% |     -1.25 |     0.89× | 2026-09-02 |
|   13 | 7d395d  | MLB,UFC,WNBA |   16 | 8-8    |   50.0% |      -3.4% |     -1.14 |     1.71× | 2026-09-02 |
|   14 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 | 20-17  |   54.1% |      -1.6% |     -1.88 |     1.36× | 2026-09-02 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `7da3d5` (FOR# 50, ROI -6.4%), `705ba1` (FOR# 50, ROI -5.9%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  2005 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   529 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     4 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    75 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |    11 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   373 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            301 |        78 |   30 |   17 |  176 |                    125 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            282 |        80 |   39 |   15 |  148 |                    134 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   95 |    935 | 1380 | 515-420 |  55.1% |      5.4% |    +139.05 |    +0.15 | 0.510 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  875 |    +1.7pp |    +14.4pp |          +0.322 |   -0.039 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  873 |    +6.7pp |    +24.2pp |          +0.462 |   +0.116 |    +0.0306 | 🟢 better |
| v12 − v11          | +  824 |    +0.1pp |     +2.6pp |          +0.088 |   +0.066 |    +0.0144 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 760n 52.9% +4% | 10n 30.0% +29% | 15n 60.0% -1%  | 6n 83.3% +38%  | 50n 72.0% +24% | 33n 75.8% +15% | 61n 57.4% -0%  | 935n 55.1% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 179n +3%      | 260n +4%      | 210n +8%      | 124n +2%      | 157n +12%     | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2597 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1169 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 930 / 1169 (80%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 930 / 1169 (80%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 930 / 1169 (80%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 930 / 1169 (80%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 930 / 1169 (80%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 930 / 1169 (80%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 930 / 1169 (80%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1169 / 1169 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1169 / 1169 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1169 / 1169 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1169 / 1169 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1169 / 1169 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1169 / 1169 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1162 / 1169 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1160 / 1169 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1169 / 1169 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1168 / 1169 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 723 / 1169 (62%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1168 / 1169 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 723 / 1169 (62%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 722 / 1169 (62%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1169 / 1169 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1169 / 1169 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1169 / 1169 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1168 / 1169 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1169 / 1169 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 723 |      |    +0.022 |    +0.259 |      +0.049 |      +0.126 |  0.520 |
|    2 | V12 forMean          | 930 |  🟢  |    +0.075 |    +0.040 |      +0.041 |      +0.013 |  0.531 |
|    3 | wd sizeMargin        | 722 |      |    -0.012 |    -0.009 |      -0.041 |      -0.061 |  0.498 |
|    4 | qMargin              | 930 |  🟢  |    +0.078 |    +0.015 |      +0.040 |      -0.002 |  0.530 |
|    5 | wd agAvgSize         | 723 |      |    +0.016 |    +0.005 |      +0.038 |      +0.034 |  0.502 |
|    6 | wd maxForContrib     | 1168 |      |    -0.042 |    -0.109 |      -0.036 |      -0.050 |  0.489 |
|    7 | wd contribMargin     | 1169 |      |    -0.006 |    -0.101 |      -0.033 |      -0.091 |  0.481 |
|    8 | lockPinnProb         | 1162 |      |    +0.198 |    +0.180 |      +0.033 |      -0.120 |  0.607 |
|    9 | clv                  | 1160 |      |    -0.028 |    +0.062 |      -0.026 |      +0.019 |  0.516 |
|   10 | agsV12               | 930 |  🟢  |    +0.039 |    -0.018 |      +0.021 |      -0.012 |  0.532 |
|   11 | hcMargin             | 1169 |      |    +0.008 |    +0.225 |      -0.020 |      +0.060 |  0.512 |
|   12 | wd contribFor        | 1169 |      |    -0.009 |    -0.063 |      -0.019 |      -0.051 |  0.487 |
|   13 | wd contribAg         | 1169 |      |    -0.006 |    +0.123 |      +0.016 |      +0.056 |  0.496 |
|   14 | V12 forCount         | 930 |  🟢  |    +0.039 |    +0.210 |      +0.016 |      +0.054 |  0.516 |
|   15 | wd forAvgSize        | 1168 |      |    +0.006 |    +0.049 |      -0.014 |      -0.004 |  0.515 |
|   16 | wd maxShare          | 1169 |      |    +0.014 |    -0.055 |      +0.012 |      -0.009 |  0.506 |
|   17 | ags (v11)            | 1169 |      |    +0.012 |    +0.083 |      -0.012 |      -0.006 |  0.518 |
|   18 | V12 agCount          | 930 |  🟢  |    -0.019 |    +0.173 |      +0.010 |      +0.101 |  0.504 |
|   19 | countMargin          | 930 |      |    +0.052 |    +0.132 |      +0.009 |      -0.002 |  0.511 |
|   20 | V12 agMean           | 930 |  🟢  |    -0.003 |    +0.318 |      +0.008 |      +0.114 |  0.475 |
|   21 | provenFor            | 1169 |      |    -0.001 |    +0.082 |      -0.008 |      +0.001 |  0.497 |
|   22 | provenMargin         | 1169 |      |    +0.012 |    +0.105 |      -0.007 |      +0.008 |  0.500 |
|   23 | provenTotal          | 1169 |      |    -0.008 |    +0.032 |      -0.007 |      -0.000 |  0.496 |
|   24 | peakStars            | 1169 |      |    +0.017 |    +0.061 |      -0.005 |      -0.014 |  0.506 |
|   25 | wd forCount          | 1168 |      |    +0.022 |    +0.139 |      +0.005 |      +0.012 |  0.498 |
|   26 | provenAg             | 1169 |      |    -0.016 |    +0.151 |      -0.003 |      +0.064 |  0.494 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.049), `V12 forMean` (r = +0.041), `wd sizeMargin` (r = -0.041).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.049 · AUC = 0.520

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 347 | 184-163 |   53.0% |     -1.0% |
| MID (p33–p67)     | 2.000 … 2.000            | 173 | 90-83   |   52.0% |     -1.5% |
| HIGH (> p67)      | 3.000 … 6.000            | 203 | 118-85  |   58.1% |     +3.6% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.041 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 3.834            | 310 | 168-142 |   54.2% |     +0.8% |
| MID (p33–p67)     | 19.950 … 17.250          | 310 | 165-145 |   53.2% |     -0.5% |
| HIGH (> p67)      | 48.906 … 37.204          | 310 | 179-131 |   57.7% |     +1.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd sizeMargin` · r(unit-ret) = -0.041 · AUC = 0.498

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.436          | 241 | 135-106 |   56.0% |     +2.2% |
| MID (p33–p67)     | 0.078 … 0.002            | 240 | 124-116 |   51.7% |     -0.3% |
| HIGH (> p67)      | 3.728 … 0.903            | 241 | 133-108 |   55.2% |     -1.3% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `qMargin` · r(unit-ret) = +0.040 · AUC = 0.530

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.369            | 310 | 168-142 |   54.2% |     +0.7% |
| MID (p33–p67)     | 19.950 … 17.250          | 310 | 168-142 |   54.2% |     +0.5% |
| HIGH (> p67)      | 46.556 … 27.840          | 310 | 176-134 |   56.8% |     +0.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd agAvgSize` · r(unit-ret) = +0.038 · AUC = 0.502

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.110 … 0.219            | 241 | 128-113 |   53.1% |     -2.0% |
| MID (p33–p67)     | 0.699 … 0.912            | 241 | 129-112 |   53.5% |     -0.5% |
| HIGH (> p67)      | 6.557 … 1.603            | 241 | 135-106 |   56.0% |     +2.9% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | V12 forMean    | wd sizeMargin  | qMargin        | wd agAvgSize   | wd maxForContrib | wd contribMargin | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.135 |         +0.028 |         +0.024 |         +0.104 |         +0.301 |         -0.140 |         -0.063 |
| V12 forMean |         +0.135 |  1.000         |         +0.221 |         +0.956 |         -0.025 |         +0.203 |         +0.089 |         +0.126 |
| wd sizeMargin |         +0.028 |         +0.221 |  1.000         |         +0.204 |         -0.754 |         +0.267 |         +0.273 |         +0.155 |
| qMargin     |         +0.024 |         +0.956 |         +0.204 |  1.000         |         -0.042 |         +0.160 |         +0.073 |         +0.136 |
| wd agAvgSize |         +0.104 |         -0.025 |         -0.754 |         -0.042 |  1.000         |         +0.049 |         -0.150 |         -0.098 |
| wd maxForContrib |         +0.301 |         +0.203 |         +0.267 |         +0.160 |         +0.049 |  1.000         |         +0.510 |         +0.041 |
| wd contribMargin |         -0.140 |         +0.089 |         +0.273 |         +0.073 |         -0.150 |         +0.510 |  1.000         |         +0.193 |
| lockPinnProb |         -0.063 |         +0.126 |         +0.155 |         +0.136 |         -0.098 |         +0.041 |         +0.193 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.956. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 602 picks · features = 8 (+ intercept) · multiple R² = **0.0108** · adjusted R² = **-0.0042** · residual sd = 0.951

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.0820 |   0.1442 | +0.57        |        1 |
|    2 | wd agCount           |     |    +0.0547 |   0.0469 | +1.17        |        2 |
|    3 | wd agAvgSize         |     |    +0.0358 |   0.0661 | +0.54        |        3 |
|    4 | V12 forMean          |  🟢 |    -0.0237 |   0.1464 | -0.16        |        4 |
|    5 | wd sizeMargin        |     |    -0.0205 |   0.0693 | -0.30        |        5 |
|    6 | wd contribMargin     |     |    -0.0195 |   0.0503 | -0.39        |        6 |
|    7 | lockPinnProb         |     |    +0.0112 |   0.0402 | +0.28        |        7 |
|    8 | wd maxForContrib     |     |    -0.0067 |   0.0547 | -0.12        |        8 |
| —    | (intercept)          |     |    +0.0219 |   0.0388 |    +0.56 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.082), `V12 forMean` (β = -0.024)
- V12 IGNORES: `wd agCount` (β = +0.055, t = +1.17), `wd agAvgSize` (β = +0.036, t = +0.54), `wd sizeMargin` (β = -0.020, t = -0.30), `wd contribMargin` (β = -0.020, t = -0.39), `lockPinnProb` (β = +0.011, t = +0.28), `wd maxForContrib` (β = -0.007, t = -0.12)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.539 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.566 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.026.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Adjusted R² of -0.0042 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*