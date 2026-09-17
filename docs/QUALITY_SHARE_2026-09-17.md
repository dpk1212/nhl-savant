# Quality of money — $ weighted by who

_Pulled 2026-09-17. Graded AGS-U **2026-06-01–2026-09-16**. Last 2 = 2026-09-15–2026-09-16._
_Q$ = invested × max(Source A sport WR − 50, 0), n≥8. Junk $ (WR&lt;50 or no WR) drops out. contrib = stamped v8 `contribution` (walletBase × conviction). smart $ = CONFIRMED or WR≥55 or WR50. v12 quality = `agsV12WalletQuality` (CONFIRMED=3, FLAT=2, WR50 gated to 0). junkAg = against $ with no WR or WR&lt;52 / against $._
_Live book. CF: mute shipped tickets → **positive save = would have saved**. **No policy.**_

## Direct answer

**Quality-weighted $ does not split the two pockets. Share-of-who still looks the same on both.**

Junk-against (all <25% AND proven ≥50%) vs fake-save (all 25–45% AND proven ≥50%), Aug 24+:

| | Junk-against **10–3 +21u** | Fake save **1–9 −20u** |
| --- | --- | --- |
| med all $ | 17% | 35% |
| med proven | 100% | 99% |
| med **Q$** (WR−50)×$ | **100%** | **100%** |
| med smart $ | 82% | 94% |
| med contrib | 60% | 70% |
| med **junkAg** | **100%** | **100%** |
| med WR50-ag | 0% | 0% |
| med **EDGE** | **10.7** | **3.1** |
| med qConv | 10.5 | 5.1 |

The against pile is junk on **both** cells. Weighting dollars by WR, contribution, or “smart” just sends Q$ to 100% whenever the other side has no above-coin record — whether we are at 17% of the card or 35%. A share cannot see “buried under junk” vs “slightly out-dollar’d by junk.” Excepting Q$ ≥50% inside 25–45% is **worse** than proven: Aug 24+ **2–18 −42u** vs proven’s 1–9 −20u. It excepts *more* of the dog, because junk against drops out of the denominator.

**Three quality facts that *do* sit under the pockets:**

**1. WR50 against is the true-contested tell.** 25–45% with proven <50% (the other half of the dog): med WR50-ag **80–92%**. Those boards are faded by wallets with a record who are not whitelist. Junk-against WR50-ag is **0%**. Quality of the against pile *does* separate true contested from junk-against. It does **not** explain fake-save (also 0% WR50-ag).

**2. EDGE is quality of *our* money, and it splits junk-against from fake-save.** Our proven wallets on junk-against are actually good (EDGE ~11). On fake-save they are barely above the prior (EDGE ~3). Slice junk-against to EDGE ≥8: T **4–1 +14u / +71%**, Aug 24+ **6–1 +19u / +65%**. Fake-save EDGE ≥8 is still 0–2 −8u — EDGE does **not** save 25–45% (that band EDGE ≥8 is T 1–5 −18u). The 25–45% mute still holds even when we have the WR gap.

**3. Q$ *does* flip 15–25%, cleaner than proven.** Aug 24+ all 15–25% AND Q$ ≥50%: **8–1 +24u / +85%**. Q$ <50% in that band: 3–4 −3u. Proven ≥50% in 15–25% was 6–1 +15u. The missing axis in the 15–25% pocket is “do we have the above-coin dollars,” not “are we proven.” 0–15% Q$ ≥50% is still a coin (5–4 −1u).

**Smart $ 60–80% is the actual quality printer** — we have a quality majority, not a blowout pile: T **17–2 +47u / +69%**, Aug 24+ **21–4 +55u / +63%**, steam 26–5 +70u. Then smart 50–60% is a hole (Aug 24+ 3–11 −22u) and 80–100% is the majority book. Same U-shape as proven, just shifted. Keep smart ≥60%: T 58–33 **+63u / +21%**.

walletBase×$ keep ≥50% is the strongest *majority-board* keep on T (**64–30 +91u / +30%**) but it does not recover junk-against (0–1 −3u). It is card-% in a nicer suit.

**Mute language if we chase quality instead of proven:**

| Rule | T save | Aug 24+ save | Steam save | Fake-save keep | Junk-against keep |
| --- | --- | --- | --- | --- | --- |
| Mute ≤45 except proven ≥50% | +34u | +38u | +42u | 1–5 −13u | **5–2 +12u** |
| Mute ≤45 except Q$ ≥50% | +11u | +19u | +18u | **2–12 −31u** | 6–3 +7u |
| Mute ≤45 except smart ≥50% | +38u | +46u | +50u | 2–5 −10u | 5–1 +13u |
| Mute 25–45 always; <25 keep proven ≥50% | **+47u** | +58u | +55u | none | 5–2 +12u |
| Mute 25–45 always; <25 keep Q$ ≥50% | +42u | **+60u** | +58u | none | 6–3 +7u |

Q$ as the mixed exception is worse than proven because it ships more of 25–45%. Q$ as the *<25% only* exception is roughly tied with proven and cleaner inside 15–25%.

The quality aspect that is real: **WR50-against flags true contested; EDGE flags whether our proven $ is actually good; Q$ flags junk-against inside 15–25%.** None of those is a new board-% you slap on every ticket. 25–45% is still mute-always. Sit tight unless you say ship.

## 0. Coverage

| Window | Live | all $ | proven $ | Q$ | contrib | smart $ | v12Q |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Last 2 | 27 | 27 | 27 | 25 | 27 | 27 | 27 |
| Last 7 | 83 | 83 | 82 | 72 | 83 | 81 | 81 |
| T | 147 | 147 | 146 | 133 | 147 | 145 | 143 |
| Steam | 337 | 337 | 329 | 291 | 337 | 326 | 289 |
| Aug 24+ | 253 | 253 | 248 | 228 | 253 | 250 | 226 |
| v12 | 1068 | 1068 | 1001 | 968 | 1068 | 1029 | 808 |

## 1. Pocket autopsy — do quality metrics split printers from dogs?

Junk-against *should* be high quality on us / junk against. Fake-save *should* show quality on the against pile if “who” is the missing axis.

**Aug 24+**

| Cell | W/L | med all $ | med proven | med Q$ | med contrib | med smart $ | med junkAg | med WR50-ag | med EDGE | med qConv |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Junk-against: all <25% AND proven ≥50% | 10–3 +21u / +52.1% | 17% | 100% | 100% | 60% | 82% | 100% | 0% | 10.7 | 10.5 |
| Fake save: all 25–45% AND proven ≥50% | 1–9 -20u / -82.5% | 35% | 99% | 100% | 70% | 94% | 100% | 0% | 3.1 | 5.1 |
| True buried: all <25% AND proven <50% | 8–12 -7u / -12% | 16% | 18% | 35% | 57% | 19% | 48% | 70% | 6.2 | 7.4 |
| True contested: all 25–45% AND proven <50% | 8–19 -31u / -42.4% | 35% | 27% | 45% | 59% | 31% | 25% | 92% | 3.4 | 5.1 |
| Proven 45–50% (prints) | 4–4 +8u / +32.6% | 47% | 47% | 63% | 49% | 46% | 54% | 63% | 7.9 | 7.7 |
| Proven 50–60% (the hole) | 4–9 -18u / -46% | 58% | 55% | 90% | 56% | 53% | 93% | 63% | 5.4 | 13.7 |
| Proven 20–25% (dog) | 1–4 -9u / -54.7% | 31% | 23% | 47% | 32% | 20% | 56% | 87% | 7.7 | 9.4 |
| Proven 30–35% (pocket) | 6–3 +9u / +31.2% | 32% | 32% | 60% | 72% | 32% | 32% | 80% | 6.8 | 40.4 |
| all 15–25% | 11–7 +18u / +35.6% | 21% | 38% | 81% | 60% | 32% | 97% | 6% | 6.2 | 1.7 |
| all 25–45% | 9–28 -51u / -52.2% | 35% | 34% | 60% | 61% | 36% | 39% | 80% | 3.3 | 5.1 |

