# Unbounded 4u+ pattern discovery
_Generated 2026-08-26T15:17:13.276Z · stamp-safe · noise-floor calibrated_

Universe U_all: **246** tickets · 154–92 · +107.2u · ROI 9.4%

## U_all

Base: n=246 · 154–92 · +107.2u · ROI 9.4%
Noise floor (random 20% cut ΔPnL): mean -24.9u · p95 **16.0u** · p99 22.4u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ◆ TierA TOP cut | 37 17–20 -25% -42.6u | +15% | +42.6u | +26.6 | 4/5✓ |
| 2 | ◆ TOP ∧ (leadSR≥3∨EDGE<10) | 37 17–20 -25% -42.6u | +15% | +42.6u | +26.6 | 4/5✓ |
| 3 | ○ (ticketEv<-1)∧(EDGE≥12.65) | 16 6–10 -44% -37.6u | +14% | +37.6u | +21.7 | 1/1 |
| 4 | ○ (ticketEv<-1)∧(EDGE≥15.43) | 14 5–9 -48% -36.6u | +13% | +36.6u | +20.6 | 1/1 |
| 5 | ◆ (EDGE<10.2)∧(leadSR≥0.84) | 16 4–12 -54% -36.0u | +13% | +36.0u | +20.1 | 2/2✓ |
| 6 | ◆ (EDGE<10.2)∧(leadSR≥0.62) | 17 5–12 -46% -32.6u | +13% | +32.6u | +16.6 | 2/2✓ |
| 7 | ○ (ticketEv<-1)∧(EDGE≥11.35) | 17 7–10 -35% -31.6u | +13% | +31.6u | +15.6 | 1/1 |
| 8 | ◆ (edgePerUnit<2.04)∧(leadSR≥0.84) | 17 5–12 -43% -30.9u | +13% | +30.9u | +14.9 | 2/2✓ |
| 9 | ◆ EDGE < 10.2 | 18 6–12 -41% -30.7u | +13% | +30.7u | +14.7 | 2/2✓ |
| 10 | ◆ (EDGE<10.2)∧(units≥4) | 18 6–12 -41% -30.7u | +13% | +30.7u | +14.7 | 2/2✓ |
| 11 | ◆ (EDGE<10.2)∧(odds≥-232) | 18 6–12 -41% -30.7u | +13% | +30.7u | +14.7 | 2/2✓ |
| 12 | ○ (EDGE<10.2)∧(odds≥-168) | 15 4–11 -49% -30.4u | +13% | +30.4u | +14.4 | 1/1 |
| 13 | ◆ (leadSR≥2.44)∧(units<5.06) | 58 30–28 -12% -29.7u | +15% | +29.7u | +13.8 | 3/5✓ |
| 14 | ◆ (edgePerUnit<3.27)∧(leadSR≥0.84) | 49 23–26 -13% -29.1u | +15% | +29.1u | +13.1 | 3/5✓ |
| 15 | ◆ (netMeanPrior≥-3.17)∧(EDGE<10.2) | 16 5–11 -43% -28.6u | +13% | +28.6u | +12.6 | 2/2✓ |
| 16 | ◆ (EDGE<15.43)∧(units<5) | 42 19–23 -17% -28.1u | +14% | +28.1u | +12.1 | 4/5✓ |
| 17 | ○ (EDGE<10.2)∧(leadSR≥1.38) | 14 4–10 -48% -28.0u | +12% | +28.0u | +12.0 | 1/1 |
| 18 | ○ boostBand ∧ ticketEv<-1 | 16 7–9 -32% -27.6u | +13% | +27.6u | +11.6 | 1/1 |

**Greedy stack** (sequential residual cuts) → total Δ **+90.0u** · keep 145 @ ROI 29%
- TierA TOP cut · cut 37 @ -25% · step +42.6u
- (ticketEv<-1)∧(EDGE≥15.43) · cut 12 @ -50% · step +32.5u
- (EDGE<15.43)∧(units<5) · cut 32 @ -7% · step +9.2u
- (forRoiNormMean≥45.05)∧(leadSR≥2.44) · cut 20 @ -6% · step +5.7u

## U_res (after TierA TOP cut)

