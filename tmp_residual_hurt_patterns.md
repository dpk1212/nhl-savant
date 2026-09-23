# Residual hurt patterns — AFTER shipped TOP crowded mute
_Generated 2026-08-26T15:50:47.558Z · stamp-safe · noise-calibrated_

Shipped baseline removed from 4u+: `TOP ∧ (leadSR≥3 ∨ EDGE<10 ∨ (roiNorm≥42 ∧ leadSR≥2))`.

## Book organs

| Slice | Stats |
|-------|------:|
| ALL ≥1u | n=623 · 340–283 · +79.9u · ROI +4.3% |
| − shipped TOP crowded | n=540 · 300–240 · +128.9u · ROI +8.3% |
| − shipped − maxSR-sub4 | n=457 · 269–188 · +169.0u · ROI +12.0% |
| 4u+ actual | n=246 · 154–92 · +107.2u · ROI +9.4% |
| 4u+ residual (R4) | n=199 · 134–65 · +177.0u · ROI +19.0% |
| shipped cuts (CF) | n=47 · 20–27 · -69.8u · ROI -32.8% |
| sub-4 actual | n=377 · 186–191 · -27.3u · ROI -3.9% |
| sub-4 residual (post maxSR) | n=294 · 155–139 · +12.8u · ROI +2.3% |
| maxSR-sub4 cuts (CF) | n=83 · 31–52 · -40.1u · ROI -28.8% |

## R4

Base: n=199 · 134–65 · +177.0u · ROI +19.0%
Noise floor (random 20% cut ΔPnL): mean -41.6u · p95 **-8.3u** · p99 10.0u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | (ticketEv<-1)∧(EDGE≥15) | 12 4–8 -50% -32.5u | +24% | +32.5u | +40.8 | 1/1 |
| 2  ○ | (ticketEv<-1.0)∧(EDGE≥13.5) | 13 5–8 -42% -29.6u | +24% | +29.6u | +37.9 | 1/1 |
| 3  ○ | (ticketEv<-1.0)∧(EDGE≥16.7) | 11 4–7 -46% -27.1u | +23% | +27.1u | +35.4 | 1/1 |
| 4  ○ | (ticketEv<-1.5)∧(EDGE≥15) | 11 4–7 -46% -27.1u | +23% | +27.1u | +35.4 | 1/1 |
| 5  ○ | boost ∧ ticketEv<-1.5 | 12 5–7 -37% -24.2u | +23% | +24.2u | +32.5 | 1/1 |
| 6  ○ | (ticketEv<-1.5)∧(EDGE≥11.0) | 12 5–7 -37% -24.2u | +23% | +24.2u | +32.5 | 1/1 |
| 7  ○ | (ticketEv<-1.5)∧(EDGE≥12.0) | 12 5–7 -37% -24.2u | +23% | +24.2u | +32.5 | 1/1 |
| 8  ○ | (ticketEv<-1.5)∧(EDGE≥13.5) | 12 5–7 -37% -24.2u | +23% | +24.2u | +32.5 | 1/1 |
| 9  ○ | boost ∧ ticketEv<-1 | 14 6–8 -31% -23.5u | +23% | +23.5u | +31.8 | 1/1 |
| 10  ○ | (ticketEv<-1)∧(EDGE≥12) | 14 6–8 -31% -23.5u | +23% | +23.5u | +31.8 | 1/1 |
| 11  ○ | (ticketEv<-1.0)∧(EDGE≥11.0) | 14 6–8 -31% -23.5u | +23% | +23.5u | +31.8 | 1/1 |
| 12  ○ | (ticketEv<-1.0)∧(EDGE≥12.0) | 14 6–8 -31% -23.5u | +23% | +23.5u | +31.8 | 1/1 |
| 13  ○ | (ticketEv<-1.5)∧(EDGE≥16.7) | 10 4–6 -40% -21.7u | +23% | +21.7u | +30.0 | 1/1 |
| 14  ○ | (ticketEv<-2.5)∧(EDGE≥16.7) | 4 0–4 -100% -21.6u | +22% | +21.6u | +29.9 | 1/1 |
| 15  ◆ | (roiNorm<22.6)∧(leadSR<0.48) | 7 2–5 -61% -20.6u | +22% | +20.6u | +28.9 | 2/2✓ |
| 16  ○ | SHARP ∧ ticketEv<-1 | 7 2–5 -52% -19.8u | +22% | +19.8u | +28.1 | 1/1 |
| 17  ○ | expGap ≥ 6.667 | 14 5–9 -26% -19.5u | +23% | +19.5u | +27.8 | 1/1 |
| 18  ○ | ticketEv<-1.5 | 13 6–7 -28% -19.3u | +23% | +19.3u | +27.6 | 1/1 |
| 19  ○ | ticketEv < -1.5 | 13 6–7 -28% -19.3u | +23% | +19.3u | +27.6 | 1/1 |
| 20  ○ | (ticketEv<-2.5)∧(EDGE≥11.0) | 5 1–4 -69% -18.7u | +22% | +18.7u | +27.0 | 1/1 |

**Greedy stack** → total Δ **+93.8u** · keep n=161 · 122–39 · +270.8u · ROI +35.9%
- (ticketEv<-1)∧(EDGE≥15) · cut 12 @ -50% · step +32.5u
- (EDGE<12.0)∧(odds<-131) · cut 8 @ -49% · step +16.7u
- (roiNorm<22.6)∧(leadSR<0.48) · cut 6 @ -54% · step +15.2u
- SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 · cut 3 @ -100% · step +15.0u
- RANK∧MLB∧unopp∧fav∧SRmid · cut 9 @ -40% · step +14.4u

## R4_aug

Base: n=76 · 54–22 · +81.1u · ROI +21.2%
Noise floor (random 20% cut ΔPnL): mean -16.4u · p95 **14.0u** · p99 21.0u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | (ticketEv<-1)∧(EDGE≥15) | 12 4–8 -50% -32.5u | +36% | +32.5u | +18.5 | 1/1 |
| 2  ○ | (ticketEv<-1.0)∧(EDGE≥15.1) | 12 4–8 -50% -32.5u | +36% | +32.5u | +18.5 | 1/1 |
| 3  ○ | (ticketEv<-1.0)∧(EDGE≥13.5) | 13 5–8 -42% -29.6u | +35% | +29.6u | +15.6 | 1/1 |
| 4  ○ | (ticketEv<-1.5)∧(EDGE≥15) | 11 4–7 -46% -27.1u | +33% | +27.1u | +13.1 | 1/1 |
| 5  ○ | (ticketEv<-1.5)∧(EDGE≥15.1) | 11 4–7 -46% -27.1u | +33% | +27.1u | +13.1 | 1/1 |
| 6  ○ | boost ∧ ticketEv<-1.5 | 12 5–7 -37% -24.2u | +33% | +24.2u | +10.2 | 1/1 |
| 7  ○ | (ticketEv<-1.5)∧(EDGE≥12.3) | 12 5–7 -37% -24.2u | +33% | +24.2u | +10.2 | 1/1 |
| 8  ○ | (ticketEv<-1.5)∧(EDGE≥13.5) | 12 5–7 -37% -24.2u | +33% | +24.2u | +10.2 | 1/1 |
| 9  ○ | boost ∧ ticketEv<-1 | 14 6–8 -31% -23.5u | +34% | +23.5u | +9.6 | 1/1 |
| 10  ○ | (ticketEv<-1)∧(EDGE≥12) | 14 6–8 -31% -23.5u | +34% | +23.5u | +9.6 | 1/1 |
| 11  ○ | (ticketEv<-1.0)∧(EDGE≥12.3) | 14 6–8 -31% -23.5u | +34% | +23.5u | +9.6 | 1/1 |
| 12  ○ | (ticketEv<-2.5)∧(EDGE≥15.1) | 4 0–4 -100% -21.6u | +28% | +21.6u | +7.6 | 1/1 |
| 13  ○ | SHARP ∧ ticketEv<-1 | 7 2–5 -52% -19.8u | +29% | +19.8u | +5.8 | 1/1 |
| 14  ○ | expGap ≥ 6.667 | 14 5–9 -26% -19.5u | +33% | +19.5u | +5.6 | 1/1 |
| 15  ○ | ticketEv<-1.5 | 13 6–7 -28% -19.3u | +32% | +19.3u | +5.3 | 1/1 |
| 16  ○ | ticketEv < -1.5 | 13 6–7 -28% -19.3u | +32% | +19.3u | +5.3 | 1/1 |
| 17  ○ | (ticketEv<-2.5)∧(EDGE≥12.3) | 5 1–4 -69% -18.7u | +28% | +18.7u | +4.7 | 1/1 |
| 18  ○ | (ticketEv<-2.5)∧(EDGE≥13.5) | 5 1–4 -69% -18.7u | +28% | +18.7u | +4.7 | 1/1 |
| 19  ○ | ticketEv<-1 | 15 7–8 -23% -18.6u | +33% | +18.6u | +4.7 | 1/1 |
| 20  ○ | ticketEv < -1 | 15 7–8 -23% -18.6u | +33% | +18.6u | +4.7 | 1/1 |

