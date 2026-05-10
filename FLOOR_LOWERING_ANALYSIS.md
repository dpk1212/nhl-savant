# Floor-Lowering Analysis — Σ ≥ +4 vs Σ ≥ +5

Generated: 4/30/2026, 5:53:10 AM ET · sample 104 graded sides · 2026-04-18 → 2026-04-29 (12 days)

**Question.** Should we lower the v7.0 LOCK floor from `Σ ≥ +5` to `Σ ≥ +4`?  
At aggregate, Σ=+4 goes 15p · 6-9 · 40.0% · -17.6% — a clear loser. But that hides whether any sub-slice of Σ=+4 is rescuable. This report decomposes the cell completely and tests rescue gates.

**Inclusion mirrors live Pick Performance dashboard.** Stats convention: Wilson 95% CIs on WR. ✓ next to flat ROI = t-test against zero clears p < 0.05.

---
## §1. Σ = +4 decomposition

Σ=+4 raw cohort: **15p · 6-9 · 40.0% · -17.6%**.  Reference cohorts:
- v7.0 LOCK baseline (Σ ≥ +5): **32p · 21-11 · 65.6% · +40.8%**
- Σ = +5 alone: 11p · 6-5 · 54.5% · +20.1%
- Σ ≥ +6 alone: 21p · 15-6 · 71.4% · +51.7%
- Combined Σ ≥ +4 (proposed new floor): **47p · 27-20 · 57.4% · +22.2%**

### §1a. By (Δw, Δq) cell — which Σ=+4 cells are which?

| cell | (Δw, Δq) | cohort |
|---|---|---|
| 1/3 | (Δw=1, Δq=3) | 5p · 2-3 · 40.0% · -22.0% |
| 2/2 | (Δw=2, Δq=2) | 9p · 3-6 · 33.3% · -27.2% |
| 3/1 | (Δw=3, Δq=1) | 1p · 1-0 · 100.0% · +90.9% |

Reading: Σ=+4 is reachable via three cells. Their underlying mechanics differ — `Δw=+3 ∧ Δq=+1` is a high-winner-margin pick with thin quality, very different from `Δw=+1 ∧ Δq=+3` which is the inverse. If one cell is materially different from the others, that's a sign the Σ-only floor is lossy.

### §1b. By sport

| sport | cohort |
|---|---|
| MLB | 8p · 2-6 · 25.0% · -47.0% |
| NBA | 6p · 3-3 · 50.0% · -5.1% |
| NHL | 1p · 1-0 · 100.0% · +142.0% |

### §1c. By market

| market | cohort |
|---|---|
| ML | 8p · 2-6 · 25.0% · -41.5% |
| SPREAD | 1p · 0-1 · 0.0% · -100.0% |
| TOTAL | 6p · 4-2 · 66.7% · +27.9% |

### §1d. By regime

| regime | cohort |
|---|---|
| CLEAR_MOVE | 2p · 2-0 · 100.0% · +134.0% ✓ |
| NEAR_START | 10p · 3-7 · 30.0% · -41.9% |
| SMALL_MOVE | 3p · 1-2 · 33.3% · -37.7% |

### §1e. By odds bucket

| odds | cohort |
|---|---|
| −400 or worse | — |
| −200 to −151 | — |
| −150 to −101 | 10p · 4-6 · 40.0% · -23.2% |
| −100 to +120 | 1p · 0-1 · 0.0% · -100.0% |
| +121 to +200 | 3p · 2-1 · 66.7% · +56.0% |
| +201 or better | 1p · 0-1 · 0.0% · -100.0% |

---
## §2. Rescue-gate candidates inside Σ = +4

Apply each gate to the Σ=+4 cohort. A useful rescue gate:  
— keeps N ≥ 8 (otherwise too small to act on),  
— lifts flat ROI above 0% (positive EV),  
— ideally clears p < 0.05 (statistical noise filter).