Base: n=209 · 137–72 · +149.8u · ROI 15.3%
Noise floor (random 20% cut ΔPnL): mean -29.3u · p95 **9.7u** · p99 41.6u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ○ (ticketEv<-1)∧(EDGE≥13.5) | 13 5–8 -42% -29.6u | +20% | +29.6u | +19.9 | 1/1 |
| 2 | ○ (ticketEv<-1)∧(EDGE≥16.7) | 11 4–7 -46% -27.1u | +19% | +27.1u | +17.4 | 1/1 |
| 3 | ○ (ticketEv<-1.5)∧(units≥5.4) | 12 5–7 -37% -24.2u | +19% | +24.2u | +14.5 | 1/1 |
| 4 | ○ (ticketEv<-1.5)∧(EDGE≥11) | 12 5–7 -37% -24.2u | +19% | +24.2u | +14.5 | 1/1 |
| 5 | ○ (ticketEv<-1.5)∧(EDGE≥12.1) | 12 5–7 -37% -24.2u | +19% | +24.2u | +14.5 | 1/1 |
| 6 | ○ (ticketEv<-1.5)∧(EDGE≥13.5) | 12 5–7 -37% -24.2u | +19% | +24.2u | +14.5 | 1/1 |
| 7 | ○ boostBand ∧ ticketEv<-1 | 14 6–8 -31% -23.5u | +19% | +23.5u | +13.9 | 1/1 |
| 8 | ○ (ticketEv<-1)∧(units≥5.4) | 14 6–8 -31% -23.5u | +19% | +23.5u | +13.9 | 1/1 |
| 9 | ○ (ticketEv<-1)∧(EDGE≥11) | 14 6–8 -31% -23.5u | +19% | +23.5u | +13.9 | 1/1 |
| 10 | ○ (ticketEv<-1)∧(EDGE≥12.1) | 14 6–8 -31% -23.5u | +19% | +23.5u | +13.9 | 1/1 |
| 11 | ○ (ticketEv<-1.5)∧(EDGE≥16.7) | 10 4–6 -40% -21.7u | +19% | +21.7u | +12.0 | 1/1 |
| 12 | ○ expGap ≥ 6.667 | 14 5–9 -26% -19.5u | +19% | +19.5u | +9.9 | 1/1 |
| 13 | ○ ticketEv < -1.5 | 13 6–7 -28% -19.3u | +19% | +19.3u | +9.6 | 1/1 |
| 14 | ○ (ticketEv<-1.5)∧(units≥4) | 13 6–7 -28% -19.3u | +19% | +19.3u | +9.6 | 1/1 |
| 15 | ○ (ticketEv<-1.5)∧(units≥5) | 13 6–7 -28% -19.3u | +19% | +19.3u | +9.6 | 1/1 |
| 16 | ○ ticketEv<-1 | 15 7–8 -23% -18.6u | +19% | +18.6u | +8.9 | 1/1 |
| 17 | ○ ticketEv < -1 | 15 7–8 -23% -18.6u | +19% | +18.6u | +8.9 | 1/1 |
| 18 | ○ (ticketEv<-1)∧(units≥4) | 15 7–8 -23% -18.6u | +19% | +18.6u | +8.9 | 1/1 |

**Greedy stack** (sequential residual cuts) → total Δ **+69.2u** · keep 166 @ ROI 29%
- (ticketEv<-1)∧(EDGE≥13.5) · cut 13 @ -42% · step +29.6u
- (leadShare≥0.82)∧(EDGE<11) · cut 9 @ -38% · step +14.2u
- (steamDiv≥1.56)∧(ticketEv≥-1.9) · cut 4 @ -66% · step +13.1u
- TOP+ · cut 17 @ -14% · step +12.2u

## U_top

Base: n=88 · 51–37 · -19.1u · ROI -4.7%
Noise floor (random 20% cut ΔPnL): mean 3.1u · p95 **23.1u** · p99 31.8u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ◆ (forRoiNormMean≥41.83)∧(leadSR≥1.98) | 33 13–20 -35% -53.7u | +14% | +53.7u | +30.6 | 3/3✓ |
| 2 | ◆ sumSR ≥ 2.77 | 58 29–29 -20% -54.8u | +26% | +54.8u | +31.7 | 3/3✓ |
| 3 | ◆ sumSR ≥ 3.3 | 45 22–23 -22% -46.8u | +14% | +46.8u | +23.7 | 4/5✓ |
| 4 | ◆ (forRoiNormMean≥41.83)∧(leadSR≥2.14) | 26 10–16 -39% -46.3u | +9% | +46.3u | +23.2 | 3/4✓ |
| 5 | ◆ (forRoiNormMean≥46.63)∧(leadSR≥1.98) | 24 9–15 -40% -44.5u | +9% | +44.5u | +21.4 | 3/4✓ |
| 6 | ◆ TierA TOP cut | 37 17–20 -25% -42.6u | +10% | +42.6u | +19.5 | 4/4✓ |
| 7 | ◆ TOP ∧ (leadSR≥3∨EDGE<10) | 37 17–20 -25% -42.6u | +10% | +42.6u | +19.5 | 4/4✓ |
| 8 | ◆ (forRoiNormMean≥41.83)∧(leadSR≥1.86) | 37 17–20 -24% -39.9u | +9% | +39.9u | +16.8 | 3/3✓ |
| 9 | ◆ (leadSR≥2.58)∧(units<5.4) | 35 16–19 -25% -38.6u | +8% | +38.6u | +15.5 | 2/2✓ |
| 10 | ◆ (forRoiNormMean≥21.6)∧(leadSR≥2.14) | 46 23–23 -18% -37.4u | +9% | +37.4u | +14.3 | 3/4✓ |
| 11 | ◆ (forRoiNormMean≥46.63)∧(leadSR≥1.86) | 26 11–15 -31% -36.7u | +6% | +36.7u | +13.6 | 3/4✓ |
| 12 | ◆ leadShare < 0.706 | 43 22–21 -19% -36.7u | +8% | +36.7u | +13.6 | 4/5✓ |
| 13 | ◆ (forRoiNormMean≥46.63)∧(leadSR≥2.14) | 20 8–12 -38% -34.7u | +5% | +34.7u | +11.6 | 3/4✓ |
| 14 | ◆ (leadSR≥2.14)∧(units<5.4) | 44 22–22 -18% -34.3u | +7% | +34.3u | +11.2 | 2/2✓ |
| 15 | ◆ forPnlNormSum ≥ 3.5 | 77 41–36 -12% -42.1u | +42% | +42.1u | +19.0 | 2/2✓ |
| 16 | ◆ (leadSR≥2.89)∧(units<5.4) | 27 12–15 -28% -32.9u | +5% | +32.9u | +9.8 | 2/2✓ |
| 17 | ◆ (leadSR≥2.89)∧(units<5) | 16 5–11 -50% -32.2u | +4% | +32.2u | +9.1 | 2/2✓ |
| 18 | ◆ (forRoiNormMean≥34.98)∧(leadSR≥1.98) | 44 22–22 -16% -32.0u | +6% | +32.0u | +8.9 | 3/3✓ |

