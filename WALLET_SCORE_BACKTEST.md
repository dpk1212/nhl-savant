# Wallet-Score System Backtest

_Auto-generated **5/5/2026, 1:00:12 PM ET** by `scripts/_wallet_score_backtest.mjs`._

**Sample:** 201 shipped+graded picks (2026-04-18 → 2026-05-04) where ≥1 proven wallet appeared on either side. Inclusion rule mirrors live Pick Performance dashboard.

**Proven roster (CONFIRMED ∪ FLAT):** MLB=9 · NBA=32 · NHL=12.

## 0. Baselines for reference

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| All picks (universe) | 201 | 101-97-3 | 51.0% [44–58] | +0.4% | +0.11u | +0.78u | 0.05 ✗ noise |
| Tier-1 (HC ≥ +1, post-cutover) | 20 | 10-10-0 | 50.0% [30–70] | -0.1% | -1.25u | -0.03u | -0.01 ✗ noise |
| Δw ≥ +3 (full sample) | 21 | 14-7-0 | 66.7% [45–83] | +49.6% | +13.09u | +10.42u | 1.56 ✗ noise |
| Δw = +2 | 30 | 15-15-0 | 50.0% [33–67] | +2.7% | -0.82u | +0.81u | 0.14 ✗ noise |
| Stale Δw ≤ 0 | 86 | 41-44-1 | 48.2% [38–59] | -9.6% | -10.62u | -8.22u | -0.92 ✗ noise |

## 1. System-A — Equal-weighted z-score composite

`scoreA = z(Δcount) + z(ΔWlNet) + z(ΔFlatPnl) + z(ΔAvgRoi) + z(ΔTopQShare) + z(ΔBestRank)`. No empirical fitting — pure equal-weighted ensemble of the six wallet features. Treats every feature as equally informative.

### System-A WLT-Z — quintile breakdown

Cutoffs: -3.44 · -0.60 · 0.60 · 2.99

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| Q1 (worst) | 41 | 5-36-0 | 12.2% [5–26] | -77.6% | -35.07u | -31.82u | -7.86 ✓ p<.01 |
| Q2 | 48 | 23-25-0 | 47.9% [34–62] | -8.4% | -10.80u | -4.03u | -0.60 ✗ noise |
| Q3 | 32 | 14-16-2 | 46.7% [30–64] | -12.8% | -12.85u | -4.09u | -0.78 ✗ noise |
| Q4 | 40 | 23-17-0 | 57.5% [42–71] | +6.2% | +5.71u | +2.49u | 0.42 ✗ noise |
| Q5 (best) | 40 | 36-3-1 | 92.3% [80–97] | +95.6% | +53.12u | +38.22u | 6.28 ✓ p<.01 |

**Top minus bottom**:  WR 80.1 pp · Flat ROI 173.2 pp · Peak PnL +88.19u

### System-A WLT-Z — decile breakdown

Cutoffs: -6.04 · -3.44 · -1.10 · -0.60 · -0.38 · 0.60 · 1.67 · 2.99 · 5.02

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| D1 (worst) | 22 | 2-20-0 | 9.1% [3–28] | -79.6% | -21.48u | -17.51u | -5.63 ✓ p<.01 |
| D2 | 19 | 3-16-0 | 15.8% [6–38] | -75.3% | -13.59u | -14.31u | -5.37 ✓ p<.01 |
| D3 | 22 | 10-12-0 | 45.5% [27–65] | -10.3% | -5.36u | -2.27u | -0.48 ✗ noise |
| D4 | 26 | 13-13-0 | 50.0% [32–68] | -6.8% | -5.44u | -1.76u | -0.36 ✗ noise |
| D5 | 13 | 6-5-2 | 54.5% [28–79] | -0.0% | -3.51u | -0.00u | -0.00 ✗ noise |
| D6 | 19 | 8-11-0 | 42.1% [23–64] | -21.5% | -9.34u | -4.09u | -0.97 ✗ noise |
| D7 | 22 | 12-10-0 | 54.5% [35–73] | -4.2% | +1.03u | -0.93u | -0.22 ✗ noise |
| D8 | 18 | 11-7-0 | 61.1% [39–80] | +19.0% | +4.68u | +3.43u | 0.82 ✗ noise |
| D9 | 20 | 18-2-0 | 90.0% [70–97] | +85.6% | +24.69u | +17.12u | 4.66 ✓ p<.01 |
| D10 (best) | 20 | 18-1-1 | 94.7% [75–99] | +105.5% | +28.43u | +21.10u | 4.30 ✓ p<.01 |

