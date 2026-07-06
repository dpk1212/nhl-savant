# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 7/6/2026, 12:00:03 PM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 1310 | 50.5% | +Infinity% | +Infinityu |
| SHADOW | 603 | 48.4% | +Infinity% | +Infinityu |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 1918 | 49.8% | +Infinity% | +Infinityu |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=231 · 46% · -10% · -24.2u | N=253 · 54% · +2% · +4.3u | N=81 · 42% · -17% · -13.7u | N=745 · 52% · +Infinity% · +Infinityu | **N=1310 · 50% · +Infinity% · +Infinityu** |
| **SHADOW** | N=97 · 38% · +Infinity% · +Infinityu | N=79 · 53% · -1% · -1.0u | N=63 · 48% · -8% · -4.9u | N=364 · 50% · +Infinity% · +Infinityu | **N=603 · 48% · +Infinity% · +Infinityu** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=329 · 44% · +Infinity% · +Infinityu | N=332 · 54% · +1% · +3.3u | N=144 · 44% · -13% · -18.6u | N=1113 · 51% · +Infinity% · +Infinityu | **N=1918 · 50% · +Infinity% · +Infinityu** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 98 | 38.8% | +Infinity% | +Infinityu |
| maxRoi★ only | 79 | 53.2% | -1.3% | -0.99u |
| meanBase★ only | 63 | 47.6% | -7.8% | -4.93u |
| neither | 368 | 50.3% | +Infinity% | +Infinityu |
| **pool total** | 608 | 48.5% | +Infinity% | +Infinityu |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 240 | 45.8% | +Infinity% | +Infinityu |
| filter drops | 368 | 50.3% | +Infinity% | +Infinityu |


---
## 2. Counterfactual — what if we promoted every non-LOCKED pick that hit the filter?

Column **Prod** = our actual LOCKED book as of each date. Column **Prod + elite-path** = Prod *plus* every non-LOCKED side that hit `maxRoiN_F ≥ 70` OR `meanBase_F ≥ 55`. Column **Delta** shows what the new promotion path adds (or removes) on top.

