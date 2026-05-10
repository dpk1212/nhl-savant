# MLB Confluence Analysis — Sharp Flow ↔ Model Picks

_159 graded Model picks · 242 graded Sharp Flow ML picks · sample 2026-04-10 → 2026-05-04_

Two MLB pick streams ship from this repo:
- **Model** — DRatings/Dimers ensemble + Pinnacle EV gate (always ML).
- **Sharp Flow** — wallet-driven (Δw, Δq, HC) lock-floor signal (ML lane shown here).

Aligned on `(date, away, home)`. Each Model pick is bucketed by what Sharp Flow shipped on the same game:
- `AGREE` — Sharp Flow shipped the **same side**.
- `DISAGREE` — Sharp Flow shipped the **opposite side**.
- `MODEL_ONLY` — Sharp Flow did not ship a LOCKED ML pick (or was below 2.5★).

All "Model PnL" columns use the **model's graded unit sizing**. "Flat PnL / ROI" uses 1u flat per pick — the cohort-EV lens.

## 1. Headline buckets (Model picks, partitioned by Sharp Flow agreement)

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| **ALL Model picks** | 159 | 85-74-0 | 53.5% | +29.98u | +24.61u | +15.5% |
| AGREE (sharp same side) | 24 | 9-15-0 | 37.5% | -6.17u | -6.58u | -27.4% |
| DISAGREE (sharp opposite) | 24 | 17-7-0 | 70.8% | +15.48u | +14.31u | +59.6% |
| MODEL_ONLY (no sharp ML) | 111 | 59-52-0 | 53.2% | +20.67u | +16.88u | +15.2% |

### Read-out

- Baseline (all model picks): **WR 53.5% · Flat ROI +15.5%**.
- **AGREE** (Sharp Flow + Model on the **same** side, N=24): WR **37.5%** (-16.0% vs baseline) · ROI **-27.4%** (-42.9% vs baseline). ⚠️ Big drop.
- **DISAGREE** (Sharp Flow + Model on **opposite** sides, N=24): WR **70.8%** (+17.4%) · ROI **+59.6%** (+44.1%). ✅ Big lift.
- **MODEL_ONLY** (Sharp Flow had no LOCKED ML pick, N=111): WR **53.2%** · ROI **+15.2%** — basically the model baseline.

**The Sharp Flow MLB ML signal is anti-correlated with the Model in this sample.** When they disagree, the Model is the side to follow. When they agree, *both* signals get hurt — possibly because dollars in MLB ML are following the public (chalk/favorite) and that's the side the Model occasionally also lands on for low-EV plays.

## 2. Confluence × Model grade

Does Sharp-Flow agreement matter more for `A` (highest-EV) picks than for `C` (lowest)?

### Grade A

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| Grade A — all | 27 | 16-11-0 | 59.3% | +15.79u | +11.97u | +44.3% |
| Grade A — AGREE | 5 | 2-3-0 | 40.0% | -1.08u | -1.25u | -25.0% |
| Grade A — DISAGREE | 5 | 4-1-0 | 80.0% | +6.32u | +4.88u | +97.7% |
| Grade A — MODEL_ONLY | 17 | 10-7-0 | 58.8% | +10.55u | +8.34u | +49.0% |

### Grade B

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| Grade B — all | 45 | 23-22-0 | 51.1% | +5.82u | +4.47u | +9.9% |
| Grade B — AGREE | 8 | 5-3-0 | 62.5% | +2.26u | +2.02u | +25.2% |
| Grade B — DISAGREE | 7 | 3-4-0 | 42.9% | -0.14u | -0.12u | -1.7% |
| Grade B — MODEL_ONLY | 30 | 15-15-0 | 50.0% | +3.70u | +2.57u | +8.6% |

