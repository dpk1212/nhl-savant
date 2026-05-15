# Legacy-Factor Historical Audit

Generated: 4/21/2026, 3:07:24 PM ET · V8 cutover: 2026-04-18

**Purpose.** We cannot compute `maxRoiN_F` / `meanBase_F` for pre-V8 picks — the per-wallet `walletDetails` array was never stored on those docs. But we *did* store aggregate wallet-quality proxies (`walletProfile.{dominantTier, conviction, concentration, breadth}`, `consensusStrength.{grade, moneyPct, walletPct}`, `stars`, `regime`, `evEdge`). This report checks whether any of those legacy fields historically predicted winners over the **full 38-day sample** — and shows, inside the V8-era slice, which legacy proxy correlates best with the true V8 signals so we know which one to trust as a stand-in.

**Samples**

- Full: **N=629  WR=53.6%  flatROI=-4.6%  wtdROI=-4.7%** · flat PnL **-28.64u**
- Pre-V8 (2026-03-16 → 2026-04-17): **N=587  WR=53.8%  flatROI=-4.6%  wtdROI=-5.1%** · flat PnL **-27.23u**
- V8-era (≥ 2026-04-18): **N=42  WR=50.0%  flatROI=-3.4%  wtdROI=+2.6%** · flat PnL **-1.41u**

## 0. Legacy-field availability by era

A field is only usable for historical analysis if it has meaningful coverage in the pre-V8 sample.

| Field | Pre-V8 coverage | V8-era coverage | Usable for full-history study? |
|---|---|---|---|
| stars | 97% | 100% | YES |
| regime | 29% | 100% | partial (late pre-V8) |
| evEdge | 100% | 100% | YES |
| sharpCount | 100% | 100% | YES |
| totalInvested | 100% | 100% | YES |
| units | 100% | 100% | YES |
| walletProfile.dominantTier | 29% | 100% | partial (late pre-V8) |
| walletProfile.conviction | 29% | 100% | partial (late pre-V8) |
| walletProfile.concentration | 29% | 100% | partial (late pre-V8) |
| walletProfile.breadth | 29% | 100% | partial (late pre-V8) |
| opposition.consensusTier | 48% | 60% | partial (late pre-V8) |
| consensusStrength.grade | 100% | 100% | YES |
| consensusStrength.moneyPct | 99% | 100% | YES |
| consensusStrength.walletPct | 99% | 100% | YES |
| lockStage | 6% | 100% | NO — V8-era only |

---

## 1. Daily PnL timeline (full 38 days, flat units)

| Date | Picks | WR | flat ROI | wtd ROI | Flat PnL (u) | Cum flat PnL (u) |
|---|---|---|---|---|---|---|
| 2026-03-25 | 2 | 0.0% | -100.0% | -100.0% | -2.00 | -2.00 |
| 2026-03-26 | 29 | 69.0% | +36.5% | +33.6% | +10.59 | +8.59 |
| 2026-03-27 | 14 | 50.0% | -6.2% | +4.7% | -0.87 | +7.73 |
| 2026-03-28 | 27 | 59.3% | -5.1% | -7.3% | -1.38 | +6.35 |
| 2026-03-29 | 12 | 50.0% | -16.0% | -25.9% | -1.92 | +4.42 |
| 2026-03-30 | 24 | 50.0% | -20.9% | -18.0% | -5.03 | -0.61 |
| 2026-03-31 | 25 | 56.0% | -5.0% | -3.6% | -1.25 | -1.86 |
| 2026-04-01 | 25 | 64.0% | +10.5% | +14.8% | +2.62 | +0.76 |
| 2026-04-02 | 28 | 64.3% | +3.8% | +0.9% | +1.07 | +1.82 |
| 2026-04-03 | 19 | 47.4% | -11.8% | +3.9% | -2.24 | -0.42 |
| 2026-04-04 | 29 | 69.0% | +21.8% | +28.0% | +6.32 | +5.90 |
| 2026-04-05 | 27 | 51.9% | -10.8% | -10.4% | -2.92 | +2.98 |
| 2026-04-06 | 16 | 43.8% | -19.3% | -27.0% | -3.09 | -0.11 |
| 2026-04-07 | 26 | 53.8% | -10.9% | -16.1% | -2.84 | -2.95 |
| 2026-04-08 | 20 | 55.0% | +3.6% | -2.3% | +0.72 | -2.24 |
| 2026-04-09 | 24 | 50.0% | -20.8% | -5.6% | -4.99 | -7.23 |
| 2026-04-10 | 34 | 55.9% | +5.8% | -10.8% | +1.97 | -5.26 |
| 2026-04-11 | 30 | 46.7% | -17.6% | -20.6% | -5.27 | -10.53 |
| 2026-04-12 | 52 | 53.8% | -4.6% | -14.0% | -2.37 | -12.90 |
| 2026-04-13 | 32 | 53.1% | -4.6% | +3.8% | -1.48 | -14.39 |
| 2026-04-14 | 30 | 43.3% | -15.9% | -7.5% | -4.77 | -19.15 |
| 2026-04-15 | 26 | 42.3% | -23.4% | -24.3% | -6.08 | -25.23 |
| 2026-04-16 | 19 | 57.9% | +11.0% | -4.7% | +2.08 | -23.15 |
| 2026-04-17 | 17 | 41.2% | -24.0% | -30.6% | -4.08 | -27.23 |
| 2026-04-18 | 14 | 42.9% | -23.9% | +9.7% | -3.35 | -30.58 |
| 2026-04-19 | 11 | 54.5% | +14.9% | +20.6% | +1.64 | -28.94 |
| 2026-04-20 | 17 | 52.9% | +1.8% | -20.5% | +0.30 | -28.64 |

