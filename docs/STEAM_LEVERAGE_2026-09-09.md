# Steam leverage — doubled window, mute book included

**Read this first:** [`STEAM_DECISIONS_2026-09-09.md`](./STEAM_DECISIONS_2026-09-09.md) — board implications, not method.

_Pulled 2026-09-09. Steam era Aug 19–Sep 8. Discovery = the August paper (Aug 19–30). Hold-up = T live (Aug 31+). Re-run: `node scripts/analyzeSteamLeverage.mjs`._

_Pairs with [`CLOSING_DIME_STEAM_EDGE.md`](./CLOSING_DIME_STEAM_EDGE.md) · [`STEAM_HOLDUP_2026-09-09.md`](./STEAM_HOLDUP_2026-09-09.md) · [`MID_STEAM_BUMP_2026-09-09.md`](./MID_STEAM_BUMP_2026-09-09.md)._

**Verdict: the unused leverage is not “bump 2–3u.” It is “steam arriving cannot save a ticket that flinch leftover already zeroed.”** That cell is **6-0 both halves** with the same contrast that justified the 1u→2u floor (the rest of believed-cut is **−27%**). n=6. Paint / don’t-cut probe, not a size ladder. Do not ship tonight.

---

## How much more data?

The August paper was **187 tape-log live tickets**. Combined live tape-log is **246** — **1.32×**, not 2×.

The thing that actually doubled (more than doubled) is the **mute book**, which the paper could not score:

> “0 muted 0u tickets in this window have a tape log, so we cannot count don’t-cut a mute.”

| Book | N | Notes |
|------|--:|-------|
| Paper tape-log live | 187 | Aug 19–30 |
| Hold-up tape-log live | 59 | Aug 31–Sep 8 |
| Combined tape-log live | **246** | 1.32× |
| Combined live any | 249 | |
| **Muted graded steam-era** | **619** | the new sample |
| Hold-up mutes | 316 | T live |

Steam-era graded sides: **249 live + 619 muted = 868**. That is the gold mine. Most of it is mutes T and the Aug 19 leftover stack already judged. The question is which mutes **steam would have saved**, and which live 2–3u slices are still small.

---

## Direct answers to the thesis

| Thesis | Result |
|--------|--------|
| A subset of 2–3u is undersized | **Direction on A/B arriving, not a size rule.** 10 · 8-2, Wilson lo 49%, MLB-only. Same finding as [`MID_STEAM_BUMP_2026-09-09.md`](./MID_STEAM_BUMP_2026-09-09.md). The 3u **ML** heater is already 3u (31 · 25-6 · +40%). The 2u ML slice is a **dog** (13 · 7-6 · −7%). Flooring 2u ML→3u **loses** 1.7u. |
| Muted plays steam could save | **Yes — one mute, one lifecycle.** Flinch leftover (`believed-cut`) × A/B arriving: **6 · 6-0 · +15.1u · +108%**, 3-0 discovery and 3-0 hold-up. Flinch runs **before** Policy T, so arriving never gets a vote. |
| Broad “steam-save any mute” | **No.** Non-T mutes with A/B steam: 64 · 32-32 · **−3u**. Already-on steam on mutes is **−36%**. Steam without A/B on mutes is **−42%**. |

---

## 1. The steam-save that is actually new

Leftover mute (Aug 19+): still `<4u` AND (native-4u plus-money OR tape BOOST OR EDGE≥10 OR tape `FAIL_OPEN`) → 0u. Stamps `believed-cut` or `fail-open-sub4`. **4u+ never touched.** Q1/UNOPP floors run *before* this, so they cannot revive a stub. Steam-tail runs *after* climate/unlock, but **after leftover has already zeroed the ticket** — T’s arriving floor never sees them.

| Cell | N | W-L | WR (Wilson) | CF PnL | ROI | Halves |
|------|--:|:---:|-------------|-------:|----:|--------|
| **believed-cut + A/B arriving** | **6** | **6-0** | **100% (61–100)** | **+15.1u** | **+108%** | **3-0 / 3-0** |
| believed-cut + already-on | 5 | 3-2 | 60% (23–88) | +0.8u | +7% | thin |
| **believed-cut + no steam** | **42** | **15-27** | **36% (23–51)** | **−21.2u** | **−27%** | both red |
| believed-cut all | 56 | 24-32 | 43% | −13.3u | −12% | mute **saved** money |
| leftover (believed+fail-open) + arriving | 8 | 8-0 | 100% (68–100) | +17.7u | +111% | 5-0 / 3-0 |
| fail-open-sub4 **all** (even no steam) | 21 | 15-6 | 71% (50–86) | +11.0u | +31% | 10-5 / 5-1, hold n=6 thin |

This is the same shape as the only bump T shipped: arriving 1u went 9-4 · +42% **because the rest of 1u was −21%.** Here arriving leftover went 6-0 **because the rest of believed-cut is −27%.** Already-on is not the edge (again).

