# Inside TOP — stamp-safe winner vs loser splits (KEEP path, cut losers)
Generated: 2026-08-26T14:31:40.602Z
Constraint: **do not kill TOP**. Find cuts that lift the remaining TOP book.
Features: ticket stamps / walletDetails only (no live profiles).

## Jun15+ — baseline TOP≥4u: 88 51–37 58% -19.1u -5%

| Cut rule (drop match, KEEP rest) | CUT n/ROI/PnL | KEEP n/W–L/ROI/PnL | ΔPnL vs base | KEEP share |
|----------------------------------|---------------|--------------------|--------------|------------|
| ✅ SR≥3 OR EDGE<10 | 37 -25% -42.6u | 51 34–17 +10% +23.5u | +42.6u | 58% |
| ✅ KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50) | 37 -25% -42.6u | 51 34–17 +10% +23.5u | +42.6u | 58% |
| ✅ SR≥2.5 | 46 -16% -35.6u | 42 27–15 +9% +16.5u | +35.6u | 48% |
| ✅ SR≥3 OR meanFor<55 | 37 -20% -33.6u | 51 33–18 +6% +14.6u | +33.6u | 58% |
|    SR≥3 OR softSkill | 41 -16% -29.0u | 47 30–17 +4% +9.9u | +29.0u | 53% |
|    EDGE<10 | 10 -68% -28.9u | 78 49–29 +3% +9.8u | +28.9u | 89% |
|    SR≥3 | 30 -19% -25.7u | 58 36–22 +2% +6.6u | +25.7u | 66% |
|    SR≥3 OR MLB TOTAL×HOLD | 30 -19% -25.7u | 58 36–22 +2% +6.6u | +25.7u | 66% |
|    netMeanPrior≥5 | 15 -29% -22.1u | 73 44–29 +1% +3.0u | +22.1u | 83% |
|    EDGE<10 OR meanFor<50 OR topFor<55 | 15 -29% -19.8u | 73 45–28 +0% +0.7u | +19.8u | 83% |
|    topFor<60 | 20 -20% -18.6u | 68 42–26 -0% -0.5u | +18.6u | 77% |
|    meanFor<50 | 4 -100% -16.0u | 84 51–33 -1% -3.1u | +16.0u | 95% |
|    SR≥3 AND meanFor<60 | 9 -38% -15.6u | 79 48–31 -1% -3.5u | +15.6u | 90% |
|    meanFor<55 | 14 -23% -14.6u | 74 45–29 -1% -4.5u | +14.6u | 84% |
|    MLB TOTAL×HOLD | 3 -100% -13.0u | 85 51–34 -2% -6.1u | +13.0u | 97% |
|    topFor<55 | 10 -27% -12.3u | 78 47–31 -2% -6.8u | +12.3u | 89% |
|    EDGE<15 | 17 -14% -10.3u | 71 43–28 -3% -8.8u | +10.3u | 81% |
|    MLB TOTAL | 27 -7% -8.0u | 61 38–23 -4% -11.1u | +8.0u | 69% |
|    EDGE<15 OR meanFor<55 | 21 -7% -6.5u | 67 40–27 -4% -12.6u | +6.5u | 76% |
|    softSkill (E<15|mF<55|tF<55) | 21 -7% -6.5u | 67 40–27 -4% -12.6u | +6.5u | 76% |
|    HOLD | 13 -8% -4.6u | 75 44–31 -4% -14.5u | +4.6u | 85% |
|    units 4–4.99 | 41 -2% -2.6u | 47 27–20 -7% -16.5u | +2.6u | 53% |
|    chalk≤-200 | 19 +0% +0.3u | 69 36–33 -6% -19.4u | -0.3u | 78% |
|    forTop2Pct<60 | 3 +14% +1.8u | 85 49–36 -5% -20.9u | -1.8u | 97% |
|    leadRoiNorm<25 | 31 -2% -2.3u | 57 32–25 -6% -16.8u | +2.3u | 65% |
|    near -119..-100 | 37 +1% +1.0u | 51 32–19 -8% -20.1u | -1.0u | 58% |
|    KEEP only SR1.5–2.5 AND E≥15 | 81 -4% -15.3u | 7 4–3 -10% -3.8u | +15.3u | 8% |
|    agsV12ForMean<40 | 53 -1% -2.1u | 35 20–15 -10% -17.0u | +2.1u | 40% |

### Jun15+ — best practical KEEP lifts