---

## 2. Single-factor breakdowns (full 38-day sample)

Only fields with ≥50% pre-V8 coverage are reported here (see §0). Fields with partial or V8-only coverage appear in §3.

### Sport
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CBB | 20 | 60.0% | -0.4% | +0.1% | -0.09 |
| MLB | 281 | 52.0% | -5.0% | -3.5% | -14.16 |
| NBA | 143 | 53.1% | -8.9% | -14.4% | -12.75 |
| NHL | 185 | 55.7% | -0.9% | +0.0% | -1.64 |

### Market
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| ML | 526 | 54.4% | -4.7% | -4.5% | -24.94 |
| SPREAD | 33 | 48.5% | -5.5% | -14.7% | -1.81 |
| TOTAL | 70 | 50.0% | -2.7% | -2.0% | -1.88 |

### Stars
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| ★<2 | 15 | 53.3% | +2.5% | -16.0% | +0.37 |
| ★=2 | 128 | 56.3% | +2.4% | +3.9% | +3.09 |
| ★=3 | 304 | 53.0% | -7.5% | -3.9% | -22.73 |
| ★=4 | 165 | 52.1% | -5.7% | -7.2% | -9.40 |
| ★≥5 | 17 | 58.8% | +0.2% | -4.6% | +0.03 |

### Regime
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CLEAR_MOVE | 41 | 61.0% | +13.2% | +15.6% | +5.41 |
| NEAR_START | 41 | 46.3% | -8.8% | -14.0% | -3.60 |
| NO_MOVE | 119 | 47.1% | -15.4% | -15.3% | -18.38 |
| SMALL_MOVE | 9 | 44.4% | -18.3% | -53.1% | -1.65 |
| UNKNOWN | 419 | 55.6% | -2.5% | -2.5% | -10.42 |

### evEdge band
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| EV 2–5% | 17 | 52.9% | -2.0% | -1.3% | -0.33 |
| EV 5–10% | 4 | 25.0% | -37.0% | -28.0% | -1.48 |
| EV<2% | 605 | 53.7% | -4.7% | -4.8% | -28.30 |
| EV≥10% | 3 | 66.7% | +49.2% | +16.0% | +1.48 |

### Sharp count
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| sharps 3–4 | 172 | 54.1% | -6.0% | -4.0% | -10.39 |
| sharps=1 | 22 | 50.0% | +0.6% | +9.2% | +0.13 |
| sharps=2 | 71 | 46.5% | -16.3% | -20.6% | -11.55 |
| sharps≥5 | 364 | 54.9% | -1.9% | -3.8% | -6.82 |

### Total invested band
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| $10–20k | 125 | 52.0% | -9.8% | -5.9% | -12.20 |
| $2–5k | 52 | 42.3% | -22.2% | -16.9% | -11.56 |
| $5–10k | 133 | 51.9% | -4.5% | -8.1% | -6.01 |
| $<2k | 51 | 54.9% | +5.5% | +5.8% | +2.80 |
| $≥20k | 268 | 57.1% | -0.6% | -2.6% | -1.67 |

