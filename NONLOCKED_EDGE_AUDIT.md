# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 4/27/2026, 10:34:37 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 113 | 46.0% | -9.1% | -10.31u |
| SHADOW | 28 | 53.6% | +3.1% | +0.86u |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 146 | 47.9% | -5.7% | -8.31u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=53 · 53% · -1% · -0.5u | N=20 · 35% · -23% · -4.6u | N=11 · 36% · -31% · -3.4u | N=29 · 45% · -6% · -1.7u | **N=113 · 46% · -9% · -10.3u** |
| **SHADOW** | N=9 · 56% · +13% · +1.1u | N=5 · 60% · +23% · +1.2u | N=4 · 50% · -19% · -0.8u | N=10 · 50% · -7% · -0.7u | **N=28 · 54% · +3% · +0.9u** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=63 · 54% · +3% · +1.8u | N=25 · 40% · -14% · -3.5u | N=15 · 40% · -28% · -4.2u | N=43 · 47% · -6% · -2.4u | **N=146 · 48% · -6% · -8.3u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 10 | 60.0% | +23.4% | +2.34u |
| maxRoi★ only | 5 | 60.0% | +23.0% | +1.15u |
| meanBase★ only | 4 | 50.0% | -19.4% | -0.77u |
| neither | 14 | 50.0% | -5.1% | -0.72u |
| **pool total** | 33 | 54.5% | +6.1% | +2.00u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 19 | 57.9% | +14.3% | +2.72u |
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
| **Total delta** | — | — | **+19** picks | **+2.72u** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=19.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 7 | 42.9% | -11.6% | -0.81u |
| already contribution-eligible (STRONG) | 7 | 57.1% | +9.9% | +0.69u |
| eligible under EITHER current path | 12 | 58.3% | +15.7% | +1.88u |
| **NOVEL** — only elite-path would have caught these | 7 | 57.1% | +11.9% | +0.84u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-04-27 that would promote if we shipped the new path:

| Pick | lockStage | regime | tier | maxRoiN_F | meanBase_F | margin | Δctrb |
|---|---|---|---|---|---|---|---|
| NBA TOTAL — Under 222 | SHADOW | CLEAR_MOVE | STANDARD | 69 | 66★ | +1 | 64 |


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=33, flat ROI +6.1%.
- **Non-LOCKED × edge hit:** N=19, flat ROI +14.3%, PnL +2.72u.
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
