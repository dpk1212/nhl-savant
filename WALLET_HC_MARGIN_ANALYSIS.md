# WALLET HC MARGIN ANALYSIS — does HC margin matter, or is binary dominance the whole signal?

Generated: 4/30/2026, 7:26:19 PM ET · sample 89 picks · 2026-04-18 → 2026-04-29 (12 days)

**The question we missed in v7.1.** The original `WALLET_GATE_SCALE_TEST` proved binary HC dominance (`HC_for ≥ 1 ∧ HC_ag = 0`) scales across all 5 Σ buckets. We never tested whether HC **margin** (`HC_for − HC_ag`) carries additional signal — i.e. is `HC 3-1` better than `HC 1-0`? Does `HC 5-0` outperform `HC 1-0`?

**Lens.** Point-in-time CONFIRMED/FLAT/WR50 tiers (L2, validated). HC = CONFIRMED ∧ sizeRatio ≥ 1.5×.

**Sample.** Every shipped side since v6 cutover with `Δw ≥ +1 ∧ Δq ≥ +1`.

---
## §0. THE HEADLINE TEST — does HC_margin scale across every Σ tier the same way Δw+Δq does?

We treat HC_margin (`HC_for − HC_ag`) like a continuous quality dial — exactly the way Σ is a continuous quality dial — and ask:
1. **At each Σ tier**, does upgrading from HC_margin ≤0 to HC_margin ≥+1 unilaterally improve WR/ROI?
2. At each Σ tier, does upgrading from HC_margin ≤+1 to HC_margin ≥+2 further improve WR/ROI?
3. Should HC_margin alone (without high Σ) be enough to promote a pick?

### Test 1: HC_margin ≥+1 vs ≤0 at each Σ tier

| Σ | HC_m ≤0 (n / WR / ROI) | HC_m ≥+1 (n / WR / ROI) | Lift_WR | Lift_ROI | z-test p |
|---|---|---|---|---|---|
| Σ=2 | 13 / 38.5% / -31.6% | 2 / 50.0% / +6.0% | +11.5 | +37.6% | 0.756 |
| Σ=3 | 12 / 58.3% / +19.2% | 3 / 100.0% / +79.1% | +41.7 | +59.8% | 0.171 |
| Σ=4 | 13 / 30.8% / -41.3% | 6 / 50.0% / -21.4% | +19.2 | +19.9% | 0.419 |
| Σ=5 | 8 / 62.5% / +80.0% | 2 / 100.0% / +78.8% | +37.5 | -1.2% | 0.301 |
| Σ=6 | 6 / 16.7% / -68.2% | 3 / 100.0% / +88.1% | +83.3 | +156.3% | 0.018 |
| Σ≥7 | 5 / 40.0% / -18.5% | 10 / 80.0% / +65.4% | +40.0 | +83.9% | 0.121 |
| **Pooled** | weighted | | **+38.0 pp** | **+64.6%** | (positive in **6/6** comparable buckets) |

### Test 2: HC_margin ≥+2 vs ≤+1 at each Σ tier

| Σ | HC_m ≤+1 (n / WR / ROI) | HC_m ≥+2 (n / WR / ROI) | Lift_WR | Lift_ROI | z-test p |
|---|---|---|---|---|---|
| Σ=2 | 15 / 40.0% / -26.6% | n=0 | — | — | — |
| Σ=3 | 14 / 64.3% / +25.9% | 1 / 100.0% / +105.0% | +35.7 | +79.1% | — |
| Σ=4 | 18 / 33.3% / -38.8% | 1 / 100.0% / +33.3% | +66.7 | +72.1% | — |
| Σ=5 | 9 / 66.7% / +78.5% | 1 / 100.0% / +90.9% | +33.3 | +12.4% | — |
| Σ=6 | 8 / 37.5% / -29.6% | 1 / 100.0% / +91.7% | +62.5 | +121.3% | — |
| Σ≥7 | 9 / 55.6% / +13.1% | 6 / 83.3% / +74.0% | +27.8 | +60.9% | 0.264 |
| **Pooled** | weighted | | **+27.8 pp** | **+60.9%** | (positive in **1/1** comparable buckets) |

