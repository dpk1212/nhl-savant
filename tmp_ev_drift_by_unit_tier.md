# Ev drift by unit tier — WR / ROI / PnL
_Generated 2026-08-26T16:49:15.699Z_

## What this answers
Is **first→lock ticketEv worsening** (drift) a real directional leak on WR/ROI/PnL across unit tiers — or a small-sample quirk of high-EDGE BOOST?

## Sample honesty
| Slice | n | Date span |
|-------|--:|-----------|
| ALL AGSU ≥1u with first+lock Ev | 95 | 2026-08-19 → 2026-08-25 |
| Residual (post TOP crowded mute) | 84 |
| Residual ∧ EDGE≥15 | 20 |
| Residual ∧ ≥5.4u | 22 |

Ev lifecycle stamps only exist ~Aug 19+. **One soft week.** Direction matters more than ship-readiness.

`dEv = lockEv − firstEv` (more negative = fair moved against the ticket / we overpay more by lock).
`fair=0` sentinel rows excluded. Shipped TOP crowded mute removed from residual universe.

## Compact scoreboard — dEv ≤ −1.5 cut vs base

Read across unit tiers. If drift is real, cut ROI should be worse than base and mute Δ should be positive **in the same direction** as stakes grow / EDGE rises.

| Unit tier | EDGE slice | base n · WR · ROI · PnL | cut n · WR · ROI · PnL | mute Δ | direction? |
|-----------|------------|-------------------------|------------------------|-------:|:----------:|
| <2u | any EDGE | 46 21–25 46% -13% -5.9u | 11 5–6 45% -23% -2.5u | +2.5u | YES ↓ |
| <2u | EDGE <15 | 46 21–25 46% -13% -5.9u | 11 5–6 45% -23% -2.5u | +2.5u | YES ↓ |
| 2–<4u | any EDGE | 13 7–6 54% -12% -4.6u | 3 1–2 33% -38% -3.5u | +3.5u | YES ↓ |
| 2–<4u | EDGE <15 | 13 7–6 54% -12% -4.6u | 3 1–2 33% -38% -3.5u | +3.5u | YES ↓ |
| 4–<5.4u | any EDGE | 3 1–2 33% -24% -3.1u | — | — | thin |
| 4–<5.4u | EDGE ≥15 | 1 0–1 0% -100% -4.0u | — | — | thin |
| 4–<5.4u | EDGE <15 | 2 1–1 50% +10% +0.9u | — | — | thin |
| ≥5.4u BOOST | any EDGE | 22 13–9 59% +4% +4.4u | 11 4–7 36% -34% -20.6u | +20.6u | YES ↓ |
| ≥5.4u BOOST | EDGE ≥15 | 19 10–9 53% -11% -11.9u | 9 2–7 22% -63% -30.8u | +30.8u | YES ↓ |
| ≥5.4u BOOST | EDGE <15 | 3 3–0 100% +94% +16.3u | 2 2–0 100% +90% +10.2u | -10.2u | NO / flat |
| ALL sub-4 | any EDGE | 59 28–31 47% -13% -10.5u | 14 6–8 43% -30% -5.9u | +5.9u | YES ↓ |
| ALL sub-4 | EDGE <15 | 59 28–31 47% -13% -10.5u | 14 6–8 43% -30% -5.9u | +5.9u | YES ↓ |
| ALL 4u+ | any EDGE | 25 14–11 56% +1% +1.3u | 11 4–7 36% -34% -20.6u | +20.6u | YES ↓ |
| ALL 4u+ | EDGE ≥15 | 20 10–10 50% -15% -15.9u | 9 2–7 22% -63% -30.8u | +30.8u | YES ↓ |
| ALL 4u+ | EDGE <15 | 5 4–1 80% +65% +17.2u | 2 2–0 100% +90% +10.2u | -10.2u | NO / flat |
| ALL ≥1u | any EDGE | 84 42–42 50% -4% -9.2u | 25 10–15 40% -33% -26.5u | +26.5u | YES ↓ |
| ALL ≥1u | EDGE ≥15 | 20 10–10 50% -15% -15.9u | 9 2–7 22% -63% -30.8u | +30.8u | YES ↓ |
| ALL ≥1u | EDGE <15 | 64 32–32 50% +6% +6.7u | 16 8–8 50% +14% +4.3u | -4.3u | NO / flat |

