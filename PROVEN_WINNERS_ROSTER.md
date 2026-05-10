# PROVEN WINNERS ROSTER

Generated: **2026-04-30T10:42:57.062Z**

Wallets that currently qualify to drive **Δw (proven winner margin)** on Sharp Intel locks. Only wallets in **CONFIRMED** or **FLAT** tiers count toward Δw — WR50 and NULL are tracked for reporting but do NOT contribute to lock decisions.

---
## The bar — what a wallet has to clear

Two independent data sources feed the gate. Both come from `exportWalletProfiles.js`, written to `sharpWalletProfiles`. The bar is per-sport (a wallet can be CONFIRMED in NBA but NULL in MLB).

**Source A — Picks-side (flat 1u replay over `walletDetails`):**

- For every graded `sharpFlow{Picks,Spreads,Totals}` doc since 2026-04-18, take every wallet that appears in `peak.v8Scoring.walletDetails[]` for any side
- Each wallet × sport row computes:
  - `n` = bets in that sport
  - `wr` = wins / n
  - `flatRoi` = sum of 1u flat PnL ÷ n × 100  (decimal-odds win pays `dec − 1`, loss pays `−1`)

**Source B — Position-side (dollar-weighted PnL from `sharp_action_positions`):**

- Every GRADED row from `sharp_action_positions` per wallet × sport
- Computes `dollarRoi` = `sum(settledPnl) / sum(invested) × 100`

**Tier classification (per wallet × sport, exact code from `exportWalletProfiles.js`):**

```
const WHITELIST_MIN_BETS = 2;

flatOk   = picks.n   ≥ 2 AND picks.flatRoi   > 0     // Source A
dollarOk = positions.n ≥ 2 AND positions.dollarRoi > 0  // Source B
wr50Ok   = picks.n   ≥ 2 AND picks.wr ≥ 50%          // Source A only

if (flatOk && dollarOk) return CONFIRMED;   // both sources profitable
if (flatOk)             return FLAT;        // picks profitable, positions not yet ≥2 bets OR not profitable
if (wr50Ok)             return WR50;        // hits ≥50% WR but bleeds on flat ROI (variance / line shopping)
return null;                                // below the bar
```

**What gates Δw in production** (from `SharpFlow.jsx::computeWalletConsensus`):

```
for (const d of walletDetails) {
  const tier = profiles.get(d.wallet)?.bySport?.[sport]?.whitelistTier;
  if (tier !== 'CONFIRMED' && tier !== 'FLAT') continue;  // <-- the gate
  if (d.side === sideKey) forW++; else if (d.side) agW++;
}
Δw = forW − agW
```

Bottom line: **CONFIRMED + FLAT** is the universe of wallets whose vote moves Δw. WR50 wallets are surfaced in cards/tooltips but they do NOT bump Δw or trigger locks.

---
## Active rosters (CONFIRMED + FLAT) by sport

### MLB — 7 active (4 CONFIRMED · 3 FLAT)

| # | Wallet | Tier | LB rank | walletBase | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ Invested | $ PnL | $ ROI | First → Last |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `d5017f` | **CONFIRMED** | 450 | 53.3 | 2 | 100% | +104.0% | +2.08 | 6 | +$53002 | +$24549 | +46.3% | 2026-04-17 → 2026-04-28 |
| 2 | `63fc82` | **CONFIRMED** | 265 | 61.1 | 9 | 78% | +52.9% | +4.76 | 25 | +$397485 | +$45238 | +11.4% | 2026-04-22 → 2026-04-29 |
| 3 | `dcafd2` | **CONFIRMED** | 442 | 15 | 10 | 70% | +33.2% | +3.32 | 22 | +$138218 | +$31477 | +22.8% | 2026-04-17 → 2026-04-26 |
| 4 | `b19a27` | **CONFIRMED** | 31 | 83.1 | 16 | 56% | +10.7% | +1.72 | 47 | +$388454 | +$9664 | +2.5% | 2026-04-24 → 2026-04-30 |
| 5 | `981187` | **FLAT** | 109 | 71.6 | 8 | 63% | +20.7% | +1.65 | 0 | +$0 | +$0 | — | 2026-04-18 → 2026-04-21 |
| 6 | `fcc12b` | **FLAT** | 60 | 63.7 | 17 | 53% | +7.4% | +1.25 | 28 | +$1037605 | -$10136 | -1.0% | 2026-04-17 → 2026-04-29 |
| 7 | `8c1eae` | **FLAT** | 259 | 54.3 | 4 | 50% | +5.2% | +0.21 | 15 | +$30612 | -$1702 | -5.6% | 2026-04-17 → 2026-04-29 |

