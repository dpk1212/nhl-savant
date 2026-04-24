# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?

Generated: 4/24/2026, 10:14:15 AM ET · V8 cutover: 2026-04-18

## Baseline — all graded V8-era game sides

| Segment | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| LOCKED | 76 | 44.7% | -8.6% | -6.50u |
| SHADOW | 8 | 50.0% | -3.1% | -0.25u |
| UNPROMOTED | 3 | 66.7% | +31.2% | +0.93u |
| **All** | 87 | 46.0% | -6.7% | -5.81u |

---
## 1. Does the edge survive outside the LOCKED universe?

Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.

If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.

| lockStage | both★ | maxRoi★ only | meanBase★ only | neither | stage total |
|---|---|---|---|---|---|
| **LOCKED** | N=23 · 52% · +0% · +0.0u | N=18 · 33% · -25% · -4.6u | N=10 · 40% · -24% · -2.4u | N=25 · 48% · +2% · +0.5u | **N=76 · 45% · -9% · -6.5u** |
| **SHADOW** | — | N=1 · 100% · +105% · +1.0u | N=2 · 50% · -16% · -0.3u | N=5 · 40% · -20% · -1.0u | **N=8 · 50% · -3% · -0.2u** |
| **UNPROMOTED** | — | — | — | N=3 · 67% · +31% · +0.9u | **N=3 · 67% · +31% · +0.9u** |
| **ALL** | N=23 · 52% · +0% · +0.0u | N=19 · 37% · -19% · -3.5u | N=12 · 42% · -23% · -2.7u | N=33 · 48% · +1% · +0.4u | **N=87 · 46% · -7% · -5.8u** |

### SHADOW + UNPROMOTED pool (the candidate promotion universe)

| Edge state | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| maxRoi★ only | 1 | 100.0% | +105.0% | +1.05u |
| meanBase★ only | 2 | 50.0% | -15.8% | -0.32u |
| neither | 8 | 50.0% | -0.6% | -0.05u |
| **pool total** | 11 | 54.5% | +6.2% | +0.69u |

**Proposed filter:** non-LOCKED side where `maxRoiN_F ≥ 70` **OR** `meanBase_F ≥ 55`

| Subset | N | WR | flat ROI | flat PnL |
|---|---|---|---|---|
| filter hits (★) | 3 | 66.7% | +24.5% | +0.73u |
| filter drops | 8 | 50.0% | -0.6% | -0.05u |


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

Currently-SHADOW or unpromoted sides on the board for 2026-04-24 that would promote if we shipped the new path:

_None._


---
## 5. Verdict + proposal

### Summary

- **Non-LOCKED pool:** N=11, flat ROI +6.2%.
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
