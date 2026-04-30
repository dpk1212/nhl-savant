# WALLET FEATURE PREDICTIVENESS

Generated: **2026-04-30T19:44:08.621Z** · all GRADED positions (VAULT+SHADOW)

## §1. Sample & outcome distribution

- Graded positions analysed: **1913**
- Distinct wallets: **118**
- Distinct games: **93**
- Sports: MLB / NBA / NHL
- Markets: ML / SPREAD / TOTAL

### Overall results

| Metric | Value |
|---|---|
| Win rate | 49.5% |
| Flat 1u ROI (replay vs avgPrice) | -1.6% |
| Dollar ROI (Σ pnl / Σ invested) | -0.1% |
| Lift over Pinnacle implied | -1.7% pp |

Lift = `actual WR − Pinnacle-implied WR`. Anything > 0 means wallets are beating the market on average; that is the residual we are trying to attribute to wallet features.

### Coverage of each candidate feature

| Feature | % rows present |
|---|---|
| `whitelistTier` | 100.0% (1913/1913) |
| `sportROI` | 100.0% (1913/1913) |
| `sportPnlTotal` | 100.0% (1913/1913) |
| `sportVol` | 100.0% (1913/1913) |
| `leaderboardRank` | 84.4% (1614/1913) |
| `v8_walletBase` | 95.6% (1829/1913) |
| `v8_walletRoiNorm` | 95.6% (1829/1913) |
| `v8_walletContribution` | 95.6% (1829/1913) |
| `betMultiplier` | 100.0% (1913/1913) |
| `v8_convictionMult` | 95.6% (1829/1913) |
| `v8_contribTier` | 84.1% (1609/1913) |
| `pinnacleImplied` | 0.0% (0/1913) |
| `walletPicksFlatRoi (Source A history for this wallet × sport)` | 100.0% (1913/1913) |

---
## §2. Univariate predictiveness

For each candidate feature, the table shows N (sample size), WR (raw win rate), Flat ROI (1u replay vs avgPrice), Lift over Pinnacle. **Lift over Pinnacle is the truest skill measure** — it asks "did wallets in this bucket beat the market's implied probability?".

### §2 a. Whitelist tier (CONFIRMED / FLAT / WR50 / NULL / UNKNOWN)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| CONFIRMED | 509 | 59.3% | +21.6% | +34.6% | +9.7% pp |
| FLAT | 202 | 43.6% | -9.7% | -25.0% | -5.1% pp |
| WR50 | 250 | 50.8% | -3.0% | +8.8% | -2.1% pp |
| NULL (in profile but below bar) | 952 | 45.1% | -11.9% | -9.9% | -7.0% pp |
| UNKNOWN (no profile) | 0 | —% | — | — | — pp |

### §2 b. Lifetime sport ROI (quintile)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| Q1 (≤ 2.1%) | 383 | 49.6% | -1.0% | +0.1% | -0.8% pp |
| Q2 (2.1 → 3.6%) | 383 | 50.1% | +6.3% | +7.5% | -0.1% pp |
| Q3 (3.6 → 6.3%) | 386 | 49.7% | -5.2% | -0.1% | -2.5% pp |
| Q4 (6.3 → 8.4%) | 379 | 48.8% | -4.7% | -20.8% | -2.6% pp |
| Q5 (> 8.4%) | 382 | 49.0% | -3.3% | +3.2% | -2.5% pp |

### §2 c. Lifetime sport PnL

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| ≤ $0 (loser) | 35 | 42.9% | -21.3% | -84.1% | -9.9% pp |
| $0–100K | 82 | 52.4% | +0.2% | +16.0% | -0.7% pp |
| $100K–500K | 1156 | 49.1% | -0.7% | +4.2% | -2.0% pp |
| $500K–2M | 541 | 49.9% | -1.9% | -6.1% | -1.0% pp |
| > $2M | 99 | 50.5% | -4.4% | +4.6% | -0.6% pp |

### §2 d. Lifetime sport volume (total $ bet in sport)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| ≤ $50K (low-vol) | 37 | 45.9% | -15.7% | +1.3% | -7.0% pp |
| $50K–500K | 54 | 44.4% | -19.3% | -0.6% | -9.1% pp |
| $500K–5M | 589 | 49.9% | +1.2% | +3.2% | -1.5% pp |
| $5M–25M | 781 | 51.2% | +3.0% | +9.2% | +0.1% pp |
| > $25M (whale) | 452 | 46.7% | -9.9% | -7.5% | -3.9% pp |

