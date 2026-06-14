# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 6/14/2026, 10:40:34 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 780 | 51.7% | +Infinity% | +Infinityu |
| SHADOW | 346 | 50.3% | -2.2% | -7.56u |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 1131 | 51.3% | +Infinity% | +Infinityu |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=203 · 51% · -1% · -1.2u | N=124 · 54% · +6% · +7.2u | N=66 · 45% · -10% · -6.9u | N=387 · 52% · +Infinity% · +Infinityu | **N=780 · 52% · +Infinity% · +Infinityu** |
| **SHADOW** | N=76 · 41% · -12% · -9.0u | N=43 · 58% · +10% · +4.1u | N=56 · 50% · -3% · -1.9u | N=171 · 53% · -0% · -0.8u | **N=346 · 50% · -2% · -7.6u** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=280 · 49% · -3% · -9.0u | N=167 · 55% · +7% · +11.3u | N=122 · 48% · -7% · -8.8u | N=562 · 52% · +Infinity% · +Infinityu | **N=1131 · 51% · +Infinity% · +Infinityu** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 77 | 41.6% | -10.1% | -7.78u |
| maxRoi★ only | 43 | 58.1% | +9.6% | +4.12u |
| meanBase★ only | 56 | 50.0% | -3.4% | -1.91u |
| neither | 175 | 52.6% | -0.5% | -0.86u |
| **pool total** | 351 | 50.4% | -1.8% | -6.42u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 176 | 48.3% | -3.2% | -5.56u |
| filter drops | 175 | 52.6% | -0.5% | -0.86u |


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
| **Total delta** | — | — | **+176** picks | **NaNu** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=176.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 108 | 48.1% | -6.3% | -6.83u |
| already contribution-eligible (STRONG) | 35 | 51.4% | -4.8% | -1.68u |
| eligible under EITHER current path | 121 | 50.4% | -3.5% | -4.26u |
| **NOVEL** — only elite-path would have caught these | 55 | 43.6% | -2.4% | -1.30u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-06-14 that would promote if we shipped the new path:

_None._


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=351, flat ROI -1.8%.
- **Non-LOCKED × edge hit:** N=176, flat ROI -3.2%, PnL -5.56u.
- **NOVEL picks (filter catches them, current paths miss them):** N=55, flat ROI -2.4%, PnL -1.30u.

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
