# HARD+ overlays + Door 2 Proven — week of 2026-09-20 → 09-26

_Status: **LIVE on main** · last ship **2026-09-26T16:51Z** ([#237](https://github.com/dpk1212/nhl-savant/pull/237))_  
_Revisit this file. Do not re-derive the bars from chat._  
_Related: [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md) · `src/lib/whitelistTier.js` · `src/lib/marketSkillMuteOverlay.js`_

Steam-era book used below = live v12 tickets **2026-08-19 → 2026-09-26**, n=403, as-of `data/wallet-profiles.json` git snaps (causal: snap date `<` ticket date).

---

## Do I need to run anything? (Door 2, 2026-09-26)

**No.**

| Surface | When it is live | Who runs it |
|---------|-----------------|-------------|
| **Tickets / v12 / no-CONFIRMED / Q1 / UNOPP / NFL-CFB unlock** | Next `syncPickStateAuthoritative` after `#237` landed. Fetch chain is ~4 min; lock-alert workflow also syncs ~5 min. **Minutes, not hours.** | Cron. Already on `main`. |
| **Firebase stamps, Action badges, roster markdown** | Next `exportWalletProfiles --write-firebase` in `grade-sharp-actions`. Cron `0 3,5,7,9 * * *` UTC. **Next write: 2026-09-27 03:00 UTC = 11:00 PM ET 2026-09-26.** | Cron. |
| **HARD+ AG mute / S/T HARD+ FOR require** | Already live (pickDate ≥ cutover). | Nothing. |

Live math does **not** wait for the stamp rewrite. If a sport rec has a `positions` book, Door 2 reads `n / WR / $ROI` and ignores a stale `whitelistTier`. A-only CONFIRMED stamps drop off tickets on the next sync.

Optional, only if you want Action / climate **labels** to match before 11pm ET: Actions → `grade-sharp-actions` → Run workflow. Do not rerun by hand unless that is the goal.

NFL sport-Confirmed count under Door 2 is **11** (was 81). Unlock cap binds: 10–14 CONFIRMED → **max 3u** on NFL until the pool grows. CFB is **19** → full ladder.

---

## Live policy as of 2026-09-26 (read this first)

Two different bars. Do not mix them.

### HARD+ (sport × market overlay)

Source B **that market** (ML / SPREAD / TOTAL), not the sport rollup:

`n ≥ 4` AND `WR ≥ 62` AND `dollarRoi ≥ 10`

Used by:

| Overlay | From | Rule | `mutedBy` / stamp |
|---------|------|------|-------------------|
| Market-skill | **2026-09-24** | ML: ≥1 FOR with sport×ML `n≥6 WR≥52`. S/T: qual$ AGREE + HARD slip on FOR. | `ml-mkt-skill` / `st-qual-wipe` / `st-hard-slip` |
| HARD mute-exception | **2026-09-24** | Rescue tape-weak / maxsr-sub4 / fools-gold-flat / top-crowded if ≥1 HARD FOR. Tape-weak **S/T stays muted**. | `rescuedBy=hard-mkt-hold` |
| HARD+ AG mute | **2026-09-25** | ≥1 HARD on the **other** side → 0u. 4u+ not exempt. | `hard-ag` |
| S/T HARD+ FOR require | **2026-09-26** | SPREAD/TOTAL with `hardFor < 1` → 0u. ML exempt. 4u+ not exempt. Last step after HARD+ AG. | `st-hard-for` |

All four fail-open (HOLD at exact units) if `byMarket` schema is missing. They do not resize, repath, or flip.

`st-hard-slip` (inside market-skill, from 9/24) did **not** stop TBR/NYY Under 6.5 4u LOSS on day-1 — that ticket stamped HOLD. `st-hard-for` sits after the exception so an S/T with no HARD FOR cannot publish going forward.

### Proven / CONFIRMED (Door 2 — wallets fed into v12)

Source B **sport** book. A-only cannot be Proven. FLAT is not assigned. Rescues do not grant CONFIRMED.

`positions.n ≥ 6` AND `positions.wr ≥ 55` AND `positions.dollarRoi > 3`

Code: `src/lib/whitelistTier.js` (`WHITELIST_VERSION = 5`, `WHITELIST_FROM = 2026-09-26`).

Roll-back: revert that file to v4.

---

## What shipped this week (staking / skill)

| When (UTC) | PR | What |
|------------|----|------|
| 2026-09-24 16:05 | [#221](https://github.com/dpk1212/nhl-savant/pull/221) | Market-skill mute live |
| 2026-09-24 17:19 | [#222](https://github.com/dpk1212/nhl-savant/pull/222) | HARD mute-exception HOLD |
| 2026-09-25 18:13 | [#233](https://github.com/dpk1212/nhl-savant/pull/233) | HARD+ AG mute |
| 2026-09-26 15:53 | [#234](https://github.com/dpk1212/nhl-savant/pull/234) | S/T requires HARD+ FOR |
| 2026-09-26 16:51 | [#237](https://github.com/dpk1212/nhl-savant/pull/237) | Door 2 Proven bag |

Same week, not this memo: My Sharps desk, lock-alert reliability, NHL preseason / $250 floor, tail grading, board/date/logo fixes.

---

## Why HARD+ (analysis that justified the overlays)

HARD+ = sport×market Source B `n≥4 WR≥62 $ROI≥10`. Steam-era live book, no HARD+ **against**:

| Market | HARD+ FOR | none FOR |
|--------|-----------|----------|
| ML | 57–28–1, 67.1%, +71.4u, n=86 | 49–31, 61.3%, +15.0u, n=80 |
| S/T | 37–27, 57.8%, +41.4u, n=64 | 55–70, 44.0%, **−48.5u**, n=125 |

S/T with no HARD FOR was the hole. Average size on the no-HARD-AG book was still material on both sides — this is not a 1u junk pile. Policy that followed:

1. Mute any ticket with HARD+ against (9/25).
2. Require HARD+ FOR on S/T (9/26). ML may still publish with no HARD FOR.

---

## Door 2 — how we picked the bag (2026-09-26)

**Old Proven (v4):** FLAT if A `picks.n≥2 & flatRoi>0` **or** B `positions.n≥4 & positionFlatRoi>0`. CONFIRMED = FLAT plus B `$ROI>0` (or last-30d $ rescue, or size-skill rescue).

Thesis: raise the **B** bar, and **A-only cannot be Proven**. That moves v12, EDGE’s B half, no-CONFIRMED, climate, and the NFL/CFB unlock.

Method: replay v12 on the 403 live tickets with as-of B books. Quality weights stayed production (flat first, $ fallback). Only who is in the bag changed.

### Current vs the cell we shipped

| bag | keep | mute | S/T keep |
|-----|------|------|----------|
| **v4 Proven (C+FLAT, A or B)** | 196–156, 55.7%, +69u, n=354 | 22–27, 44.9%, −17u, n=49 | 91–95, 48.9%, −3u |
| **Door 2 `n≥6 WR≥55 $ROI>3`** | **153–110, 58.2%, +90u, n=265** | **65–73, 47.1%, −38u, n=138** | **72–71, 50.3%, +9u** |

The pile Door 2 **cuts** from the old keep: 32–35, 47.8%, −17u (MLB 15–25, −20u). That is the raise.

### n × WR × actual $ (not flat)

Actual ROI = Source B `dollarRoi`. Replacing `flat>0` with `$>0` on a WR52 bag did **not** separate. The ridge was **WR**, then a small $ floor.

**Obvious ridge — WR≥60 and $ROI>3.** n=4 / 5 / 6 are the same wallets:

| gate | keep | mute | S/T keep |
|------|------|------|----------|
| n4 wr60 $>+3 | 135–93, 59.2%, +100u, n=230 | 83–90, 48.0%, −49u | 60–57, 51.3%, +15u |
| n5 wr60 $>+3 | 134–92, 59.3%, +100u | 84–91, 48.0%, −49u | 60–56, 51.7%, +16u |
| n6 wr60 $>+3 | 132–90, 59.5%, +99u | 86–93, 48.0%, −47u | 59–56, 51.3%, +14u |

That is HARD-lite (HARD is WR62 / $10 / market-level). We did **not** ship this as the sport feed — too close to the overlay, NFL/SOC starve harder.

**Volume ridge — WR≥55 and $:**

| gate | keep | mute | S/T keep |
|------|------|------|----------|
| n5 wr55 $>+7 | 148–107, 58.0%, +91u, n=257 | 70–76, 47.9%, −40u | **73–70, 51.0%, +11u** |
| **n6 wr55 $>+3 (shipped)** | **152–109, 58.2%, +90u, n=263** | **66–74, 47.1%, −39u** | **73–72, 50.3%, +8u** |
| n6 wr55 $>+0 | 156–114, 57.8%, +76u | 62–69, 47.3%, −24u | 73–73, 50.0%, +4u |

n5/$7 vs n6/$3 are the same ticket book (±4 plays, ~5u). We shipped **n6 / WR55 / $>3**: keep the $3–7 veterans, drop five-bet bombs. n=5 HARD+ kids stay HARD+ on the **market** overlay; they do not need to be Proven.

**Not a third ridge**

| gate | keep | mute | why not |
|------|------|------|---------|
| wr58 $>+3 | ~143–105, 57.7%, +86u | 75–78, **49.0%** | mute is a coin flip |
| wr52 + any $ | ~165–132, 55.6% | ~51% | $ does not save a soft WR bag |
| n≥7 / n≥8 | keep shrinks | mute → 50% | sample, not skill |
| $>+10 on WR60 | keep 58.6% | mute **49%** | eating winning ML |

### Sport keep after Door 2 (vs current)

| sport | current keep | Door 2 keep |
|-------|--------------|-------------|
| MLB | 139–112, +83u, n=252 | **111–80, +91u, n=192** |
| WNBA | 18–13, −6u | **13–7, +7u** |
| NFL | 14–12, −4u | 11–10, −3u |
| CFB | 6–7, −4u | 5–6, −2u |
| SOC | 12–8, −3u | 5–3, −5u (small n; cut winners) |
| UFC | 7–4, +4u | 8–4, +2u |

MLB is the raise. WNBA flips green. Do not retune soccer off n=8.

### Roster census 2026-09-26 (sport-books, not tickets)

| sport | B n≥4 | old Proven | old CONF | A-only | HARD+ | **Door 2 n6/55/$3** |
|-------|------:|----------:|---------:|-------:|------:|--------------------:|
| MLB | 198 | 140 | 97 | 30 | 34 | **51** |
| NFL | 77 | 81 | 37 | **49** | 11 | **11** |
| CFB | 59 | 42 | 31 | 8 | 16 | **19** |
| NBA | 131 | 79 | 54 | 14 | 17 | **24** |
| NHL | 60 | 36 | 23 | 6 | 11 | **8** |
| WNBA | 58 | 29 | 22 | 6 | 9 | **13** |
| SOC | 185 | 150 | 101 | 68 | 44 | **42** |
| UFC | 54 | 35 | 24 | 12 | 7 | **7** |
| **total** | | **592** | **389** | **193** | **149** | **175** |

Unique wallets, any sport: old Proven **369** · Door 2 **136** · HARD+ **128**.

Extra wallets in n6/$3 but not n5/$7 (the $3–7 veterans): `209728` MLB n=72 WR58 $6, `621848` MLB n=104 WR59 $4, `c9bba3` NFL n=13 WR85 $6.5, plus a few NBA/UFC.

---

## What we did not ship

- WR60 + $>+3 as the sport feed (best split, +100 / −49). Kept as the “sharp bag” if we ever want to tighten again.
- n5 WR55 $>+7 (same money, slightly better S/T, lets n=5 heaters in).
- $ROI ≥ 10 on the sport feed (that is HARD+’s job on the **market**).
- Flat ROI as the Door 2 profit key (actual $ won the WR55 ridge; flat won nothing extra on WR52).
- Changing HARD+ itself.

---

## Code map

| File | Role |
|------|------|
| `src/lib/whitelistTier.js` | Door 2 classify + `isConfirmedSportRec` / `isProvenSportRec` |
| `scripts/exportWalletProfiles.js` | Writes v5 tiers every 2h |
| `scripts/syncPickStateAuthoritative.js` | v12 `isProven` / HC / consensus + last-step HARD overlays |
| `src/lib/walletClvSkill.js` | no-CONFIRMED, Q1, UNOPP, FOOLS best-proven |
| `scripts/lib/hydrateLivePositionsFromScan.js` | Scan board only hydrates Door 2 Proven |
| `src/lib/sportConfirmedUnlock.js` | NFL/CFB cap counts Door 2 CONFIRMED |
| `src/lib/marketSkillMuteOverlay.js` | HARD+ definition + market-skill |
| `src/lib/hardAgMuteOverlay.js` | HARD+ AG → 0u |
| `src/lib/hardStForRequireOverlay.js` | S/T needs HARD+ FOR |
| `src/lib/hardMuteExceptionOverlay.js` | HARD FOR rescues listed mutes |
| `tests/testWhitelistTier.mjs` | Door 2 unit tests |

FOOLS “best FOR = FLAT → 0u” is now almost dead: FLAT is not Proven. Fail-open if no Proven FOR (v12 / no-CONFIRMED already 0u those).

---

## How to replay later

1. Daily as-of sport books: rebuild from `data/wallet-profiles.json` git history (script we used: extract `aN,aWr,aFlat,bN,bWr,bFlat,bDol,tier,src` per wallet×sport). Causal join is `snap.asof < ticket.date`.
2. Live ticket pack: steam-era Firestore sides with `promotedBy` `ags-unified-v*`, graded, `tracked !== true`, `units > 0`, date ≥ 2026-08-19.
3. Rescore with `aggregateSideV12` + `computeAgsV12`. Keep = `score > 0`.
4. HARD+ is **byMarket.positions**, not the sport rollup. Door 2 is the sport rollup.

If a future agent “finds” a better n/WR/$ cell, compare it to the tables in this file on the **same 403** before touching `whitelistTier.js`.

---

## Roll-back

| Change | How |
|--------|-----|
| Door 2 Proven | Revert `src/lib/whitelistTier.js` to v4. Next export restores A/FLAT/rescues. |
| S/T HARD+ FOR | `HARD_ST_FOR_REQUIRE_FROM = '9999-01-01'` |
| HARD+ AG | `HARD_AG_MUTE_FROM = '9999-01-01'` |
| HARD exception | `HARD_MUTE_EXCEPTION_FROM = '9999-01-01'` |
| Market-skill | `MARKET_SKILL_MUTE_FROM = '9999-01-01'` |
