# Plan: Leaderboard Rank Badges, Percentiles & Bettor-vs-Trader Signals

**Goal:** Show wallet **rank tier** (e.g. TOP 10 / TOP 25 / TOP 50) next to existing tier badges on game-card sharp rows, persist **percentile + money context** in seeded data, and add **lightweight bettor-vs-trader** signals so pick-side evaluation and UI stay honest.

**Out of scope for this phase:** Profile image, X username, verified badge (explicitly deferred).

---

## 1. Definitions (lock these before coding)

### 1.1 Rank source

- **Primary:** `leaderboardRank` from all-time **SPORTS** `orderBy=PNL` leaderboard at seed time (already planned / partial in `sports_sharps.json`).
- **Depth:** `leaderboardDepthAtSeed` = number of rows actually merged from that fetch (e.g. 1500). Stored once per wallet profile or only in `_meta` (prefer **`_meta.leaderboardDepthSportsAll`** + per-wallet `leaderboardRank` for clarity).

### 1.2 Percentile (single definition)

Use **“better than X% of the fetched leaderboard slice”** (not global Polymarket population):

- Let `D = leaderboardDepthAtSeed`, `r = leaderboardRank` (1-based).
- **`sportsLbPercentileTop`** = fraction of the slice strictly above this rank:  
  `100 * (D - r + 1) / D`  
  (rank 1 → ~100%, rank D → ~1/D).  
  Document in one sentence in UI tooltip: *“Among top {D} sports P&L accounts on Polymarket’s leaderboard.”*

**Optional later:** `GET /v1/leaderboard?...&user={wallet}` to anchor rank when `r` is null (not in top slice).

### 1.3 Money context (what “amount of money” means)

Store **two** numbers, labels fixed in UI:

| Field | Meaning |
|-------|--------|
| `sportVol` | Leaderboard `vol` for `category=SPORTS` (authoritative scale). |
| `sportInvestedProfile` | Sum of sport-classified position cost basis from `seedSportsSharps` profiling (context for “typical stake” vs vol). |

Row-level **`invested`** on a game already exists from `scanSharpPositions`; no change required for “this bet size.”

### 1.4 Bettor vs trader (heuristic v1)

**Inputs (already available or cheap):**

- From `sports_sharps.json`: `sportBets` / `sportBetCount`, `marketsTraded` (`/traded`), `vol`, optional `sportPnlTotal`.
- From `whale_profiles.json`: `mmScore` when wallet exists there.

**Derived flags (seed or scan):**

- **`sportShare`** = `sportBetCount / max(marketsTraded, 1)` — low share ⇒ generalist / likely non-directional sports usage.
- **`traderFlag`** (boolean) — e.g. `mmScore > 40` **or** (`sportShare < 0.02` AND `marketsTraded > 5000`) — tune thresholds after one data pass.
- **`bettorClass`** enum: `SPORTS_CORE` | `MIXED` | `TRADER_LIKE` (v1: three buckets only).

**UI:** Small second badge or suffix: `SPORTS` / `MIXED` / `TRADER` — never replace ELITE/PROVEN alone; **append** so rank and profit-tier stay visible.

---

## 2. Data pipeline changes

### Phase A — `scripts/seedSportsSharps.js`

1. Ensure **`leaderboardRank`** is written for every wallet that appears in the merged all-time list (rank = index in sorted API response + offset, or use API `rank` field consistently).
2. Write **`leaderboardDepthSportsAll`** in `_meta` (max offset coverage used for SPORTS ALL).
3. Compute and store **`sportsLbPercentileTop`** per wallet from §1.2 when `leaderboardRank` is non-null; else null.
4. Ensure **`vol`** is stored as authoritative sports volume (already); optionally alias **`sportVol`** in JSON for clarity (or document `vol` only).
5. Add **`sportShare`** and **`bettorClass`** / **`traderFlag`**:
   - Prefer computing **`sportShare`** in seed where `marketsTraded` and `sportBetCount` exist.
   - **`mmScore`**: merge from `whale_profiles.json` at seed time **by address** (read-only join), or leave for scan only if seed must stay Polymarket-only — **decision:** join in seed if `public/whale_profiles.json` is always present in CI; else compute only in `scanSharpPositions.js`.

### Phase B — `scripts/scanSharpPositions.js`

1. When emitting each position object, attach from lookups:
   - `leaderboardRank`, `sportsLbPercentileTop`, `sportVol` (copy from sharps JSON),
   - `bettorClass`, `traderFlag`, `sportShare` (from seed or recomputed),
   - optional `weeklyPnl` for a **“HOT”** micro-hint (already in data elsewhere).
2. Keep payload size sane: **no** full `recentResults` array on every position — only summary fields.

### Phase C — Optional (later)

- Per-wallet leaderboard `user=` call for wallets missing rank but in scan set (rate-limit carefully).
- Rank-weighted features inside `computeSharpFeatures` / `rateStarsV7` (separate project; document dependency order: UI first, model second).

---

## 3. UI changes (`src/pages/SharpFlow.jsx`)

### 3.1 Badge row (Verified Sharps / ML / Spread / Total wallet lists)