**Greedy stack** → total Δ **+54.4u** · keep n=51 · 44–7 · +135.4u · ROI +53.1%
- (ticketEv<-1)∧(EDGE≥15) · cut 12 @ -50% · step +32.5u
- steamDiv ≥ 1.56 · cut 4 @ -66% · step +13.1u
- (roiNorm<27.2)∧(leadSR<0.60) · cut 7 @ -16% · step +5.7u
- (EDGE<12.3)∧(odds<-140) · cut 2 @ -38% · step +3.0u

## R4_mlb

Base: n=146 · 91–55 · +108.6u · ROI +16.5%
Noise floor (random 20% cut ΔPnL): mean -23.6u · p95 **17.9u** · p99 24.4u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | expGap≥7 | 4 0–4 -100% -18.8u | +20% | +18.8u | +0.9 | 1/1 |
| 2  ○ | expGap ≥ 7.08 | 4 0–4 -100% -18.8u | +20% | +18.8u | +0.9 | 1/1 |
| 3  ○ | expGap ≥ 6.684 | 6 1–5 -61% -18.5u | +20% | +18.5u | +0.6 | 1/1 |
| 4  ◆ | (leadShare≥0.83)∧(EDGE<13.5) | 23 10–13 -19% -18.2u | +23% | +18.2u | +0.3 | 3/3✓ |
| 5  · | (EDGE<11.9)∧(odds<-118) | 8 3–5 -49% -16.7u | +20% | +16.7u | -1.2 | 1/1 |
| 6  · | (ticketEv<-1)∧(EDGE≥15) | 3 0–3 -100% -16.2u | +19% | +16.2u | -1.7 | 1/1 |
| 7  · | (ticketEv<-1.5)∧(EDGE≥15) | 3 0–3 -100% -16.2u | +19% | +16.2u | -1.7 | 1/1 |
| 8  · | (ticketEv<-1.5)∧(EDGE≥15.6) | 3 0–3 -100% -16.2u | +19% | +16.2u | -1.7 | 1/1 |
| 9  · | (ticketEv<-0.1)∧(EDGE≥15.6) | 3 0–3 -100% -16.2u | +19% | +16.2u | -1.7 | 1/1 |
| 10  · | (leadShare≥0.83)∧(EDGE<11.9) | 15 6–9 -24% -15.3u | +21% | +15.3u | -2.6 | 1/1 |
| 11  · | SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 | 3 0–3 -100% -15.0u | +19% | +15.0u | -2.9 | 1/1 |
| 12  · | expGap ≥ 7.117 | 3 0–3 -100% -14.8u | +19% | +14.8u | -3.1 | 1/1 |
| 13  · | expGap≥6.5 | 7 2–5 -41% -14.6u | +20% | +14.6u | -3.3 | 1/1 |
| 14  · | expGap ≥ 6.667 | 7 2–5 -41% -14.6u | +20% | +14.6u | -3.3 | 1/1 |
| 15  · | (leadShare≥0.83)∧(EDGE<11.3) | 10 3–7 -35% -14.5u | +20% | +14.5u | -3.4 | 1/1 |
| 16  · | RANK∧MLB∧unopp∧fav∧SRmid | 9 3–6 -40% -14.4u | +20% | +14.4u | -3.5 | 1/1 |
| 17  · | boost ∧ ticketEv<-1.5 | 4 1–3 -62% -13.3u | +19% | +13.3u | -4.6 | 1/1 |
| 18  · | ticketEv<-1.5 | 4 1–3 -62% -13.3u | +19% | +13.3u | -4.6 | 1/1 |
| 19  · | ticketEv < -1.5 | 4 1–3 -62% -13.3u | +19% | +13.3u | -4.6 | 1/1 |
| 20  · | (ticketEv<-1.5)∧(EDGE≥10.4) | 4 1–3 -62% -13.3u | +19% | +13.3u | -4.6 | 1/1 |

**Greedy stack** → total Δ **+72.9u** · keep n=120 · 85–35 · +181.5u · ROI +33.3%
- expGap≥7 · cut 4 @ -100% · step +18.8u
- (EDGE<11.9)∧(odds<-118) · cut 8 @ -49% · step +16.7u
- SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 · cut 3 @ -100% · step +15.0u
- RANK∧MLB∧unopp∧fav∧SRmid · cut 9 @ -40% · step +14.4u
- chalk≤-200 · cut 2 @ -100% · step +8.0u

## R4_nt

Base: n=158 · 103–55 · +126.3u · ROI +17.1%
Noise floor (random 20% cut ΔPnL): mean -26.6u · p95 **7.6u** · p99 25.3u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | (ticketEv<-1)∧(EDGE≥15) | 7 1–6 -74% -28.1u | +22% | +28.1u | +20.5 | 1/1 |
| 2  ○ | (ticketEv<-1.0)∧(EDGE≥15.4) | 7 1–6 -74% -28.1u | +22% | +28.1u | +20.5 | 1/1 |
| 3  ○ | (ticketEv<-1.0)∧(EDGE≥13.1) | 8 2–6 -58% -25.2u | +22% | +25.2u | +17.6 | 1/1 |
| 4  ○ | (ticketEv<-1.5)∧(EDGE≥15) | 6 1–5 -70% -22.7u | +21% | +22.7u | +15.1 | 1/1 |
| 5  ○ | (ticketEv<-1.0)∧(EDGE≥19.7) | 6 1–5 -70% -22.7u | +21% | +22.7u | +15.1 | 1/1 |
| 6  ○ | boost ∧ ticketEv<-1.5 | 7 2–5 -52% -19.8u | +21% | +19.8u | +12.2 | 1/1 |
| 7  ○ | SHARP ∧ ticketEv<-1 | 7 2–5 -52% -19.8u | +21% | +19.8u | +12.2 | 1/1 |
| 8  ○ | boost ∧ ticketEv<-1 | 9 3–6 -39% -19.1u | +21% | +19.1u | +11.5 | 1/1 |
| 9  ○ | (ticketEv<-1)∧(EDGE≥12) | 9 3–6 -39% -19.1u | +21% | +19.1u | +11.5 | 1/1 |
| 10  ○ | (ticketEv<-1.0)∧(EDGE≥11.8) | 9 3–6 -39% -19.1u | +21% | +19.1u | +11.5 | 1/1 |
| 11  ○ | expGap ≥ 6.667 | 12 4–8 -30% -19.0u | +22% | +19.0u | +11.4 | 1/1 |
| 12  ○ | (ticketEv<-0.3)∧(EDGE≥15.4) | 9 3–6 -38% -18.4u | +21% | +18.4u | +10.8 | 1/1 |
| 13  ○ | (EDGE<11.8)∧(odds<-126) | 7 2–5 -59% -17.7u | +20% | +17.7u | +10.1 | 1/1 |
| 14  ○ | (ticketEv<-1.9)∧(EDGE≥15.4) | 5 1–4 -64% -17.3u | +20% | +17.3u | +9.7 | 1/1 |
| 15  ○ | expGap≥7 | 8 2–6 -42% -17.1u | +21% | +17.1u | +9.5 | 1/1 |
| 16  ○ | (ticketEv<-2.6)∧(EDGE≥15.4) | 3 0–3 -100% -16.2u | +20% | +16.2u | +8.6 | 1/1 |
| 17  ○ | (ticketEv<-0.3)∧(EDGE≥13.1) | 10 4–6 -29% -15.5u | +21% | +15.5u | +7.9 | 1/1 |
| 18  ○ | SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 | 3 0–3 -100% -15.0u | +20% | +15.0u | +7.4 | 1/1 |
| 19  ○ | ticketEv<-1.5 | 8 3–5 -35% -14.9u | +20% | +14.9u | +7.3 | 1/1 |
| 20  ○ | (roiNorm<23.0)∧(leadSR<0.33) | 8 3–5 -39% -14.8u | +20% | +14.8u | +7.2 | 1/1 |

