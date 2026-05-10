# WalletStackScore — Honest Point-in-Time Predictor

_Auto-generated **5/5/2026, 2:53:45 PM ET** by `scripts/_walletStackScore.mjs`._

## Why this analysis exists

You asked: **in the absence of HC margin or Δw (winner margin), do total/aggregate/blended side variables predict winners?** This run isolates that question — HC and Δw are reported as REFERENCE only and are explicitly **excluded** from the composite. The score is built purely from aggregate per-side statistics.

All per-wallet metrics are read directly out of `peak.v8Scoring.walletDetails[]` exactly as they were frozen at v8 scoring time. **Zero live recomputation, zero look-ahead bias.**

**Sample**: 104 graded picks (2026-04-18 → 2026-05-04). Filter: V6 dashboard truth (peakStars ≥ 2.5 ∧ ¬SHADOW ∧ ¬MUTED ∧ ¬CANCELLED ∧ ¬superseded). Floor: V6 cutover (2026-04-18+) — full V6 era. HC margin available only for picks dated 2026-04-30+; treated as silent (null) for earlier picks.

**Wallet filter mode**: `WHITELIST-ONLY (CONFIRMED + FLAT)`

> All aggregate features below are computed **only over wallets whose current `whitelistTier` is `CONFIRMED` or `FLAT`** (proven). WR50 / untracked wallets that the v8 engine wrote into `walletDetails[]` are excluded from sums, averages, and best-of metrics. HC margin and Δw are unaffected (they were already proven-only at write time).

> ⚠️ Small look-ahead caveat: we use today's tier as a proxy because tier-at-pick-time is not stored. Tiers change weekly, but the vast majority of wallets are stable — this is far less leaky than including non-proven wallets in the aggregates.

## 0. Baseline (the universe we're predicting on)

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| All shipped+graded V6 picks | 104 | 51-52-1 | 49.5% [40–59] | +0.2% | -6.77u | 0.02 ✗ noise |

## 0a. What's in `walletDetails[]` — wallet-tier distribution

Across every wallet entry in every pick's `walletDetails[]` (FOR + AGAINST sides combined), broken down by current `whitelistTier`. **This is the audit you asked for: how much of the raw aggregate stack is non-proven wallets.**

| Tier | Wallet entries | % of entries | Σ invested $ | % of $ | Σ v8 contribution | % of contrib |
|---|---:|---:|---:|---:|---:|---:|
| **CONFIRMED** (proven) | 167 | 26.8% | $3,288,421 | 20.6% | 9877.9 | 27.8% |
| **FLAT** (proven) | 94 | 15.1% | $2,212,112 | 13.9% | 5183.5 | 14.6% |
| WR50 (losing record) | 74 | 11.9% | $2,904,725 | 18.2% | 4163.7 | 11.7% |
| untracked / not in profile | 287 | 46.1% | $7,540,845 | 47.3% | 16255.3 | 45.8% |
| **TOTAL** | 622 | 100% | $15,946,103 | 100% | 35480.4 | 100% |

**Proven (CONFIRMED+FLAT)** = 42.0% of entries. **Non-proven (WR50 + untracked)** = 58.0% of entries.

> 🚨 **Over 58% of the wallet entries the previous unfiltered analysis was averaging across were NOT proven wallets**. Every Δavg-anything number it produced was diluted by these. The current run filters them out.

## 1. Univariate signal leaderboard — grouped by family

Each feature is `(value on FOR side) − (value on AGAINST side)`. ρ vs binary WIN outcome (excludes PUSH) and ρ vs per-pick flat-1u profit are reported.

### ★ Reference (HC + Δw — context only, EXCLUDED from composite)

| Feature | ρ(WIN) | ρ(flat PnL) | direction |
|---|---|---|---|
| HC margin (CONFIRMED-only, frozen) | 0.091 | 0.106 | ✅ positive |
| Δw (proven winner margin, frozen) | 0.289 | 0.319 | ✅ positive |

### TOTAL / SUM (raw mass on each side)

| Feature | ρ(WIN) | ρ(flat PnL) | direction |
|---|---|---|---|
| Δcount  (raw wallet count diff) | 0.423 | 0.505 | ✅ positive |
| Δinvested $ (sum of $ on each side) | 0.181 | 0.241 | ✅ positive |
| Δcontribution sum (v8 score sum on each side) | 0.455 | 0.499 | ✅ positive |