### Test 3: HC_margin "rescue test" — can HC_margin alone promote low-Σ picks?

For each Σ tier, what happens to picks WITH HC_margin ≥+1? Do they cross the ship threshold (WR ≥ 55% AND ROI ≥ 0%)?
This tells us if HC_margin can act as a Σ-floor-bypass — i.e. should Σ=2 picks ship if they have HC dominance?

| Σ | HC_m ≥+1 (n / WR / ROI / net) | Ships? | Notes |
|---|---|---|---|
| Σ=2 | 2 / 50.0% / +6.0% / +0.12u | no | sample too small |
| Σ=3 | 3 / 100.0% / +79.1% / +2.37u | **YES** | meets ship threshold |
| Σ=4 | 6 / 50.0% / -21.4% / -1.28u | no | fails ship threshold |
| Σ=5 | 2 / 100.0% / +78.8% / +1.58u | no | sample too small |
| Σ=6 | 3 / 100.0% / +88.1% / +2.64u | **YES** | meets ship threshold |
| Σ≥7 | 10 / 80.0% / +65.4% / +6.54u | **YES** | meets ship threshold |

---
## §1. (HC_for, HC_ag) cell inventory

How often does each HC combination occur in the live sample? Cells with N < 5 are noise.

| HC_for ↓ \ HC_ag → | 0 | 1 | ≥2 |
|---|---|---|---|
| **0** | N=57<br>44% -16% | N=2<br>0% -100% | — |
| **1** | N=16<br>69% +27% | N=4<br>75% +146% | — |
| **2** | N=10<br>90% +77% | — | — |

---
## §2. Per-Σ × per-HC-gate lift matrix

Same methodology as `WALLET_GATE_SCALE_TEST.md` §2. For each gate, we ask: inside each Σ bucket, do IN-gate picks beat OUT-gate picks?
A gate that scales lifts in **all 5** Σ buckets. The current production gate (`G_HC_DOM`) is row 1 — anything else needs to **beat** that row to justify replacing it.

### `G_HC_DOM` — HC_for ≥ 1 ∧ HC_ag = 0   [PRODUCTION v7.1]

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | 2 / 50.0% / +6.0% | 13 / 38.5% / -31.6% | +11.5 | +37.6% | 0.756 |
| Σ=3 | 15 | 3 / 100.0% / +79.1% | 12 / 58.3% / +19.2% | +41.7 | +59.8% | 0.171 |
| Σ=4 | 19 | 6 / 50.0% / -21.4% | 13 / 30.8% / -41.3% | +19.2 | +19.9% | 0.419 |
| Σ=5 | 10 | 2 / 100.0% / +78.8% | 8 / 62.5% / +80.0% | +37.5 | -1.2% | 0.301 |
| Σ=6 | 9 | 3 / 100.0% / +88.1% | 6 / 16.7% / -68.2% | +83.3 | +156.3% | 0.018 |
| Σ≥7 | 21 | 10 / 80.0% / +65.4% | 11 / 54.5% / -1.4% | +25.5 | +66.8% | 0.217 |
| **Pooled** | **89** | weighted | | **+32.4 pp** | **+58.0%** | (positive in **6/6**) |

### `G_HC_M1` — HC margin ≥ +1 (allows dissent)

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | 2 / 50.0% / +6.0% | 13 / 38.5% / -31.6% | +11.5 | +37.6% | 0.756 |
| Σ=3 | 15 | 3 / 100.0% / +79.1% | 12 / 58.3% / +19.2% | +41.7 | +59.8% | 0.171 |
| Σ=4 | 19 | 6 / 50.0% / -21.4% | 13 / 30.8% / -41.3% | +19.2 | +19.9% | 0.419 |
| Σ=5 | 10 | 2 / 100.0% / +78.8% | 8 / 62.5% / +80.0% | +37.5 | -1.2% | 0.301 |
| Σ=6 | 9 | 3 / 100.0% / +88.1% | 6 / 16.7% / -68.2% | +83.3 | +156.3% | 0.018 |
| Σ≥7 | 21 | 10 / 80.0% / +65.4% | 11 / 54.5% / -1.4% | +25.5 | +66.8% | 0.217 |
| **Pooled** | **89** | weighted | | **+32.4 pp** | **+58.0%** | (positive in **6/6**) |

