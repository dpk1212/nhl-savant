# TOP ≥4u — leakage audit + stamp-only W vs L
Generated: 2026-08-26T14:26:26.410Z

## Method honesty

### What was LEAKY in the prior lead-wallet report
- Live `sharpWalletProfiles.bySport.*.picks.wr / n / dollarRoi` as of **today**
- Applied to June/July tickets → includes bets **after** the pick date
- **`sport WR < 50` from that pull is NOT deployable** until recomputed causal as-of pick date
- `firstBetDate` age is mostly tracking start, not true wallet age

### What is SAFE (used below)
- Ticket `v8_*` stamps (EDGE, meanFor/Ag, tape, netCLV, forTop2Pct, qConv, HC counts, …)
- `peak.v8Scoring` / `walletDetails` frozen at score time (sizeRatio, invested, contribution, roi/roiNorm on detail)
- Stamped `sizeRatio ≥ 3` claim from before **was already safe**

## Jun15+ — 88 51–37 58.0% -19.1u ROI -4.7%

### Continuous (stamp-only)

| Feature (STAMPED) | W n | W mean | W med | L n | L mean | L med | Δmean |
|-------------------|----:|-------:|------:|----:|-------:|------:|------:|
| ◆ EDGE | 20 | 21.09 | 18.53 | 16 | 13.26 | 10.43 | +7.83 |
| ◆ meanFor | 20 | 65.32 | 60.20 | 16 | 54.13 | 54.70 | +11.18 |
|   meanAg | 20 | 23.67 | 32.30 | 16 | 22.47 | 29.11 | +1.20 |
| ◆ topFor | 20 | 65.96 | 60.20 | 16 | 58.44 | 55.60 | +7.52 |
|   topAg | 20 | 26.00 | 32.30 | 16 | 24.67 | 29.11 | +1.33 |
|   forN | 20 | 1.40 | 1.00 | 15 | 1.40 | 1.00 | +0.00 |
|   agN | 20 | 0.95 | 1.00 | 15 | 1.13 | 1.00 | -0.18 |
|   tapeScore | 20 | 5.00 | 3.58 | 15 | 3.22 | 2.86 | +1.78 |
|   netMeanPrior | 20 | 6.55 | 3.60 | 15 | 6.53 | 6.76 | +0.02 |
|   netCLV For | 20 | 69.87 | 65.85 | 15 | 68.68 | 66.19 | +1.19 |
|   forTop2PctPos | 20 | 72.53 | 67.07 | 15 | 69.82 | 68.85 | +2.71 |
| ◆ qConv | 6 | 81.48 | 82.38 | 5 | 73.48 | 39.81 | +8.01 |
|   agsV12 | 51 | 0.93 | 0.96 | 37 | 0.95 | 0.98 | -0.01 |
| ◆ agsV12 ForMean | 51 | 51.74 | 27.22 | 37 | 43.56 | 32.65 | +8.18 |
|   provenFor | 51 | 2.06 | 2.00 | 37 | 2.11 | 2.00 | -0.05 |
|   maxSR (FOR) | 51 | 2.91 | 2.31 | 37 | 3.05 | 2.67 | -0.14 |
|   lead sizeRatio | 51 | 2.91 | 2.31 | 37 | 3.05 | 2.67 | -0.14 |
| ◆ lead invested | 51 | 17231.35 | 6690.00 | 37 | 45456.81 | 5775.00 | -28225.46 |
| ◆ lead contrib | 51 | 46.33 | 38.80 | 37 | 51.58 | 45.10 | -5.25 |
|   lead roi (stamp) | 51 | 7.67 | 3.00 | 37 | 4.83 | 3.00 | +2.85 |
|   lead roiNorm | 51 | 40.40 | 43.60 | 37 | 40.62 | 43.60 | -0.23 |
| ◆ lead pnlNorm | 51 | 25.62 | 4.60 | 37 | 38.39 | 36.00 | -12.77 |
|   lead walletBase | 51 | 35.69 | 30.70 | 37 | 39.46 | 35.80 | -3.77 |
|   qualityForT30 | 40 | 1.75 | 1.50 | 21 | 1.71 | 1.00 | +0.04 |
|   deltaQuality | 40 | 1.30 | 1.00 | 21 | 1.38 | 1.00 | -0.08 |
|   walletPlayScore | 40 | 0.46 | 0.51 | 21 | 0.50 | 0.42 | -0.04 |
|   topShare | 40 | 0.64 | 0.59 | 21 | 0.67 | 0.65 | -0.03 |
| ◆ odds | 51 | -226.29 | -142.00 | 37 | -129.19 | -112.00 | -97.10 |
|   units | 51 | 4.64 | 5.00 | 37 | 4.61 | 5.00 | +0.03 |

