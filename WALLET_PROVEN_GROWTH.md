# Proven-Winner Roster Growth & Sport-Lag Diagnostic

Generated: 4/29/2026, 7:27:40 AM ET

**Definitions** — "proven winner" = whitelist tier **CONFIRMED** or **FLAT**, identical to what `exportWalletProfiles.js` writes and what `backfillWalletConsensus.js` reads when it computes Δ_winner. Specifically, in a single sport with ≥ 2 graded bets:

- `CONFIRMED` — flat ROI > 0 in **Source A** (`v8Scoring.walletDetails` from graded picks) **AND** dollar ROI > 0 in **Source B** (`sharp_action_positions`)
- `FLAT`      — flat ROI > 0 in Source A (Source B may be missing or negative)
- `WR50`      — WR ≥ 50% only (not used for Δ_winner — included here as a leading indicator)

**Coverage** — V8 cutover **2026-04-18** onward · 760 wallet-bets · 1657 positions · sports: MLB, NBA, NHL · dates: 2026-04-18 → 2026-04-29 (12 graded days).

---
## §1. Current proven-winner roster per sport (snapshot now)

Roster as of 2026-04-29. Tier counts assume ≥ 2 bets in that sport.

| Sport | Wallets seen | Eligible (≥2 picks) | CONFIRMED | FLAT | **Proven (C+F)** | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 44 | 21 | 5 | 2 | **7** | 3 | 15.9% |
| NBA | 100 | 63 | 20 | 6 | **26** | 16 | 26.0% |
| NHL | 44 | 23 | 8 | 2 | **10** | 7 | 22.7% |

Total proven across sports: **43** wallets (script reconstruction). `Conv %` is what fraction of all wallets seen in that sport graduated to CONFIRMED+FLAT — the bottom-line "yield" per sport.

### §1b. Ground-truth check vs live whitelist

The live whitelist that the engine actually reads at lock time is `sharpWalletProfiles`, written by `scripts/exportWalletProfiles.js`. Reconstructed numbers above should track these closely. Drift = either the whitelist hasn't been re-exported recently, or this script has different cohort logic.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 5 · 5 | 2 · 2 | 3 · 3 | in sync |
| NBA | 20 · 20 | 6 · 6 | 16 · 16 | in sync |
| NHL | 8 · 8 | 2 · 2 | 7 · 7 | in sync |

Live whitelist totals: **33 CONFIRMED + 10 FLAT = 43 proven** across all sports. Script reconstruction: **43 proven**. Differences are usually because `exportWalletProfiles.js` was last run on an older Source-B cut (positions arrive ~1 day after picks grade).

---
## §2. Daily cumulative proven-winner growth

For each graded day D, the proven-winner roster is **recomputed using only data ≤ D**. This is the live whitelist you would have had at the end of that day. Format per cell: **proven** (CONFIRMED · FLAT).

| Date | MLB | NBA | NHL | TOTAL |
|---|---|---|---|---|
| 2026-04-18 | **2** (1·1) | **0** (0·0) | **0** (0·0) | **2** |
| 2026-04-19 | **3** (2·1) | **3** (3·0) | **1** (0·1) | **7** |
| 2026-04-20 | **6** (4·2) | **8** (6·2) | **2** (2·0) | **16** |
| 2026-04-21 | **6** (4·2) | **10** (7·3) | **5** (1·4) | **21** |
| 2026-04-22 | **6** (5·1) | **15** (12·3) | **10** (3·7) | **31** |
| 2026-04-23 | **6** (5·1) | **21** (18·3) | **10** (5·5) | **37** |
| 2026-04-24 | **6** (4·2) | **23** (17·6) | **9** (7·2) | **38** |
| 2026-04-25 | **8** (4·4) | **22** (17·5) | **9** (6·3) | **39** |
| 2026-04-26 | **5** (3·2) | **25** (19·6) | **9** (6·3) | **39** |
| 2026-04-27 | **7** (2·5) | **24** (18·6) | **9** (7·2) | **40** |
| 2026-04-28 | **7** (4·3) | **26** (20·6) | **10** (8·2) | **43** |
| 2026-04-29 | **7** (5·2) | **26** (20·6) | **10** (8·2) | **43** |

Day-over-day deltas are inferred from the column climbs. A flat sport across multiple days = no new graduations that week.

---
## §3. Pipeline funnel — where each sport leaks

Each row counts wallets surviving each gate, in order. The biggest drop tells you the bottleneck. Gates:

1. **Seen** — wallet placed ≥ 1 bet in the sport (in any source)
2. **Eligible** — wallet has ≥ 2 graded picks (Source A) — required for FLAT/CONFIRMED
3. **Flat-OK** — eligible AND flat ROI > 0 (becomes FLAT or better)
4. **$-OK** — Flat-OK AND has ≥2 positions with dollar ROI > 0 (CONFIRMED)
5. **Promoted** — final whitelisted: CONFIRMED + FLAT (also = §1 Proven)

| Sport | 1·Seen | 2·Eligible (% of Seen) | 3·Flat-OK (% of Eligible) | 4·$-OK (% of Flat-OK) | 5·Promoted | Bottleneck |
|---|---|---|---|---|---|---|
| MLB | 44 | 21 (48%) | 7 (33%) | 5 (71%) | **7** | edge (Eligible→Flat-OK) 67% |
| NBA | 100 | 63 (63%) | 26 (41%) | 20 (77%) | **26** | edge (Eligible→Flat-OK) 59% |
| NHL | 44 | 23 (52%) | 10 (43%) | 8 (80%) | **10** | edge (Eligible→Flat-OK) 57% |