- **SR≥3 OR EDGE<10**: KEEP 51 34–17 67% +23.5u +10% · cut 37 17–20 46% -42.6u -25% · Δ +42.6u · keep 58%
- **KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50)**: KEEP 51 34–17 67% +23.5u +10% · cut 37 17–20 46% -42.6u -25% · Δ +42.6u · keep 58%
- **SR≥2.5**: KEEP 42 27–15 64% +16.5u +9% · cut 46 24–22 52% -35.6u -16% · Δ +35.6u · keep 48%
- **SR≥3 OR meanFor<55**: KEEP 51 33–18 65% +14.6u +6% · cut 37 18–19 49% -33.6u -20% · Δ +33.6u · keep 58%
- **SR≥3 OR softSkill**: KEEP 47 30–17 64% +9.9u +4% · cut 41 21–20 51% -29.0u -16% · Δ +29.0u · keep 53%
- **EDGE<10**: KEEP 78 49–29 63% +9.8u +3% · cut 10 2–8 20% -28.9u -68% · Δ +28.9u · keep 89%
- **SR≥3**: KEEP 58 36–22 62% +6.6u +2% · cut 30 15–15 50% -25.7u -19% · Δ +25.7u · keep 66%
- **SR≥3 OR MLB TOTAL×HOLD**: KEEP 58 36–22 62% +6.6u +2% · cut 30 15–15 50% -25.7u -19% · Δ +25.7u · keep 66%

## Jul15+ — baseline TOP≥4u: 35 20–15 57% -13.9u -8%

| Cut rule (drop match, KEEP rest) | CUT n/ROI/PnL | KEEP n/W–L/ROI/PnL | ΔPnL vs base | KEEP share |
|----------------------------------|---------------|--------------------|--------------|------------|
| 🎯 SR≥3 OR EDGE<10 | 20 -25% -23.1u | 15 11–4 +12% +9.2u | +23.1u | 43% |
| 🎯 KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50) | 20 -25% -23.1u | 15 11–4 +12% +9.2u | +23.1u | 43% |
| ✅ EDGE<10 | 9 -65% -24.9u | 26 18–8 +8% +11.0u | +24.9u | 74% |
| ✅ netMeanPrior≥5 | 15 -29% -22.1u | 20 13–7 +9% +8.2u | +22.1u | 57% |
| ✅ topFor<60 | 20 -20% -18.6u | 15 11–4 +6% +4.7u | +18.6u | 43% |
|    EDGE<10 OR meanFor<50 OR topFor<55 | 14 -25% -15.8u | 21 14–7 +2% +1.9u | +15.8u | 60% |
|    SR≥3 OR meanFor<55 | 20 -15% -14.2u | 15 10–5 +0% +0.3u | +14.2u | 43% |
|    units 4–4.99 | 12 -27% -13.2u | 23 15–8 -1% -0.7u | +13.2u | 66% |
|    MLB TOTAL×HOLD | 3 -100% -13.0u | 32 20–12 -1% -0.9u | +13.0u | 91% |
|    topFor<55 | 10 -27% -12.3u | 25 16–9 -1% -1.6u | +12.3u | 71% |
|    meanFor<50 | 3 -100% -12.0u | 32 20–12 -1% -1.9u | +12.0u | 91% |
|    SR≥3 AND meanFor<60 | 8 -31% -11.6u | 27 17–10 -2% -2.3u | +11.6u | 77% |
|    leadRoiNorm<25 | 12 -17% -10.6u | 23 13–10 -3% -3.3u | +10.6u | 66% |
|    meanFor<55 | 13 -18% -10.6u | 22 14–8 -3% -3.3u | +10.6u | 63% |
|    MLB TOTAL | 6 -31% -8.1u | 29 18–11 -4% -5.8u | +8.1u | 83% |
|    SR≥3 OR softSkill | 24 -9% -9.5u | 11 7–4 -7% -4.4u | +9.5u | 31% |
|    EDGE<15 | 16 -9% -6.3u | 19 12–7 -8% -7.6u | +6.3u | 54% |
|    SR≥3 | 13 -10% -6.2u | 22 13–9 -7% -7.7u | +6.2u | 63% |
|    SR≥3 OR MLB TOTAL×HOLD | 13 -10% -6.2u | 22 13–9 -7% -7.7u | +6.2u | 63% |
|    HOLD | 13 -8% -4.6u | 22 13–9 -8% -9.3u | +4.6u | 63% |
|    KEEP only SR1.5–2.5 AND E≥15 | 28 -8% -10.1u | 7 4–3 -10% -3.8u | +10.1u | 20% |
|    SR≥2.5 | 20 -6% -6.3u | 15 8–7 -11% -7.5u | +6.3u | 43% |
|    near -119..-100 | 15 -4% -2.8u | 20 13–7 -11% -11.1u | +2.8u | 57% |
|    forTop2Pct<60 | 3 +14% +1.8u | 32 18–14 -10% -15.7u | -1.8u | 91% |
|    agsV12ForMean<40 | 17 -2% -1.8u | 18 10–8 -13% -12.0u | +1.8u | 51% |
|    EDGE<15 OR meanFor<55 | 20 -3% -2.5u | 15 9–6 -14% -11.4u | +2.5u | 43% |
|    softSkill (E<15|mF<55|tF<55) | 20 -3% -2.5u | 15 9–6 -14% -11.4u | +2.5u | 43% |
|    chalk≤-200 | 12 +6% +4.1u | 23 10–13 -17% -18.0u | -4.1u | 66% |