### Units posted
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| u<1 | 113 | 50.4% | -8.0% | -9.6% | -9.01 |
| u=1 | 169 | 49.7% | -5.2% | -5.6% | -8.76 |
| u=1.5 | 132 | 52.3% | -11.3% | -11.1% | -14.97 |
| u≥2 | 215 | 59.1% | +1.9% | -1.3% | +4.11 |

---

## 3. Late-adopted fields (walletProfile + consensusStrength)

These fields started being written well into the pre-V8 window (most around 2026-04-10 → 2026-04-17). The breakdown below restricts to rows where the field exists — smaller N but covers the same conceptual territory as V8 wallet quality.

*walletProfile.dominantTier — coverage: 211/629 picks*

### walletProfile.dominantTier
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| ELITE | 176 | 49.4% | -7.6% | -6.3% | -13.45 |
| PROVEN | 13 | 38.5% | -32.1% | -28.7% | -4.17 |
| SHARP | 22 | 54.5% | -7.3% | -29.8% | -1.60 |

*walletProfile.conviction — coverage: 211/629 picks*

### walletProfile.conviction
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| conv 0.5–0.7 | 47 | 46.8% | -12.3% | -15.5% | -5.79 |
| conv 0.7–0.9 | 61 | 49.2% | -12.8% | -17.4% | -7.81 |
| conv<0.5 | 1 | 0.0% | -100.0% | -100.0% | -1.00 |
| conv≥0.9 | 102 | 51.0% | -4.5% | -4.2% | -4.62 |

*walletProfile.concentration — coverage: 211/629 picks*

### walletProfile.concentration
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| conc 0.5–0.7 | 64 | 51.6% | -2.3% | -1.5% | -1.46 |
| conc 0.7–0.9 | 61 | 39.3% | -28.3% | -28.8% | -17.27 |
| conc<0.5 | 43 | 55.8% | +0.5% | -7.0% | +0.22 |
| conc≥0.9 | 43 | 53.5% | -1.6% | -3.6% | -0.70 |

*walletProfile.breadth — coverage: 211/629 picks*

### walletProfile.breadth
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| bre 0.5–0.7 | 74 | 47.3% | -15.0% | -16.0% | -11.12 |
| bre 0.7–0.9 | 45 | 57.8% | +10.5% | +9.4% | +4.73 |
| bre<0.5 | 58 | 48.3% | -13.4% | -12.2% | -7.75 |
| bre≥0.9 | 34 | 44.1% | -14.9% | -21.6% | -5.08 |

*opposition.consensusTier — coverage: 304/629 picks*

### opposition.consensusTier
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CONTESTED | 300 | 51.7% | -9.2% | -10.0% | -27.47 |
| LEAN | 4 | 50.0% | +3.6% | +31.7% | +0.14 |

*consensusStrength.grade — coverage: 629/629 picks*

### consensusStrength.grade
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CONTESTED | 38 | 44.7% | -19.7% | -19.0% | -7.49 |
| DOMINANT | 237 | 53.6% | -3.4% | -5.4% | -8.12 |
| LEAN | 140 | 53.6% | -4.6% | -4.0% | -6.44 |
| STRONG | 214 | 55.1% | -3.1% | -3.3% | -6.59 |

*consensusStrength.moneyPct — coverage: 623/629 picks*

### consensusStrength.moneyPct
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| $% 60–75 | 140 | 56.4% | +0.5% | +0.3% | +0.71 |
| $% 75–90 | 165 | 53.3% | -5.1% | -2.4% | -8.48 |
| $%<60 | 68 | 42.6% | -17.3% | -18.3% | -11.78 |
| $%≥90 | 250 | 55.2% | -4.0% | -6.3% | -10.05 |

*consensusStrength.walletPct — coverage: 623/629 picks*

### consensusStrength.walletPct
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| w% 60–75 | 202 | 55.0% | -2.9% | -8.2% | -5.78 |
| w% 75–90 | 113 | 52.2% | -0.2% | +0.2% | -0.27 |
| w%<60 | 238 | 55.5% | -5.2% | +1.3% | -12.41 |
| w%≥90 | 70 | 45.7% | -15.9% | -22.4% | -11.14 |