### `G_HC_M2` — HC margin ≥ +2

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | n=0 | 15 / 40.0% / -26.6% | — | — | — |
| Σ=3 | 15 | 1 / 100.0% / +105.0% | 14 / 64.3% / +25.9% | +35.7 | +79.1% | — |
| Σ=4 | 19 | 1 / 100.0% / +33.3% | 18 / 33.3% / -38.8% | +66.7 | +72.1% | — |
| Σ=5 | 10 | 1 / 100.0% / +90.9% | 9 / 66.7% / +78.5% | +33.3 | +12.4% | — |
| Σ=6 | 9 | 1 / 100.0% / +91.7% | 8 / 37.5% / -29.6% | +62.5 | +121.3% | — |
| Σ≥7 | 21 | 6 / 83.3% / +74.0% | 15 / 60.0% / +13.0% | +23.3 | +61.0% | 0.306 |
| **Pooled** | **89** | weighted | | **+23.3 pp** | **+61.0%** | (positive in **1/1**) |

### `G_HC_M3` — HC margin ≥ +3

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | n=0 | 15 / 40.0% / -26.6% | — | — | — |
| Σ=3 | 15 | n=0 | 15 / 66.7% / +31.2% | — | — | — |
| Σ=4 | 19 | n=0 | 19 / 36.8% / -35.0% | — | — | — |
| Σ=5 | 10 | n=0 | 10 / 70.0% / +79.8% | — | — | — |
| Σ=6 | 9 | n=0 | 9 / 44.4% / -16.1% | — | — | — |
| Σ≥7 | 21 | n=0 | 21 / 66.7% / +30.4% | — | — | — |
| **Pooled** | **89** | weighted | | **— pp** | **—%** | (positive in **0/0**) |

### `G_HC2_DOM` — HC_for ≥ 2 ∧ HC_ag = 0   (count tier)

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | n=0 | 15 / 40.0% / -26.6% | — | — | — |
| Σ=3 | 15 | 1 / 100.0% / +105.0% | 14 / 64.3% / +25.9% | +35.7 | +79.1% | — |
| Σ=4 | 19 | 1 / 100.0% / +33.3% | 18 / 33.3% / -38.8% | +66.7 | +72.1% | — |
| Σ=5 | 10 | 1 / 100.0% / +90.9% | 9 / 66.7% / +78.5% | +33.3 | +12.4% | — |
| Σ=6 | 9 | 1 / 100.0% / +91.7% | 8 / 37.5% / -29.6% | +62.5 | +121.3% | — |
| Σ≥7 | 21 | 6 / 83.3% / +74.0% | 15 / 60.0% / +13.0% | +23.3 | +61.0% | 0.306 |
| **Pooled** | **89** | weighted | | **+23.3 pp** | **+61.0%** | (positive in **1/1**) |

### `G_HC3_DOM` — HC_for ≥ 3 ∧ HC_ag = 0

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | n=0 | 15 / 40.0% / -26.6% | — | — | — |
| Σ=3 | 15 | n=0 | 15 / 66.7% / +31.2% | — | — | — |
| Σ=4 | 19 | n=0 | 19 / 36.8% / -35.0% | — | — | — |
| Σ=5 | 10 | n=0 | 10 / 70.0% / +79.8% | — | — | — |
| Σ=6 | 9 | n=0 | 9 / 44.4% / -16.1% | — | — | — |
| Σ≥7 | 21 | n=0 | 21 / 66.7% / +30.4% | — | — | — |
| **Pooled** | **89** | weighted | | **— pp** | **—%** | (positive in **0/0**) |