**Greedy stack** (sequential residual cuts) → total Δ **+62.3u** · keep 25 @ ROI 37%
- sumSR ≥ 2.77 · cut 58 @ -20% · step +54.8u
- TierA TOP cut · cut 5 @ -36% · step +7.5u

## U_nontop

Base: n=158 · 103–55 · +126.3u · ROI 17.1%
Noise floor (random 20% cut ΔPnL): mean -29.4u · p95 **13.5u** · p99 28.5u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ○ (ticketEv<-1)∧(EDGE≥15.43) | 7 1–6 -74% -28.1u | +22% | +28.1u | +14.6 | 1/1 |
| 2 | ○ (ticketEv<-1)∧(EDGE≥13.07) | 8 2–6 -58% -25.2u | +22% | +25.2u | +11.7 | 1/1 |
| 3 | ○ (ticketEv<-1)∧(EDGE≥19.66) | 6 1–5 -70% -22.7u | +21% | +22.7u | +9.2 | 1/1 |
| 4 | ○ boostBand ∧ ticketEv<-1 | 9 3–6 -39% -19.1u | +21% | +19.1u | +5.6 | 1/1 |
| 5 | ○ (ticketEv<-1)∧(units≥5.06) | 9 3–6 -39% -19.1u | +21% | +19.1u | +5.6 | 1/1 |
| 6 | ○ (ticketEv<-1)∧(units≥5.4) | 9 3–6 -39% -19.1u | +21% | +19.1u | +5.6 | 1/1 |
| 7 | ○ (ticketEv<-1)∧(EDGE≥11.75) | 9 3–6 -39% -19.1u | +21% | +19.1u | +5.6 | 1/1 |
| 8 | ○ expGap ≥ 6.667 | 12 4–8 -30% -19.0u | +22% | +19.0u | +5.4 | 1/1 |
| 9 | ○ SHARP ∧ ticketEv<-1 | 5 1–4 -69% -18.7u | +20% | +18.7u | +5.2 | 1/1 |
| 10 | ○ (ticketEv<-0.3)∧(EDGE≥15.43) | 9 3–6 -38% -18.4u | +21% | +18.4u | +4.9 | 1/1 |
| 11 | ○ (EDGE<11.75)∧(odds<-126) | 7 2–5 -59% -17.7u | +20% | +17.7u | +4.2 | 1/1 |
| 12 | ○ (ticketEv<-1.9)∧(EDGE≥15.43) | 5 1–4 -64% -17.3u | +20% | +17.3u | +3.8 | 1/1 |
| 13 | ○ (ticketEv<-0.3)∧(EDGE≥13.07) | 10 4–6 -29% -15.5u | +21% | +15.5u | +2.0 | 1/1 |
| 14 | ○ (forRoiNormMean<23)∧(leadSR<0.33) | 8 3–5 -39% -14.8u | +20% | +14.8u | +1.3 | 1/1 |
| 15 | ○ (EDGE<13.07)∧(odds<-126) | 9 4–5 -38% -14.6u | +20% | +14.6u | +1.1 | 1/1 |
| 16 | ◆ (leadShare≥0.96)∧(EDGE<15.43) | 27 13–14 -12% -14.5u | +23% | +14.5u | +0.9 | 3/3✓ |
| 17 | ○ ticketEv<-1 | 10 4–6 -26% -14.2u | +21% | +14.2u | +0.7 | 1/1 |
| 18 | ○ ticketEv < -1 | 10 4–6 -26% -14.2u | +21% | +14.2u | +0.7 | 1/1 |

