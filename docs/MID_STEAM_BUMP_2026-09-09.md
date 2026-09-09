# Can we bump steam-aligned 2–3u to 4–5u?

_Pulled 2026-09-09. Live AGS-U book, COMPLETED WIN/LOSS, `finalUnits > 0`, `tracked !== true`. Re-run: `node scripts/analyzeMidSteamBump.mjs`._

_Pairs with [`STEAM_HOLDUP_2026-09-09.md`](./STEAM_HOLDUP_2026-09-09.md) · [`CLOSING_DIME_STEAM_EDGE.md`](./CLOSING_DIME_STEAM_EDGE.md) (the August paper)._

**Verdict: not enough data to ship. Direction is real. Do not write a 4u/5u bump.**

---

## Direct answer

Steam on a 2–3u ticket is hotter than steam-off. That part holds. It is **not** a size rule yet.

| Candidate | N | W-L | WR (Wilson) | ROI | Extra PnL if →4u | Enough to ship? |
|-----------|--:|:---:|-------------|----:|-----------------:|-----------------|
| **A/B arriving** (the hot subset) | **10** | **8-2** | **80% (49–94)** | **+62%** | **+6.5u** | **No.** n=10, MLB-only, Wilson lo **49%** (coin flip still in the interval), halves 4/6 |
| A/B steam at lock (arriving + already-on) | 20 | 14-6 | 70% (48–86) | +30% | +9.6u | **No.** Wilson lo **48%**. Half the set is already-on, which is **−1.8% ROI** |
| A/B already-on (on→on) | 10 | 6-4 | 60% (31–83) | **−1.8%** | n/a | **No. Dead.** Same finding as the August paper |
| No steam (control) | 69 | 43-26 | 62% (51–73) | +17% | +9.7u (illegal under T) | Passes the n/Wilson bars. This is why 2–3u stays HOLD |

The August paper already had a thicker arriving cell — **24 · 18-6 · 75% (55–88) · +48%**, any size — and said **do not size, paint only.** This 2–3u slice is a *subset* of that cell with **worse** Wilson (49 vs 55) and **half** the n. Shipping a 4–5u bump on it would be sizing the thing we already refused to size, on less evidence.

The one bump we *did* ship (arriving 1u→2u) is a different animal: the rest of 1u was **−21%**. Extra units replaced a leaking band. Extra units on 2–3u add risk onto a band that already prints **+20%**.

---

## Universe

Native 2–3u = **live** `finalUnits` in `[1.25, 3.5)` = Policy T `mid` band. Arriving floors (1u→2u) excluded — they are already a T bump. Tickets the tape/skill floor already sent to 4u+ are not “2–3u plays.”

| Book | N | W-L | WR | PnL | ROI |
|------|--:|:---:|---:|----:|----:|
| Native 2–3u Jun 1–Aug 18 (no steam stamps) | 246 | 126-120 | 51% | +3.5u | +0.5% |
| Native 2–3u discovery Aug 19–30 | 41 | 25-16 | 61% | +11.9u | +11% |
| Native 2–3u hold-up Aug 31–Sep 8 | 50 | 34-16 | 68% | +39.5u | +28% |
| Native 2–3u steam era Aug 19+ | 91 | 59-32 | 65% | +51.5u | +21% |
| Arriving floors 1u→2u (already shipped) | 3 | 2-1 | 67% | +2.9u | +49% |

Matches the hold-up report’s live 2–3u counts.

---

## Enough-data bars (our own, from the T paper)

A cell gets to *change size* only if:

1. **n ≥ 20**
2. **Wilson lower bound ≥ 50%**
3. **Both halves** (discovery Aug 19–30 and hold-up Aug 31+) have enough tickets
4. **≥ 2 sports**
5. And even then, the paper still said arriving at n=24 / Wilson lo 55% is **paint, not a ladder**

| Cell | n≥20 | Wilson lo ≥50 | Both halves | ≥2 sports | Ship? |
|------|:----:|:-------------:|:-----------:|:---------:|:-----:|
| 2–3u A/B arriving | 10 | 49% | 4 / 6 | MLB only | **No** |
| 2–3u A/B steam at lock | 20 | **48%** | 8 / 12 | MLB, NFL, SOC | **No** |
| 2–3u A/B already-on | 10 | 31% | 4 / 6 | yes | **No** |
| 2–3u no steam | 69 | 51% | 31 / 38 | 5 sports | n/a — already HOLD |

