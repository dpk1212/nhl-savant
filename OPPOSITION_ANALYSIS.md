# Opposition Analysis — does it matter beyond Δw / Δq?

Generated: 4/29/2026, 7:00:43 PM ET

**Question.** Under v7.0 the lock floor is driven by (Δw, Δq) and Σ. But "Δw=+2 with 0 opposition" (forW=2/agW=0) and "Δw=+2 with 6 opposition" (forW=8/agW=6) are very different pictures of contested edge. This report tests whether the absolute opposition counts (`agW` for proven-winner pushback, `qAg` for quality-wallet pushback) carry predictive information **above and beyond** the margins.

**Coverage.** 97 graded sides · 2026-04-18 → 2026-04-28 (11 days) · sports: MLB, NBA, NHL. Inclusion mirrors the live Pick Performance dashboard. 0 sides used walletDetails fallback because the frozen `v8_walletConsensusForW/AgW` stamp was missing (typical for the very first cutover days when the whitelist cache was still warming).

Statistical convention: `flat ROI` = mean profit per pick at 1u flat staking. `✓` next to a flat ROI marks t-test against zero clearing p < 0.05 (two-tailed). Wilson 95% CIs reported on key WR cells.

---
## §1. Univariate predictiveness

Pearson ρ between each raw signal and the flat-1u outcome (positive = signal predicts wins). `✓` = p < 0.05 by Fisher r-to-z.

| Feature | ρ vs flat outcome | p | sig | notes |
|---|---|---|---|---|
| Δw (winner margin) | 0.335 | 0.001 | ✓ | baseline |
| Δq (quality margin) | 0.204 | 0.045 | ✓ | baseline |
| Σ = Δw + Δq | 0.321 | 0.001 | ✓ | v7.0 floor signal |
| forW (proven for-side) | 0.260 | 0.010 | ✓ | how many whales backing |
| agW (proven against) | -0.088 | 0.390 |  | absolute opposition |
| qFor (quality for) | 0.135 | 0.188 |  | high-contribution backing |
| qAg (quality against) | -0.052 | 0.613 |  | high-contribution opposition |
| forW + qFor (raw stack) | 0.212 | 0.036 | ✓ | total weight on side |
| agW + qAg (raw push) | -0.069 | 0.504 |  | total opposing weight |
| −agW (negated) | 0.088 | 0.390 |  | sign-aligned with "edge" |

If `agW` (or `qAg`) shows a meaningful negative ρ on its own, opposition is a real predictor in raw form. If it's ~0, opposition only matters through its contribution to Δw (which is forW − agW).

---
## §2. Margin-constant splits

Hold Δw (or Δq) fixed and split by opposition. If "clean" picks materially beat "contested" picks at the same margin, that's a real opposition signal beyond Δ.

### §2a. Within each Δw level — split by `agW`

| Δw | agW = 0 (clean) | agW = 1 | agW ≥ 2 (contested) |
|---|---|---|---|
| Δw=1+ (N=29) | 22p / 11-11 · 50.0% · -8.8% flat | 7p / 4-3 · 57.1% · +13.5% flat | — · — · — |
| Δw=2+ (N=23) | 19p / 8-11 · 42.1% · -16.3% flat | 2p / 1-1 · 50.0% · -6.5% flat | 2p / 0-2 · 0.0% · -100.0% flat |
| Δw=3+ (N=15) | 11p / 7-4 · 63.6% · +62.3% flat | 3p / 2-1 · 66.7% · +8.5% flat | 1p / 1-0 · 100.0% · +20.0% flat |
| Δw=4+ (N=2) | 1p / 1-0 · 100.0% · +120.0% flat | 1p / 1-0 · 100.0% · +315.0% flat | — · — · — |

### §2b. Within each Δq level — split by `qAg`

