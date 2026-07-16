# Data asset map — what’s valuable and where it lives

_Status: living inventory for UI/UX + product decisions · 2026-07-15_  
_Companions: [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md) · [`TAPE_SIZING.md`](./TAPE_SIZING.md)_

NHL Savant’s edge is not one model — it is a **stack of proprietary datasets** that most competitors do not have together: who the real sharp wallets are, what they are betting *right now*, at what size, against what fair odds, and whether they historically beat the close.

This doc maps that estate so UI/UX work surfaces the right signals — not vanity stats.

---

## The five asset classes (ranked by product leverage)

| Rank | Asset class | Why it’s gold | Primary store |
|-----:|-------------|---------------|---------------|
| **1** | **Sharp wallet intelligence** | Who is real money, by sport, with track record | `sharpWalletProfiles` |
| **2** | **Live wallet positions** | What they are on *today*, sized vs their own average | `sharp_action_positions` + `sharp_*_positions.json` |
| **3** | **Fair odds + close** | Pinnacle entry/close → CLV; retail books for price | `pinnacle_history.json` → stamped on positions/picks |
| **4** | **Derived skill (TAPE / EDGE / netCLV)** | Causal skill that sizes the book | stamps on `sharpFlow*` sides |
| **5** | **Locked pick book** | Productized decisions + PnL truth | `sharpFlowPicks` / `Spreads` / `Totals` |

Supporting (valuable but secondary for Sharp Flow UX): Polymarket market structure (`polymarket_data.json`), Kalshi (`kalshi_data.json`), legacy model bets, scores for grading.

---

## End-to-end data spine

```
DISCOVER wallets          →  sports_sharps / whale_profiles
SCAN open positions       →  sharp_*_positions.json
PERSIST + qualify         →  sharp_action_positions (VAULT/SHADOW)
GRADE + CLV               →  same docs GRADED (clv, settledPnl)
CLASSIFY whitelist        →  sharpWalletProfiles (CONFIRMED/FLAT/WR50)
STAMP picks               →  sharpFlow* (walletDetails + AGS + EDGE + tape)
CLOSE odds                →  closingOdds / closingPinnacleOdds
```

Cadence: fetch loop ~every 4 min (daytime) · grade/export profiles several times daily.

---

## 1. Sharp wallet intelligence

### Canonical: `sharpWalletProfiles/{walletShort}`

**Join key:** last **6** hex of address (`162937`).

| Block | What you get | Product value |
|-------|--------------|---------------|
| `bySport[SPORT].whitelistTier` | `CONFIRMED` / `FLAT` / `WR50` / null | Who counts as “proven” for HC / RANK / EDGE |
| `bySport.*.picks` | Featured-pick n, WR, flat ROI (Source A) | Win-rate skill on *our* stamped book |
| `bySport.*.positions` | On-chain n, WR, $ROI, flat ROI (Source B) | Real-money skill |
| **`clvSkill`** | `pctPos`, `n`, `nPos`, `since`, `minN`, `asOfDate` | **Causal %+CLV (“beats the close”) — TAPE / netCLV building block** |
| `picks` / `positions` | All-sport aggregates | Cross-sport whale quality |
| `verdict`, `confirmedSports`, … | Narrative labels | Roster / intel UI |

**`clvSkill` (critical for TAPE):** rebuilt every `grade-sharp-actions` cycle (~2h) by `exportWalletProfiles.js` using the same `causalPctPos` helper as `syncPickStateAuthoritative` (`src/lib/walletClvSkill.js`). `pctPos` = % of graded positions since `CLV_HIST_FROM` with CLV > 0 (null when `n < CLV_SKILL_MIN_N`). Consumers: Sharp Flow live/locked cards (wallet rows + BEATS THE CLOSE battle), and any client-side netCLV fallback when cron means are absent.

**Whitelist v2 (do not conflate with SUPER/TOP stake tiers):**

| Tier | Rule |
|------|------|
| CONFIRMED | Flat+ (A or B) **and** $+ (B) |
| FLAT | Flat+ only |
| WR50 | WR ≥ 50% only |
| null | not whitelisted |

**Producers:** discover (`seedSportsSharps`, `buildWhaleProfiles`) → scan → grade → `exportWalletProfiles --write-firebase`  
**Consumers:** sync (HC/RANK/EDGE), Sharp Flow badges, whitelist recovery scan