### Tickets T never saw (believed-cut + arriving)

| Date | Play | Pre | Path | Odds | PnL |
|------|------|----:|------|-----:|----:|
| 08-21 | Red Sox ML | 3u | SHARP | −172 | +1.74 |
| 08-21 | Over 8.5 | 1u | TOP | +175 | +1.75 |
| 08-25 | Over 7.5 | 2.5u | RANK | +123 | +3.08 |
| 09-04 | Rays ML | 4u | MINI | +106 | +4.24 |
| 09-05 | Baylor +spread | 1u | CONFIRMED-UNOPP | −117 | +0.85 |
| 09-06 | Under 6.5 | 2.5u | SHARP-LEAN | +138 | +3.45 |

Plus fail-open arriving 2-0: 08-19 Under 8.5 UNOPP 1u, 08-24 Giants ML DISSENT 1u.

**Do not unwind believed-cut.** The mute is +EV (−13u saved). **Do not widen the exemption to already-on** (+0.8u, 3-2). **Do not steam-save maxSR / qconv / fadeTop / tape-weak as a class** (below).

**Next probe (not a ship):** if A/B arriving is on at leftover-time, HOLD instead of MUTE. Same units the sizer already printed. Not a 4u bump. Re-score at n=15. Code point: `applyFlinchFailOpenMuteOverlay` in `src/lib/walletClvSkill.js` — leftover is upstream of `applySteamTailPolicy`, so T cannot save these today.

09-04 Rays 4u MINI is an odd stamp (leftover exempts `units ≥ 4`). Treat it as part of the 6 but do not design the rule around a 4u leftover.

---

## 2. Mutes steam should **not** save

Non-T mutes × A/B steam as a pile: **64 · 32-32 · −3.1u**. Steam on a muted ticket is not a pardon.

| Mute | All CF | A/B arriving CF | A/B steam CF | Keep? |
|------|--------|-----------------|--------------|-------|
| steam-tail lean_no_arriving | 67 · +3.7u scratch | — (by construction) | already-on 5 · +0.5u | **Keep.** Do not floor already-on 1u |
| steam-tail unconfirmed_4u | 11 · **−2.7u** | 0 (gate working) | 0 | **Keep** |
| steam-tail unconfirmed_fat | 5 · **+23.2u** | 0 | 0 | Watch n=5. Do not retune |
| **maxsr-sub4** | 75 · **−19u** | 5 · +1.6u | 20 · **−13u** | **Keep.** Steam makes it *worse* |
| qconv-q1 | 34 · −8.3u | 6 · −0.8u | 7 · −1.8u | **Keep** |
| winner_align_fade | 40 · +12.5u overall | 4 · **−2.1u** | 5 · −1.5u | FadeTop is a different debate. Steam does **not** save it |
| tape-weak | 62 · −7.8u | 5 · +1.4u | 9 · +3.1u | Thin. Do not exempt |
| top-crowded | 16 · −18.7u | — | 3 · −8.1u | **Keep** |
| ev-drift | 6 · −11.5u | — | — | **Keep** |
| fav-juice | 6 · −3.5u | — | 1 · −2.0u | **Keep** |
| fools-gold-flat | 40 · −18.4u | 1 | 3 · +4.1u | Keep the mute; n=3 steam is not a hole |
| ags-quality-veto | 36 · −5.7u | — | 1 | Keep |

Muted A/B already-on: **51 · 20-31 · −29u · −36%.** Muted steam with **no** A/B: **43 · 12-31 · −38u · −42%.** If you “steam-save” without requiring arriving **and** A/B, you light money on fire.

---

## 3. Live 2–3u — where the sizer is not leaving size on the table

Native 2–3u steam-era: **91 · 59-32 · 65% (55–74) · +51.5u · +21%.**

| Slice | N | W-L | Wilson lo | Extra if →4u | Ship a bump? |
|-------|--:|:---:|----------:|-------------:|--------------|
| A/B arriving | 10 | 8-2 | **49%** | +6.5u | **No** (see bump paper) |
| A/B steam at lock | 20 | 14-6 | **48%** | +9.6u | **No** — half is already-on (−2% ROI) |
| **2–3u ML** | **44** | **32-12** | **58%** | +10.7u | **No as 4u** — T mutes unconfirmed 4u. No-steam ML is 31 tickets |
| ↳ currently **3u** ML | 31 | 25-6 | 64% | already 3u | Heater. Not undersized |
| ↳ currently **2u** ML | 13 | 7-6 | 29% | 2→3 **−1.7u** | **Dog. Do not floor** |
| 2–3u plus money | 32 | 16-16 | 34% | +3.7u | Coin flip |
| 2–3u TOTAL + A/B steam | 8 | 4-4 | 22% | −0.2u | Dead |
| 2–3u SHARP* | 12 | 5-7 | 19% | −5.7u | **Oversize leak, n=12.** Watch, don’t bump |
| climate HALF + A/B steam | 1 | 0-1 | — | restore would lose more | Dead |
| unlock CAP + A/B steam | 1 | 1-0 | — | Bears 2u→5u n=1 | Dead |
| RANK 2–3u | 17 | 12-5 | 47% | +5.6u | Hold-up 5-0 is the whole PnL |