## Compact scoreboard — late poison (first≥−0.5 → lock<−1)

| Unit tier | EDGE slice | base | cut | mute Δ | direction? |
|-----------|------------|------|-----|-------:|:----------:|
| <2u | any EDGE | 46 21–25 46% -13% -5.9u | 6 1–5 17% -75% -4.5u | +4.5u | YES ↓ |
| <2u | EDGE <15 | 46 21–25 46% -13% -5.9u | 6 1–5 17% -75% -4.5u | +4.5u | YES ↓ |
| 2–<4u | any EDGE | 13 7–6 54% -12% -4.6u | 4 2–2 50% -10% -1.2u | +1.2u | NO / flat |
| 2–<4u | EDGE <15 | 13 7–6 54% -12% -4.6u | 4 2–2 50% -10% -1.2u | +1.2u | NO / flat |
| 4–<5.4u | any EDGE | 3 1–2 33% -24% -3.1u | — | — | thin |
| 4–<5.4u | EDGE ≥15 | 1 0–1 0% -100% -4.0u | — | — | thin |
| 4–<5.4u | EDGE <15 | 2 1–1 50% +10% +0.9u | — | — | thin |
| ≥5.4u BOOST | any EDGE | 22 13–9 59% +4% +4.4u | 7 1–6 14% -78% -29.5u | +29.5u | YES ↓ |
| ≥5.4u BOOST | EDGE ≥15 | 19 10–9 53% -11% -11.9u | 6 0–6 0% -100% -32.4u | +32.4u | YES ↓ |
| ≥5.4u BOOST | EDGE <15 | 3 3–0 100% +94% +16.3u | 1 1–0 100% +54% +2.9u | -2.9u | thin |
| ALL sub-4 | any EDGE | 59 28–31 47% -13% -10.5u | 10 3–7 30% -32% -5.7u | +5.7u | YES ↓ |
| ALL sub-4 | EDGE <15 | 59 28–31 47% -13% -10.5u | 10 3–7 30% -32% -5.7u | +5.7u | YES ↓ |
| ALL 4u+ | any EDGE | 25 14–11 56% +1% +1.3u | 7 1–6 14% -78% -29.5u | +29.5u | YES ↓ |
| ALL 4u+ | EDGE ≥15 | 20 10–10 50% -15% -15.9u | 6 0–6 0% -100% -32.4u | +32.4u | YES ↓ |
| ALL 4u+ | EDGE <15 | 5 4–1 80% +65% +17.2u | 1 1–0 100% +54% +2.9u | -2.9u | thin |
| ALL ≥1u | any EDGE | 84 42–42 50% -4% -9.2u | 17 4–13 24% -63% -35.2u | +35.2u | YES ↓ |
| ALL ≥1u | EDGE ≥15 | 20 10–10 50% -15% -15.9u | 6 0–6 0% -100% -32.4u | +32.4u | YES ↓ |
| ALL ≥1u | EDGE <15 | 64 32–32 50% +6% +6.7u | 11 4–7 36% -12% -2.8u | +2.8u | YES ↓ |

## Full ladder by unit tier (residual)

### <2u · any EDGE
Base: **46 · 21–25 · WR 46% · ROI -13% · -5.9u** · avgU 1.00

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 17 | 9–8 | 53% | -7% | -1.2u | +1.2u |
| ↳ keep if muted | 29 | 12–17 | 41% | -16% | -4.7u | — |
| dEv ≤ −1.5 | 11 | 5–6 | 45% | -23% | -2.5u | +2.5u |
| ↳ keep if muted | 35 | 16–19 | 46% | -10% | -3.4u | — |
| dEv ≤ −2 | 6 | 4–2 | 67% | +7% | +0.4u | -0.4u |
| ↳ keep if muted | 40 | 17–23 | 43% | -16% | -6.3u | — |
| late poison (first≥−0.5 → lock<−1) | 6 | 1–5 | 17% | -75% | -4.5u | +4.5u |
| ↳ keep if muted | 40 | 20–20 | 50% | -4% | -1.4u | — |
| improved/flat dEv > −1 | 29 | 12–17 | 41% | -16% | -4.7u | +4.7u |

