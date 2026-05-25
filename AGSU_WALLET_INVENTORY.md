# AGS-U Wallet Pool Inventory + Metric Audit

_Generated: 2026-05-25T14:45:58.620Z_

Total wallet profiles in collection: **215**

Whitelist thresholds (from policy v2): Source A requires n ≥ 2 featured picks. Source B-only requires n ≥ 5 raw positions.

---

## Per-sport qualifying wallet counts

| sport | has profile rec | A: n≥thr | A: flatRoi>0 | A: wr≥50% | **A: flat-qual** | **A: wr-qual** | B: n≥thr | B: positionFlatRoi>0 | B: dollarRoi>0 | B: wr≥50% | **B-only flat-qual** | **B: dollar-qual** | qualify A only | qualify B only | qualify both | qualify either |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **MLB** | 101 | 37 | 19 | 21 | **12** | **14** | 64 | 39 | 37 | 44 | **24** | **21** | 5 | 18 | 9 | **32** |
| **NBA** | 184 | 94 | 54 | 67 | **39** | **52** | 124 | 91 | 85 | 96 | **65** | **60** | 19 | 38 | 38 | **95** |
| **NHL** | 92 | 37 | 29 | 37 | **16** | **24** | 50 | 39 | 44 | 45 | **20** | **25** | 7 | 10 | 17 | **34** |

## Per-sport whitelist tier breakdown (live, current state)

| sport | CONFIRMED | FLAT | WR50 | NULL (excluded) | total qualifying |
|---|---|---|---|---|---|
| MLB | 18 | 10 | 3 | 70 | **31** |
| NBA | 54 | 21 | 21 | 88 | **96** |
| NHL | 20 | 5 | 10 | 57 | **35** |

## Per-sport sample-size distributions

### Source A: featured-pick history (`picks.n`)

| sport | n=0 | n=1-2 | n=3-5 | n=6-10 | n=11-20 | n>20 |
|---|---|---|---|---|---|---|
| MLB | 43 | 25 | 6 | 8 | 8 | 11 |
| NBA | 57 | 51 | 26 | 19 | 20 | 11 |
| NHL | 36 | 27 | 12 | 13 | 1 | 3 |

### Source B: position history (`positions.n`)

| sport | n<5 | n=5-19 | n=20-99 | n=100-499 | n≥500 |
|---|---|---|---|---|---|
| MLB | 37 | 36 | 18 | 9 | 1 |
| NBA | 60 | 69 | 49 | 6 | 0 |
| NHL | 42 | 32 | 17 | 1 | 0 |

---

## METRIC INVENTORY — what we know per wallet × sport

### `sharpWalletProfiles[walletShort].bySport[sport]` schema

```json
{
  "isFlatProfitable": false,
  "picks": {
    "flatRoi": -100,
    "wins": 0,
    "flatPnl": -1,
    "wr": 0,
    "losses": 1,
    "n": 1
  },
  "isWR50": false,
  "isPositionFlatProfitable": true,
  "whitelistTier": "CONFIRMED",
  "isDollarProfitable": true,
  "isWR50_B": true,
  "positions": {
    "wins": 5,
    "positionFlatRoi": 90.2,
    "dollarRoi": 59.6,
    "settledPnl": 132906,
    "wr": 83.3,
    "losses": 1,
    "invested": 223046,
    "n": 6
  },
  "whitelistSource": "B"
}
```

Key fields:

