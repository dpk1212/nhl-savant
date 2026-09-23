# Ev drift by EDGE tier — WR / ROI / PnL
_Generated 2026-08-26T16:54:44.749Z_

## Why EDGE would matter (mechanism, not just correlation)

**What EDGE is:** `mean(FOR sport WR) − (mean(AG sport WR) ?? 50)`.
It is our *internal* wallet-alignment conviction dial — how much better the wallets on our side have been historically vs the other side (or a 50 prior if unopposed).

**How it sizes the book:** TAPE = `2·(EDGE/10) + 1.5·(netCLV/10)` (EDGE-heavy). EDGE≥10 also floors size (ONE→≥4u / BOTH+tape boost→≥5u). So high EDGE is exactly when we lean hard and bet big.

**What Ev drift is:** first→lock change in ticket EV vs Pinnacle fair. Negative dEv = the *sharp market* moved against our price (we overpay more by lock).

**Collision theory:** high EDGE = we believe our wallets are right. Negative drift = Pinny says the price is wrong. When those disagree, we are both (a) wrong on price and (b) sized up on that wrongness. Low EDGE tickets: same market move, but we were not leveraged into the belief — drift is closer to noise / sometimes even healthy price discovery we already sized small for.

## Sample honesty
| Slice | n | Date span |
|-------|--:|-----------|
| Residual with first+lock Ev | 84 | 2026-08-19 → 2026-08-25 |

One soft week. Direction > ship-readiness. fair=0 excluded. TOP crowded mute removed.

## EDGE band profile — do high-E tickets drift more often?

| EDGE tier | n | avgU | %BOOST | mean EDGE | mean firstEv | mean lockEv | mean dEv | % dEv≤−1.5 | % late poison | base WR/ROI/PnL |
|-----------|--:|-----:|-------:|----------:|-------------:|------------:|---------:|-----------:|--------------:|-----------------|
| EDGE <5 | 52 | 1.4 | 0% | -0.8 | 1.4 | 1.4 | 0.0 | 23% | 15% | 52 23–29 44% -22% -15.6u |
| 5 ≤ EDGE <10 | 7 | 1.6 | 0% | 6.6 | -0.6 | 0.6 | 1.2 | 29% | 29% | 7 5–2 71% +47% +5.2u |
| 10 ≤ EDGE <15 | 5 | 5.3 | 60% | 12.6 | 0.5 | -1.5 | -2.0 | 40% | 20% | 5 4–1 80% +65% +17.2u |
| 15 ≤ EDGE <20 | 6 | 5.4 | 83% | 16.7 | 0.1 | -2.6 | -2.7 | 50% | 50% | 6 1–5 17% -79% -25.3u |
| EDGE ≥20 | 14 | 5.4 | 100% | 28.3 | -0.5 | -2.3 | -1.8 | 43% | 21% | 14 9–5 64% +12% +9.4u |
| ALL EDGE <15 (incl miss) | 64 | 1.7 | 5% | 1.0 | 1.1 | 1.1 | -0.0 | 25% | 17% | 64 32–32 50% +6% +6.7u |
| ALL EDGE ≥15 | 20 | 5.4 | 95% | 24.8 | -0.3 | -2.4 | -2.0 | 45% | 30% | 20 10–10 50% -15% -15.9u |
| ALL with tape | 84 | 2.6 | 26% | 6.7 | 0.7 | 0.2 | -0.5 | 30% | 20% | 84 42–42 50% -4% -9.2u |

If **% dEv≤−1.5** rises with EDGE → selection (high-E tickets get worse prices more often).
If rate is flat but cut ROI collapses only at high EDGE → interaction (same drift, worse when conviction is high).

## Compact scoreboard — dEv ≤ −1.5 by EDGE tier