### Flags (stamp-only)

| Flag (STAMPED only) | Match n/W–L/ROI/PnL | Rest |
|--------------------|---------------------|------|
| 🔴 lead sizeRatio ≥ 3 (SAFE — stamped) | 30 15–15 -19% -25.7u | 58 36–22 +2% |
| 🟢 lead sizeRatio 1.5–2 | 22 16–6 +25% +25.2u | 66 35–31 -14% |
|    maxSR ≥ 2 | 66 35–31 -14% -44.3u | 22 16–6 +25% |
| 🔴 EDGE < 10 | 10 2–8 -68% -28.9u | 78 49–29 +3% |
|    EDGE ≥ 20 | 12 9–3 +9% +6.1u | 76 42–34 -7% |
|    EDGE ≥ 30 | 8 6–2 -7% -2.9u | 80 45–35 -4% |
| 🔴 meanFor < 50 | 4 0–4 -100% -16.0u | 84 51–33 -1% |
|    meanFor ≥ 60 | 15 11–4 +6% +4.7u | 73 40–33 -7% |
| 🔴 topFor < 55 | 10 4–6 -27% -12.3u | 78 47–31 -2% |
| 🟢 topAg ≥ 55 | 1 1–0 +89% +3.6u | 87 50–37 -6% |
|    !hasBoth | 67 39–28 -3% -8.7u | 21 12–9 -10% |
|    topUnopp | 8 5–3 -5% -2.2u | 80 46–34 -5% |
|    tape HOLD | 13 7–6 -8% -4.6u | 75 44–31 -4% |
|    tape BOOST | 17 11–6 -3% -2.8u | 71 40–31 -5% |
| 🔴 tape FAIL_OPEN | 4 2–2 -16% -2.5u | 84 49–35 -4% |
|    tapeScore < 1 | 6 3–3 -12% -2.9u | 82 48–34 -4% |
|    netMeanPrior < 0 | 11 6–5 -9% -4.9u | 77 45–32 -4% |
| 🔴 netMeanPrior ≥ 5 | 15 7–8 -29% -22.1u | 73 44–29 +1% |
|    forTop2Pct ≥ 65 | 28 16–12 -9% -12.9u | 60 35–25 -2% |
|    lead roiNorm < 20 | 27 17–10 -0% -0.1u | 61 34–27 -7% |
|    lead roiNorm ≥ 40 | 52 31–21 -0% -0.8u | 36 20–16 -11% |
|    lead walletBase < 20 | 22 14–8 +1% +1.0u | 66 37–29 -7% |
|    lead contrib < 20 | 20 13–7 +3% +2.4u | 68 38–30 -7% |
|    qualityForT30 ≤ 1 | 31 20–11 +2% +3.2u | 57 31–26 -9% |
|    odds ≤ -200 chalk | 19 15–4 +0% +0.3u | 69 36–33 -6% |
|    near pick -119..-100 | 37 19–18 +1% +1.0u | 51 32–19 -8% |
|    MLB TOTAL | 27 13–14 -7% -8.0u | 61 38–23 -4% |
|    UFC ML | 8 6–2 -7% -2.9u | 80 45–35 -4% |
|    units 4–4.99 | 41 24–17 -2% -2.6u | 47 27–20 -7% |
|    units ≥ 5.4 | 17 11–6 -3% -2.8u | 71 40–31 -5% |
| 🔴 meanFor<55 AND leadSR≥3 | 7 3–4 -20% -6.6u | 81 48–33 -3% |
|    EDGE<15 AND tape HOLD | 9 5–4 +1% +0.3u | 79 46–33 -5% |
|    forTop2Pct<60 AND leadSR≥3 | 3 2–1 +14% +1.8u | 85 49–36 -5% |
| 🔴 MLB TOTAL AND tape HOLD | 3 0–3 -100% -13.0u | 85 51–34 -2% |