**Greedy stack** → total Δ **+90.0u** · keep n=124 · 94–30 · +216.3u · ROI +37.2%
- (ticketEv<-1)∧(EDGE≥15) · cut 7 @ -74% · step +28.1u
- (EDGE<11.8)∧(odds<-126) · cut 7 @ -59% · step +17.7u
- SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 · cut 3 @ -100% · step +15.0u
- (roiNorm<23.0)∧(leadSR<0.33) · cut 8 @ -39% · step +14.8u
- RANK∧MLB∧unopp∧fav∧SRmid · cut 9 @ -40% · step +14.4u

## R4_top

Base: n=41 · 31–10 · +50.7u · ROI +26.1%
Noise floor (random 20% cut ΔPnL): mean -12.0u · p95 **5.5u** · p99 8.2u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | (EDGE<23.0)∧(leadSR≥2.28) | 2 0–2 -100% -10.8u | +34% | +10.8u | +5.3 | 0/0 |
| 2  ○ | (EDGE<23.0)∧(leadSR≥2.00) | 3 1–2 -59% -8.7u | +33% | +8.7u | +3.2 | 0/0 |

**Greedy stack** → total Δ **+18.4u** · keep n=28 · 26–2 · +69.1u · ROI +54.2%
- (EDGE<23.0)∧(leadSR≥2.28) · cut 2 @ -100% · step +10.8u
- odds>-110 · cut 9 @ -9% · step +3.9u
- (EDGE≥23.0)∧(leadSR<1.82) · cut 2 @ -34% · step +3.7u

## R4_ev

Base: n=27 · 16–11 · +6.1u · ROI +4.3%
Noise floor (random 20% cut ΔPnL): mean -1.5u · p95 **15.0u** · p99 24.7u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | (ticketEv<-1)∧(EDGE≥15) | 12 4–8 -50% -32.5u | +49% | +32.5u | +17.5 | 1/1 |
| 2  ○ | (ticketEv<-1.0)∧(EDGE≥15.1) | 12 4–8 -50% -32.5u | +49% | +32.5u | +17.5 | 1/1 |
| 3  ○ | (ticketEv<-1.0)∧(EDGE≥13.1) | 13 5–8 -42% -29.6u | +48% | +29.6u | +14.6 | 1/1 |
| 4  ○ | (ticketEv<-1.5)∧(EDGE≥15) | 11 4–7 -46% -27.1u | +39% | +27.1u | +12.1 | 1/1 |
| 5  ○ | (ticketEv<-1.5)∧(EDGE≥15.1) | 11 4–7 -46% -27.1u | +39% | +27.1u | +12.1 | 1/1 |
| 6  ○ | (ticketEv<-1.0)∧(EDGE≥16.7) | 11 4–7 -46% -27.1u | +39% | +27.1u | +12.1 | 1/1 |
| 7  ○ | boost ∧ ticketEv<-1.5 | 12 5–7 -37% -24.2u | +38% | +24.2u | +9.2 | 1/1 |
| 8  ○ | (ticketEv<-1.5)∧(EDGE≥13.1) | 12 5–7 -37% -24.2u | +38% | +24.2u | +9.2 | 1/1 |
| 9  ○ | boost ∧ ticketEv<-1 | 14 6–8 -31% -23.5u | +44% | +23.5u | +8.5 | 1/1 |
| 10  ○ | (ticketEv<-1)∧(EDGE≥12) | 14 6–8 -31% -23.5u | +44% | +23.5u | +8.5 | 1/1 |
| 11  ○ | (ticketEv<-1.5)∧(EDGE≥16.7) | 10 4–6 -40% -21.7u | +31% | +21.7u | +6.7 | 1/1 |
| 12  ○ | (ticketEv<-2.5)∧(EDGE≥15.1) | 4 0–4 -100% -21.6u | +23% | +21.6u | +6.6 | 1/1 |
| 13  ○ | (ticketEv<-2.5)∧(EDGE≥16.7) | 4 0–4 -100% -21.6u | +23% | +21.6u | +6.6 | 1/1 |
| 14  ○ | (ticketEv<-1.0)∧(EDGE≥22.7) | 8 3–5 -48% -20.6u | +26% | +20.6u | +5.6 | 1/1 |
| 15  ○ | SHARP ∧ ticketEv<-1 | 7 2–5 -52% -19.8u | +24% | +19.8u | +4.7 | 1/1 |
| 16  ○ | expGap ≥ 6.667 | 14 5–9 -26% -19.5u | +37% | +19.5u | +4.5 | 1/1 |
| 17  ○ | ticketEv<-1.5 | 13 6–7 -28% -19.3u | +34% | +19.3u | +4.3 | 1/1 |
| 18  ○ | ticketEv < -1.5 | 13 6–7 -28% -19.3u | +34% | +19.3u | +4.3 | 1/1 |
| 19  ○ | (leadShare≥0.09)∧(EDGE≥13.1) | 22 11–11 -16% -18.9u | +93% | +18.9u | +3.8 | 1/1 |
| 20  ○ | (ticketEv<-2.5)∧(EDGE≥13.1) | 5 1–4 -69% -18.7u | +21% | +18.7u | +3.7 | 1/1 |

**Greedy stack** → total Δ **+45.7u** · keep n=11 · 11–0 · +51.8u · ROI +87.2%
- (ticketEv<-1)∧(EDGE≥15) · cut 12 @ -50% · step +32.5u
- steamDiv ≥ 1.56 · cut 4 @ -66% · step +13.1u

## R4_b