| EDGE tier | base | cut (drifted) | mute Δ | cut vs base ROI |
|-----------|------|---------------|-------:|----------------:|
| EDGE <5 | 52 23–29 44% -22% -15.6u | 12 5–7 42% -47% -7.5u | +7.5u | -25pp |
| 5 ≤ EDGE <10 | 7 5–2 71% +47% +5.2u | 2 1–1 50% +39% +1.5u | -1.5u | -9pp |
| 10 ≤ EDGE <15 | 5 4–1 80% +65% +17.2u | 2 2–0 100% +90% +10.2u | -10.2u | +25pp |
| 15 ≤ EDGE <20 | 6 1–5 17% -79% -25.3u | 3 0–3 0% -100% -16.2u | +16.2u | -21pp |
| EDGE ≥20 | 14 9–5 64% +12% +9.4u | 6 2–4 33% -45% -14.6u | +14.6u | -57pp |
| ALL EDGE <15 (incl miss) | 64 32–32 50% +6% +6.7u | 16 8–8 50% +14% +4.3u | -4.3u | +7pp |
| ALL EDGE ≥15 | 20 10–10 50% -15% -15.9u | 9 2–7 22% -63% -30.8u | +30.8u | -49pp |
| ALL with tape | 84 42–42 50% -4% -9.2u | 25 10–15 40% -33% -26.5u | +26.5u | -29pp |

## Compact scoreboard — late poison by EDGE tier

| EDGE tier | base | cut | mute Δ |
|-----------|------|-----|-------:|
| EDGE <5 | 52 23–29 44% -22% -15.6u | 8 2–6 25% -52% -7.2u | +7.2u |
| 5 ≤ EDGE <10 | 7 5–2 71% +47% +5.2u | 2 1–1 50% +39% +1.5u | -1.5u |
| 10 ≤ EDGE <15 | 5 4–1 80% +65% +17.2u | 1 1–0 100% +54% +2.9u | -2.9u |
| 15 ≤ EDGE <20 | 6 1–5 17% -79% -25.3u | 3 0–3 0% -100% -16.2u | +16.2u |
| EDGE ≥20 | 14 9–5 64% +12% +9.4u | 3 0–3 0% -100% -16.2u | +16.2u |
| ALL EDGE <15 (incl miss) | 64 32–32 50% +6% +6.7u | 11 4–7 36% -12% -2.8u | +2.8u |
| ALL EDGE ≥15 | 20 10–10 50% -15% -15.9u | 6 0–6 0% -100% -32.4u | +32.4u |
| ALL with tape | 84 42–42 50% -4% -9.2u | 17 4–13 24% -63% -35.2u | +35.2u |

## Full ladder by EDGE tier (residual)

### EDGE <5
Base: **52 23–29 44% -22% -15.6u** · avgU 1.4 · BOOST 0% · meanFor 47.9 · meanAg 27.5

| Cohort | n | W–L | WR | ROI | PnL | mute Δ |
|--------|--:|:---:|---:|----:|----:|-------:|
| dEv ≤ −1 | 19 | 10–9 | 53% | -16% | -3.9u | +3.9u |
| ↳ keep if muted | 33 | 13–20 | 39% | -25% | -11.7u | — |
| dEv ≤ −1.5 | 12 | 5–7 | 42% | -47% | -7.5u | +7.5u |
| ↳ keep if muted | 40 | 18–22 | 45% | -15% | -8.2u | — |
| dEv ≤ −2 | 8 | 4–4 | 50% | -47% | -5.6u | +5.6u |
| ↳ keep if muted | 44 | 19–25 | 43% | -17% | -10.0u | — |
| late poison (first≥−0.5 → lock<−1) | 8 | 2–6 | 25% | -52% | -7.2u | +7.2u |
| ↳ keep if muted | 44 | 21–23 | 48% | -14% | -8.4u | — |
| improved/flat dEv > −1 | 33 | 13–20 | 39% | -25% | -11.7u | +11.7u |

### 5 ≤ EDGE <10
Base: **7 5–2 71% +47% +5.2u** · avgU 1.6 · BOOST 0% · meanFor 54.1 · meanAg 33.3