## Jul15+ — 35 20–15 57.1% -13.9u ROI -8.1%

### Continuous (stamp-only)

| Feature (STAMPED) | W n | W mean | W med | L n | L mean | L med | Δmean |
|-------------------|----:|-------:|------:|----:|-------:|------:|------:|
| ◆ EDGE | 20 | 21.09 | 18.53 | 15 | 14.14 | 12.65 | +6.94 |
| ◆ meanFor | 20 | 65.32 | 60.20 | 15 | 54.62 | 55.60 | +10.70 |
|   meanAg | 20 | 23.67 | 32.30 | 15 | 23.97 | 32.00 | -0.30 |
| ◆ topFor | 20 | 65.96 | 60.20 | 15 | 58.10 | 55.60 | +7.86 |
|   topAg | 20 | 26.00 | 32.30 | 15 | 26.31 | 32.00 | -0.31 |
|   forN | 20 | 1.40 | 1.00 | 15 | 1.40 | 1.00 | +0.00 |
|   agN | 20 | 0.95 | 1.00 | 15 | 1.13 | 1.00 | -0.18 |
|   tapeScore | 20 | 5.00 | 3.58 | 15 | 3.22 | 2.86 | +1.78 |
|   netMeanPrior | 20 | 6.55 | 3.60 | 15 | 6.53 | 6.76 | +0.02 |
|   netCLV For | 20 | 69.87 | 65.85 | 15 | 68.68 | 66.19 | +1.19 |
|   forTop2PctPos | 20 | 72.53 | 67.07 | 15 | 69.82 | 68.85 | +2.71 |
| ◆ qConv | 6 | 81.48 | 82.38 | 5 | 73.48 | 39.81 | +8.01 |
|   agsV12 | 20 | 0.93 | 0.98 | 15 | 0.96 | 0.99 | -0.03 |
| ◆ agsV12 ForMean | 20 | 66.92 | 40.50 | 15 | 47.90 | 43.44 | +19.02 |
|   provenFor | 20 | 1.40 | 1.00 | 15 | 1.47 | 1.00 | -0.07 |
|   maxSR (FOR) | 20 | 2.96 | 2.70 | 15 | 2.66 | 2.51 | +0.30 |
|   lead sizeRatio | 20 | 2.96 | 2.70 | 15 | 2.66 | 2.51 | +0.30 |
| ◆ lead invested | 20 | 8212.10 | 6823.00 | 15 | 10255.13 | 7465.00 | -2043.03 |
|   lead contrib | 20 | 39.40 | 36.80 | 15 | 44.33 | 39.90 | -4.93 |
|   lead roi (stamp) | 20 | 4.62 | 3.00 | 15 | 4.52 | 3.00 | +0.10 |
|   lead roiNorm | 20 | 34.24 | 43.60 | 15 | 38.00 | 43.60 | -3.76 |
|   lead pnlNorm | 20 | 22.54 | 4.80 | 15 | 27.12 | 5.00 | -4.59 |
|   lead walletBase | 20 | 29.79 | 29.60 | 15 | 33.85 | 32.80 | -4.06 |
|   qualityForT30 | 18 | 0.89 | 1.00 | 8 | 1.00 | 1.00 | -0.11 |
|   deltaQuality | 18 | 0.44 | 0.00 | 8 | 0.88 | 1.00 | -0.43 |
|   walletPlayScore | 18 | -1.55 | -2.14 | 8 | -1.52 | -2.16 | -0.03 |
|   topShare | 18 | 0.88 | 1.00 | 8 | 0.93 | 1.00 | -0.05 |
| ◆ odds | 20 | -278.30 | -202.50 | 15 | -148.07 | -118.00 | -130.23 |
|   units | 20 | 5.03 | 5.40 | 15 | 4.69 | 5.00 | +0.34 |