**Also:** `data/wallet-profiles.json` mirror · `public/sports_sharps.json` discovery universe · `public/whale_profiles.json` legacy whales

---

## 2. Wallet position data (the live tape of sharp money)

### Firestore: `sharp_action_positions/{id}`

**Id:** `{date}_{sport}_{gameKey}_{walletLast8}_{ML|SPREAD|TOTAL}_{side}`

| Field group | Key fields | Why it matters |
|-------------|------------|----------------|
| **Identity** | wallet, sport, gameKey, marketType, side | Join to game + pick |
| **Size** | invested, size, avgPrice, avgSportBet, betMultiplier | Conviction vs their own average |
| **Qualify** | VAULT (≥0.75× avg) / SHADOW (≥0.10×) | Noise filter — vault = real conviction |
| **Odds** | pinnacleOdds (entry), closingPinnacleOdds, **clv** | Per-bet market skill |
| **V8 contrib** | v8_sizeRatio, v8_convictionMult, v8_walletContribution | Feeds AGS + Path D |
| **Settle** | status, result, settledPnl | Source B track record |

### Repo JSON (same cycle, UI-fast)

- `public/sharp_positions.json` (ML)
- `public/sharp_spread_positions.json`
- `public/sharp_total_positions.json`

### How positions become pick intelligence

```
positions (game×market)
  → positionToWalletDetail()   // src/lib/ags.js
  → peak.v8Scoring.walletDetails[] on sharpFlow* side
  → AGS score, HC margins, RANK/SHARP/DISSENT, EDGE, netCLV, tape
```

**walletDetails** (stamped array) is the UI’s atomic sharp unit:

| Field | Meaning |
|-------|---------|
| wallet | short id |
| side | FOR / AG |
| invested | $ |
| sizeRatio | invested / avgSportBet |
| contribution | walletBase × convictionMult |
| roi / pnl / rank | sport context |

**Long history denorm:** `walletBets` merges Source A (pick stamps) + Source B (positions).

---

## 3. Odds / markets / API data

There is **no Firestore `games` collection**. Games live as keys in JSON + embedded on pick/position docs. Cron builds an in-memory **`gameMeta`** from poly + pinnacle JSON.

### Pinnacle / retail — The Odds API

| | |
|--|--|
| **Fetcher** | `snapshotPinnacle.js` |
| **Store** | `public/pinnacle_history.json` |
| **Markets** | h2h, spreads, totals (UFC: ML only) |
| **Books** | pinnacle + DK/FD/MGM/Caesars |
| **Sports** | NHL, NBA, MLB, CBB, WNBA, SOC, UFC |

**Per game:** opener → current → history; spread/total lines+juice; EV vs retail; commence.

**Flows to:** position entry pinnacleOdds · pick peak/lock · `updateClosingOdds` · grade CLV.

### Polymarket

| API | Store | Value |
|-----|-------|-------|
| Gamma events/markets | `polymarket_data.json` | money%, probs, commence, polySpread/Total |
| Data `/positions` | scan → sharp_* JSON → Firestore | **actual wallet bets** |
| CLOB | price history | research / charts |

### Kalshi

`kalshi_data.json` — volume/audit; **not** stamped onto Sharp Flow sizing.

### Scores (grading only)

NHL API · ESPN (MLB/NBA/WNBA/SOC/UFC) · NCAA CBB → W/L + settled PnL.

### Odds stamps on locked picks (`sharpFlow*`)

| Field | Role |
|-------|------|
| `lock.odds` / `lock.line` / `lock.pinnacleOdds` | Frozen at first lock |
| `peak.odds` / `peak.line` / `peak.pinnacleOdds` | Live-enriched market (cron owns units) |
| `closingOdds` / `closingLine` | Pre-game close |
| `result.clv` | Pick-level CLV at grade |

---

## 4. Derived skill layer (TAPE / EDGE / netCLV)

Computed at sync from **profiles (WR)** + **graded positions (CLV ledger)** + **live walletDetails**.