**Top minus bottom**:  WR 85.6 pp · Flat ROI 185.1 pp · Peak PnL +49.91u

## 2. System-B — ρ-weighted z-score composite

`scoreB = Σ w_i · z(feature_i)` where weights = `|ρ(feature, flat ROI)|` from the V6 §4g leaderboard:

| Feature | Weight |
|---|---|
| dCount | 0.505 |
| dFlatPnl | 0.470 |
| dAvgRoi | 0.447 |
| dWlNet | 0.331 |
| dTopQShare | 0.285 |
| dBestRank | 0.345 |

⚠️ This is **in-sample weighting** — the weights were estimated on the same data we're backtesting on. Treat lift over System-A as upper-bound; real out-of-sample lift will be smaller.

### System-B WLT-W — quintile breakdown

Cutoffs: -1.10 · -0.28 · 0.29 · 1.26

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| Q1 (worst) | 41 | 5-36-0 | 12.2% [5–26] | -77.6% | -35.07u | -31.82u | -7.86 ✓ p<.01 |
| Q2 | 47 | 23-24-0 | 48.9% [35–63] | -6.4% | -8.80u | -3.03u | -0.45 ✗ noise |
| Q3 | 33 | 14-17-2 | 45.2% [29–62] | -16.9% | -13.70u | -5.57u | -1.06 ✗ noise |
| Q4 | 40 | 24-16-0 | 60.0% [45–74] | +11.6% | +5.64u | +4.64u | 0.78 ✗ noise |
| Q5 (best) | 40 | 35-4-1 | 89.7% [76–96] | +91.4% | +52.04u | +36.56u | 5.73 ✓ p<.01 |

**Top minus bottom**:  WR 77.5 pp · Flat ROI 169.0 pp · Peak PnL +87.11u

### System-B WLT-W — decile breakdown

Cutoffs: -2.42 · -1.10 · -0.46 · -0.28 · -0.12 · 0.29 · 0.64 · 1.26 · 2.07

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| D1 (worst) | 21 | 2-19-0 | 9.5% [3–29] | -78.6% | -17.63u | -16.51u | -5.31 ✓ p<.01 |
| D2 | 20 | 3-17-0 | 15.0% [5–36] | -76.5% | -17.44u | -15.31u | -5.73 ✓ p<.01 |
| D3 | 21 | 10-11-0 | 47.6% [28–68] | -6.0% | -4.86u | -1.27u | -0.27 ✗ noise |
| D4 | 26 | 13-13-0 | 50.0% [32–68] | -6.8% | -3.94u | -1.76u | -0.36 ✗ noise |
| D5 | 14 | 5-7-2 | 41.7% [19–68] | -18.4% | -5.37u | -2.57u | -0.76 ✗ noise |
| D6 | 19 | 9-10-0 | 47.4% [27–68] | -15.8% | -8.33u | -2.99u | -0.73 ✗ noise |
| D7 | 21 | 12-9-0 | 57.1% [37–76] | +5.8% | +1.43u | +1.22u | 0.28 ✗ noise |
| D8 | 19 | 12-7-0 | 63.2% [41–81] | +18.0% | +4.21u | +3.42u | 0.83 ✗ noise |
| D9 | 20 | 17-3-0 | 85.0% [64–95] | +67.6% | +23.40u | +13.53u | 3.93 ✓ p<.01 |
| D10 (best) | 20 | 18-1-1 | 94.7% [75–99] | +115.1% | +28.64u | +23.03u | 4.38 ✓ p<.01 |

**Top minus bottom**:  WR 85.2 pp · Flat ROI 193.8 pp · Peak PnL +46.27u

## 3. System-C — Logistic regression P(WIN)

L2-regularized (λ=0.05) logistic regression trained on the full sample with features:

| Feature | β (z-scaled) |
|---|---|
| Δw | -0.059 |
| dCount | +0.302 |
| dWlNet | +0.377 |
| dFlatPnl | +0.083 |
| dAvgRoi | +0.541 |
| dTopQShare | +0.211 |
| dBestRank | +0.024 |
| _intercept_ | -0.007 |

⚠️ Same in-sample-fit caveat as System-B. Coefficients here weight Δw in a way that's explicitly NOT independent of the wallet features (they're correlated). The point: if you let a logreg jointly use all signals, what does it pick?

### System-C WLT-LR — quintile breakdown

Cutoffs: 0.28 · 0.48 · 0.55 · 0.70

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| Q1 (worst) | 41 | 5-36-0 | 12.2% [5–26] | -75.5% | -33.31u | -30.96u | -7.18 ✓ p<.01 |
| Q2 | 55 | 24-31-0 | 43.6% [31–57] | -19.1% | -23.39u | -10.52u | -1.50 ✗ noise |
| Q3 | 25 | 12-11-2 | 52.2% [33–71] | +2.2% | -2.40u | +0.56u | 0.11 ✗ noise |
| Q4 | 40 | 25-15-0 | 62.5% [47–76] | +17.9% | +9.93u | +7.14u | 1.12 ✗ noise |
| Q5 (best) | 40 | 35-4-1 | 89.7% [76–96] | +86.4% | +49.28u | +34.55u | 5.72 ✓ p<.01 |

**Top minus bottom**:  WR 77.5 pp · Flat ROI 161.9 pp · Peak PnL +82.59u

### System-C WLT-LR — decile breakdown

Cutoffs: 0.16 · 0.28 · 0.44 · 0.48 · 0.49 · 0.55 · 0.63 · 0.70 · 0.81

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| D1 (worst) | 21 | 2-19-0 | 9.5% [3–29] | -78.6% | -18.63u | -16.51u | -5.31 ✓ p<.01 |
| D2 | 20 | 3-17-0 | 15.0% [5–36] | -72.2% | -14.68u | -14.45u | -4.72 ✓ p<.01 |
| D3 | 24 | 10-14-0 | 41.7% [24–61] | -21.4% | -9.62u | -5.13u | -1.07 ✗ noise |
| D4 | 31 | 14-17-0 | 45.2% [29–62] | -17.4% | -13.77u | -5.39u | -1.04 ✗ noise |
| D5 | 7 | 3-2-2 | 60.0% [23–88] | +11.1% | -1.15u | +0.78u | 0.33 ✗ noise |
| D6 | 18 | 9-9-0 | 50.0% [29–71] | -1.2% | -1.25u | -0.22u | -0.05 ✗ noise |
| D7 | 20 | 12-8-0 | 60.0% [39–78] | +1.1% | +5.46u | +0.22u | 0.05 ✗ noise |
| D8 | 20 | 13-7-0 | 65.0% [43–82] | +34.6% | +4.47u | +6.93u | 1.39 ✗ noise |
| D9 | 20 | 16-4-0 | 80.0% [58–92] | +63.1% | +16.37u | +12.62u | 3.17 ✓ p<.01 |
| D10 (best) | 20 | 19-0-1 | 100.0% [83–100] | +109.7% | +32.91u | +21.94u | 4.99 ✓ p<.01 |

**Top minus bottom**:  WR 90.5 pp · Flat ROI 188.3 pp · Peak PnL +51.54u

## 4. System-D — Hard rule: Δcount ≥ +2 ∧ ΔAvgRoi > median

Median ΔAvgRoi across the universe = **13.30 pp**. Picks satisfying (Δcount ≥ +2 AND ΔAvgRoi > 13.30) are the SHIP set, everything else is MUTE.

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| SHIP (rule met) — 26.4% of universe | 53 | 43-9-1 | 82.7% [70–91] | +67.7% | +48.43u | +35.88u | 4.97 ✓ p<.01 |
| MUTE (rule not met) | 148 | 58-88-2 | 39.7% [32–48] | -23.7% | -48.32u | -35.10u | -2.99 ✓ p<.01 |

## 5. Head-to-head — top-quintile of each system (& baselines)