| Date | Prod N · WR · ROI · PnL | Prod+elite N · WR · ROI · PnL | Δ picks | Δ PnL |
|---|---|---|---|---|
| 2026-04-18 | N=12 · 50% · -11% · -1.35u | N=12 · 50% · -11% · -1.35u | +0 | +0.00u |
| 2026-04-19 | N=8 · 63% · +37% · +2.97u | N=9 · 56% · +22% · +1.97u | +1 | -1.00u |
| 2026-04-20 | N=16 · 50% · -2% · -0.38u | N=17 · 53% · +2% · +0.30u | +1 | +0.68u |
| 2026-04-21 | N=17 · 29% · -18% · -3.04u | N=17 · 29% · -18% · -3.04u | +0 | +0.00u |
| 2026-04-22 | N=11 · 55% · -7% · -0.79u | N=12 · 58% · +2% · +0.26u | +1 | +1.05u |
| 2026-04-23 | N=12 · 33% · -33% · -3.91u | N=12 · 33% · -33% · -3.91u | +0 | +0.00u |
| 2026-04-24 | N=10 · 60% · +13% · +1.28u | N=10 · 60% · +13% · +1.28u | +0 | +0.00u |
| 2026-04-25 | N=8 · 25% · -55% · -4.43u | N=17 · 47% · -6% · -1.10u | +9 | +3.33u |
| 2026-04-26 | N=19 · 53% · -3% · -0.66u | N=26 · 50% · -8% · -2.01u | +7 | -1.35u |
| 2026-04-27 | N=17 · 65% · +18% · +3.07u | N=21 · 57% · +5% · +1.07u | +4 | -2.00u |
| 2026-04-28 | N=17 · 47% · -12% · -2.06u | N=24 · 46% · -14% · -3.41u | +7 | -1.35u |
| 2026-04-29 | N=11 · 45% · -9% · -1.00u | N=25 · 48% · -5% · -1.36u | +14 | -0.36u |
| 2026-04-30 | N=4 · 50% · +22% · +0.88u | N=12 · 50% · +4% · +0.49u | +8 | -0.39u |
| 2026-05-01 | N=11 · 36% · -30% · -3.33u | N=20 · 40% · -27% · -5.39u | +9 | -2.06u |
| 2026-05-02 | N=2 · 50% · -3% · -0.06u | N=14 · 50% · -1% · -0.09u | +12 | -0.04u |
| 2026-05-03 | N=8 · 50% · -5% · -0.43u | N=15 · 40% · -19% · -2.92u | +7 | -2.49u |
| 2026-05-04 | N=10 · 50% · +11% · +1.09u | N=19 · 47% · -0% · -0.04u | +9 | -1.14u |
| 2026-05-05 | N=5 · 40% · -40% · -2.00u | N=7 · 43% · -34% · -2.35u | +2 | -0.35u |
| 2026-05-06 | N=4 · 75% · +39% · +1.56u | N=6 · 67% · +25% · +1.50u | +2 | -0.06u |
| 2026-05-07 | N=2 · 100% · +91% · +1.83u | N=3 · 67% · +28% · +0.83u | +1 | -1.00u |
| 2026-05-08 | N=7 · 57% · +6% · +0.39u | N=7 · 57% · +6% · +0.39u | +0 | +0.00u |
| 2026-05-09 | N=5 · 80% · +43% · +2.14u | N=5 · 80% · +43% · +2.14u | +0 | +0.00u |
| 2026-05-10 | N=12 · 58% · +23% · +2.77u | N=14 · 64% · +29% · +4.06u | +2 | +1.29u |
| 2026-05-11 | N=9 · 56% · -8% · -0.68u | N=10 · 50% · -17% · -1.68u | +1 | -1.00u |
| 2026-05-12 | N=11 · 45% · -26% · -2.86u | N=11 · 45% · -26% · -2.86u | +0 | +0.00u |
| 2026-05-13 | N=9 · 78% · +51% · +4.59u | N=9 · 78% · +51% · +4.59u | +0 | +0.00u |
| 2026-05-14 | N=7 · 14% · -73% · -5.12u | N=7 · 14% · -73% · -5.12u | +0 | +0.00u |
| 2026-05-15 | N=11 · 45% · -12% · -1.31u | N=14 · 50% · -6% · -0.88u | +3 | +0.42u |
| 2026-05-16 | N=8 · 75% · +55% · +4.43u | N=9 · 67% · +38% · +3.43u | +1 | -1.00u |
| 2026-05-17 | N=9 · 56% · +11% · +1.01u | N=14 · 43% · -15% · -2.05u | +5 | -3.06u |
| 2026-05-18 | N=11 · 36% · -28% · -3.08u | N=14 · 43% · -8% · -1.14u | +3 | +1.94u |
| 2026-05-19 | N=8 · 38% · -35% · -2.79u | N=9 · 33% · -42% · -3.79u | +1 | -1.00u |
| 2026-05-20 | N=10 · 60% · +7% · +0.73u | N=16 · 56% · +3% · +0.50u | +6 | -0.24u |
| 2026-05-21 | N=12 · 50% · -7% · -0.84u | N=16 · 50% · -8% · -1.34u | +4 | -0.50u |
| 2026-05-22 | N=23 · 43% · -17% · -3.95u | N=24 · 46% · -13% · -3.04u | +1 | +0.91u |
| 2026-05-23 | N=27 · 67% · +31% · +8.41u | N=33 · 58% · +14% · +4.69u | +6 | -3.72u |
| 2026-05-24 | N=23 · 35% · -32% · -7.37u | N=29 · 48% · +17% · +4.97u | +6 | +12.34u |
| 2026-05-25 | N=24 · 58% · +5% · +1.13u | N=27 · 52% · -7% · -1.87u | +3 | -3.00u |
| 2026-05-26 | N=21 · 67% · +23% · +4.78u | N=23 · 65% · +20% · +4.69u | +2 | -0.09u |
| 2026-05-27 | N=21 · 52% · -8% · -1.73u | N=21 · 52% · -8% · -1.73u | +0 | +0.00u |
| 2026-05-28 | N=9 · 44% · -18% · -1.60u | N=9 · 44% · -18% · -1.60u | +0 | +0.00u |
| 2026-05-29 | N=24 · 46% · -14% · -3.44u | N=25 · 48% · -10% · -2.55u | +1 | +0.89u |
| 2026-05-30 | N=22 · 50% · -3% · -0.64u | N=24 · 50% · -3% · -0.62u | +2 | +0.02u |
| 2026-05-31 | N=12 · 50% · -17% · -2.06u | N=13 · 46% · -24% · -3.06u | +1 | -1.00u |
| 2026-06-01 | N=10 · 50% · +7% · +0.72u | N=13 · 46% · -4% · -0.51u | +3 | -1.23u |
| 2026-06-02 | N=13 · 46% · -6% · -0.78u | N=18 · 44% · -9% · -1.53u | +5 | -0.75u |
| 2026-06-03 | N=24 · 67% · +34% · +8.11u | N=25 · 64% · +28% · +7.11u | +1 | -1.00u |
| 2026-06-04 | N=14 · 57% · +13% · +1.81u | N=16 · 56% · +11% · +1.73u | +2 | -0.07u |
| 2026-06-05 | N=21 · 62% · +17% · +3.47u | N=21 · 62% · +17% · +3.47u | +0 | +0.00u |
| 2026-06-06 | N=15 · 53% · -1% · -0.10u | N=21 · 52% · -4% · -0.78u | +6 | -0.68u |
| 2026-06-07 | N=31 · 58% · +Infinity% · +Infinityu | N=34 · 59% · +Infinity% · +Infinityu | +3 | NaNu |
| 2026-06-08 | N=13 · 54% · +5% · +0.60u | N=16 · 56% · +7% · +1.19u | +3 | +0.59u |
| 2026-06-09 | N=21 · 48% · -4% · -0.76u | N=21 · 48% · -4% · -0.76u | +0 | +0.00u |
| 2026-06-10 | N=26 · 42% · -14% · -3.57u | N=28 · 46% · -5% · -1.42u | +2 | +2.16u |
| 2026-06-11 | N=12 · 33% · -40% · -4.77u | N=14 · 36% · -37% · -5.19u | +2 | -0.43u |
| 2026-06-12 | N=19 · 53% · -2% · -0.43u | N=22 · 55% · -1% · -0.24u | +3 | +0.19u |
| 2026-06-13 | N=22 · 59% · +15% · +3.21u | N=26 · 58% · +13% · +3.50u | +4 | +0.30u |
| 2026-06-14 | N=13 · 46% · -17% · -2.26u | N=13 · 46% · -17% · -2.26u | +0 | +0.00u |
| 2026-06-15 | N=22 · 41% · -23% · -5.12u | N=23 · 43% · -19% · -4.36u | +1 | +0.76u |
| 2026-06-16 | N=26 · 50% · -6% · -1.45u | N=28 · 50% · -7% · -1.99u | +2 | -0.55u |
| 2026-06-17 | N=19 · 47% · -11% · -2.18u | N=24 · 42% · -22% · -5.27u | +5 | -3.09u |
| 2026-06-18 | N=13 · 62% · +9% · +1.19u | N=14 · 57% · +1% · +0.19u | +1 | -1.00u |
| 2026-06-19 | N=30 · 50% · -8% · -2.39u | N=31 · 48% · -11% · -3.39u | +1 | -1.00u |
| 2026-06-20 | N=14 · 50% · -10% · -1.36u | N=14 · 50% · -10% · -1.36u | +0 | +0.00u |
| 2026-06-21 | N=29 · 31% · -41% · -11.79u | N=30 · 33% · -37% · -10.99u | +1 | +0.80u |
| 2026-06-22 | N=22 · 55% · +2% · +0.42u | N=28 · 54% · -2% · -0.52u | +6 | -0.95u |
| 2026-06-23 | N=27 · 41% · -22% · -5.94u | N=31 · 39% · -25% · -7.74u | +4 | -1.80u |
| 2026-06-24 | N=33 · 58% · +20% · +6.68u | N=39 · 51% · +5% · +2.02u | +6 | -4.66u |
| 2026-06-25 | N=19 · 32% · -44% · -8.27u | N=23 · 30% · -45% · -10.29u | +4 | -2.02u |
| 2026-06-26 | N=23 · 61% · +2% · +0.49u | N=25 · 60% · +2% · +0.43u | +2 | -0.06u |
| 2026-06-27 | N=26 · 38% · -32% · -8.31u | N=31 · 35% · -38% · -11.64u | +5 | -3.33u |
| 2026-06-28 | N=29 · 38% · -28% · -8.15u | N=29 · 38% · -28% · -8.15u | +0 | +0.00u |
| 2026-06-29 | N=26 · 50% · -1% · -0.30u | N=28 · 46% · -8% · -2.30u | +2 | -2.00u |
| 2026-06-30 | N=33 · 58% · +10% · +3.17u | N=39 · 56% · +8% · +3.13u | +6 | -0.04u |
| 2026-07-01 | N=28 · 50% · +1% · +0.17u | N=37 · 54% · +Infinity% · +Infinityu | +9 | +Infinityu |
| 2026-07-02 | N=28 · 32% · -39% · -10.92u | N=32 · 34% · -36% · -11.39u | +4 | -0.48u |
| 2026-07-03 | N=24 · 71% · +32% · +7.72u | N=28 · 64% · +19% · +5.27u | +4 | -2.45u |
| 2026-07-04 | N=26 · 65% · +18% · +4.76u | N=26 · 65% · +18% · +4.76u | +0 | +0.00u |
| 2026-07-05 | N=20 · 50% · +2% · +0.39u | N=21 · 52% · +9% · +1.82u | +1 | +1.43u |
| **Total delta** | — | — | **+240** picks | **NaNu** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=240.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 143 | 47.6% | -8.6% | -12.24u |
| already contribution-eligible (STRONG) | 43 | 48.8% | -11.0% | -4.72u |
| eligible under EITHER current path | 156 | 49.4% | -6.2% | -9.67u |
| **NOVEL** — only elite-path would have caught these | 84 | 39.3% | +Infinity% | +Infinityu |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-07-06 that would promote if we shipped the new path:

| Pick | lockStage | regime | tier | maxRoiN_F | meanBase_F | margin | Δctrb |
|---|---|---|---|---|---|---|---|
| MLB ML — Kansas City Royals | SHADOW | CLEAR_MOVE | MUTE | 93★ | 65★ | +0 | -45 |
| SOC ML — Draw | SHADOW | SMALL_MOVE | STANDARD | 71★ | 54 | -7 | -874 |
| SOC ML — United States | SHADOW | PREGAME | WEAK | 96★ | 46 | -1 | -377 |
| SOC ML — Portugal | SHADOW | PREGAME | WEAK | 71★ | 38 | -5 | -547 |


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=608, flat ROI +Infinity%.
- **Non-LOCKED × edge hit:** N=240, flat ROI +Infinity%, PnL +Infinityu.
- **NOVEL picks (filter catches them, current paths miss them):** N=84, flat ROI +Infinity%, PnL +Infinityu.

### Decision criteria

1. Edge must survive with **flat ROI ≥ +10%** inside the non-LOCKED pool.
2. There must be **NOVEL picks** — filter catches non-LOCKED sides that regime/contribution paths miss.
3. NOVEL pick sample needs flat ROI ≥ +10% on **N ≥ 6** (min 2 full days) before shipping a real promotion rule.

### What to do next

- If criteria met → add a new `elite-wallet` promotion path in `SharpFlow.jsx` alongside `regime` and `contribution`, and track `promotedBy = 'elite-wallet'` for audit.
- If criteria not yet met but directionally positive → keep the signal on the **ranking dashboard** (`rankTodayLocks.js`) and re-audit weekly.
- If the filter underperforms in the non-LOCKED pool → keep meanBase_F / maxRoiN_F strictly as **sizing modifiers** (V8.3), not promotion gates.

---
*Auto-generated by `scripts/nonLockedEdgeAudit.js`. Re-run via GH Actions to refresh `NONLOCKED_EDGE_AUDIT.md`.*