### BLENDED / AVG (per-wallet means)

| Feature | ρ(WIN) | ρ(flat PnL) | direction |
|---|---|---|---|
| Δcontribution mean (per-wallet) | 0.328 | 0.248 | ✅ positive |
| Δavg walletBase (composite quality) | 0.332 | 0.260 | ✅ positive |
| Δavg lifetime ROI | 0.358 | 0.257 | ✅ positive |
| Δavg lifetime PnL | 0.090 | 0.074 | ✅ positive |
| Δavg sizeRatio (bet-size conviction) | 0.210 | 0.194 | ✅ positive |
| Δavg convictionMult | 0.367 | 0.305 | ✅ positive |
| Δavg roiNorm (0-100) | 0.361 | 0.270 | ✅ positive |
| Δavg pnlNorm (0-100) | 0.255 | 0.231 | ✅ positive |
| Δavg rankNorm (0-100) | 0.143 | 0.122 | ✅ positive |

### CONCENTRATION / BEST (single best wallet)

| Feature | ρ(WIN) | ρ(flat PnL) | direction |
|---|---|---|---|
| Δbest rank (lower → better) | -0.179 | -0.145 | ❌ negative |
| Δbest contribution | 0.398 | 0.343 | ✅ positive |
| Δbest walletBase | 0.389 | 0.326 | ✅ positive |

### 1z. Aggregate-only leaderboard (HC + Δw excluded)

Sorted by `|ρ(flat PnL)|`. The "sign in composite" column is the direction the composite uses (negative-ρ features get flipped before summing).

| Rank | Family | Feature | ρ(WIN) | ρ(flat PnL) | sign in composite |
|---|---|---|---|---|---|
| 1 | TOTAL | Δcount  (raw wallet count diff) | 0.423 | 0.505 | +1 |
| 2 | TOTAL | Δcontribution sum (v8 score sum on each side) | 0.455 | 0.499 | +1 |
| 3 | CONCENTRATION | Δbest contribution | 0.398 | 0.343 | +1 |
| 4 | CONCENTRATION | Δbest walletBase | 0.389 | 0.326 | +1 |
| 5 | BLENDED | Δavg convictionMult | 0.367 | 0.305 | +1 |
| 6 | BLENDED | Δavg roiNorm (0-100) | 0.361 | 0.270 | +1 |
| 7 | BLENDED | Δavg walletBase (composite quality) | 0.332 | 0.260 | — |
| 8 | BLENDED | Δavg lifetime ROI | 0.358 | 0.257 | — |
| 9 | BLENDED | Δcontribution mean (per-wallet) | 0.328 | 0.248 | — |
| 10 | TOTAL | Δinvested $ (sum of $ on each side) | 0.181 | 0.241 | — |
| 11 | BLENDED | Δavg pnlNorm (0-100) | 0.255 | 0.231 | — |
| 12 | BLENDED | Δavg sizeRatio (bet-size conviction) | 0.210 | 0.194 | — |
| 13 | CONCENTRATION | Δbest rank (lower → better) | -0.179 | -0.145 | — |
| 14 | BLENDED | Δavg rankNorm (0-100) | 0.143 | 0.122 | — |
| 15 | BLENDED | Δavg lifetime PnL | 0.090 | 0.074 | — |

## 2. AggregateScore (AGS) — composite construction

We z-score each of the top-6 aggregate features, multiply by its observed sign(ρ), and sum. **No HC margin, no Δw.** This is the answer to the question "can the side aggregates alone predict in the absence of those two signals?"

Composite formula:

```
AGS = + z(dCount)  + z(dContribution)  + z(dBestContrib)  + z(dBestWalletBase)  + z(dConvictionAvg)  + z(dRoiNormAvg)
```

| Rank | Family | Feature | ρ(flat PnL) | sign |
|---|---|---|---|---|
| 1 | TOTAL | `dCount` — Δcount  (raw wallet count diff) | 0.505 | +1 |
| 2 | TOTAL | `dContribution` — Δcontribution sum (v8 score sum on each side) | 0.499 | +1 |
| 3 | CONCENTRATION | `dBestContrib` — Δbest contribution | 0.343 | +1 |
| 4 | CONCENTRATION | `dBestWalletBase` — Δbest walletBase | 0.326 | +1 |
| 5 | BLENDED | `dConvictionAvg` — Δavg convictionMult | 0.305 | +1 |
| 6 | BLENDED | `dRoiNormAvg` — Δavg roiNorm (0-100) | 0.270 | +1 |