**Greedy stack** (sequential residual cuts) → total Δ **+60.6u** · keep 136 @ ROI 30%
- (ticketEv<-1)∧(EDGE≥15.43) · cut 7 @ -74% · step +28.1u
- (EDGE<11.75)∧(odds<-126) · cut 7 @ -59% · step +17.7u
- (forRoiNormMean<23)∧(leadSR<0.33) · cut 8 @ -39% · step +14.8u

## U_mlb

Base: n=181 · 104–77 · +53.3u · ROI 6.5%
Noise floor (random 20% cut ΔPnL): mean -11.3u · p95 **31.8u** · p99 42.7u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ◆ (forRoiNormMean≥45.3)∧(leadSR≥2.25) | 25 8–17 -36% -40.4u | +13% | +40.4u | +8.6 | 2/4✓ |
| 2 | ◆ (forRoiNormMean≥45.3)∧(leadSR≥1.86) | 34 13–21 -26% -40.2u | +14% | +40.2u | +8.4 | 2/4✓ |
| 3 | ◆ (forRoiNormMean≥40.9)∧(leadSR≥2.25) | 32 12–20 -27% -40.1u | +14% | +40.1u | +8.3 | 2/4✓ |
| 4 | ◆ (slateN≥5)∧(units<5.4) | 91 45–46 -10% -39.7u | +22% | +39.7u | +7.9 | 5/5✓ |
| 5 | ◆ (meanFor≥55.6)∧(odds<-106) | 35 15–20 -22% -36.2u | +14% | +36.2u | +4.4 | 4/4✓ |
| 6 | ◆ (forRoiNormMean≥40.9)∧(leadSR≥1.86) | 47 21–26 -17% -35.5u | +15% | +35.5u | +3.7 | 2/4✓ |
| 7 | ◆ (forRoiNormMean≥45.3)∧(leadSR≥1.39) | 45 20–25 -17% -35.1u | +14% | +35.1u | +3.3 | 3/4✓ |
| 8 | ◆ (leadSR≥2.25)∧(units<5.4) | 51 24–27 -15% -34.0u | +15% | +34.0u | +2.2 | 4/5✓ |
| 9 | ◆ (forRoiNormMean≥40.9)∧(leadSR≥1.39) | 64 31–33 -12% -33.1u | +16% | +33.1u | +1.3 | 3/4✓ |
| 10 | ◆ TierA TOP cut | 27 11–16 -27% -32.9u | +12% | +32.9u | +1.1 | 3/4✓ |
| 11 | ◆ TOP ∧ (leadSR≥3∨EDGE<10) | 27 11–16 -27% -32.9u | +12% | +32.9u | +1.1 | 3/4✓ |
| 12 | ◆ (leadSR≥1.86)∧(units<5.4) | 78 39–39 -10% -33.8u | +18% | +33.8u | +2.0 | 3/5✓ |
| 13 | ◆ (slateN≥3)∧(units<5.4) | 131 67–64 -7% -41.4u | +38% | +41.4u | +9.6 | 4/6✓ |
| 14 | ◆ (slateN≥4)∧(units<5.4) | 120 61–59 -8% -39.1u | +31% | +39.1u | +7.4 | 6/6✓ |
| 15 | ◆ (slateN<8)∧(units<5.4) | 117 60–57 -7% -36.8u | +29% | +36.8u | +5.0 | 4/6✓ |
| 16 | ◆ (leadSR≥1.39)∧(units<5.4) | 101 52–49 -7% -32.7u | +23% | +32.7u | +0.9 | 5/6✓ |
| 17 | · (forRoiNormMean≥34.55)∧(leadSR≥2.25) | 39 17–22 -17% -31.7u | +13% | +31.7u | -0.1 | 2/4✓ |
| 18 | · (leadShare≥0.82)∧(EDGE<12.9) | 27 11–16 -27% -31.3u | +12% | +31.3u | -0.5 | 3/3✓ |

**Greedy stack** (sequential residual cuts) → total Δ **+45.6u** · keep 42 @ ROI 46%
- (slateN≥3)∧(units<5.4) · cut 131 @ -7% · step +41.4u
- TierA TOP cut · cut 8 @ -11% · step +4.2u

## U_mlb_res

