# Quality-Weighted Margin Analysis — does WHO matters beyond HOW MANY?

Generated: 4/29/2026, 7:12:56 PM ET

**Question.** v7.0 uses count-based margins: Δw = forW − agW, Δq = qFor − qAg. Every whitelisted whale counts equally. But `peak.v8Scoring.walletDetails[]` already snapshots each wallet's leaderboard rank, walletBase quality score, normalized ROI, and lifetime ROI **at stamp time**. So we can construct quality-weighted margins (e.g. Σ`walletBase`_for − Σ`walletBase`_against, Σ(1/rank)_for − Σ(1/rank)_against, single best-wallet differential) and test whether they predict outcomes better than raw counts.

**Coverage.** 98 graded sides · 2026-04-18 → 2026-04-29 (12 days) · sports: MLB, NBA, NHL.

**Quality-field availability** (per-side): walletBase populated on 98/98 (100.0%); leaderboard rank populated on at least one wallet on 98/98 (100.0%); best-rank on for-side present on 98/98 (100.0%). Inclusion mirrors the live Pick Performance dashboard.

---
## §1. Univariate predictiveness

Pearson ρ between each candidate signal and the flat-1u outcome. The first two rows are the v7.0 count-based baseline; everything below is a quality-weighted alternative. `✓` = p < 0.05 by Fisher r-to-z.

| Feature | ρ vs flat outcome | p | sig |
|---|---|---|---|
| Δw (count, baseline) | 0.335 | 0.001 | ✓ |
| Δq (count, baseline) | 0.205 | 0.042 | ✓ |
| Σ = Δw + Δq (v7.0 floor) | 0.322 | 0.001 | ✓ |
| ΔwalletBase  (Σ base_for − Σ base_against) | 0.093 | 0.364 |  |
| ΔrankInv     (Σ 1/rank_for − Σ 1/rank_ag) | 0.014 | 0.892 |  |
| ΔroiNorm     (Σ roiNorm_for − Σ roiNorm_ag) | 0.075 | 0.463 |  |
| ΔlifetimeRoi (Σ raw lifetime ROI delta) | 0.033 | 0.748 |  |
| ΔcontribQ    (Σ contrib≥30 weight) | 0.095 | 0.355 |  |
| ΔbestRank    (best wallet rank advantage) | -0.064 | 0.534 |  |
| meanBase_for (avg quality on our side) | -0.002 | 0.982 |  |

**How to read.** If a quality-weighted feature (`ΔwalletBase`, `ΔrankInv`, `ΔroiNorm`) clearly beats Δw / Σ on ρ, that's evidence WHO matters beyond HOW MANY. If they cluster around the count-based ρ, quality is already absorbed by counts.

---
## §2. Quality at fixed Σ

Hold the count-based Σ constant and split each cell by quality. If the top-quartile bucket of `ΔwalletBase` (or `ΔrankInv`) materially beats the bottom quartile at the same Σ, we're leaving edge on the table by treating all whales equally.

### §2a. Within each Σ — split by `ΔwalletBase` (low vs high quality stack)

| Σ | low ΔwalletBase (bottom 25%) | high ΔwalletBase (top 25%) | high − low (flat ROI lift) |
|---|---|---|---|
| Σ=3 (N=20) | 5p / 3-2 · 60.0% · +16.7% flat | 5p / 1-4 · 20.0% · -59.2% flat | -75.9% |
| Σ=4 (N=17) | 4p / 2-2 · 50.0% · +4.2% flat | 4p / 0-4 · 0.0% · -100.0% flat | -104.2% |
| Σ=5 (N=11) | 2p / 2-0 · 100.0% · +130.0% flat ✓ | 2p / 1-1 · 50.0% · -4.5% flat | -134.5% |
| Σ=6 (N=9) | 2p / 1-1 · 50.0% · +187.5% flat | 2p / 1-1 · 50.0% · -2.8% flat | -190.3% |
| Σ=7 (N=6) | 3p / 3-0 · 100.0% · +66.2% flat ✓ | 3p / 1-2 · 33.3% · -36.4% flat | -102.6% |
| Σ=8 (N=3) | — · — · — | — · — · — | — |

### §2b. Within each Σ — split by `ΔrankInv` (low vs high rank-weighted stack)