---

## 4. Daily stability of each legacy factor bucket

Which legacy buckets are consistently positive across days (stable historical edge) vs flip-flopping (sample noise)?

### 4a. Most-stable positive buckets (positive ≥75% of appearance-days, min 3 days, min N=10)

| Factor | Bucket | Days appeared | Days positive | % positive | TOTAL |
|---|---|---|---|---|---|

### 4b. Most-stable bleeder buckets (positive ≤25% of days, min 3 days, min N=10)

| Factor | Bucket | Days appeared | Days positive | % positive | TOTAL |
|---|---|---|---|---|---|
| walletProfile.dominantTier | PROVEN | 4 | 0 | 0% | N=13 · -32.1% · -4.17u |
| walletProfile.concentration | conc 0.7–0.9 | 9 | 1 | 11% | N=61 · -28.3% · -17.27u |
| Regime | NO_MOVE | 7 | 1 | 14% | N=119 · -15.4% · -18.38u |
| walletProfile.conviction | conv 0.7–0.9 | 8 | 0 | 0% | N=61 · -12.8% · -7.81u |

---

## 5. V8-proxy correspondence (which legacy field tracks V8 wallet quality?)

Inside the V8-era slice we have *both* the legacy aggregate fields AND the true V8 `meanBase_F` / `maxRoiN_F`. For each legacy bucket, we show the average V8 signal value and the share of the bucket that clears our live V8.3 thresholds. This tells us **which legacy field is the best historical stand-in**.

Only V8-era rows where we have walletDetails (N=35).

### walletProfile.dominantTier
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| ELITE | 35 | 54.5 | 71.8 | 40% | 46% |

### walletProfile.conviction
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| conv 0.7–0.9 | 7 | 55.9 | 63.4 | 29% | 14% |
| conv≥0.9 | 28 | 54.2 | 73.9 | 43% | 54% |

### walletProfile.concentration
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| conc 0.5–0.7 | 11 | 49.8 | 68.4 | 9% | 36% |
| conc 0.7–0.9 | 15 | 55.5 | 74.8 | 47% | 53% |
| conc<0.5 | 4 | 52.0 | 66.0 | 25% | 25% |
| conc≥0.9 | 5 | 63.8 | 75.0 | 100% | 60% |

### walletProfile.breadth
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| bre 0.5–0.7 | 12 | 55.0 | 68.2 | 58% | 33% |
| bre 0.7–0.9 | 7 | 48.7 | 72.1 | 14% | 57% |
| bre<0.5 | 2 | 63.4 | 88.3 | 50% | 100% |
| bre≥0.9 | 14 | 55.7 | 72.4 | 36% | 43% |

### consensusStrength.grade
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| CONTESTED | 1 | 43.4 | 62.0 | 0% | 0% |
| DOMINANT | 18 | 54.5 | 71.8 | 39% | 44% |
| LEAN | 9 | 54.8 | 72.1 | 56% | 44% |
| STRONG | 7 | 55.7 | 73.0 | 29% | 57% |

### consensusStrength.moneyPct
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| $% 60–75 | 8 | 56.4 | 70.1 | 63% | 38% |
| $% 75–90 | 3 | 59.3 | 73.9 | 33% | 33% |
| $%<60 | 7 | 49.3 | 72.5 | 14% | 57% |
| $%≥90 | 17 | 54.9 | 71.9 | 41% | 47% |

### consensusStrength.walletPct
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| w% 60–75 | 10 | 55.2 | 71.7 | 50% | 50% |
| w% 75–90 | 5 | 49.5 | 72.7 | 20% | 60% |
| w%<60 | 6 | 54.7 | 69.8 | 50% | 33% |
| w%≥90 | 14 | 55.7 | 72.4 | 36% | 43% |

### Stars
| Bucket | N | avg meanBase_F | avg maxRoiN_F | % of bucket with meanBase≥55 | % with maxRoiN≥70 |
|---|---|---|---|---|---|
| ★=2 | 16 | 56.4 | 68.9 | 56% | 38% |
| ★=3 | 13 | 53.0 | 73.1 | 23% | 46% |
| ★=4 | 5 | 52.5 | 73.4 | 40% | 60% |
| ★≥5 | 1 | 54.9 | 92.7 | 0% | 100% |

