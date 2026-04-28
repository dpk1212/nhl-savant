# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 4/28/2026, 11:04:13 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 130 | 48.5% | -5.6% | -7.24u |
| SHADOW | 32 | 50.0% | -3.6% | -1.14u |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 167 | 49.1% | -4.3% | -7.24u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=62 · 53% · -2% · -1.0u | N=26 · 46% · -4% · -1.0u | N=13 · 38% · -27% · -3.5u | N=29 · 45% · -6% · -1.7u | **N=130 · 48% · -6% · -7.2u** |
| **SHADOW** | N=10 · 60% · +21% · +2.1u | N=5 · 60% · +23% · +1.2u | N=7 · 29% · -54% · -3.8u | N=10 · 50% · -7% · -0.7u | **N=32 · 50% · -4% · -1.1u** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=73 · 55% · +3% · +2.3u | N=31 · 48% · +1% · +0.2u | N=20 · 35% · -36% · -7.3u | N=43 · 47% · -6% · -2.4u | **N=167 · 49% · -4% · -7.2u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 11 | 63.6% | +30.4% | +3.34u |
| maxRoi★ only | 5 | 60.0% | +23.0% | +1.15u |
| meanBase★ only | 7 | 28.6% | -53.9% | -3.77u |
| neither | 14 | 50.0% | -5.1% | -0.72u |
| **pool total** | 37 | 51.4% | -0.0% | -0.00u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 23 | 52.2% | +3.1% | +0.72u |
| filter drops | 14 | 50.0% | -5.1% | -0.72u |


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
| **Total delta** | — | — | **+23** picks | **+0.72u** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=23.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 11 | 36.4% | -25.6% | -2.81u |
| already contribution-eligible (STRONG) | 7 | 57.1% | +9.9% | +0.69u |
| eligible under EITHER current path | 16 | 50.0% | -0.7% | -0.12u |
| **NOVEL** — only elite-path would have caught these | 7 | 57.1% | +11.9% | +0.84u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-04-28 that would promote if we shipped the new path:

| Pick | lockStage | regime | tier | maxRoiN_F | meanBase_F | margin | Δctrb |
|---|---|---|---|---|---|---|---|
| NHL ML — Oilers | SHADOW | NO_MOVE | STRONG | 69 | 56★ | +2 | 87 |
| NBA TOTAL — Over 216.5 | SHADOW | CLEAR_MOVE | STANDARD | 69 | 58★ | +1 | 151 |


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=37, flat ROI -0.0%.
- **Non-LOCKED × edge hit:** N=23, flat ROI +3.1%, PnL +0.72u.
- **NOVEL picks (filter catches them, current paths miss them):** N=7, flat ROI +11.9%, PnL +0.84u.

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