**Current pattern:** `Badge` for `p.tier` (ELITE / PROVEN / …) then wallet suffix and P&L (see spread block ~4548).

**Add:**

1. **Rank badge** — text from buckets:
   - `rank <= 10` → `TOP 10`
   - `rank <= 25` → `TOP 25`
   - `rank <= 50` → `TOP 50`
   - `rank <= 100` → `TOP 100`
   - else if rank → `TOP 500` or `#${rank}` (pick one for density)
   - if no rank → omit (or `UNRANKED` only in expanded detail, not inline)

2. **Bettor badge** — only when `traderFlag` or `bettorClass !== 'SPORTS_CORE'`:
   - `TRADER` / `MIXED` with muted warning color for `TRADER`.

3. **Tooltip / title** (native `title=`): one line percentile + one line vol + disclaimer from §1.2.

**Apply to all three surfaces** where the same wallet row appears: **ML**, **Spread**, **Total** wallet sections (grep for `Badge` + `p.tier` in game card blocks).

### 3.2 Sharp Vault (optional same release)

- Reuse same bucket helper for row badge next to `#rank` already shown.
- No duplicate percentile if tooltip covers it.

---

## 4. Pick-side evaluation (v1 logic — design only until metrics stable)

**Do not auto-flip picks in v1.** Add **read-only** diagnostics first:

1. **Best rank on side:** `min(rank)` among consensus wallets vs opposition.
2. **Rank-weighted invested:** `sum(invested * weight(rank))` with `weight` = 1.0 for unranked, 1.2 for TOP 100, 1.5 for TOP 50, 2.0 for TOP 25, 2.5 for TOP 10 (tunable).
3. **Trader dilution:** share of dollars on side from `traderFlag === true` wallets — show in dev panel or small footnote if above threshold.

**Phase 2:** Feed (2) into `computeSharpFeatures` as optional small nudge with caps and regime gates.

---

## 5. Testing & acceptance

| # | Criteria |
|---|----------|
| 1 | Wallets with `leaderboardRank` in JSON show correct TOP N badge in ML + spread + total lists. |
| 2 | Wallets without rank show no rank badge; card does not error. |
| 3 | `sportsLbPercentileTop` matches manual check for 3 wallets (top, middle, tail of slice). |
| 4 | Known high-`marketsTraded` / low sport share wallet shows `MIXED` or `TRADER` when heuristic fires. |
| 5 | `npm run build` passes; no regression on free tier / paywall paths. |

---

## 6. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Rank outside top `D` is null | Omit TOP badge; optional later `user=` fetch. |
| Percentile misread as “global” | Tooltip copy from §1.2. |
| `mmScore` missing for sports-only wallets | Default `bettorClass = SPORTS_CORE`; rely on `sportShare`. |
| Payload bloat | Only scalar fields on each position. |

---

## 7. Implementation order (recommended)

1. **Seed:** rank + depth + percentile + sportShare (+ optional whale join for mmScore).
2. **Scan:** pass through fields on each position.
3. **UI:** badge helper + ML/spread/total rows + tooltips.
4. **Docs:** one paragraph in `WALLET_INTELLIGENCE_SYSTEM.md` cross-linking this plan.
5. **(Later)** rank-weighted money in features / reports.

---

## 8. File touch list

| File | Action |
|------|--------|
| `scripts/seedSportsSharps.js` | `_meta` depth; per-wallet percentile, sportShare, bettorClass; optional whale join |
| `scripts/scanSharpPositions.js` | Enrich position objects from JSON lookups |
| `src/pages/SharpFlow.jsx` | Badge tiers + tooltips (ML, spread, total); optional Vault |
| `WALLET_INTELLIGENCE_SYSTEM.md` | Short “Rank & bettor class” subsection + link |
| This file | Keep as source of truth until shipped |

---

**Estimate:** Phase A–B + UI badges ≈ **0.5–1.5 days** depending on scan script complexity and QA across three market tabs. Pick-side weighting in the model is **additional** and should ship only after v1 UI + data are validated on real cards.

---

## 9. Shipped (partial) — 2026-04-16

- **Seed (`seedSportsSharps.js`):** `leaderboardScope` (`ALL` | `MONTH`), `leaderboardDepth`, `sportsLbPercentileTop` (slice percentile), `_meta.leaderboardDepthSportsAll` / `leaderboardDepthSportsMonth`.
- **Scan (`scanSharpPositions.js`):** Each position includes `leaderboardRank`, `sportsLbPercentileTop`, `sportVol` from `sports_sharps.json`.
- **UI (`SharpFlow.jsx`):** Grouped rank chip only (`TOP 10` … `TOP 500`) next to tier on **ML / spread / total** wallet rows. No percentile or money on the chip.
- **Internal (`computeSharpFeatures`):** `rankWeightedConInvested`, `rankWeightedOppInvested`, `consensusProfileMoneyIndex` (0–100, consensus share of rank×percentile×volume×tier-weighted dollars). Not shown in UI; ready to feed model / Firebase later.

**Still not shipped:** Bettor-vs-trader badge, `user=` rank fallback, wiring `consensusProfileMoneyIndex` into `rateStarsV7`.