| Metric | Formula | Stamp | Sizes book? |
|--------|---------|-------|-------------|
| **EDGE** | mean FOR sport WR − mean AG sport WR (n≥8) | `v8_winnerAlignEdge` | input only (fadeTop mute separate) |
| **Causal %+CLV** | % of wallet’s prior grades with clv>0 (as-of) | ledger (not per-pick) | building block |
| **top2 CLV** | mean top-2 FOR causal %+CLV | `v8_forTop2PctPos` | audit only (post-07-15) |
| **netCLV** | mean FOR − (mean AG ?? **62**) | `v8_netMeanPrior` | tape input |
| **TAPE** | `1.5·EDGE/10 + 2·netCLV/10` | `v8_tapeScore` | **yes** — mute &lt;0 / boost ≥2.89 ×1.35 |

**This is the proprietary sizing brain.** Raw positions without tape/EDGE are incomplete for UX that shows “why this size.”

---

## 5. Locked pick book (product truth)

| Collection | Market |
|------------|--------|
| `sharpFlowPicks` | ML |
| `sharpFlowSpreads` | SPREAD |
| `sharpFlowTotals` | TOTAL |

**Doc:** `{date}_{sport}_{gameKey}` (+ `_spread` / `_total`)  
**Sides:** `sides.{home|away|over|under|…}`

Each side carries: path tier (`v8_hcStakeTier`), `finalUnits`, AGS, walletDetails, EDGE/tape stamps, lock/peak/close, result.

**UI truth for units:** `finalUnits` + `v8_hcStakeTier` + `v8_tapeAction` — not the score ribbon alone.

---

## Two “tier” systems (never mix in UI copy)

| System | Values | Means |
|--------|--------|-------|
| **Whitelist** (wallet quality) | CONFIRMED / FLAT / WR50 | Is this wallet proven? |
| **Stake path** (bet size) | SUPER / TOP / RANK / SHARP / MINI / … | How big is *this ticket*? |

Same word **CONFIRMED** appears in both — different meanings. UI must disambiguate (e.g. “Confirmed sharp” vs stake label “CONFIRMED / 1u”).

---

## What the UI should treat as first-class (for overhaul)

### Tier S — show or it’s not Sharp Flow

1. **Who’s on it** — walletDetails: count, $ invested, sizeRatio leaders  
2. **Whitelist quality** — CONFIRMED/FLAT presence, HC margin  
3. **Path + units** — SUPER/TOP/… + finalUnits + tape action  
4. **Market** — lock/peak odds, line, vs Pinnacle  
5. **Skill dial** — tape score / EDGE / netCLV (or a single plain-English “tape” strength)

### Tier A — deepen trust

6. Per-wallet sport WR + $ROI (from profiles)  
7. Position CLV / wallet causal %+CLV  
8. VAULT vs SHADOW qualification  
9. Close / CLV after grade  

### Tier B — power / research

10. Full pinnacle history sparkline  
11. Polymarket money% / whale board  
12. Path D contrib margin, fadeTop diagnostics  
13. Kalshi / multi-book retail  

---

## Join keys (engineering cheat sheet)

| Entity | Key |
|--------|-----|
| Profile | `walletShort` = last **6** |
| Position doc id | last **8** in id; field `walletShort` = last 6 |
| Pick | `{date}_{sport}_{gameKey}` |
| Group positions → pick | `sport|gameKey|marketType` |
| CLV ledger | walletShort → graded positions with date &lt; pick date |

---

## File / script index (producers)

| Asset | Producer scripts |
|-------|------------------|
| Discovery | `seedSportsSharps.js`, `buildWhaleProfiles.js`, `enrichGapWallets.js` |
| Scan | `scanSharpPositions.js`, `scanWhitelistedWallets.js` |
| Positions FS | `writeSharpActions.js`, `gradeSharpActions.js` |
| Profiles | `exportWalletProfiles.js` |
| Odds | `snapshotPinnacle.js`, `fetchPolymarketData.js`, `updateClosingOdds.js` |
| Picks + tape | `syncPickStateAuthoritative.js` |
| Libs | `src/lib/ags.js`, `src/lib/walletClvSkill.js` |

---

## Implication for UI/UX overhaul

We are not short on data — we are **under-surfacing** it. The locked card today often leads with score ribbons and underplays:

- the **wallet stack** (asset #1–2),
- **why units are what they are** (path + tape),
- **market quality** (Pinnacle vs lock).

Any redesign should treat the pick card as a **window into this spine**, not a generic “bet of the day” tile.