| Cohort | n | W–L | WR | ROI | PnL | mute Δ |
|--------|--:|:---:|---:|----:|----:|-------:|
| dEv ≤ −1 | 2 | 1–1 | 50% | +39% | +1.5u | -1.5u |
| ↳ keep if muted | 5 | 4–1 | 80% | +52% | +3.6u | — |
| dEv ≤ −1.5 | 2 | 1–1 | 50% | +39% | +1.5u | -1.5u |
| ↳ keep if muted | 5 | 4–1 | 80% | +52% | +3.6u | — |
| dEv ≤ −2 | 1 | 1–0 | 100% | +85% | +2.5u | -2.5u |
| ↳ keep if muted | 6 | 4–2 | 67% | +33% | +2.6u | — |
| late poison (first≥−0.5 → lock<−1) | 2 | 1–1 | 50% | +39% | +1.5u | -1.5u |
| ↳ keep if muted | 5 | 4–1 | 80% | +52% | +3.6u | — |
| improved/flat dEv > −1 | 5 | 4–1 | 80% | +52% | +3.6u | -3.6u |

### 10 ≤ EDGE <15
Base: **5 4–1 80% +65% +17.2u** · avgU 5.3 · BOOST 60% · meanFor 56.3 · meanAg 43.6

| Cohort | n | W–L | WR | ROI | PnL | mute Δ |
|--------|--:|:---:|---:|----:|----:|-------:|
| dEv ≤ −1 | 3 | 3–0 | 100% | +92% | +15.1u | -15.1u |
| ↳ keep if muted | 2 | 1–1 | 50% | +21% | +2.1u | — |
| dEv ≤ −1.5 | 2 | 2–0 | 100% | +90% | +10.2u | -10.2u |
| ↳ keep if muted | 3 | 2–1 | 67% | +46% | +7.0u | — |
| dEv ≤ −2 | 2 | 2–0 | 100% | +90% | +10.2u | -10.2u |
| ↳ keep if muted | 3 | 2–1 | 67% | +46% | +7.0u | — |
| late poison (first≥−0.5 → lock<−1) | 1 | 1–0 | 100% | +54% | +2.9u | -2.9u |
| ↳ keep if muted | 4 | 3–1 | 75% | +68% | +14.3u | — |
| improved/flat dEv > −1 | 2 | 1–1 | 50% | +21% | +2.1u | -2.1u |

### 15 ≤ EDGE <20
Base: **6 1–5 17% -79% -25.3u** · avgU 5.4 · BOOST 83% · meanFor 60.2 · meanAg 35.2

| Cohort | n | W–L | WR | ROI | PnL | mute Δ |
|--------|--:|:---:|---:|----:|----:|-------:|
| dEv ≤ −1 | 4 | 0–4 | 0% | -100% | -22.2u | +22.2u |
| ↳ keep if muted | 2 | 1–1 | 50% | -31% | -3.1u | — |
| dEv ≤ −1.5 | 3 | 0–3 | 0% | -100% | -16.2u | +16.2u |
| ↳ keep if muted | 3 | 1–2 | 33% | -57% | -9.1u | — |
| dEv ≤ −2 | 2 | 0–2 | 0% | -100% | -10.8u | +10.8u |
| ↳ keep if muted | 4 | 1–3 | 25% | -68% | -14.5u | — |
| late poison (first≥−0.5 → lock<−1) | 3 | 0–3 | 0% | -100% | -16.2u | +16.2u |
| ↳ keep if muted | 3 | 1–2 | 33% | -57% | -9.1u | — |
| improved/flat dEv > −1 | 2 | 1–1 | 50% | -31% | -3.1u | +3.1u |

### EDGE ≥20
Base: **14 9–5 64% +12% +9.4u** · avgU 5.4 · BOOST 100% · meanFor 72.2 · meanAg 26.0

| Cohort | n | W–L | WR | ROI | PnL | mute Δ |
|--------|--:|:---:|---:|----:|----:|-------:|
| dEv ≤ −1 | 6 | 2–4 | 33% | -45% | -14.6u | +14.6u |
| ↳ keep if muted | 8 | 7–1 | 88% | +55% | +24.0u | — |
| dEv ≤ −1.5 | 6 | 2–4 | 33% | -45% | -14.6u | +14.6u |
| ↳ keep if muted | 8 | 7–1 | 88% | +55% | +24.0u | — |
| dEv ≤ −2 | 4 | 1–3 | 25% | -47% | -10.1u | +10.1u |
| ↳ keep if muted | 10 | 8–2 | 80% | +36% | +19.5u | — |
| late poison (first≥−0.5 → lock<−1) | 3 | 0–3 | 0% | -100% | -16.2u | +16.2u |
| ↳ keep if muted | 11 | 9–2 | 82% | +43% | +25.6u | — |
| improved/flat dEv > −1 | 8 | 7–1 | 88% | +55% | +24.0u | -24.0u |