---

## 6. Pre-V8 only: does the legacy proxy edge hold in the pre-V8 sample alone?

Strips out V8-era rows entirely. If a legacy proxy was ONLY edgy because of V8-era results bleeding in, it will look flat here. True historical edge shows up in both.

### Sport · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CBB | 20 | 60.0% | -0.4% | +0.1% | -0.09 |
| MLB | 265 | 51.3% | -6.5% | -5.4% | -17.18 |
| NBA | 124 | 55.6% | -6.5% | -13.6% | -8.09 |
| NHL | 178 | 55.6% | -1.1% | +0.4% | -1.87 |

### Market · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| ML | 501 | 54.5% | -5.0% | -5.3% | -24.91 |
| SPREAD | 27 | 55.6% | +8.4% | +0.4% | +2.28 |
| TOTAL | 59 | 47.5% | -7.8% | -4.9% | -4.60 |

### Stars · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| ★<2 | 15 | 53.3% | +2.5% | -16.0% | +0.37 |
| ★=2 | 112 | 56.3% | +1.5% | +4.1% | +1.65 |
| ★=3 | 289 | 53.6% | -6.3% | -3.3% | -18.27 |
| ★=4 | 157 | 52.2% | -6.9% | -8.4% | -10.77 |
| ★≥5 | 14 | 57.1% | -1.5% | -7.5% | -0.21 |

### Regime · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CLEAR_MOVE | 30 | 56.7% | +7.2% | +6.3% | +2.16 |
| NEAR_START | 19 | 47.4% | -13.4% | -20.9% | -2.55 |
| NO_MOVE | 116 | 48.3% | -13.3% | -13.9% | -15.38 |
| SMALL_MOVE | 3 | 33.3% | -34.9% | -51.2% | -1.05 |
| UNKNOWN | 419 | 55.6% | -2.5% | -2.5% | -10.42 |

### evEdge band · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| EV 2–5% | 16 | 56.3% | +4.2% | +1.9% | +0.67 |
| EV 5–10% | 4 | 25.0% | -37.0% | -28.0% | -1.48 |
| EV<2% | 564 | 53.9% | -4.9% | -5.3% | -27.90 |
| EV≥10% | 3 | 66.7% | +49.2% | +16.0% | +1.48 |

### Sharp count · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| sharps 3–4 | 155 | 54.2% | -5.6% | -4.9% | -8.75 |
| sharps=1 | 19 | 52.6% | +7.8% | +8.2% | +1.49 |
| sharps=2 | 56 | 42.9% | -25.2% | -26.4% | -14.09 |
| sharps≥5 | 357 | 55.5% | -1.6% | -3.5% | -5.88 |

### Total invested band · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| $10–20k | 115 | 53.0% | -8.0% | -4.2% | -9.24 |
| $2–5k | 52 | 42.3% | -22.2% | -16.9% | -11.56 |
| $5–10k | 133 | 51.9% | -4.5% | -8.1% | -6.01 |
| $<2k | 51 | 54.9% | +5.5% | +5.8% | +2.80 |
| $≥20k | 236 | 57.6% | -1.4% | -3.9% | -3.23 |

### Units posted · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| u<1 | 91 | 50.5% | -8.0% | -8.4% | -7.26 |
| u=1 | 159 | 50.3% | -5.5% | -5.9% | -8.72 |
| u=1.5 | 129 | 52.7% | -10.8% | -10.7% | -13.90 |
| u≥2 | 208 | 58.7% | +1.3% | -2.2% | +2.65 |

*walletProfile.dominantTier · pre-V8 only — coverage: 169/587 pre-V8 picks*

### walletProfile.dominantTier · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| ELITE | 134 | 49.3% | -9.0% | -8.2% | -12.04 |
| PROVEN | 13 | 38.5% | -32.1% | -28.7% | -4.17 |
| SHARP | 22 | 54.5% | -7.3% | -29.8% | -1.60 |

*walletProfile.conviction · pre-V8 only — coverage: 169/587 pre-V8 picks*

### walletProfile.conviction · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| conv 0.5–0.7 | 47 | 46.8% | -12.3% | -15.5% | -5.79 |
| conv 0.7–0.9 | 54 | 50.0% | -11.3% | -15.6% | -6.09 |
| conv<0.5 | 1 | 0.0% | -100.0% | -100.0% | -1.00 |
| conv≥0.9 | 67 | 50.7% | -7.4% | -8.4% | -4.93 |