| Δq | qAg = 0 (clean) | qAg = 1 | qAg ≥ 2 (contested) |
|---|---|---|---|
| Δq=1 (N=26) | 5p / 1-4 · 20.0% · -62.0% flat | 16p / 7-9 · 43.8% · -16.9% flat | 5p / 2-3 · 40.0% · -17.8% flat |
| Δq=2 (N=30) | 15p / 7-8 · 46.7% · -8.2% flat | 8p / 3-5 · 37.5% · -23.2% flat | 7p / 4-3 · 57.1% · +7.3% flat |
| Δq=3 (N=15) | 8p / 4-4 · 50.0% · -7.8% flat | 2p / 1-1 · 50.0% · -4.1% flat | 5p / 1-4 · 20.0% · +15.0% flat |
| Δq=4 (N=11) | 3p / 1-2 · 33.3% · -31.7% flat | 6p / 4-2 · 66.7% · +37.8% flat | 2p / 1-1 · 50.0% · -40.0% flat |
| Δq=5 (N=5) | 3p / 2-1 · 66.7% · +28.4% flat | 1p / 1-0 · 100.0% · +87.7% flat | 1p / 1-0 · 100.0% · +315.0% flat |

### §2c. Within each Σ level — split by total opposition `(agW + qAg)`

| Σ | opp = 0 (clean) | opp = 1 | opp = 2 | opp ≥ 3 (heavy) |
|---|---|---|---|---|
| Σ=3 (N=19) | 8p / 4-4 · 50.0% · -6.4% flat | 9p / 5-4 · 55.6% · +11.1% flat | — · — · — | 2p / 0-2 · 0.0% · -100.0% flat |
| Σ=4 (N=17) | 8p / 2-6 · 25.0% · -47.0% flat | 3p / 1-2 · 33.3% · -36.1% flat | 2p / 2-0 · 100.0% · +105.5% flat ✓ | 4p / 1-3 · 25.0% · -53.3% flat |
| Σ=5 (N=11) | 2p / 1-1 · 50.0% · +2.5% flat | 3p / 1-2 · 33.3% · -20.0% flat | 5p / 3-2 · 60.0% · +31.2% flat | 1p / 1-0 · 100.0% · +120.0% flat |
| Σ=6 (N=9) | 5p / 4-1 · 80.0% · +46.7% flat | — · — · — | 2p / 0-2 · 0.0% · -100.0% flat | 2p / 1-1 · 50.0% · +187.5% flat |
| Σ=7 (N=6) | 3p / 1-2 · 33.3% · -36.4% flat | 1p / 1-0 · 100.0% · +87.7% flat | 1p / 1-0 · 100.0% · +90.9% flat | 1p / 1-0 · 100.0% · +20.0% flat |
| Σ=8 (N=3) | 1p / 0-1 · 0.0% · -100.0% flat | 2p / 2-0 · 100.0% · +58.3% flat | — · — · — | — · — · — |

Cells: `N · W-L · WR · flat ROI`. Right-shift = more opposition. If the right column is materially worse than the left at the same Σ, opposition is a real separator.

---
## §3. (Δw × agW) cross-tab — full matrix

Each cell shows N · WR · flat ROI. Read down a column to see how each level of opposition performs across margins; read across to see how each margin scales with opposition.

| Δw \\ agW | agW=0 | agW=1 | agW=2 | agW=3 | agW=4 | row total |
|---|---|---|---|---|---|---|
| **Δw=0** | 14 · 29% · -45% | 5 · 20% · -56% | 1 · 0% · -100% | — | 1 · 100% · +33% | 21p / 6-15 · 28.6% · -46.8% flat ✓ |
| **Δw=1** | 22 · 50% · -9% | 7 · 57% · +14% | — | — | — | 29p / 15-14 · 51.7% · -3.4% flat |
| **Δw=2** | 19 · 42% · -16% | 2 · 50% · -7% | 1 · 0% · -100% | 1 · 0% · -100% | — | 23p / 9-14 · 39.1% · -22.7% flat |
| **Δw=3** | 11 · 64% · +62% | 3 · 67% · +8% | — | — | 1 · 100% · +20% | 15p / 10-5 · 66.7% · +48.7% flat |
| **Δw=4** | 1 · 100% · +120% | 1 · 100% · +315% | — | — | — | 2p / 2-0 · 100.0% · +217.5% flat ✓ |

