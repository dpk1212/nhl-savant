# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 5/7/2026, 11:12:28 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 202 | 48.0% | -6.2% | -12.60u |
| SHADOW | 122 | 50.0% | -4.7% | -5.75u |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 329 | 48.9% | -5.2% | -17.22u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=106 · 48% · -8% · -8.4u | N=35 · 57% · +14% · +5.1u | N=24 · 29% · -44% · -10.6u | N=37 · 51% · +4% · +1.3u | **N=202 · 48% · -6% · -12.6u** |
| **SHADOW** | N=51 · 43% · -16% · -8.2u | N=13 · 54% · +8% · +1.1u | N=28 · 50% · -6% · -1.6u | N=30 · 60% · +10% · +3.0u | **N=122 · 50% · -5% · -5.8u** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=158 · 47% · -10% · -15.4u | N=48 · 56% · +13% · +6.1u | N=52 · 40% · -23% · -12.2u | N=71 · 55% · +6% · +4.2u | **N=329 · 49% · -5% · -17.2u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 52 | 44.2% | -13.5% | -7.01u |
| maxRoi★ only | 13 | 53.8% | +8.2% | +1.07u |
| meanBase★ only | 28 | 50.0% | -5.6% | -1.56u |
| neither | 34 | 58.8% | +8.5% | +2.89u |
| **pool total** | 127 | 50.4% | -3.6% | -4.62u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 93 | 47.3% | -8.1% | -7.51u |
| filter drops | 34 | 58.8% | +8.5% | +2.89u |


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
| **Total delta** | — | — | **+93** picks | **-7.51u** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=93.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 56 | 42.9% | -15.8% | -8.83u |
| already contribution-eligible (STRONG) | 22 | 54.5% | +4.2% | +0.92u |
| eligible under EITHER current path | 64 | 48.4% | -6.9% | -4.44u |
| **NOVEL** — only elite-path would have caught these | 29 | 44.8% | -10.6% | -3.07u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-05-07 that would promote if we shipped the new path:

_None._


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=127, flat ROI -3.6%.
- **Non-LOCKED × edge hit:** N=93, flat ROI -8.1%, PnL -7.51u.
- **NOVEL picks (filter catches them, current paths miss them):** N=29, flat ROI -10.6%, PnL -3.07u.

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