### Jul15+ — best practical KEEP lifts

- **EDGE<10**: KEEP 26 18–8 69% +11.0u +8% · cut 9 2–7 22% -24.9u -65% · Δ +24.9u · keep 74%
- **SR≥3 OR EDGE<10**: KEEP 15 11–4 73% +9.2u +12% · cut 20 9–11 45% -23.1u -25% · Δ +23.1u · keep 43%
- **KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50)**: KEEP 15 11–4 73% +9.2u +12% · cut 20 9–11 45% -23.1u -25% · Δ +23.1u · keep 43%
- **netMeanPrior≥5**: KEEP 20 13–7 65% +8.2u +9% · cut 15 7–8 47% -22.1u -29% · Δ +22.1u · keep 57%
- **topFor<60**: KEEP 15 11–4 73% +4.7u +6% · cut 20 9–11 45% -18.6u -20% · Δ +18.6u · keep 43%
- **EDGE<10 OR meanFor<50 OR topFor<55**: KEEP 21 14–7 67% +1.9u +2% · cut 14 6–8 43% -15.8u -25% · Δ +15.8u · keep 60%
- **SR≥3 OR meanFor<55**: KEEP 15 10–5 67% +0.3u +0% · cut 20 10–10 50% -14.2u -15% · Δ +14.2u · keep 43%
- **units 4–4.99**: KEEP 23 15–8 65% -0.7u -1% · cut 12 5–7 42% -13.2u -27% · Δ +13.2u · keep 66%

## Jul15+ skill-stamped — baseline TOP≥4u: 35 20–15 57% -13.9u -8%

