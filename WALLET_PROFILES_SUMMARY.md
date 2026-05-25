# Wallet Profiles Summary

Generated: 5/25/2026, 3:12:39 AM ET · V8 cutover: 2026-04-18 · whitelistVersion: 2

Monitoring artifact for the nightly `sharpWalletProfiles` rebuild. Shows how many wallets qualify for each whitelist tier per sport, who the top performers are, and what changed since the last run.

**Population**: 215 wallets · 2129 graded picks · 8446 graded positions.

## Population by verdict

| Verdict | Wallets |
|---|---|
| POSITIONS_ONLY_NEGATIVE | 42 |
| INCONCLUSIVE | 41 |
| POSITIONS_ONLY_POSITIVE | 34 |
| CONFIRMED_BLEEDER | 34 |
| CONFIRMED_WINNER | 29 |
| MIXED_PICKS_GOOD_$_BAD | 18 |
| MIXED_PICKS_BAD_$_GOOD | 17 |

## Whitelist tiers per sport

Minimum 2 bets per sport. Precedence: CONFIRMED > FLAT > WR50. "FLAT-or-better" is the population Phase 2 uses for the green badge and Δ consensus math.

| Sport | CONFIRMED | FLAT-or-better | WR50-only | Active (≥2 bets) | Any activity |
|---|---|---|---|---|---|
| MLB | 18 | 28 | 3 | 86 | 101 |
| NBA | 54 | 75 | 21 | 168 | 184 |
| NHL | 20 | 25 | 10 | 75 | 92 |

## Promotion source mix (v2 — Source-B-only trial)

Per-sport breakdown of how each FLAT-or-better wallet earned its tier. **B (new)** column counts wallets that would have been excluded under v1 (Source-A-only). Re-evaluate after 2026-05-24.

| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |
|---|---|---|---|---|---|
| MLB | 4 | 8 | 16 | 28 | 57.1% |
| NBA | 10 | 29 | 36 | 75 | 48% |
| NHL | 5 | 11 | 9 | 25 | 36% |

## Top FLAT-or-better wallets per sport

### MLB

| # | Wallet | Tier | N | WR% | Flat ROI | Flat PnL (u) | $ ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | b31fc6 | CONFIRMED | 2 | 100% | +128% | +2.56 | +66.5% | +58292 |
| 2 | c289a0 | FLAT | 3 | 100% | +95.6% | +2.87 | -14% | -3679 |
| 3 | eeabaf | FLAT | 9 | 66.7% | +93.7% | +8.43 | -9.3% | -121122 |
| 4 | 880232 | CONFIRMED | 2 | 100% | +90.9% | +1.82 | +91.4% | +363539 |
| 5 | dfa240 | CONFIRMED | 1 | 100% | +87% | +0.87 | +82.9% | +8885 |
| 6 | c9bba3 | CONFIRMED | 1 | 100% | +80.6% | +0.81 | +31.8% | +79172 |
| 7 | c668b3 | CONFIRMED | 7 | 71.4% | +40.5% | +2.84 | +22.6% | +2772 |
| 8 | a10ff5 | FLAT | 19 | 63.2% | +24.9% | +4.74 | -14.4% | -31449 |
| 9 | 981187 | FLAT | 8 | 62.5% | +20.7% | +1.65 | — | +0 |
| 10 | 7923c4 | FLAT | 18 | 55.6% | +8.2% | +1.47 | -25.8% | -791514 |

### NBA

