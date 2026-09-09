# What the extra steam data actually says — board implications

_Steam era Aug 19–Sep 8. Live book + 619 graded mutes. This is the decision view, not the method view._

Three things moved. Everything else is “keep the current rule.”

---

## What you would notice this week if nothing changes

The lock list is ~6–7 tickets a day, mostly 2–3u, plus a couple of steam-confirmed 4u/5.4u. 1u is gone. That mix is working: **59 · 41-18 · +61u in 9 days**.

The extra data did **not** say “this mix is leaving a pile of 2–3u undersized.” It said steam is doing work we cannot see, on tickets we **kill before T looks at them**.

---

## Finding 1 — We are throwing away steam-confirmed leftovers

**This is the one that matters.**

Today’s leftover mute (`believed-cut`): if a ticket is still under 4u **and** looks like a stub (plus-money native-4u path, tape BOOST that didn’t land at 4u, EDGE≥10 still sub-4), we zero it. User never sees it. Policy T never sees it either — leftover runs first.

| | N | W-L | PnL | What it is |
|--|--:|:---:|----:|------------|
| Leftover we **killed**, no steam | 42 | 15-27 | **−21u** | The mute is correct |
| Leftover we **killed**, steam already on | 5 | 3-2 | +0.8u | Coin flip. Leave dead |
| Leftover we **killed**, steam **arrived** after we flagged, A/B on our side | **6** | **6-0** | **+15u** | The miss |

Those six, in the last three weeks:

| Date | Would have locked | Size | Result |
|------|-------------------|-----:|--------|
| 08-21 | Red Sox ML | 3u | W +1.74 |
| 08-21 | Over 8.5 | 1u | W +1.75 |
| 08-25 | Over 7.5 | 2.5u | W +3.08 |
| 09-04 | Rays ML | 4u | W +4.24 |
| 09-05 | Baylor +spread | 1u | W +0.85 |
| 09-06 | Under 6.5 | 2.5u | W +3.45 |

3-0 before T, 3-0 after T. Same split as the 1u arriving floor we already shipped: the **lifecycle** (steam turns on after we flag) is the filter, not “any steam.”

### If we change it

**Rule:** leftover mute skips the ticket when Source A/B is on our side **and** steam turned off→on. Units stay whatever the sizer had (usually 1–3u). We do **not** bump them to 4u.

**On the board:** about **one extra lock every 3–4 days**. Looks like a 2–3u MLB ML or total that currently dies in the pipeline. Occasional 1u UNOPP/DISSENT that T would then floor to 2u if it is arriving 1u.

**Last 21 days if this had been live:** 6 more tickets, +15u, slate still ~7/day not 16/day.

**If we are wrong:** the next six go 3-3 and we ate leftover junk the mute exists to kill. The no-steam leftover pile (−27%) is why the mute stays for everyone else.

**Sample:** 6 tickets. Small. The *contrast* (6-0 vs 15-27) is the same shape we used to ship the 1u floor on 13 tickets. This is the candidate.

---

## Finding 2 — Steam arriving is now the strongest cell we have, and the card still cannot show it

Live tape-log, Aug 19–Sep 8:

| Cell | N | W-L | WR (95%) | ROI | PnL |
|------|--:|:---:|----------|----:|----:|
| Whole tape-log book | 246 | 142-104 | 58% (52–64) | +11% | +71u |
| **A/B + steam arriving** | **34** | **26-8** | **76% (60–88)** | **+51%** | **+46u** |
| A/B + steam already on | 31 | 18-13 | 58% (41–74) | +14% | +13u |
| A/B, no steam | 161 | 91-70 | 57% (49–64) | +8% | +33u |

August paper: 24 · 18-6 · 75% (55–88). Now 34 · 26-8 · 76% (**60–88**). Wilson floor moved from 55% to **60%**. Coin flip is out of the interval.

**On the board today:** those 34 already shipped (or the 1u ones got floored to 2u). Users cannot tell them from the 31 already-on tickets. “Steam With Entry” lights both.

### If we change it (three different products)

**A. Paint only.** Distinct chip: “steam arrived” vs “steam was already on.” No unit change. User sees *why* a 3u Q1 is on the board. This is what the August paper asked for and we still have not shipped as a distinct chip.