### NBA — 25 active (19 CONFIRMED · 6 FLAT)

| # | Wallet | Tier | LB rank | walletBase | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ Invested | $ PnL | $ ROI | First → Last |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `799fad` | **CONFIRMED** | 323 | 22.8 | 2 | 100% | +283.0% | +5.66 | 3 | +$490440 | +$513563 | +104.7% | 2026-04-21 → 2026-04-23 |
| 2 | `b51a56` | **CONFIRMED** | — | 85.6 | 3 | 100% | +129.8% | +3.89 | 9 | +$93383 | +$34824 | +37.3% | 2026-04-24 → 2026-04-29 |
| 3 | `7f00bc` | **CONFIRMED** | — | 58.7 | 4 | 100% | +117.1% | +4.68 | 17 | +$32577 | +$10183 | +31.3% | 2026-04-18 → 2026-04-30 |
| 4 | `5c32f2` | **CONFIRMED** | 62 | 47.3 | 2 | 50% | +107.5% | +2.15 | 8 | +$73389 | +$18090 | +24.6% | 2026-04-18 → 2026-04-28 |
| 5 | `cdb33b` | **CONFIRMED** | 408 | 21.9 | 4 | 50% | +100.0% | +4.00 | 9 | +$69375 | +$39043 | +56.3% | 2026-04-21 → 2026-04-25 |
| 6 | `12ad50` | **CONFIRMED** | 78 | 58.1 | 3 | 100% | +91.3% | +2.74 | 6 | +$377949 | +$120413 | +31.9% | 2026-04-21 → 2026-04-23 |
| 7 | `769c38` | **CONFIRMED** | 535 | 86.4 | 6 | 100% | +78.1% | +4.69 | 15 | +$199610 | +$62167 | +31.1% | 2026-04-18 → 2026-04-28 |
| 8 | `2e8da5` | **CONFIRMED** | 246 | 64.4 | 7 | 86% | +69.4% | +4.86 | 23 | +$475145 | +$231293 | +48.7% | 2026-04-21 → 2026-04-30 |
| 9 | `a1684d` | **CONFIRMED** | 333 | 51.9 | 6 | 100% | +55.7% | +3.34 | 10 | +$22723 | +$9247 | +40.7% | 2026-04-20 → 2026-04-29 |
| 10 | `b05143` | **CONFIRMED** | 49 | 71.6 | 8 | 75% | +47.8% | +3.83 | 18 | +$1181495 | +$375631 | +31.8% | 2026-04-17 → 2026-04-29 |
| 11 | `7923c4` | **CONFIRMED** | 136 | 43.7 | 4 | 75% | +45.3% | +1.81 | 7 | +$190855 | +$58683 | +30.7% | 2026-04-23 → 2026-04-29 |
| 12 | `4edc5b` | **CONFIRMED** | 115 | 73.4 | 4 | 50% | +44.7% | +1.79 | 9 | +$436083 | +$32358 | +7.4% | 2026-04-19 → 2026-04-20 |
| 13 | `52aeeb` | **CONFIRMED** | 33 | 61.1 | 22 | 59% | +32.1% | +7.06 | 48 | +$970965 | +$198784 | +20.5% | 2026-04-17 → 2026-04-30 |
| 14 | `946418` | **CONFIRMED** | — | 83.8 | 5 | 80% | +32.1% | +1.60 | 6 | +$11200 | +$800 | +7.1% | 2026-04-19 → 2026-04-29 |
| 15 | `b31fc6` | **CONFIRMED** | 100 | 55.8 | 3 | 67% | +28.4% | +0.85 | 6 | +$156036 | +$111003 | +71.1% | 2026-04-19 → 2026-04-29 |
| 16 | `78e8f1` | **CONFIRMED** | 151 | 72.4 | 7 | 43% | +23.0% | +1.61 | 15 | +$215393 | +$148260 | +68.8% | 2026-04-17 → 2026-04-29 |
| 17 | `40d814` | **CONFIRMED** | 411 | 40.6 | 5 | 40% | +11.5% | +0.58 | 14 | +$33270 | +$6391 | +19.2% | 2026-04-17 → 2026-04-29 |
| 18 | `b19a27` | **CONFIRMED** | 31 | 83.1 | 25 | 60% | +8.5% | +2.13 | 71 | +$1516471 | +$395165 | +26.1% | 2026-04-24 → 2026-04-30 |
| 19 | `6b853d` | **CONFIRMED** | — | 49.2 | 22 | 55% | +2.3% | +0.50 | 40 | +$258013 | +$21915 | +8.5% | 2026-04-17 → 2026-04-28 |
| 20 | `6bd96a` | **FLAT** | 60 | 40.1 | 2 | 50% | +187.5% | +3.75 | 7 | +$412763 | -$284369 | -68.9% | 2026-04-20 → 2026-04-26 |
| 21 | `7703d4` | **FLAT** | 448 | 17.6 | 2 | 100% | +91.1% | +1.82 | 2 | +$7166 | -$3014 | -42.1% | 2026-04-27 → 2026-04-27 |
| 22 | `a6c56e` | **FLAT** | 16 | 51.4 | 9 | 67% | +35.6% | +3.20 | 18 | +$1321590 | -$400103 | -30.3% | 2026-04-23 → 2026-04-28 |
| 23 | `779ef0` | **FLAT** | 340 | 21.2 | 8 | 50% | +22.1% | +1.77 | 21 | +$176476 | -$65606 | -37.2% | 2026-04-17 → 2026-04-28 |
| 24 | `92df91` | **FLAT** | 223 | 47.6 | 9 | 56% | +19.7% | +1.77 | 21 | +$18841 | -$4977 | -26.4% | 2026-04-21 → 2026-04-28 |
| 25 | `bc3532` | **FLAT** | 81 | 60.4 | 27 | 48% | +11.7% | +3.17 | 52 | +$913490 | -$260415 | -28.5% | 2026-04-21 → 2026-04-30 |