| Σ | low ΔrankInv (bottom 25%) | high ΔrankInv (top 25%) | high − low (flat ROI lift) |
|---|---|---|---|
| Σ=3 (N=20) | 5p / 4-1 · 80.0% · +58.0% flat | 5p / 1-4 · 20.0% · -60.4% flat | -118.4% |
| Σ=4 (N=17) | 4p / 2-2 · 50.0% · -4.3% flat | 4p / 1-3 · 25.0% · -53.3% flat | -48.9% |
| Σ=5 (N=11) | 2p / 0-2 · 0.0% · -100.0% flat | 2p / 2-0 · 100.0% · +115.5% flat ✓ | +215.5% |
| Σ=6 (N=9) | 2p / 0-2 · 0.0% · -100.0% flat | 2p / 1-1 · 50.0% · -2.8% flat | +97.2% |
| Σ=7 (N=6) | 3p / 2-1 · 66.7% · +3.6% flat | 3p / 2-1 · 66.7% · +26.2% flat | +22.6% |
| Σ=8 (N=3) | — · — · — | — · — · — | — |

### §2c. Within each Δw — split by `meanBase_for` (avg quality of our backers)

| Δw | low meanBase_for (bottom 25%) | high meanBase_for (top 25%) | high − low |
|---|---|---|---|
| Δw=1 (N=30) | 7p / 3-4 · 42.9% · -24.6% flat | 7p / 4-3 · 57.1% · +8.8% flat | +33.4% |
| Δw=2 (N=23) | 5p / 2-3 · 40.0% · -20.2% flat | 5p / 1-4 · 20.0% · -54.8% flat | -34.6% |
| Δw=3 (N=15) | 3p / 1-2 · 33.3% · +91.7% flat | 3p / 3-0 · 100.0% · +48.5% flat ✓ | -43.2% |
| Δw=4 (N=2) | — · — · — | — · — · — | — |

---
## §3. Best-wallet differential

Forget aggregates. Does the *single best-ranked* wallet on each side carry signal? "best wallet on our side ranked top-10" vs "best wallet on our side ranked 50+" at the same Σ.

### §3a. Bins by `bestRank_for` (lower = better)

| bestRank_for | cohort |
|---|---|
| top-5 (rank ≤ 5) | 15p / 6-9 · 40.0% · -20.6% flat |
| top-10 (rank 6–10) | — · — · — |
| top-25 (rank 11–25) | 17p / 6-11 · 35.3% · -28.4% flat |
| 26–50 | 34p / 17-17 · 50.0% · +9.1% flat |
| 50+ | 32p / 14-18 · 43.8% · -17.1% flat |
| no ranked wallet | — · — · — |

### §3b. Bins by `ΔbestRank` (our best vs their best)

Positive = our best wallet outranks theirs. `agBest=999` (no ranked opp wallet) gets bucketed into "very large advantage."

| ΔbestRank | cohort |
|---|---|
| ≥ +50 (huge edge) | 66p / 30-36 · 45.5% · -3.8% flat |
| +10 … +49 | 12p / 5-7 · 41.7% · -21.4% flat |
| +1 … +9 | 3p / 1-2 · 33.3% · -41.8% flat |
| 0 (parity) | 1p / 0-1 · 0.0% · -100.0% flat |
| −1 … −49 (we trail) | 10p / 5-5 · 50.0% · -8.8% flat |
| ≤ −50 (huge deficit) | 6p / 2-4 · 33.3% · -34.6% flat |

---
## §4. Logistic regression — does quality lift fit beyond margins?

Three nested models on outcome ∈ {0, 1}, all features z-scored. McFadden pseudo-R² shows incremental fit. If model B (margins + quality) beats model A (margins only), WHO adds signal beyond HOW MANY.

### §4a. Model A — count baseline

Features: `Δw, Δq`  · McFadden R² = **0.080**

- β(Δw) = 0.526  ·  β(Δq) = 0.364  ·  intercept = -0.280

### §4b. Model B — counts + quality

Features: `Δw, Δq, ΔwalletBase, ΔrankInv`  · McFadden R² = **0.098**

- β(Δw) = 0.507  ·  β(Δq) = 0.929  ·  β(ΔwalletBase) = -0.592  ·  β(ΔrankInv) = -0.053  ·  intercept = -0.269

### §4c. Model C — pure quality (no counts)

Features: `ΔwalletBase, ΔrankInv, ΔroiNorm, ΔbestRank`  · McFadden R² = **0.019**