**T**

| Cell | W/L | med all $ | med proven | med Q$ | med contrib | med smart $ | med junkAg | med WR50-ag | med EDGE | med qConv |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Junk-against: all <25% AND proven ≥50% | 5–2 +12u / +50.2% | 20% | 92% | 100% | 56% | 69% | 100% | 0% | 11.7 | 10.8 |
| Fake save: all 25–45% AND proven ≥50% | 1–5 -13u / -75.2% | 34% | 95% | 100% | 57% | 95% | 100% | 0% | 3.7 | 7.5 |
| True buried: all <25% AND proven <50% | 5–7 -9u / -22.3% | 16% | 17% | 29% | 58% | 18% | 18% | 82% | 8.2 | 14.2 |
| True contested: all 25–45% AND proven <50% | 6–15 -25u / -39.6% | 37% | 24% | 48% | 54% | 31% | 25% | 80% | 3.4 | 9.4 |
| Proven 45–50% (prints) | 4–2 +12u / +59.1% | 49% | 47% | 63% | 55% | 46% | 39% | 63% | 7.9 | 12.5 |
| Proven 50–60% (the hole) | 3–4 -4u / -21.6% | 59% | 54% | 57% | 48% | 52% | 51% | 64% | 3.4 | 50.4 |
| Proven 20–25% (dog) | 0–4 -13u / -100% | 27% | 23% | 32% | 41% | 22% | 35% | 91% | 5.9 | 4.8 |
| Proven 30–35% (pocket) | 4–3 +2u / +9.9% | 37% | 32% | 60% | 72% | 33% | 20% | 80% | 6.8 | 40.4 |
| all 15–25% | 7–4 +11u / +29.3% | 23% | 33% | 43% | 60% | 25% | 93% | 62% | 9.8 | 11.6 |
| all 25–45% | 7–20 -37u / -47.1% | 35% | 32% | 58% | 54% | 36% | 32% | 73% | 3.4 | 9.1 |

## 2. Fine bands — Q$ (the quality-weighted board)

Read left → right as our share of *above-coin* dollars rises. Junk $ is gone from both sides.

| Q$ band | Last 2 | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- | --- |
| 0–15% | 3 · 0–3 · 0% (0–56.2) · 9.9u · -9.9u · -100% | 8 · 3–5 · 37.5% (13.7–69.4) · 22.9u · -2.8u · -12.2% | 12 · 4–8 · 33.3% (13.8–60.9) · 31.9u · -7.0u · -22% | 27 · 9–18 · 33.3% (18.6–52.2) · 56.9u · -16.4u · -28.8% | 20 · 8–12 · 40% (21.9–61.3) · 43.9u · -8.7u · -19.7% | 98 · 38–60 · 38.8% (29.7–48.7) · 233.1u · -38.6u · -16.5% |
| 15–20% | — | — | 2 · 1–1 · 50% (9.5–90.5) · 6.0u · +0.1u · +2.5% | 5 · 1–4 · 20% (3.6–62.4) · 10.0u · -3.9u · -38.5% | 4 · 1–3 · 25% (4.6–69.9) · 9.0u · -2.9u · -31.7% | 16 · 6–10 · 37.5% (18.5–61.4) · 40.8u · +2.3u · +5.5% |
| 20–25% | — | 1 · 1–0 · 100% (20.7–100) · 4.0u · +2.3u · +58.5% | 3 · 1–2 · 33.3% (6.1–79.2) · 10.0u · -3.7u · -36.6% | 3 · 1–2 · 33.3% (6.1–79.2) · 10.0u · -3.7u · -36.6% | 3 · 1–2 · 33.3% (6.1–79.2) · 10.0u · -3.7u · -36.6% | 10 · 2–8 · 20% (5.7–51) · 25.8u · -15.2u · -59.1% |
| 25–30% | — | — | — | — | — | 8 · 4–4 · 50% (21.5–78.5) · 24.5u · -3.0u · -12.1% |
| 30–35% | 1 · 0–1 · 0% (0–79.3) · 1.5u · -1.5u · -100% | 1 · 0–1 · 0% (0–79.3) · 1.5u · -1.5u · -100% | 3 · 1–2 · 33.3% (6.1–79.2) · 7.5u · -1.0u · -14% | 4 · 1–3 · 25% (4.6–69.9) · 11.5u · -5.0u · -43.9% | 4 · 1–3 · 25% (4.6–69.9) · 11.5u · -5.0u · -43.9% | 8 · 2–6 · 25% (7.1–59.1) · 20.4u · -4.6u · -22.7% |
| 35–40% | — | 3 · 2–1 · 66.7% (20.8–93.9) · 9.5u · +5.6u · +58.9% | 4 · 2–2 · 50% (15–85) · 11.5u · +3.6u · +31.3% | 8 · 2–6 · 25% (7.1–59.1) · 23.5u · -8.4u · -35.7% | 6 · 2–4 · 33.3% (9.7–70) · 18.5u · -3.4u · -18.4% | 14 · 4–10 · 28.6% (11.7–54.6) · 30.5u · -11.1u · -36.5% |
| 40–45% | — | — | 2 · 1–1 · 50% (9.5–90.5) · 6.0u · +0.0u · +0% | 4 · 2–2 · 50% (15–85) · 9.0u · +1.5u · +17.1% | 3 · 2–1 · 66.7% (20.8–93.9) · 8.0u · +2.5u · +31.8% | 11 · 5–6 · 45.5% (21.3–72) · 17.3u · +4.5u · +25.8% |
| 45–50% | — | 2 · 0–2 · 0% (0–65.8) · 7.0u · -7.0u · -100% | 3 · 1–2 · 33.3% (6.1–79.2) · 9.0u · -4.2u · -46.2% | 3 · 1–2 · 33.3% (6.1–79.2) · 9.0u · -4.2u · -46.2% | 3 · 1–2 · 33.3% (6.1–79.2) · 9.0u · -4.2u · -46.2% | 7 · 3–4 · 42.9% (15.8–75) · 20.5u · -3.9u · -19% |
| 50–60% | — | 1 · 1–0 · 100% (20.7–100) · 4.0u · +5.6u · +141% | 6 · 3–3 · 50% (18.8–81.2) · 18.0u · +3.2u · +17.6% | 9 · 5–4 · 55.6% (26.7–81.1) · 22.5u · +5.3u · +23.4% | 8 · 4–4 · 50% (21.5–78.5) · 21.5u · +4.5u · +21% | 17 · 6–11 · 35.3% (17.3–58.7) · 41.6u · -8.1u · -19.6% |
| 60–80% | 4 · 1–3 · 25% (4.6–69.9) · 13.0u · -7.1u · -54.3% | 9 · 3–6 · 33.3% (12.1–64.6) · 31.9u · -11.3u · -35.5% | 13 · 5–8 · 38.5% (17.7–64.5) · 42.9u · -13.5u · -31.5% | 23 · 11–12 · 47.8% (29.2–67) · 77.1u · -6.4u · -8.3% | 19 · 9–10 · 47.4% (27.3–68.3) · 64.3u · -7.3u · -11.3% | 47 · 27–20 · 57.4% (43.3–70.5) · 133.7u · +11.2u · +8.4% |
| 80–100% | 17 · 6–11 · 35.3% (17.3–58.7) · 55.0u · -21.0u · -38.3% | 47 · 24–23 · 51.1% (37.2–64.7) · 162.7u · -9.7u · -6% | 85 · 56–29 · 65.9% (55.3–75.1) · 287.3u · +63.5u · +22.1% | 205 · 129–76 · 62.9% (56.1–69.2) · 601.2u · +104.7u · +17.4% | 158 · 101–57 · 63.9% (56.2–71) · 491.9u · +81.7u · +16.6% | 732 · 437–295 · 59.7% (56.1–63.2) · 2130.3u · +228.6u · +10.7% |
| no $ | 2 · 1–1 · 50% (9.5–90.5) · 10.0u · -1.7u · -17% | 11 · 4–7 · 36.4% (15.2–64.6) · 32.0u · -8.2u · -25.7% | 14 · 6–8 · 42.9% (21.4–67.4) · 38.0u · -9.1u · -24% | 46 · 22–24 · 47.8% (34.1–61.9) · 117.8u · -18.6u · -15.8% | 25 · 10–15 · 40% (23.4–59.3) · 67.4u · -18.3u · -27.2% | 100 · 51–49 · 51% (41.3–60.6) · 255.7u · -16.4u · -6.4% |