Base: n=154 · 93–61 · +86.2u · ROI 12.4%
Noise floor (random 20% cut ΔPnL): mean -19.5u · p95 **23.6u** · p99 54.4u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ○ (forRoiNormMean≥44.8)∧(leadSR≥1.99) | 18 6–12 -35% -27.4u | +18% | +27.4u | +3.8 | 1/3 |
| 2 | · (meanFor≥55.9)∧(odds<-105) | 29 13–16 -16% -22.3u | +19% | +22.3u | -1.3 | 4/4✓ |
| 3 | · (forRoiNormMean≥40.15)∧(leadSR≥1.99) | 24 10–14 -18% -19.3u | +18% | +19.3u | -4.3 | 1/3 |
| 4 | · expGap ≥ 6.684 | 6 1–5 -61% -18.5u | +16% | +18.5u | -5.1 | 1/1 |
| 5 | · forPnlNormSum ≥ 142.6 | 24 10–14 -15% -17.5u | +18% | +17.5u | -6.1 | 2/3✓ |
| 6 | · expGap ≥ 7.08 | 4 0–4 -100% -18.8u | +16% | +18.8u | -4.8 | 1/1 |
| 7 | · (leadShare≥0.82)∧(EDGE<13.5) | 24 11–13 -16% -16.8u | +17% | +16.8u | -6.8 | 3/3✓ |
| 8 | · (EDGE<11.9)∧(odds<-120) | 8 3–5 -49% -16.7u | +16% | +16.7u | -6.9 | 1/1 |
| 9 | · TOP+ | 16 7–9 -19% -15.5u | +17% | +15.5u | -8.1 | 1/1 |
| 10 | · (leadShare≥0.93)∧(EDGE<13.5) | 18 8–10 -19% -14.2u | +16% | +14.2u | -9.4 | 3/3✓ |
| 11 | · (leadShare≥0.82)∧(EDGE<11.9) | 16 7–9 -20% -13.9u | +16% | +13.9u | -9.8 | 1/1 |
| 12 | · expGap ≥ 6.667 | 7 2–5 -41% -14.6u | +15% | +14.6u | -9.0 | 1/1 |
| 13 | · (EDGE<13.5)∧(odds<-120) | 9 4–5 -38% -14.6u | +15% | +14.6u | -9.0 | 1/1 |
| 14 | · (edgeGap≥15.43)∧(leadSR≥0.74) | 22 10–12 -11% -11.6u | +17% | +11.6u | -12.0 | 3/4✓ |
| 15 | · (meanFor≥55.9)∧(odds<-120) | 13 6–7 -19% -11.5u | +15% | +11.5u | -12.1 | 2/3✓ |
| 16 | · (meanFor≥58.05)∧(odds<-105) | 20 9–11 -12% -11.3u | +16% | +11.3u | -12.3 | 3/4✓ |
| 17 | · (ticketEv<-1.5)∧(EDGE≥15.57) | 3 0–3 -100% -16.2u | +15% | +16.2u | -7.4 | 1/1 |
| 18 | · (ticketEv<-0.1)∧(EDGE≥15.57) | 3 0–3 -100% -16.2u | +15% | +16.2u | -7.4 | 1/1 |

## U_ev (Aug20+ stamped)

Base: n=30 · 17–13 · -1.9u · ROI -1.2%
Noise floor (random 20% cut ΔPnL): mean -1.2u · p95 **20.0u** · p99 21.3u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ○ (ticketEv<-1)∧(EDGE≥15.26) | 15 5–10 -51% -40.6u | +49% | +40.6u | +20.5 | 1/1 |
| 2 | ○ (ticketEv<-1)∧(EDGE≥13.14) | 16 6–10 -44% -37.6u | +48% | +37.6u | +17.6 | 1/1 |
| 3 | ○ (ticketEv<-1)∧(EDGE≥16.68) | 13 5–8 -44% -31.2u | +33% | +31.2u | +11.1 | 1/1 |
| 4 | ○ (ticketEv<-2.3)∧(EDGE≥15.26) | 8 2–6 -69% -29.0u | +23% | +29.0u | +9.0 | 1/1 |
| 5 | ○ boostBand ∧ ticketEv<-1 | 16 7–9 -32% -27.6u | +36% | +27.6u | +7.6 | 1/1 |
| 6 | ○ (ticketEv<-1)∧(units≥5.4) | 16 7–9 -32% -27.6u | +36% | +27.6u | +7.6 | 1/1 |
| 7 | ○ leadShare ≥ 0.836 | 16 7–9 -32% -26.7u | +33% | +26.7u | +6.7 | 1/1 |
| 8 | ○ (edgePerUnit≥2.94)∧(leadSR≥2.42) | 9 3–6 -58% -26.7u | +22% | +26.7u | +6.7 | 1/1 |
| 9 | ○ (ticketEv<-2.3)∧(EDGE≥13.14) | 9 3–6 -55% -26.1u | +22% | +26.1u | +6.1 | 1/1 |
| 10 | ○ (EDGE≥13.14)∧(leadSR≥2.42) | 10 4–6 -50% -25.8u | +22% | +25.8u | +5.8 | 1/1 |
| 11 | ○ (EDGE≥15.26)∧(leadSR≥2.42) | 10 4–6 -50% -25.8u | +22% | +25.8u | +5.8 | 1/1 |
| 12 | ○ (edgeGap≥13.14)∧(leadSR≥2.42) | 10 4–6 -50% -25.8u | +22% | +25.8u | +5.8 | 1/1 |
| 13 | ○ (edgeGap≥15.26)∧(leadSR≥2.42) | 10 4–6 -50% -25.8u | +22% | +25.8u | +5.8 | 1/1 |
| 14 | ○ (edgePerUnit≥2.52)∧(leadSR≥2.42) | 10 4–6 -50% -25.8u | +22% | +25.8u | +5.8 | 1/1 |
| 15 | ○ (ticketEv<-2.3)∧(EDGE≥16.68) | 7 2–5 -66% -25.0u | +19% | +25.0u | +5.0 | 1/1 |
| 16 | ○ (ticketEv<-1.8)∧(EDGE≥15.26) | 12 5–7 -38% -24.4u | +23% | +24.4u | +4.3 | 1/1 |
| 17 | ○ (ticketEv<-2.7)∧(EDGE≥15.26) | 6 1–5 -78% -24.2u | +17% | +24.2u | +4.2 | 1/1 |
| 18 | ○ (qConv≥9.78)∧(leadSR≥0.83) | 16 7–9 -29% -24.1u | +30% | +24.1u | +4.1 | 1/1 |