What does each system's top 20% of picks look like? This is the practical "lock zone" comparison — same N for each row, varied selection criteria.

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| System-A (top 20%) | 41 | 37-3-1 | 92.5% [80–97] | +95.5% | +53.81u | +39.15u | 6.44 ✓ p<.01 |
| System-B (top 20%) | 41 | 35-5-1 | 87.5% [74–95] | +86.7% | +51.54u | +35.56u | 5.34 ✓ p<.01 |
| System-C (top 20%) | 41 | 36-4-1 | 90.0% [77–96] | +86.8% | +49.81u | +35.60u | 5.89 ✓ p<.01 |
| System-D SHIP set | 53 | 43-9-1 | 82.7% [70–91] | +67.7% | +48.43u | +35.88u | 4.97 ✓ p<.01 |
| Δw ≥ +3 (full) | 21 | 14-7-0 | 66.7% [45–83] | +49.6% | +13.09u | +10.42u | 1.56 ✗ noise |
| Tier-1 HC ≥ +1 | 20 | 10-10-0 | 50.0% [30–70] | -0.1% | -1.25u | -0.03u | -0.01 ✗ noise |

## 6. Head-to-head — top-decile of each system

The "elite-only" lens — top 10% by score for each system. Where would we ship if we could only ship 10% of the universe?

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | Flat PnL | t-stat |
|---|---|---|---|---|---|---|---|
| System-A (top 10%) | 21 | 19-1-1 | 95.0% [76–99] | +114.5% | +31.58u | +24.05u | 4.58 ✓ p<.01 |
| System-B (top 10%) | 21 | 19-1-1 | 95.0% [76–99] | +115.6% | +31.04u | +24.28u | 4.62 ✓ p<.01 |
| System-C (top 10%) | 21 | 20-0-1 | 100.0% [84–100] | +113.9% | +32.91u | +23.92u | 5.34 ✓ p<.01 |
| Δw ≥ +3 (full) | 21 | 14-7-0 | 66.7% [45–83] | +49.6% | +13.09u | +10.42u | 1.56 ✗ noise |
| Tier-1 HC ≥ +1 | 20 | 10-10-0 | 50.0% [30–70] | -0.1% | -1.25u | -0.03u | -0.01 ✗ noise |

## 7. Recent 25 picks — what does each system score?

Sanity check: for the most recent 25 picks, here's every system's ranked output. Lets you eyeball whether the systems agree, disagree, or diverge on real plays.