## 3. Fine bands — contrib share (causal v8 quality already on the card)

| contrib band | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- |
| 0–15% | — | — | 2–2 -6u / -33.1% | 1–1 -2u / -21.9% | 10–8 -6u / -11.8% |
| 15–20% | 2–0 +6u / +128% | 3–0 +8u / +121.8% | 3–1 +4u / +37.3% | 3–0 +8u / +121.8% | 8–8 +2u / +3.9% |
| 20–25% | 0–2 -10u / -100% | 0–2 -10u / -100% | 0–2 -10u / -100% | 0–2 -10u / -100% | 21–14 +15u / +13.3% |
| 25–30% | 0–1 -5u / -100% | 0–2 -7u / -100% | 2–4 -9u / -64.5% | 1–4 -10u / -75.2% | 8–13 -9u / -16.3% |
| 30–35% | 1–3 -8u / -54% | 3–3 -2u / -11.9% | 4–4 -2u / -6.4% | 4–4 -2u / -6.4% | 17–13 +2u / +2% |
| 35–40% | 2–1 +2u / +24.3% | 3–4 -3u / -13.7% | 5–9 -3u / -6.7% | 3–7 -10u / -37% | 18–20 -2u / -2.1% |
| 40–45% | 2–2 -2u / -15.8% | 4–3 0u / -1.4% | 4–6 -5u / -19.7% | 4–4 -1u / -5.7% | 22–17 +17u / +17.8% |
| 45–50% | 2–5 -3u / -17.9% | 3–5 0u / -0.5% | 4–7 -1u / -2.6% | 4–6 +0u / +1.6% | 22–23 +7u / +6.7% |
| 50–60% | 9–2 +23u / +54.2% | 11–6 +17u / +29.2% | 23–15 +22u / +17.8% | 15–12 +5u / +5.3% | 74–48 +45u / +12.5% |
| 60–80% | 12–17 -11u / -11.7% | 27–25 +9u / +5.3% | 56–50 +26u / +8.8% | 48–38 +31u / +11.9% | 130–115 +43u / +6.2% |
| 80–100% | 8–12 -18u / -28.5% | 27–16 +20u / +15.7% | 81–53 +29u / +8.2% | 57–35 +26u / +9.7% | 255–204 +34u / +2.6% |
| no $ | — | — | — | — | — |

## 4. Fine bands — smart $ (CONFIRMED or WR≥55 or WR50)

| smart $ band | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- |
| 0–15% | 5–4 +4u / +13.3% | 6–7 -1u / -1.8% | 9–14 -4u / -7.3% | 7–11 -3u / -6.4% | 33–48 -12u / -5.7% |
| 15–20% | 2–0 +6u / +130.7% | 3–1 +6u / +56% | 4–2 +7u / +49.3% | 4–2 +7u / +49.3% | 6–5 +7u / +22.3% |
| 20–25% | 0–3 -10u / -100% | 0–5 -15u / -100% | 1–6 -13u / -63.3% | 1–5 -11u / -59.5% | 8–13 -16u / -26.2% |
| 25–30% | 0–3 -12u / -100% | 0–3 -12u / -100% | 2–5 -18u / -80.6% | 2–5 -18u / -80.6% | 7–11 -22u / -46.3% |
| 30–35% | 3–0 +12u / +89% | 3–2 +6u / +30.6% | 4–3 +9u / +30.8% | 4–3 +9u / +30.8% | 9–4 +18u / +45.9% |
| 35–40% | 1–2 -2u / -23.4% | 3–3 +2u / +9.3% | 5–5 +2u / +9.7% | 4–5 +1u / +6.7% | 9–10 +6u / +14.7% |
| 40–45% | 0–3 -11u / -100% | 2–3 -5u / -31.3% | 3–8 -18u / -58.2% | 3–5 -9u / -39.9% | 4–10 -21u / -60.4% |
| 45–50% | 2–0 +6u / +81% | 3–2 +2u / +13.8% | 4–5 -9u / -30% | 3–4 -6u / -25.4% | 9–9 -10u / -18.1% |
| 50–60% | 1–4 -9u / -72% | 2–6 -12u / -60.3% | 4–13 -21u / -53.9% | 3–11 -22u / -62.4% | 19–34 -43u / -37% |
| 60–80% | 11–1 +34u / +70% | 17–2 +47u / +69.1% | 26–5 +70u / +65.9% | 21–4 +55u / +62.7% | 60–34 +72u / +27.1% |
| 80–100% | 12–24 -43u / -37.4% | 41–31 +16u / +7.1% | 119–79 +54u / +10% | 87–56 +35u / +8.2% | 405–282 +183u / +9.4% |
| no $ | 1–1 -1u / -28% | 1–1 -1u / -28% | 3–8 -12u / -34.7% | 1–2 -2u / -40% | 16–23 -18u / -15.4% |

## 5. Fine bands — against-junk % (high = the other side is junk $)