### Flags (stamp-only)

| Flag (STAMPED only) | Match n/W–L/ROI/PnL | Rest |
|--------------------|---------------------|------|
|    lead sizeRatio ≥ 3 (SAFE — stamped) | 13 7–6 -10% -6.2u | 22 13–9 -7% |
| 🟢 lead sizeRatio 1.5–2 | 7 5–2 +22% +7.5u | 28 15–13 -15% |
| 🔴 maxSR ≥ 2 | 28 15–13 -15% -21.3u | 7 5–2 +22% |
| 🔴 EDGE < 10 | 9 2–7 -65% -24.9u | 26 18–8 +8% |
|    EDGE ≥ 20 | 12 9–3 +9% +6.1u | 23 11–12 -19% |
|    EDGE ≥ 30 | 8 6–2 -7% -2.9u | 27 14–13 -9% |
| 🔴 meanFor < 50 | 3 0–3 -100% -12.0u | 32 20–12 -1% |
|    meanFor ≥ 60 | 15 11–4 +6% +4.7u | 20 9–11 -20% |
| 🔴 topFor < 55 | 10 4–6 -27% -12.3u | 25 16–9 -1% |
| 🟢 topAg ≥ 55 | 1 1–0 +89% +3.6u | 34 19–15 -10% |
|    !hasBoth | 14 8–6 -5% -3.5u | 21 12–9 -10% |
|    topUnopp | 8 5–3 -5% -2.2u | 27 15–12 -9% |
|    tape HOLD | 13 7–6 -8% -4.6u | 22 13–9 -8% |
|    tape BOOST | 17 11–6 -3% -2.8u | 18 9–9 -14% |
| 🔴 tape FAIL_OPEN | 4 2–2 -16% -2.5u | 31 18–13 -7% |
|    tapeScore < 1 | 6 3–3 -12% -2.9u | 29 17–12 -7% |
|    netMeanPrior < 0 | 11 6–5 -9% -4.9u | 24 14–10 -8% |
| 🔴 netMeanPrior ≥ 5 | 15 7–8 -29% -22.1u | 20 13–7 +9% |
|    forTop2Pct ≥ 65 | 28 16–12 -9% -12.9u | 7 4–3 -3% |
|    lead roiNorm < 20 | 9 6–3 -10% -4.9u | 26 14–12 -7% |
|    lead roiNorm ≥ 40 | 21 12–9 -0% -0.3u | 14 8–6 -19% |
|    lead walletBase < 20 | 8 6–2 -2% -0.6u | 27 14–13 -10% |
|    lead contrib < 20 | 7 5–2 -11% -4.3u | 28 15–13 -7% |
|    qualityForT30 ≤ 1 | 21 14–7 -2% -1.9u | 14 6–8 -19% |
|    odds ≤ -200 chalk | 12 10–2 +6% +4.1u | 23 10–13 -17% |
|    near pick -119..-100 | 15 7–8 -4% -2.8u | 20 13–7 -11% |
| 🔴 MLB TOTAL | 6 2–4 -31% -8.1u | 29 18–11 -4% |
|    UFC ML | 8 6–2 -7% -2.9u | 27 14–13 -9% |
| 🔴 units 4–4.99 | 12 5–7 -27% -13.2u | 23 15–8 -1% |
|    units ≥ 5.4 | 17 11–6 -3% -2.8u | 18 9–9 -14% |
|    meanFor<55 AND leadSR≥3 | 6 3–3 -9% -2.6u | 29 17–12 -8% |
|    EDGE<15 AND tape HOLD | 9 5–4 +1% +0.3u | 26 15–11 -11% |
|    forTop2Pct<60 AND leadSR≥3 | 3 2–1 +14% +1.8u | 32 18–14 -10% |
| 🔴 MLB TOTAL AND tape HOLD | 3 0–3 -100% -13.0u | 32 20–12 -1% |

