# Sharp Wallet Roster

Generated: 8/11/2026, 4:08:59 AM ET · V8 cutover: 2026-04-18 · whitelistVersion: 2

Every sharp wallet we have V8-era data on, sorted by combined conviction score. This is the **full roster** (no minimum-bets filter) — noisy at the tail, but that's the point for a tracking dataset. Verdict column reflects the ≥3-bet threshold.

> **Promotion policy (v2, continuous gate)**: rebuilt every 2h via `grade-sharp-actions`. Tier = CONFIRMED if flat-positive in either source AND $-positive in B; FLAT if flat-positive in either source; WR50 if WR ≥ 50% in either source. Source A min 2 bets, Source-B-only min 5 bets. `whitelistSource` (A/A+B/B) attributes which path drove each promotion. Roll-back: set `B_ONLY_MIN_BETS = Infinity` in `scripts/exportWalletProfiles.js`.

> **TAPE / beats-the-close**: every profile carries `clvSkill.pctPos` — causal % of graded positions with CLV > 0 since 2026-04-01 (min n=5). Same definition as `walletClvSkill.js` / netCLV. Rebuilt every cycle. Coverage this run: **231/393** wallets scored · mean **59.7%**.

**Roster breakdown by verdict:**

- POSITIONS_ONLY_NEGATIVE: 102
- INCONCLUSIVE: 81
- POSITIONS_ONLY_POSITIVE: 74
- CONFIRMED_BLEEDER: 56
- CONFIRMED_WINNER: 34
- MIXED_PICKS_BAD_$_GOOD: 30
- MIXED_PICKS_GOOD_$_BAD: 16

## Full roster