| Against-side quality | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- |
| junkAg <40% | 9–10 -6u / -9.2% | 17–20 -9u / -7.8% | 31–36 -18u / -9.6% | 27–27 -9u / -5.5% | 75–84 -16u / -3.7% |
| junkAg 40–60% | 5–3 +7u / +21.8% | 7–4 +12u / +29.5% | 7–6 +6u / +12.3% | 7–5 +9u / +20.3% | 13–23 -16u / -16.3% |
| junkAg 60–80% | 1–3 -3u / -31.9% | 2–4 -4u / -26.7% | 3–8 -11u / -33% | 3–8 -11u / -33% | 12–21 -29u / -43.6% |
| junkAg ≥80% | 19–22 -15u / -11.4% | 38–30 +15u / +6.6% | 89–68 +42u / +9.3% | 69–53 +23u / +6.1% | 287–201 +157u / +11.1% |
| WR50-ag ≥25% | 20–19 +8u / +5.7% | 35–32 +16u / +7.6% | 62–66 -3u / -0.8% | 54–52 +5u / +1.6% | 176–185 -11u / -1.1% |
| WR50-ag ≥50% | 19–16 +13u / +10.5% | 32–28 +19u / +10% | 52–57 -4u / -1.4% | 47–44 +12u / +4.3% | 148–159 -6u / -0.7% |
| hiWR-ag ≥25% (WR≥55) | 7–8 +2u / +3.2% | 10–10 +6u / +9.5% | 16–23 -22u / -17.4% | 12–16 -12u / -13% | 31–53 -42u / -19.8% |
| hiWR-ag ≥50% | 7–3 +19u / +54.2% | 8–4 +18u / +46.7% | 14–15 -1u / -1.1% | 10–8 +8u / +13.1% | 26–40 -20u / -12.1% |

## 6. Directionality — keep ≥ X on each quality metric

If the metric is directional, keep-≥60 beats keep-≥50 beats the full book, and there is no 50–60% hole.

**all $**

| Keep ≥ X | T | Aug 24+ |
| --- | --- | --- |
| all with metric | 81–66 +32u / +6.8% · 147 tix | 140–113 +35u / +4.7% · 253 tix |
| ≥40% | 65–40 +58u / +17.4% · 105 tix | 114–75 +60u / +10.4% · 189 tix |
| ≥45% | 64–37 +67u / +20.6% · 101 tix | 113–70 +72u / +13% · 183 tix |
| ≥50% | 57–32 +62u / +21.8% · 89 tix | 103–64 +68u / +13.2% · 167 tix |
| ≥60% | 50–23 +58u / +24.8% · 73 tix | 92–48 +80u / +18.7% · 140 tix |
| ≥80% | 30–19 +19u / +11.6% · 49 tix | 64–40 +27u / +8.6% · 104 tix |

**proven $**

| Keep ≥ X | T | Aug 24+ |
| --- | --- | --- |
| all with metric | 80–66 +30u / +6.5% · 146 tix | 137–111 +39u / +5.2% · 248 tix |
| ≥40% | 66–45 +53u / +14.9% · 111 tix | 116–80 +63u / +10.8% · 196 tix |
| ≥45% | 65–42 +63u / +18.5% · 107 tix | 114–75 +77u / +13.5% · 189 tix |
| ≥50% | 61–40 +51u / +16% · 101 tix | 110–71 +69u / +12.7% · 181 tix |
| ≥60% | 58–36 +55u / +18.5% · 94 tix | 106–62 +87u / +17.1% · 168 tix |
| ≥80% | 41–33 +15u / +6.3% · 74 tix | 84–57 +39u / +9.2% · 141 tix |

**Q$ (WR−50)×$**

| Keep ≥ X | T | Aug 24+ |
| --- | --- | --- |
| all with metric | 75–58 +41u / +9.5% · 133 tix | 130–98 +54u / +7.8% · 228 tix |
| ≥40% | 66–43 +49u / +13.5% · 109 tix | 117–74 +77u / +13% · 191 tix |
| ≥45% | 65–42 +49u / +13.7% · 107 tix | 115–73 +75u / +12.7% · 188 tix |
| ≥50% | 64–40 +53u / +15.3% · 104 tix | 114–71 +79u / +13.7% · 185 tix |
| ≥60% | 61–37 +50u / +15.1% · 98 tix | 110–67 +74u / +13.4% · 177 tix |
| ≥80% | 56–29 +64u / +22.1% · 85 tix | 101–57 +82u / +16.6% · 158 tix |

**contrib share**

| Keep ≥ X | T | Aug 24+ |
| --- | --- | --- |
| all with metric | 81–66 +32u / +6.8% · 147 tix | 140–113 +35u / +4.7% · 253 tix |
| ≥40% | 72–55 +47u / +11.5% · 127 tix | 128–95 +61u / +9.2% · 223 tix |
| ≥45% | 68–52 +47u / +12.2% · 120 tix | 124–91 +62u / +9.7% · 215 tix |
| ≥50% | 65–47 +47u / +13% · 112 tix | 120–85 +62u / +10% · 205 tix |
| ≥60% | 54–41 +30u / +9.8% · 95 tix | 105–73 +57u / +10.8% · 178 tix |
| ≥80% | 27–16 +20u / +15.7% · 43 tix | 57–35 +26u / +9.7% · 92 tix |

**smart $**

| Keep ≥ X | T | Aug 24+ |
| --- | --- | --- |
| all with metric | 80–65 +33u / +7.2% · 145 tix | 139–111 +38u / +5% · 250 tix |
| ≥40% | 65–44 +48u / +13.6% · 109 tix | 117–80 +53u / +8.9% · 197 tix |
| ≥45% | 63–41 +53u / +15.8% · 104 tix | 114–75 +62u / +10.7% · 189 tix |
| ≥50% | 60–39 +51u / +15.9% · 99 tix | 111–71 +68u / +12.3% · 182 tix |
| ≥60% | 58–33 +63u / +21.1% · 91 tix | 108–60 +90u / +17.4% · 168 tix |
| ≥80% | 41–31 +16u / +7.1% · 72 tix | 87–56 +35u / +8.2% · 143 tix |

**v12 quality $**

| Keep ≥ X | T | Aug 24+ |
| --- | --- | --- |
| all with metric | 78–65 +32u / +7% · 143 tix | 126–100 +44u / +6.5% · 226 tix |
| ≥40% | 72–59 +29u / +6.8% · 131 tix | 115–86 +53u / +8.6% · 201 tix |
| ≥45% | 71–56 +34u / +8.2% · 127 tix | 113–83 +55u / +9.3% · 196 tix |
| ≥50% | 69–54 +30u / +7.5% · 123 tix | 111–80 +54u / +9.2% · 191 tix |
| ≥60% | 67–50 +38u / +10% · 117 tix | 109–73 +73u / +13.3% · 182 tix |
| ≥80% | 56–37 +54u / +18% · 93 tix | 95–57 +92u / +20.5% · 152 tix |

**walletBase×$**