| Date | Game | Pick | Mkt | Outcome | Δw | HC | A z-score | B-weighted | C P(WIN) | D rule |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-05-04 | Ducks @ Golden Knights | Golden Knights | ML | **W** | 1 | 1 | -0.44 | -0.18 | 49% | mute |
| 2026-05-04 | 76ers @ Knicks | Under 213 | TOTAL | L | 2 | 1 | 0.44 | 0.29 | 54% | **SHIP** |
| 2026-05-04 | 76ers @ Knicks | 76ers | SPREAD | L | 2 | 1 | 2.55 | 1.24 | 70% | **SHIP** |
| 2026-05-04 | 76ers @ Knicks | 76ers | ML | L | 3 | -1 | 6.70 | 2.72 | 72% | **SHIP** |
| 2026-05-04 | Timberwolves @ Spurs | Under 219.5 | TOTAL | **W** | 3 | 1 | 3.80 | 1.64 | 76% | **SHIP** |
| 2026-05-04 | Timberwolves @ Spurs | Timberwolves | SPREAD | **W** | 5 | 1 | 15.23 | 6.40 | 98% | **SHIP** |
| 2026-05-04 | Philadelphia Phillies @ Miami Marlins | Philadelphia Phillies | ML | **W** | 0 | 0 | -0.35 | -0.13 | 52% | mute |
| 2026-05-04 | New York Mets @ Colorado Rockies | Colorado Rockies | ML | L | 1 | 0 | -0.35 | -0.13 | 51% | mute |
| 2026-05-04 | Boston Red Sox @ Detroit Tigers | Detroit Tigers | ML | L | -1 | 1 | -3.63 | -1.81 | 23% | mute |
| 2026-05-03 | NHL Playoffs: Who Will Win Series? - Canadiens @ Lightning | NHL Playoffs: Who Will Win Series? - Canadiens | ML | **W** | 0 | -1 | -0.65 | -0.32 | 48% | mute |
| 2026-05-03 | Raptors @ Cavaliers | Cavaliers | SPREAD | **W** | 0 | 1 | 1.67 | 0.64 | 65% | mute |
| 2026-05-03 | Raptors @ Cavaliers | Raptors | ML | L | 1 | 1 | 2.95 | 1.28 | 55% | mute |
| 2026-05-03 | Magic @ Pistons | Under 202 | TOTAL | L | 0 | 1 | -1.80 | -0.82 | 31% | mute |
| 2026-05-03 | Magic @ Pistons | Pistons | SPREAD | **W** | 1 | 1 | 1.67 | 0.64 | 63% | mute |
| 2026-05-03 | Magic @ Pistons | Magic | ML | L | 0 | 1 | 0.69 | 0.12 | 49% | mute |
| 2026-05-03 | Philadelphia Phillies @ Miami Marlins | Philadelphia Phillies | ML | **W** | 0 | 0 | -0.60 | -0.28 | 48% | mute |
| 2026-05-03 | New York Mets @ Los Angeles Angels | New York Mets | ML | **W** | 1 | 1 | -1.54 | -0.68 | 37% | mute |
| 2026-05-03 | Los Angeles Dodgers @ St. Louis Cardinals | St. Louis Cardinals | ML | L | 1 | 0 | -0.35 | -0.13 | 51% | mute |
| 2026-05-03 | Chicago White Sox @ San Diego Padres | San Diego Padres | ML | **W** | 0 | 0 | 3.96 | 1.53 | 81% | **SHIP** |
| 2026-05-03 | Cleveland Guardians @ Athletics | Athletics | ML | **W** | 0 | 0 | -0.60 | -0.28 | 48% | mute |
| 2026-05-03 | Cincinnati Reds @ Pittsburgh Pirates | Pittsburgh Pirates | ML | **W** | 0 | 0 | -0.60 | -0.28 | 48% | mute |
| 2026-05-02 | Flyers @ Hurricanes | Over 5.5 | TOTAL | L | 1 | 0 | -1.03 | -0.39 | 44% | mute |
| 2026-05-02 | Flyers @ Hurricanes | Hurricanes | SPREAD | **W** | 1 | 0 | 1.33 | 0.59 | 68% | mute |
| 2026-05-02 | Flyers @ Hurricanes | Flyers | ML | L | 2 | 0 | -0.44 | -0.18 | 47% | mute |
| 2026-05-02 | 76ers @ Celtics | Over 205 | TOTAL | **W** | 1 | 1 | 6.57 | 2.59 | 89% | **SHIP** |

## 8. Do the systems agree? — score correlations

If two systems are perfectly correlated, they're effectively the same system in different clothing. If they're uncorrelated, blending them adds independent signal.

| Pair | Pearson ρ |
|---|---|
| System-A ↔ System-B | 0.997 |
| System-A ↔ System-C | 0.958 |
| System-B ↔ System-C | 0.957 |
| System-A ↔ Δw       | 0.322 |
| System-A ↔ HC       | 0.065 (full sample, HC=0 for pre-cutover) |
| System-C ↔ Δw       | 0.272 |

## 9. Brainstorm prompts

Key questions for the next iteration:

1. **Independence** — if Systems A/B/C are highly correlated with each other AND with Δw, the wallet-features aren't orthogonal information; they're a re-expression of the directional consensus. If correlations are 0.5–0.8, there's independent signal worth blending.
2. **Out-of-sample collapse** — System-B and System-C use weights estimated on the same picks they're tested on. Real-life lift will be ~30–50% smaller than reported. The honest "free-money" line is **System-A** (no fitting).
3. **Lock-floor candidates** — does System-A's top-quintile beat HC ≥ +1's WR/ROI? Does System-D's SHIP set?
4. **Sizing curve** — if we ship by score-decile, the sizing should escalate steeply: D9–D10 at full size, D5–D8 flat, D1–D4 muted. We can map score-deciles directly to a star tier.
5. **HC-era only refit** — re-run §11 logreg on post-cutover data with HC included; the wallet-features may end up complementary rather than competing.

---
_Driven by `scripts/_wallet_score_backtest.mjs` · re-run any time. Output regenerates from the live Firestore state at run time._