Base: n=56 · 43–13 · +91.9u · ROI +29.4%
Noise floor (random 20% cut ΔPnL): mean -20.0u · p95 **4.5u** · p99 17.2u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | (ticketEv<-1)∧(EDGE≥15) | 12 4–8 -50% -32.5u | +50% | +32.5u | +28.0 | 1/1 |
| 2  ○ | (ticketEv<-1.0)∧(EDGE≥15.4) | 12 4–8 -50% -32.5u | +50% | +32.5u | +28.0 | 1/1 |
| 3  ○ | (ticketEv<-1.0)∧(EDGE≥13.5) | 13 5–8 -42% -29.6u | +50% | +29.6u | +25.1 | 1/1 |
| 4  ○ | (ticketEv<-1.5)∧(EDGE≥15) | 11 4–7 -46% -27.1u | +47% | +27.1u | +22.6 | 1/1 |
| 5  ○ | boost ∧ ticketEv<-1.5 | 12 5–7 -37% -24.2u | +47% | +24.2u | +19.7 | 1/1 |
| 6  ○ | ticketEv<-1.5 | 12 5–7 -37% -24.2u | +47% | +24.2u | +19.7 | 1/1 |
| 7  ○ | boost ∧ ticketEv<-1 | 14 6–8 -31% -23.5u | +49% | +23.5u | +19.1 | 1/1 |
| 8  ○ | ticketEv<-1 | 14 6–8 -31% -23.5u | +49% | +23.5u | +19.1 | 1/1 |
| 9  ○ | (ticketEv<-1)∧(EDGE≥12) | 14 6–8 -31% -23.5u | +49% | +23.5u | +19.1 | 1/1 |
| 10  ○ | ticketEv < -1 | 14 6–8 -31% -23.5u | +49% | +23.5u | +19.1 | 1/1 |
| 11  ○ | (ticketEv<-1.6)∧(EDGE≥15.4) | 10 4–6 -40% -21.7u | +44% | +21.7u | +17.2 | 1/1 |
| 12  ○ | (ticketEv<-1.0)∧(EDGE≥17.6) | 10 4–6 -40% -21.7u | +44% | +21.7u | +17.2 | 1/1 |
| 13  ○ | (ticketEv<-2.5)∧(EDGE≥15.4) | 4 0–4 -100% -21.6u | +39% | +21.6u | +17.1 | 1/1 |
| 14  ○ | (ticketEv<-1.0)∧(EDGE≥22.7) | 8 3–5 -48% -20.6u | +42% | +20.6u | +16.1 | 1/1 |
| 15  ○ | SHARP ∧ ticketEv<-1 | 7 2–5 -52% -19.8u | +41% | +19.8u | +15.3 | 1/1 |
| 16  ○ | ticketEv < -1.6 | 11 5–6 -32% -18.8u | +44% | +18.8u | +14.3 | 1/1 |
| 17  ○ | (ticketEv<-1.6)∧(EDGE≥13.5) | 11 5–6 -32% -18.8u | +44% | +18.8u | +14.3 | 1/1 |
| 18  ○ | ticketEv < -2.5 | 5 1–4 -69% -18.7u | +39% | +18.7u | +14.2 | 1/1 |
| 19  ○ | (ticketEv<-2.5)∧(EDGE≥13.5) | 5 1–4 -69% -18.7u | +39% | +18.7u | +14.2 | 1/1 |
| 20  ○ | (ticketEv<-2.2)∧(EDGE≥15.4) | 6 2–4 -51% -16.6u | +39% | +16.6u | +12.2 | 1/1 |

**Greedy stack** → total Δ **+32.5u** · keep n=44 · 39–5 · +124.4u · ROI +50.2%
- (ticketEv<-1)∧(EDGE≥15) · cut 12 @ -50% · step +32.5u

## WALL

Base: n=623 · 340–283 · +79.9u · ROI +4.3%
Noise floor (random 20% cut ΔPnL): mean -4.0u · p95 **47.9u** · p99 98.5u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  · | (leadShare≥0.26)∧(EDGE<2.4) | 103 45–58 -25% -40.8u | +7% | +40.8u | -7.1 | 3/5✓ |
| 2  · | (ticketEv<-1)∧(EDGE≥15) | 15 5–10 -51% -40.6u | +7% | +40.6u | -7.4 | 1/1 |
| 3  · | EDGE < 9.59 | 271 132–139 -8% -40.4u | +9% | +40.4u | -7.5 | 4/5✓ |
| 4  · | sub4 ∧ maxSR<1 | 83 31–52 -29% -40.1u | +7% | +40.1u | -7.8 | 5/6✓ |
| 5  · | (EDGE<9.6)∧(odds≥-136) | 216 97–119 -11% -40.0u | +8% | +40.0u | -7.9 | 3/5✓ |
| 6  · | (EDGE<9.6)∧(odds≥-118) | 192 84–108 -12% -38.3u | +8% | +38.3u | -9.6 | 3/5✓ |
| 7  · | (EDGE<9.6)∧(odds≥-174) | 241 112–129 -9% -36.7u | +8% | +36.7u | -11.2 | 3/5✓ |
| 8  · | (EDGE<9.6)∧(odds≥-110) | 168 71–97 -13% -36.2u | +7% | +36.2u | -11.7 | 4/5✓ |
| 9  · | (leadShare≥0.48)∧(EDGE<2.4) | 90 39–51 -25% -36.1u | +7% | +36.1u | -11.8 | 3/5✓ |
| 10  · | tapeScore < 0.92 | 143 67–76 -14% -35.8u | +7% | +35.8u | -12.1 | 4/5✓ |
| 11  · | (ticketEv<-1.5)∧(EDGE≥15) | 14 5–9 -47% -35.2u | +7% | +35.2u | -12.8 | 1/1 |
| 12  · | (leadShare≥0.14)∧(EDGE<2.4) | 120 56–64 -18% -34.6u | +7% | +34.6u | -13.3 | 3/5✓ |
| 13  · | ticketEv<-1 | 43 18–25 -26% -33.8u | +7% | +33.8u | -14.1 | 1/1 |
| 14  · | (leadShare≥0.26)∧(EDGE<5.7) | 153 71–82 -13% -33.5u | +7% | +33.5u | -14.4 | 3/5✓ |
| 15  · | (EDGE<9.6)∧(leadSR≥0.60) | 226 112–114 -8% -33.5u | +8% | +33.5u | -14.4 | 3/5✓ |
| 16  · | (leadShare≥0.26)∧(EDGE<0.7) | 74 32–42 -28% -33.3u | +7% | +33.3u | -14.6 | 3/4✓ |
| 17  · | (leadShare≥0.26)∧(EDGE<9.6) | 203 98–105 -9% -32.7u | +8% | +32.7u | -15.2 | 3/5✓ |
| 18  · | (EDGE<2.4)∧(odds≥-174) | 130 59–71 -15% -32.3u | +7% | +32.3u | -15.6 | 3/5✓ |
| 19  · | ticketEv<-1.5 | 31 13–18 -30% -32.2u | +6% | +32.2u | -15.8 | 1/1 |
| 20  · | (EDGE<2.4)∧(odds≥-118) | 109 47–62 -18% -31.9u | +7% | +31.9u | -16.0 | 3/5✓ |

**Greedy stack** → total Δ **+142.3u** · keep n=350 · 220–130 · +222.2u · ROI +18.9%
- (leadShare≥0.26)∧(EDGE<2.4) · cut 103 @ -25% · step +40.8u
- (ticketEv<-1)∧(EDGE≥15) · cut 15 @ -51% · step +40.6u
- sub4 ∧ maxSR<1 · cut 67 @ -25% · step +29.7u
- (roiNorm≥40.9)∧(leadSR≥2.34) · cut 85 @ -6% · step +16.2u
- SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 · cut 3 @ -100% · step +15.0u

## WALL_r