⚠️ Feature selection is in-sample (we ranked features on this same data, then picked the top-6). At N this small, expect any apparent edge to shrink 30-50% out of sample.

## 3. AGS quintile / decile breakdown — does the composite separate W from L?

### 3a. Quintile breakdown — cutoffs: -4.77 · -0.46 · 2.74 · 4.27

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst) | 21 | 4-17-0 | 19.0% [8–40] | -62.2% | -17.31u | -3.51 ✓ p<.01 |
| Q2 | 21 | 7-13-1 | 35.0% [18–57] | -24.5% | -10.25u | -1.01 ✗ noise |
| Q3 | 21 | 12-9-0 | 57.1% [37–76] | +14.6% | +4.17u | 0.63 ✗ noise |
| Q4 | 21 | 10-11-0 | 47.6% [28–68] | -9.2% | -10.20u | -0.43 ✗ noise |
| Q5 (best) | 20 | 18-2-0 | 90.0% [70–97] | +86.2% | +26.82u | 3.46 ✓ p<.01 |

### 3b. Decile breakdown — cutoffs: -8.32 · -4.77 · -2.18 · -0.46 · 1.79 · 2.74 · 3.47 · 4.27 · 5.36

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| D1 (worst) | 11 | 2-9-0 | 18.2% [5–48] | -67.4% | -9.55u | -3.05 ✓ p<.01 |
| D2 | 10 | 2-8-0 | 20.0% [6–51] | -56.4% | -7.76u | -1.92 ~ p<.10 |
| D3 | 11 | 2-9-0 | 18.2% [5–48] | -63.6% | -10.22u | -2.60 ✓ p<.01 |
| D4 | 10 | 5-4-1 | 55.6% [27–81] | +18.4% | -0.03u | 0.46 ✗ noise |
| D5 | 11 | 6-5-0 | 54.5% [28–79] | +11.1% | -0.41u | 0.33 ✗ noise |
| D6 | 10 | 6-4-0 | 60.0% [31–83] | +18.5% | +4.58u | 0.55 ✗ noise |
| D7 | 10 | 3-7-0 | 30.0% [11–60] | -46.0% | -12.17u | -1.67 ~ p<.10 |
| D8 | 11 | 7-4-0 | 63.6% [35–85] | +24.3% | +1.97u | 0.81 ✗ noise |
| D9 | 10 | 8-2-0 | 80.0% [49–94] | +43.3% | +9.21u | 1.68 ~ p<.10 |
| D10 (best) | 10 | 10-0-0 | 100.0% [72–100] | +129.2% | +17.61u | 3.28 ✓ p<.01 |

## 4. WSS threshold sweep — finding a clear lock line

How does cohort performance evolve as the WSS threshold tightens? The lock line is wherever the WR / Peak PnL gradient stops climbing meaningfully.

| WSS ≥ | N | Share | W-L-P | WR | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|---|
| ≥  -3 | 76 | 73.1% | 46-29-1 | 61.3% | +23.9% | +17.84u | 1.84 ~ p<.10 |
| ≥  -2 | 71 | 68.3% | 45-25-1 | 64.3% | +29.9% | +22.76u | 2.24 ✓ p<.05 |
| ≥  -1 | 66 | 63.5% | 43-23-0 | 65.2% | +29.6% | +21.53u | 2.19 ✓ p<.05 |
| ≥   0 | 60 | 57.7% | 40-20-0 | 66.7% | +34.0% | +22.04u | 2.38 ✓ p<.05 |
| ≥   1 | 57 | 54.8% | 37-20-0 | 64.9% | +29.6% | +20.68u | 2.02 ✓ p<.05 |
| ≥   2 | 48 | 46.2% | 32-16-0 | 66.7% | +32.2% | +17.60u | 2.00 ✓ p<.05 |
| ≥   3 | 38 | 36.5% | 28-10-0 | 73.7% | +48.2% | +23.37u | 2.66 ✓ p<.01 |
| ≥   4 | 26 | 25.0% | 22-4-0 | 84.6% | +72.4% | +26.45u | 3.37 ✓ p<.01 |
| ≥   5 | 14 | 13.5% | 13-1-0 | 92.9% | +106.0% | +20.65u | 3.30 ✓ p<.01 |
| ≥   6 | 9 | 8.7% | 9-0-0 | 100.0% | +133.1% | +16.59u | 3.04 ✓ p<.01 |
| ≥   7 | 4 | 3.8% | 4-0-0 | 100.0% | +172.3% | +7.00u | 1.68 ~ p<.10 |
| ≥   8 | 3 | 2.9% | 3-0-0 | 100.0% | +196.7% | +6.31u | 1.40 ✗ noise |