| Cut rule (drop match, KEEP rest) | CUT n/ROI/PnL | KEEP n/W–L/ROI/PnL | ΔPnL vs base | KEEP share |
|----------------------------------|---------------|--------------------|--------------|------------|
| 🎯 SR≥3 OR EDGE<10 | 20 -25% -23.1u | 15 11–4 +12% +9.2u | +23.1u | 43% |
| 🎯 KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50) | 20 -25% -23.1u | 15 11–4 +12% +9.2u | +23.1u | 43% |
| ✅ EDGE<10 | 9 -65% -24.9u | 26 18–8 +8% +11.0u | +24.9u | 74% |
| ✅ netMeanPrior≥5 | 15 -29% -22.1u | 20 13–7 +9% +8.2u | +22.1u | 57% |
| ✅ topFor<60 | 20 -20% -18.6u | 15 11–4 +6% +4.7u | +18.6u | 43% |
|    EDGE<10 OR meanFor<50 OR topFor<55 | 14 -25% -15.8u | 21 14–7 +2% +1.9u | +15.8u | 60% |
|    SR≥3 OR meanFor<55 | 20 -15% -14.2u | 15 10–5 +0% +0.3u | +14.2u | 43% |
|    units 4–4.99 | 12 -27% -13.2u | 23 15–8 -1% -0.7u | +13.2u | 66% |
|    MLB TOTAL×HOLD | 3 -100% -13.0u | 32 20–12 -1% -0.9u | +13.0u | 91% |
|    topFor<55 | 10 -27% -12.3u | 25 16–9 -1% -1.6u | +12.3u | 71% |
|    meanFor<50 | 3 -100% -12.0u | 32 20–12 -1% -1.9u | +12.0u | 91% |
|    SR≥3 AND meanFor<60 | 8 -31% -11.6u | 27 17–10 -2% -2.3u | +11.6u | 77% |
|    leadRoiNorm<25 | 12 -17% -10.6u | 23 13–10 -3% -3.3u | +10.6u | 66% |
|    meanFor<55 | 13 -18% -10.6u | 22 14–8 -3% -3.3u | +10.6u | 63% |
|    MLB TOTAL | 6 -31% -8.1u | 29 18–11 -4% -5.8u | +8.1u | 83% |
|    SR≥3 OR softSkill | 24 -9% -9.5u | 11 7–4 -7% -4.4u | +9.5u | 31% |
|    EDGE<15 | 16 -9% -6.3u | 19 12–7 -8% -7.6u | +6.3u | 54% |
|    SR≥3 | 13 -10% -6.2u | 22 13–9 -7% -7.7u | +6.2u | 63% |
|    SR≥3 OR MLB TOTAL×HOLD | 13 -10% -6.2u | 22 13–9 -7% -7.7u | +6.2u | 63% |
|    HOLD | 13 -8% -4.6u | 22 13–9 -8% -9.3u | +4.6u | 63% |
|    KEEP only SR1.5–2.5 AND E≥15 | 28 -8% -10.1u | 7 4–3 -10% -3.8u | +10.1u | 20% |
|    SR≥2.5 | 20 -6% -6.3u | 15 8–7 -11% -7.5u | +6.3u | 43% |
|    near -119..-100 | 15 -4% -2.8u | 20 13–7 -11% -11.1u | +2.8u | 57% |
|    forTop2Pct<60 | 3 +14% +1.8u | 32 18–14 -10% -15.7u | -1.8u | 91% |
|    agsV12ForMean<40 | 17 -2% -1.8u | 18 10–8 -13% -12.0u | +1.8u | 51% |
|    EDGE<15 OR meanFor<55 | 20 -3% -2.5u | 15 9–6 -14% -11.4u | +2.5u | 43% |
|    softSkill (E<15|mF<55|tF<55) | 20 -3% -2.5u | 15 9–6 -14% -11.4u | +2.5u | 43% |
|    chalk≤-200 | 12 +6% +4.1u | 23 10–13 -17% -18.0u | -4.1u | 66% |

### Jul15+ skill-stamped — best practical KEEP lifts

- **EDGE<10**: KEEP 26 18–8 69% +11.0u +8% · cut 9 2–7 22% -24.9u -65% · Δ +24.9u · keep 74%
- **SR≥3 OR EDGE<10**: KEEP 15 11–4 73% +9.2u +12% · cut 20 9–11 45% -23.1u -25% · Δ +23.1u · keep 43%
- **KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50)**: KEEP 15 11–4 73% +9.2u +12% · cut 20 9–11 45% -23.1u -25% · Δ +23.1u · keep 43%
- **netMeanPrior≥5**: KEEP 20 13–7 65% +8.2u +9% · cut 15 7–8 47% -22.1u -29% · Δ +22.1u · keep 57%
- **topFor<60**: KEEP 15 11–4 73% +4.7u +6% · cut 20 9–11 45% -18.6u -20% · Δ +18.6u · keep 43%
- **EDGE<10 OR meanFor<50 OR topFor<55**: KEEP 21 14–7 67% +1.9u +2% · cut 14 6–8 43% -15.8u -25% · Δ +15.8u · keep 60%
- **SR≥3 OR meanFor<55**: KEEP 15 10–5 67% +0.3u +0% · cut 20 10–10 50% -14.2u -15% · Δ +14.2u · keep 43%
- **units 4–4.99**: KEEP 23 15–8 65% -0.7u -1% · cut 12 5–7 42% -13.2u -27% · Δ +13.2u · keep 66%

## Aug1+ — baseline TOP≥4u: 17 9–8 53% -20.3u -23%

