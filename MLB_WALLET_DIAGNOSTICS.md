# MLB WALLET DIAGNOSTICS

Generated: **2026-04-30T10:55:41.395Z** · today=2026-04-30 · v6 cutover=2026-04-18

## §1. Source A — MLB picks side (`peak.v8Scoring.walletDetails`)

Every distinct wallet that has appeared on any side of any graded MLB pick since the v6 cutover. This is the WIDE universe — whitelist promotion adds the dollar-PnL gate on top of this.

| Metric | Value |
|---|---|
| Total v6-era MLB sides scanned | 85 |
| MLB graded sides | 83 |
| MLB graded sides with walletDetails | 79 (95.2%) |
| Total MLB wallet-bet rows (deduped per game) | 222 |
| Distinct MLB wallets in Source A | **31** |

### §1a. N-distribution (number of MLB graded bets per wallet)

| N bets | # Wallets | Cumulative ≥ N |
|---|---|---|
| 1 | 10 | 31 |
| 2 | 4 | 21 |
| 3 | 3 | 17 |
| 4 | 1 | 14 |
| 5-7 | 1 | 13 |
| 8-12 | 7 | 12 |
| 13+ | 5 | 5 |

**Wallets with N ≥ 2 in MLB (eligible for FLAT/CONFIRMED):** 21 (of 31 total).

### §1b. Recency

| Bucket | # Wallets |
|---|---|
| Active (lastDate ≥ 2026-04-23) | 22 |
| Active (lastDate ≥ 2026-04-27) | 17 |
| Stale (lastDate < 2026-04-23) | 9 |

### §1c. Top 15 MLB wallets by Source A volume

| # | Wallet | N | WR | Flat ROI | Flat PnL (u) | Days active | First → Last |
|---|---|---|---|---|---|---|---|
| 1 | `cd2f63` | 44 | 48% | -4.3% | -1.91 | 5 | 2026-04-25 → 2026-04-29 |
| 2 | `4c64aa` | 20 | 45% | -13.7% | -2.75 | 6 | 2026-04-19 → 2026-04-29 |
| 3 | `bc3532` | 20 | 35% | -30.9% | -6.17 | 5 | 2026-04-25 → 2026-04-29 |
| 4 | `fcc12b` | 17 | 53% | +7.4% | +1.25 | 9 | 2026-04-18 → 2026-04-29 |
| 5 | `b19a27` | 16 | 56% | +10.7% | +1.72 | 4 | 2026-04-24 → 2026-04-27 |
| 6 | `12192c` | 12 | 50% | -2.4% | -0.29 | 8 | 2026-04-18 → 2026-04-29 |
| 7 | `6bd96a` | 12 | 42% | -21.6% | -2.59 | 5 | 2026-04-20 → 2026-04-26 |
| 8 | `dcafd2` | 10 | 70% | +33.2% | +3.32 | 4 | 2026-04-18 → 2026-04-22 |
| 9 | `b05143` | 9 | 44% | -8.6% | -0.77 | 6 | 2026-04-19 → 2026-04-29 |
| 10 | `6b853d` | 9 | 33% | -29.5% | -2.65 | 5 | 2026-04-19 → 2026-04-26 |
| 11 | `63fc82` | 9 | 78% | +52.9% | +4.76 | 6 | 2026-04-22 → 2026-04-28 |
| 12 | `981187` | 8 | 63% | +20.7% | +1.65 | 3 | 2026-04-18 → 2026-04-20 |
| 13 | `7923c4` | 5 | 40% | -25.0% | -1.25 | 2 | 2026-04-26 → 2026-04-28 |
| 14 | `8c1eae` | 4 | 50% | +5.2% | +0.21 | 3 | 2026-04-19 → 2026-04-29 |
| 15 | `1d14b8` | 3 | 33% | -35.8% | -1.07 | 3 | 2026-04-19 → 2026-04-22 |

---
## §2. Source B — MLB position side (`sharp_action_positions`)

Every wallet × MLB position we have ingested from the on-chain sharp action feed. This is fully independent of the picks we ship — it captures every bet a tracked sharp wallet has placed regardless of whether we featured the game.

| Metric | Value |
|---|---|
| Total MLB positions | 545 |
| · GRADED | 542 |
| · · VAULT | 332 |
| · · SHADOW | 210 |
| · PENDING | 3 |
| · OPEN | 0 |
| Distinct walletShort (any status) | 51 |
| Distinct walletShort (GRADED only) | **49** |

### §2a. N-distribution (graded MLB positions per wallet)

| N positions | # Wallets |
|---|---|
| 1 | 10 |
| 2 | 5 |
| 3 | 5 |
| 4 | 3 |
| 5-9 | 10 |
| 10-19 | 7 |
| 20+ | 9 |

**Wallets with N ≥ 2 GRADED MLB positions:** 39.

### §2b. Top 15 MLB wallets by Source B volume