## 5. Reverse threshold sweep — the fade zone

Same exercise but the bottom of the distribution. Where does WR fall to "obvious losers"?

| WSS ≤ | N | Share | W-L-P | WR | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|---|
| ≤ -10 | 5 | 4.8% | 1-4-0 | 20.0% | -69.1% | -2.97u | -2.24 ✓ p<.05 |
| ≤  -9 | 7 | 6.7% | 2-5-0 | 28.6% | -48.8% | -3.45u | -1.46 ✗ noise |
| ≤  -8 | 12 | 11.5% | 2-10-0 | 16.7% | -70.1% | -10.05u | -3.44 ✓ p<.01 |
| ≤  -7 | 15 | 14.4% | 3-12-0 | 20.0% | -63.4% | -9.48u | -3.21 ✓ p<.01 |
| ≤  -6 | 16 | 15.4% | 3-13-0 | 18.8% | -65.7% | -11.48u | -3.53 ✓ p<.01 |
| ≤  -5 | 20 | 19.2% | 4-16-0 | 20.0% | -60.3% | -16.31u | -3.25 ✓ p<.01 |
| ≤  -4 | 24 | 23.1% | 5-19-0 | 20.8% | -58.2% | -18.11u | -3.37 ✓ p<.01 |
| ≤  -3 | 28 | 26.9% | 5-23-0 | 17.9% | -64.1% | -24.61u | -4.28 ✓ p<.01 |
| ≤  -2 | 33 | 31.7% | 6-27-0 | 18.2% | -63.8% | -29.53u | -4.64 ✓ p<.01 |
| ≤  -1 | 38 | 36.5% | 8-29-1 | 21.6% | -50.9% | -28.30u | -3.23 ✓ p<.01 |
| ≤   0 | 44 | 42.3% | 11-32-1 | 25.6% | -45.9% | -28.81u | -3.16 ✓ p<.01 |
| ≤   1 | 47 | 45.2% | 14-32-1 | 30.4% | -35.6% | -27.45u | -2.37 ✓ p<.05 |
| ≤   2 | 56 | 53.8% | 19-36-1 | 34.5% | -27.3% | -24.37u | -1.95 ~ p<.10 |
| ≤   3 | 66 | 63.5% | 23-42-1 | 35.4% | -27.5% | -30.14u | -2.18 ✓ p<.05 |

## 6. WSS by sport — does the signal travel?

Same WSS metric, sliced by sport. Confirms whether signal is broad-based or NBA-only.

### MLB — N=29

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| All MLB | 29 | 13-16-0 | 44.8% [28–62] | -12.8% | -5.72u | -0.69 ✗ noise |
| MLB top-20% by WSS | 6 | 4-2-0 | 66.7% [30–90] | +24.3% | +3.45u | 0.61 ✗ noise |

### NBA — N=61

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| All NBA | 61 | 29-31-1 | 48.3% [36–61] | +0.6% | -4.32u | 0.04 ✗ noise |
| NBA top-20% by WSS | 13 | 12-1-0 | 92.3% [67–99] | +106.1% | +20.12u | 3.06 ✓ p<.01 |

### NHL — N=14

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| All NHL | 14 | 9-5-0 | 64.3% [39–84] | +25.3% | +3.27u | 0.94 ✗ noise |
| NHL top-20% by WSS | 3 | 3-0-0 | 100.0% [44–100] | +79.2% | +1.13u | 18.53 ✓ p<.01 |

## 7. Silent-zone analysis — does AGS work when HC and Δw are silent?

Slices the universe by primary-signal strength and asks: in the SUBSET where HC margin and/or Δw are silent (no strong tilt either way), does the aggregate-only composite still separate winners from losers? This is the **direct answer to the brief**.