| Cut rule (drop match, KEEP rest) | CUT n/ROI/PnL | KEEP n/W–L/ROI/PnL | ΔPnL vs base | KEEP share |
|----------------------------------|---------------|--------------------|--------------|------------|
|    topFor<60 | 5 -65% -15.0u | 12 8–4 -8% -5.3u | +15.0u | 71% |
|    SR≥3 OR EDGE<10 | 8 -41% -15.4u | 9 6–3 -10% -4.9u | +15.4u | 53% |
|    SR≥3 OR meanFor<55 | 8 -41% -15.4u | 9 6–3 -10% -4.9u | +15.4u | 53% |
|    SR≥3 OR softSkill | 8 -41% -15.4u | 9 6–3 -10% -4.9u | +15.4u | 53% |
|    KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50) | 8 -41% -15.4u | 9 6–3 -10% -4.9u | +15.4u | 53% |
|    SR≥3 AND meanFor<60 | 4 -58% -11.0u | 13 8–5 -14% -9.3u | +11.0u | 76% |
|    MLB TOTAL | 2 -100% -9.0u | 15 9–6 -15% -11.3u | +9.0u | 88% |
|    MLB TOTAL×HOLD | 2 -100% -9.0u | 15 9–6 -15% -11.3u | +9.0u | 88% |
|    HOLD | 4 -55% -9.4u | 13 8–5 -16% -10.9u | +9.4u | 76% |
|    SR≥3 | 7 -34% -11.4u | 10 6–4 -17% -8.9u | +11.4u | 59% |
|    SR≥3 OR MLB TOTAL×HOLD | 7 -34% -11.4u | 10 6–4 -17% -8.9u | +11.4u | 59% |
|    near -119..-100 | 6 -36% -9.9u | 11 7–4 -18% -10.3u | +9.9u | 65% |
|    units 4–4.99 | 4 -52% -8.4u | 13 8–5 -17% -11.9u | +8.4u | 76% |
|    KEEP only SR1.5–2.5 AND E≥15 | 13 -25% -16.0u | 4 2–2 -20% -4.2u | +16.0u | 24% |
|    EDGE<15 OR meanFor<55 | 5 -32% -7.4u | 12 7–5 -20% -12.9u | +7.4u | 71% |
|    softSkill (E<15|mF<55|tF<55) | 5 -32% -7.4u | 12 7–5 -20% -12.9u | +7.4u | 71% |
|    meanFor<55 | 3 -43% -6.0u | 14 8–6 -20% -14.3u | +6.0u | 82% |
|    topFor<55 | 3 -43% -6.0u | 14 8–6 -20% -14.3u | +6.0u | 82% |
|    EDGE<10 OR meanFor<50 OR topFor<55 | 3 -43% -6.0u | 14 8–6 -20% -14.3u | +6.0u | 82% |
|    EDGE<15 | 3 -41% -5.4u | 14 8–6 -20% -14.9u | +5.4u | 82% |
|    EDGE<10 | 1 -100% -4.0u | 16 9–7 -20% -16.3u | +4.0u | 94% |
|    meanFor<50 | 1 -100% -4.0u | 16 9–7 -20% -16.3u | +4.0u | 94% |
|    netMeanPrior≥5 | 8 -21% -8.7u | 9 4–5 -26% -11.6u | +8.7u | 53% |
|    forTop2Pct<60 | 2 -5% -0.4u | 15 8–7 -25% -19.9u | +0.4u | 88% |
|    agsV12ForMean<40 | 3 +12% +1.6u | 14 7–7 -30% -21.9u | -1.6u | 82% |
|    SR≥2.5 | 12 -20% -12.0u | 5 2–3 -32% -8.2u | +12.0u | 29% |
|    leadRoiNorm<25 | 12 -17% -10.6u | 5 2–3 -40% -9.6u | +10.6u | 29% |
|    chalk≤-200 | 9 -2% -0.9u | 8 2–6 -52% -19.3u | +0.9u | 47% |

### Aug1+ — best practical KEEP lifts

- **SR≥3 OR EDGE<10**: KEEP 9 6–3 67% -4.9u -10% · cut 8 3–5 38% -15.4u -41% · Δ +15.4u · keep 53%
- **SR≥3 OR meanFor<55**: KEEP 9 6–3 67% -4.9u -10% · cut 8 3–5 38% -15.4u -41% · Δ +15.4u · keep 53%
- **SR≥3 OR softSkill**: KEEP 9 6–3 67% -4.9u -10% · cut 8 3–5 38% -15.4u -41% · Δ +15.4u · keep 53%
- **KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50)**: KEEP 9 6–3 67% -4.9u -10% · cut 8 3–5 38% -15.4u -41% · Δ +15.4u · keep 53%
- **topFor<60**: KEEP 12 8–4 67% -5.3u -8% · cut 5 1–4 20% -15.0u -65% · Δ +15.0u · keep 71%
- **SR≥3**: KEEP 10 6–4 60% -8.9u -17% · cut 7 3–4 43% -11.4u -34% · Δ +11.4u · keep 59%
- **SR≥3 OR MLB TOTAL×HOLD**: KEEP 10 6–4 60% -8.9u -17% · cut 7 3–4 43% -11.4u -34% · Δ +11.4u · keep 59%
- **SR≥3 AND meanFor<60**: KEEP 13 8–5 62% -9.3u -14% · cut 4 1–3 25% -11.0u -58% · Δ +11.0u · keep 76%