## Aug1+ — 17 9–8 52.9% -20.3u ROI -23.5%

### Continuous (stamp-only)

| Feature (STAMPED) | W n | W mean | W med | L n | L mean | L med | Δmean |
|-------------------|----:|-------:|------:|----:|-------:|------:|------:|
| ◆ EDGE | 9 | 31.40 | 35.18 | 8 | 21.08 | 16.80 | +10.32 |
| ◆ meanFor | 9 | 76.35 | 80.63 | 8 | 56.52 | 62.36 | +19.83 |
| ◆ meanAg | 9 | 22.72 | 30.40 | 8 | 29.18 | 35.42 | -6.46 |
| ◆ topFor | 9 | 76.76 | 80.63 | 8 | 61.15 | 67.42 | +15.61 |
| ◆ topAg | 9 | 25.06 | 30.80 | 8 | 32.60 | 44.50 | -7.54 |
|   forN | 9 | 1.33 | 1.00 | 8 | 1.38 | 1.50 | -0.04 |
|   agN | 9 | 0.89 | 1.00 | 8 | 1.25 | 1.50 | -0.36 |
|   tapeScore | 9 | 8.54 | 8.96 | 8 | 4.30 | 3.01 | +4.24 |
| ◆ netMeanPrior | 9 | 15.06 | 10.86 | 8 | 2.47 | -2.58 | +12.59 |
| ◆ netCLV For | 9 | 77.35 | 72.14 | 8 | 68.69 | 65.28 | +8.66 |
| ◆ forTop2PctPos | 9 | 81.69 | 84.62 | 8 | 69.89 | 67.31 | +11.80 |
| ◆ qConv | 6 | 81.48 | 82.38 | 5 | 73.48 | 39.81 | +8.01 |
|   agsV12 | 9 | 0.90 | 0.91 | 8 | 0.98 | 0.99 | -0.07 |
| ◆ agsV12 ForMean | 9 | 103.73 | 63.49 | 8 | 71.54 | 54.94 | +32.19 |
|   provenFor | 9 | 1.33 | 1.00 | 8 | 1.50 | 1.00 | -0.17 |
| ◆ maxSR (FOR) | 9 | 3.28 | 2.77 | 8 | 2.69 | 2.81 | +0.59 |
|   lead sizeRatio | 9 | 3.28 | 2.77 | 8 | 2.69 | 2.81 | +0.59 |
| ◆ lead invested | 9 | 9465.11 | 6299.00 | 8 | 10710.00 | 8479.50 | -1244.89 |
|   lead contrib | 9 | 28.82 | 0.80 | 8 | 33.48 | 32.00 | -4.65 |
|   lead roi (stamp) | 9 | 1.36 | 0.00 | 8 | 1.64 | 1.50 | -0.28 |
| ◆ lead roiNorm | 9 | 16.98 | 0.00 | 8 | 23.00 | 21.60 | -6.02 |
|   lead pnlNorm | 9 | 27.19 | 1.70 | 8 | 31.76 | 29.05 | -4.57 |
| ◆ lead walletBase | 9 | 20.43 | 0.60 | 8 | 25.66 | 26.60 | -5.23 |
|   qualityForT30 | 9 | 0.44 | 0.00 | 4 | 0.75 | 1.00 | -0.31 |
|   deltaQuality | 9 | 0.00 | 0.00 | 4 | 0.50 | 1.00 | -0.50 |
|   walletPlayScore | 9 | -1.88 | -2.61 | 4 | -1.61 | -1.58 | -0.27 |
|   topShare | 9 | 0.91 | 1.00 | 4 | 0.93 | 1.00 | -0.02 |
| ◆ odds | 9 | -403.89 | -310.00 | 8 | -174.00 | -120.00 | -229.89 |
|   units | 9 | 5.31 | 5.40 | 8 | 4.83 | 5.20 | +0.49 |

### Flags (stamp-only)