### NHL — 10 active (7 CONFIRMED · 3 FLAT)

| # | Wallet | Tier | LB rank | walletBase | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ Invested | $ PnL | $ ROI | First → Last |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `981187` | **CONFIRMED** | 109 | 71.6 | 5 | 100% | +100.6% | +5.03 | 4 | +$108072 | +$17646 | +16.3% | 2026-04-18 → 2026-04-21 |
| 2 | `799fad` | **CONFIRMED** | 323 | 22.8 | 2 | 100% | +94.1% | +1.88 | 2 | +$113175 | +$192702 | +170.3% | 2026-04-21 → 2026-04-23 |
| 3 | `bc3532` | **CONFIRMED** | 81 | 60.4 | 5 | 80% | +85.0% | +4.25 | 12 | +$194041 | +$65933 | +34.0% | 2026-04-21 → 2026-04-30 |
| 4 | `e70853` | **CONFIRMED** | 127 | 43.3 | 4 | 75% | +46.9% | +1.88 | 12 | +$246811 | +$134497 | +54.5% | 2026-04-22 → 2026-04-29 |
| 5 | `6b853d` | **CONFIRMED** | — | 49.2 | 5 | 80% | +42.6% | +2.13 | 6 | +$22539 | +$12181 | +54.0% | 2026-04-17 → 2026-04-28 |
| 6 | `dcafd2` | **CONFIRMED** | 442 | 15 | 2 | 50% | +20.0% | +0.40 | 5 | +$51142 | +$22585 | +44.2% | 2026-04-17 → 2026-04-26 |
| 7 | `dfa240` | **CONFIRMED** | 398 | 37.5 | 12 | 58% | +11.6% | +1.39 | 34 | +$101340 | +$40505 | +40.0% | 2026-04-18 → 2026-04-29 |
| 8 | `12192c` | **FLAT** | 30 | 62.6 | 5 | 60% | +36.0% | +1.80 | 12 | +$1066034 | -$147602 | -13.8% | 2026-04-17 → 2026-04-30 |
| 9 | `fcc12b` | **FLAT** | 60 | 63.7 | 4 | 75% | +32.5% | +1.30 | 10 | +$585358 | -$175165 | -29.9% | 2026-04-17 → 2026-04-29 |
| 10 | `b19a27` | **FLAT** | 31 | 83.1 | 2 | 50% | +10.0% | +0.20 | 16 | +$303229 | -$114539 | -37.8% | 2026-04-24 → 2026-04-30 |