### <2u · EDGE ≥15
_no tickets_

### <2u · EDGE <15
Base: **46 · 21–25 · WR 46% · ROI -13% · -5.9u** · avgU 1.00

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 17 | 9–8 | 53% | -7% | -1.2u | +1.2u |
| ↳ keep if muted | 29 | 12–17 | 41% | -16% | -4.7u | — |
| dEv ≤ −1.5 | 11 | 5–6 | 45% | -23% | -2.5u | +2.5u |
| ↳ keep if muted | 35 | 16–19 | 46% | -10% | -3.4u | — |
| dEv ≤ −2 | 6 | 4–2 | 67% | +7% | +0.4u | -0.4u |
| ↳ keep if muted | 40 | 17–23 | 43% | -16% | -6.3u | — |
| late poison (first≥−0.5 → lock<−1) | 6 | 1–5 | 17% | -75% | -4.5u | +4.5u |
| ↳ keep if muted | 40 | 20–20 | 50% | -4% | -1.4u | — |
| improved/flat dEv > −1 | 29 | 12–17 | 41% | -16% | -4.7u | +4.7u |

### 2–<4u · any EDGE
Base: **13 · 7–6 · WR 54% · ROI -12% · -4.6u** · avgU 2.85

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 4 | 2–2 | 50% | -10% | -1.2u | +1.2u |
| ↳ keep if muted | 9 | 5–4 | 56% | -13% | -3.3u | — |
| dEv ≤ −1.5 | 3 | 1–2 | 33% | -38% | -3.5u | +3.5u |
| ↳ keep if muted | 10 | 6–4 | 60% | -4% | -1.1u | — |
| dEv ≤ −2 | 3 | 1–2 | 33% | -38% | -3.5u | +3.5u |
| ↳ keep if muted | 10 | 6–4 | 60% | -4% | -1.1u | — |
| late poison (first≥−0.5 → lock<−1) | 4 | 2–2 | 50% | -10% | -1.2u | +1.2u |
| ↳ keep if muted | 9 | 5–4 | 56% | -13% | -3.3u | — |
| improved/flat dEv > −1 | 9 | 5–4 | 56% | -13% | -3.3u | +3.3u |

### 2–<4u · EDGE ≥15
_no tickets_

### 2–<4u · EDGE <15
Base: **13 · 7–6 · WR 54% · ROI -12% · -4.6u** · avgU 2.85

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 4 | 2–2 | 50% | -10% | -1.2u | +1.2u |
| ↳ keep if muted | 9 | 5–4 | 56% | -13% | -3.3u | — |
| dEv ≤ −1.5 | 3 | 1–2 | 33% | -38% | -3.5u | +3.5u |
| ↳ keep if muted | 10 | 6–4 | 60% | -4% | -1.1u | — |
| dEv ≤ −2 | 3 | 1–2 | 33% | -38% | -3.5u | +3.5u |
| ↳ keep if muted | 10 | 6–4 | 60% | -4% | -1.1u | — |
| late poison (first≥−0.5 → lock<−1) | 4 | 2–2 | 50% | -10% | -1.2u | +1.2u |
| ↳ keep if muted | 9 | 5–4 | 56% | -13% | -3.3u | — |
| improved/flat dEv > −1 | 9 | 5–4 | 56% | -13% | -3.3u | +3.3u |