### `G_HC_TOL1` — HC_for ≥ 1 ∧ HC_ag ≤ 1   (1 dissent OK)

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | 3 / 66.7% / +34.3% | 12 / 33.3% / -41.8% | +33.3 | +76.1% | 0.292 |
| Σ=3 | 15 | 3 / 100.0% / +79.1% | 12 / 58.3% / +19.2% | +41.7 | +59.8% | 0.171 |
| Σ=4 | 19 | 7 / 42.9% / -32.6% | 12 / 33.3% / -36.4% | +9.5 | +3.8% | 0.678 |
| Σ=5 | 10 | 3 / 100.0% / +210.9% | 7 / 57.1% / +23.6% | +42.9 | +187.3% | 0.175 |
| Σ=6 | 9 | 3 / 100.0% / +88.1% | 6 / 16.7% / -68.2% | +83.3 | +156.3% | 0.018 |
| Σ≥7 | 21 | 11 / 81.8% / +70.4% | 10 / 50.0% / -13.5% | +31.8 | +83.9% | 0.122 |
| **Pooled** | **89** | weighted | | **+34.0 pp** | **+79.6%** | (positive in **6/6**) |

### `G_HC_TOL_M` — HC_for ≥ 2 ∧ HC margin ≥ +1

| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |
|---|---|---|---|---|---|---|
| Σ=2 | 15 | n=0 | 15 / 40.0% / -26.6% | — | — | — |
| Σ=3 | 15 | 1 / 100.0% / +105.0% | 14 / 64.3% / +25.9% | +35.7 | +79.1% | — |
| Σ=4 | 19 | 1 / 100.0% / +33.3% | 18 / 33.3% / -38.8% | +66.7 | +72.1% | — |
| Σ=5 | 10 | 1 / 100.0% / +90.9% | 9 / 66.7% / +78.5% | +33.3 | +12.4% | — |
| Σ=6 | 9 | 1 / 100.0% / +91.7% | 8 / 37.5% / -29.6% | +62.5 | +121.3% | — |
| Σ≥7 | 21 | 6 / 83.3% / +74.0% | 15 / 60.0% / +13.0% | +23.3 | +61.0% | 0.306 |
| **Pooled** | **89** | weighted | | **+23.3 pp** | **+61.0%** | (positive in **1/1**) |

---
## §3. Within HC-dominant cohort (HC_ag = 0): does HC_for COUNT add lift?

Subset to picks already passing the production gate (HC_for ≥ 1 ∧ HC_ag = 0). Compare WR/ROI by HC_for tier.
If higher HC_for buckets beat HC_for=1, count matters. If WR/ROI is flat across, count is noise inside the dominance cohort.

HC-dominant cohort total: **N=26**

| HC_for | N | W-L | WR | flat ROI | net flat |
|---|---|---|---|---|---|
| 1 | 16 | 11-5 | 68.8% | +27.0% | +4.32u |
| 2 | 10 | 9-1 | 90.0% | +76.5% | +7.65u |
| ≥3 | 0 | 0-0 | — | —% | +0.00u |

**HC_for=1 vs HC_for≥2 (both dominant):** WR diff = +21.3 pp · ROI diff = +49.5% · z-test p = 0.211

---
## §4. Within HC_for ≥ 1: how much does dissent (HC_ag) hurt?

Subset to picks with at least one HC backer (HC_for ≥ 1). Compare by HC_ag tier.
Key question: is `HC 2-1` (some dissent) genuinely worse than `HC 1-0` (no dissent), or is the binary "dominance" rule more stringent than the data demands?

HC_for ≥ 1 cohort total: **N=30**

| HC_ag | N | W-L | WR | flat ROI | net flat |
|---|---|---|---|---|---|
| 0 | 26 | 20-6 | 76.9% | +46.0% | +11.97u |
| 1 | 4 | 3-1 | 75.0% | +146.5% | +5.86u |
| ≥2 | 0 | 0-0 | — | —% | +0.00u |