| Gate | N | WR (95% CI) | flat ROI | peak PnL | t | p |
|---|---|---|---|---|---|---|
| Σ=+4 (full, no gate) | 18 | 38.9% (20.3%–61.4%) | -19.1% | -3.97u | -0.77 | 0.440 |
| Σ=+4 ∧ ΔbestRank ≥ +10 (the v7.1 candidate) | 16 | 31.3% (14.2%–55.6%) | -32.9% | -6.48u | -1.27 | 0.202 |
| Σ=+4 ∧ ΔbestRank ≥ +50 | 13 | 30.8% (12.7%–57.6%) | -34.4% | -3.93u | -1.20 | 0.230 |
| Σ=+4 ∧ bestRank_for ≤ 25 | 10 | 30.0% (10.8%–60.3%) | -36.7% | -5.30u | -1.13 | 0.257 |
| Σ=+4 ∧ agW = 0 (no proven opposition) | 8 | 25.0% (7.1%–59.1%) | -47.0% | -5.75u | -1.35 | 0.177 |
| Σ=+4 ∧ qAg = 0 (no quality opposition) | 8 | 25.0% (7.1%–59.1%) | -47.0% | -5.75u | -1.35 | 0.177 |
| Σ=+4 ∧ regime = CLEAR_MOVE | 2 | 100.0% (34.2%–100.0%) | +134.0% ✓ | +4.10u | 16.75 | 0.000 |
| Σ=+4 ∧ regime ∈ {CLEAR_MOVE, NEAR_START}  (kill SMALL_MOVE bleeders) | 15 | 40.0% (19.8%–64.3%) | -15.4% | -2.46u | -0.55 | 0.580 |
| Σ=+4 ∧ market ∈ {ML, TOTAL}  (kill SPREAD bleeders) | 17 | 41.2% (21.6%–64.0%) | -14.4% | -3.22u | -0.56 | 0.577 |
| Σ=+4 ∧ Δw = +3 (high winner margin only — Δw=+3 ∧ Δq=+1 cell) | 1 | 100.0% (20.7%–100.0%) | +90.9% | +1.82u | — | — |
| Σ=+4 ∧ Δw = +2 (the middle cell — 2/2) | 9 | 33.3% (12.1%–64.6%) | -27.2% | -1.66u | -0.74 | 0.458 |
| Σ=+4 ∧ Δw = +1 ∧ Δq = +3 (high quality margin only) | 5 | 40.0% (11.8%–76.9%) | -22.0% | -2.08u | -0.46 | 0.644 |
| Σ=+4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE | 13 | 30.8% (12.7%–57.6%) | -31.8% | -4.96u | -1.08 | 0.282 |
| Σ=+4 ∧ ΔbestRank ≥ +10 ∧ market ∈ {ML, TOTAL} | 15 | 33.3% (15.2%–58.3%) | -28.5% | -5.73u | -1.05 | 0.295 |

---
## §3. Combined-floor projections — what would each new floor LOOK like?

Each row simulates a candidate v7.1 LOCK floor. The "vs v7.0" column compares against the current Σ ≥ +5 baseline.

| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p | lift vs v7.0 |
|---|---|---|---|---|---|---|---|
| v7.0 baseline (Σ ≥ +5) | 32 | 65.6% (48.3%–79.6%) | +40.8% | +10.55u | 1.75 | 0.081 | +0.0% |
| Σ ≥ +4  (fully lower the floor — NO gate) | 47 | 57.4% (43.3%–70.5%) | +22.2% | +8.63u | 1.20 | 0.229 | -18.6% |
| Σ ≥ +4 ∧ ΔbestRank ≥ +10  (lower + v7.1 quality gate) | 41 | 58.5% (43.4%–72.2%) | +26.0% | +11.27u | 1.28 | 0.199 | -14.8% |
| Σ ≥ +4 ∧ regime ≠ SMALL_MOVE  (kill the SMALL_MOVE bleeder) | 40 | 60.0% (44.6%–73.7%) | +30.5% | +13.77u | 1.49 | 0.137 | -10.3% |
| Σ ≥ +4 ∧ market ≠ SPREAD | 39 | 59.0% (43.4%–72.9%) | +27.7% | +9.31u | 1.32 | 0.187 | -13.1% |
| Σ ≥ +4 ∧ regime ≠ SMALL_MOVE ∧ market ≠ SPREAD | 32 | 62.5% (45.3%–77.1%) | +39.4% | +14.45u | 1.64 | 0.101 | -1.4% |
| Σ ≥ +4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE | 34 | 61.8% (45.0%–76.1%) | +36.7% | +16.41u | 1.59 | 0.112 | -4.2% |
| "split floor": Σ ≥ +5 OR (Σ = +4 ∧ Δw = +3)  (only rescue 3/1 cell) | 33 | 66.7% (49.6%–80.2%) | +42.3% | +12.37u | 1.86 | 0.062 | +1.5% |
| "split floor": Σ ≥ +5 OR (Σ = +4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE) | 42 | 57.1% (42.2%–70.9%) | +23.1% | +7.63u | 1.16 | 0.247 | -17.7% |