| Keep ≥ X | T | Aug 24+ |
| --- | --- | --- |
| all with metric | 81–66 +32u / +6.8% · 147 tix | 140–113 +35u / +4.7% · 253 tix |
| ≥40% | 68–41 +64u / +18% · 109 tix | 116–75 +65u / +11.1% · 191 tix |
| ≥45% | 66–37 +71u / +21.5% · 103 tix | 113–70 +73u / +12.9% · 183 tix |
| ≥50% | 64–30 +91u / +30.2% · 94 tix | 110–61 +95u / +18% · 171 tix |
| ≥60% | 54–23 +81u / +32.1% · 77 tix | 99–52 +89u / +19.1% · 151 tix |
| ≥80% | 33–21 +19u / +10.9% · 54 tix | 72–44 +30u / +8.3% · 116 tix |

## 7. Mute ≤45% all-$ except quality-metric ≥50%

Same mixed-axis lean, swap the exception from proven $ to a quality %.

| Mute all-$ ≤45 except… | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- |
| proven $ ≥50% | cut 7–13 -22u · save +22 · keep -6u · n=20 | cut 11–22 -34u · save +34 · keep +66u · n=33 | cut 18–34 -42u · save +42 · keep +87u · n=52 | cut 16–31 -38u · save +38 · keep +74u · n=47 | cut 45–66 -40u · save +40 · keep +186u · n=111 |
| Q$ (WR−50)×$ ≥50% | cut 6–7 -1u · save +1 · keep -26u · n=13 | cut 9–14 -11u · save +11 · keep +43u · n=23 | cut 13–22 -18u · save +18 · keep +63u · n=35 | cut 12–20 -19u · save +19 · keep +54u · n=32 | cut 34–50 -16u · save +16 · keep +162u · n=84 |
| contrib share ≥50% | cut 7–10 -13u · save +13 · keep -14u · n=17 | cut 7–12 -18u · save +18 · keep +50u · n=19 | cut 10–18 -26u · save +26 · keep +71u · n=28 | cut 8–16 -23u · save +23 · keep +58u · n=24 | cut 47–45 +13u · save -13 · keep +132u · n=92 |
| smart $ ≥50% | cut 7–14 -23u · save +23 · keep -5u · n=21 | cut 10–23 -38u · save +38 · keep +70u · n=33 | cut 17–36 -50u · save +50 · keep +95u · n=53 | cut 15–33 -46u · save +46 · keep +82u · n=48 | cut 46–69 -44u · save +44 · keep +190u · n=115 |
| v12 quality $ ≥50% | cut 3–3 +3u · save -3 · keep -30u · n=6 | cut 3–6 -4u · save +4 · keep +36u · n=9 | cut 5–13 -10u · save +10 · keep +55u · n=18 | cut 5–11 -8u · save +8 · keep +44u · n=16 | cut 33–48 -6u · save +6 · keep +152u · n=81 |
| walletBase×$ ≥50% | cut 11–18 -28u · save +28 · keep +1u · n=29 | cut 15–25 -32u · save +32 · keep +64u · n=40 | cut 32–43 -21u · save +21 · keep +66u · n=75 | cut 24–37 -31u · save +31 · keep +66u · n=61 | cut 86–85 +30u · save -30 · keep +116u · n=171 |

What each exception **keeps inside 25–45% all-$** (the fake-save test):

| Exception ≥50% inside 25–45% all-$ | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- |
| proven $ | 1–5 -13u / -75.2% | 1–5 -13u / -75.2% | 4–12 -13u / -37.7% | 1–9 -20u / -82.5% | 21–16 +18u / +20.8% |
| Q$ (WR−50)×$ | 1–10 -29u / -74.8% | 2–12 -31u / -66.8% | 6–22 -40u / -53.5% | 2–18 -42u / -72.9% | 29–27 +4u / +2.6% |
| contrib share | 0–7 -21u / -100% | 4–12 -23u / -50.1% | 9–23 -30u / -39.9% | 6–19 -35u / -56.4% | 23–32 -9u / -6.8% |
| smart $ | 1–5 -13u / -75.2% | 2–5 -10u / -49.3% | 5–10 -5u / -16% | 2–7 -12u / -53.9% | 21–13 +26u / +30.9% |
| v12 quality $ | 2–12 -33u / -77.5% | 6–16 -33u / -50.5% | 11–25 -40u / -42.6% | 7–21 -42u / -54.7% | 27–28 -15u / -10.9% |
| walletBase×$ | 1–2 +0u / +1.5% | 2–3 +1u / +3.4% | 2–6 -5u / -27.6% | 2–5 -4u / -23.8% | 7–8 +0u / +1.1% |

What each exception **keeps under 25% all-$** (junk-against test):

| Exception ≥50% inside <25% all-$ | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- |
| proven $ | 4–2 +6u / +31.8% | 5–2 +12u / +50.2% | 13–4 +26u / +50% | 10–3 +21u / +52.1% | 28–12 +50u / +40.7% |
| Q$ (WR−50)×$ | 5–3 +1u / +4.3% | 6–3 +7u / +20.9% | 16–6 +29u / +39% | 13–5 +23u / +38.7% | 31–17 +41u / +25.8% |
| contrib share | 5–3 +7u / +23.9% | 6–5 +7u / +17% | 16–9 +27u / +35.2% | 13–8 +21u / +33.6% | 24–17 +24u / +19.4% |
| smart $ | 4–1 +7u / +39.1% | 5–1 +13u / +56.7% | 13–4 +26u / +50% | 10–3 +21u / +52.1% | 27–12 +47u / +39.9% |
| v12 quality $ | 7–5 +3u / +5.9% | 8–7 +3u / +4.6% | 19–12 +21u / +21.3% | 15–11 +13u / +15.8% | 34–18 +50u / +31.8% |
| walletBase×$ | — | 0–1 -3u / -100% | 1–1 -2u / -49.3% | 1–1 -2u / -49.3% | 1–1 -2u / -49.3% |

## 8. Mute-below-X on Q$ / contrib / smart (floor on the quality board)

**Mute Q$ < X**

| Mute Q$ < X | T | Aug 24+ | v12 |
| --- | --- | --- | --- |
| <25% | cut 6–11 -11u · save +11 · keep +42u · n=17 | cut 10–17 -15u · save +15 · keep +51u · n=27 | cut 46–78 -52u · save +52 · keep +197u · n=124 |
| <40% | cut 9–15 -8u · save +8 · keep +40u · n=24 | cut 13–24 -24u · save +24 · keep +59u · n=37 | cut 56–98 -70u · save +70 · keep +216u · n=154 |
| <45% | cut 10–16 -8u · save +8 · keep +40u · n=26 | cut 15–25 -21u · save +21 · keep +57u · n=40 | cut 61–104 -66u · save +66 · keep +211u · n=165 |
| <50% | cut 11–18 -12u · save +12 · keep +44u · n=29 | cut 16–27 -25u · save +25 · keep +61u · n=43 | cut 64–108 -70u · save +70 · keep +215u · n=172 |
| <60% | cut 14–21 -9u · save +9 · keep +41u · n=35 | cut 20–31 -21u · save +21 · keep +56u · n=51 | cut 70–119 -78u · save +78 · keep +223u · n=189 |

**Mute contrib < X**