| Wallet | Verdict | Tier | Rank | A: N | A: WR% | A: flat ROI | A: flat PnL (u) | B: N | B: WR% | B: $ ROI | B: $ PnL | Base | roiNorm | LifetimeROI |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 06c80c | CONFIRMED_WINNER | ELITE | 11 | 5 | 100% | +94.9% | +4.75 | 88 | 37.5% | +13.4% | +2735814 | 50 | 0 | 1.7% |
| 913987 | CONFIRMED_WINNER | ELITE | 44 | 30 | 66.7% | +26.7% | +8.00 | 89 | 61.8% | +28.2% | +1461331 | 84.3 | 80.8 | 12% |
| 388d4c | CONFIRMED_WINNER | ELITE | 26 | 5 | 100% | +59.1% | +2.96 | 94 | 41.5% | +48.7% | +1337056 | 67.4 | 53.4 | 4.4% |
| 52aeeb | CONFIRMED_WINNER | ELITE | 62 | 23 | 52.2% | +11.7% | +2.69 | 205 | 50.2% | +16.7% | +728162 | 55.6 | 35.5 | 2.3% |
| 8bbab3 | CONFIRMED_WINNER | ELITE | 24 | 4 | 50% | +5.8% | +0.23 | 22 | 36.4% | +26.9% | +686069 | 81.2 | 72.3 | 8.3% |
| ad4d8b | CONFIRMED_WINNER | ELITE | 246 | 3 | 66.7% | +27.1% | +0.81 | 23 | 52.2% | +73.9% | +556537 | 35.4 | 29.8 | 1.7% |
| 11b032 | CONFIRMED_WINNER | ELITE | 86 | 4 | 100% | +113.8% | +4.55 | 16 | 75% | +93.7% | +514430 | 83.2 | 84.7 | 14.9% |
| f0fec8 | CONFIRMED_WINNER | ELITE | 135 | 4 | 75% | +32.3% | +1.29 | 8 | 87.5% | +59.1% | +378865 | 68.5 | 68.6 | 7.2% |
| 4d2125 | CONFIRMED_WINNER | ELITE | 197 | 10 | 70% | +37.7% | +3.77 | 111 | 54.1% | +22.1% | +349396 | 36.2 | 19.1 | 1.3% |
| a10ff5 | CONFIRMED_WINNER | ELITE | 408 | 38 | 65.8% | +24.2% | +9.20 | 183 | 59% | +18.1% | +271658 | 29 | 41.4 | 2.9% |
| f83ab0 | CONFIRMED_WINNER | ELITE | 153 | 4 | 75% | +39.6% | +1.59 | 15 | 66.7% | +37.4% | +295063 | 77.1 | 85.1 | 16% |
| bc8b21 | CONFIRMED_WINNER | ELITE | 21 | 4 | 75% | +53% | +2.12 | 38 | 39.5% | +36.5% | +261315 | 50 | 0 | 5.2% |
| 0cd77e | CONFIRMED_WINNER | ELITE | 219 | 91 | 59.3% | +12.9% | +11.77 | 251 | 55.4% | +9.9% | +127057 | 44.6 | 40.8 | 3% |
| e05213 | CONFIRMED_WINNER | ELITE | 531 | 7 | 71.4% | +37.7% | +2.64 | 57 | 59.6% | +7.9% | +190100 | 26.5 | 37.4 | 2.4% |
| 955c26 | CONFIRMED_WINNER | ELITE | 22 | 6 | 66.7% | +5.5% | +0.33 | 40 | 45% | +18.9% | +206995 | 51.3 | 67.3 | 6.7% |
| 7923c4 | CONFIRMED_WINNER | ELITE | 68 | 84 | 59.5% | +14.5% | +12.20 | 416 | 52.4% | +0.6% | +87366 | 56.9 | 37.6 | 2.6% |
| 5b1e50 | CONFIRMED_WINNER | ELITE | — | 101 | 63.4% | +15.4% | +15.59 | 813 | 49.8% | +4% | +47994 | 8.8 | 13.6 | 4.1% |
| 78e8f1 | CONFIRMED_WINNER | ELITE | 142 | 11 | 54.5% | +28.2% | +3.10 | 93 | 36.6% | +4.3% | +115974 | 60.8 | 56.7 | 4.8% |
| 5c32f2 | CONFIRMED_WINNER | ELITE | 39 | 7 | 42.9% | +21.1% | +1.48 | 48 | 35.4% | +17.3% | +91876 | 57.2 | 35.6 | 2.1% |
| 769c38 | CONFIRMED_WINNER | ELITE | 736 | 8 | 62.5% | +25% | +2.00 | 28 | 64.3% | +25.5% | +83628 | 84.3 | 83.9 | 14.2% |
| f2d227 | CONFIRMED_WINNER | ELITE | 30 | 16 | 62.5% | +6.8% | +1.09 | 169 | 57.4% | +1.2% | +88030 | 62.8 | 42.7 | 3% |
| 8c1eae | CONFIRMED_WINNER | ELITE | 330 | 50 | 58% | +14% | +7.00 | 226 | 48.7% | +4.1% | +25121 | 42.2 | 52.7 | 4% |
| 491f30 | CONFIRMED_WINNER | ELITE | — | 25 | 68% | +32.8% | +8.20 | 106 | 50.9% | +1.5% | +12242 | 63.2 | 95.9 | 41.1% |
| bd2d54 | CONFIRMED_WINNER | ELITE | 28 | 3 | 100% | +59.3% | +1.78 | 56 | 48.2% | +1.4% | +75080 | 46.7 | 31.9 | 2% |
| cdb33b | CONFIRMED_WINNER | ELITE | 273 | 11 | 36.4% | +9.2% | +1.01 | 140 | 40.7% | +9.3% | +78873 | 50.8 | 47.1 | 3.6% |
| dfa240 | CONFIRMED_WINNER | ELITE | 428 | 13 | 53.8% | +2.2% | +0.28 | 103 | 49.5% | +26% | +75795 | 34.4 | 50.8 | 3.9% |
| fec67e | CONFIRMED_WINNER | ELITE | — | 4 | 75% | +36% | +1.44 | 48 | 64.6% | +25.6% | +53488 | 55.8 | 84.6 | 15.4% |
| b839b3 | CONFIRMED_WINNER | ELITE | — | 23 | 69.6% | +21.8% | +5.02 | 179 | 56.4% | +6.3% | +8518 | 65.1 | 97.2 | 49.6% |
| b70f9a | CONFIRMED_WINNER | ELITE | 113 | 3 | 100% | +41.1% | +1.23 | 22 | 54.5% | +45.9% | +33885 | 38.3 | 15.1 | 1.1% |
| 7b4652 | CONFIRMED_WINNER | ELITE | — | 4 | 100% | +33.3% | +1.33 | 83 | 65.1% | +35% | +30423 | 59.6 | 88.6 | 24.4% |
| 4b912c | CONFIRMED_WINNER | ELITE | 357 | 36 | 52.8% | +4.6% | +1.64 | 331 | 50.5% | +11.1% | +22573 | 21.3 | 23.9 | 1.5% |
| 12c933 | CONFIRMED_WINNER | ELITE | 356 | 4 | 75% | +18.6% | +0.74 | 47 | 61.7% | +11.8% | +26374 | 46.9 | 68.7 | 7.5% |
| 7dd2e5 | CONFIRMED_WINNER | PROVEN | — | 13 | 84.6% | +17.4% | +2.26 | 14 | 85.7% | +24.1% | +10372 | 0.2 | 0 | 0% |
| a1684d | CONFIRMED_WINNER | ELITE | 257 | 5 | 80% | +27.9% | +1.40 | 27 | 51.9% | +31.6% | +8947 | 53.2 | 63 | 5.7% |
| c91057 | POSITIONS_ONLY_POSITIVE | ELITE | 46 | 0 | — | — | +0.00 | 7 | 85.7% | +73.3% | +3503240 | — | — | — |
| ccbe3d | POSITIONS_ONLY_POSITIVE | ELITE | 128 | 2 | 0% | -100% | -2.00 | 21 | 76.2% | +39.4% | +1403883 | 80.6 | 76.2 | 9.4% |
| e1f804 | POSITIONS_ONLY_POSITIVE | ELITE | 31 | 0 | — | — | +0.00 | 30 | 76.7% | +33.4% | +1353639 | — | — | — |
| 880232 | POSITIONS_ONLY_POSITIVE | ELITE | 58 | 2 | 100% | +90.9% | +1.82 | 28 | 64.3% | +30.3% | +973331 | 46.5 | 74 | 8.6% |
| 28658e | POSITIONS_ONLY_POSITIVE | ELITE | 146 | 0 | — | — | +0.00 | 4 | 100% | +101.6% | +979408 | — | — | — |
| bfe3bc | POSITIONS_ONLY_POSITIVE | ELITE | 154 | 0 | — | — | +0.00 | 4 | 75% | +93.3% | +932808 | — | — | — |
| 308a06 | POSITIONS_ONLY_POSITIVE | ELITE | 46 | 2 | 100% | +59.7% | +1.19 | 15 | 80% | +64.9% | +801953 | 80.9 | 82.1 | 29.9% |
| 799fad | POSITIONS_ONLY_POSITIVE | ELITE | 323 | 2 | 50% | +187.5% | +3.75 | 9 | 77.8% | +63.1% | +714883 | 43.2 | 49.2 | 3.3% |
| e2cbd0 | POSITIONS_ONLY_POSITIVE | ELITE | 47 | 0 | — | — | +0.00 | 4 | 75% | +79.6% | +706908 | — | — | — |
| 544654 | POSITIONS_ONLY_POSITIVE | ELITE | 97 | 0 | — | — | +0.00 | 6 | 100% | +100.8% | +599557 | — | — | — |
| f9a165 | POSITIONS_ONLY_POSITIVE | ELITE | 64 | 0 | — | — | +0.00 | 4 | 50% | +70.8% | +534175 | — | — | — |
| c5cea1 | POSITIONS_ONLY_POSITIVE | ELITE | 50 | 1 | 0% | -100% | -1.00 | 17 | 82.4% | +56.4% | +507420 | 51.2 | 21.4 | 1.4% |
| 33aa70 | POSITIONS_ONLY_POSITIVE | ELITE | 632 | 0 | — | — | +0.00 | 5 | 60% | +158.1% | +487132 | — | — | — |
| 461220 | POSITIONS_ONLY_POSITIVE | ELITE | 45 | 0 | — | — | +0.00 | 8 | 62.5% | +139.1% | +392075 | — | — | — |
| 3ed033 | POSITIONS_ONLY_POSITIVE | ELITE | 250 | 0 | — | — | +0.00 | 4 | 75% | +154.3% | +364086 | — | — | — |
| eff402 | POSITIONS_ONLY_POSITIVE | ELITE | 130 | 0 | — | — | +0.00 | 5 | 100% | +93.3% | +337255 | — | — | — |
| eeb218 | POSITIONS_ONLY_POSITIVE | ELITE | 90 | 0 | — | — | +0.00 | 13 | 46.2% | +62.4% | +330671 | — | — | — |
| b69889 | POSITIONS_ONLY_POSITIVE | ELITE | 135 | 0 | — | — | +0.00 | 4 | 50% | +41.9% | +326849 | — | — | — |
| ff0abd | POSITIONS_ONLY_POSITIVE | ELITE | — | 1 | 0% | -100% | -1.00 | 72 | 41.7% | +32.9% | +307931 | 35.9 | 54.5 | 4.4% |
| f906da | POSITIONS_ONLY_POSITIVE | ELITE | 147 | 0 | — | — | +0.00 | 4 | 100% | +105.7% | +256124 | — | — | — |
| c4c933 | POSITIONS_ONLY_POSITIVE | ELITE | 187 | 1 | 100% | +33.3% | +0.33 | 3 | 100% | +71.2% | +236204 | 79.1 | 94 | 36.4% |
| c5fefa | POSITIONS_ONLY_POSITIVE | ELITE | 268 | 1 | 100% | +69% | +0.69 | 4 | 50% | +52.6% | +217377 | 57.2 | 69.7 | 7.7% |
| e49458 | POSITIONS_ONLY_POSITIVE | ELITE | 199 | 0 | — | — | +0.00 | 3 | 100% | +66.7% | +221803 | — | — | — |
| 335355 | POSITIONS_ONLY_POSITIVE | ELITE | 256 | 2 | 100% | +61.7% | +1.23 | 14 | 28.6% | +15.7% | +194612 | 58.1 | 75 | 9.7% |
| 6b1e01 | POSITIONS_ONLY_POSITIVE | ELITE | 215 | 1 | 100% | +89.3% | +0.89 | 11 | 63.6% | +23.8% | +193674 | 62.2 | 78.3 | 10.8% |
| e2e279 | POSITIONS_ONLY_POSITIVE | ELITE | 40 | 1 | 100% | +58.8% | +0.59 | 8 | 62.5% | +42.2% | +189673 | 79.7 | 73 | 8.8% |
| a9e5f3 | POSITIONS_ONLY_POSITIVE | ELITE | 161 | 0 | — | — | +0.00 | 5 | 60% | +37.1% | +194194 | — | — | — |
| a1be00 | POSITIONS_ONLY_POSITIVE | ELITE | 359 | 0 | — | — | +0.00 | 75 | 53.3% | +27.1% | +184788 | — | — | — |
| 8221cc | POSITIONS_ONLY_POSITIVE | ELITE | 187 | 1 | 100% | +69% | +0.69 | 4 | 50% | +72.3% | +164680 | 72.4 | 82.3 | 14% |
| d200f2 | POSITIONS_ONLY_POSITIVE | ELITE | 179 | 2 | 100% | +97% | +1.94 | 13 | 61.5% | +17.5% | +141633 | 66.8 | 61.9 | 5.4% |
| f3ec43 | POSITIONS_ONLY_POSITIVE | ELITE | 67 | 0 | — | — | +0.00 | 16 | 62.5% | +32.6% | +147648 | — | — | — |
| ebeb6d | POSITIONS_ONLY_POSITIVE | ELITE | 264 | 1 | 100% | +64.9% | +0.65 | 5 | 80% | +138.1% | +89658 | 43.6 | 46.9 | 3.5% |
| f2b814 | POSITIONS_ONLY_POSITIVE | ELITE | 409 | 1 | 100% | +27.5% | +0.27 | 9 | 100% | +7.2% | +93033 | 47 | 68.6 | 7% |
| 95618e | POSITIONS_ONLY_POSITIVE | ELITE | 163 | 2 | 50% | -6.1% | -0.12 | 45 | 62.2% | +22.1% | +88530 | 59.6 | 57.8 | 4.9% |
| c19b3c | POSITIONS_ONLY_POSITIVE | ELITE | — | 0 | — | — | +0.00 | 19 | 73.7% | +62.6% | +83099 | — | — | — |
| 816aa1 | POSITIONS_ONLY_POSITIVE | ELITE | 302 | 2 | 100% | +72.9% | +1.46 | 24 | 54.2% | +24.2% | +41155 | 56.1 | 74.9 | 9.9% |
| 2cbcf8 | POSITIONS_ONLY_POSITIVE | ELITE | — | 2 | 50% | -1% | -0.02 | 9 | 77.8% | +65.4% | +48753 | 50 | 0 | 0% |
| ca3e2a | POSITIONS_ONLY_POSITIVE | ELITE | 389 | 0 | — | — | +0.00 | 8 | 87.5% | +21.1% | +47368 | — | — | — |
| 2ceb9a | POSITIONS_ONLY_POSITIVE | ELITE | 181 | 0 | — | — | +0.00 | 10 | 70% | +57.1% | +43344 | — | — | — |
| 11bf5d | POSITIONS_ONLY_POSITIVE | ELITE | 272 | 1 | 100% | +315% | +3.15 | 3 | 33.3% | +42% | +11300 | 31.6 | 38.5 | 2.4% |
| 4a752c | POSITIONS_ONLY_POSITIVE | ELITE | 72 | 0 | — | — | +0.00 | 8 | 62.5% | +26.8% | +42359 | — | — | — |
| 0b0329 | POSITIONS_ONLY_POSITIVE | ELITE | 465 | 0 | — | — | +0.00 | 29 | 34.5% | +75.1% | +40843 | — | — | — |
| 2e75cf | POSITIONS_ONLY_POSITIVE | ELITE | 388 | 0 | — | — | +0.00 | 4 | 100% | +88.6% | +38152 | — | — | — |
| d6f293 | POSITIONS_ONLY_POSITIVE | ELITE | 77 | 1 | 0% | -100% | -1.00 | 41 | 36.6% | +33.4% | +44521 | 77.7 | 89.1 | 19% |
| 20286a | POSITIONS_ONLY_POSITIVE | ELITE | 39 | 2 | 50% | -20.6% | -0.41 | 5 | 60% | +14.5% | +35133 | 75.9 | 78.9 | 10.7% |
| 41ac37 | POSITIONS_ONLY_POSITIVE | ELITE | 425 | 0 | — | — | +0.00 | 6 | 66.7% | +27% | +30178 | — | — | — |
| 6259db | POSITIONS_ONLY_POSITIVE | ELITE | 42 | 0 | — | — | +0.00 | 4 | 75% | +2.9% | +28080 | — | — | — |
| 2bffeb | POSITIONS_ONLY_POSITIVE | ELITE | 171 | 0 | — | — | +0.00 | 13 | 53.8% | +22.4% | +23025 | — | — | — |
| b85eee | POSITIONS_ONLY_POSITIVE | ELITE | 384 | 0 | — | — | +0.00 | 23 | 60.9% | +19.3% | +22506 | — | — | — |
| cce0fd | POSITIONS_ONLY_POSITIVE | ELITE | 161 | 1 | 100% | +120% | +1.20 | 6 | 83.3% | +27.4% | +9290 | 36.7 | 17.1 | 1.1% |
| c8d4f4 | POSITIONS_ONLY_POSITIVE | ELITE | 306 | 0 | — | — | +0.00 | 4 | 75% | +139.9% | +20410 | — | — | — |
| a7a9cc | POSITIONS_ONLY_POSITIVE | ELITE | 114 | 1 | 100% | +53.2% | +0.53 | 23 | 60.9% | +4.3% | +15047 | 62.8 | 68.3 | 6.2% |
| 4a9953 | POSITIONS_ONLY_POSITIVE | ELITE | 426 | 0 | — | — | +0.00 | 11 | 63.6% | +30.3% | +17668 | — | — | — |
| 182fef | POSITIONS_ONLY_POSITIVE | ELITE | 327 | 0 | — | — | +0.00 | 4 | 75% | +37.9% | +17068 | — | — | — |
| 98e6d4 | POSITIONS_ONLY_POSITIVE | ELITE | 358 | 0 | — | — | +0.00 | 13 | 61.5% | +19.2% | +17015 | — | — | — |
| 88c556 | POSITIONS_ONLY_POSITIVE | ELITE | 353 | 0 | — | — | +0.00 | 3 | 66.7% | +42.4% | +12891 | — | — | — |
| da65dd | POSITIONS_ONLY_POSITIVE | ELITE | 412 | 2 | 50% | -1% | -0.02 | 24 | 62.5% | +19.4% | +10422 | 17.3 | 19.1 | 1.3% |
| 842db4 | POSITIONS_ONLY_POSITIVE | ELITE | 25 | 0 | — | — | +0.00 | 13 | 46.2% | +3.3% | +8829 | — | — | — |
| 6dbef5 | POSITIONS_ONLY_POSITIVE | ELITE | 68 | 0 | — | — | +0.00 | 14 | 14.3% | +16% | +7464 | — | — | — |
| 5b53d1 | POSITIONS_ONLY_POSITIVE | ELITE | 279 | 1 | 100% | +19% | +0.19 | 4 | 75% | +8.2% | +5019 | 34.6 | 36.3 | 2.5% |
| 92f6e1 | POSITIONS_ONLY_POSITIVE | ELITE | 375 | 0 | — | — | +0.00 | 10 | 100% | +26.6% | +6763 | — | — | — |
| d95348 | POSITIONS_ONLY_POSITIVE | ELITE | 194 | 0 | — | — | +0.00 | 11 | 63.6% | +12.6% | +5720 | — | — | — |
| e795e7 | POSITIONS_ONLY_POSITIVE | ELITE | — | 1 | 0% | -100% | -1.00 | 7 | 57.1% | +13% | +14596 | 59.2 | 89 | 18% |
| 221f15 | POSITIONS_ONLY_POSITIVE | ELITE | 477 | 0 | — | — | +0.00 | 5 | 80% | +3.7% | +3848 | — | — | — |
| 32b337 | POSITIONS_ONLY_POSITIVE | ELITE | 461 | 0 | — | — | +0.00 | 3 | 33.3% | +43.3% | +2875 | — | — | — |
| f67684 | POSITIONS_ONLY_POSITIVE | ELITE | — | 0 | — | — | +0.00 | 3 | 33.3% | +23.8% | +2454 | — | — | — |
| fc4582 | POSITIONS_ONLY_POSITIVE | ELITE | 167 | 2 | 50% | -8.3% | -0.17 | 8 | 62.5% | +0.7% | +4102 | 9.8 | 13.1 | 1% |
| 43e2f2 | POSITIONS_ONLY_POSITIVE | ELITE | 412 | 1 | 100% | +0% | +0.00 | 9 | 77.8% | +34.7% | +827 | 52.2 | 77.7 | 5% |
| 154dea | POSITIONS_ONLY_POSITIVE | ELITE | — | 0 | — | — | +0.00 | 4 | 50% | +50.2% | +668 | — | — | — |
| 08dd71 | POSITIONS_ONLY_POSITIVE | ELITE | 419 | 1 | 0% | -100% | -1.00 | 22 | 50% | +45.6% | +10662 | 36.2 | 51.5 | 4.1% |
| 2b2b38 | POSITIONS_ONLY_POSITIVE | ELITE | 194 | 0 | — | — | +0.00 | 14 | 28.6% | +0.4% | +279 | — | — | — |
| 67366b | POSITIONS_ONLY_POSITIVE | ELITE | — | 0 | — | — | +0.00 | 3 | 66.7% | +2.8% | +257 | — | — | — |
| 5fc79c | POSITIONS_ONLY_POSITIVE | ELITE | 177 | 0 | — | — | +0.00 | 4 | 50% | +0.3% | +19 | — | — | — |
| c71ce4 | POSITIONS_ONLY_POSITIVE | PROVEN | — | 1 | 0% | -100% | -1.00 | 3 | 66.7% | +31.9% | +9378 | 14.1 | 21.8 | 1.4% |
| 92df91 | MIXED_PICKS_GOOD_$_BAD | ELITE | 265 | 11 | 63.6% | +53.3% | +5.86 | 114 | 54.4% | -24.4% | -35518 | 46.3 | 45.8 | 3.2% |
| 69f882 | MIXED_PICKS_GOOD_$_BAD | PROVEN | — | 7 | 71.4% | +12.3% | +0.86 | 38 | 50% | -9.1% | -4622 | 31.2 | 46.9 | 3.6% |
| 7a4cdf | MIXED_PICKS_GOOD_$_BAD | ELITE | 406 | 10 | 70% | +19.9% | +1.99 | 70 | 50% | -5.9% | -37207 | 47.4 | 71.2 | 7.7% |
| b32864 | MIXED_PICKS_GOOD_$_BAD | SHARP | — | 3 | 66.7% | +13.8% | +0.41 | 49 | 36.7% | -37.3% | -24010 | 21.3 | 31.3 | 2% |
| 40d814 | MIXED_PICKS_GOOD_$_BAD | ELITE | 213 | 6 | 50% | +13.3% | +0.80 | 126 | 39.7% | -11.6% | -32719 | 30.8 | 16.5 | 1.1% |
| 95eb4c | MIXED_PICKS_GOOD_$_BAD | ELITE | 417 | 6 | 66.7% | +5.3% | +0.32 | 59 | 37.3% | -9.6% | -38103 | 12.8 | 16.3 | 1.1% |
| 8366f5 | MIXED_PICKS_GOOD_$_BAD | ELITE | 59 | 10 | 70% | +37.4% | +3.74 | 109 | 58.7% | -1.3% | -123849 | 53.5 | 31.9 | 2.1% |
| aa9fb4 | MIXED_PICKS_GOOD_$_BAD | ELITE | 479 | 3 | 100% | +75.2% | +2.26 | 17 | 35.3% | -45.5% | -124386 | 39 | 54.9 | 4.5% |
| b51a56 | MIXED_PICKS_GOOD_$_BAD | ELITE | 652 | 7 | 57.1% | +10.1% | +0.71 | 74 | 43.2% | -28% | -147352 | 84.4 | 96.7 | 46.3% |
| a9bc8a | MIXED_PICKS_GOOD_$_BAD | ELITE | 283 | 5 | 80% | +1.2% | +0.06 | 10 | 80% | -22.2% | -168265 | 61.8 | 89.7 | 21.4% |
| 2e8da5 | MIXED_PICKS_GOOD_$_BAD | ELITE | 276 | 10 | 60% | +17.6% | +1.76 | 66 | 57.6% | -8.8% | -202012 | 49.4 | 63.8 | 5.5% |
| c29d59 | MIXED_PICKS_GOOD_$_BAD | ELITE | 231 | 5 | 80% | +11.6% | +0.58 | 21 | 71.4% | -19.4% | -219228 | 55.5 | 55.9 | 4.1% |
| a6c56e | MIXED_PICKS_GOOD_$_BAD | ELITE | 15 | 3 | 66.7% | +48.3% | +1.45 | 20 | 55% | -24% | -354103 | 53.1 | 23.7 | 1.5% |
| 972768 | MIXED_PICKS_GOOD_$_BAD | ELITE | 81 | 21 | 52.4% | +15.8% | +3.16 | 93 | 50.5% | -28.4% | -382975 | 41.1 | 56.2 | 4.3% |
| cad739 | MIXED_PICKS_GOOD_$_BAD | ELITE | 337 | 3 | 100% | +73.8% | +2.21 | 16 | 37.5% | -47.9% | -510940 | 58.5 | 84.6 | 14.3% |
| bc3532 | MIXED_PICKS_GOOD_$_BAD | ELITE | 61 | 42 | 52.4% | +14.2% | +5.97 | 596 | 50.5% | -6.9% | -579048 | 39.3 | 41.9 | 2.9% |
| bd659a | INCONCLUSIVE | ELITE | 51 | 1 | 100% | +83.3% | +0.83 | 2 | 100% | +71.7% | +1516676 | 89.9 | 91.3 | 26.3% |
| 8a3b90 | INCONCLUSIVE | ELITE | 129 | 0 | — | — | +0.00 | 1 | 100% | +81.8% | +1507500 | — | — | — |
| 449ea5 | INCONCLUSIVE | ELITE | 280 | 0 | — | — | +0.00 | 1 | 100% | +52.6% | +112997 | — | — | — |
| 676762 | INCONCLUSIVE | ELITE | 409 | 0 | — | — | +0.00 | 1 | 100% | +58.7% | +93882 | — | — | — |
| 5a89de | INCONCLUSIVE | ELITE | 85 | 0 | — | — | +0.00 | 2 | 50% | +50.6% | +83869 | — | — | — |
| ec96a4 | INCONCLUSIVE | ELITE | 413 | 0 | — | — | +0.00 | 2 | 100% | +100% | +71648 | — | — | — |
| 1a19cc | INCONCLUSIVE | ELITE | 68 | 0 | — | — | +0.00 | 2 | 100% | +117.4% | +52739 | — | — | — |
| dbd7cb | INCONCLUSIVE | ELITE | 89 | 0 | — | — | +0.00 | 2 | 50% | +146.5% | +46732 | — | — | — |
| 22f091 | INCONCLUSIVE | ELITE | 445 | 1 | 0% | -100% | -1.00 | 1 | 100% | +108.3% | +53338 | 44.3 | 64.2 | 5.5% |
| 0adf43 | INCONCLUSIVE | ELITE | 154 | 0 | — | — | +0.00 | 1 | 100% | +108.3% | +31200 | — | — | — |
| 482036 | INCONCLUSIVE | ELITE | 247 | 0 | — | — | +0.00 | 2 | 100% | +138.1% | +27620 | — | — | — |
| 5b5c69 | INCONCLUSIVE | ELITE | — | 1 | 100% | +90.9% | +0.91 | 2 | 100% | +27.5% | +12210 | 18.6 | 27.1 | 1.7% |
| 7eb6e9 | INCONCLUSIVE | ELITE | 385 | 0 | — | — | +0.00 | 1 | 100% | +132.6% | +18753 | — | — | — |
| c55aac | INCONCLUSIVE | ELITE | 171 | 0 | — | — | +0.00 | 2 | 100% | +81.8% | +18462 | — | — | — |
| f4d85a | INCONCLUSIVE | ELITE | 407 | 0 | — | — | +0.00 | 2 | 100% | +85.2% | +18230 | — | — | — |
| f1a114 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 1 | 100% | +29% | +16791 | — | — | — |
| dbc4a7 | INCONCLUSIVE | ELITE | 417 | 0 | — | — | +0.00 | 1 | 100% | +69.5% | +16400 | — | — | — |
| ad79e0 | INCONCLUSIVE | SHARP | — | 0 | — | — | +0.00 | 1 | 100% | +194.1% | +14295 | — | — | — |
| 5c2194 | INCONCLUSIVE | — | — | 1 | 100% | +105% | +1.05 | 0 | — | — | +0 | 80.8 | 97 | 44.9% |
| d633d1 | INCONCLUSIVE | ELITE | 347 | 0 | — | — | +0.00 | 2 | 100% | +92.3% | +9864 | — | — | — |
| 43b7b3 | INCONCLUSIVE | SHARP | — | 0 | — | — | +0.00 | 2 | 100% | +177.9% | +7112 | — | — | — |
| 905eea | INCONCLUSIVE | ELITE | 239 | 0 | — | — | +0.00 | 2 | 100% | +25.3% | +6645 | — | — | — |
| 118cec | INCONCLUSIVE | ELITE | 223 | 1 | 0% | -100% | -1.00 | 2 | 100% | +11% | +16635 | 63 | 64.9 | 5.7% |
| 6f4108 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 1 | 100% | +96.1% | +5390 | — | — | — |
| e06ffd | INCONCLUSIVE | ELITE | 24 | 0 | — | — | +0.00 | 2 | 100% | +100.4% | +5238 | — | — | — |
| b618da | INCONCLUSIVE | ELITE | 463 | 0 | — | — | +0.00 | 1 | 100% | +16.3% | +4863 | — | — | — |
| 22ac33 | INCONCLUSIVE | — | — | 1 | 100% | +25.6% | +0.26 | 0 | — | — | +0 | 52.1 | 78.4 | 9.5% |
| 6daaa9 | INCONCLUSIVE | ELITE | 402 | 0 | — | — | +0.00 | 2 | 50% | +4.1% | +2090 | — | — | — |
| 583ec2 | INCONCLUSIVE | ELITE | 450 | 0 | — | — | +0.00 | 2 | 100% | +468.8% | +1036 | — | — | — |
| 8df46a | INCONCLUSIVE | ELITE | 410 | 0 | — | — | +0.00 | 2 | 100% | +96.1% | +980 | — | — | — |
| e43d84 | INCONCLUSIVE | ELITE | 287 | 0 | — | — | +0.00 | 1 | 100% | +100% | +700 | — | — | — |
| 5e076a | INCONCLUSIVE | SHARP | — | 0 | — | — | +0.00 | 1 | 100% | +56.3% | +360 | — | — | — |
| 59912d | INCONCLUSIVE | ELITE | 368 | 0 | — | — | +0.00 | 2 | 100% | +151.2% | +130 | — | — | — |
| 00b39a | INCONCLUSIVE | ELITE | 465 | 0 | — | — | +0.00 | 1 | 100% | +85.7% | +84 | — | — | — |
| c252ab | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 1 | 100% | +0.8% | +1 | — | — | — |
| b9a017 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 2 | 0% | -100% | -350 | — | — | — |
| 924b31 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 1 | 0% | -100% | -650 | — | — | — |
| 9ceedb | INCONCLUSIVE | ELITE | 261 | 0 | — | — | +0.00 | 1 | 0% | -100% | -752 | — | — | — |
| 2e514a | INCONCLUSIVE | ELITE | 477 | 0 | — | — | +0.00 | 2 | 0% | -99.6% | -901 | — | — | — |
| a274e9 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 2 | 0% | -100% | -1602 | — | — | — |
| 42a137 | INCONCLUSIVE | ELITE | 204 | 0 | — | — | +0.00 | 1 | 0% | -100% | -1683 | — | — | — |
| 0d7aa5 | INCONCLUSIVE | ELITE | 323 | 0 | — | — | +0.00 | 2 | 50% | -16.1% | -2267 | — | — | — |
| 9fe8fd | INCONCLUSIVE | ELITE | 321 | 0 | — | — | +0.00 | 2 | 50% | -1.1% | -2335 | — | — | — |
| 553246 | INCONCLUSIVE | ELITE | 213 | 0 | — | — | +0.00 | 2 | 0% | -100% | -2663 | — | — | — |
| e246ce | INCONCLUSIVE | ELITE | 399 | 0 | — | — | +0.00 | 1 | 0% | -100% | -3612 | — | — | — |
| f04244 | INCONCLUSIVE | ELITE | 161 | 0 | — | — | +0.00 | 1 | 0% | -100.1% | -6260 | — | — | — |
| 4825d3 | INCONCLUSIVE | SHARP | — | 0 | — | — | +0.00 | 1 | 0% | -100% | -6363 | — | — | — |
| 718cd6 | INCONCLUSIVE | SHARP | — | 0 | — | — | +0.00 | 2 | 0% | -99.9% | -8320 | — | — | — |
| ea4b9c | INCONCLUSIVE | — | 328 | 1 | 0% | -100% | -1.00 | 0 | — | — | +0 | 45.5 | 59.8 | 5% |
| 010832 | INCONCLUSIVE | ELITE | 423 | 0 | — | — | +0.00 | 1 | 0% | -100.1% | -10510 | — | — | — |
| 3afade | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 1 | 0% | -100% | -10800 | — | — | — |
| ba9c95 | INCONCLUSIVE | ELITE | 61 | 0 | — | — | +0.00 | 1 | 0% | -100% | -11948 | — | — | — |
| ad50aa | INCONCLUSIVE | ELITE | 338 | 0 | — | — | +0.00 | 1 | 0% | -100% | -15500 | — | — | — |
| db8517 | INCONCLUSIVE | ELITE | 413 | 0 | — | — | +0.00 | 1 | 0% | -100% | -15845 | — | — | — |
| fbc909 | INCONCLUSIVE | ELITE | 278 | 0 | — | — | +0.00 | 2 | 0% | -100% | -18971 | — | — | — |
| 676ac7 | INCONCLUSIVE | SHARP | — | 0 | — | — | +0.00 | 1 | 0% | -100% | -20400 | — | — | — |
| 640ec5 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 2 | 0% | -100% | -20526 | — | — | — |
| 8030fa | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 1 | 0% | -100% | -22176 | — | — | — |
| 463b60 | INCONCLUSIVE | ELITE | 402 | 0 | — | — | +0.00 | 2 | 0% | -100% | -27600 | — | — | — |
| e393a0 | INCONCLUSIVE | ELITE | 445 | 1 | 0% | -100% | -1.00 | 2 | 0% | -100% | -23055 | 39.5 | 60.5 | 4.9% |
| 4b11ee | INCONCLUSIVE | ELITE | 223 | 0 | — | — | +0.00 | 1 | 0% | -100% | -35892 | — | — | — |
| 6cca95 | INCONCLUSIVE | ELITE | — | 1 | 0% | -100% | -1.00 | 2 | 0% | -100.1% | -26580 | 60.7 | 92.8 | 31.6% |
| 62b0b3 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 2 | 0% | -100% | -49306 | — | — | — |
| 4d0a1e | INCONCLUSIVE | ELITE | 418 | 1 | 0% | -100% | -1.00 | 2 | 0% | -100% | -45600 | 55.8 | 90.7 | 25.8% |
| 7c4d74 | INCONCLUSIVE | ELITE | — | 0 | — | — | +0.00 | 1 | 0% | -100% | -64000 | — | — | — |
| bb6f30 | INCONCLUSIVE | ELITE | 479 | 1 | 0% | -100% | -1.00 | 2 | 50% | -44.3% | -59371 | 41.3 | 67.9 | 6.1% |
| b81a50 | INCONCLUSIVE | ELITE | 134 | 1 | 0% | -100% | -1.00 | 2 | 0% | -100% | -85326 | 70.3 | 68.7 | 6.8% |
| d322e1 | INCONCLUSIVE | ELITE | 394 | 0 | — | — | +0.00 | 1 | 0% | -100% | -128209 | — | — | — |
| 2b2f2c | INCONCLUSIVE | ELITE | 336 | 0 | — | — | +0.00 | 2 | 50% | -50.3% | -140435 | — | — | — |
| 8dc4cb | INCONCLUSIVE | ELITE | 227 | 0 | — | — | +0.00 | 2 | 0% | -100% | -168000 | — | — | — |
| b91edc | INCONCLUSIVE | ELITE | 295 | 0 | — | — | +0.00 | 2 | 0% | -100% | -196336 | — | — | — |
| ebad91 | INCONCLUSIVE | ELITE | 417 | 0 | — | — | +0.00 | 1 | 0% | -100.1% | -203999 | — | — | — |
| 5c16ea | INCONCLUSIVE | ELITE | 13 | 0 | — | — | +0.00 | 1 | 0% | -100% | -205512 | — | — | — |
| dd73c3 | INCONCLUSIVE | ELITE | 266 | 0 | — | — | +0.00 | 2 | 0% | -100.1% | -207680 | — | — | — |
| 1684f0 | INCONCLUSIVE | ELITE | 129 | 0 | — | — | +0.00 | 1 | 0% | -100% | -279767 | — | — | — |
| b88666 | INCONCLUSIVE | ELITE | 265 | 1 | 0% | -100% | -1.00 | 1 | 0% | -100% | -348788 | 67.2 | 85.2 | 15.4% |
| 33c67f | INCONCLUSIVE | ELITE | 380 | 1 | 0% | -100% | -1.00 | 2 | 0% | -100% | -400000 | 47.5 | 71.3 | 8% |
| beba32 | INCONCLUSIVE | ELITE | 189 | 0 | — | — | +0.00 | 1 | 0% | -99.9% | -458880 | — | — | — |
| f09a15 | INCONCLUSIVE | ELITE | 50 | 0 | — | — | +0.00 | 2 | 0% | -100% | -795000 | — | — | — |
| cf2703 | INCONCLUSIVE | ELITE | 205 | 0 | — | — | +0.00 | 1 | 0% | -100.1% | -830551 | — | — | — |
| 45386f | INCONCLUSIVE | ELITE | 5 | 0 | — | — | +0.00 | 1 | 0% | -99.9% | -8668295 | — | — | — |
| ab39ae | MIXED_PICKS_BAD_$_GOOD | ELITE | 85 | 4 | 0% | -100% | -4.00 | 34 | 67.6% | +41.7% | +3698384 | 46 | 20 | 1.4% |
| af1697 | MIXED_PICKS_BAD_$_GOOD | ELITE | 35 | 22 | 50% | -5.4% | -1.19 | 95 | 53.7% | +19.5% | +2211511 | 56.8 | 32.5 | 2.1% |
| 2d2ca8 | MIXED_PICKS_BAD_$_GOOD | ELITE | 74 | 17 | 47.1% | -7.4% | -1.25 | 136 | 47.1% | +5.8% | +1502408 | 41.8 | 12.8 | 1% |
| b19a27 | MIXED_PICKS_BAD_$_GOOD | ELITE | 21 | 142 | 48.6% | -7.3% | -10.43 | 764 | 53.1% | +8.1% | +1094063 | 60.5 | 37.3 | 2.4% |
| 4a0563 | MIXED_PICKS_BAD_$_GOOD | ELITE | 27 | 4 | 0% | -100% | -4.00 | 64 | 53.1% | +28.9% | +1019851 | 50.9 | 21.8 | 1.5% |
| 3033ee | MIXED_PICKS_BAD_$_GOOD | ELITE | 1 | 6 | 16.7% | -60% | -3.60 | 16 | 50% | +43.8% | +515039 | 72.9 | 54.9 | 4.4% |
| 7da3d5 | MIXED_PICKS_BAD_$_GOOD | ELITE | 11 | 33 | 42.4% | -22.6% | -7.44 | 438 | 46.1% | +5.9% | +496089 | 51.5 | 40.2 | 2.8% |
| c911a4 | MIXED_PICKS_BAD_$_GOOD | ELITE | 40 | 26 | 53.8% | -0.2% | -0.05 | 346 | 51.7% | +8.2% | +336098 | 72.3 | 96.1 | 44.2% |
| fea6f5 | MIXED_PICKS_BAD_$_GOOD | ELITE | 273 | 10 | 60% | -1.7% | -0.17 | 54 | 53.7% | +48.1% | +309169 | 54.3 | 65.8 | 6.3% |
| b05143 | MIXED_PICKS_BAD_$_GOOD | ELITE | 96 | 15 | 40% | -19.3% | -2.89 | 64 | 65.6% | +7.3% | +294348 | 28.8 | 14.2 | 1.1% |
| 1e8f33 | MIXED_PICKS_BAD_$_GOOD | ELITE | 264 | 101 | 52.5% | -3.1% | -3.14 | 467 | 52.7% | +6% | +212583 | 45.5 | 56.1 | 4.7% |
| 4c64aa | MIXED_PICKS_BAD_$_GOOD | ELITE | 192 | 128 | 56.3% | -1% | -1.34 | 592 | 51.9% | +1.5% | +170923 | 35 | 16 | 1.1% |
| 3102c3 | MIXED_PICKS_BAD_$_GOOD | ELITE | 49 | 3 | 0% | -100% | -3.00 | 12 | 25% | +6.6% | +164421 | 79.5 | 75.1 | 9.1% |
| 2f2a9e | MIXED_PICKS_BAD_$_GOOD | ELITE | 24 | 70 | 52.9% | -6.4% | -4.50 | 566 | 46.3% | +2% | +138337 | 52.1 | 69.7 | 7.4% |
| ad88a3 | MIXED_PICKS_BAD_$_GOOD | ELITE | 407 | 21 | 52.4% | -4.9% | -1.03 | 114 | 62.3% | +14.6% | +81345 | 45.2 | 66.4 | 6.7% |
| ce4d7d | MIXED_PICKS_BAD_$_GOOD | ELITE | 366 | 3 | 66.7% | -0.8% | -0.02 | 12 | 83.3% | +36.4% | +61657 | 30.9 | 41.3 | 2.8% |
| d5017f | MIXED_PICKS_BAD_$_GOOD | ELITE | 427 | 11 | 45.5% | -7.2% | -0.79 | 110 | 48.2% | +3.6% | +67401 | 72.3 | 84.5 | 13.8% |
| 99059d | MIXED_PICKS_BAD_$_GOOD | ELITE | 270 | 4 | 50% | -13.5% | -0.54 | 13 | 61.5% | +5.6% | +60750 | 68.9 | 85.3 | 16% |
| fdd34f | MIXED_PICKS_BAD_$_GOOD | ELITE | 170 | 4 | 25% | -67.2% | -2.69 | 16 | 43.8% | +56.8% | +73522 | 51.4 | 43.5 | 3.2% |
| ac9705 | MIXED_PICKS_BAD_$_GOOD | ELITE | 90 | 18 | 44.4% | -12% | -2.16 | 78 | 50% | +17.1% | +49336 | 69.3 | 66 | 6.4% |
| b31fc6 | MIXED_PICKS_BAD_$_GOOD | ELITE | 34 | 6 | 33.3% | -24% | -1.44 | 30 | 50% | +5.7% | +32877 | 74.9 | 63 | 5.2% |
| a82a75 | MIXED_PICKS_BAD_$_GOOD | ELITE | 275 | 30 | 50% | -9.7% | -2.90 | 158 | 51.9% | +8.4% | +44839 | 43.8 | 48.4 | 3.8% |
| c668b3 | MIXED_PICKS_BAD_$_GOOD | ELITE | 404 | 31 | 54.8% | -0.6% | -0.19 | 119 | 58% | +2.5% | +6213 | 11.7 | 16.5 | 1.2% |
| a190ea | MIXED_PICKS_BAD_$_GOOD | ELITE | 297 | 6 | 50% | -0.5% | -0.03 | 47 | 36.2% | +0.4% | +603 | 45.9 | 55.1 | 4.5% |
| 0eb6ef | MIXED_PICKS_BAD_$_GOOD | ELITE | 367 | 6 | 33.3% | -48.9% | -2.93 | 42 | 57.1% | +3.3% | +28107 | 20.3 | 9.6 | 0.9% |
| 7f00bc | MIXED_PICKS_BAD_$_GOOD | ELITE | — | 13 | 38.5% | -19.7% | -2.56 | 100 | 44% | +5% | +12712 | 57.1 | 86.4 | 17% |
| 669791 | MIXED_PICKS_BAD_$_GOOD | ELITE | 465 | 3 | 33.3% | -55.6% | -1.67 | 20 | 55% | +10.7% | +2883 | 29.1 | 45.7 | 3.1% |
| 12ad50 | MIXED_PICKS_BAD_$_GOOD | ELITE | 39 | 10 | 30% | -42.1% | -4.21 | 106 | 50.9% | +0.7% | +25162 | 58.3 | 57.9 | 4.8% |
| 946418 | MIXED_PICKS_BAD_$_GOOD | ELITE | — | 9 | 55.6% | -31.1% | -2.80 | 35 | 71.4% | +6.2% | +4857 | 76.8 | 91.3 | 25.5% |
| 70135d | MIXED_PICKS_BAD_$_GOOD | ELITE | 88 | 169 | 52.1% | -5.3% | -8.88 | 540 | 50.9% | +0.7% | +8632 | 35.8 | 8.7 | 0.7% |
| dded41 | POSITIONS_ONLY_NEGATIVE | ELITE | 464 | 1 | 100% | +315% | +3.15 | 8 | 25% | -5.1% | -1177 | 36.3 | 48.3 | 3.3% |
| 3dfe91 | POSITIONS_ONLY_NEGATIVE | ELITE | 384 | 0 | — | — | +0.00 | 4 | 75% | -4.6% | -45 | — | — | — |
| d8e720 | POSITIONS_ONLY_NEGATIVE | PROVEN | — | 0 | — | — | +0.00 | 5 | 40% | -48% | -73 | — | — | — |
| 9bc9a1 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 1 | 100% | +13.9% | +0.14 | 15 | 53.3% | -11.5% | -2464 | 62 | 92.1 | 28.2% |
| 8a4372 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 0 | — | — | +0.00 | 4 | 50% | -7.3% | -1081 | — | — | — |
| deca73 | POSITIONS_ONLY_NEGATIVE | SHARP | — | 0 | — | — | +0.00 | 4 | 0% | -100% | -1564 | — | — | — |
| 6f5295 | POSITIONS_ONLY_NEGATIVE | ELITE | 219 | 1 | 100% | +20% | +0.20 | 11 | 72.7% | -5.5% | -4626 | 47.7 | 46.1 | 3.3% |
| 99396c | POSITIONS_ONLY_NEGATIVE | SHARP | — | 0 | — | — | +0.00 | 4 | 50% | -45.6% | -3024 | — | — | — |
| 85acbf | POSITIONS_ONLY_NEGATIVE | PROVEN | — | 0 | — | — | +0.00 | 3 | 0% | -100% | -3103 | — | — | — |
| 460ebd | POSITIONS_ONLY_NEGATIVE | ELITE | 717 | 0 | — | — | +0.00 | 4 | 0% | -100% | -3361 | — | — | — |
| 5e788f | POSITIONS_ONLY_NEGATIVE | ELITE | 276 | 0 | — | — | +0.00 | 81 | 48.1% | -1.3% | -3821 | — | — | — |
| 855ae8 | POSITIONS_ONLY_NEGATIVE | ELITE | 54 | 0 | — | — | +0.00 | 4 | 25% | -3.7% | -4747 | — | — | — |
| 6cd2f7 | POSITIONS_ONLY_NEGATIVE | ELITE | 105 | 1 | 100% | +57.1% | +0.57 | 16 | 37.5% | -4.5% | -11654 | 35.8 | 18.8 | 1.3% |
| e3dcd3 | POSITIONS_ONLY_NEGATIVE | ELITE | 410 | 1 | 100% | +69% | +0.69 | 21 | 33.3% | -19.5% | -13085 | 27.5 | 40.4 | 2.7% |
| 6ac120 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 0 | — | — | +0.00 | 4 | 50% | -27.1% | -6466 | — | — | — |
| 0f453b | POSITIONS_ONLY_NEGATIVE | ELITE | 371 | 1 | 100% | +83.3% | +0.83 | 17 | 47.1% | -21.3% | -15936 | 61.7 | 83.9 | 14.4% |
| b6d6dd | POSITIONS_ONLY_NEGATIVE | PROVEN | — | 0 | — | — | +0.00 | 5 | 0% | -100% | -11628 | — | — | — |
| 1cb5b6 | POSITIONS_ONLY_NEGATIVE | ELITE | 412 | 1 | 0% | -100% | -1.00 | 5 | 0% | -100% | -1830 | 33.4 | 45.6 | 3% |
| a24815 | POSITIONS_ONLY_NEGATIVE | ELITE | 386 | 1 | 0% | -100% | -1.00 | 4 | 75% | -15.8% | -2693 | 52.9 | 61.8 | 5.1% |
| 55647a | POSITIONS_ONLY_NEGATIVE | ELITE | 285 | 2 | 50% | -35.9% | -0.72 | 5 | 40% | -52.6% | -5849 | 33.5 | 37.7 | 2.4% |
| 398fa4 | POSITIONS_ONLY_NEGATIVE | ELITE | 207 | 0 | — | — | +0.00 | 4 | 0% | -100% | -17675 | — | — | — |
| 2e5030 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 2 | 100% | +68.2% | +1.36 | 25 | 36% | -39.1% | -34239 | 0.7 | 0 | 0% |
| 3bdd7e | POSITIONS_ONLY_NEGATIVE | ELITE | 11 | 1 | 0% | -100% | -1.00 | 9 | 44.4% | -40.5% | -13546 | 57 | 51.4 | 4.1% |
| 161f17 | POSITIONS_ONLY_NEGATIVE | ELITE | 200 | 2 | 50% | -4.5% | -0.09 | 5 | 40% | -13.9% | -22973 | 46.8 | 37.2 | 2.2% |
| ba8492 | POSITIONS_ONLY_NEGATIVE | ELITE | 5 | 1 | 100% | +146% | +1.46 | 13 | 38.5% | -20.2% | -40152 | 81.8 | 85.3 | 18.2% |
| 2d024e | POSITIONS_ONLY_NEGATIVE | ELITE | 756 | 1 | 100% | +28.6% | +0.29 | 14 | 35.7% | -2.9% | -28565 | 18 | 13.5 | 1% |
| cbaabb | POSITIONS_ONLY_NEGATIVE | ELITE | 412 | 1 | 0% | -100% | -1.00 | 26 | 30.8% | -45.5% | -20233 | 62.9 | 90.2 | 24.2% |
| 786930 | POSITIONS_ONLY_NEGATIVE | ELITE | 318 | 1 | 100% | +87% | +0.87 | 4 | 25% | -82.7% | -42855 | 59.4 | 86.5 | 15.9% |
| fb433f | POSITIONS_ONLY_NEGATIVE | ELITE | 267 | 1 | 0% | -100% | -1.00 | 29 | 34.5% | -3.4% | -24541 | 33.7 | 51.1 | 3.8% |
| 56664f | POSITIONS_ONLY_NEGATIVE | ELITE | 435 | 2 | 0% | -100% | -2.00 | 8 | 62.5% | -13.3% | -16469 | 49.3 | 75.2 | 8.1% |
| 5e5e30 | POSITIONS_ONLY_NEGATIVE | ELITE | 202 | 1 | 0% | -100% | -1.00 | 6 | 16.7% | -79.1% | -31634 | 32 | 19.6 | 1.3% |
| 009373 | POSITIONS_ONLY_NEGATIVE | ELITE | 162 | 1 | 0% | -100% | -1.00 | 6 | 0% | -100% | -32718 | 67.5 | 83.7 | 13.4% |
| cf76ed | POSITIONS_ONLY_NEGATIVE | ELITE | 247 | 2 | 50% | -15% | -0.30 | 17 | 41.2% | -54.4% | -46596 | 54.8 | 59.4 | 5% |
| e47e66 | POSITIONS_ONLY_NEGATIVE | ELITE | 159 | 0 | — | — | +0.00 | 9 | 0% | -100% | -51391 | — | — | — |
| 616bf2 | POSITIONS_ONLY_NEGATIVE | ELITE | 49 | 0 | — | — | +0.00 | 3 | 0% | -99.8% | -51900 | — | — | — |
| 94600d | POSITIONS_ONLY_NEGATIVE | ELITE | — | 2 | 0% | -100% | -2.00 | 91 | 51.6% | -11.9% | -34310 | 52.7 | 79.4 | 10.9% |
| 015950 | POSITIONS_ONLY_NEGATIVE | ELITE | 185 | 0 | — | — | +0.00 | 4 | 0% | -100% | -58403 | — | — | — |
| 6c78fd | POSITIONS_ONLY_NEGATIVE | ELITE | 365 | 2 | 50% | -30% | -0.60 | 22 | 45.5% | -46.3% | -52415 | 48.3 | 57.2 | 4.7% |
| 1bde7b | POSITIONS_ONLY_NEGATIVE | ELITE | 77 | 1 | 0% | -100% | -1.00 | 7 | 28.6% | -58% | -48420 | 42.1 | 15.7 | 1.1% |
| a328ad | POSITIONS_ONLY_NEGATIVE | ELITE | 43 | 0 | — | — | +0.00 | 4 | 0% | -100% | -65460 | — | — | — |
| 67f462 | POSITIONS_ONLY_NEGATIVE | ELITE | 392 | 0 | — | — | +0.00 | 5 | 20% | -65.5% | -66840 | — | — | — |
| 0f9786 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 0 | — | — | +0.00 | 280 | 13.9% | -12% | -67651 | — | — | — |
| 1aef79 | POSITIONS_ONLY_NEGATIVE | ELITE | 447 | 2 | 50% | -1% | -0.02 | 22 | 22.7% | -57.4% | -68627 | 42.4 | 59.3 | 5% |
| 79c052 | POSITIONS_ONLY_NEGATIVE | ELITE | 170 | 1 | 0% | -100% | -1.00 | 9 | 22.2% | -32% | -63162 | 62.9 | 62.7 | 5.5% |
| 763856 | POSITIONS_ONLY_NEGATIVE | ELITE | 159 | 2 | 0% | -100% | -2.00 | 10 | 60% | -39.3% | -58606 | 42.7 | 24.2 | 1.5% |
| c30b3f | POSITIONS_ONLY_NEGATIVE | ELITE | 42 | 0 | — | — | +0.00 | 12 | 50% | -20.2% | -79178 | — | — | — |
| 6b0288 | POSITIONS_ONLY_NEGATIVE | ELITE | 302 | 0 | — | — | +0.00 | 15 | 26.7% | -24.3% | -81873 | — | — | — |
| de4c4f | POSITIONS_ONLY_NEGATIVE | ELITE | 397 | 0 | — | — | +0.00 | 24 | 50% | -19.4% | -83700 | — | — | — |
| cff1f9 | POSITIONS_ONLY_NEGATIVE | ELITE | 291 | 0 | — | — | +0.00 | 4 | 0% | -100% | -86184 | — | — | — |
| b6bcf3 | POSITIONS_ONLY_NEGATIVE | SHARP | — | 1 | 0% | -100% | -1.00 | 24 | 25% | -24.3% | -88107 | 28.5 | 38.6 | 2.9% |
| 445e8a | POSITIONS_ONLY_NEGATIVE | ELITE | 470 | 0 | — | — | +0.00 | 13 | 30.8% | -24.1% | -101406 | — | — | — |
| fa4b88 | POSITIONS_ONLY_NEGATIVE | ELITE | 163 | 0 | — | — | +0.00 | 5 | 0% | -100% | -102200 | — | — | — |
| df4429 | POSITIONS_ONLY_NEGATIVE | ELITE | 95 | 1 | 0% | -100% | -1.00 | 3 | 33.3% | -90.6% | -94920 | 48.3 | 26.5 | 1.7% |
| 8e82c9 | POSITIONS_ONLY_NEGATIVE | ELITE | 102 | 0 | — | — | +0.00 | 18 | 61.1% | -10.7% | -113937 | — | — | — |
| 319bf0 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 0 | — | — | +0.00 | 9 | 22.2% | -88.3% | -114543 | — | — | — |
| 77f662 | POSITIONS_ONLY_NEGATIVE | ELITE | 75 | 0 | — | — | +0.00 | 21 | 33.3% | -4.8% | -127360 | — | — | — |
| 27ae49 | POSITIONS_ONLY_NEGATIVE | ELITE | 394 | 0 | — | — | +0.00 | 4 | 0% | -100% | -129619 | — | — | — |
| 9cef38 | POSITIONS_ONLY_NEGATIVE | ELITE | 126 | 0 | — | — | +0.00 | 17 | 0% | -100% | -134745 | — | — | — |
| 8d41ae | POSITIONS_ONLY_NEGATIVE | ELITE | 352 | 0 | — | — | +0.00 | 11 | 27.3% | -95.4% | -139222 | — | — | — |
| f114fb | POSITIONS_ONLY_NEGATIVE | ELITE | 11 | 1 | 100% | +40% | +0.40 | 5 | 20% | -4.1% | -149893 | 92.6 | 89.4 | 22% |
| 468c33 | POSITIONS_ONLY_NEGATIVE | ELITE | 94 | 2 | 50% | -1.9% | -0.04 | 18 | 44.4% | -36.8% | -152964 | 64.5 | 73.4 | 7.9% |
| 6f4c40 | POSITIONS_ONLY_NEGATIVE | ELITE | 574 | 0 | — | — | +0.00 | 5 | 0% | -100.8% | -161718 | — | — | — |
| 162937 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 0 | — | — | +0.00 | 5 | 40% | -30.2% | -166493 | — | — | — |
| 9e24a6 | POSITIONS_ONLY_NEGATIVE | ELITE | 367 | 0 | — | — | +0.00 | 4 | 0% | -100% | -169555 | — | — | — |
| 6bb8f7 | POSITIONS_ONLY_NEGATIVE | ELITE | 154 | 1 | 0% | -100% | -1.00 | 5 | 20% | -59.1% | -160414 | 59.8 | 54.7 | 4.1% |
| 4f821d | POSITIONS_ONLY_NEGATIVE | ELITE | 197 | 2 | 0% | -100% | -2.00 | 15 | 46.7% | -33% | -158835 | 40.3 | 29 | 1.8% |
| 47cab2 | POSITIONS_ONLY_NEGATIVE | ELITE | 149 | 0 | — | — | +0.00 | 20 | 35% | -53.1% | -181597 | — | — | — |
| 8e06f6 | POSITIONS_ONLY_NEGATIVE | ELITE | 289 | 0 | — | — | +0.00 | 7 | 28.6% | -31% | -186655 | — | — | — |
| e1e039 | POSITIONS_ONLY_NEGATIVE | ELITE | 362 | 1 | 0% | -100% | -1.00 | 14 | 7.1% | -98.5% | -177581 | 46.9 | 56.4 | 4.6% |
| a30e68 | POSITIONS_ONLY_NEGATIVE | ELITE | 213 | 0 | — | — | +0.00 | 3 | 33.3% | -5.5% | -197543 | — | — | — |
| d10319 | POSITIONS_ONLY_NEGATIVE | ELITE | 102 | 2 | 50% | -13.2% | -0.26 | 62 | 45.2% | -4.9% | -199142 | 45.9 | 13.8 | 1.1% |
| 86b9f9 | POSITIONS_ONLY_NEGATIVE | ELITE | 465 | 2 | 0% | -100% | -2.00 | 16 | 31.3% | -66% | -197191 | 22.3 | 32.7 | 2% |
| 53b215 | POSITIONS_ONLY_NEGATIVE | ELITE | 30 | 1 | 0% | -100% | -1.00 | 8 | 37.5% | -20.1% | -214027 | 75 | 69.6 | 6.3% |
| 07152f | POSITIONS_ONLY_NEGATIVE | ELITE | 196 | 1 | 100% | +104% | +1.04 | 9 | 33.3% | -37.5% | -234741 | 43.9 | 36.9 | 2.5% |
| fbb0a0 | POSITIONS_ONLY_NEGATIVE | ELITE | 406 | 1 | 0% | -100% | -1.00 | 8 | 12.5% | -99% | -215557 | 27.3 | 26.5 | 1.7% |
| 4c9ada | POSITIONS_ONLY_NEGATIVE | ELITE | 690 | 0 | — | — | +0.00 | 19 | 21.1% | -52.5% | -258839 | — | — | — |
| 676fac | POSITIONS_ONLY_NEGATIVE | ELITE | — | 1 | 0% | -100% | -1.00 | 99 | 32.3% | -50.7% | -255260 | 58.1 | 87.9 | 17.6% |
| 9b21ff | POSITIONS_ONLY_NEGATIVE | ELITE | 36 | 0 | — | — | +0.00 | 3 | 66.7% | -12.9% | -280951 | — | — | — |
| 659b1a | POSITIONS_ONLY_NEGATIVE | ELITE | 187 | 0 | — | — | +0.00 | 23 | 43.5% | -78.8% | -287491 | — | — | — |
| a09a17 | POSITIONS_ONLY_NEGATIVE | ELITE | 26 | 2 | 50% | -40.5% | -0.81 | 8 | 37.5% | -24% | -280355 | 77.4 | 86 | 16.2% |
| 6c5223 | POSITIONS_ONLY_NEGATIVE | ELITE | 123 | 0 | — | — | +0.00 | 3 | 66.7% | -65% | -325931 | — | — | — |
| 8ce2ce | POSITIONS_ONLY_NEGATIVE | ELITE | 234 | 1 | 0% | -100% | -1.00 | 51 | 47.1% | -12.7% | -324443 | 75.1 | 73.3 | 7.9% |
| 5dc83b | POSITIONS_ONLY_NEGATIVE | ELITE | 406 | 1 | 100% | +69% | +0.69 | 18 | 38.9% | -46.1% | -341678 | 13.7 | 18.7 | 1.3% |
| 7eb989 | POSITIONS_ONLY_NEGATIVE | ELITE | 294 | 2 | 0% | -100% | -2.00 | 40 | 27.5% | -72.3% | -333549 | 17 | 12.3 | 1% |
| 59266e | POSITIONS_ONLY_NEGATIVE | ELITE | 459 | 2 | 50% | +2.5% | +0.05 | 16 | 68.8% | -15.8% | -367820 | 17 | 24.2 | 1.5% |
| 641ebf | POSITIONS_ONLY_NEGATIVE | ELITE | 204 | 0 | — | — | +0.00 | 14 | 28.6% | -38.9% | -408489 | — | — | — |
| 9baade | POSITIONS_ONLY_NEGATIVE | ELITE | 287 | 0 | — | — | +0.00 | 7 | 28.6% | -80.9% | -408515 | — | — | — |
| 911d56 | POSITIONS_ONLY_NEGATIVE | ELITE | 640 | 0 | — | — | +0.00 | 9 | 0% | -100% | -436992 | — | — | — |
| 453446 | POSITIONS_ONLY_NEGATIVE | ELITE | 29 | 0 | — | — | +0.00 | 4 | 50% | -51.5% | -438938 | — | — | — |
| 45fc26 | POSITIONS_ONLY_NEGATIVE | ELITE | 10 | 1 | 100% | +90.9% | +0.91 | 69 | 42% | -9.5% | -464810 | 54.1 | 44.6 | 3.1% |
| eb52f9 | POSITIONS_ONLY_NEGATIVE | ELITE | 685 | 2 | 0% | -100% | -2.00 | 27 | 22.2% | -44.6% | -437587 | 71.2 | 73 | 7.5% |
| 988e33 | POSITIONS_ONLY_NEGATIVE | ELITE | 87 | 0 | — | — | +0.00 | 4 | 0% | -100% | -781980 | — | — | — |
| e96b87 | POSITIONS_ONLY_NEGATIVE | ELITE | 32 | 0 | — | — | +0.00 | 12 | 58.3% | -40.5% | -797051 | — | — | — |
| f9f9be | POSITIONS_ONLY_NEGATIVE | ELITE | 17 | 0 | — | — | +0.00 | 4 | 25% | -69.6% | -896893 | — | — | — |
| e9e275 | POSITIONS_ONLY_NEGATIVE | ELITE | — | 0 | — | — | +0.00 | 9 | 11.1% | -93.6% | -913887 | — | — | — |
| 37f0b6 | POSITIONS_ONLY_NEGATIVE | ELITE | 299 | 1 | 100% | +83.3% | +0.83 | 4 | 25% | -44.4% | -1307072 | 58.7 | 79.5 | 11.8% |
| 84b2f4 | POSITIONS_ONLY_NEGATIVE | ELITE | 333 | 1 | 0% | -100% | -1.00 | 18 | 50% | -50.1% | -1294767 | 46.9 | 41.7 | 2.8% |
| 57be17 | POSITIONS_ONLY_NEGATIVE | ELITE | 154 | 1 | 0% | -100% | -1.00 | 64 | 34.4% | -34.1% | -1346870 | 51.9 | 43.3 | 3.1% |
| e352a5 | POSITIONS_ONLY_NEGATIVE | ELITE | 30 | 0 | — | — | +0.00 | 49 | 46.9% | -55.4% | -1428917 | — | — | — |
| 6c5143 | POSITIONS_ONLY_NEGATIVE | ELITE | 52 | 0 | — | — | +0.00 | 3 | 0% | -100% | -1703097 | — | — | — |
| f56f0b | POSITIONS_ONLY_NEGATIVE | ELITE | 43 | 0 | — | — | +0.00 | 4 | 0% | -100% | -2104770 | — | — | — |
| 3db89e | POSITIONS_ONLY_NEGATIVE | ELITE | 6 | 0 | — | — | +0.00 | 52 | 46.2% | -21.4% | -3053844 | — | — | — |
| 11381f | CONFIRMED_BLEEDER | ELITE | 289 | 3 | 66.7% | -4.2% | -0.13 | 37 | 70.3% | -21% | -13163 | 38.7 | 42.4 | 2.9% |
| 7d395d | CONFIRMED_BLEEDER | ELITE | — | 3 | 33.3% | -32% | -0.96 | 30 | 40% | -12.6% | -5846 | 3.7 | 4.6 | 0.4% |
| 4edc5b | CONFIRMED_BLEEDER | ELITE | 115 | 6 | 50% | -25.8% | -1.55 | 23 | 56.5% | -1.7% | -9542 | 54.4 | 82 | 12.4% |
| daf4de | CONFIRMED_BLEEDER | ELITE | 408 | 3 | 33.3% | -39.6% | -1.19 | 48 | 52.1% | -2.2% | -13958 | 52.9 | 57 | 4.5% |
| a0d6d2 | CONFIRMED_BLEEDER | PROVEN | — | 12 | 41.7% | -22.6% | -2.71 | 117 | 53.8% | -1.2% | -5140 | 50 | 0 | 0% |
| 30935c | CONFIRMED_BLEEDER | ELITE | — | 4 | 25% | -37.5% | -1.50 | 63 | 46% | -12.8% | -18997 | 44.6 | 67.2 | 6.3% |
| e70853 | CONFIRMED_BLEEDER | ELITE | 75 | 10 | 30% | -41.1% | -4.11 | 88 | 56.8% | -0.1% | -2614 | 41.3 | 21.8 | 1.5% |
| 97e406 | CONFIRMED_BLEEDER | ELITE | 339 | 3 | 33.3% | -56.3% | -1.69 | 21 | 42.9% | -6.7% | -29564 | 53.5 | 78.7 | 11.4% |
| 138d9b | CONFIRMED_BLEEDER | ELITE | 236 | 5 | 60% | -11.3% | -0.57 | 55 | 50.9% | -10.5% | -40837 | 48.4 | 49.8 | 3.9% |
| c289a0 | CONFIRMED_BLEEDER | ELITE | 294 | 3 | 0% | -100% | -3.00 | 38 | 47.4% | -27.8% | -18518 | 31 | 22.1 | 1.5% |
| 065ad0 | CONFIRMED_BLEEDER | ELITE | 468 | 3 | 33.3% | -34% | -1.02 | 41 | 41.5% | -24.3% | -38500 | 15.7 | 24.2 | 1.6% |
| d3f7ad | CONFIRMED_BLEEDER | SHARP | — | 5 | 60% | -11.1% | -0.55 | 46 | 28.3% | -47.6% | -52478 | 50.3 | 74.4 | 8.6% |
| 407422 | CONFIRMED_BLEEDER | ELITE | 364 | 4 | 0% | -100% | -4.00 | 8 | 25% | -35.1% | -21331 | 19.2 | 16.3 | 1.1% |
| f2f960 | CONFIRMED_BLEEDER | ELITE | 69 | 26 | 46.2% | -13.3% | -3.46 | 142 | 45.8% | -8.7% | -52269 | 65.2 | 53 | 4.3% |
| d50c53 | CONFIRMED_BLEEDER | ELITE | — | 4 | 50% | -21.9% | -0.87 | 15 | 33.3% | -48.5% | -89467 | 57.3 | 86.1 | 13.9% |
| 1d14b8 | CONFIRMED_BLEEDER | ELITE | 293 | 5 | 20% | -61.5% | -3.07 | 16 | 37.5% | -20.8% | -69455 | 53.3 | 62.7 | 5.2% |
| 6b853d | CONFIRMED_BLEEDER | ELITE | 412 | 38 | 44.7% | -14.7% | -5.59 | 175 | 46.9% | -5.9% | -45253 | 32.9 | 46.6 | 3.2% |
| bc44b0 | CONFIRMED_BLEEDER | ELITE | 880 | 37 | 56.8% | -3.4% | -1.24 | 403 | 49.4% | -3.7% | -95741 | 14 | 18.2 | 1.2% |
| 7703d4 | CONFIRMED_BLEEDER | ELITE | 455 | 23 | 47.8% | -4.3% | -0.98 | 345 | 46.1% | -11.7% | -102634 | 10.5 | 14.8 | 1.1% |
| b28d26 | CONFIRMED_BLEEDER | ELITE | 225 | 3 | 33.3% | -35.2% | -1.06 | 19 | 47.4% | -26.4% | -103154 | 32.4 | 21.1 | 1.4% |
| bc35e3 | CONFIRMED_BLEEDER | SHARP | — | 47 | 53.2% | -4.8% | -2.26 | 440 | 46.4% | -4.2% | -94700 | 19.2 | 26.9 | 1.8% |
| a0cff6 | CONFIRMED_BLEEDER | PROVEN | — | 10 | 40% | -32.8% | -3.28 | 415 | 43.4% | -1.8% | -87720 | 39.7 | 59.9 | 5.1% |
| 779ef0 | CONFIRMED_BLEEDER | ELITE | 90 | 17 | 41.2% | -9.1% | -1.55 | 261 | 40.2% | -5.7% | -115278 | 61.7 | 48.2 | 3.7% |
| d3381b | CONFIRMED_BLEEDER | ELITE | 203 | 4 | 0% | -100% | -4.00 | 31 | 35.5% | -19.8% | -99885 | 60.6 | 63.3 | 5.5% |
| 2a8409 | CONFIRMED_BLEEDER | ELITE | 346 | 4 | 0% | -100% | -4.00 | 16 | 18.8% | -51.6% | -102590 | 41.2 | 55.4 | 4.7% |
| a8c991 | CONFIRMED_BLEEDER | ELITE | 23 | 4 | 50% | -9% | -0.36 | 42 | 57.1% | -7.5% | -139988 | 65.8 | 53.9 | 4.4% |
| 0f9d74 | CONFIRMED_BLEEDER | ELITE | — | 78 | 50% | -6.5% | -5.04 | 744 | 46.9% | -6.2% | -97118 | 44 | 64.7 | 6.3% |
| bbd49f | CONFIRMED_BLEEDER | ELITE | 191 | 6 | 50% | -4.3% | -0.26 | 43 | 46.5% | -33.5% | -166025 | 44.8 | 35.1 | 2.2% |
| 348973 | CONFIRMED_BLEEDER | ELITE | 276 | 6 | 50% | -7.9% | -0.47 | 53 | 37.7% | -22.7% | -167690 | 55.4 | 59.9 | 5% |
| 63fc82 | CONFIRMED_BLEEDER | ELITE | 479 | 12 | 50% | -7.5% | -0.90 | 80 | 45% | -11.4% | -183102 | 38.3 | 57.1 | 4.8% |
| 981187 | CONFIRMED_BLEEDER | ELITE | 109 | 11 | 54.5% | -1% | -0.11 | 20 | 50% | -5.4% | -195034 | 69.3 | 67.4 | 6.3% |
| 8ec926 | CONFIRMED_BLEEDER | ELITE | 357 | 20 | 50% | -4.3% | -0.87 | 399 | 42.9% | -12.4% | -205685 | 25.1 | 27.8 | 1.8% |
| ad9e7a | CONFIRMED_BLEEDER | ELITE | 298 | 3 | 0% | -100% | -3.00 | 39 | 33.3% | -22.6% | -186184 | 62.4 | 70.2 | 7.4% |
| 8a3782 | CONFIRMED_BLEEDER | ELITE | 18 | 13 | 38.5% | -26.9% | -3.49 | 113 | 51.3% | -1.1% | -195343 | 83.5 | 76.8 | 9.4% |
| 705ba1 | CONFIRMED_BLEEDER | ELITE | 229 | 35 | 51.4% | -0.9% | -0.33 | 120 | 51.7% | -3.6% | -251988 | 46.5 | 43.8 | 3.3% |
| dcafd2 | CONFIRMED_BLEEDER | ELITE | 333 | 43 | 44.2% | -18.1% | -7.77 | 303 | 44.9% | -13.1% | -220180 | 18.1 | 12.2 | 1% |
| 0336b0 | CONFIRMED_BLEEDER | ELITE | 336 | 7 | 28.6% | -54.9% | -3.84 | 45 | 44.4% | -57.7% | -412128 | 51.9 | 64.6 | 5.7% |
| 710c2e | CONFIRMED_BLEEDER | ELITE | 428 | 8 | 25% | -52.1% | -4.17 | 109 | 45% | -7.4% | -413371 | 16.4 | 22 | 1.4% |
| cf627b | CONFIRMED_BLEEDER | ELITE | 251 | 4 | 25% | -43.8% | -1.75 | 11 | 45.5% | -39.9% | -447059 | 69.7 | 72.7 | 8.5% |
| c9bba3 | CONFIRMED_BLEEDER | ELITE | 83 | 14 | 57.1% | -4.7% | -0.66 | 163 | 50.3% | -9.5% | -469664 | 16.7 | 22.6 | 1.5% |
| 9a69c2 | CONFIRMED_BLEEDER | ELITE | 173 | 53 | 43.4% | -21.4% | -11.35 | 141 | 41.8% | -28.4% | -390823 | 17.5 | 3.3 | 0.4% |
| 621848 | CONFIRMED_BLEEDER | ELITE | — | 13 | 46.2% | -30% | -3.90 | 45 | 51.1% | -75.4% | -537738 | 16.2 | 22 | 1.5% |
| c2aeea | CONFIRMED_BLEEDER | ELITE | 34 | 12 | 50% | -12% | -1.44 | 647 | 50.5% | -6.1% | -567612 | 53.8 | 71 | 7.6% |
| 8da2ca | CONFIRMED_BLEEDER | ELITE | 302 | 9 | 44.4% | -12.4% | -1.11 | 29 | 41.4% | -17.2% | -596549 | 47.1 | 56.9 | 4.7% |
| 73f5b0 | CONFIRMED_BLEEDER | ELITE | 88 | 16 | 37.5% | -26.4% | -4.22 | 60 | 41.7% | -28.3% | -586640 | 51.1 | 29.1 | 1.8% |
| 7a9723 | CONFIRMED_BLEEDER | ELITE | 39 | 14 | 35.7% | -36.7% | -5.14 | 72 | 48.6% | -11% | -587149 | 71 | 56 | 4.3% |
| fcc12b | CONFIRMED_BLEEDER | ELITE | 89 | 36 | 38.9% | -29.5% | -10.62 | 177 | 54.2% | -6.6% | -541994 | 46 | 33 | 2.2% |
| e077f1 | CONFIRMED_BLEEDER | ELITE | 292 | 5 | 40% | -27.9% | -1.40 | 10 | 20% | -64.1% | -667019 | 42.3 | 48.2 | 3.7% |
| f9e3d0 | CONFIRMED_BLEEDER | ELITE | 444 | 11 | 45.5% | -12.7% | -1.40 | 88 | 62.5% | -15.4% | -865706 | 38 | 55.4 | 4.5% |
| 43020b | CONFIRMED_BLEEDER | ELITE | 139 | 3 | 0% | -100% | -3.00 | 63 | 36.5% | -41.9% | -1028474 | 61.2 | 45.4 | 3.2% |
| de3f67 | CONFIRMED_BLEEDER | ELITE | 58 | 14 | 50% | -6.7% | -0.93 | 85 | 43.5% | -16.2% | -1188835 | 77.1 | 71 | 8% |
| cd2f63 | CONFIRMED_BLEEDER | ELITE | 10 | 135 | 50.4% | -3.9% | -5.30 | 2273 | 49.6% | -5.8% | -1618015 | 56.7 | 80.3 | 12.2% |
| 12192c | CONFIRMED_BLEEDER | ELITE | 34 | 12 | 25% | -53.8% | -6.45 | 277 | 44.4% | -15% | -1873117 | 67.3 | 59.1 | 4.9% |
| 10c684 | CONFIRMED_BLEEDER | ELITE | 11 | 15 | 26.7% | -47.5% | -7.13 | 136 | 47.8% | -17.1% | -2056458 | 35.9 | 1.9 | 0.3% |
| eeabaf | CONFIRMED_BLEEDER | ELITE | 75 | 87 | 47.1% | -8.4% | -7.30 | 499 | 47.7% | -12.3% | -2343972 | 39.9 | 16.2 | 1.1% |
| 6bd96a | CONFIRMED_BLEEDER | ELITE | 8 | 18 | 27.8% | -14.4% | -2.60 | 262 | 38.9% | -12.9% | -3812755 | 53.7 | 34.9 | 2.1% |