### 7-zone: Δw silent (Δw ≤ +1, full V6)  (N=57)

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| Zone baseline (all picks in zone) | 57 | 24-32-1 | 42.9% [31–56] | -19.8% | -17.19u | -1.60 ✗ noise |
| Zone Q1 (worst AGS) | 12 | 2-10-0 | 16.7% [5–45] | -70.1% | -8.43u | -3.44 ✓ p<.01 |
| Zone Q2  | 11 | 2-8-1 | 20.0% [6–51] | -54.5% | -6.22u | -2.19 ✓ p<.05 |
| Zone Q3  | 12 | 6-6-0 | 50.0% [25–75] | -12.4% | -1.07u | -0.46 ✗ noise |
| Zone Q4  | 11 | 6-5-0 | 54.5% [28–79] | +2.7% | -6.95u | 0.09 ✗ noise |
| Zone Q5 (best AGS) | 11 | 8-3-0 | 72.7% [43–90] | +39.0% | +5.48u | 1.40 ✗ noise |
| AGS ≥ 0 within zone | 29 | 17-12-0 | 58.6% [41–74] | +10.6% | -2.87u | 0.60 ✗ noise |
| AGS < 0 within zone | 28 | 7-20-1 | 25.9% [13–45] | -51.4% | -14.32u | -3.37 ✓ p<.01 |

### 7-zone: Δw silent — HC era only (Δw ≤ +1, ≥ 2026-04-30)  (N=14)

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| Zone baseline (all picks in zone) | 14 | 8-6-0 | 57.1% [33–79] | +6.9% | -2.39u | 0.27 ✗ noise |
| Zone Q1 (worst AGS) | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -2.63u | 0.00 ✗ noise |
| Zone Q2  | 3 | 2-1-0 | 66.7% [21–94] | +22.6% | -0.17u | 0.37 ✗ noise |
| Zone Q3  | 3 | 2-1-0 | 66.7% [21–94] | +17.2% | -0.07u | 0.29 ✗ noise |
| Zone Q4  | 3 | 2-1-0 | 66.7% [21–94] | +29.0% | -1.22u | 0.45 ✗ noise |
| Zone Q5 (best AGS) | 2 | 2-0-0 | 100.0% [34–100] | +95.2% | +1.70u | 105.00 ✓ p<.01 |
| AGS ≥ 0 within zone | 8 | 6-2-0 | 75.0% [41–93] | +41.1% | +0.41u | 1.32 ✗ noise |
| AGS < 0 within zone | 6 | 2-4-0 | 33.3% [10–70] | -38.7% | -2.80u | -1.00 ✗ noise |

### 7-zone: HC silent (HC ≤ 0, HC era only)  (N=5)

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| Zone baseline (all picks in zone) | 5 | 3-2-0 | 60.0% [23–88] | +13.9% | -3.50u | 0.30 ✗ noise |
| Zone Q1 (worst AGS) | 2 | 1-1-0 | 50.0% [9–91] | -4.5% | -3.00u | -0.05 ✗ noise |
| Zone Q2  | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.50u | 0.00 ✗ n<2 |
| Zone Q3  | 1 | 1-0-0 | 100.0% [21–100] | +90.9% | +0.00u | 0.00 ✗ n<2 |
| Zone Q4  | 1 | 1-0-0 | 100.0% [21–100] | +87.7% | +0.00u | 0.00 ✗ n<2 |
| Zone Q5 (best AGS) | 0 | — | — | — | — | — |
| AGS ≥ 0 within zone | 2 | 2-0-0 | 100.0% [34–100] | +89.3% | +0.00u | 56.00 ✓ p<.01 |
| AGS < 0 within zone | 3 | 1-2-0 | 33.3% [6–79] | -36.4% | -3.50u | -0.57 ✗ noise |

### 7-zone: BOTH silent (Δw ≤ +1 ∧ HC ≤ 0, HC era only)  (N=2)

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| Zone baseline (all picks in zone) | 2 | 2-0-0 | 100.0% [34–100] | +90.9% | +0.00u | 0.00 ✗ noise |