**Greedy stack** (sequential residual cuts) → total Δ **+46.7u** · keep 11 @ ROI 73%
- (ticketEv<-1)∧(EDGE≥15.26) · cut 15 @ -51% · step +40.6u
- (EDGE≥13.14)∧(leadSR≥2.42) · cut 2 @ -31% · step +3.1u
- forTop2Pct < 65.18 · cut 2 @ -38% · step +3.0u

## U_boost (≥5.4u)

Base: n=62 · 46–16 · +84.3u · ROI 24.4%
Noise floor (random 20% cut ΔPnL): mean -18.0u · p95 **6.1u** · p99 12.9u

| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |
|--:|------------|-----|---------:|-----:|---------:|:----------:|
| 1 | ○ (ticketEv<-1.5)∧(EDGE≥15.43) | 13 5–8 -44% -31.2u | +42% | +31.2u | +25.1 | 1/1 |
| 2 | ○ ticketEv < -1.5 | 14 6–8 -37% -28.2u | +42% | +28.2u | +22.2 | 1/1 |
| 3 | ○ (ticketEv<-1.5)∧(units≥5.4) | 14 6–8 -37% -28.2u | +42% | +28.2u | +22.2 | 1/1 |
| 4 | ○ (ticketEv<-1.5)∧(units<6) | 14 6–8 -37% -28.2u | +42% | +28.2u | +22.2 | 1/1 |
| 5 | ○ (ticketEv<-1.5)∧(EDGE≥13.53) | 14 6–8 -37% -28.2u | +42% | +28.2u | +22.2 | 1/1 |
| 6 | ○ boostBand ∧ ticketEv<-1 | 16 7–9 -32% -27.6u | +43% | +27.6u | +21.5 | 1/1 |
| 7 | ○ ticketEv<-1 | 16 7–9 -32% -27.6u | +43% | +27.6u | +21.5 | 1/1 |
| 8 | ○ (leadShare≥0.81)∧(EDGE≥22.7) | 17 9–8 -29% -26.7u | +44% | +26.7u | +20.7 | 1/2 |
| 9 | ○ (ticketEv<-2.3)∧(EDGE≥15.43) | 7 2–5 -66% -25.0u | +36% | +25.0u | +18.9 | 1/1 |
| 10 | ○ ticketEv < -2.3 | 8 3–5 -51% -22.1u | +35% | +22.1u | +16.0 | 1/1 |
| 11 | ○ (ticketEv<-2.3)∧(units≥5.4) | 8 3–5 -51% -22.1u | +35% | +22.1u | +16.0 | 1/1 |
| 12 | ○ (ticketEv<-2.3)∧(units<6) | 8 3–5 -51% -22.1u | +35% | +22.1u | +16.0 | 1/1 |
| 13 | ○ (ticketEv<-2.3)∧(EDGE≥13.53) | 8 3–5 -51% -22.1u | +35% | +22.1u | +16.0 | 1/1 |
| 14 | ○ (ticketEv<-1.8)∧(EDGE≥15.43) | 11 5–6 -34% -20.4u | +37% | +20.4u | +14.3 | 1/1 |
| 15 | ○ (ticketEv<-1.5)∧(EDGE≥17.56) | 11 5–6 -34% -20.4u | +37% | +20.4u | +14.3 | 1/1 |
| 16 | ○ (ticketEv<-2.6)∧(EDGE≥15.43) | 5 1–4 -75% -20.2u | +33% | +20.2u | +14.2 | 1/1 |
| 17 | ○ (ticketEv<-2.3)∧(EDGE≥17.56) | 6 2–4 -61% -19.6u | +33% | +19.6u | +13.5 | 1/1 |
| 18 | ○ (ticketEv<-2.3)∧(EDGE≥22.7) | 6 2–4 -61% -19.6u | +33% | +19.6u | +13.5 | 1/1 |