**Reading the bottleneck:**
- `sample` — too few wallets are placing ≥2 bets per sport. Slate density problem (more games / more whales needed).
- `edge` — wallets are getting reps but losing flat. The cohort placing here is just not sharp enough yet, OR variance is hiding signal in the small sample.
- `data` — wallets clear the flat bar in Source A but Source B (sharp_action_positions) is missing or negative. CONFIRMED requires both — FLAT-only wallets count toward proven even without dollar data.

---
## §4. Bubble wallets — who graduates next

Wallets currently NOT promoted but close enough that one or two more reps could push them over. Two flavors:

- **One-bet-away** — has 1 graded bet in the sport (won), needs one more positive bet to clear MIN=2 AND flat-positive.
- **Just-under** — has ≥2 graded bets but flat ROI is between −10% and 0% (one win flips them).

### MLB

**One-bet-away (won the only bet)**

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `c289a0…` | 1 | +1.38 | 3 | -94% |
| `c668b3…` | 1 | +1.12 | 0 | — |

**Just-under (≥2 bets, flat ROI ∈ (−10%, 0%])**

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `12192c…` | 10 | 50% | -1.4% | 24 | -18% |
| `4c64aa…` | 14 | 50% | -2.8% | 28 | -11% |
| `8c1eae…` | 2 | 50% | -4.5% | 10 | -39% |
| `cd2f63…` | 33 | 45% | -6.9% | 72 | -9% |

### NBA

**One-bet-away (won the only bet)**

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `11bf5d…` | 1 | +3.15 | 2 | 217% |
| `dded41…` | 1 | +3.15 | 1 | 376% |
| `e96b87…` | 1 | +2.05 | 3 | 29% |
| `0f9d74…` | 1 | +0.93 | 3 | -28% |
| `88c556…` | 1 | +0.93 | 3 | 42% |
| `5b5c69…` | 1 | +0.91 | 2 | 28% |
| `2bffeb…` | 1 | +0.43 | 4 | 33% |
| `fdd34f…` | 1 | +0.12 | 1 | 733% |

**Just-under (≥2 bets, flat ROI ∈ (−10%, 0%])**

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `73f5b0…` | 20 | 50% | -3.7% | 44 | -26% |
| `c668b3…` | 6 | 50% | -4.5% | 6 | 33% |
| `161f17…` | 2 | 50% | -4.5% | 2 | -10% |
| `d5017f…` | 2 | 50% | -4.5% | 2 | -11% |
| `bbd49f…` | 4 | 50% | -4.9% | 9 | -76% |
| `2d2ca8…` | 10 | 50% | -7.7% | 19 | 49% |

### NHL

**One-bet-away (won the only bet)**

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `4b2e78…` | 1 | +1.46 | 0 | — |
| `d5017f…` | 1 | +1.45 | 1 | 150% |
| `5c32f2…` | 1 | +1.40 | 0 | — |
| `cce0fd…` | 1 | +1.20 | 3 | 124% |
| `59266e…` | 1 | +1.05 | 0 | — |
| `0f9d74…` | 1 | +1.05 | 0 | — |
| `5c2194…` | 1 | +1.05 | 0 | — |
| `0dfdce…` | 1 | +0.89 | 0 | — |

**Just-under (≥2 bets, flat ROI ∈ (−10%, 0%])**

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `3033ee…` | 4 | 50% | -0.3% | 8 | -23% |
| `779ef0…` | 2 | 50% | -1.0% | 3 | 192% |
| `8a3782…` | 2 | 50% | -9.0% | 12 | 31% |
| `c5cea1…` | 2 | 50% | -10.0% | 5 | 22% |

---
## §5. Slate density per sport (the structural reason)

How much **wallet observation volume** each sport produces. A sport with 1.0 picks/day and 4 wallets/pick simply cannot graduate winners as fast as one with 6 picks/day and 9 wallets/pick — even if the underlying skill distribution is identical.

| Sport | Graded picks | Days w/ activity | Picks/day | Wallet-bets | Wallets/pick | Avg wallet sample |
|---|---|---|---|---|---|---|
| MLB | 66 | 11 | 6.00 | 195 | 2.95 | 4.43 |
| NBA | 78 | 11 | 7.09 | 441 | 5.65 | 4.41 |
| NHL | 29 | 11 | 2.64 | 124 | 4.28 | 2.82 |

A sport with low **avg wallet sample** (< ~2.5) cannot graduate many wallets to FLAT/CONFIRMED no matter how good the wallets are — they simply haven't hit MIN=2 bets yet. This is the dominant lag mechanism early in a season.

---
## §6. Plain-English verdict per sport

- **NBA** — **Leader.** 26 proven wallets (20 CONFIRMED · 6 FLAT). 7.1 picks/day with 4.4 avg wallet sample is comfortable — graduation curve is healthy.
- **NHL** — Lags leader by **16** wallets. only 43% of eligible wallets are flat-positive in this sample (variance or genuinely soft cohort).
- **MLB** — Lags leader by **19** wallets. only 33% of eligible wallets are flat-positive in this sample (variance or genuinely soft cohort).