| Mute contrib < X | T | Aug 24+ | v12 |
| --- | --- | --- | --- |
| <25% | cut 3–2 -3u · save +3 · keep +34u · n=5 | cut 4–3 -4u · save +4 · keep +40u · n=7 | cut 39–30 +10u · save -10 · keep +135u · n=69 |
| <40% | cut 9–11 -15u · save +15 · keep +47u · n=20 | cut 12–18 -25u · save +25 · keep +61u · n=30 | cut 83–76 +1u · save -1 · keep +144u · n=159 |
| <45% | cut 13–14 -15u · save +15 · keep +47u · n=27 | cut 16–22 -27u · save +27 · keep +62u · n=38 | cut 104–93 +17u · save -17 · keep +128u · n=197 |
| <50% | cut 16–19 -15u · save +15 · keep +47u · n=35 | cut 20–28 -26u · save +26 · keep +62u · n=48 | cut 126–116 +24u · save -24 · keep +121u · n=242 |
| <60% | cut 27–25 +2u · save -2 · keep +30u · n=52 | cut 35–40 -22u · save +22 · keep +57u · n=75 | cut 200–164 +69u · save -69 · keep +76u · n=364 |

**Mute smart $ < X**

| Mute smart $ < X | T | Aug 24+ | v12 |
| --- | --- | --- | --- |
| <25% | cut 9–13 -10u · save +10 · keep +42u · n=22 | cut 12–18 -8u · save +8 · keep +43u · n=30 | cut 47–66 -20u · save +20 · keep +166u · n=113 |
| <40% | cut 15–21 -14u · save +14 · keep +46u · n=36 | cut 22–31 -16u · save +16 · keep +51u · n=53 | cut 72–91 -18u · save +18 · keep +163u · n=163 |
| <45% | cut 17–24 -19u · save +19 · keep +51u · n=41 | cut 25–36 -24u · save +24 · keep +59u · n=61 | cut 76–101 -39u · save +39 · keep +185u · n=177 |
| <50% | cut 20–26 -17u · save +17 · keep +49u · n=46 | cut 28–40 -30u · save +30 · keep +66u · n=68 | cut 85–110 -49u · save +49 · keep +194u · n=195 |
| <60% | cut 22–32 -30u · save +30 · keep +61u · n=54 | cut 31–51 -52u · save +52 · keep +87u · n=82 | cut 104–144 -92u · save +92 · keep +237u · n=248 |

## 9. Two-axis: all-$ band × Q$ ≥50 (does quality flip the board?)

**Aug 24+**

| All-$ band | all | Q$ ≥50% | Q$ <50% | smart ≥50% | smart <50% | contrib ≥50% | contrib <50% |
| --- | --- | --- | --- | --- | --- | --- | --- |
| all 0–15% | 7–8 -4u / -9.1% | 5–4 -1u / -2.1% | 2–4 -4u / -22.6% | 4–2 +5u / +22.4% | 3–6 -9u / -33.1% | 4–4 +5u / +22% | 3–4 -9u / -36% |
| all 15–25% | 11–7 +18u / +35.6% | 8–1 +24u / +84.6% | 3–4 -3u / -14.9% | 6–1 +16u / +85% | 5–6 +2u / +6.2% | 9–4 +16u / +40.1% | 2–3 +2u / +18.5% |
| all 25–45% | 9–28 -51u / -52.2% | 2–18 -42u / -72.9% | 6–9 -8u / -23.4% | 2–7 -12u / -53.9% | 7–20 -36u / -49.7% | 6–19 -35u / -56.4% | 3–9 -16u / -44.7% |
| all 45–60% | 21–22 -7u / -5.6% | 18–9 +18u / +22.2% | 1–7 -13u / -56.5% | 13–17 -13u / -15.6% | 8–5 +6u / +11.9% | 18–13 +10u / +10.7% | 3–9 -17u / -47.9% |
| all ≥60% | 92–48 +80u / +18.7% | 81–39 +79u / +20.9% | 4–3 +3u / +20.5% | 86–44 +72u / +17.7% | 5–3 +7u / +40.3% | 83–45 +66u / +16.5% | 9–3 +14u / +47.1% |

**T**

| All-$ band | all | Q$ ≥50% | Q$ <50% | smart ≥50% | smart <50% |
| --- | --- | --- | --- | --- | --- |
| all 0–15% | 3–5 -8u / -29.5% | 2–3 -8u / -42.2% | 1–2 0u / -5.3% | 2–1 +0u / +4% | 1–4 -8u / -48.6% |
| all 15–25% | 7–4 +11u / +29.3% | 4–0 +15u / +87.6% | 3–3 -2u / -10.3% | 3–0 +13u / +97.2% | 4–4 -2u / -6.7% |
| all 25–45% | 7–20 -37u / -47.1% | 2–12 -31u / -66.8% | 4–7 -5u / -19.5% | 2–5 -10u / -49.3% | 5–14 -25u / -43.5% |
| all 45–60% | 14–14 +8u / +9.3% | 12–7 +16u / +25.7% | 1–4 -5u / -34.6% | 6–11 -6u / -12% | 8–3 +14u / +35.8% |
| all ≥60% | 50–23 +58u / +24.8% | 44–18 +61u / +29.9% | 2–2 +1u / +12.1% | 47–22 +53u / +23.4% | 2–1 +4u / +53.3% |

## 10. Combined mute language (quality inside the dead pile)