Steam-at-lock *barely* clears n=20 and then **fails Wilson**. Discovery half of that cell is **8 · 5-3 · 63% (31–86) · +15% ROI** — extra units there were only **+2.4u**. The hold-up half is the heater (12 · 9-3 · +39%). Same “this week ran hot” story as 2–3u overall (61%→68%, p≈0.19).

Arriving 2–3u rate is **10 tickets / 21 steam-era days ≈ 0.5/day**. Hitting the paper’s n=24 (the sample they *still* refused to size) takes **~28 more days** at this clip. n=20 takes ~20 more days, and n=20 would still be thinner and MLB-only.

---

## Counterfactuals (same W/L, scale stake)

Cell WR does not change when you bump. Extra PnL is extra stake × extra variance. Report the **incremental** units.

| Bump | Extra stake | Extra PnL | Extra ROI |
|------|------------:|----------:|----------:|
| Arriving → **4u** | +12.5u | **+6.5u** | +52% |
| Arriving → **5u** | +22.5u | +12.4u | +55% |
| Arriving +1u cap 4 | +10.0u | +5.9u | +59% |
| Steam-at-lock → **4u** | +24.5u | +9.6u | +39% |
| Steam-at-lock → **5u** | +44.5u | +16.1u | +36% |
| Steam-at-lock ×1.35 cap 5 | +19.4u | +5.8u | +30% |
| **No steam → 4u** (T would mute) | +85.5u | +9.7u | **+11%** |

On the T-live window only (the 59-ticket book): bumping the 12 A/B-steam 2–3u tickets to 4u would have been **+7.2u on +13.5u extra stake** (59 · +61.3u → +68.5u). That is the “this week looks good” number. It is the same trap as keeping unconfirmed fat for +23u: the sample is hot, the process bar is not met.

### Why 5u is worse than 4u even when extra PnL is bigger

- 5u is T’s **always-ship** rung. That rung exists because the sizer already put a different kind of ticket there (skill top floor BOTH, etc.). Dropping a 2u MINI arriving onto it mixes two ladders.
- Extra heat on the 6 steam-at-lock losers: **−7u at 4u, −13u at 5u**.
- Juice. Barcelona −752 already-on 3u paid **+0.40u**. An extra unit on that win is **+0.13u**. An extra unit on a juice loss is **−1u**.

Juice mix on the 20 steam-at-lock 2–3u tickets:

| Odds | N | W-L | ROI |
|------|--:|:---:|----:|
| Plus money | 9 | 6-3 | +37% |
| Fair (> −131) | 6 | 4-2 | +32% |
| Moderate (−131 to −200) | 3 | 2-1 | +10% |
| Juice (< −200) | 2 | 2-0 | +25% on **tiny** $ (Man U −275, Barça −752) |

Arriving 2–3u has **zero juice tickets**. All 10 are MLB. That is the cleanest slice — and still n=10.

---

## T-compatibility (this is not optional)

Policy T mutes **unconfirmed 4u**. A bump of 2–3u → 4u without Source A/B + steam on at lock is stamped `unconfirmed_4u` and dies.

- **Legal bump set** = A/B + steam on at lock (the 20). Arriving is the 10-ticket subset.
- **Illegal bump set** = the 69 no-steam 2–3u. Extra ROI on those incremental units is only **+11%**, and T would zero them anyway.
- Steam on, **no** A/B: n=2. Do not build a rule on it.

So the only bump that can even exist next to T is “when we already have A/B steam, raise mid to 4u instead of HOLD.” That is a new size action (`BOOST`), not a mute exemption.

---

## The sizer already promotes some 2–3u to 4–5u. That pile does not print.

38 tickets entered tape at 2–3u and shipped at ≥3.5u (tape boost / skill top floor). **21-17 · −1.9u · −1.2% ROI.**

| Of those 38 | N | W-L | ROI |
|-------------|--:|:---:|----:|
| A/B steam at lock | 2 | 2-0 | +48% (Real Madrid 5u, Nats 5u — n=2) |
| No steam | 36 | 19-17 | **−4.3% · −6.7u** |

The existing “make this 2–3u bigger” machinery, without steam, **loses money**. A steam-alignment bump would be a *second* boost on a band the first boost already failed to help in aggregate. The two steam-aligned promotions won; that is n=2, the same non-sample as gold+limits.

---

## Sport / path (the 20)

| Slice | N | W-L | ROI |
|-------|--:|:---:|----:|
| MLB | 16 | 11-5 | +36% |
| SOC | 3 | 2-1 | **−17%** (juice + Sociedad −3u) |
| NFL | 1 | 1-0 | n=1 |
| CONFIRMED-Q1 | 12 | 8-4 | +15% |
| RANK | 3 | 2-1 | +23% |
| MINI | 2 | 2-0 | +102% (Orioles, Rangers — the heater) |
| SHARP-LEAN | 2 | 1-1 | −2% |
| Live 3u (the bulk) | 15 | 10-5 | **+19%** |
| Live 2u | 4 | 3-1 | +61% |