| Flag (STAMPED only) | Match n/W–L/ROI/PnL | Rest |
|--------------------|---------------------|------|
| 🔴 lead sizeRatio ≥ 3 (SAFE — stamped) | 7 3–4 -34% -11.4u | 10 6–4 -17% |
| 🔴 lead sizeRatio 1.5–2 | 2 1–1 -24% -2.3u | 15 8–7 -23% |
| 🔴 maxSR ≥ 2 | 15 8–7 -23% -18.0u | 2 1–1 -24% |
| 🔴 EDGE < 10 | 1 0–1 -100% -4.0u | 16 9–7 -20% |
|    EDGE ≥ 20 | 9 7–2 +4% +1.9u | 8 2–6 -59% |
|    EDGE ≥ 30 | 8 6–2 -7% -2.9u | 9 3–6 -40% |
| 🔴 meanFor < 50 | 1 0–1 -100% -4.0u | 16 9–7 -20% |
|    meanFor ≥ 60 | 12 8–4 -8% -5.3u | 5 1–4 -65% |
| 🔴 topFor < 55 | 3 1–2 -43% -6.0u | 14 8–6 -20% |
|    !hasBoth | 6 4–2 +7% +2.2u | 11 5–6 -40% |
|    topUnopp | 6 4–2 +3% +0.8u | 11 5–6 -38% |
| 🔴 tape HOLD | 4 1–3 -55% -9.4u | 13 8–5 -16% |
|    tape BOOST | 12 8–4 -11% -6.9u | 5 1–4 -64% |
| 🔴 tapeScore < 1 | 1 0–1 -100% -4.0u | 16 9–7 -20% |
| 🔴 netMeanPrior < 0 | 5 0–5 -100% -23.8u | 12 9–3 +6% |
| 🔴 netMeanPrior ≥ 5 | 8 5–3 -21% -8.7u | 9 4–5 -26% |
|    forTop2Pct ≥ 65 | 13 8–5 -13% -9.1u | 4 1–3 -59% |
|    lead roiNorm < 20 | 9 6–3 -10% -4.9u | 8 3–5 -41% |
| 🔴 lead roiNorm ≥ 40 | 4 2–2 -28% -5.6u | 13 7–6 -22% |
|    lead walletBase < 20 | 8 6–2 -2% -0.6u | 9 3–6 -44% |
|    lead contrib < 20 | 7 5–2 -11% -4.3u | 10 4–6 -33% |
|    qualityForT30 ≤ 1 | 12 8–4 -8% -5.3u | 5 1–4 -65% |
|    odds ≤ -200 chalk | 9 7–2 -2% -0.9u | 8 2–6 -52% |
| 🔴 near pick -119..-100 | 6 2–4 -36% -9.9u | 11 7–4 -18% |
| 🔴 MLB TOTAL | 2 0–2 -100% -9.0u | 15 9–6 -15% |
|    UFC ML | 8 6–2 -7% -2.9u | 9 3–6 -40% |
| 🔴 units 4–4.99 | 4 1–3 -52% -8.4u | 13 8–5 -17% |
|    units ≥ 5.4 | 12 8–4 -11% -6.9u | 5 1–4 -64% |
| 🔴 meanFor<55 AND leadSR≥3 | 2 1–1 -20% -2.0u | 15 8–7 -24% |
| 🔴 EDGE<15 AND tape HOLD | 2 1–1 -15% -1.4u | 15 8–7 -24% |
|    forTop2Pct<60 AND leadSR≥3 | 2 1–1 -5% -0.4u | 15 8–7 -25% |
| 🔴 MLB TOTAL AND tape HOLD | 2 0–2 -100% -9.0u | 15 9–6 -15% |

## Verdict

1. Prior **profile WR/n/$ROI** separators → treat as **contaminated** until causal as-of rebuild.
2. **sizeRatio ≥ 3** on stamped lead remains a fair candidate (was never live-profile).
3. Hunt above for other stamped separators that survive Jun15+ and Jul15+.
4. To properly test thin/young/WR: need causal ledger as-of `date` (CLV skill style) or historical profile snapshots — not live profiles.