### 4–<5.4u · any EDGE
Base: **3 · 1–2 · WR 33% · ROI -24% · -3.1u** · avgU 4.33

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 1 | 1–0 | 100% | +98% | +4.9u | -4.9u |
| ↳ keep if muted | 2 | 0–2 | 0% | -100% | -8.0u | — |
| dEv ≤ −1.5 | 0 | — | — | — | — | — |
| dEv ≤ −2 | 0 | — | — | — | — | — |
| late poison (first≥−0.5 → lock<−1) | 0 | — | — | — | — | — |
| improved/flat dEv > −1 | 2 | 0–2 | 0% | -100% | -8.0u | +8.0u |

### 4–<5.4u · EDGE ≥15
Base: **1 · 0–1 · WR 0% · ROI -100% · -4.0u** · avgU 4.00

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 0 | — | — | — | — | — |
| dEv ≤ −1.5 | 0 | — | — | — | — | — |
| dEv ≤ −2 | 0 | — | — | — | — | — |
| late poison (first≥−0.5 → lock<−1) | 0 | — | — | — | — | — |
| improved/flat dEv > −1 | 1 | 0–1 | 0% | -100% | -4.0u | +4.0u |

### 4–<5.4u · EDGE <15
Base: **2 · 1–1 · WR 50% · ROI +10% · +0.9u** · avgU 4.50

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 1 | 1–0 | 100% | +98% | +4.9u | -4.9u |
| ↳ keep if muted | 1 | 0–1 | 0% | -100% | -4.0u | — |
| dEv ≤ −1.5 | 0 | — | — | — | — | — |
| dEv ≤ −2 | 0 | — | — | — | — | — |
| late poison (first≥−0.5 → lock<−1) | 0 | — | — | — | — | — |
| improved/flat dEv > −1 | 1 | 0–1 | 0% | -100% | -4.0u | +4.0u |

### ≥5.4u BOOST · any EDGE
Base: **22 · 13–9 · WR 59% · ROI +4% · +4.4u** · avgU 5.54

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 12 | 4–8 | 33% | -40% | -26.6u | +26.6u |
| ↳ keep if muted | 10 | 9–1 | 90% | +55% | +30.9u | — |
| dEv ≤ −1.5 | 11 | 4–7 | 36% | -34% | -20.6u | +20.6u |
| ↳ keep if muted | 11 | 9–2 | 82% | +40% | +24.9u | — |
| dEv ≤ −2 | 8 | 3–5 | 38% | -24% | -10.7u | +10.7u |
| ↳ keep if muted | 14 | 10–4 | 71% | +19% | +15.1u | — |
| late poison (first≥−0.5 → lock<−1) | 7 | 1–6 | 14% | -78% | -29.5u | +29.5u |
| ↳ keep if muted | 15 | 12–3 | 80% | +40% | +33.9u | — |
| improved/flat dEv > −1 | 10 | 9–1 | 90% | +55% | +30.9u | -30.9u |

### ≥5.4u BOOST · EDGE ≥15
Base: **19 · 10–9 · WR 53% · ROI -11% · -11.9u** · avgU 5.49

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 10 | 2–8 | 20% | -67% | -36.8u | +36.8u |
| ↳ keep if muted | 9 | 8–1 | 89% | +50% | +24.9u | — |
| dEv ≤ −1.5 | 9 | 2–7 | 22% | -63% | -30.8u | +30.8u |
| ↳ keep if muted | 10 | 8–2 | 80% | +34% | +18.9u | — |
| dEv ≤ −2 | 6 | 1–5 | 17% | -65% | -20.9u | +20.9u |
| ↳ keep if muted | 13 | 9–4 | 69% | +12% | +9.0u | — |
| late poison (first≥−0.5 → lock<−1) | 6 | 0–6 | 0% | -100% | -32.4u | +32.4u |
| ↳ keep if muted | 13 | 10–3 | 77% | +28% | +20.5u | — |
| improved/flat dEv > −1 | 9 | 8–1 | 89% | +50% | +24.9u | -24.9u |