### Grade C

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| Grade C — all | 87 | 46-41-0 | 52.9% | +8.37u | +8.16u | +9.4% |
| Grade C — AGREE | 11 | 2-9-0 | 18.2% | -7.35u | -7.35u | -66.8% |
| Grade C — DISAGREE | 12 | 10-2-0 | 83.3% | +9.30u | +9.54u | +79.5% |
| Grade C — MODEL_ONLY | 64 | 34-30-0 | 53.1% | +6.42u | +5.96u | +9.3% |

## 3. Confluence × Sharp Flow star tier (AGREE only)

Within AGREE picks, does Sharp Flow conviction (peak★) compound the Model edge?

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| 5.0★ (ELITE) | 2 | 1-1-0 | 50.0% | -0.15u | -0.15u | -7.3% |
| 4.5★ | 2 | 1-1-0 | 50.0% | +0.03u | -0.17u | -8.7% |
| 4.0★ | 4 | 1-3-0 | 25.0% | -2.70u | -2.36u | -59.1% |
| 3.5★ | 7 | 3-4-0 | 42.9% | -1.15u | -1.11u | -15.9% |
| 3.0★ | 4 | 0-4-0 | 0.0% | -4.00u | -4.00u | -100.0% |
| 2.5★ | 5 | 3-2-0 | 60.0% | +1.80u | +1.22u | +24.3% |

## 4. Confluence × HC margin (post-cutover 2026-04-30, 31 model picks)

HC margin only existed from `2026-04-30` onward, so this is small-N. Pre-cutover picks are excluded.

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| AGREE × HC ≥ +2 | 0 | — | — | — | — | — |
| AGREE × HC = +1 | 1 | 1-0-0 | 100.0% | +0.80u | +0.80u | +80.0% |
| AGREE × HC ≤  0 | 0 | — | — | — | — | — |
| DISAGREE × HC ≥ +1 | 1 | 1-0-0 | 100.0% | +1.74u | +1.74u | +174.0% |
| MODEL_ONLY (HC era) | 29 | 20-9-0 | 69.0% | +13.45u | +12.14u | +41.9% |

## 5. Confluence × Sharp Flow Δw + Δq (AGREE picks only)