---
## On the bench — WR50 (not yet promoted to Δw)

These wallets are hitting ≥50% WR but their flat ROI is ≤ 0, so they fail the FLAT bar. Variance / line-quality issues. Tracked but inert.

### MLB bench — 1

| Wallet | LB rank | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ ROI |
|---|---|---|---|---|---|---|---|
| `12192c` | 30 | 12 | 50% | -2.4% | -0.29 | 31 | -15.0% |

### NBA bench — 16

| Wallet | LB rank | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ ROI |
|---|---|---|---|---|---|---|---|
| `d3f7ad` | — | 5 | 60% | -11.1% | -0.55 | 8 | -18.8% |
| `8c1eae` | 259 | 11 | 55% | -2.4% | -0.26 | 33 | +16.6% |
| `0336b0` | 458 | 4 | 50% | -40.6% | -1.63 | 3 | -100.0% |
| `118cec` | 223 | 2 | 50% | -46.9% | -0.94 | 2 | +11.0% |
| `161f17` | 200 | 2 | 50% | -4.5% | -0.09 | 2 | -10.0% |
| `22ac33` | — | 2 | 50% | -37.2% | -0.74 | 0 | — |
| `2d2ca8` | 40 | 10 | 50% | -7.7% | -0.77 | 22 | +55.6% |
| `59266e` | 459 | 2 | 50% | -46.9% | -0.94 | 10 | -31.6% |
| `669791` | 465 | 4 | 50% | -13.2% | -0.53 | 4 | +10.8% |
| `73f5b0` | 74 | 20 | 50% | -3.7% | -0.74 | 44 | -26.5% |
| `af1697` | 36 | 8 | 50% | -11.0% | -0.88 | 15 | +29.5% |
| `bbd49f` | 238 | 4 | 50% | -4.9% | -0.20 | 10 | -78.0% |
| `c668b3` | 441 | 6 | 50% | -4.5% | -0.27 | 6 | +32.6% |
| `cce0fd` | 161 | 2 | 50% | -46.9% | -0.94 | 3 | -13.0% |
| `d5017f` | 450 | 2 | 50% | -4.5% | -0.09 | 2 | -11.3% |
| `d50c53` | — | 6 | 50% | -24.1% | -1.45 | 7 | -49.7% |

### NHL bench — 7

| Wallet | LB rank | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ ROI |
|---|---|---|---|---|---|---|---|
| `3033ee` | 1 | 4 | 50% | -0.3% | -0.01 | 8 | -23.4% |
| `4c64aa` | 175 | 2 | 50% | -20.6% | -0.41 | 8 | -51.7% |
| `779ef0` | 340 | 2 | 50% | -1.0% | -0.02 | 3 | +192.2% |
| `8a3782` | 1 | 2 | 50% | -9.0% | -0.18 | 14 | +19.1% |
| `a7a9cc` | 102 | 6 | 50% | -16.4% | -0.98 | 7 | +46.9% |
| `c289a0` | 417 | 2 | 50% | -20.6% | -0.41 | 3 | +32.5% |
| `c5cea1` | 24 | 2 | 50% | -10.0% | -0.20 | 5 | +21.9% |

---
## On the verge — N=1 in sport (one more graded bet from clearing the floor)

Wallets with exactly 1 graded pick in a sport (`WHITELIST_MIN_BETS=2` blocks them). One more bet either confirms or clears them.

### MLB N=1 — 10