### ≥5.4u BOOST · EDGE <15
Base: **3 · 3–0 · WR 100% · ROI +94% · +16.3u** · avgU 5.80

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 2 | 2–0 | 100% | +90% | +10.2u | -10.2u |
| ↳ keep if muted | 1 | 1–0 | 100% | +101% | +6.1u | — |
| dEv ≤ −1.5 | 2 | 2–0 | 100% | +90% | +10.2u | -10.2u |
| ↳ keep if muted | 1 | 1–0 | 100% | +101% | +6.1u | — |
| dEv ≤ −2 | 2 | 2–0 | 100% | +90% | +10.2u | -10.2u |
| ↳ keep if muted | 1 | 1–0 | 100% | +101% | +6.1u | — |
| late poison (first≥−0.5 → lock<−1) | 1 | 1–0 | 100% | +54% | +2.9u | -2.9u |
| ↳ keep if muted | 2 | 2–0 | 100% | +112% | +13.4u | — |
| improved/flat dEv > −1 | 1 | 1–0 | 100% | +101% | +6.1u | -6.1u |

### ALL ≥1u · any EDGE
Base: **84 · 42–42 · WR 50% · ROI -4% · -9.2u** · avgU 2.59

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 34 | 16–18 | 47% | -24% | -24.1u | +24.1u |
| ↳ keep if muted | 50 | 26–24 | 52% | +13% | +14.9u | — |
| dEv ≤ −1.5 | 25 | 10–15 | 40% | -33% | -26.5u | +26.5u |
| ↳ keep if muted | 59 | 32–27 | 54% | +13% | +17.3u | — |
| dEv ≤ −2 | 17 | 8–9 | 47% | -23% | -13.7u | +13.7u |
| ↳ keep if muted | 67 | 34–33 | 51% | +3% | +4.6u | — |
| late poison (first≥−0.5 → lock<−1) | 17 | 4–13 | 24% | -63% | -35.2u | +35.2u |
| ↳ keep if muted | 67 | 38–29 | 57% | +16% | +26.0u | — |
| improved/flat dEv > −1 | 50 | 26–24 | 52% | +13% | +14.9u | -14.9u |

### ALL ≥1u · EDGE ≥15
Base: **20 · 10–10 · WR 50% · ROI -15% · -15.9u** · avgU 5.42

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 10 | 2–8 | 20% | -67% | -36.8u | +36.8u |
| ↳ keep if muted | 10 | 8–2 | 80% | +39% | +20.9u | — |
| dEv ≤ −1.5 | 9 | 2–7 | 22% | -63% | -30.8u | +30.8u |
| ↳ keep if muted | 11 | 8–3 | 73% | +25% | +14.9u | — |
| dEv ≤ −2 | 6 | 1–5 | 17% | -65% | -20.9u | +20.9u |
| ↳ keep if muted | 14 | 9–5 | 64% | +7% | +5.0u | — |
| late poison (first≥−0.5 → lock<−1) | 6 | 0–6 | 0% | -100% | -32.4u | +32.4u |
| ↳ keep if muted | 14 | 10–4 | 71% | +22% | +16.5u | — |
| improved/flat dEv > −1 | 10 | 8–2 | 80% | +39% | +20.9u | -20.9u |

### ALL ≥1u · EDGE <15
Base: **64 · 32–32 · WR 50% · ROI +6% · +6.7u** · avgU 1.71

| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |
|--------|--:|:---:|---:|----:|----:|---------------:|
| dEv ≤ −1 | 24 | 14–10 | 58% | +28% | +12.7u | -12.7u |
| ↳ keep if muted | 40 | 18–22 | 45% | -9% | -6.0u | — |
| dEv ≤ −1.5 | 16 | 8–8 | 50% | +14% | +4.3u | -4.3u |
| ↳ keep if muted | 48 | 24–24 | 50% | +3% | +2.4u | — |
| dEv ≤ −2 | 11 | 7–4 | 64% | +27% | +7.2u | -7.2u |
| ↳ keep if muted | 53 | 25–28 | 47% | -1% | -0.4u | — |
| late poison (first≥−0.5 → lock<−1) | 11 | 4–7 | 36% | -12% | -2.8u | +2.8u |
| ↳ keep if muted | 53 | 28–25 | 53% | +11% | +9.5u | — |
| improved/flat dEv > −1 | 40 | 18–22 | 45% | -9% | -6.0u | +6.0u |