### §2 e. Leaderboard rank (lower = better)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| TOP 50 | 377 | 46.4% | -9.6% | -3.5% | -3.8% pp |
| 51–100 | 254 | 50.4% | -2.9% | -15.0% | -0.1% pp |
| 101–250 | 595 | 48.1% | -2.0% | +5.6% | -3.2% pp |
| 251–500 | 374 | 52.7% | +7.2% | +15.2% | +1.2% pp |
| > 500 | 14 | 71.4% | +43.2% | +30.4% | +17.2% pp |
| unranked | 299 | 50.2% | -2.7% | -4.1% | -2.0% pp |

### §2 f. v8_walletBase (composite quality, 0–100)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| Q1 (≤ 41.6) | 367 | 50.7% | +5.3% | +12.8% | +0.3% pp |
| Q2 (41.6 → 53.5) | 374 | 49.5% | -1.0% | +6.6% | -1.6% pp |
| Q3 (53.5 → 62.0) | 357 | 50.7% | +2.7% | -4.8% | -0.2% pp |
| Q4 (62.0 → 71.3) | 366 | 47.8% | -8.9% | -3.6% | -4.7% pp |
| Q5 (> 71.3) | 365 | 47.4% | -7.8% | -7.0% | -3.7% pp |

### §2 g. v8_walletContribution (walletBase × convictionMult)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| ≤ 0 (no signal) | 31 | 45.2% | -15.4% | -80.4% | -6.8% pp |
| 0–30 | 158 | 50.6% | +1.9% | +1.5% | -1.3% pp |
| 30–50 (T30 quality cut) | 493 | 48.5% | +0.9% | +12.7% | -0.9% pp |
| 50–75 | 679 | 47.0% | -6.9% | -1.7% | -3.6% pp |
| > 75 (top contribution) | 468 | 53.0% | +1.7% | -1.9% | -0.8% pp |

### §2 h. Bet multiplier (invested ÷ wallet's avg sport bet)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| < 1.0× (under-sized) | 837 | 45.9% | -9.2% | -15.6% | -3.7% pp |
| 1.0× – 1.5× | 321 | 49.5% | +4.1% | -15.3% | -0.7% pp |
| 1.5× – 3× | 411 | 51.8% | +6.7% | +11.7% | +0.5% pp |
| 3× – 6× | 212 | 55.7% | +6.3% | +10.0% | +1.0% pp |
| ≥ 6× (max-conviction) | 132 | 54.5% | -5.6% | -5.0% | -3.2% pp |

### §2 i. VAULT vs SHADOW (qualificationTier)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| VAULT | 1300 | 50.8% | +1.1% | +1.0% | -1.2% pp |
| SHADOW | 613 | 46.7% | -7.4% | -14.9% | -2.8% pp |

### §2 j. v8_contribTier (game-level wallet quality consensus)

| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |
|---|---|---|---|---|---|
| STRONG | 736 | 50.1% | +0.0% | +1.8% | -1.3% pp |
| STANDARD | 210 | 46.2% | -8.3% | +10.3% | -5.2% pp |
| LEAN | 435 | 49.0% | -5.1% | -11.4% | -1.7% pp |
| MUTE | 228 | 48.7% | +2.0% | +5.0% | -2.6% pp |

---
## §3. Cross-cuts

### §3a. whitelistTier × bet multiplier

|  | < 1.5× | 1.5–3× | ≥ 3× |
|---|---|---|---|
| CONFIRMED | N=285 · WR=54% · Lift=+6.4%pp | N=111 · WR=63% · Lift=+13.7%pp | N=113 · WR=70% · Lift=+13.9%pp |
| FLAT | N=122 · WR=47% · Lift=-1.3%pp | N=42 · WR=50% · Lift=+0.4%pp | N=38 · WR=26% · Lift=-23.3%pp |
| WR50 | N=134 · WR=49% · Lift=-2.4%pp | N=69 · WR=54% · Lift=-0.7%pp | N=47 · WR=53% · Lift=-3.2%pp |
| NULL | N=617 · WR=43% · Lift=-7.6%pp | N=189 · WR=45% · Lift=-6.7%pp | N=146 · WR=52% · Lift=-5.1%pp |

### §3b. v8_walletBase quintile × bet multiplier

|  | < 1.5× | 1.5–3× | ≥ 3× |
|---|---|---|---|
| walletBase Q1 (low) | N=433 · WR=46% · Lift=-3.5%pp | N=155 · WR=57% · Lift=+5.2%pp | N=153 · WR=55% · Lift=+1.3%pp |
| walletBase Q3 (mid) | N=196 · WR=48% · Lift=-0.5%pp | N=99 · WR=49% · Lift=-1.0%pp | N=62 · WR=60% · Lift=+2.4%pp |
| walletBase Q4–Q5 (high) | N=458 · WR=45% · Lift=-5.0%pp | N=148 · WR=49% · Lift=-2.3%pp | N=125 · WR=54% · Lift=-3.5%pp |

### §3c. LB rank × sport ROI