| # | Wallet | Tier | N | WR% | Flat ROI | Flat PnL (u) | $ ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | CONFIRMED | 2 | 100% | +283% | +5.66 | +104.7% | +513563 |
| 2 | a8c991 | CONFIRMED | 1 | 100% | +114% | +1.14 | +82.2% | +226070 |
| 3 | 4a9953 | CONFIRMED | 2 | 100% | +108.2% | +2.16 | +44.5% | +23426 |
| 4 | f9e3d0 | FLAT | 1 | 100% | +93.5% | +0.93 | -33.5% | -311745 |
| 5 | 12ad50 | FLAT | 3 | 100% | +91.3% | +2.74 | -7.9% | -70392 |
| 6 | b51a56 | CONFIRMED | 6 | 83.3% | +90.7% | +5.44 | +33.8% | +41911 |
| 7 | 2e8da5 | CONFIRMED | 10 | 80% | +80.6% | +8.06 | +48.1% | +540174 |
| 8 | 11b032 | CONFIRMED | 7 | 85.7% | +77.1% | +5.40 | +93.7% | +514430 |
| 9 | 769c38 | CONFIRMED | 12 | 91.7% | +68.5% | +8.22 | +34% | +97329 |
| 10 | 8ec926 | FLAT | 7 | 85.7% | +64.7% | +4.53 | -3.7% | -2530 |

### NHL

| # | Wallet | Tier | N | WR% | Flat ROI | Flat PnL (u) | $ ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | d5017f | CONFIRMED | 1 | 100% | +145% | +1.45 | +124.5% | +50514 |
| 2 | 8366f5 | FLAT | 2 | 100% | +114.9% | +2.30 | -21.5% | -240002 |
| 3 | 799fad | CONFIRMED | 2 | 100% | +94.1% | +1.88 | +170.3% | +192702 |
| 4 | fec67e | CONFIRMED | 4 | 75% | +70.5% | +2.82 | +12.7% | +16849 |
| 5 | 7eb989 | CONFIRMED | 1 | 100% | +70.4% | +0.70 | +30.4% | +16324 |
| 6 | 981187 | FLAT | 7 | 85.7% | +64.6% | +4.52 | -18.3% | -41748 |
| 7 | 30935c | CONFIRMED | 4 | 75% | +52.7% | +2.11 | +112.2% | +3486 |
| 8 | bc44b0 | FLAT | 1 | 100% | +48.8% | +0.49 | -37.9% | -10226 |
| 9 | 065ad0 | CONFIRMED | 3 | 66.7% | +46.7% | +1.40 | +9.2% | +4974 |
| 10 | fcc12b | CONFIRMED | 10 | 70% | +31.5% | +3.15 | +13.1% | +158207 |

## Churn since last run

**24** wallet-sport tier changes since the prior run.

| Wallet | Sport | From | To | Notes |
|---|---|---|---|---|
| 12192c | MLB | WR50 | — |  |
| 4a0563 | NBA | WR50 | CONFIRMED |  |
| 57be17 | NBA | WR50 | — |  |
| 659b1a | NBA | — | FLAT |  |
| 6b853d | NHL | CONFIRMED | WR50 |  |
| 710c2e | NBA | — | CONFIRMED |  |
| 710c2e | NHL | — | CONFIRMED |  |
| 779ef0 | NHL | FLAT | CONFIRMED |  |
| 7923c4 | NHL | CONFIRMED | WR50 |  |
| 79c052 | NBA | CONFIRMED | — |  |
| 86b9f9 | NBA | FLAT | — |  |
| 8a3782 | NHL | WR50 | — |  |
| 8ce2ce | NBA | — | CONFIRMED |  |
| 981187 | NHL | CONFIRMED | FLAT |  |
| 9a69c2 | MLB | CONFIRMED | FLAT |  |
| a0cff6 | NBA | WR50 | — |  |
| a0d6d2 | MLB | — | WR50 |  |
| a0d6d2 | NHL | FLAT | WR50 |  |
| b19a27 | MLB | CONFIRMED | FLAT |  |
| b19a27 | NHL | — | WR50 |  |
| c2aeea | MLB | WR50 | FLAT |  |
| c668b3 | NHL | WR50 | — |  |
| dcafd2 | NHL | CONFIRMED | WR50 |  |
| f2d227 | NBA | WR50 | CONFIRMED |  |

---
*Generated by `scripts/exportWalletProfiles.js`.*