## Ticket dump — EDGE≥15 ∧ dEv ≤ −1.5

| Date | u | Path | Sport | E | meanFor | meanAg | first | lock | dEv | W/L | PnL |
|------|--:|------|-------|--:|--------:|-------:|------:|-----:|----:|:--:|----:|
| 2026-08-22 | 5.4 | TOP | UFC | 38.4 | 80.6 | 42.2 | -0.7 | -2.2 | -1.5 | W | +0.92 |
| 2026-08-25 | 5.4 | SHARP | MLB | 36.6 | 68.8 | 32.2 | -0.2 | -11.4 | -11.2 | L | -5.40 |
| 2026-08-25 | 5.4 | SHARP | MLB | 28.6 | 68.8 | 40.3 | -1.2 | -3.2 | -2.0 | L | -5.40 |
| 2026-08-23 | 5.4 | SHARP | WNBA | 26.3 | 73.4 | 47.1 | 8.2 | -1.0 | -9.2 | W | +6.10 |
| 2026-08-25 | 5.4 | MINI | WNBA | 26.0 | 70.9 | 45.0 | 1.4 | -2.6 | -4.0 | L | -5.40 |
| 2026-08-21 | 5.4 | SHARP | NFL | 22.7 | 72.7 | 0.0 | 0.4 | -1.1 | -1.5 | L | -5.40 |
| 2026-08-22 | 5.4 | TOP | UFC | 17.6 | 67.6 | 0.0 | 1.5 | -2.8 | -4.3 | L | -5.40 |
| 2026-08-24 | 5.4 | SHARP | WNBA | 17.1 | 62.9 | 45.8 | 2.1 | -8.1 | -10.2 | L | -5.40 |
| 2026-08-20 | 5.4 | TOP | MLB | 16.0 | 64.9 | 48.8 | 0.5 | -1.3 | -1.8 | L | -5.40 |

## Control — EDGE≥15 ∧ improved/flat (dEv > −1)

| Date | u | Path | Sport | E | first | lock | dEv | W/L | PnL |
|------|--:|------|-------|--:|------:|-----:|----:|:--:|----:|
| 2026-08-20 | 5.4 | SHARP-LEAN | NFL | 39.8 | -1.7 | -0.6 | 1.1 | W | +4.29 |
| 2026-08-20 | 4.0 | MINI | MLB | 16.7 | -0.9 | 0.6 | 1.5 | L | -4.00 |
| 2026-08-20 | 5.4 | TOP | NFL | 25.0 | -1.9 | -1.9 | 0.0 | W | +4.82 |
| 2026-08-21 | 5.4 | SHARP | WNBA | 20.0 | 0.0 | 0.0 | 0.0 | W | +5.14 |
| 2026-08-21 | 5.4 | SHARP-LEAN | NFL | 22.7 | -2.3 | -1.9 | 0.4 | L | -5.40 |
| 2026-08-22 | 5.4 | SHARP-LEAN | NFL | 21.4 | -1.8 | -2.3 | -0.5 | W | +4.32 |
| 2026-08-22 | 5.4 | MINI | UFC | 30.6 | -3.7 | -1.0 | 2.7 | W | +4.50 |
| 2026-08-22 | 5.4 | TOP | UFC | 30.6 | -3.3 | -2.5 | 0.8 | W | +0.64 |
| 2026-08-24 | 6.0 | SUPER | WNBA | 17.4 | -3.8 | -3.9 | -0.1 | W | +0.86 |
| 2026-08-25 | 6.0 | RANK | MLB | 27.7 | -0.3 | -0.1 | 0.2 | W | +5.71 |

Control aggregate: **10 8–2 80% +39% +20.9u**

## Read

1. Walk the EDGE ladder on cut ROI / mute Δ — does poison intensify as EDGE rises?
2. Compare drift *rate* vs cut *severity* — selection vs interaction.
3. Control (high-E, no drift) should stay healthy if the story is collision, not “high EDGE is bad.”