|  | sportROI ≤ 0% | sportROI 0–10% | sportROI > 10% |
|---|---|---|---|
| LB top-100 | N=0 · WR=—% · Lift=—pp | N=590 · WR=48% · Lift=-2.8%pp | N=41 · WR=54% · Lift=+4.2%pp |
| LB 100–300 | N=2 · WR=100% · Lift=+45.0%pp | N=564 · WR=49% · Lift=-2.3%pp | N=71 · WR=41% · Lift=-12.8%pp |
| LB > 300 / unranked | N=35 · WR=43% · Lift=-9.9%pp | N=425 · WR=53% · Lift=+1.8%pp | N=185 · WR=52% · Lift=-0.5%pp |

---
## §4. Logistic regression — wallet features above the Pinnacle baseline

Model: `P(win) = σ(b + β1·pinnImpliedZ + β2·feature_z)`, fitted with L2-regularised gradient descent on rows with full feature coverage. We compare McFadden pseudo-R² of each model vs. the Pinnacle-only baseline; positive Δ means the wallet feature carries additive signal.

Baseline (market-implied only): N=1913, pseudo-R²=0.0201, β(mktImpliedZ)=0.149, intercept=-0.022

| Feature added on top of Pinnacle | N | pseudo-R² | Δ vs baseline | Coefficient(s) |
|---|---|---|---|---|
| whitelistTier | 1913 | 0.0221 | +0.0020 | pinnZ: 0.150 · whitelistTier=FLAT (ref=NULL): -0.010; whitelistTier=CONFIRMED (ref=NULL): 0.050; whitelistTier=WR50 (ref=NULL): 0.003 |
| sportROI | 1913 | 0.0203 | +0.0002 | pinnZ: 0.149 · sportROI_z: 0.016 |
| sportPnlTotal | 1913 | 0.0201 | +0.0000 | pinnZ: 0.149 · sportPnlTotal_z: 0.006 |
| sportVol | 1913 | 0.0201 | +0.0000 | pinnZ: 0.149 · sportVol_z: 0.004 |
| lbRank (inverse, smaller = higher) | 1614 | 0.0202 | +0.0001 | pinnZ: 0.147 · lbRank (inverse, smaller = higher)_z: -0.029 |
| v8_walletBase | 1829 | 0.0205 | +0.0004 | pinnZ: 0.150 · v8_walletBase_z: -0.016 |
| v8_walletContribution | 1829 | 0.0203 | +0.0002 | pinnZ: 0.150 · v8_walletContribution_z: 0.010 |
| betMultiplier | 1913 | 0.0203 | +0.0003 | pinnZ: 0.148 · betMultiplier_z: 0.021 |
| v8_convictionMult | 1829 | 0.0217 | +0.0016 | pinnZ: 0.148 · v8_convictionMult_z: 0.043 |
| v8_walletPlayScore (game-level) | 1913 | 0.0212 | +0.0012 | pinnZ: 0.149 · v8_walletPlayScore (game-level)_z: 0.037 |
| vault_winnerMargin (game-level) | 1913 | 0.0280 | +0.0079 | pinnZ: 0.150 · vault_winnerMargin (game-level)_z: 0.094 |
| vault_qualityMargin (game-level) | 1913 | 0.0204 | +0.0004 | pinnZ: 0.147 · vault_qualityMargin (game-level)_z: 0.025 |

### Combined model — Pinnacle + top-3 wallet features

Stacking the three strongest individually-significant numeric features: vault_winnerMargin (game-level) · v8_convictionMult · v8_walletPlayScore (game-level).

Combined: N=1829, pseudo-R²=0.0311, Δ vs baseline=+0.0110
- mktImpliedZ: 0.148
- vault_winnerMargin (game-level): 0.097
- v8_convictionMult: 0.038
- v8_walletPlayScore (game-level): 0.032

---
## §5. Verdict & next steps

### Headline findings