Base: n=457 · 269–188 · +169.0u · ROI +12.0%
Noise floor (random 20% cut ΔPnL): mean -18.0u · p95 **25.5u** · p99 50.0u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ○ | (ticketEv<-1)∧(EDGE≥15) | 12 4–8 -50% -32.5u | +15% | +32.5u | +7.0 | 1/1 |
| 2  ○ | (ticketEv<-1.5)∧(EDGE≥15) | 11 4–7 -46% -27.1u | +15% | +27.1u | +1.6 | 1/1 |
| 3  · | boost ∧ ticketEv<-1.5 | 12 5–7 -37% -24.2u | +14% | +24.2u | -1.3 | 1/1 |
| 4  · | boost ∧ ticketEv<-1 | 14 6–8 -31% -23.5u | +14% | +23.5u | -1.9 | 1/1 |
| 5  · | (ticketEv<-1)∧(EDGE≥12) | 14 6–8 -31% -23.5u | +14% | +23.5u | -1.9 | 1/1 |
| 6  · | (ticketEv<-1.3)∧(EDGE≥11.3) | 14 6–8 -31% -23.5u | +14% | +23.5u | -1.9 | 1/1 |
| 7  · | (ticketEv<-1.3)∧(EDGE≥0.4) | 28 13–15 -21% -20.6u | +14% | +20.6u | -4.9 | 1/1 |
| 8  · | ticketEv<-1 | 36 17–19 -18% -19.8u | +15% | +19.8u | -5.7 | 1/1 |
| 9  · | SHARP ∧ ticketEv<-1 | 10 4–6 -47% -19.6u | +14% | +19.6u | -5.9 | 1/1 |
| 10  · | (ticketEv<-1.3)∧(EDGE≥-0.6) | 30 14–16 -19% -19.3u | +14% | +19.3u | -6.1 | 1/1 |
| 11  · | ticketEv < -1.3 | 32 15–17 -18% -19.2u | +14% | +19.2u | -6.3 | 1/1 |
| 12  · | (ticketEv<-1.6)∧(EDGE≥11.3) | 11 5–6 -32% -18.8u | +14% | +18.8u | -6.7 | 1/1 |
| 13  · | ticketEv<-1.5 | 24 12–12 -21% -18.1u | +14% | +18.1u | -7.3 | 1/1 |
| 14  · | (ticketEv<-1.3)∧(EDGE≥2.2) | 24 11–13 -19% -17.8u | +14% | +17.8u | -7.7 | 1/1 |
| 15  · | expGap≥7 | 10 3–7 -34% -17.7u | +14% | +17.7u | -7.7 | 1/1 |
| 16  · | (ticketEv<-1.3)∧(EDGE≥5.3) | 18 9–9 -19% -16.6u | +14% | +16.6u | -8.9 | 1/1 |
| 17  · | (ticketEv<-0.6)∧(EDGE≥-0.6) | 40 18–22 -12% -15.9u | +14% | +15.9u | -9.6 | 1/1 |
| 18  · | SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 | 3 0–3 -100% -15.0u | +13% | +15.0u | -10.5 | 1/1 |
| 19  · | SHARP∧MLB | 32 14–18 -12% -14.4u | +14% | +14.4u | -11.0 | 4/5✓ |
| 20  · | ticketEv < -0.6 | 44 21–23 -11% -14.3u | +14% | +14.3u | -11.1 | 1/1 |

**Greedy stack** → total Δ **+81.3u** · keep n=343 · 214–129 · +250.3u · ROI +22.1%
- (ticketEv<-1)∧(EDGE≥15) · cut 12 @ -50% · step +32.5u
- SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5 · cut 3 @ -100% · step +15.0u
- steamSO ≥ 3.06 · cut 23 @ -34% · step +14.0u
- RANK∧MLB∧unopp∧fav∧SRmid · cut 11 @ -26% · step +10.9u
- tapeScore < 0.452 · cut 65 @ -8% · step +8.9u

## SUB4

Base: n=377 · 186–191 · -27.3u · ROI -3.9%
Noise floor (random 20% cut ΔPnL): mean 3.3u · p95 **31.2u** · p99 65.9u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ◆ | leadShare < 0.97 | 243 115–128 -10% -44.1u | +7% | +44.1u | +12.8 | 5/6✓ |
| 2  ◆ | (slateN≥6)∧MLB | 264 123–141 -9% -40.9u | +6% | +40.9u | +9.7 | 3/6✓ |
| 3  ◆ | forRoiNormMean ≥ 28.1 | 284 132–152 -7% -40.8u | +9% | +40.8u | +9.6 | 4/5✓ |
| 4  ◆ | sub4 ∧ maxSR<1 | 83 31–52 -29% -40.1u | +2% | +40.1u | +8.9 | 5/6✓ |
| 5  ◆ | (EDGE≥0.0)∧(leadSR<1.56) | 122 52–70 -19% -39.0u | +2% | +39.0u | +7.8 | 5/5✓ |
| 6  ◆ | slateN ≥ 6 | 328 159–169 -7% -38.5u | +9% | +38.5u | +7.3 | 3/3✓ |
| 7  ◆ | (slateN≥6)∧(units<5.4) | 328 159–169 -7% -38.5u | +9% | +38.5u | +7.3 | 3/3✓ |
| 8  ◆ | leadSR < 1.21 | 129 57–72 -16% -38.5u | +2% | +38.5u | +7.3 | 5/6✓ |
| 9  ◆ | maxSR < 1.21 | 129 57–72 -16% -38.5u | +2% | +38.5u | +7.3 | 5/6✓ |
| 10  ◆ | leadShare < 1 | 263 125–138 -8% -37.7u | +5% | +37.7u | +6.5 | 4/6✓ |
| 11  ◆ | leadSR < 1.05 | 93 37–56 -23% -37.2u | +2% | +37.2u | +5.9 | 5/6✓ |
| 12  ◆ | maxSR < 1.05 | 93 37–56 -23% -37.2u | +2% | +37.2u | +5.9 | 5/6✓ |
| 13  ◆ | (EDGE≥0.0)∧(leadSR<1.21) | 87 34–53 -26% -36.8u | +2% | +36.8u | +5.5 | 4/5✓ |
| 14  ◆ | (EDGE≥-0.7)∧(leadSR<1.21) | 89 35–54 -25% -36.6u | +2% | +36.6u | +5.4 | 4/5✓ |
| 15  ◆ | leadSR < 1.56 | 187 89–98 -10% -36.4u | +3% | +36.4u | +5.2 | 5/6✓ |
| 16  ◆ | maxSR < 1.56 | 187 89–98 -10% -36.4u | +3% | +36.4u | +5.2 | 5/6✓ |
| 17  ◆ | (EDGE≥-0.7)∧(leadSR<1.56) | 126 55–71 -17% -36.0u | +2% | +36.0u | +4.7 | 5/5✓ |
| 18  ◆ | sumSR < 1.5 | 130 57–73 -15% -34.3u | +2% | +34.3u | +3.1 | 5/6✓ |
| 19  ◆ | EDGE ≥ -0.746 | 239 111–128 -8% -32.5u | +2% | +32.5u | +1.3 | 2/4✓ |
| 20  ◆ | SHARP∧MLB | 37 12–25 -39% -32.4u | +1% | +32.4u | +1.2 | 3/5✓ |

**Greedy stack** → total Δ **+75.5u** · keep n=51 · 39–12 · +48.2u · ROI +49.5%
- leadShare < 0.97 · cut 243 @ -10% · step +44.1u
- sumSR < 1.2 · cut 73 @ -19% · step +24.3u
- qConv < -0.868 · cut 8 @ -52% · step +4.2u
- edgePerUnit < -0.617 · cut 2 @ -100% · step +3.0u

## SUB4_r

Base: n=294 · 155–139 · +12.8u · ROI +2.3%
Noise floor (random 20% cut ΔPnL): mean -1.7u · p95 **24.1u** · p99 44.8u

| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |
|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|
| 1  ◆ | leadShare < 0.891 | 189 88–101 -11% -38.3u | +26% | +38.3u | +14.2 | 5/6✓ |
| 2  · | sumSR ≥ 5.63 | 75 33–42 -16% -22.2u | +8% | +22.2u | -2.0 | 5/6✓ |
| 3  · | sumSR ≥ 8.67 | 45 19–26 -25% -20.7u | +7% | +20.7u | -3.4 | 4/5✓ |
| 4  · | (roiNorm≥28.1)∧(leadSR≥2.18) | 119 55–64 -9% -18.8u | +9% | +18.8u | -5.3 | 4/6✓ |
| 5  · | leadShare < 0.98 | 219 108–111 -4% -18.4u | +22% | +18.4u | -5.8 | 5/6✓ |
| 6  · | (leadShare≥0.38)∧(EDGE<1.8) | 61 29–32 -20% -16.4u | +6% | +16.4u | -7.7 | 2/4✓ |
| 7  · | (EDGE≥-1.7)∧(leadSR≥2.18) | 85 37–48 -11% -16.0u | +7% | +16.0u | -8.2 | 4/5✓ |
| 8  · | SHARP∧MLB | 16 5–11 -41% -15.9u | +6% | +15.9u | -8.2 | 2/2✓ |
| 9  · | (EDGE≥-0.1)∧(leadSR≥2.18) | 74 33–41 -11% -15.5u | +7% | +15.5u | -8.6 | 4/5✓ |
| 10  · | netMeanPrior < -4.33 | 30 12–18 -31% -14.9u | +5% | +14.9u | -9.2 | 4/5✓ |
| 11  · | leadShare < 0.38 | 102 51–51 -8% -14.5u | +7% | +14.5u | -9.6 | 3/6✓ |
| 12  · | (leadShare≥0.20)∧(EDGE<1.8) | 73 36–37 -13% -14.2u | +6% | +14.2u | -10.0 | 2/4✓ |
| 13  · | (roiNorm≥35.1)∧(leadSR≥2.18) | 105 49–56 -7% -13.7u | +7% | +13.7u | -10.5 | 3/6✓ |
| 14  · | (slateN≥6)∧MLB | 199 98–101 -4% -13.5u | +14% | +13.5u | -10.6 | 3/6✓ |
| 15  · | (EDGE≥0.2)∧(leadSR≥2.18) | 68 30–38 -10% -12.5u | +6% | +12.5u | -11.7 | 5/5✓ |
| 16  · | (leadShare≥0.20)∧(EDGE<0.2) | 53 27–26 -16% -12.5u | +5% | +12.5u | -11.7 | 3/4✓ |
| 17  · | (leadShare≥0.38)∧(EDGE<0.2) | 43 21–22 -21% -12.3u | +5% | +12.3u | -11.8 | 3/4✓ |
| 18  · | leadSR ≥ 2.18 | 147 71–76 -5% -12.2u | +9% | +12.2u | -11.9 | 4/6✓ |
| 19  · | maxSR ≥ 2.18 | 147 71–76 -5% -12.2u | +9% | +12.2u | -11.9 | 4/6✓ |
| 20  · | (roiNorm≥28.1)∧(leadSR≥2.75) | 88 40–48 -7% -11.9u | +6% | +11.9u | -12.3 | 3/6✓ |

**Greedy stack** → total Δ **+46.7u** · keep n=79 · 56–23 · +59.5u · ROI +37.0%
- leadShare < 0.891 · cut 189 @ -11% · step +38.3u
- (EDGE<1.8)∧(odds≥-113) · cut 21 @ -19% · step +5.2u
- SHARP · cut 5 @ -37% · step +3.3u

## Cross-universe consensus (residual only, Δ > noise)

| Rule | #univ | Appearances |
|------|------:|-------------|
| ○ (ticketEv<-1)∧(EDGE≥15) | 6 | R4○+33u, R4_aug○+33u, R4_nt○+28u, R4_ev○+33u, R4_b○+33u, WALL_r○+33u |
| ○ (ticketEv<-1.5)∧(EDGE≥15) | 6 | R4○+27u, R4_aug○+27u, R4_nt○+23u, R4_ev○+27u, R4_b○+27u, WALL_r○+27u |
| ○ boost ∧ ticketEv<-1.5 | 5 | R4○+24u, R4_aug○+24u, R4_nt○+20u, R4_ev○+24u, R4_b○+24u |
| ○ boost ∧ ticketEv<-1 | 5 | R4○+24u, R4_aug○+24u, R4_nt○+19u, R4_ev○+24u, R4_b○+24u |
| ○ (ticketEv<-1)∧(EDGE≥12) | 5 | R4○+24u, R4_aug○+24u, R4_nt○+19u, R4_ev○+24u, R4_b○+24u |
| ○ (ticketEv<-1.0)∧(EDGE≥13.5) | 3 | R4○+30u, R4_aug○+30u, R4_b○+30u |
| ○ SHARP ∧ ticketEv<-1 | 4 | R4_aug○+20u, R4_nt○+20u, R4_ev○+20u, R4_b○+20u |
| ○ (ticketEv<-1.0)∧(EDGE≥15.1) | 2 | R4_aug○+33u, R4_ev○+33u |
| ○ (ticketEv<-1.0)∧(EDGE≥15.4) | 2 | R4_nt○+28u, R4_b○+33u |
| ○ (ticketEv<-1.0)∧(EDGE≥13.1) | 2 | R4_nt○+25u, R4_ev○+30u |
| ○ (ticketEv<-1.0)∧(EDGE≥16.7) | 2 | R4○+27u, R4_ev○+27u |
| ○ (ticketEv<-1.5)∧(EDGE≥15.1) | 2 | R4_aug○+27u, R4_ev○+27u |
| ○ (ticketEv<-1.5)∧(EDGE≥13.5) | 2 | R4○+24u, R4_aug○+24u |
| ○ ticketEv<-1.5 | 2 | R4_aug○+19u, R4_b○+24u |
| ○ (ticketEv<-1.5)∧(EDGE≥16.7) | 2 | R4○+22u, R4_ev○+22u |
| ○ (ticketEv<-2.5)∧(EDGE≥16.7) | 2 | R4○+22u, R4_ev○+22u |
| ○ (ticketEv<-2.5)∧(EDGE≥15.1) | 2 | R4_aug○+22u, R4_ev○+22u |
| ○ (ticketEv<-1.0)∧(EDGE≥22.7) | 2 | R4_ev○+21u, R4_b○+21u |
| ○ expGap ≥ 6.667 | 2 | R4_aug○+20u, R4_nt○+19u |
| ○ expGap≥7 | 2 | R4_mlb○+19u, R4_nt○+17u |

## August CF on R4 (4u+ residual) — candidate mutes

### boost ∧ ticketEv<-1
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=14 · 6–8 · -23.5u · ROI -30.9% → keep n=62 · 48–14 · +104.6u · ROI +34.1% · **Δ +23.54u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-20 | L | 5.4 | TOP | MLB | 16.04 | 2.59 | -1.8 | -5.40 |
| 2026-08-20 | W | 5.4 | TOP | NFL | 25 | 2.26 | -1.9 | +4.82 |
| 2026-08-21 | L | 5.4 | SHARP | NFL | 22.700000000000003 | 0.84 | -1.5 | -5.40 |
| 2026-08-21 | L | 5.4 | SHARP-LEAN | NFL | 22.700000000000003 | 0.33 | -1.9 | -5.40 |
| 2026-08-22 | L | 5.4 | TOP | UFC | 17.564999999999998 | 2.42 | -1.6 | -5.40 |
| 2026-08-22 | W | 5.4 | TOP | UFC | 30.629999999999995 | 2.73 | -2.5 | +0.64 |
| 2026-08-22 | W | 5.4 | TOP | UFC | 38.445 | 2.64 | -2.2 | +0.92 |
| 2026-08-22 | W | 5.4 | SHARP | MLB | 13.530000000000001 | 0.03 | -7.1 | +2.90 |
| 2026-08-22 | W | 5.4 | SHARP-LEAN | NFL | 21.4 | 0.29 | -2.3 | +4.32 |
| 2026-08-24 | L | 5.4 | SHARP | WNBA | 17.125 | 1.61 | -5.2 | -5.40 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 28.559999999999995 | 2.50 | -3.2 | -5.40 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 36.64 | 1.10 | -11.4 | -5.40 |
| 2026-08-25 | L | 5.4 | MINI | WNBA | 25.979999999999997 | 1.82 | -2.6 | -5.40 |
| 2026-08-25 | W | 6 | SUPER | MLB | 12.475000000000001 | 4.93 | -1.5 | +6.06 |

