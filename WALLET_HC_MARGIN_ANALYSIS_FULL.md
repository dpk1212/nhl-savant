# WALLET HC MARGIN ANALYSIS — FULL UNIVERSE (LOCKED + LEAN + SHADOW + MUTED + CANCELLED)

Generated: 4/30/2026, 8:28:04 PM ET · sample 207 sides · 2026-04-18 → 2026-04-30 (13 days)

**Why this analysis exists.** The shipped-only HC margin analysis (`WALLET_HC_MARGIN_ANALYSIS.md`) only looked at the ~89 picks that cleared the lock floor. This expands the lens to **every side ever written to Firestore since v6 cutover** — including the SHADOW (didn't qualify), MUTED (signal faded), and CANCELLED (winners-against) cohorts. The question: does HC margin select winners even in the killed cohorts? If yes, the floor / mute / cancel rules are over-aggressive.

**Sample.** Every graded side (`outcome ∈ {WIN, LOSS}`) since 2026-04-18 with `superseded ≠ true`. NO floor / state / star filters.

---
## §0. State distribution + baseline WR/ROI per state

| State | N | W-L | WR | flat ROI | net flat |
|---|---|---|---|---|---|
| LOCKED | 105 | 49-56 | 46.7% | -7.0% | -7.34u |
| LEAN | 5 | 1-4 | 20.0% | -51.6% | -2.58u |
| SHADOW | 9 | 4-5 | 44.4% | -8.5% | -0.76u |
| MUTED | 81 | 40-41 | 49.4% | -5.8% | -4.73u |
| CANCELLED | 7 | 5-2 | 71.4% | +21.0% | +1.47u |
| **TOTAL** | **207** | **99-108** | **47.8%** | **-6.7%** | **-13.94u** |

---
## §1. State × HC margin tier matrix

Three HC margin tiers within each state. Cells with N < 3 are noise (shown for inventory).

| State | HC_m ≤0 (n / WR / ROI) | HC_m = +1 (n / WR / ROI) | HC_m ≥ +2 (n / WR / ROI) |
|---|---|---|---|
| LOCKED | 73 / 34% / -28% | 16 / 69% / +27% | 10 / 90% / +77% |
| LEAN | 3 / 33% / -19% | 2 / 0% / -100% | — |
| SHADOW | 8 / 50% / +3% | — | — |
| MUTED | 65 / 43% / -19% | 10 / 80% / +59% | 3 / 100% / +86% |
| CANCELLED | 5 / 60% / +2% | 2 / 100% / +68% | — |

---
## §2. THE OVERRIDE TEST — does HC margin save MUTED / CANCELLED picks?

If MUTED / CANCELLED picks with positive HC margin actually win, the health-engine MUTE/CANCEL rules are over-aggressive and HC margin should override them.

### MUTED cohort (N=81 total)

| HC margin | n | W-L | WR | flat ROI | net flat | Δw / Δq context |
|---|---|---|---|---|---|---|
| ≤−1 | 8 | 3-5 | 37.5% | -23.8% | -1.91u | avg Δw=0.8 Δq=1.6 |
| = 0 | 57 | 25-32 | 43.9% | -18.2% | -10.38u | avg Δw=0.9 Δq=1.3 |
| = +1 | 10 | 8-2 | 80.0% | +59.4% | +5.94u | avg Δw=1.2 Δq=1.7 |
| ≥ +2 | 3 | 3-0 | 100.0% | +85.6% | +2.57u | avg Δw=3.0 Δq=2.3 |

**MUTED ∧ HC_m ≥ +1 vs ≤ 0:** WR diff = +41.5 pp · ROI diff = +84.3% · z-test p = 0.006

### CANCELLED cohort (N=7 total)

| HC margin | n | W-L | WR | flat ROI | net flat | Δw / Δq context |
|---|---|---|---|---|---|---|
| ≤−1 | 0 | — | — | — | — | — |
| = 0 | 5 | 3-2 | 60.0% | +2.3% | +0.11u | avg Δw=1.2 Δq=1.8 |
| = +1 | 2 | 2-0 | 100.0% | +67.9% | +1.36u | avg Δw=1.0 Δq=2.0 |
| ≥ +2 | 0 | — | — | — | — | — |

**CANCELLED ∧ HC_m ≥ +1 vs ≤ 0:** WR diff = +40.0 pp · ROI diff = +65.6% · z-test p = 0.290

---
## §3. THE FLOOR-LOWER TEST — does HC margin save SHADOW picks?

SHADOW picks didn't qualify for the lock floor (Δw < +1 OR Δq < +1 OR Σ < +3, depending on era). If SHADOW + HC_m ≥ +1 actually wins, we should consider letting HC margin promote SHADOW → LEAN/LOCK.

SHADOW cohort total: **N=9**

| HC margin | n | W-L | WR | flat ROI | net flat | avg Δw / avg Δq |
|---|---|---|---|---|---|---|
| ≤−1 | 0 | — | — | — | — | — |
| = 0 | 8 | 4-4 | 50.0% | +3.0% | +0.24u | 0.4 / 1.3 |
| = +1 | 0 | — | — | — | — | — |
| ≥ +2 | 0 | — | — | — | — | — |

---
## §4. Per-Σ × HC margin tier — FULL SAMPLE (all states)

Same Test 1 from `WALLET_HC_MARGIN_ANALYSIS.md` but on the full universe (no state filter, no Δw/Δq floor).
Bucket by Σ all the way down to Σ ≤ 0 — so we see the killed cohorts.

| Σ | total N | HC_m ≤0 (n / WR / ROI) | HC_m =+1 (n / WR / ROI) | HC_m ≥+2 (n / WR / ROI) |
|---|---|---|---|---|
| Σ≤0 | 14 | 13 / 31% / -43% | 1 / 100% / +6% | — |
| Σ=1 | 29 | 27 / 22% / -59% | 2 / 50% / -3% | — |
| Σ=2 | 43 | 35 / 37% / -30% | 8 / 63% / +37% | — |
| Σ=3 | 30 | 27 / 63% / +23% | 2 / 100% / +66% | 1 / 100% / +105% |
| Σ=4 | 34 | 25 / 40% / -20% | 8 / 63% / +14% | 1 / 100% / +33% |
| Σ=5 | 17 | 13 / 54% / +35% | 1 / 100% / +67% | 3 / 100% / +90% |
| Σ=6 | 14 | 8 / 25% / -53% | 4 / 75% / +37% | 2 / 100% / +84% |
| Σ≥7 | 26 | 6 / 33% / -32% | 4 / 75% / +53% | 6 / 83% / +74% |

### §4b. Lift_WR / Lift_ROI by Σ — full sample, HC_m ≥ +1 vs ≤ 0

| Σ | OUT (≤0) WR / ROI | IN (≥+1) WR / ROI | Lift_WR | Lift_ROI | z-test p |
|---|---|---|---|---|---|
| Σ≤0 | 31% / -43% | 100% / +6% | +69.2 | +49.3% | — |
| Σ=1 | 22% / -59% | 50% / -3% | +27.8 | +55.7% | 0.376 |
| Σ=2 | 37% / -30% | 63% / +37% | +25.4 | +67.0% | 0.190 |
| Σ=3 | 63% / +23% | 100% / +79% | +37.0 | +56.5% | 0.197 |
| Σ=4 | 40% / -20% | 67% / +16% | +26.7 | +36.1% | 0.169 |
| Σ=5 | 54% / +35% | 100% / +84% | +46.2 | +49.4% | 0.091 |
| Σ=6 | 25% / -53% | 83% / +53% | +58.3 | +106.1% | 0.031 |
| Σ≥7 | 33% / -32% | 80% / +65% | +46.7 | +97.5% | 0.062 |
| **Pooled** | weighted | weighted | **+38.4 pp** | **+70.3%** | (positive in **7/7** evaluated buckets) |

---
## §5. Verdict & action

**Read §2.** If MUTED ∧ HC_m ≥ +1 has WR ≥ 55% AND p < 0.20 (and N ≥ 5), the health engine is over-muting picks that have HC backing. Consider an HC-margin override on MUTE.

**Read §2 (CANCELLED).** If CANCELLED ∧ HC_m ≥ +1 has WR ≥ 55% AND N ≥ 5, even the strong-dissent CANCEL rule is too aggressive. (Less likely to fire — CANCEL fires when ≥2 proven winners are AGAINST, which usually correlates with HC dissent too.)

**Read §3.** If SHADOW ∧ HC_m ≥ +1 has WR ≥ 55% AND p < 0.10 (and N ≥ 10), HC margin should be allowed to PROMOTE SHADOW picks — i.e. the lock floor (currently Σ ≥ +3) should be relaxed for HC-backed picks.

**Read §4b.** If pooled Lift_WR ≥ +20 pp on the FULL sample (currently +38 pp on shipped-only), the HC margin signal is universal — even stronger than the shipped-only analysis suggested.

**Sample warning.** Each killed-state × HC_m cell is small. Treat any single cell with N < 5 as directional only; require N ≥ 10 before changing production rules.