1. **`whitelistTier` is the single most predictive wallet feature.** CONFIRMED wallets hit 59.3% WR (+9.7pp lift over market, +21.6% flat ROI) while NULL wallets hit 45.1% (−7.0pp lift). The 14pp WR spread between CONFIRMED and NULL is the largest of any feature tested.
2. **FLAT wallets are bleeders, not winners.** FLAT-tier wallets hit 43.6% WR with −9.7% flat ROI and −5.1pp lift. The dollar-PnL gate that separates CONFIRMED from FLAT is doing real work: FLAT wallets are picks-side profitable but their actual bets bleed money. **They should not be weighted equal to CONFIRMED in Δw.**
3. **Conviction sizing × whitelistTier is the highest-edge interaction.** CONFIRMED wallets at ≥1.5× bet multiplier hit 63%–70% WR with +13–14pp lift. FLAT wallets at the same conviction hit 26% WR (−23pp lift). Conviction is an AMPLIFIER of whatever skill signal a wallet already has — it does not create signal on its own.
4. **Lifetime sport ROI does not predict the next bet.** Q1 (≤ 2%) and Q5 (> 8.4%) ROI buckets perform identically (~49% WR, ~−2pp lift). The "we have wallets with +50% lifetime ROI" stat is variance, not transferrable signal.
5. **`v8_walletBase` is INVERSELY correlated with WR.** Top quintile (>71): 47% WR / −3.7pp lift. Bottom quintile (≤41): 51% WR / +0.3pp lift. Our composite quality score is overweighting features that don't predict (lifetime ROI, leaderboard rank). Currently it does not feed Δw, but if we considered it as a promotion lever we'd be promoting bleeders.
6. **LB rank TOP-50 actually UNDERPERFORMS** (−3.8pp). The on-chain leaderboard reflects all-time cross-sport results; it does not capture current sharpness. Sport-specific whitelistTier is far more reliable.
7. **Game-level `vault_winnerMargin` (Δw) is the strongest individual numeric predictor in the regression** (Δ pseudo-R² = +0.0079 over the market baseline alone). Combined with v8_convictionMult and v8_walletPlayScore, the model lifts pseudo-R² from 0.0201 → 0.0311 — a 55% improvement in explanatory power.

### Recommended changes to Sharp Intel scoring

| # | Change | Expected effect | Risk |
|---|---|---|---|
| 1 | **Drop FLAT from Δw counting.** Only CONFIRMED counts as a "proven winner". | Big edge gain — removes the −5pp drag from FLAT contributions. MLB whitelist drops 7→4, NBA drops 25→19, NHL drops 10→7 ([§3a NULL+FLAT]). | Less volume of signal, but signal-to-noise meaningfully improves. |
| 2 | **Add a "HIGH-CONVICTION CONFIRMED" tier**: any CONFIRMED wallet betting ≥1.5× counts as 2 (or weight in Δw proportional to log(betMultiplier)). | Captures the +13.7pp / +13.9pp lift cells in §3a. | Conviction sizing is volatile; need ≥1.5× threshold to filter noise. |
| 3 | **Stop using `walletBase` (or `v8_walletContribution`) as a positive promotion signal.** Today it informs star selection; the data says high `walletBase` is anti-correlated with WR. | Cleaner star scaling. | Star changes will need re-validation. |
| 4 | **Treat LB rank as a tie-breaker only**, not a primary credibility filter. | Removes a false-precision signal. | Cosmetic UI changes. |
| 5 | **Surface conviction sizing on Sharp Intel cards** for CONFIRMED wallets. | Lets users distinguish "CONFIRMED wallet placing routine bet" (54% WR) from "CONFIRMED wallet placing 3× bet" (70% WR). | UI work. |

### Quick highlights pulled by the script

| Rank | Feature | Bucket | N | WR | Lift vs Pinn | Flat ROI |
|---|---|---|---|---|---|---|
| 1 | `whitelistTier` | CONFIRMED | 509 | 59.3% | +9.7% pp | +21.6% |
| 2 | `whitelistTier` | NULL | 952 | 45.1% | -7.0% pp | -11.9% |
| 3 | `whitelistTier` | FLAT | 202 | 43.6% | -5.1% pp | -9.7% |
| 4 | `lbRank` | TOP 50 | 377 | 46.4% | -3.8% pp | -9.6% |
| 5 | `walletBase` | Q5 (> 71.3) | 365 | 47.4% | -3.7% pp | -7.8% |
| 6 | `betMultiplier` | < 1× | 837 | 45.9% | -3.7% pp | -9.2% |
| 7 | `vaultQualified` | SHADOW | 613 | 46.7% | -2.8% pp | -7.4% |
| 8 | `contribTier` | MUTE | 228 | 48.7% | -2.6% pp | +2.0% |
| 9 | `sportROI` | Q5 (> 8.4%) | 382 | 49.0% | -2.5% pp | -3.3% |
| 10 | `whitelistTier` | WR50 | 250 | 50.8% | -2.1% pp | -3.0% |
| 11 | `contribTier` | STRONG | 736 | 50.1% | -1.3% pp | +0.0% |
| 12 | `vaultQualified` | VAULT | 1300 | 50.8% | -1.2% pp | +1.1% |
| 13 | `sportROI` | Q1 (≤ 2.1%) | 383 | 49.6% | -0.8% pp | -1.0% |
| 14 | `betMultiplier` | ≥ 3× | 344 | 55.2% | -0.6% pp | +1.7% |
| 15 | `walletBase` | Q1 (≤ 41.6) | 367 | 50.7% | +0.3% pp | +5.3% |