---
## Confirmed winners (≥3 bets in both sources, positive in both)

| Wallet | A bets | A flat ROI | B bets | B $ ROI | B $ PnL | walletBase | Lifetime ROI |
|---|---|---|---|---|---|---|---|
| 06c80c | 5 | +94.9% | 88 | +13.4% | +2735814 | 50 | 1.7% |
| 913987 | 30 | +26.7% | 89 | +28.2% | +1461331 | 84.3 | 12% |
| 388d4c | 5 | +59.1% | 94 | +48.7% | +1337056 | 67.4 | 4.4% |
| 52aeeb | 23 | +11.7% | 205 | +16.7% | +728162 | 55.6 | 2.3% |
| 8bbab3 | 4 | +5.8% | 22 | +26.9% | +686069 | 81.2 | 8.3% |
| ad4d8b | 3 | +27.1% | 23 | +73.9% | +556537 | 35.4 | 1.7% |
| 11b032 | 4 | +113.8% | 16 | +93.7% | +514430 | 83.2 | 14.9% |
| f0fec8 | 4 | +32.3% | 8 | +59.1% | +378865 | 68.5 | 7.2% |
| 4d2125 | 10 | +37.7% | 111 | +22.1% | +349396 | 36.2 | 1.3% |
| a10ff5 | 38 | +24.2% | 183 | +18.1% | +271658 | 29 | 2.9% |
| f83ab0 | 4 | +39.6% | 15 | +37.4% | +295063 | 77.1 | 16% |
| bc8b21 | 4 | +53% | 38 | +36.5% | +261315 | 50 | 5.2% |
| 0cd77e | 91 | +12.9% | 251 | +9.9% | +127057 | 44.6 | 3% |
| e05213 | 7 | +37.7% | 57 | +7.9% | +190100 | 26.5 | 2.4% |
| 955c26 | 6 | +5.5% | 40 | +18.9% | +206995 | 51.3 | 6.7% |
| 7923c4 | 84 | +14.5% | 416 | +0.6% | +87366 | 56.9 | 2.6% |
| 5b1e50 | 101 | +15.4% | 813 | +4% | +47994 | 8.8 | 4.1% |
| 78e8f1 | 11 | +28.2% | 93 | +4.3% | +115974 | 60.8 | 4.8% |
| 5c32f2 | 7 | +21.1% | 48 | +17.3% | +91876 | 57.2 | 2.1% |
| 769c38 | 8 | +25% | 28 | +25.5% | +83628 | 84.3 | 14.2% |
| f2d227 | 16 | +6.8% | 169 | +1.2% | +88030 | 62.8 | 3% |
| 8c1eae | 50 | +14% | 226 | +4.1% | +25121 | 42.2 | 4% |
| 491f30 | 25 | +32.8% | 106 | +1.5% | +12242 | 63.2 | 41.1% |
| bd2d54 | 3 | +59.3% | 56 | +1.4% | +75080 | 46.7 | 2% |
| cdb33b | 11 | +9.2% | 140 | +9.3% | +78873 | 50.8 | 3.6% |
| dfa240 | 13 | +2.2% | 103 | +26% | +75795 | 34.4 | 3.9% |
| fec67e | 4 | +36% | 48 | +25.6% | +53488 | 55.8 | 15.4% |
| b839b3 | 23 | +21.8% | 179 | +6.3% | +8518 | 65.1 | 49.6% |
| b70f9a | 3 | +41.1% | 22 | +45.9% | +33885 | 38.3 | 1.1% |
| 7b4652 | 4 | +33.3% | 83 | +35% | +30423 | 59.6 | 24.4% |
| 4b912c | 36 | +4.6% | 331 | +11.1% | +22573 | 21.3 | 1.5% |
| 12c933 | 4 | +18.6% | 47 | +11.8% | +26374 | 46.9 | 7.5% |
| 7dd2e5 | 13 | +17.4% | 14 | +24.1% | +10372 | 0.2 | 0% |
| a1684d | 5 | +27.9% | 27 | +31.6% | +8947 | 53.2 | 5.7% |