**B. Bump arriving 2–3u → 4u.** Last 21 days: 10 tickets, 8-2. Extra **+6.5u** on extra 12.5u stake. Functionally: a ticket you already lock at 3u shows **4u** when Pin turned on after we flagged. About **one every other day**. T-compatible (4u already requires A/B steam). Sample is 10, all MLB. Two losers would have been −4u instead of −2/−3.

**C. Only-ship arriving.** Board becomes ~1.6 locks/day, 34 tickets, +46u, 76% WR. That is a featured steam slate, not the current product. We already rejected this in August because volume collapses.

A is free and overdue. B is the undersize thesis, real dollars, thin n. C is a different product.

---

## Finding 3 — A second leftover mute may be too wide (not a steam story)

Tape `FAIL_OPEN` leftover (`fail-open-sub4`): we kill sub-4u tickets where tape could not score.

| | N | W-L | PnL |
|--|--:|:---:|----:|
| We killed them | 21 | 15-6 | **+11u left on the table** |
| Discovery | 15 | 10-5 | +8.6u |
| After T | 6 | 5-1 | +2.4u |

**On the board if we stop killing FAIL_OPEN leftovers:** ~1 extra ticket a day in the steam era (21 in 21 days), mixed sports, mixed 1–3u. These are tickets where we did **not** have a tape read.

**If we are wrong:** we start shipping the exact stubs leftover was written for — believed size that never got confirmation. Hold-up n=6 is thin. This is a watch, bundled with Finding 1 only if we exempt arriving (2 of these 21 are arriving). Unwinding the *whole* FAIL_OPEN mute is a bigger, blinder move.

---

## What we looked at that is **not** a change

| Idea | Data | Board if we did it anyway |
|------|------|---------------------------|
| Bump all steam-at-lock 2–3u to 4–5u | 20 · 14-6, but **already-on is 10 · 6-4 · −2%** | Bigger numbers on juice dogs (Barça −752 at 3u paid +0.40). Extra heat on 6 losers: −7u at 4u, −13u at 5u |
| Floor 2u ML → 3u | 13 · 7-6 · **−7%** | We would have **lost** 1.7u. The ML heater is already 3u (31 · 25-6) |
| Bump all 2–3u ML to 4u | 44 · 32-12 looks great | T **mutes** unconfirmed 4u. 31 of 44 have no steam and would vanish or need a T rewrite |
| Steam-save any mute | 64 · 32-32 · −3u | Board fills with maxSR/qconv/fade kills. maxSR × steam is **−13u** |
| Floor 1u already-on steam to 2u | 5 · 3-2 · +0.5u | Extra junk 2u. Arriving is the floor we already have |
| Size on gold+limits | 3 · 2-1 | One hold-up loss. Still not a card |
| Require steam on 2–3u | No-steam 2–3u **+33u** after T | Slate shrinks to ~2/day, we light +26u |

Unconfirmed fat 5-0 (+23u muted) is still n=5 against August’s −9% cell. Not a finding. A watch until n is tens.

---

## Menu — pick one, not all

| # | Change | What the user sees | Last-21-day $ | Sample | Recommendation |
|---|--------|--------------------|---------------|--------|----------------|
| 1 | Don’t-cut leftover when A/B arriving | ~1 extra 1–3u lock every 3–4 days that currently never appears | **+15u / 6 tickets** | 6, both halves 3-0 | **Best new rule.** Small n, strong contrast |
| 2 | Distinct “steam arrived” chip | Same tickets, different label from already-on | $0 | 34 live, Wilson lo 60% | **Do it.** Overdue paint |
| 3 | Arriving 2–3u → 4u | Same tickets, 3u becomes 4u ~every other day | **+6.5u extra** / 10 tickets | 10, MLB-only | Optional. Real $, thin |
| 4 | Stop FAIL_OPEN leftover mute | ~1 extra lock/day, tape-blind | +11u / 21 | 21, hold n=6 | Wait |
| 5 | Only-ship arriving | 2-ticket steam museum | prettier WR, −volume | 34 | No. Not this product |
| 6 | Bump 2–3u ML / already-on / 5u | Bigger juice, or T fights itself | — | — | No |

Keep T, −375, ev-drift, unconfirmed 4u, believed-cut on **no-steam**, maxSR.

If we do one thing: **#1 + #2**. Extra tickets we already sized, plus a chip that finally names the 76% cell. The 4u bump (#3) can wait until arriving 2–3u is not MLB-only.