**HC_ag=0 vs HC_ag≥1 (both have ≥1 HC for):** WR diff = +1.9 pp · ROI diff = -100.4% · z-test p = 0.933

---
## §5. Per-Σ × HC margin tier

Buckets: HC_margin ∈ {≤0, +1, +2, ≥+3}. Does the lift gradient track the margin gradient, or is +1 already the whole signal?

| Σ | bucket | N | W-L | WR | flat ROI | net flat |
|---|---|---|---|---|---|---|
| Σ=2 | ≤0 | 13 | 5-8 | 38.5% | -31.6% | -4.11u |
| Σ=2 | +1 | 2 | 1-1 | 50.0% | +6.0% | +0.12u |
| Σ=2 | +2 | 0 | — | — | — | — |
| Σ=2 | ≥+3 | 0 | — | — | — | — |
| Σ=3 | ≤0 | 12 | 7-5 | 58.3% | +19.2% | +2.31u |
| Σ=3 | +1 | 2 | 2-0 | 100.0% | +66.1% | +1.32u |
| Σ=3 | +2 | 1 | 1-0 | 100.0% | +105.0% | +1.05u |
| Σ=3 | ≥+3 | 0 | — | — | — | — |
| Σ=4 | ≤0 | 13 | 4-9 | 30.8% | -41.3% | -5.36u |
| Σ=4 | +1 | 5 | 2-3 | 40.0% | -32.3% | -1.62u |
| Σ=4 | +2 | 1 | 1-0 | 100.0% | +33.3% | +0.33u |
| Σ=4 | ≥+3 | 0 | — | — | — | — |
| Σ=5 | ≤0 | 8 | 5-3 | 62.5% | +80.0% | +6.40u |
| Σ=5 | +1 | 1 | 1-0 | 100.0% | +66.7% | +0.67u |
| Σ=5 | +2 | 1 | 1-0 | 100.0% | +90.9% | +0.91u |
| Σ=5 | ≥+3 | 0 | — | — | — | — |
| Σ=6 | ≤0 | 6 | 1-5 | 16.7% | -68.2% | -4.09u |
| Σ=6 | +1 | 2 | 2-0 | 100.0% | +86.3% | +1.73u |
| Σ=6 | +2 | 1 | 1-0 | 100.0% | +91.7% | +0.92u |
| Σ=6 | ≥+3 | 0 | — | — | — | — |
| Σ≥7 | ≤0 | 5 | 2-3 | 40.0% | -18.5% | -0.92u |
| Σ≥7 | +1 | 4 | 3-1 | 75.0% | +52.6% | +2.10u |
| Σ≥7 | +2 | 6 | 5-1 | 83.3% | +74.0% | +4.44u |
| Σ≥7 | ≥+3 | 0 | — | — | — | — |

---
## §6. Verdict

**Decision rule.** A gate replaces production (`G_HC_DOM`) only if it scales (positive in 4+/5 Σ buckets) AND its pooled lift_WR / lift_ROI exceeds production by a meaningful margin.

**Read §2 column "Pooled positive in X/Y".** For each gate:
- 5/5 with bigger pooled lift than `G_HC_DOM` → **graduate**: replace production
- 5/5 with similar pooled lift → **redundant**: production is already capturing the signal
- ≤3/5 → **noise**: don't adopt

**Read §3.** If HC_for=1 vs HC_for≥2 z-test p < 0.10 AND HC_for≥2 has higher WR/ROI, count matters — consider a tiered HC sizing curve (e.g. ×1.5 for HC_for=1, ×1.75 for HC_for≥2).

**Read §4.** If HC_ag=0 vs HC_ag≥1 z-test p > 0.20 OR the WR diff is small, the strict "no dissent" rule is over-tight — consider relaxing to `HC margin ≥ +1` to recover more sample.

**Read §5.** If WR/ROI shows monotonic gradient with margin, build a continuous sizing curve. If it's flat or noisy past +1, binary is the right call.