### ticketEv<-1 (any units stamped)
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=15 · 7–8 · -18.6u · ROI -23.0% → keep n=61 · 47–14 · +99.7u · ROI +33.0% · **Δ +18.64u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-20 | L | 5.4 | TOP | MLB | 16.04 | 2.59 | -1.8 | -5.40 |
| 2026-08-20 | W | 5.4 | TOP | NFL | 25 | 2.26 | -1.9 | +4.82 |
| 2026-08-20 | W | 5 | RANK | WNBA | 10.967500000000001 | 4.86 | -2.7 | +4.90 |
| 2026-08-21 | L | 5.4 | SHARP | NFL | 22.700000000000003 | 0.84 | -1.5 | -5.40 |
| 2026-08-21 | L | 5.4 | SHARP-LEAN | NFL | 22.700000000000003 | 0.33 | -1.9 | -5.40 |
| 2026-08-22 | L | 5.4 | TOP | UFC | 17.564999999999998 | 2.42 | -1.6 | -5.40 |
| 2026-08-22 | W | 5.4 | TOP | UFC | 30.629999999999995 | 2.73 | -2.5 | +0.64 |
| 2026-08-22 | W | 5.4 | TOP | UFC | 38.445 | 2.64 | -2.2 | +0.92 |
| 2026-08-22 | W | 5.4 | SHARP | MLB | 13.530000000000001 | 0.03 | -7.1 | +2.90 |
| 2026-08-22 | W | 5.4 | SHARP-LEAN | NFL | 21.4 | 0.29 | -2.3 | +4.32 |
| 2026-08-24 | L | 5.4 | SHARP | WNBA | 17.125 | 1.61 | -5.2 | -5.40 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 28.559999999999995 | 2.50 | -3.2 | -5.40 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 36.64 | 1.10 | -11.4 | -5.40 |
| 2026-08-25 | L | 5.4 | MINI | WNBA | 25.979999999999997 | 1.82 | -2.6 | -5.40 |
| 2026-08-25 | W | 6 | SUPER | MLB | 12.475000000000001 | 4.93 | -1.5 | +6.06 |

### (ticketEv<-1)∧(EDGE≥15)
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=12 · 4–8 · -32.5u · ROI -50.2% → keep n=64 · 50–14 · +113.6u · ROI +35.7% · **Δ +32.51u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-20 | L | 5.4 | TOP | MLB | 16.04 | 2.59 | -1.8 | -5.40 |
| 2026-08-20 | W | 5.4 | TOP | NFL | 25 | 2.26 | -1.9 | +4.82 |
| 2026-08-21 | L | 5.4 | SHARP | NFL | 22.700000000000003 | 0.84 | -1.5 | -5.40 |
| 2026-08-21 | L | 5.4 | SHARP-LEAN | NFL | 22.700000000000003 | 0.33 | -1.9 | -5.40 |
| 2026-08-22 | L | 5.4 | TOP | UFC | 17.564999999999998 | 2.42 | -1.6 | -5.40 |
| 2026-08-22 | W | 5.4 | TOP | UFC | 30.629999999999995 | 2.73 | -2.5 | +0.64 |
| 2026-08-22 | W | 5.4 | TOP | UFC | 38.445 | 2.64 | -2.2 | +0.92 |
| 2026-08-22 | W | 5.4 | SHARP-LEAN | NFL | 21.4 | 0.29 | -2.3 | +4.32 |
| 2026-08-24 | L | 5.4 | SHARP | WNBA | 17.125 | 1.61 | -5.2 | -5.40 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 28.559999999999995 | 2.50 | -3.2 | -5.40 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 36.64 | 1.10 | -11.4 | -5.40 |
| 2026-08-25 | L | 5.4 | MINI | WNBA | 25.979999999999997 | 1.82 | -2.6 | -5.40 |

### expGap≥6.5
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=15 · 6–9 · -13.4u · ROI -16.8% → keep n=61 · 48–13 · +94.5u · ROI +31.2% · **Δ +13.44u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-20 | L | 5.4 | TOP | MLB | 16.04 | 2.59 | -1.8 | -5.40 |
| 2026-08-20 | L | 4 | MINI | MLB | 16.684999999999995 | 2.90 | 0.2 | -4.00 |
| 2026-08-20 | W | 5.4 | TOP | NFL | 25 | 2.26 | -1.9 | +4.82 |
| 2026-08-21 | L | 5.4 | SHARP | NFL | 22.700000000000003 | 0.84 | -1.5 | -5.40 |
| 2026-08-21 | L | 5.4 | SHARP-LEAN | NFL | 22.700000000000003 | 0.33 | -1.9 | -5.40 |
| 2026-08-21 | W | 5.4 | SHARP | WNBA | 20 | 1.28 | -1 | +5.14 |
| 2026-08-23 | W | 5.4 | SHARP | WNBA | 26.276666666666678 | 2.16 | 0 | +6.10 |
| 2026-08-23 | W | 6 | RANK | WNBA | 13.138333333333328 | 0.83 | -0.3 | +7.32 |
| 2026-08-25 | L | 6 | RANK | WNBA | 15.115000000000002 | 1.46 | -0.1 | -6.00 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 28.559999999999995 | 2.50 | -3.2 | -5.40 |
| 2026-08-25 | L | 5.4 | SHARP | MLB | 36.64 | 1.10 | -11.4 | -5.40 |
| 2026-08-25 | L | 5.4 | MINI | WNBA | 25.979999999999997 | 1.82 | -2.6 | -5.40 |
| 2026-08-25 | L | 4 | SHARP-LEAN | MLB | 13.069999999999993 | 0.19 | 4.9 | -4.00 |
| 2026-08-25 | W | 5.4 | SHARP | MLB | 15.427500000000002 | 2.19 | 0.7 | +3.86 |
| 2026-08-25 | W | 6 | RANK | MLB | 27.705000000000005 | 0.83 | -0.1 | +5.71 |

### SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=1 · 0–1 · -5.0u · ROI -100.0% → keep n=75 · 54–21 · +86.1u · ROI +22.8% · **Δ +5.00u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-02 | L | 5 | SHARP-LEAN | MLB | 20.6 | 0.11 | — | -5.00 |

### RANK∧MLB∧unopp∧U<5.4
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=1 · 0–1 · -4.0u · ROI -100.0% → keep n=75 · 54–21 · +85.1u · ROI +22.5% · **Δ +4.05u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-01 | L | 4.05 | RANK | MLB | 5.950000000000003 | 0.85 | — | -4.05 |

### (leadShare≥0.82)∧(EDGE<12)
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=6 · 5–1 · +14.1u · ROI +55.4% → keep n=70 · 49–21 · +67.0u · ROI +18.7% · **Δ -14.09u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-01 | L | 4.05 | RANK | MLB | 5.950000000000003 | 0.85 | — | -4.05 |
| 2026-08-01 | W | 4 | MINI | MLB | 10.399999999999999 | 1.09 | — | +3.60 |
| 2026-08-04 | W | 4 | SHARP-LEAN | MLB | 11.300000000000004 | 0.60 | — | +3.64 |
| 2026-08-13 | W | 5.4 | SHARP-LEAN | WNBA | 11.25 | 0.70 | — | +5.14 |
| 2026-08-17 | W | 4 | CONFIRMED-Q1 | MLB | 1.4766666666666737 | 2.88 | — | +4.76 |
| 2026-08-24 | W | 4 | SHARP-LEAN | MLB | 11.75 | 0.77 | 0 | +1.00 |