---
## §4. (Δq × qAg) cross-tab

| Δq \\ qAg | qAg=0 | qAg=1 | qAg=2 | qAg=3 | qAg=4 | qAg=5 | qAg=6 | qAg=7 | qAg=9 | row total |
|---|---|---|---|---|---|---|---|---|---|---|
| **Δq=0** | — | — | 2 · 0% · -100% | 1 · 0% · -100% | — | 1 · 0% · -100% | — | — | — | 4p / 0-4 · 0.0% · -100.0% flat |
| **Δq=1** | 5 · 20% · -62% | 16 · 44% · -17% | 2 · 50% · -5% | 1 · 100% · +120% | 1 · 0% · -100% | 1 · 0% · -100% | — | — | — | 26p / 10-16 · 38.5% · -25.7% flat |
| **Δq=2** | 15 · 47% · -8% | 8 · 38% · -23% | 4 · 75% · +54% | — | 2 · 50% · -33% | — | 1 · 0% · -100% | — | — | 30p / 14-16 · 46.7% · -8.6% flat |
| **Δq=3** | 8 · 50% · -8% | 2 · 50% · -4% | 2 · 0% · -100% | 3 · 33% · +92% | — | — | — | — | — | 15p / 6-9 · 40.0% · +0.3% flat |
| **Δq=4** | 3 · 33% · -32% | 6 · 67% · +38% | 1 · 0% · -100% | — | — | — | — | 1 · 100% · +20% | — | 11p / 6-5 · 54.5% · +4.7% flat |
| **Δq=5** | 3 · 67% · +28% | 1 · 100% · +88% | 1 · 100% · +315% | — | — | — | — | — | — | 5p / 4-1 · 80.0% · +97.6% flat |
| **Δq=6** | 1 · 0% · -100% | 1 · 100% · +91% | — | — | — | — | — | — | — | 2p / 1-1 · 50.0% · -4.5% flat |
| **Δq=7** | 1 · 0% · -100% | 1 · 100% · +26% | 1 · 100% · +34% | — | — | — | — | — | — | 3p / 2-1 · 66.7% · -13.3% flat |

---
## §5. Dominance ratios

`winnerDom` = forW / (forW + agW) — what fraction of proven whales are with us. Same for quality. Ratios collapse the (forW, agW) plane to one number that's scale-free.

### §5a. winner-dominance bins (forW / (forW + agW))

| winnerDom | cohort |
|---|---|
| < 50% (minority pick) | 7p / 1-6 · 14.3% · -70.6% flat ✓ |
| 50–75% | 17p / 7-10 · 41.2% · -25.4% flat |
| 75–100% | 6p / 4-2 · 66.7% · +54.6% flat |
| = 100% (no proven opposition) | 53p / 27-26 · 50.9% · +5.7% flat |

### §5b. quality-dominance bins (qFor / (qFor + qAg))

| qualityDom | cohort |
|---|---|
| < 50% | 1p / 0-1 · 0.0% · -100.0% flat |
| 50–75% | 38p / 15-23 · 39.5% · -16.1% flat |
| 75–100% | 22p / 13-9 · 59.1% · +22.1% flat |
| = 100% (no quality opposition) | 36p / 15-21 · 41.7% · -19.6% flat |

---
## §6. Logistic regression — opposition incremental fit

Three nested models on outcome ∈ {0, 1}. All features z-scored before fit. McFadden pseudo-R² shows incremental explanatory power. If model B (margins+opposition) noticeably beats model A (margins only), opposition adds signal.

### §6a. Model A — baseline (margins only)

Features: `Δw, Δq`  · McFadden R² = **0.079**

- β(Δw) = 0.524  ·  β(Δq) = 0.361  ·  intercept = -0.259