*walletProfile.concentration · pre-V8 only — coverage: 169/587 pre-V8 picks*

### walletProfile.concentration · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| conc 0.5–0.7 | 50 | 54.0% | -0.1% | -4.0% | -0.05 |
| conc 0.7–0.9 | 46 | 37.0% | -32.8% | -32.2% | -15.10 |
| conc<0.5 | 39 | 56.4% | +1.3% | -6.1% | +0.49 |
| conc≥0.9 | 34 | 50.0% | -9.2% | -8.2% | -3.14 |

*walletProfile.breadth · pre-V8 only — coverage: 169/587 pre-V8 picks*

### walletProfile.breadth · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| bre 0.5–0.7 | 59 | 47.5% | -15.1% | -16.8% | -8.89 |
| bre 0.7–0.9 | 38 | 60.5% | +10.0% | +8.2% | +3.81 |
| bre<0.5 | 56 | 48.2% | -12.4% | -11.2% | -6.93 |
| bre≥0.9 | 16 | 31.3% | -36.2% | -44.5% | -5.79 |

*opposition.consensusTier · pre-V8 only — coverage: 279/587 pre-V8 picks*

### opposition.consensusTier · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CONTESTED | 275 | 51.6% | -10.0% | -11.9% | -27.44 |
| LEAN | 4 | 50.0% | +3.6% | +31.7% | +0.14 |

*consensusStrength.grade · pre-V8 only — coverage: 587/587 pre-V8 picks*

### consensusStrength.grade · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| CONTESTED | 37 | 45.9% | -17.6% | -17.5% | -6.49 |
| DOMINANT | 214 | 53.3% | -4.2% | -6.7% | -9.06 |
| LEAN | 131 | 53.4% | -6.7% | -4.9% | -8.79 |
| STRONG | 205 | 56.1% | -1.4% | -2.6% | -2.89 |

*consensusStrength.moneyPct · pre-V8 only — coverage: 581/587 pre-V8 picks*

### consensusStrength.moneyPct · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| $% 60–75 | 132 | 56.8% | +1.5% | +1.0% | +1.92 |
| $% 75–90 | 160 | 54.4% | -3.3% | -1.6% | -5.23 |
| $%<60 | 61 | 42.6% | -21.1% | -21.4% | -12.90 |
| $%≥90 | 228 | 54.8% | -5.3% | -7.8% | -11.99 |

*consensusStrength.walletPct · pre-V8 only — coverage: 581/587 pre-V8 picks*

### consensusStrength.walletPct · pre-V8 only
| Bucket | N | WR | flat ROI | wtd ROI | Flat PnL (u) |
|---|---|---|---|---|---|
| w% 60–75 | 191 | 53.9% | -6.1% | -9.9% | -11.70 |
| w% 75–90 | 108 | 52.8% | +0.9% | +0.3% | +0.95 |
| w%<60 | 230 | 57.0% | -2.4% | +2.8% | -5.60 |
| w%≥90 | 52 | 42.3% | -22.8% | -31.2% | -11.85 |

---

## 7. Verdict (auto-distilled — read §5 + §6 before acting)

Rules used:
- A legacy field is a **validated historical edge** if the same bucket is positive in both the pre-V8 slice (§6) and the full sample (§2/§3) with combined N ≥ 30 and total flat ROI ≥ +3%.
- A legacy field is a **validated V8 proxy** if §5 shows it is monotonic in avg `meanBase_F` (higher bucket → higher avg meanBase_F with no inversions).
- If both conditions hold, the V8.3 direction is supported at a bigger sample; keep `meanBase_F` / `maxRoiN_F` as live modifiers and watch §4 weekly.
- If neither holds (pre-V8 bleeders, no monotonic proxy), the V8 signal may be sample-specific and we should hold off on promoting it beyond current role.

Look at §2, §3, §5, §6 together before calling it.

---
*Auto-generated by `scripts/historicalLegacyFactorAudit.js`.  Pre-V8 picks lack per-wallet detail — that's why we cannot compute `maxRoiN_F` / `meanBase_F` directly for them. This report is the next-best approximation.*