### 7-zone: CONTROL — Δw loud (Δw ≥ +2, full V6)  (N=47)

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| Zone baseline (all picks in zone) | 47 | 27-20-0 | 57.4% [43–70] | +24.4% | +10.42u | 1.32 ✗ noise |
| Zone Q1 (worst AGS) | 10 | 2-8-0 | 20.0% [6–51] | -56.4% | -12.88u | -1.92 ~ p<.10 |
| Zone Q2  | 9 | 4-5-0 | 44.4% [19–73] | +17.8% | -2.19u | 0.35 ✗ noise |
| Zone Q3  | 10 | 6-4-0 | 60.0% [31–83] | +20.8% | +4.95u | 0.61 ✗ noise |
| Zone Q4  | 9 | 7-2-0 | 77.8% [45–94] | +41.8% | +6.17u | 1.49 ✗ noise |
| Zone Q5 (best AGS) | 9 | 8-1-0 | 88.9% [56–98] | +107.6% | +14.37u | 2.11 ✓ p<.05 |
| AGS ≥ 0 within zone | 31 | 23-8-0 | 74.2% [57–86] | +55.8% | +24.91u | 2.59 ✓ p<.01 |
| AGS < 0 within zone | 16 | 4-12-0 | 25.0% [10–49] | -36.4% | -14.49u | -1.19 ✗ noise |

### 7-zone: CONTROL — HC loud (HC ≥ +1, HC era only)  (N=18)

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| Zone baseline (all picks in zone) | 18 | 9-9-0 | 50.0% [29–71] | +0.3% | -0.95u | 0.01 ✗ noise |
| Zone Q1 (worst AGS) | 4 | 0-4-0 | 0.0% [0–49] | -100.0% | -3.38u | 0.00 ✗ noise |
| Zone Q2  | 4 | 3-1-0 | 75.0% [30–95] | +58.9% | -0.74u | 0.96 ✗ noise |
| Zone Q3  | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -5.75u | 0.00 ✗ noise |
| Zone Q4  | 4 | 3-1-0 | 75.0% [30–95] | +45.3% | +1.67u | 0.94 ✗ noise |
| Zone Q5 (best AGS) | 3 | 3-0-0 | 100.0% [44–100] | +96.5% | +7.25u | 117.00 ✓ p<.01 |
| AGS ≥ 0 within zone | 12 | 8-4-0 | 66.7% [39–86] | +35.8% | +3.85u | 1.18 ✗ noise |
| AGS < 0 within zone | 6 | 1-5-0 | 16.7% [3–56] | -70.5% | -4.80u | -2.39 ✓ p<.05 |

## 8. Most recent 25 graded picks — AGS sanity table