### §6b. Model B — margins + opposition

Features: `Δw, Δq, agW, qAg`  · McFadden R² = **0.093**

- β(Δw) = 0.654  ·  β(Δq) = 0.301  ·  β(agW) = 0.397  ·  β(qAg) = -0.454  ·  intercept = -0.273

### §6c. Model C — raw counts (no margins)

Features: `forW, agW, qFor, qAg`  · McFadden R² = **0.093**

- β(forW) = 0.699  ·  β(agW) = -0.028  ·  β(qFor) = 0.320  ·  β(qAg) = -0.726  ·  intercept = -0.271

**Δ R² (B − A) = +0.014.** Opposition adds non-trivial fit beyond the margins.

---
## §7. Opposition-gated v7.1 floor candidates

What if v7.0 (`Σ ≥ +5`) added an opposition gate? Each row below is a candidate floor; metrics are over the same dashboard-truth sample. The "lift vs Σ≥+5" column compares flat ROI against the v7.0 baseline.

| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p | lift vs v7.0 |
|---|---|---|---|---|---|---|---|
| v7.0 baseline (Σ ≥ +5) | 30 | 63.3% (45.5%–78.1%) | +39.5% | +7.85u | 1.59 | 0.113 | +0.0% |
| Σ ≥ +5 ∧ agW = 0 | 23 | 56.5% (36.8%–74.4%) | +26.5% | -0.93u | 0.91 | 0.362 | -13.0% |
| Σ ≥ +5 ∧ agW ≤ 1 | 29 | 62.1% (44.0%–77.3%) | +40.2% | +7.25u | 1.56 | 0.119 | +0.7% |
| Σ ≥ +5 ∧ qAg = 0 | 10 | 60.0% (31.3%–83.2%) | +13.0% | +0.65u | 0.42 | 0.675 | -26.6% |
| Σ ≥ +5 ∧ qAg ≤ 1 | 20 | 65.0% (43.3%–81.9%) | +24.0% | +7.24u | 1.12 | 0.262 | -15.5% |
| Σ ≥ +5 ∧ (agW + qAg) ≤ 1 | 16 | 62.5% (38.6%–81.5%) | +17.1% | +3.24u | 0.71 | 0.477 | -22.4% |
| Σ ≥ +5 ∧ (agW + qAg) = 0  (strict clean lock) | 10 | 60.0% (31.3%–83.2%) | +13.0% | +0.65u | 0.42 | 0.675 | -26.6% |
| Σ ≥ +4 ∧ agW = 0 (rescue floor with clean gate) | 33 | 51.5% (35.2%–67.5%) | +12.6% | -4.18u | 0.56 | 0.578 | -26.9% |
| Σ ≥ +4 ∧ qAg = 0 | 17 | 47.1% (26.2%–69.0%) | -8.6% | -3.35u | -0.35 | 0.724 | -48.1% |
| Σ ≥ +3 ∧ (agW + qAg) = 0 (cleanest possible) | 24 | 50.0% (31.4%–68.6%) | -4.1% | -2.93u | -0.20 | 0.840 | -43.6% |

Reading the table: a floor that **shrinks N moderately while lifting flat ROI by ≥ +10pp** is a real win. A floor that lifts ROI but cuts N below ~15 is over-fit to noise. The v7.0 baseline is **N=30 · 63.3% WR · +39.5% flat ROI**.

---
## §8. Verdict

Read the report end-to-end before tightening the floor — opposition signals are noisy at small N. Sanity rules:

1. If §1 shows ρ(agW, outcome) is near zero AND §6 ΔR² (B−A) < 0.005 → opposition is **already absorbed** by Δw. Don't add a gate.
2. If §2c shows Σ=+5 cells with opp=0 materially beating opp≥3 → opposition IS a separator at fixed Σ. Worth a floor candidate from §7.
3. Pick a §7 candidate only if (a) lift ≥ +10pp flat ROI, (b) N ≥ 20, (c) t-stat ≥ 1.96.
