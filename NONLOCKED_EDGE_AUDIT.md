# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 4/30/2026, 10:33:46 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 158 | 48.1% | -6.5% | -10.31u |
| SHADOW | 58 | 48.3% | -7.1% | -4.10u |
| UNPROMOTED | 5 | 60.0% | +22.7% | +1.13u |
| **All** | 221 | 48.4% | -6.0% | -13.27u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=77 · 51% · -7% · -5.5u | N=31 · 55% · +13% · +4.1u | N=20 · 30% · -43% · -8.6u | N=30 · 47% · -1% · -0.3u | **N=158 · 48% · -7% · -10.3u** |
| **SHADOW** | N=17 · 47% · -7% · -1.1u | N=8 · 50% · +0% · +0.0u | N=18 · 50% · -6% · -1.0u | N=15 · 47% · -13% · -1.9u | **N=58 · 48% · -7% · -4.1u** |
| **UNPROMOTED** | N=1 · 100% · +120% · +1.2u | — | — | N=4 · 50% · -2% · -0.1u | **N=5 · 60% · +23% · +1.1u** |
| **ALL** | N=95 · 51% · -6% · -5.5u | N=39 · 54% · +11% · +4.2u | N=38 · 39% · -26% · -9.7u | N=49 · 47% · -5% · -2.3u | **N=221 · 48% · -6% · -13.3u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| both★ | 18 | 50.0% | +0.3% | +0.05u |
| maxRoi★ only | 8 | 50.0% | +0.1% | +0.01u |
| meanBase★ only | 18 | 50.0% | -5.8% | -1.04u |
| neither | 19 | 47.4% | -10.4% | -1.98u |
| **pool total** | 63 | 49.2% | -4.7% | -2.97u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 44 | 50.0% | -2.2% | -0.99u |
| filter drops | 19 | 47.4% | -10.4% | -1.98u |


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
| **Total delta** | — | — | **+44** picks | **-0.99u** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=44.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| already regime-eligible (CLEAR_MOVE / NEAR_START) | 23 | 43.5% | -13.5% | -3.11u |
| already contribution-eligible (STRONG) | 9 | 66.7% | +24.7% | +2.22u |
| eligible under EITHER current path | 29 | 51.7% | +0.6% | +0.17u |
| **NOVEL** — only elite-path would have caught these | 15 | 46.7% | -7.7% | -1.16u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-04-30 that would promote if we shipped the new path:

| Pick | lockStage | regime | tier | maxRoiN_F | meanBase_F | margin | Δctrb |
|---|---|---|---|---|---|---|---|
| MLB ML — Colorado Rockies | SHADOW | SMALL_MOVE | STANDARD | 76★ | 74★ | +1 | 70 |
| NBA ML — Knicks | SHADOW | CLEAR_MOVE | STANDARD | 72★ | 66★ | +1 | 72 |
| MLB ML — Atlanta Braves | SHADOW | NEAR_START | LEAN | 70 | 56★ | +0 | 86 |
| MLB ML — Houston Astros | SHADOW | SMALL_MOVE | LEAN | 70★ | 53 | +0 | 75 |
| MLB ML — Athletics | SHADOW | SMALL_MOVE | LEAN | 70 | 56★ | +0 | 83 |
| MLB ML — Philadelphia Phillies | SHADOW | CLEAR_MOVE | LEAN | 70 | 56★ | +0 | 79 |
| NHL ML — Oilers | SHADOW | SMALL_MOVE | STANDARD | 72★ | 52 | +1 | 108 |
| NBA SPREAD — Knicks | SHADOW | CLEAR_MOVE | STANDARD | 70 | 65★ | +1 | 91 |
| NBA TOTAL — Over 214 | SHADOW | SMALL_MOVE | STANDARD | 70 | 65★ | +1 | 68 |


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=63, flat ROI -4.7%.
- **Non-LOCKED × edge hit:** N=44, flat ROI -2.2%, PnL -0.99u.
- **NOVEL picks (filter catches them, current paths miss them):** N=15, flat ROI -7.7%, PnL -1.16u.

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