**2–3u ML looks like a process bar** (n=44, Wilson lo 58%, halves 20/24, 5 sports, +30% ROI) until you ask what a bump would *do*:

- Most of it is already **3u** (the heater).
- The 2u slice **loses**.
- Raising 3u→4u without A/B steam is `unconfirmed_4u`. The 31 no-steam 2–3u MLs still print **+21u at 3u**. Leave them in the mid band.

Climate-halved fat sitting in 2–3u with steam: **n=1** (and it lost). Not a restore rule. Tape already promotes some 2–3u to 4–5u; that pile without steam is **−6.7u** (bump paper).

---

## 4. Known cells on 1.32× tape — what moved

| Cell | Paper (n=187) | Combined live tape (n=246) | Still? |
|------|---------------|----------------------------|--------|
| A/B arriving | 24 · 18-6 · 75% (55–88) · +48% | **34 · 26-8 · 76.5% (60–88) · +51%** | **Stronger.** Wilson lo now **60%**. Still paint, not a 4u ladder |
| A/B steam at lock | 45 · 29-16 · 64% | **65 · 44-21 · 68% (56–78) · +32%** | Holds. Already-on still the dilute |
| A/B already-on | 21 · 11-10 · +1% | **31 · 18-13 · 58% · +14%** | Better, still not the edge |
| steam, no A/B | 5 · 2-3 · −13% | **5 · 2-3 · −13%** | Still require A/B |
| gold+limits | 2 · 2-0 | **3 · 2-1 · +7%** | **Worse.** A hold-up loss. Not a card |
| any gold | 8 · 6-2 | 10 · 7-3 · +57% | Thin |
| steam dying on→off | (explored) | **10 · 4-6 · −21%** | Discovery only, 0 in hold-up. Watch as a *cut* |
| tape BOOST, no A/B steam | 29 · 17-12 · −9.5% | **same 29 tickets, 0 after T** | Leak was real. T already killed the fat ones going forward |

A/B arriving on the doubled live book now has Wilson lo **60%** and n=34. The paper called n=24 / lo 55% “paint, do not size.” It is the best steam cell we have. It is still not a reason to bump 2–3u or only-ship arriving (~1.6/day).

---

## 5. fail-open-sub4 — second watch, not a steam story

Tape `FAIL_OPEN` leftover mute: **21 · 15-6 · 71% (50–86) · +11.0u · +31%.** Sports MLB/UFC/CFB/WNBA. Discovery 15 · 10-5 · +30%, hold-up 6 · 5-1 · +34% (hold n=6 thin).

This mute prints even **without** steam. It may be too wide. It is not the arriving-save (only 2 of 21 are arriving). Re-score with 10 more hold-up tickets before unwinding the whole flag. Do not bundle it with believed-cut — believed-cut without steam is the −27% pile we want to keep killing.

---

## What is *not* unused leverage

- Bumping steam-aligned 2–3u to 4–5u (previous paper).
- Flooring already-on 1u to 2u (5 · 3-2 · +0.5u).
- Restoring climate HALF or NFL/CFB unlock CAP when steam is on (n=1 each).
- Steam-saving maxSR, qconv, fadeTop, top-crowded, fav-juice, ev-drift.
- Gold+limits as a sizer (n=3, now 2-1).
- Plus-money 2–3u as a bump (32 · 16-16).
- Steam-gating 2–3u (no-steam mid still +33u).

---

## Ranked next moves

1. **Don’t-cut leftover when A/B arriving** — the only new cell with both-halves contrast like T’s 1u floor. n=6. Write the exemption, watch it, do not size up. Target n=15.
2. **Keep painting A/B arriving** on the live book. Combined **34 · 26-8 · 76.5% (60–88) · +51%**. Chip, not a ladder.
3. **Watch fail-open-sub4** as a mute that may be too wide (n=21, +11u, hold half thin).
4. **Watch steam dying** as a *cut* (10 · 4-6 · −21%, no hold-up tickets yet).
5. **Watch 2–3u SHARP*** (12 · 5-7 · −23%) as a live leak, not a bump.
6. **Do not bump 2–3u ML.** The heater is already 3u. The 2u ML slice loses.

Keep T, −375, ev-drift, unconfirmed 4u, believed-cut on no-steam, maxSR. The gold mine was the mute × arriving cross. That is now scored. The unused dollar is **~+15u on 6 tickets T never saw**, not a new 4u rung on the 2–3u spine.