| If we mute… | Last 7 | T | Steam | Aug 24+ | v12 |
| --- | --- | --- | --- | --- | --- |
| Mute all ≤45% | cut 12–20 -28u · save +28 · keep +1u · n=32 | cut 17–29 -35u · save +35 · keep +67u · n=46 | cut 35–50 -29u · save +29 · keep +74u · n=85 | cut 27–43 -37u · save +37 · keep +72u · n=70 | cut 94–94 +28u · save -28 · keep +117u · n=188 |
| Mute ≤45 except proven ≥50% | cut 7–13 -22u · save +22 · keep -6u · n=20 | cut 11–22 -34u · save +34 · keep +66u · n=33 | cut 18–34 -42u · save +42 · keep +87u · n=52 | cut 16–31 -38u · save +38 · keep +74u · n=47 | cut 45–66 -40u · save +40 · keep +186u · n=111 |
| Mute ≤45 except Q$ ≥50% | cut 6–7 -1u · save +1 · keep -26u · n=13 | cut 9–14 -11u · save +11 · keep +43u · n=23 | cut 13–22 -18u · save +18 · keep +63u · n=35 | cut 12–20 -19u · save +19 · keep +54u · n=32 | cut 34–50 -16u · save +16 · keep +162u · n=84 |
| Mute ≤45 except Q$ ≥60% | cut 7–7 +5u · save -5 · keep -32u · n=14 | cut 10–16 -11u · save +11 · keep +43u · n=26 | cut 15–25 -18u · save +18 · keep +63u · n=40 | cut 13–23 -19u · save +19 · keep +54u · n=36 | cut 36–58 -23u · save +23 · keep +168u · n=94 |
| Mute ≤45 except smart ≥50% | cut 7–14 -23u · save +23 · keep -5u · n=21 | cut 10–23 -38u · save +38 · keep +70u · n=33 | cut 17–36 -50u · save +50 · keep +95u · n=53 | cut 15–33 -46u · save +46 · keep +82u · n=48 | cut 46–69 -44u · save +44 · keep +190u · n=115 |
| Mute ≤45 except contrib ≥50% | cut 7–10 -13u · save +13 · keep -14u · n=17 | cut 7–12 -18u · save +18 · keep +50u · n=19 | cut 10–18 -26u · save +26 · keep +71u · n=28 | cut 8–16 -23u · save +23 · keep +58u · n=24 | cut 47–45 +13u · save -13 · keep +132u · n=92 |
| Mute 25–45 always; <25 keep Q$ ≥50% | cut 7–17 -29u · save +29 · keep +2u · n=24 | cut 11–26 -42u · save +42 · keep +74u · n=37 | cut 19–44 -58u · save +58 · keep +103u · n=63 | cut 14–38 -60u · save +60 · keep +96u · n=52 | cut 63–77 -12u · save +12 · keep +158u · n=140 |
| Mute 25–45 always; <25 keep proven ≥50% | cut 8–18 -34u · save +34 · keep +7u · n=26 | cut 12–27 -47u · save +47 · keep +79u · n=39 | cut 22–46 -55u · save +55 · keep +100u · n=68 | cut 17–40 -58u · save +58 · keep +93u · n=57 | cut 66–82 -22u · save +22 · keep +167u · n=148 |
| Mute 25–45 AND junkAg <80% (keep high-junk contested) | cut 2–7 -17u · save +17 · keep -10u · n=9 | cut 5–13 -23u · save +23 · keep +55u · n=18 | cut 8–18 -32u · save +32 · keep +77u · n=26 | cut 7–15 -26u · save +26 · keep +61u · n=22 | cut 14–28 -34u · save +34 · keep +180u · n=42 |
| Mute 25–45 always | cut 3–14 -34u · save +34 · keep +7u · n=17 | cut 7–20 -38u · save +38 · keep +70u · n=27 | cut 13–34 -51u · save +51 · keep +96u · n=47 | cut 9–28 -51u · save +51 · keep +86u · n=37 | cut 41–50 -12u · save +12 · keep +158u · n=91 |
| Mute Q$ <45% | cut 6–7 +4u · save -4 · keep -31u · n=13 | cut 10–16 -8u · save +8 · keep +40u · n=26 | cut 16–35 -36u · save +36 · keep +81u · n=51 | cut 15–25 -21u · save +21 · keep +57u · n=40 | cut 61–104 -66u · save +66 · keep +211u · n=165 |
| Mute Q$ <50% | cut 6–9 -3u · save +3 · keep -24u · n=15 | cut 11–18 -12u · save +12 · keep +44u · n=29 | cut 17–37 -40u · save +40 · keep +85u · n=54 | cut 16–27 -25u · save +25 · keep +61u · n=43 | cut 64–108 -70u · save +70 · keep +215u · n=172 |
| Mute smart <45% | cut 11–15 -13u · save +13 · keep -14u · n=26 | cut 17–24 -19u · save +19 · keep +51u · n=41 | cut 28–43 -36u · save +36 · keep +81u · n=71 | cut 25–36 -24u · save +24 · keep +59u · n=61 | cut 76–101 -39u · save +39 · keep +185u · n=177 |

## 11. Tickets — junk-against vs fake-save with quality columns (Aug 24+)

**Junk-against: all <25% AND proven ≥50%** n=13 · 10–3 +21u / +52.1%

| Date | Mkt | Side | u | W/L | all | prov | Q$ | smart | contrib | junkAg | WR50ag | EDGE | qConv |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-24 | MLB ML | Seattle Mariners | 1 | W | 21% | 100% | 100% | 100% | 100% | 100% | 0% | -4.4 | -11.7 |
| 2026-08-24 | MLB TOTAL | Under 10.5 | 1 | L | 10% | 59% | 100% | 59% | 59% | 100% | 0% | 5.4 | 23.3 |
| 2026-08-26 | MLB ML | Atlanta Braves | 1 | W | 17% | 79% | 95% | 82% | 60% | 100% | 1% | -0.0 | -49.0 |
| 2026-08-26 | MLB SPREAD | Atlanta Braves | 3 | W | 24% | 100% | 100% | 100% | 74% | 100% | 0% | 1.7 | -2.8 |
| 2026-08-27 | MLB TOTAL | Under 9.5 | 4 | W | 4% | 100% | 100% | 100% | 3% | 100% | 0% | 12.8 | 0.2 |
| 2026-08-30 | WNBA ML | Golden State Valkyries | 6 | W | 11% | 100% | 100% | 100% | 62% | 100% | 0% | 32.8 | 151.6 |
| 2026-09-04 | MLB TOTAL | Over 11.5 | 5 | W | 24% | 100% | 100% | 100% | 81% | 100% | 0% | 11.7 | -1.1 |
| 2026-09-11 | MLB ML | Arizona Diamondbacks | 4 | W | 20% | 92% | 100% | 92% | 56% | 100% | 0% | 10.7 | 10.5 |
| 2026-09-12 | MLB ML | Washington Nationals | 4 | W | 23% | 79% | 100% | 78% | 63% | 100% | 0% | 14.7 | 11.8 |
| 2026-09-12 | CFB TOTAL | Under 48.5 | 2 | L | 23% | 100% | — | 23% | 30% | 100% | 100% | 26.9 | 13.0 |
| 2026-09-12 | MLB TOTAL | Under 9.5 | 4 | W | 14% | 69% | 100% | 69% | 33% | 100% | 0% | 14.8 | 10.8 |
| 2026-09-14 | MLB TOTAL | Under 8.5 | 2 | W | 9% | 52% | 86% | 52% | 40% | 93% | 7% | 2.3 | 13.7 |
| 2026-09-16 | MLB TOTAL | Under 8.5 | 3 | L | 11% | 100% | 100% | 27% | 67% | 100% | 22% | 4.5 | 1.3 |

**Fake save: all 25–45% AND proven ≥50%** n=10 · 1–9 -20u / -82.5%

| Date | Mkt | Side | u | W/L | all | prov | Q$ | smart | contrib | junkAg | WR50ag | EDGE | qConv |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-24 | MLB ML | San Diego Padres | 1 | L | 33% | 97% | 100% | 97% | 47% | 100% | 0% | 3.3 | 4.3 |
| 2026-08-24 | MLB TOTAL | Over 7.5 | 1 | L | 40% | 100% | 100% | 38% | 95% | 100% | 100% | -2.9 | -9.9 |
| 2026-08-28 | MLB ML | Chicago Cubs | 1 | L | 36% | 100% | 100% | 100% | 71% | 100% | 0% | 2.3 | -2.1 |
| 2026-08-30 | MLB ML | New York Mets | 4 | L | 43% | 100% | 69% | 30% | 79% | 100% | 100% | 14.3 | 6.2 |
| 2026-09-11 | MLB TOTAL | Under 7.5 | 4 | L | 29% | 100% | 100% | 100% | 76% | 100% | 0% | 11.1 | 6.0 |
| 2026-09-13 | NFL SPREAD | Bills | 2 | W | 27% | 86% | — | 86% | 18% | 100% | 5% | -5.5 | -0.8 |
| 2026-09-14 | MLB TOTAL | Under 10.5 | 3.75 | L | 37% | 99% | 100% | 99% | 69% | 100% | 0% | 5.9 | 53.4 |
| 2026-09-15 | MLB TOTAL | Under 11.5 | 2 | L | 33% | 100% | 100% | 100% | 75% | 100% | 0% | -1.9 | 9.1 |
| 2026-09-16 | MLB ML | Pittsburgh Pirates | 3 | L | 34% | 86% | 95% | 86% | 45% | 95% | 5% | 4.4 | -23.3 |
| 2026-09-16 | MLB TOTAL | Under 11.5 | 2 | L | 37% | 91% | 100% | 91% | 36% | 100% | 0% | 3.0 | 12.0 |