### TOP+ (residual)
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut ∅ → keep n=76 · 54–22 · +81.1u · ROI +21.2% · **Δ +0.00u**

### (EDGE<12)∧(odds<-126)
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=2 · 1–1 · -3.0u · ROI -37.9% → keep n=74 · 53–21 · +84.1u · ROI +22.4% · **Δ +3.05u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-01 | L | 4.05 | RANK | MLB | 5.950000000000003 | 0.85 | — | -4.05 |
| 2026-08-24 | W | 4 | SHARP-LEAN | MLB | 11.75 | 0.77 | 0 | +1.00 |

### (roiNorm<23)∧(leadSR<0.33)
Actual n=76 · 54–22 · +81.1u · ROI +21.2% → cut n=7 · 3–4 · -10.8u · ROI -32.2% → keep n=69 · 51–18 · +91.9u · ROI +26.3% · **Δ +10.80u**

| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |
|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|
| 2026-08-04 | L | 4 | SHARP-LEAN | MLB | 12.300000000000004 | 0.29 | — | -4.00 |
| 2026-08-05 | L | 4 | SHARP-LEAN | MLB | 14.475000000000001 | 0.22 | — | -4.00 |
| 2026-08-05 | W | 5.4 | SHARP | MLB | 16.700000000000003 | 0.19 | — | +4.39 |
| 2026-08-08 | W | 5.4 | SHARP | UFC | 34.2 | 0.27 | — | +0.57 |
| 2026-08-08 | W | 5.4 | SHARP | UFC | 38.2 | 0.23 | — | +1.64 |
| 2026-08-16 | L | 5.4 | SHARP | WNBA | 40.86 | 0.22 | — | -5.40 |
| 2026-08-25 | L | 4 | SHARP-LEAN | MLB | 13.069999999999993 | 0.19 | 4.9 | -4.00 |

## Toxic signatures on R4

| Signature | n | W–L | PnL | ROI |
|-----------|--:|:---:|----:|----:|
| RANK·MLB·U<5.4·E?·SRmid·unopp·fav·TOTAL | 4 | 0–4 | -16.0u | -100% |
| SHARP-LEAN·MLB·U<5.4·Emid·SR<1.5·both·fav·ML | 4 | 1–3 | -8.7u | -54% |

## Lead wallets still hurting on R4 (stamp id only)

| Lead | n | W–L | PnL | ROI |
|------|--:|:---:|----:|----:|
| `7923c4` | 7 | 2–5 | -15.8u | -49% |
| `621848` | 6 | 3–3 | -6.1u | -21% |
| `2f2a9e` | 4 | 2–2 | -3.1u | -18% |
| `705ba1` | 12 | 6–6 | -3.0u | -6% |

## CLEAR ANGLES — residual hurt organs (ranked)

See JSON for full rule tables. Human synthesis written by agent after run.

## CLEAR ANGLES — residual hurt organs (post A∪A2)

Universe context after shipped mute CF:
- 4u+ residual **R4**: 199 · +177u · **+19% ROI** (was +9% before mute)
- Kept TOP: 41 · **+26% ROI** · +51u — **path is healthy; stop cutting TOP**
- Whole book after A∪A2 + maxSR-sub4 CF: **+12% ROI** (from +4%)
- Sub-4 residual still soft: **+2.3% ROI**

### ○ Angle C⋆ — PRIMARY residual leak: priced-bad conviction (PAPER → ship candidate)
**CUT when `ticketEv < −1 AND EDGE ≥ 15`** (almost all are ≥5.4u BOOST).
- Consensus across **6 residual universes** · R4 Δ **+32.5u** · Aug CF **+32.5u** (12 cuts, 4–8, −50% ROI)
- Pattern: we size max because EDGE is screaming, market already moved against us (negative ticket EV)
- Twin: `boost ∧ ticketEv < −1` · Aug Δ **+23.5u** (looser, keeps more losers but also cuts a SUPER winner on 8/25)
- **Stamps only exist Aug20+** — one soft week of evidence. Paper 1–2 more weeks OR ship as post-created mute with tight EDGE≥15 fence
- Does **not** touch TOP geometry or other paths’ math — absolute-last overlay like crowded mute

### ○ Angle D — Overconfidence vs market (`expGap ≥ ~7`) (PAPER)
`expWin − implied ≥ 7` while still staking.
- MLB residual Δ ~+19u · Aug CF **+13.4u** but **cuts winners too** (WNBA SHARP/RANK)
- Correlated with Angle C on the worst days — prefer C⋆ as the cleaner stamp

### ◆ Angle F — Ghost conviction on 4u+ (INVESTIGATE / thin)
`(forRoiNormMean < ~23) ∧ (leadSR < ~0.5)` on R4
- Cut 7 · **−61% ROI · −20.6u** · **2/2 era stable** · above noise
- Mostly SHARP-LEAN MLB with high EDGE but **no size, no stamped quality**
- Aug CF **+10.8u** (7 cuts)
- Twin discrete poison: `SHARP-LEAN·MLB·E≥20·SR<1.5` · 3–4 tickets · **−15u pure**
- Candidate: mute SHARP-LEAN when `leadSR < 0.5` (or require min size) — path-conditional, not global

### · Angle G — Soft EDGE × chalk on non-TOP (CAUTION)
`(EDGE < ~12) ∧ (odds < −126)` 
- Shows in R4 greedy stack (+17u) and R4_nt (+18u)
- **August CF only +3u** — mostly dead in Aug residual
- Do **not** ship from Jun15+ alone; era-shifted

### ✗ Angle E FAIL — Solo leadShare × soft EDGE
`(leadShare ≥ 0.82) ∧ (EDGE < 12)` on R4 August: **Δ −14u** (would have cut winners)
- Multi-era on MLB residual still prints historically, but **August falsifies**
- Do not mute; maybe size-cap research only

### ◆ Sub-4 organ (still bleeding softly)
- Post maxSR mute residual: 294 · **+2.3% ROI**
- Inverse geometry vs TOP: **dispersed FOR share** (`leadShare < 0.89`) is the toxic mass; solo-lead sub-4 is the gold keep
- Not a clean 0u mute (would cut 189/294). Product implication: sub-4 wants **concentrated** leads, 4u+ TOP dies on **crowded** conviction — opposite ends of the same axis
- `sumSR ≥ ~6` on sub-4 residual also soft (−16% ROI) — pile-on without a true lead

### Toxic pockets still alive on R4
| Pocket | n | PnL | Note |
|--------|--:|----:|------|
| RANK·MLB·TOTAL·unopp·SRmid·fav | 4 | −16u | 0–4 pure — totals RANK without oppose |
| SHARP-LEAN·MLB·E mid/high·SR&lt;1.5 | 4 | −9u | ghost-conviction cousin |
| Lead `7923c4` | 7 | −16u | stamp-id concentration, not a live WR ban |

### Kept-TOP residual (do not touch)
41 tickets · 31–10 · **+26% ROI**. Remaining TOP leaks are n=2–3 noise. Path is fixed.

### Ranked next moves
1. **Paper hard:** Angle C⋆ `ticketEv<-1 ∧ EDGE≥15` on ≥4u (or BOOST-only) — biggest residual Δ, path-agnostic post-created mute
2. **Prototype:** SHARP-LEAN min `leadSR ≥ 0.5` (or mute ghost-conviction) — thin but pure
3. **Watch:** RANK MLB unopposed totals mid-SR — n=4, re-check at n≥10
4. **Never again this week:** more TOP cuts · leadShare soft-EDGE mute · global EDGE&lt;10 · extend maxSR to 4u+

