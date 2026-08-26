# TOP lead-wallet W vs L — thin / young / quality?
Generated: 2026-08-26T14:15:13.523Z
HC lead = FOR side + sport whitelistTier CONFIRMED + stamped sizeRatio ≥ 1.5

TOP ≥4u Jun15+: 88 · with identifiable HC lead: **71**
TOP ≥4u August: 17 · with lead: **15**
No-lead rate (can't resolve CONFIRMED+SR≥1.5 on stamp): 17 / 88

No-lead examples (first 8): 2026-06-16 Philadelphia Phillies hc=1-0 · 2026-06-16 Atlanta Braves hc=1-0 · 2026-06-18 Milwaukee Brewers hc=1-0 · 2026-06-19 Arizona Diamondbacks hc=1-2 · 2026-06-20 Philadelphia Phillies hc=1-0 · 2026-07-05 New York Yankees hc=1-0 · 2026-07-23 Detroit Tigers hc=1-0 · 2026-08-20 Chargers hc=1-0

## 1) Primary HC lead — continuous W vs L (all TOP ≥4u with lead)

| Feature (primary HC lead) | W n | W mean | W med | L n | L mean | L med | Δmean |
|---------------------------|----:|-------:|------:|----:|-------:|------:|------:|
| sport picks.n | 42 | 194.83 | 268.00 | 29 | 191.97 | 245.00 | +2.87 |
| sport positions.n | 42 | 306.40 | 290.00 | 29 | 285.07 | 290.00 | +21.34 |
| wallet age (days @ pick) | 42 | 23.14 | 22.00 | 29 | 29.48 | 28.00 | -6.34 |
| sport picks WR | 42 | 57.06 | 52.80 | 29 | 53.12 | 51.80 | +3.94 |
| sport pos WR | 42 | 55.61 | 53.80 | 29 | 55.27 | 53.80 | +0.33 |
| sport $ROI | 42 | 9.08 | 6.85 | 29 | 10.64 | 10.20 | -1.56 |
| sport flat ROI | 42 | 9.27 | 7.10 | 29 | 2.63 | 0.50 | +6.64 |
| global picks.n | 42 | 249.29 | 320.00 | 29 | 222.90 | 320.00 | +26.39 |
| global positions.n | 42 | 438.50 | 316.00 | 29 | 361.79 | 316.00 | +76.71 |
| global picks WR | 42 | 55.86 | 52.30 | 29 | 52.49 | 51.90 | +3.37 |
| global $ROI | 42 | 7.40 | 4.00 | 29 | 10.01 | 10.70 | -2.61 |
| lead sizeRatio | 42 | 2.72 | 2.26 | 29 | 2.82 | 2.58 | -0.10 |
| lead invested $ | 42 | 13327.62 | 6823.00 | 29 | 31274.76 | 5775.00 | -17947.14 |
| # HC leads on ticket | 42 | 1.10 | 1.00 | 29 | 1.17 | 1.00 | -0.08 |

## 2) Same features — August TOP only

| Feature (primary HC lead) | W n | W mean | W med | L n | L mean | L med | Δmean |
|---------------------------|----:|-------:|------:|----:|-------:|------:|------:|
| sport picks.n | 8 | 63.38 | 35.00 | 7 | 145.57 | 76.00 | -82.20 |
| sport positions.n | 8 | 63.63 | 28.00 | 7 | 171.00 | 79.00 | -107.38 |
| wallet age (days) | 8 | 29.13 | 32.00 | 7 | 39.14 | 34.00 | -10.02 |
| sport picks WR | 8 | 72.94 | 77.10 | 7 | 58.27 | 51.80 | +14.67 |
| sport $ROI | 8 | 8.76 | 3.80 | 7 | 9.36 | 10.20 | -0.59 |
| global picks.n | 8 | 75.75 | 35.00 | 7 | 177.43 | 106.00 | -101.68 |
| lead sizeRatio | 8 | 2.85 | 2.75 | 7 | 2.64 | 2.59 | +0.21 |
| # HC leads | 8 | 1.13 | 1.00 | 7 | 1.00 | 1.00 | +0.13 |

## 3) Binary flags — does thin/young/bad sport book separate?

### All TOP ≥4u with lead

| Flag on primary HC lead | Match n/W–L/ROI | Rest n/W–L/ROI |
|------------------------|-----------------|----------------|
| 🔴 sport picks.n < 8 | 2 1–1 -16% -1.5u | 69 41–28 -3% |
| 🔴 sport picks.n < 15 | 2 1–1 -16% -1.5u | 69 41–28 -3% |
| 🟢 sport positions.n < 20 | 1 1–0 +47% +2.5u | 70 41–29 -4% |
|    wallet age < 30d | 49 33–16 +14% +31.1u | 22 9–13 -38% |
|    wallet age < 60d | 67 40–27 -1% -3.5u | 4 2–2 -38% |
|    sole HC lead (leadN=1) | 63 38–25 -1% -1.9u | 8 4–4 -23% |
| 🔴 gap_enrichment lead | 5 3–2 -27% -7.4u | 66 39–27 -1% |
| 🔴 sport picks WR < 50 | 16 7–9 -34% -25.6u | 55 35–20 +6% |
|    sport picks WR < 55 | 59 34–25 -0% -0.6u | 12 8–4 -16% |
| 🔴 thin (<15 picks) AND young (<60d) | 2 1–1 -16% -1.5u | 69 41–28 -3% |
|    thin (<8) OR young (<30d) | 50 34–16 +15% +33.6u | 21 8–13 -43% |
| 🔴 lead sizeRatio ≥ 3 | 20 10–10 -18% -16.8u | 51 32–19 +3% |
| 🟢 lead sizeRatio 1.5–2 | 21 15–6 +24% +23.2u | 50 27–23 -14% |

Baseline: 71 42–29 -3.1% -10.4u

### August TOP ≥4u with lead

| Flag on primary HC lead | Match n/W–L/ROI | Rest n/W–L/ROI |
|------------------------|-----------------|----------------|
| 🟢 sport picks.n < 8 | 1 1–0 +47% +2.5u | 14 7–7 -32% |
| 🟢 sport picks.n < 15 | 1 1–0 +47% +2.5u | 14 7–7 -32% |
| 🟢 sport positions.n < 20 | 1 1–0 +47% +2.5u | 14 7–7 -32% |
| 🔴 wallet age < 30d | 7 4–3 -18% -6.3u | 8 4–4 -33% |
| 🔴 wallet age < 60d | 14 8–6 -22% -15.7u | 1 0–1 -100% |
| 🔴 sole HC lead | 14 7–7 -32% -22.2u | 1 1–0 +47% |
| 🔴 gap_enrichment lead | 5 3–2 -27% -7.4u | 10 5–5 -25% |
| 🔴 sport picks WR < 55 | 6 2–4 -45% -12.8u | 9 6–3 -15% |
| 🔴 thin (<15) OR young (<60d) | 14 8–6 -22% -15.7u | 1 0–1 -100% |

Baseline: 15 8–7 -26.0% -19.7u

## 4) August TOP losses — primary lead wallet dump

| Date | Pick | U | Lead | Age d | Sport n/WR/$ROI | Pos n | SR | Gap | R |
|------|------|--:|------|------:|-----------------|------:|---:|:--:|:-:|
| 2026-08-02 | Over 6.5 | 5.0 | `0cd77e` | 27 | 301/52%/10% | 290 | 3.19 |  | L |
| 2026-08-09 | Over 8.5 | 4.0 | `0cd77e` | 34 | 301/52%/10% | 290 | 3.03 |  | L |
| 2026-08-12 | Dallas Wings | 4.0 | `3bdd7e` | 2 | 26/46%/16% | 72 | 1.50 |  | L |
| 2026-08-15 | Joel Álvarez | 5.4 | `7dd2e5` | 28 | 35/77%/4% | 28 | 2.44 | Y | L |
| 2026-08-20 | San Francisco Giants | 5.4 | `4b912c` | 53 | 245/47%/15% | 410 | 2.59 |  | L |
| 2026-08-22 | Tampa Bay Rays | 4.0 | `621848` | 95 | 76/57%/7% | 79 | 3.30 |  | L |
| 2026-08-22 | Lerryan Douglas | 5.4 | `7dd2e5` | 35 | 35/77%/4% | 28 | 2.42 | Y | L |

## 5) August TOP wins — primary lead wallet dump

| Date | Pick | U | Lead | Age d | Sport n/WR/$ROI | Pos n | SR | Gap | R |
|------|------|--:|------|------:|-----------------|------:|---:|:--:|:-:|
| 2026-08-04 | Philadelphia Phillies | 6.0 | `0cd77e` | 29 | 301/52%/10% | 290 | 4.53 |  | W |
| 2026-08-15 | Donte Johnson | 5.4 | `7dd2e5` | 28 | 35/77%/4% | 28 | 1.64 | Y | W |
| 2026-08-15 | Esteban Ribovics | 5.4 | `7dd2e5` | 28 | 35/77%/4% | 28 | 2.77 | Y | W |
| 2026-08-15 | Mackenzie Dern | 5.4 | `6ac120` | 35 | 5/100%/25% | 7 | 2.89 |  | W |
| 2026-08-18 | Toronto Tempo | 4.0 | `3bdd7e` | 8 | 26/46%/16% | 72 | 3.14 |  | W |
| 2026-08-22 | Carli Judice | 5.4 | `7dd2e5` | 35 | 35/77%/4% | 28 | 2.64 | Y | W |
| 2026-08-22 | Reinier de Ridder | 5.4 | `7dd2e5` | 35 | 35/77%/4% | 28 | 2.43 |  | W |
| 2026-08-22 | Marcio Barbosa | 5.4 | `7dd2e5` | 35 | 35/77%/4% | 28 | 2.73 |  | W |

## 6) Repeat HC leads on TOP (Jun15+) — which wallets show up?

| Wallet | TOP tickets | W–L | ROI | PnL | Sport n | Age@first | Sport $ROI |
|--------|------------:|:---:|----:|----:|--------:|----------:|-----------:|
| `0cd77e` | 22 | 14–8 | +14% | +14.9u | 301 | 2 | 10% |
| `5b1e50` | 17 | 12–5 | +28% | +20.5u | 268 | 9 | 6% |
| `7dd2e5` | 7 | 5–2 | -14% | -5.4u | 35 | 28 | 4% |
| `ac9705` | 6 | 2–4 | -36% | -10.8u | 38 | 31 | 21% |
| `2f2a9e` | 4 | 4–0 | +30% | +5.4u | 51 | 18 | 3% |
| `1e8f33` | 3 | 1–2 | -36% | -5.5u | 195 | 40 | 8% |
| `4b912c` | 2 | 0–2 | -100% | -10.4u | 245 | 3 | 15% |
| `c911a4` | 2 | 1–1 | -43% | -3.9u | 56 | 64 | 8% |
| `3bdd7e` | 2 | 1–1 | -5% | -0.4u | 26 | 2 | 16% |

## 7) Contrast: SUPER primary HC lead (should be healthier)

| Feature (primary HC lead) | W n | W mean | W med | L n | L mean | L med | Δmean |
|---------------------------|----:|-------:|------:|----:|-------:|------:|------:|
| sport picks.n | 10 | 74.10 | 37.50 | 1 | 38.00 | 38.00 | +36.10 |
| wallet age | 10 | 37.20 | 34.50 | 1 | 33.00 | 33.00 | +4.20 |
| sport $ROI | 10 | 23.41 | 15.40 | 1 | 20.70 | 20.70 | +2.71 |
| sport picks WR | 10 | 59.52 | 51.55 | 1 | 47.40 | 47.40 | +12.12 |

SUPER with lead: 11 tickets · 11 10–1 +47% +31.3u
TOP lead sport picks.n mean: W 194.8 vs L 192.0
SUPER lead sport picks.n mean: 70.8

## 8) Read

- Thin sport sample (<15 picks): 2 1–1 -16% -1.5u vs rest 69 41–28 -3% -8.9u
- Young wallet (<60d): 67 40–27 -1% -3.5u vs rest 4 2–2 -38% -6.9u
- If Δ is large → lead-wallet quality/age is a real separator.
- If flat → TOP bleed is elsewhere (market mix / single-HC structure), not thin leads.