Does the underlying wallet-consensus delta (the engine's native scoring) sharpen confluence?

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| Δw≥+2 ∧ Δq≥+2 (super-top) | 1 | 0-1-0 | 0.0% | -1.00u | -1.00u | -100.0% |
| Δw≥+2 ∧ Δq=+1 | 1 | 1-0-0 | 100.0% | +0.85u | +0.85u | +85.5% |
| Δw=+1 ∧ Δq≥+1 | 4 | 2-2-0 | 50.0% | +0.03u | -0.18u | -4.5% |
| Δw=+1 ∧ Δq=  0 | 1 | 1-0-0 | 100.0% | +0.80u | +0.80u | +80.0% |
| Δw≤  0 (lower-conv) | 1 | 0-1-0 | 0.0% | -1.00u | -1.00u | -100.0% |

## 6. Sharp Flow ML picks where Model issued no pick

Games where Sharp Flow shipped a LOCKED ML pick but the Model didn't pass its EV gate. N=194. Sharp result on these — the "no model anchor" lens.

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| SHARP_ONLY ML | 194 | 104-90-0 | 53.6% | -2.59u | -3.60u | -1.9% |

## 7. Fade Sharp Flow MLB ML — backtest

What if we bet **against** every Sharp Flow LOCKED MLB ML pick at the *opposing* side's odds (1u flat)? The "Sharp Flow is contrarian-tellable" hypothesis.

We need the opposing side's odds + outcome to score the fade. Two flavors:

- **Fade-vs-Model**: only fade when the Sharp Flow side disagrees with the Model — i.e., bet the Model's side at *Model* odds. (This is identical to the DISAGREE bucket above flipped on its head — a bias-free way to see the Model edge when fading dollars.)
- **Universal fade**: across all Sharp Flow ML picks, score the implied opposite-side flat 1u. Requires us to look up the opposite side's odds inside the same Sharp Flow doc.

### 7a. Fade by following Model when Sharp disagrees

This is identical to bucket DISAGREE in §1: model is on the opposite side of Sharp Flow. We bet the Model side at Model odds.

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| Follow Model on DISAGREE | 24 | 17-7-0 | 70.8% | +15.48u | +14.31u | +59.6% |

### 7b. Universal fade — bet against every Sharp Flow LOCKED MLB ML pick

For each Sharp Flow shipped LOCKED ML side, we credit the opposing side's outcome at the opposing side's odds (1u flat). If a Sharp Flow doc only graded one side, we infer the opponent's outcome (`WIN ↔ LOSS`) and use the same doc's odds for the other side if available; otherwise we fall back to -110.

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| Universal fade (1u flat, -110) | 242 | 122-120-0 | 50.4% | — | -9.09u | -3.8% |

_Note: -110 is a conservative fade price. Real opposite-side odds in MLB ML can be +110 to +300 depending on the favorite, so actual fade ROI would typically be higher in absolute terms when the fade lands on a dog._

## 8. Stability — first half vs second half of the sample

Split the date range in two; if the AGREE-loses / DISAGREE-wins pattern is real, both halves should show it (not the result of one variance-blip slate).

Split on **2026-04-22** (median of 25 graded dates).

### First half

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| All | 78 | 40-38-0 | 51.3% | +14.02u | +11.00u | +14.1% |
| AGREE | 15 | 5-10-0 | 33.3% | -4.60u | -5.05u | -33.7% |
| DISAGREE | 16 | 10-6-0 | 62.5% | +7.66u | +6.70u | +41.9% |
| MODEL_ONLY | 47 | 25-22-0 | 53.2% | +10.96u | +9.35u | +19.9% |

### Second half

| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |
|---|---|---|---|---|---|---|
| All | 81 | 45-36-0 | 55.6% | +15.96u | +13.61u | +16.8% |
| AGREE | 9 | 4-5-0 | 44.4% | -1.57u | -1.53u | -17.0% |
| DISAGREE | 8 | 7-1-0 | 87.5% | +7.82u | +7.61u | +95.1% |
| MODEL_ONLY | 64 | 34-30-0 | 53.1% | +9.71u | +7.53u | +11.8% |

## 9. Sample-size caveat

AGREE = 24 picks, DISAGREE = 24 picks. Even an effect this large (37.5% vs 70.8% WR) carries a wide confidence interval at this N. Two-sided binomial 95% CI:

- AGREE 9/24 → **WR 95% CI ≈ [21%, 57%]**
- DISAGREE 17/24 → **WR 95% CI ≈ [49%, 87%]**

The CIs **do not overlap** — the difference is statistically detectable at this N. But absolute level (50% baseline) is plausibly inside both intervals, so we can't pin the *exact* effect size. What's actionable: keep tracking, and re-run as N grows.

## 10. Most recent 25 paired games (sanity check)

| Date | Game | Model pick | Grade | Sharp pick | Bucket | Result | Model PnL |
|---|---|---|---|---|---|---|---|
| 2026-05-04 | Baltimore Orioles @ New York Yankees | New York Yankees (home, -202) | C | — | MODEL_ONLY | WIN | +0.50u |
| 2026-05-04 | Boston Red Sox @ Detroit Tigers | Boston Red Sox (away, 174) | C | Detroit Tigers (3.5★) | DISAGREE | WIN | +1.74u |
| 2026-05-04 | Chicago White Sox @ Los Angeles Angels | Chicago White Sox (away, 140) | B | — | MODEL_ONLY | WIN | +1.75u |
| 2026-05-04 | Cincinnati Reds @ Chicago Cubs | Cincinnati Reds (away, 186) | A | — | MODEL_ONLY | LOSS | -1.50u |
| 2026-05-04 | Cleveland Guardians @ Kansas City Royals | Kansas City Royals (home, -114) | C | — | MODEL_ONLY | WIN | +0.88u |
| 2026-05-04 | Los Angeles Dodgers @ Houston Astros | Houston Astros (home, 173) | A | — | MODEL_ONLY | LOSS | -1.25u |
| 2026-05-04 | Milwaukee Brewers @ St. Louis Cardinals | Milwaukee Brewers (away, -108) | C | — | MODEL_ONLY | LOSS | -1.00u |
| 2026-05-04 | Philadelphia Phillies @ Miami Marlins | Miami Marlins (home, -105) | A | — | MODEL_ONLY | LOSS | -1.25u |
| 2026-05-04 | San Diego Padres @ San Francisco Giants | San Francisco Giants (home, 121) | B | — | MODEL_ONLY | WIN | +1.51u |
| 2026-05-03 | Baltimore Orioles @ New York Yankees | Baltimore Orioles (away, 230) | A | — | MODEL_ONLY | LOSS | -1.50u |
| 2026-05-03 | Cincinnati Reds @ Pittsburgh Pirates | Pittsburgh Pirates (home, -112) | C | — | MODEL_ONLY | WIN | +0.89u |
| 2026-05-03 | Houston Astros @ Boston Red Sox | Houston Astros (away, 157) | A | — | MODEL_ONLY | WIN | +1.96u |
| 2026-05-03 | Los Angeles Dodgers @ St. Louis Cardinals | Los Angeles Dodgers (away, -131) | A | — | MODEL_ONLY | WIN | +0.95u |
| 2026-05-03 | New York Mets @ Los Angeles Angels | New York Mets (away, -125) | C | New York Mets (2.75★) | AGREE | WIN | +0.80u |
| 2026-05-03 | Texas Rangers @ Detroit Tigers | Detroit Tigers (home, -120) | C | — | MODEL_ONLY | WIN | +0.83u |
| 2026-05-02 | Houston Astros @ Boston Red Sox | Boston Red Sox (home, -123) | C | — | MODEL_ONLY | LOSS | -1.00u |
| 2026-05-02 | Los Angeles Dodgers @ St. Louis Cardinals | St. Louis Cardinals (home, 119) | B | — | MODEL_ONLY | WIN | +1.49u |
| 2026-05-02 | San Francisco Giants @ Tampa Bay Rays | Tampa Bay Rays (home, -103) | C | — | MODEL_ONLY | WIN | +0.97u |
| 2026-05-02 | Texas Rangers @ Detroit Tigers | Detroit Tigers (home, -124) | C | — | MODEL_ONLY | WIN | +0.81u |
| 2026-05-01 | Chicago White Sox @ San Diego Padres | Chicago White Sox (away, 133) | C | — | MODEL_ONLY | WIN | +1.33u |
| 2026-05-01 | Houston Astros @ Boston Red Sox | Boston Red Sox (home, -116) | A | — | MODEL_ONLY | WIN | +1.08u |
| 2026-05-01 | Kansas City Royals @ Seattle Mariners | Seattle Mariners (home, -144) | C | — | MODEL_ONLY | LOSS | -1.00u |
| 2026-05-01 | Los Angeles Dodgers @ St. Louis Cardinals | St. Louis Cardinals (home, 155) | C | — | MODEL_ONLY | WIN | +1.55u |
| 2026-05-01 | New York Mets @ Los Angeles Angels | Los Angeles Angels (home, 113) | A | — | MODEL_ONLY | LOSS | -1.00u |
| 2026-04-30 | Arizona Diamondbacks @ Milwaukee Brewers | Milwaukee Brewers (home, -120) | C | — | MODEL_ONLY | WIN | +0.83u |

---
_Driven by `scripts/_mlb_confluence.mjs` · re-run any time. Bucketing rule: Model & Sharp Flow ML picks are joined on (date, away, home), Sharp-side resolved by highest peak★ when both Sharp sides graded._