Most of the steam-at-lock set is already the CONFIRMED-Q1 3u spine at +19%. Bumping 3→4 is “more of the same,” not a new edge class. The 2u slice is the one that *looks* like the arriving-floor story, and it is four tickets.

---

## What would be enough

Re-open this when **all** of these are true, not when the next week is green:

1. **A/B arriving 2–3u n ≥ 24** (the any-size sample we already refused to size — at least match it).
2. Wilson lo still **≥ 50%**, ideally ≥ 55% like the paper’s arriving cell.
3. **Not MLB-only.** One more sport with n ≥ 5.
4. Discovery-style split still holds if we cut the steam era in half again (next ~10 days ≠ only the heater).
5. Juice-stripped (drop < −200) still prints. Arriving already passes this; steam-at-lock must keep dropping already-on juice.
6. Extra ROI on incremental units still beats the no-steam control (~+11%) by a lot — that bar is the one arriving currently clears (+52% vs +11%).

Until then: **paint arriving on 2–3u the same way we paint it everywhere else. Do not resize.**

The least-wrong *experiment* if someone insisted on a probe (not a recommendation): A/B arriving, not juice, **+1u cap 4**. That is 10 tickets, +5.9u extra in this sample, does not land on the 5u always-ship rung, and does not bump already-on. It is still n=10 / MLB-only / Wilson lo 49%. Do not put it in `steamTailPolicy.js`.

---

## Ticket list (the 20 T-compatible 2–3u with A/B steam)

| Date | Play | u | Path | Result | Steam | Odds |
|------|------|--:|------|--------|-------|-----:|
| 08-21 | Royals ML | 2 | SHARP-LEAN | W +1.94 | arriving | −103 |
| 08-21 | Under 8.5 | 3 | RANK | L −3.00 | already | +108 |
| 08-22 | Over 10.5 | 2 | SHARP-LEAN | L −2.00 | arriving | −117 |
| 08-24 | Nationals +spread | 3 | TOP | W +3.30 | arriving | +110 |
| 08-26 | Under 8.5 | 3 | RANK | W +2.80 | arriving | −107 |
| 08-29 | Bears ML | 2 | CONFIRMED-Q1 | W +2.06 | already | +103 |
| 08-30 | Cubs ML | 3 | CONFIRMED-Q1 | L −3.00 | already | −150 |
| 08-30 | Man Utd ML | 3 | CONFIRMED-Q1 | W +1.09 | already | −275 |
| 08-31 | Orioles ML | 3 | MINI | W +2.54 | arriving | −118 |
| 08-31 | Barcelona ML | 3 | CONFIRMED-Q1 | W +0.40 | already | −752 |
| 09-03 | Real Sociedad ML | 3 | CONFIRMED-Q1 | L −3.00 | already | −120 |
| 09-03 | Under 7.5 | 3 | CONFIRMED-Q1 | W +2.83 | already | −106 |
| 09-05 | Red Sox ML | 3 | RANK | W +2.27 | already | −132 |
| 09-05 | Giants ML | 2 | CONFIRMED-Q1 | W +2.84 | already | +142 |
| 09-05 | Over 8.5 | 2.5 | CONFIRMED-Q1 | W +3.10 | arriving | +124 |
| 09-06 | Over 8.5 | 3 | CONFIRMED-Q1 | W +3.21 | arriving | +107 |
| 09-07 | Phillies ML | 3 | CONFIRMED-Q1 | W +1.63 | arriving | −184 |
| 09-07 | Under 8.5 | 3 | CONFIRMED-Q1 | L −3.00 | already | +113 |
| 09-08 | Rangers ML | 3 | MINI | W +3.57 | arriving | +119 |
| 09-08 | Over 8.5 | 3 | CONFIRMED-Q1 | L −3.00 | arriving | +118 |

---

## What this does *not* change

- 2–3u stays **HOLD**. Steam is not required. No-steam 2–3u after T is still **40 · 26-14 · +26u**.
- Arriving floor 1u→2u stays. Do not restack it to 4u (August paper: “1u→4u is not a size rule”).
- Unconfirmed 4u mute stays. A mid bump that forgot the A/B-steam gate would feed that mute.
- Do not only-ship arriving. Ten 2–3u arriving tickets are a featured slate, not the product.