- β(ΔwalletBase) = 0.047  ·  β(ΔrankInv) = -0.123  ·  β(ΔroiNorm) = 0.320  ·  β(ΔbestRank) = -0.154  ·  intercept = -0.250

**Δ R² (B − A) = +0.018.** Quality is adding non-trivial fit beyond Δw/Δq.

**Δ R² (C − A) = -0.060.** Pure-quality model is weaker than counts — counts encode something quality doesn't.

---
## §5. v7.2 floor candidates — quality-gated locks

What if v7.0 (`Σ ≥ +5`) added a quality gate? Each row is a candidate floor; metrics are over the same dashboard-truth sample. The "lift vs Σ≥+5" column compares flat ROI against the v7.0 baseline.

| Floor | N | WR (95% CI) | flat ROI | peak PnL | t | p | lift vs v7.0 |
|---|---|---|---|---|---|---|---|
| v7.0 baseline (Σ ≥ +5) | 30 | 63.3% (45.5%–78.1%) | +39.5% | +7.85u | 1.59 | 0.113 | +0.0% |
| Σ ≥ +5 ∧ ΔwalletBase ≥ 208 (median of baseline) | 15 | 66.7% (41.7%–84.8%) | +38.9% | +5.99u | 1.27 | 0.203 | -0.6% |
| Σ ≥ +5 ∧ ΔrankInv ≥ 0.06 (median of baseline) | 15 | 66.7% (41.7%–84.8%) | +56.0% | +7.20u | 1.43 | 0.151 | +16.5% |
| Σ ≥ +5 ∧ bestRank_for ≤ 25 (a top-25 whale on our side) | 13 | 61.5% (35.5%–82.3%) | +20.7% | +1.84u | 0.72 | 0.470 | -18.8% |
| Σ ≥ +5 ∧ bestRank_for ≤ 10 (a top-10 whale) | 8 | 62.5% (30.6%–86.3%) | +25.5% | -0.66u | 0.68 | 0.493 | -14.0% |
| Σ ≥ +5 ∧ ΔbestRank ≥ +10 (our best ranks ≥ 10 ahead of theirs) | 27 | 70.4% (51.5%–84.1%) | +55.0% ✓ | +14.85u | 2.12 | 0.034 | +15.5% |
| Σ ≥ +5 ∧ ΔbestRank ≥ 0 (our best matches or beats theirs) | 28 | 67.9% (49.3%–82.1%) | +49.5% | +11.85u | 1.93 | 0.054 | +10.0% |
| Σ ≥ +4 ∧ bestRank_for ≤ 10 (rescue floor, top-10 quality gate) | 11 | 54.5% (28.0%–78.7%) | +8.3% | -0.17u | 0.26 | 0.794 | -31.2% |
| Σ ≥ +4 ∧ ΔwalletBase ≥ 208 | 18 | 55.6% (33.7%–75.4%) | +15.8% | +1.99u | 0.56 | 0.577 | -23.7% |
| pure quality: ΔwalletBase ≥ p75 of all picks (no Σ floor) | 25 | 52.0% (33.5%–70.0%) | +3.3% | -0.73u | 0.15 | 0.883 | -36.2% |

**Reading the table.** A floor that **shrinks N moderately while lifting flat ROI by ≥ +10pp** is a real win. A floor that lifts ROI but cuts N below ~15 is over-fit to noise. The v7.0 baseline is **N=30 · 63.3% WR · +39.5% flat ROI**.

---
## §6. Verdict scaffolding

Read §1 + §4 first to know whether quality is a real lever, then §2 + §5 to see if it's actionable. Sanity rules:

1. If §1 shows ρ(ΔwalletBase) ≤ ρ(Σ) AND §4 ΔR² (B − A) < 0.01 → quality is **already absorbed** by counts. Don't add a quality gate.
2. If §2a/2b shows a consistent flat-ROI lift in the high-quality column at fixed Σ → quality IS a separator at fixed counts. Worth a §5 candidate.
3. Pick a §5 candidate only if (a) lift ≥ +10pp flat ROI, (b) N ≥ 20, (c) t-stat ≥ 1.96.
4. If §3 shows `top-5 / top-10` whale presence vastly outperforms "no ranked wallet" → that's a clean, simple, explainable gate (`bestRank_for ≤ 10`).