## Ticket dump — residual ∧ EDGE≥15 ∧ dEv ≤ −1.5

| Date | u | Path | Sport | E | first | lock | dEv | W/L | PnL |
|------|--:|------|-------|--:|------:|-----:|----:|:--:|----:|
| 2026-08-20 | 5.4 | TOP | MLB | 16.0 | 0.5 | -1.3 | -1.8 | L | -5.40 |
| 2026-08-21 | 5.4 | SHARP | NFL | 22.7 | 0.4 | -1.1 | -1.5 | L | -5.40 |
| 2026-08-22 | 5.4 | TOP | UFC | 38.4 | -0.7 | -2.2 | -1.5 | W | +0.92 |
| 2026-08-22 | 5.4 | TOP | UFC | 17.6 | 1.5 | -2.8 | -4.3 | L | -5.40 |
| 2026-08-23 | 5.4 | SHARP | WNBA | 26.3 | 8.2 | -1.0 | -9.2 | W | +6.10 |
| 2026-08-24 | 5.4 | SHARP | WNBA | 17.1 | 2.1 | -8.1 | -10.2 | L | -5.40 |
| 2026-08-25 | 5.4 | SHARP | MLB | 28.6 | -1.2 | -3.2 | -2.0 | L | -5.40 |
| 2026-08-25 | 5.4 | SHARP | MLB | 36.6 | -0.2 | -11.4 | -11.2 | L | -5.40 |
| 2026-08-25 | 5.4 | MINI | WNBA | 26.0 | 1.4 | -2.6 | -4.0 | L | -5.40 |

## Ticket dump — residual ∧ EDGE≥15 ∧ late poison

| Date | u | Path | Sport | E | first | lock | dEv | W/L | PnL |
|------|--:|------|-------|--:|------:|-----:|----:|:--:|----:|
| 2026-08-20 | 5.4 | TOP | MLB | 16.0 | 0.5 | -1.3 | -1.8 | L | -5.40 |
| 2026-08-21 | 5.4 | SHARP | NFL | 22.7 | 0.4 | -1.1 | -1.5 | L | -5.40 |
| 2026-08-22 | 5.4 | TOP | UFC | 17.6 | 1.5 | -2.8 | -4.3 | L | -5.40 |
| 2026-08-24 | 5.4 | SHARP | WNBA | 17.1 | 2.1 | -8.1 | -10.2 | L | -5.40 |
| 2026-08-25 | 5.4 | SHARP | MLB | 36.6 | -0.2 | -11.4 | -11.2 | L | -5.40 |
| 2026-08-25 | 5.4 | MINI | WNBA | 26.0 | 1.4 | -2.6 | -4.0 | L | -5.40 |

## Directional read (auto)

On **EDGE≥15**, dEv≤−1.5 by unit tier:
- **4–<5.4u**: thin · cut — · mute Δ —
- **≥5.4u BOOST**: YES ↓ · cut 9 2–7 22% -63% -30.8u · mute Δ +30.8u

On **EDGE<15**, same rule (control — should be weak/flat/hurt):
- **<2u**: YES ↓ · cut 11 5–6 45% -23% -2.5u · mute Δ +2.5u
- **2–<4u**: YES ↓ · cut 3 1–2 33% -38% -3.5u · mute Δ +3.5u
- **4–<5.4u**: thin · cut — · mute Δ —
- **≥5.4u BOOST**: NO / flat · cut 2 2–0 100% +90% +10.2u · mute Δ -10.2u

High-E tiers showing YES ↓: **1/1** scored (excl thin). Low-E YES ↓: **2**.

### Interpretation guide
- If high-E shows YES ↓ across **multiple** unit tiers → drift is size-aware but not BOOST-only.
- If only ≥5.4u YES ↓ and sub-4 flat/thin → interaction is high-E × size, still usable as gated mute.
- If low-E also YES ↓ everywhere → broader cancel; product cost higher.
- Thin cells (n<2 cut) do not count as evidence either way.