## Cross-window stable cuts (help Jun15+ AND Jul15+)

| Rule | Jun KEEP ROI / Δ | Jul KEEP ROI / Δ | Stable? |
|------|------------------|------------------|---------|
| 🎯 SR≥3 | 58 +2% Δ+25.7u | 22 -7% Δ+6.2u | YES |
|  SR≥2.5 | 42 +9% Δ+35.6u | 15 -11% Δ+6.3u | no |
| 🎯 EDGE<10 | 78 +3% Δ+28.9u | 26 +8% Δ+24.9u | YES |
| 🎯 EDGE<15 | 71 -3% Δ+10.3u | 19 -8% Δ+6.3u | YES |
| 🎯 meanFor<50 | 84 -1% Δ+16.0u | 32 -1% Δ+12.0u | YES |
| 🎯 meanFor<55 | 74 -1% Δ+14.6u | 22 -3% Δ+10.6u | YES |
| 🎯 topFor<55 | 78 -2% Δ+12.3u | 25 -1% Δ+12.3u | YES |
| 🎯 topFor<60 | 68 -0% Δ+18.6u | 15 +6% Δ+18.6u | YES |
| 🎯 MLB TOTAL | 61 -4% Δ+8.0u | 29 -4% Δ+8.1u | YES |
| 🎯 MLB TOTAL×HOLD | 85 -2% Δ+13.0u | 32 -1% Δ+13.0u | YES |
|  HOLD | 75 -4% Δ+4.6u | 22 -8% Δ+4.6u | no |
|  units 4–4.99 | 47 -7% Δ+2.6u | 23 -1% Δ+13.2u | no |
|  chalk≤-200 | 69 -6% Δ-0.3u | 23 -17% Δ-4.1u | no |
|  near -119..-100 | 51 -8% Δ-1.0u | 20 -11% Δ+2.8u | no |
| 🎯 netMeanPrior≥5 | 73 +1% Δ+22.1u | 20 +9% Δ+22.1u | YES |
|  forTop2Pct<60 | 85 -5% Δ-1.8u | 32 -10% Δ-1.8u | no |
|  leadRoiNorm<25 | 57 -6% Δ+2.3u | 23 -3% Δ+10.6u | no |
|  agsV12ForMean<40 | 35 -10% Δ+2.1u | 18 -13% Δ+1.8u | no |
| 🎯 SR≥3 OR EDGE<10 | 51 +10% Δ+42.6u | 15 +12% Δ+23.1u | YES |
| 🎯 SR≥3 OR meanFor<55 | 51 +6% Δ+33.6u | 15 +0% Δ+14.2u | YES |
|  EDGE<15 OR meanFor<55 | 67 -4% Δ+6.5u | 15 -14% Δ+2.5u | no |
| 🎯 SR≥3 AND meanFor<60 | 79 -1% Δ+15.6u | 27 -2% Δ+11.6u | YES |
| 🎯 SR≥3 OR MLB TOTAL×HOLD | 58 +2% Δ+25.7u | 22 -7% Δ+6.2u | YES |
| 🎯 EDGE<10 OR meanFor<50 OR topFor<55 | 73 +0% Δ+19.8u | 21 +2% Δ+15.8u | YES |
|  softSkill (E<15|mF<55|tF<55) | 67 -4% Δ+6.5u | 15 -14% Δ+2.5u | no |
| 🎯 SR≥3 OR softSkill | 47 +4% Δ+29.0u | 11 -7% Δ+9.5u | YES |
|  KEEP only SR1.5–2.5 AND E≥15 | 7 -10% Δ+15.3u | 7 -10% Δ+10.1u | no |
| 🎯 KEEP SR<3 AND (noE or E≥10) AND (noMF or MF≥50) | 51 +10% Δ+42.6u | 15 +12% Δ+23.1u | YES |

## Recommended discrimination (not path kill)

Prefer stacked soft-skill + oversized lead over killing TOP:
1. If EDGE stamped and EDGE < 10 → cut/size-cap (already near EDGE-band world)
2. If meanFor < 50 (or topFor < 55) → cut/size-cap
3. If lead stamped sizeRatio ≥ 3 → size-cap toward 1.5–2 band or cut
4. Optional pocket: MLB TOTAL × HOLD
Keep the rest of TOP — that is the winner side of the path.