| Date | Game | Pick | Mkt | Outcome | AGS | HC | Δw | Δcount | Δcontrib | Δbest-rank |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-05-04 | Ducks @ Golden Knights | Golden Knights | ML | **W** | 0.98 | +1 | +1 | +1 | +42.3 | +0 |
| 2026-05-04 | 76ers @ Knicks | Under 213 | TOTAL | L | 2.83 | +1 | +2 | +2 | +109.8 | +0 |
| 2026-05-04 | 76ers @ Knicks | 76ers | SPREAD | L | 5.36 | +1 | +2 | +2 | +141.1 | +0 |
| 2026-05-04 | 76ers @ Knicks | 76ers | ML | L | -0.33 | -1 | +3 | +3 | +171.5 | +37 |
| 2026-05-04 | Timberwolves @ Spurs | Under 219.5 | TOTAL | **W** | 6.01 | +1 | +3 | +3 | +185.4 | +0 |
| 2026-05-04 | Timberwolves @ Spurs | Timberwolves | SPREAD | **W** | 8.32 | +1 | +5 | +5 | +303.8 | +0 |
| 2026-05-04 | Boston Red Sox @ Detroit Tigers | Detroit Tigers | ML | L | -5.62 | +1 | -1 | -1 | -18.1 | -147 |
| 2026-05-03 | Raptors @ Cavaliers | Cavaliers | SPREAD | **W** | 6.24 | +1 | +0 | +1 | +131.9 | +0 |
| 2026-05-03 | Raptors @ Cavaliers | Raptors | ML | L | 1.01 | +1 | +1 | +2 | +197.8 | +160 |
| 2026-05-03 | Magic @ Pistons | Pistons | SPREAD | **W** | 4.27 | +1 | +1 | +1 | +92.5 | +0 |
| 2026-05-03 | Magic @ Pistons | Magic | ML | L | -3.92 | +1 | +0 | +0 | +40.2 | -27 |
| 2026-05-03 | New York Mets @ Los Angeles Angels | New York Mets | ML | **W** | -1.19 | +1 | +1 | +0 | +45.2 | -168 |
| 2026-05-02 | 76ers @ Celtics | Over 205 | TOTAL | **W** | 3.76 | +1 | +1 | +2 | +111.4 | +0 |
| 2026-05-02 | Arizona Diamondbacks @ Chicago Cubs | Arizona Diamondbacks | ML | L | 2.80 | +1 | +1 | +1 | +66.6 | +0 |
| 2026-05-01 | Lightning @ Canadiens | Lightning | ML | **W** | 4.06 | +0 | +2 | +4 | +165.7 | +0 |
| 2026-05-01 | Lakers @ Rockets | Under 205.5 | TOTAL | **W** | 2.26 | +0 | +1 | +1 | +51.9 | +0 |
| 2026-05-01 | Lakers @ Rockets | Rockets | SPREAD | L | -3.14 | +1 | +2 | +1 | +56.5 | +412 |
| 2026-05-01 | Lakers @ Rockets | Rockets | ML | L | -3.31 | -1 | +3 | +3 | +73.9 | +0 |
| 2026-05-01 | Cleveland Guardians @ Athletics | Cleveland Guardians | ML | **W** | -0.46 | +0 | +1 | +1 | +31.4 | +0 |
| 2026-04-30 | Oilers @ Ducks | Oilers | ML | L | -3.42 | +1 | +0 | +0 | +34.5 | +304 |
| 2026-04-30 | Nuggets @ Timberwolves | Under 224 | TOTAL | **W** | 5.49 | +1 | +1 | +2 | +136.4 | +0 |
| 2026-04-30 | Nuggets @ Timberwolves | Nuggets | SPREAD | L | -7.71 | +1 | +0 | +0 | -54.3 | -25 |
| 2026-04-30 | Celtics @ 76ers | 76ers | ML | **W** | 0.88 | +1 | +2 | +3 | +207.5 | +34 |
| 2026-04-29 | NHL Playoffs: Who Will Win Series? - Canadiens @ Lightning | NHL Playoffs: Who Will Win Series? - Canadiens | ML | **W** | 2.00 | +0 | +2 | +2 | +87.2 | +0 |
| 2026-04-29 | Raptors @ Cavaliers | Over 216 | TOTAL | **W** | 6.90 | +0 | +2 | +2 | +186.8 | +0 |

## 9. Practical lock candidates

Three WSS-based lock rules sorted by selectivity. Each is a single threshold (no joint conditions), so they're production-trivial to implement.

| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |
|---|---|---|---|---|---|---|
| WSS ≥ +3 | 38 | 28-10-0 | 73.7% [58–85] | +48.2% | +23.37u | 2.66 ✓ p<.01 |
| WSS ≥ +5 | 14 | 13-1-0 | 92.9% [69–99] | +106.0% | +20.65u | 3.30 ✓ p<.01 |
| WSS ≥ +7 | 4 | 4-0-0 | 100.0% [51–100] | +172.3% | +7.00u | 1.68 ~ p<.10 |
| WSS ≥ +9 | 0 | — | — | — | — | — |
| Top-quintile (Q5) | 20 | 18-2-0 | 90.0% [70–97] | +86.2% | +26.82u | 3.46 ✓ p<.01 |
| Top-decile (D10) | 10 | 10-0-0 | 100.0% [72–100] | +129.2% | +17.61u | 3.28 ✓ p<.01 |

## 10. Reading the result

**Q5 vs Q1 spread on AGS** is the single number that answers the brief. If Q5 (best AGS) outperforms Q1 (worst AGS) cleanly within the silent-zone subsets in §7, the aggregate stack is adding signal *independently* of HC and Δw. If it doesn't, the aggregate stack is just a noisier version of HC/Δw and the engine should ignore it.

Per-row grade key:

- ✅ WIN — AGS ≥ 0 zone outperforms AGS < 0 zone with N ≥ 8 each
- ⚠️ MIXED — directional but underpowered (small N or near-flat WR gap)
- ❌ NULL — no separation, AGS is noise within this zone

---
_Driven by `scripts/_walletStackScore.mjs`. Re-run any time. Output regenerates from frozen pick documents only._