| field path | meaning | currently used by AGS-U? |
|---|---|---|
| `picks.n` | # of OUR featured picks the wallet has bet on | NO |
| `picks.wins` / `losses` | combined W/L on featured picks | NO |
| `picks.wr` | win rate on featured picks (%) | NO |
| `picks.flatRoi` | flat ROI on featured picks (%) | NO |
| `picks.flatPnl` | flat PnL on featured picks (u) | NO |
| `positions.n` | total leaderboard positions | NO directly (used via `roi`/`pnl` on walletDetail) |
| `positions.wins` / `losses` | combined W/L on all positions | NO |
| `positions.wr` | WR across all positions (%) | NO |
| `positions.dollarRoi` | $-weighted ROI across positions | NO directly |
| `positions.positionFlatRoi` | flat ROI across positions | NO |
| `positions.settledPnl` | total $ won across positions | NO directly |
| `positions.invested` | total $ deployed | NO |
| `whitelistTier` | CONFIRMED / FLAT / WR50 / null | YES (drives `isProven` + `isHcEligible`) |
| `isFlatProfitable` | A: flatRoi > 0 with n ≥ 2 | NO (computed inside tier logic) |
| `isDollarProfitable` | B: dollarRoi > 0 with n ≥ 2 | NO |
| `isPositionFlatProfitable` | B-only: positionFlatRoi > 0 with n ≥ 5 | NO |
| `isWR50` / `isWR50_B` | A: wr ≥ 50 / B-only: wr ≥ 50 | NO |
| `whitelistSource` | "A" / "A+B" / "B" / null | NO |

### Per-pick `walletDetails[]` schema (frozen at scoring time)

```json
{
  "wallet": "52aeeb",
  "side": "home",
  "invested": 84794,
  "roi": 2.1,
  "pnl": 1529723,
  "rank": 42,
  "source": "leaderboard",
  "roiNorm": 34.4,
  "pnlNorm": 91.3,
  "rankNorm": 89.9,
  "walletBase": 56.8,
  "sizeRatio": 7.68,
  "convictionMult": 1.6,
  "contribution": 90.9
}
```

| field | meaning | currently used? |
|---|---|---|
| `wallet` | walletShort (last 6 hex) | YES |
| `side` | bet side (home/away/over/under) | YES |
| `invested` | $ on this position | NO (informational only) |
| `roi` | wallet `positions.dollarRoi` (Source B, all-sports) at scoring time | NO directly |
| `pnl` | wallet `positions.settledPnl` at scoring time | NO |
| `rank` | leaderboard rank (lower = better; sparse — only some wallets) | NO |
| `source` | "leaderboard" or null | NO |
| `roiNorm` | normalized 0-100 of `roi` (percentile) | NO directly |
| `pnlNorm` | normalized 0-100 of `pnl` (percentile) | NO directly |
| `rankNorm` | normalized 0-100 of `rank` (higher = better) | NO |
| `walletBase` | percentile-derived base contribution score | YES (drives `contribution`) |
| `sizeRatio` | invested / avgSportBet | YES (drives `convictionMult`, HC gate) |
| `convictionMult` | clamped log(sizeRatio), range [0.70, 1.60] | YES (current AGS-U feature) |
| `contribution` | walletBase × convictionMult | YES (current AGS-U feature) |

### Currently used by AGS-U v10 (5 features)

| feature | what it captures | uses |
|---|---|---|
| `dCount` | (# qualifying wallets FOR) − (# qualifying wallets AGAINST) | wallet `side` + whitelist tier |
| `dHcCount` | (# CONFIRMED tier wallets w/ sizeRatio ≥ HC_RATIO FOR) − AGAINST | `whitelistTier === CONFIRMED` + `sizeRatio` |
| `dConvictionAvg` | avg(`convictionMult`) FOR − AGAINST | `convictionMult` |
| `dHcSizeRatio` | sum(`sizeRatio` of HC wallets) FOR − AGAINST | `sizeRatio` for HC wallets |
| `forContribShare` | sum(`contribution`) FOR / total | `contribution` |

### NOT currently used — candidates for v11

Per-wallet quality (from profile.bySport[sport]):

- **Source A**: `picks.wr`, `picks.flatRoi`, `picks.n`, `picks.flatPnl`
- **Source B**: `positions.wr`, `positions.dollarRoi`, `positions.positionFlatRoi`, `positions.settledPnl`, `positions.invested`, `positions.n`
- **Top-level aggregate** (across sports): `picks.flatRoi`, `picks.wr`, etc.

Per-wallet quality (from walletDetails, frozen at scoring):

- `roi` (Source B all-sports), `pnl`, `rank`, `roiNorm`, `pnlNorm`, `rankNorm`

---
_Generated by `scripts/_agsu_wallet_inventory.mjs` · 2026-05-25T14:45:58.620Z_