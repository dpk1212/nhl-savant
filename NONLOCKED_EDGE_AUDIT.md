# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 4/23/2026, 10:19:01 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 64 | 46.9% | -4.0% | -2.59u |
| SHADOW | 8 | 50.0% | -3.1% | -0.25u |
| UNPROMOTED | 1 | 0.0% | -100.0% | -1.00u |
| **All** | 73 | 46.6% | -5.3% | -3.83u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=16 · 56% · +7% · +1.2u | N=15 · 33% · -26% · -3.8u | N=9 · 44% · -16% · -1.4u | N=24 · 50% · +6% · +1.5u | **N=64 · 47% · -4% · -2.6u** |
| **SHADOW** | — | N=1 · 100% · +105% · +1.0u | N=2 · 50% · -16% · -0.3u | N=5 · 40% · -20% · -1.0u | **N=8 · 50% · -3% · -0.2u** |
| **UNPROMOTED** | — | — | — | N=1 · 0% · -100% · -1.0u | **N=1 · 0% · -100% · -1.0u** |
| **ALL** | N=16 · 56% · +7% · +1.2u | N=16 · 38% · -17% · -2.8u | N=11 · 45% · -16% · -1.7u | N=30 · 47% · -2% · -0.5u | **N=73 · 47% · -5% · -3.8u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| maxRoi★ only | 1 | 100.0% | +105.0% | +1.05u |
| meanBase★ only | 2 | 50.0% | -15.8% | -0.32u |
| neither | 6 | 33.3% | -33.1% | -1.98u |
| **pool total** | 9 | 44.4% | -13.9% | -1.25u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 3 | 66.7% | +24.5% | +0.73u |
| filter drops | 6 | 33.3% | -33.1% | -1.98u |


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
| **Total delta** | — | — | **+3** picks | **+0.73u** |


---
## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?

The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.

**Elite-path candidate pool (non-LOCKED + edge hit): N=3.**  Breaking down by whether they were *already eligible* under a current path:

| Category | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| **NOVEL** — only elite-path would have caught these | 3 | 66.7% | +24.5% | +0.73u |

**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.


---
## 4. Today's live candidates for the elite-wallet path

Currently-SHADOW or unpromoted sides on the board for 2026-04-23 that would promote if we shipped the new path:

_None._


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=9, flat ROI -13.9%.
- **Non-LOCKED × edge hit:** N=3, flat ROI +24.5%, PnL +0.73u.
- **NOVEL picks (filter catches them, current paths miss them):** N=3, flat ROI +24.5%, PnL +0.73u.

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