Reading the table. v7.0 baseline is **N=32 · 65.6% WR · +40.8% flat ROI**. A floor that adds N without crashing flat ROI is interesting; one that holds flat ROI roughly steady while bumping N is a real win. A floor that lifts ROI by gating Σ=+4 selectively (the "split floor" rows) is the most product-friendly option.

---
## §4. Per-day volume / PnL impact of lowering the floor

How many extra picks per day would land in LOCK if we lowered the floor, and what would they have produced? Flat-1u P&L is reported for the extra picks.

| date | σ≥+5 N | σ≥+5 flat | extra σ=+4 N | extra σ=+4 flat | σ≥+4 (gated) N | σ≥+4 (gated) flat |
|---|---|---|---|---|---|---|
| 2026-04-18 | 2 | +1.72u | 0 | +0.00u | 2 | +1.72u |
| 2026-04-19 | 4 | +5.79u | 0 | +0.00u | 4 | +5.79u |
| 2026-04-20 | 2 | -2.00u | 2 | +0.26u | 4 | -1.74u |
| 2026-04-21 | 4 | +8.43u | 3 | -3.00u | 7 | +5.43u |
| 2026-04-22 | 2 | +1.17u | 0 | +0.00u | 2 | +1.17u |
| 2026-04-23 | 3 | +1.19u | 1 | -1.00u | 4 | +0.19u |
| 2026-04-24 | 0 | +0.00u | 1 | -1.00u | 0 | +0.00u |
| 2026-04-25 | 4 | -1.80u | 1 | -1.00u | 4 | -1.80u |
| 2026-04-26 | 2 | +1.25u | 3 | +2.81u | 3 | +2.23u |
| 2026-04-27 | 3 | -1.80u | 2 | -0.13u | 4 | -2.80u |
| 2026-04-28 | 4 | -2.09u | 1 | -1.00u | 5 | -3.09u |
| 2026-04-29 | 2 | +1.21u | 1 | +1.42u | 3 | +2.63u |

"σ≥+4 (gated)" = `Σ ≥ +5 OR (Σ = +4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE)` — the most defensible split-floor candidate from §3.

---
## §5. Verdict scaffolding

Read §1 + §2 first to know if any subset of Σ=+4 is rescuable, then §3 to compare candidate floors against the v7.0 baseline. Sanity rules:

1. **Don't lower the floor unconditionally** if §3's `Σ ≥ +4 (no gate)` row drops flat ROI by more than 10pp vs v7.0 baseline — the volume gain isn't worth the ROI hit.
2. **Consider a split-floor (Σ ≥ +5 OR gated Σ=+4)** if §3's split rows hold flat ROI within 5pp of baseline AND add ≥ 5 picks. The gate must clear N ≥ 8 in §2 to be credible.
3. **Only act if §4 shows positive cumulative flat-1u PnL** on the extra picks across the sample. If the extras lose money in aggregate, the gate isn't doing its job.
4. If no candidate clears these bars, the conclusion is **keep Σ ≥ +5 LOCK; possibly tighten LEAN sizing to 0u**. The data isn't supporting volume expansion at this sample size.