| Wallet | Won? | Flat PnL (u) | LB rank | Pos N | $ ROI |
|---|---|---|---|---|---|
| `c289a0` | W | +1.38 | 417 | 5 | -63.5% |
| `c668b3` | W | +1.12 | 441 | 0 | — |
| `12ad50` | L | -1.00 | 78 | 0 | — |
| `407422` | L | -1.00 | 364 | 3 | +22.9% |
| `6bb8f7` | L | -1.00 | 154 | 3 | -51.1% |
| `763856` | L | -1.00 | 168 | 2 | -66.4% |
| `799fad` | L | -1.00 | 323 | 4 | +1.6% |
| `988e33` | L | -1.00 | 87 | 4 | -100.0% |
| `a7a9cc` | L | -1.00 | 102 | 8 | +0.3% |
| `b51a56` | L | -1.00 | — | 2 | -8.3% |

### NBA N=1 — 26

| Wallet | Won? | Flat PnL (u) | LB rank | Pos N | $ ROI |
|---|---|---|---|---|---|
| `11bf5d` | W | +3.15 | 386 | 2 | +216.7% |
| `dded41` | W | +3.15 | 425 | 1 | +376.2% |
| `e96b87` | W | +2.05 | 249 | 4 | +28.7% |
| `0b0329` | W | +1.50 | — | 2 | +163.2% |
| `3102c3` | W | +1.50 | 77 | 0 | — |
| `c5cea1` | W | +1.50 | 24 | 0 | — |
| `0f9d74` | W | +0.93 | — | 3 | -28.0% |
| `88c556` | W | +0.93 | 353 | 3 | +42.4% |
| `5b5c69` | W | +0.91 | — | 2 | +27.5% |
| `fc4582` | W | +0.87 | 119 | 1 | +92.3% |
| `2bffeb` | W | +0.43 | 376 | 4 | +32.9% |
| `fdd34f` | W | +0.12 | 221 | 1 | +733.3% |
| `e70853` | W | +0.06 | 127 | 2 | +0.6% |
| `22f091` | L | -1.00 | 445 | 1 | +108.3% |
| `3033ee` | L | -1.00 | 1 | 5 | +86.9% |
| `4a752c` | L | -1.00 | 69 | 3 | -44.5% |
| `6f5e06` | L | -1.00 | 210 | 0 | — |
| `763856` | L | -1.00 | 168 | 4 | -63.2% |
| `a24815` | L | -1.00 | 236 | 1 | -100.0% |
| `ad9e7a` | L | -1.00 | 463 | 1 | -100.0% |
| `b81a50` | L | -1.00 | 134 | 2 | -100.0% |
| `bb6f30` | L | -1.00 | 479 | 2 | -44.3% |
| `c71ce4` | L | -1.00 | — | 3 | +31.9% |
| `df4429` | L | -1.00 | 95 | 3 | -90.6% |
| `e393a0` | L | -1.00 | 445 | 2 | -100.0% |
| `e795e7` | L | -1.00 | — | 5 | +23.8% |

### NHL N=1 — 14

| Wallet | Won? | Flat PnL (u) | LB rank | Pos N | $ ROI |
|---|---|---|---|---|---|
| `4b2e78` | W | +1.46 | — | 0 | — |
| `d5017f` | W | +1.45 | 450 | 1 | +150.0% |
| `5c32f2` | W | +1.40 | 62 | 0 | — |
| `cce0fd` | W | +1.20 | 161 | 3 | +123.7% |
| `0f9d74` | W | +1.05 | — | 0 | — |
| `59266e` | W | +1.05 | 459 | 0 | — |
| `5c2194` | W | +1.05 | — | 0 | — |
| `0dfdce` | W | +0.89 | 383 | 0 | — |
| `7923c4` | W | +0.87 | 136 | 1 | +96.1% |
| `92df91` | W | +0.76 | 223 | 2 | +297.2% |
| `b51a56` | W | +0.59 | — | 4 | +2.9% |
| `c911a4` | W | +0.59 | — | 3 | +64.0% |
| `fbb0a0` | L | -1.00 | 406 | 2 | -100.0% |
| `fdd34f` | L | -1.00 | 221 | 1 | -100.0% |

---
## At a glance

| Sport | CONFIRMED | FLAT | **Δw eligible** | WR50 (bench) | NULL (tracked) |
|---|---|---|---|---|---|
| MLB | 4 | 3 | **7** | 1 | 45 |
| NBA | 19 | 6 | **25** | 16 | 68 |
| NHL | 7 | 3 | **10** | 7 | 30 |
| **Total** | **30** | **12** | **42** | **24** | **143** |