**Greedy stack** (sequential residual cuts) → total Δ **+40.4u** · keep 41 @ ROI 54%
- (ticketEv<-1.5)∧(EDGE≥15.43) · cut 13 @ -44% · step +31.2u
- SHARP ∧ ticketEv<-1 · cut 2 @ -23% · step +2.5u
- tapeScore ≥ 10.665 · cut 4 @ -11% · step +2.5u
- (EDGE≥22.7)∧(leadSR<0.62) · cut 2 @ -39% · step +4.3u

## Discrete loser / winner signatures (U_all)

### Toxic signatures (ROI &lt; −15%, n≥3)
| Signature | n | W–L | PnL | ROI |
|-----------|--:|:---:|----:|----:|
| SHARP-LEAN·MLB·U<5.4·E≥20·SR<1.5·both·fav | 3 | 0–3 | -15.0u | -100% |
| TOP·MLB·U<5.4·Emid·SR≥3·both·fav | 4 | 1–3 | -10.8u | -60% |
| RANK·MLB·U<5.4·E?·SRmid·unopp·fav | 8 | 3–5 | -10.4u | -32% |
| TOP·MLB·U<5.4·E?·SR≥3·unopp·fav | 11 | 5–6 | -9.2u | -19% |
| TOP·MLB·U<5.4·E<10·SRmid·unopp·fav | 4 | 2–2 | -3.5u | -21% |

### Gold signatures (ROI &gt; +20%, n≥3)
| Signature | n | W–L | PnL | ROI |
|-----------|--:|:---:|----:|----:|
| RANK·MLB·U<5.4·E?·SR≥3·unopp·fav | 6 | 5–1 | +11.6u | +48% |
| SUPER·SOC·U≥5.4·E?·SR≥3·unopp·fav | 4 | 4–0 | +11.4u | +47% |
| TOP·MLB·U<5.4·Emid·SRmid·both·fav | 3 | 3–0 | +9.8u | +76% |
| RANK·MLB·U<5.4·E?·SR<1.5·unopp·dog | 7 | 4–3 | +8.1u | +29% |
| TOP·MLB·U≥5.4·E≥20·SRmid·both·fav | 3 | 2–1 | +4.2u | +25% |
| MINI·UFC·U<5.4·E≥20·SR<1.5·unopp·fav | 3 | 3–0 | +3.8u | +25% |
| SHARP-PRIME·MLB·U<5.4·E?·SRmid·unopp·fav | 3 | 2–1 | +2.6u | +22% |

## Lead-wallet concentration (stamped id only — no live WR)

| Lead wallet | n | W–L | PnL | ROI |
|-------------|--:|:---:|----:|----:|
| `7923c4` | 7 | 2–5 | -15.8u | -49% |
| `ac9705` | 8 | 3–5 | -11.7u | -28% |
| `621848` | 7 | 3–4 | -10.1u | -30% |
| `1e8f33` | 3 | 1–2 | -6.4u | -45% |
| `eeabaf` | 15 | 9–6 | +8.4u | +12% |
| `b839b3` | 5 | 5–0 | +13.7u | +62% |
| `bc44b0` | 6 | 6–0 | +16.6u | +57% |
| `cd2f63` | 6 | 5–1 | +17.9u | +64% |
| `0cd77e` | 33 | 20–13 | +18.5u | +12% |

## Cross-universe consensus angles

Rules that appear in top-15 of ≥2 universes with Δ above that universe’s noise p95:

| Rule | #univ | Appearances |
|------|------:|-------------|
| boostBand ∧ ticketEv<-1 | 4 | U_res+24u, U_nontop+19u, U_ev+28u, U_boost+28u |
| TierA TOP cut | 3 | U_all+43u, U_top+43u, U_mlb+33u |
| TOP ∧ (leadSR≥3∨EDGE<10) | 3 | U_all+43u, U_top+43u, U_mlb+33u |
| (ticketEv<-1)∧(units≥5.4) | 3 | U_res+24u, U_nontop+19u, U_ev+28u |
| (ticketEv<-1)∧(EDGE≥15.43) | 2 | U_all+37u, U_nontop+28u |
| (ticketEv<-1.5)∧(units≥5.4) | 2 | U_res+24u, U_boost+28u |
| expGap ≥ 6.667 | 2 | U_res+20u, U_nontop+19u |
| ticketEv < -1.5 | 2 | U_res+19u, U_boost+28u |

## CLEAR ANGLES — actionable, ranked by confidence

Legend: ◆ = above noise + multi-era stable · ○ = strong but short-sample / single-era

### ◆ Angle A — Inside-TOP: whale OR soft EDGE (SHIP-DISCUSS)
**CUT TOP when `leadSR ≥ 3 OR EDGE < 10`.**
- U_all / U_top / U_mlb: **+43u / +43u / +33u** · 4/4–4/5 era stable · +27u above noise
- Keeps TOP path live (~58% of TOP retained historically)
- Still the cleanest deployable rule