## 12. ROI by fine band, Aug 24+ — which metric is actually directional?

| Band | all $ | proven $ | Q$ (WR−50)×$ | contrib share | smart $ | v12 quality $ | walletBase×$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0–15% | -9.1% · 7–8 n=15 | -24.4% · 7–14 n=21 | -19.7% · 8–12 n=20 | 1–1 -2u / -21.9% n=2 | -6.4% · 7–11 n=18 | -41.8% · 5–10 n=15 | -11.5% · 7–11 n=18 |
| 15–20% | +43% · 4–2 n=6 | +17.3% · 5–4 n=9 | -31.7% · 1–3 n=4 | +121.8% · 3–0 n=3 | +49.3% · 4–2 n=6 | 0–1 -1u / -100% n=1 | +10.3% · 3–4 n=7 |
| 20–25% | +31.6% · 7–5 n=12 | -54.7% · 1–4 n=5 | -36.6% · 1–2 n=3 | 0–2 -10u / -100% n=2 | -59.5% · 1–5 n=6 | -26.2% · 2–2 n=4 | +22.4% · 10–6 n=16 |
| 25–30% | -57.9% · 3–5 n=8 | -80.1% · 1–2 n=3 | — | -75.2% · 1–4 n=5 | -80.6% · 2–5 n=7 | 2–0 +7u / +118.9% n=2 | -93.4% · 1–9 n=10 |
| 30–35% | -39.2% · 2–8 n=10 | +31.2% · 6–3 n=9 | -43.9% · 1–3 n=4 | -6.4% · 4–4 n=8 | +30.8% · 4–3 n=7 | 0–1 -3u / -100% n=1 | -26.7% · 1–4 n=5 |
| 35–40% | -48.3% · 3–10 n=13 | -41.1% · 1–4 n=5 | -18.4% · 2–4 n=6 | -37% · 3–7 n=10 | +6.7% · 4–5 n=9 | 2–0 +9u / +121.7% n=2 | -32.5% · 2–4 n=6 |
| 40–45% | -72.3% · 1–5 n=6 | -62.4% · 2–5 n=7 | +31.8% · 2–1 n=3 | -5.7% · 4–4 n=8 | -39.9% · 3–5 n=8 | -16.1% · 2–3 n=5 | -28.8% · 3–5 n=8 |
| 45–50% | +10.5% · 10–6 n=16 | +32.6% · 4–4 n=8 | -46.2% · 1–2 n=3 | +1.6% · 4–6 n=10 | -25.4% · 3–4 n=7 | +11.6% · 2–3 n=5 | -62.6% · 3–9 n=12 |
| 50–60% | -14.3% · 11–16 n=27 | -46% · 4–9 n=13 | +21% · 4–4 n=8 | +5.3% · 15–12 n=27 | -62.4% · 3–11 n=14 | -62.2% · 2–7 n=9 | +9.1% · 11–9 n=20 |
| 60–80% | +47.6% · 28–8 n=36 | +55.7% · 22–5 n=27 | -11.3% · 9–10 n=19 | +11.9% · 48–38 n=86 | +62.7% · 21–4 n=25 | -20.2% · 14–16 n=30 | +53.7% · 27–8 n=35 |
| 80–100% | +8.6% · 64–40 n=104 | +9.2% · 84–57 n=141 | +16.6% · 101–57 n=158 | +9.7% · 57–35 n=92 | +8.2% · 87–56 n=143 | +20.5% · 95–57 n=152 | +8.3% · 72–44 n=116 |

## 13. Median all-$ inside each Q$ band (is Q$ just majority boards again?)

| Q$ band | Aug 24+ | T | v12 |
| --- | --- | --- | --- |
| 0–15% | n=20 · all 32% · prov 22% · 8–12 -9u / -19.7% | n=12 · all 34% · prov 14% · 4–8 -7u / -22% | n=98 · all 48% · prov 14% · 38–60 -39u / -16.5% |
| 15–20% | n=4 · all 31% · prov 20% · 1–3 -3u / -31.7% | n=2 · all 31% · prov 31% · 1–1 +0u / +2.5% | n=16 · all 54% · prov 30% · 6–10 +2u / +5.5% |
| 20–25% | n=3 · all 25% · prov 13% · 1–2 -4u / -36.6% | n=3 · all 25% · prov 13% · 1–2 -4u / -36.6% | n=10 · all 48% · prov 26% · 2–8 -15u / -59.1% |
| 25–30% | — | — | n=8 · all 51% · prov 36% · 4–4 -3u / -12.1% |
| 30–35% | n=4 · all 51% · prov 21% · 1–3 -5u / -43.9% | n=3 · all 59% · prov 15% · 1–2 -1u / -14% | n=8 · all 49% · prov 55% · 2–6 -5u / -22.7% |
| 35–40% | n=6 · all 30% · prov 31% · 2–4 -3u / -18.4% | n=4 · all 30% · prov 13% · 2–2 +4u / +31.3% | n=14 · all 50% · prov 50% · 4–10 -11u / -36.5% |
| 40–45% | n=3 · all 52% · prov 45% · 2–1 +3u / +31.8% | n=2 · all 46% · prov 31% · 1–1 +0u / +0% | n=11 · all 58% · prov 28% · 5–6 +5u / +25.8% |
| 45–50% | n=3 · all 39% · prov 34% · 1–2 -4u / -46.2% | n=3 · all 39% · prov 34% · 1–2 -4u / -46.2% | n=7 · all 39% · prov 42% · 3–4 -4u / -19% |
| 50–60% | n=8 · all 45% · prov 46% · 4–4 +5u / +21% | n=6 · all 41% · prov 40% · 3–3 +3u / +17.6% | n=17 · all 39% · prov 46% · 6–11 -8u / -19.6% |
| 60–80% | n=19 · all 50% · prov 44% · 9–10 -7u / -11.3% | n=13 · all 49% · prov 44% · 5–8 -13u / -31.5% | n=47 · all 56% · prov 58% · 27–20 +11u / +8.4% |
| 80–100% | n=158 · all 86% · prov 100% · 101–57 +82u / +16.6% | n=85 · all 76% · prov 96% · 56–29 +64u / +22.1% | n=732 · all 95% · prov 100% · 437–295 +229u / +10.7% |

