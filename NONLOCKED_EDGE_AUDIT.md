# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 4/26/2026, 9:46:14 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 94 | 44.7% | -10.3% | -9.65u |
| SHADOW | 18 | 55.6% | +8.7% | +1.57u |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 117 | 47.0% | -5.9% | -6.94u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=37 · 49% · -8% · -2.9u | N=20 · 35% · -23% · -4.6u | N=10 · 40% · -24% · -2.4u | N=27 · 48% · +1% · +0.3u | **N=94 · 45% · -10% · -9.6u** |
| **SHADOW** | N=5 · 80% · +63% · +3.2u | N=3 · 67% · +34% · +1.0u | N=3 · 33% · -44% · -1.3u | N=7 · 43% · -18% · -1.3u | **N=18 · 56% · +9% · +1.6u** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=43 · 53% · +3% · +1.5u | N=23 · 39% · -16% · -3.6u | N=13 · 38% · -29% · -3.7u | N=38 · 47% · -3% · -1.1u | **N=117 · 47% · -6% · -6.9u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 6 | 83.3% | +72.8% | +4.37u |
| maxRoi★ only | 3 | 66.7% | +33.7% | +1.01u |
| meanBase★ only | 3 | 33.3% | -43.8% | -1.32u |
| neither | 11 | 45.5% | -12.4% | -1.36u |
| **pool total** | 23 | 56.5% | +11.8% | +2.71u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 12 | 66.7% | +33.9% | +4.07u |
| filter drops | 11 | 45.5% | -12.4% | -1.36u |


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
| **Total delta** | — | — | **+12** picks | **+4.07u** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=12.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 4 | 75.0% | +54.7% | +2.19u |
| already contribution-eligible (STRONG) | 3 | 66.7% | +39.3% | +1.18u |
| eligible under EITHER current path | 7 | 71.4% | +48.1% | +3.37u |
| **NOVEL** — only elite-path would have caught these | 5 | 60.0% | +13.9% | +0.70u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-04-26 that would promote if we shipped the new path:

| Pick | lockStage | regime | tier | maxRoiN_F | meanBase_F | margin | Δctrb |
|---|---|---|---|---|---|---|---|
| NBA ML — Rockets | SHADOW | SMALL_MOVE | STRONG | 68 | 58★ | +2 | 110 |


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=23, flat ROI +11.8%.
- **Non-LOCKED × edge hit:** N=12, flat ROI +33.9%, PnL +4.07u.
- **NOVEL picks (filter catches them, current paths miss them):** N=5, flat ROI +13.9%, PnL +0.70u.

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
