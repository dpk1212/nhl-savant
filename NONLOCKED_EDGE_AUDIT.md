# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 5/2/2026, 9:53:19 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 173 | 47.4% | -7.4% | -12.76u |
| SHADOW | 79 | 48.1% | -9.0% | -7.09u |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 257 | 47.9% | -7.3% | -18.71u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=87 · 47% · -12% · -10.6u | N=32 · 56% · +16% · +5.0u | N=22 · 32% · -39% · -8.6u | N=32 · 50% · +4% · +1.4u | **N=173 · 47% · -7% · -12.8u** |
| **SHADOW** | N=26 · 46% · -11% · -2.9u | N=10 · 40% · -20% · -2.0u | N=24 · 54% · +1% · +0.3u | N=19 · 47% · -13% · -2.4u | **N=79 · 48% · -9% · -7.1u** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=114 · 47% · -11% · -12.3u | N=42 · 52% · +7% · +3.1u | N=46 · 43% · -18% · -8.4u | N=55 · 49% · -2% · -1.1u | **N=257 · 48% · -7% · -18.7u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 27 | 48.1% | -6.4% | -1.72u |
| maxRoi★ only | 10 | 40.0% | -19.9% | -1.99u |
| meanBase★ only | 24 | 54.2% | +1.2% | +0.28u |
| neither | 23 | 47.8% | -10.9% | -2.51u |
| **pool total** | 84 | 48.8% | -7.1% | -5.95u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 61 | 49.2% | -5.6% | -3.44u |
| filter drops | 23 | 47.8% | -10.9% | -2.51u |


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
| **Total delta** | — | — | **+61** picks | **-3.44u** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=61.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 35 | 45.7% | -12.8% | -4.47u |
| already contribution-eligible (STRONG) | 13 | 61.5% | +15.7% | +2.04u |
| eligible under EITHER current path | 41 | 51.2% | -2.9% | -1.19u |
| **NOVEL** — only elite-path would have caught these | 20 | 45.0% | -11.3% | -2.25u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-05-02 that would promote if we shipped the new path:

| Pick | lockStage | regime | tier | maxRoiN_F | meanBase_F | margin | Δctrb |
|---|---|---|---|---|---|---|---|
| NBA ML — Celtics | SHADOW | SMALL_MOVE | LEAN | 94★ | 85★ | +0 | 34 |
| NBA TOTAL — Over 206 | SHADOW | SMALL_MOVE | STANDARD | 70★ | 65★ | +1 | 40 |


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=84, flat ROI -7.1%.
- **Non-LOCKED × edge hit:** N=61, flat ROI -5.6%, PnL -3.44u.
- **NOVEL picks (filter catches them, current paths miss them):** N=20, flat ROI -11.3%, PnL -2.25u.

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