## Confirmed bleeders (≥3 bets in both sources, negative in both)

| Wallet | A bets | A flat ROI | B bets | B $ ROI | B $ PnL | walletBase | Lifetime ROI |
|---|---|---|---|---|---|---|---|
| 11381f | 3 | -4.2% | 37 | -21% | -13163 | 38.7 | 2.9% |
| 7d395d | 3 | -32% | 30 | -12.6% | -5846 | 3.7 | 0.4% |
| 4edc5b | 6 | -25.8% | 23 | -1.7% | -9542 | 54.4 | 12.4% |
| daf4de | 3 | -39.6% | 48 | -2.2% | -13958 | 52.9 | 4.5% |
| a0d6d2 | 12 | -22.6% | 117 | -1.2% | -5140 | 50 | 0% |
| 30935c | 4 | -37.5% | 63 | -12.8% | -18997 | 44.6 | 6.3% |
| e70853 | 10 | -41.1% | 88 | -0.1% | -2614 | 41.3 | 1.5% |
| 97e406 | 3 | -56.3% | 21 | -6.7% | -29564 | 53.5 | 11.4% |
| 138d9b | 5 | -11.3% | 55 | -10.5% | -40837 | 48.4 | 3.9% |
| c289a0 | 3 | -100% | 38 | -27.8% | -18518 | 31 | 1.5% |
| 065ad0 | 3 | -34% | 41 | -24.3% | -38500 | 15.7 | 1.6% |
| d3f7ad | 5 | -11.1% | 46 | -47.6% | -52478 | 50.3 | 8.6% |
| 407422 | 4 | -100% | 8 | -35.1% | -21331 | 19.2 | 1.1% |
| f2f960 | 26 | -13.3% | 142 | -8.7% | -52269 | 65.2 | 4.3% |
| d50c53 | 4 | -21.9% | 15 | -48.5% | -89467 | 57.3 | 13.9% |
| 1d14b8 | 5 | -61.5% | 16 | -20.8% | -69455 | 53.3 | 5.2% |
| 6b853d | 38 | -14.7% | 175 | -5.9% | -45253 | 32.9 | 3.2% |
| bc44b0 | 37 | -3.4% | 403 | -3.7% | -95741 | 14 | 1.2% |
| 7703d4 | 23 | -4.3% | 345 | -11.7% | -102634 | 10.5 | 1.1% |
| b28d26 | 3 | -35.2% | 19 | -26.4% | -103154 | 32.4 | 1.4% |
| bc35e3 | 47 | -4.8% | 440 | -4.2% | -94700 | 19.2 | 1.8% |
| a0cff6 | 10 | -32.8% | 415 | -1.8% | -87720 | 39.7 | 5.1% |
| 779ef0 | 17 | -9.1% | 261 | -5.7% | -115278 | 61.7 | 3.7% |
| d3381b | 4 | -100% | 31 | -19.8% | -99885 | 60.6 | 5.5% |
| 2a8409 | 4 | -100% | 16 | -51.6% | -102590 | 41.2 | 4.7% |
| a8c991 | 4 | -9% | 42 | -7.5% | -139988 | 65.8 | 4.4% |
| 0f9d74 | 78 | -6.5% | 744 | -6.2% | -97118 | 44 | 6.3% |
| bbd49f | 6 | -4.3% | 43 | -33.5% | -166025 | 44.8 | 2.2% |
| 348973 | 6 | -7.9% | 53 | -22.7% | -167690 | 55.4 | 5% |
| 63fc82 | 12 | -7.5% | 80 | -11.4% | -183102 | 38.3 | 4.8% |
| 981187 | 11 | -1% | 20 | -5.4% | -195034 | 69.3 | 6.3% |
| 8ec926 | 20 | -4.3% | 399 | -12.4% | -205685 | 25.1 | 1.8% |
| ad9e7a | 3 | -100% | 39 | -22.6% | -186184 | 62.4 | 7.4% |
| 8a3782 | 13 | -26.9% | 113 | -1.1% | -195343 | 83.5 | 9.4% |
| 705ba1 | 35 | -0.9% | 120 | -3.6% | -251988 | 46.5 | 3.3% |
| dcafd2 | 43 | -18.1% | 303 | -13.1% | -220180 | 18.1 | 1% |
| 0336b0 | 7 | -54.9% | 45 | -57.7% | -412128 | 51.9 | 5.7% |
| 710c2e | 8 | -52.1% | 109 | -7.4% | -413371 | 16.4 | 1.4% |
| cf627b | 4 | -43.8% | 11 | -39.9% | -447059 | 69.7 | 8.5% |
| c9bba3 | 14 | -4.7% | 163 | -9.5% | -469664 | 16.7 | 1.5% |
| 9a69c2 | 53 | -21.4% | 141 | -28.4% | -390823 | 17.5 | 0.4% |
| 621848 | 13 | -30% | 45 | -75.4% | -537738 | 16.2 | 1.5% |
| c2aeea | 12 | -12% | 647 | -6.1% | -567612 | 53.8 | 7.6% |
| 8da2ca | 9 | -12.4% | 29 | -17.2% | -596549 | 47.1 | 4.7% |
| 73f5b0 | 16 | -26.4% | 60 | -28.3% | -586640 | 51.1 | 1.8% |
| 7a9723 | 14 | -36.7% | 72 | -11% | -587149 | 71 | 4.3% |
| fcc12b | 36 | -29.5% | 177 | -6.6% | -541994 | 46 | 2.2% |
| e077f1 | 5 | -27.9% | 10 | -64.1% | -667019 | 42.3 | 3.7% |
| f9e3d0 | 11 | -12.7% | 88 | -15.4% | -865706 | 38 | 4.5% |
| 43020b | 3 | -100% | 63 | -41.9% | -1028474 | 61.2 | 3.2% |
| de3f67 | 14 | -6.7% | 85 | -16.2% | -1188835 | 77.1 | 8% |
| cd2f63 | 135 | -3.9% | 2273 | -5.8% | -1618015 | 56.7 | 12.2% |
| 12192c | 12 | -53.8% | 277 | -15% | -1873117 | 67.3 | 4.9% |
| 10c684 | 15 | -47.5% | 136 | -17.1% | -2056458 | 35.9 | 0.3% |
| eeabaf | 87 | -8.4% | 499 | -12.3% | -2343972 | 39.9 | 1.1% |
| 6bd96a | 18 | -14.4% | 262 | -12.9% | -3812755 | 53.7 | 2.1% |