| # | Wallet | N pos | Vault | Shadow | $ Invested | $ PnL | $ ROI | LB rank | Days |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `cd2f63` | 94 | 18 | 76 | +$405,970 | -$33,737 | -8.3% | 182 | 6 |
| 2 | `b19a27` | 47 | 28 | 19 | +$388,454 | +$9,664 | +2.5% | 139 | 6 |
| 3 | `4c64aa` | 35 | 19 | 16 | +$711,176 | -$24,319 | -3.4% | 158 | 11 |
| 4 | `12192c` | 31 | 24 | 7 | +$1,384,769 | -$208,198 | -15.0% | 20 | 12 |
| 5 | `bc3532` | 31 | 13 | 18 | +$163,317 | -$24,372 | -14.9% | 45 | 7 |
| 6 | `fcc12b` | 28 | 18 | 10 | +$1,037,605 | -$10,136 | -1.0% | 44 | 9 |
| 7 | `63fc82` | 25 | 17 | 8 | +$397,485 | +$45,238 | +11.4% | 424 | 8 |
| 8 | `dcafd2` | 22 | 19 | 3 | +$138,218 | +$31,477 | +22.8% | 416 | 6 |
| 9 | `b05143` | 21 | 20 | 1 | +$955,526 | +$154,486 | +16.2% | 139 | 8 |
| 10 | `a0d6d2` | 16 | 16 | 0 | +$2,590 | -$42 | -1.6% | — | 1 |
| 11 | `7f00bc` | 16 | 12 | 4 | +$28,282 | -$11,581 | -40.9% | — | 6 |
| 12 | `7923c4` | 16 | 10 | 6 | +$450,186 | +$53,851 | +12.0% | 188 | 4 |
| 13 | `8c1eae` | 15 | 12 | 3 | +$30,612 | -$1,702 | -5.6% | 234 | 8 |
| 14 | `6b853d` | 15 | 14 | 1 | +$80,365 | -$17,804 | -22.2% | 463 | 7 |
| 15 | `6bd96a` | 13 | 2 | 11 | +$449,221 | -$192,231 | -42.8% | 26 | 4 |

---
## §3. Cross-source — MLB intersection

| Direction | Count |
|---|---|
| Wallets in Source A AND Source B (full visibility) | 27 |
| Wallets in Source A ONLY (took side on a featured pick, no positions on this MLB feed) | 4 |
| Wallets in Source B ONLY (placed graded MLB position, never appeared on a featured pick) | 22 |

**Promotion fundamentals:** A wallet needs N≥2 in BOTH sources to earn CONFIRMED. Currently **19** MLB wallets clear N≥2 on both sources.

---
## §4. Why the MLB whitelist is thin

Two independent floors gate Δw promotion. Both must clear N ≥ 2 in MLB.

| Floor | Wallets clearing today |
|---|---|
| Source A: N ≥ 2 with **flat ROI > 0** | 7 |
| Source A: N ≥ 2 with **flat ROI ≤ 0** (eligible for FLAT but bleeding) | 14 |
| Source A: N = 1 (one bet from clearing N-floor) | 10 |
| Source B: N ≥ 2 with **$ ROI > 0** (CONFIRMED gate) | 17 |
| Source B: N ≥ 2 with **$ ROI ≤ 0** | 22 |

---
## §5. Daily MLB activity (sanity check)

| Date | A: wallets on graded picks | A: bet rows | B: wallets w/ graded position | B: positions |
|---|---|---|---|---|
| 2026-04-17 | 0 | 0 | 18 | 53 |
| 2026-04-18 | 5 | 9 | 12 | 23 |
| 2026-04-19 | 10 | 22 | 13 | 33 |
| 2026-04-20 | 8 | 10 | 9 | 20 |
| 2026-04-21 | 10 | 17 | 4 | 6 |
| 2026-04-22 | 7 | 12 | 13 | 33 |
| 2026-04-23 | 6 | 7 | 22 | 40 |
| 2026-04-24 | 3 | 6 | 17 | 38 |
| 2026-04-25 | 7 | 16 | 13 | 48 |
| 2026-04-26 | 11 | 43 | 16 | 78 |
| 2026-04-27 | 8 | 19 | 8 | 29 |
| 2026-04-28 | 12 | 34 | 18 | 77 |
| 2026-04-29 | 7 | 27 | 14 | 57 |
| 2026-04-30 | 0 | 0 | 4 | 7 |

---
## §6. Sport-to-sport comparison (context for "is MLB low?")

| Sport | Distinct wallets in A | Distinct wallets in B (graded) | A∩B | A: N≥2 | B: N≥2 | CONFIRMED+FLAT |
|---|---|---|---|---|---|---|
| MLB | 31 | 49 | 27 | 21 | 39 | 7 |
| NBA | 90 | 105 | 86 | 64 | 89 | 25 |
| NHL | 37 | 41 | 31 | 23 | 35 | 10 |

---
## §7. Verdict

- We are tracking **31** distinct MLB wallets in Source A (graded-pick walletDetails) and **49** in Source B (sharp_action_positions GRADED) over 14 active dates since 2026-04-18.
- 21 of the 31 Source-A wallets have cleared N ≥ 2 in MLB. The other 10 are stuck at N=1 (need one more bet to be eligible).
- 7 of those have flat ROI > 0 (the FLAT gate). 17 of the Source-B wallets have $ ROI > 0 at N ≥ 2 (the CONFIRMED gate's positions side).
- Net result: **7** wallets currently qualify for Δw in MLB (matches §7b's "7 profitable").

### Is the universe size logical?

**Our coverage averages 15.9 wallet-bet rows per active MLB day** (across 5.9 graded sides/day).  Compared to NBA's 40.2 wallet-bet rows/day and NHL's 10.8/day.

**MLB-specific structural reasons** for thinner coverage:
- We ship far fewer MLB picks per day than NBA — total v6-era MLB graded sides=83 vs NBA=105, NHL=37.
- Source B captures ALL sharp positions (not just shipped picks) — that's why 49 > 31: 22 wallets bet MLB games we never featured.