### ◆ Angle A2 — NEW: TOP × “obvious sharp” pile (SHIP-DISCUSS / stronger than A alone on TOP)
**CUT TOP when stamped FOR `roiNorm` mean is high AND lead is sized up:**
`(forRoiNormMean ≥ ~42) ∧ (leadSR ≥ ~2.0)`
- On U_top alone: cut 33 · **−54u / −35% ROI** · keep TOP goes **+14% ROI** · **3/3 era stable** · +31u above noise
- Sister signal: **`sumSR ≥ ~2.8` on TOP** (multi-wallet size pile) · +55u · 3/3 stable
- This is the AGS “fade the obvious sharps” geometry on the TOP pathway: known-winning wallets (high stamped roiNorm) + size conviction on a 1-HC ticket → losers
- **Catches tickets Tier A keeps** (leadSR in 2–3 band with hot roiNorm)
- Suggested merge: CUT TOP if `TierA OR (forRoiNormMean≥42 ∧ leadSR≥2)` — validate CF before ship

### ◆ Angle B — Soft EDGE globally when stamped (CAUTION)
`EDGE < ~10` on any 4u+ (not only TOP): +31u · 2/2 stable where EDGE exists.
- Only valid post-tape (E2+). Do **not** apply to E0.
- Prefer path-conditional (TOP) to avoid clipping healthy non-TOP mid-EDGE tickets.

### ○ Angle C — BOOST × negative ticket EV (PAPER)
`units≥5.4 ∧ ticketEv < −1` (tighten with EDGE≥15): consensus across U_res / U_nontop / U_ev / U_boost (**+19–28u**).
- **Aug20+ stamps only** — paper 2–3 weeks, do not ship from one soft week

### ○ Angle D — expGap ≥ ~7 on sized tickets (PAPER)
`expWin − marketImplied ≥ 7` while we still size: overconfidence vs market · +19–20u in residual universes · EV-era only

### ◆ Angle E — Solo-lead concentration × soft EDGE (INVESTIGATE)
`(leadShare ≥ 0.96) ∧ (EDGE < 15)` on non-TOP: +14.5u · **3/3 stable**
- One wallet dominating invested share + soft EDGE → over-concentrated size
- Cap to ≤3u or mute when leadShare≥0.95 and EDGE&lt;15

### Toxic discrete signatures (machine-found pockets)
| Signature | n | PnL | Note |
|-----------|--:|----:|------|
| SHARP-LEAN·MLB·&lt;5.4u·E≥20·SR&lt;1.5·opposed·fav | 3 | −15u | Thin but pure poison |
| TOP·MLB·&lt;5.4u·midE·SR≥3·opposed·fav | 4 | −11u | Angle A/A2 core |
| TOP·MLB·&lt;5.4u·E?·SR≥3·unopp·fav | 11 | −9u | Pre-EDGE TOP whales |

### Gold signatures (protect — do not cut)
| Signature | n | PnL |
|-----------|--:|----:|
| RANK·MLB·SR≥3·unopp (no EDGE stamp) | 6 | +12u |
| SUPER·SOC·BOOST·SR≥3 | 4 | +11u |
| RANK dogs with SR&lt;1.5 | 7 | +8u |

**Note:** RANK×SR≥3 prints; TOP×SR≥3 dies. Size-whale meaning is **path-conditional** — never global.

### Do-not-angle (anti-patterns)
- Global maxSR≥3 / leadSR≥3 outside TOP
- Cut dogs / low meanFor / low qConv
- Extend sub-4 maxSR&lt;1 mute to 4u+
- Trust ticketEv/expWin/steam before Aug20

### Recommended sequence
1. **Ship CF for merge:** Angle A ∪ A2 on TOP only  
   `CUT if TOP && ( leadSR≥3 || EDGE<10 || (forRoiNormMean≥42 && leadSR≥2) )`
2. **Paper:** Angle C (BOOST×ticketEv&lt;−1), Angle D (expGap)
3. **Prototype cap:** Angle E (leadShare≥0.95 × soft EDGE) → size floor 3u not 0u
4. **Never:** shrink all 4u+ volume — non-TOP remains +17% Jun15+

---

## Exact CF — merged TOP rule (Jun15+)

| Rule | Cut n / ROI / PnL | Keep ROI | ΔPnL | TOP kept |
|------|-------------------|----------|------|----------|
| A only (`leadSR≥3 ∨ EDGE<10`) | 37 · −25% · −42.6u | +15.3% | **+42.6u** | 51/88 |
| A2 only (`roiNormMean≥42 ∧ leadSR≥2`) | 30 · −42% · −57.4u | +16.3% | **+57.4u** | 58/88 |
| **A ∪ A2 (recommended)** | **47 · −33% · −69.8u** | **+19.0%** | **+69.8u** | **41/88** |
| A ∪ A2 ∪ sumSR≥2.77 | 65 · −21% · −63.7u | +20.3% | +63.7u | 23/88 (overcuts) |

August MTD: A +15.4u → **A∪A2 +20.8u** (extra +5.4u in Aug alone).

**Do not add sumSR≥2.77 to the merge** — it cuts more TOP volume for less ΔPnL than A∪A2.