---
## Data model (for Firebase sync)

Profiles are written to `data/wallet-profiles.json`. When you're ready to push them to Firestore run:

```bash
node scripts/exportWalletProfiles.js --write-firebase
```

That upserts each profile into the `sharpWalletProfiles` collection keyed by `walletShort`, so V8 can read it live.

Each profile document has this shape:

```json
{
  "walletShort": "fcc12b",
  "walletAddress": "0x…",
  "verdict": "CONFIRMED_WINNER",
  "tier": "ELITE", "latestLbRank": 34,
  "picks":     { "n": 13, "wins": 8, "wr": 61.5, "flatRoi": 9.8, "flatPnl": 1.28 },
  "positions": { "n": 15, "wins": 8, "wr": 53.3, "invested": 944079, "settledPnl": 48627, "dollarRoi": 5.2 },
  "sizeSignal":  { "medianInvested": 42000, "routine": {…}, "above": {…}, "wayAbove": {…} },  // VAULT-only
  "shadowSignal":{ "n": 7, "dollarRoi": -3.1, "medianInvested": 4200 },  // SHADOW-only (may be null)
  "sizeRatioBands": { "usual": 3300, "positions": { bands: { light|lean|full|press } }, "picks": {…} },
  "latest": { "walletBase": 77.8, "roiNorm": 67.8, "lifetimeRoi": 6.3, "rank": 34 },
  "bySport": { "MLB": {…}, "NBA": {…}, "NHL": {…} },
  "byMarket": { "ML": {…}, "SPREAD": {…}, "TOTAL": {…} },
  "firstBetDate": "2026-04-17", "lastBetDate": "2026-04-21"
}
```
