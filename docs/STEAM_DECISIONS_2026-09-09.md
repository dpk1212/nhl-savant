# What the extra steam data actually says — board implications

_Steam era Aug 19–Sep 8. Live book + 619 graded mutes. This is the decision view, not the method view._
_How to ship Findings 1 and 2 (current pipe, code hook, $): [`STEAM_IMPLEMENT_2026-09-09.md`](./STEAM_IMPLEMENT_2026-09-09.md). **No live policy until you pick.**_

Three things moved. Everything else is “keep the current rule.”

---

## What you would notice this week if nothing changes

The lock list is ~6–7 tickets a day, mostly 2–3u, plus a couple of steam-confirmed 4u/5.4u. 1u is gone. That mix is working: **59 · 41-18 · +61u in 9 days**.

The extra data did **not** say “this mix is leaving a pile of 2–3u undersized.” It said steam is doing work we cannot see, on tickets we **kill before T looks at them**.

---

## Finding 1 — Leftover mute in English, then the eight tickets

### What leftover is for

The sizer sometimes *believes* a ticket is a 4u play (TOP/RANK/SUPER, tape BOOST, or EDGE≥10) and then the published number is still 1–3u. Leftover’s job: **that is a stub, kill it.** Same for tape `FAIL_OPEN` still under 4u (we published size without a tape score).

It is a hygiene mute, not a steam mute. It has been +EV: 56 believed-cut tickets **24-32 · −13u**. The no-steam slice is **42 · 15-27 · −27u**. Keep it for those.

### Where it sits in the pipe

```
sizer (path / tape / Q1 floor)
  → leftover mute          ← steam is not an input here
  → maxSR / climate / unlock
  → Policy T (arriving floor, 4u/fat steam gate)
```

If leftover zeros the ticket, **T never runs**. Arriving cannot floor it to 2u. A/B steam cannot confirm a 4u. The user never sees a card.

“Steam already on” is not enough to save them (5 · 3-2 · +0.8u). **Arriving** is the split: Pin was *off* when we flagged, *on* at lock, Source A/B already on our side.

### The eight tickets leftover killed that T would have shipped

Six `believed-cut` + two `fail-open-sub4`. All A/B arriving. **8-0 · +17.7u.**

| Date | Play | Why leftover killed it | Pre | After leftover, T would have | Result |
|------|------|------------------------|----:|------------------------------|--------|
| 08-19 | Under 8.5 UNOPP | Tape `FAIL_OPEN` (no tape score) | 1u | **Floor 2u** | W +0.96 at 1u → would be +1.92 at 2u |
| 08-21 | Red Sox ML SHARP | Tape **BOOST** leftover (boosted, still <4u) | 3u | **HOLD 3u** | W +1.74 |
| 08-21 | Over 8.5 TOP +175 | Native-4u path at plus money — “this is a 4u or a stub” | 1u | **Floor 2u** | W +1.75 → +3.50 at 2u |
| 08-24 | Giants ML DISSENT | Tape `FAIL_OPEN` | 1u | **Floor 2u** | W +1.63 → +3.26 at 2u |
| 08-25 | Over 7.5 RANK +123 | Native-4u path at plus money | 2.5u | **HOLD 2.5u** | W +3.08 |
| 09-04 | Rays ML MINI | EDGE≥10 still treated as a stub | ~4u | **HOLD 4u** (A/B steam) | W +4.24 |
| 09-05 | Baylor +spread UNOPP | EDGE=10 + tape MUTE | 1u | **Floor 2u** | W +0.85 → +1.70 at 2u |
| 09-06 | Under 6.5 SHARP-LEAN | EDGE≥10 leftover | 2.5u | **HOLD 2.5u** | W +3.45 |

Four of eight are 1u stubs leftover called junk; T would have shown them as **2u**. Three are 2.5–3u that would look like a normal mid lock. Rays is a 4u MINI that never posted.

**On the board if we exempt A/B arriving from leftover:** ~**one extra lock every 3–4 days**. Mix of a 2u (the old 1u stubs) and a 2.5–3u MLB ML/total. Not a 16-ticket day. Last 21 days: **+18u on 8 tickets** after T’s 2u floor on the leans.

**What we are not doing:** turning leftover off. No-steam leftovers stay dead (−21u). Already-on steam stays dead (+0.8u). Steam without A/B stays dead.

**If we are wrong:** the next arriving leftovers go 4-4 and we ate stubs. Sample is 8, both halves still 5-0 / 3-0 (believed-cut arriving 3-0 / 3-0). Same *shape* as the 1u floor we shipped (arriving 9-4 vs rest of 1u −21%).

**Do not** add `if (abArriving) HOLD` inside leftover without wiring steam in. Leftover has no steam input today, and arriving is off on the first cycle. Working hook: capture tape **before** leftover, HOLD leftover when A/B arriving, then let T and the later mutes run. Options: [`STEAM_IMPLEMENT_2026-09-09.md`](./STEAM_IMPLEMENT_2026-09-09.md).

---

## Finding 2 — Are we sizing arriving appropriately?

**No. We size them like everyone else.** Steam is not in the sizer except the 1u→2u floor.

Live A/B arriving Aug 19–Sep 8 vs the rest of the live book:

| | N | W-L | WR | ROI | PnL | **u / ticket** |
|--|--:|:---:|---:|----:|----:|---------------:|
| **A/B arriving** | **34** | **26-8** | **76.5% (60–88)** | **+51%** | **+46u** | **2.62** |
| Not arriving | 215 | 118-97 | 55% | +5% | +29u | **2.66** |

Same stake per ticket. Three times the ROI. That is the undersize.

August already measured this: arriving was **6% of tickets and 6% of units**. We never paid extra for the cell that carried 62% of August profit. T only changed the 1u tail (floor to 2u). Mid and fat arriving still get whatever path/tape printed.

### Where those 34 actually sat

| Band | N | W-L | ROI | What it is |
|------|--:|:---:|----:|------------|
| 1u (pre-T — gone now) | 13 | 9-4 | +42% | Native 1u. After T these are **2u floors** |
| **2–3u native** | **10** | **8-2** | **+62%** | **The bump candidate.** Mean 2.75u |
| 2u T floors (was 1u) | 3 | 2-1 | +49% | Rangers / Reds / Hull. Already the 1u bump |
| 4u / 5u / 5.4u / 6u | 8 | 7-1 | +47% | **Not undersized.** Mean 5.4u. Includes the 5.4u Under 167.5 loser. Do not add more |

Same path, arriving vs not (mean units):

| Path | Arriving u/tix | Other u/tix | Arriving ROI | Other ROI |
|------|---------------:|------------:|-------------:|----------:|
| CONFIRMED-Q1 | 3.3 | 2.9 | **+52%** | +18% |
| MINI | 2.2 | 2.0 | +17% | +23% |
| RANK | 5.0 | 3.6 | **+88%** | +19% |
| SHARP-LEAN | **2.1** | 3.0 | +19% | −12% |
| UNOPP | 1.2 | 1.0 | +33% | −31% |

Q1 arriving is already 3u — same rung as other Q1 — and prints 3× the ROI. RANK arriving is *already* fat (the 6u WNBA). The mid bump is Q1/MINI/SHARP-LEAN sitting at 2–3u while Pin is moving with us.

### What a bump is, on the board

Going forward under T, arriving tickets are: 1u→2u floor, 2–3u HOLD, or already-fat (keep). The only open size question is the **2–3u HOLD**.

After T (9 days) that was six native 2–3u arriving: Orioles 3u, Over 8.5 2.5u, Over 8.5 3u, Phillies 3u, Rangers 3u, Over 8.5 3u. Plus three 2u floors.

| Change | What the user sees | Extra $ last 21 days | Cost of being wrong |
|--------|--------------------|----------------------|---------------------|
| Paint arriving vs already-on | Same 3u, different chip | $0 | None |
| **2–3u arriving → 4u** | A 3u Q1 Over / MINI ML shows **4u** when steam arrived. ~**4–6 tickets / 9 days** after T | **+6.5u** on +12.5u extra stake (10 · 8-2) | Sep 8 Over 8.5 is −4u not −3u. Over 10.5 08-22 is −4u not −2u |
| Also restack 2u floors → 4u | Rangers/Reds 2u become 4u; Hull −2 becomes −4 | +2.9u on those 3 | Hull is the 1u floor we already decided not to send to 4u in August |
| 5.4u arriving → more | Don’t | — | Under 167.5 −5.40. August said do not size fat arriving |

T-compatible: 4u already requires A/B steam. Arriving is a subset of steam-on. We would not fight the 4u mute.

**Not this bump:** steam-at-lock including already-on (10 · 6-4 · −2% in 2–3u). Barça −752 at 3u is already-on, not arriving.

August called floor-all-arriving-to-4u “13 tickets of 9-4, not a size rule.” That was **1u→4u**. This is **3u→4u** on a hotter, still-small mid cell (10 · 8-2, MLB-only, Wilson lo 49%). Same direction, smaller jump, still one sport.

If the bump is the play: **arriving native 2–3u → 4u. Do not touch fat. Do not restack the 1u floor to 4u. Do not include already-on.** Paint either way.

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
| 3 | Arriving 2–3u → 4u | Same 3u Q1/MINI shows **4u** when steam arrived | **+6.5u extra** / 10 tickets | 10, MLB-only, already 2.6u like the 55% book | **The bump.** Don’t touch fat arriving, don’t send 1u floors to 4u |
| 4 | Stop FAIL_OPEN leftover mute | ~1 extra lock/day, tape-blind | +11u / 21 | 21, hold n=6 | Wait |
| 5 | Only-ship arriving | 2-ticket steam museum | prettier WR, −volume | 34 | No. Not this product |
| 6 | Bump 2–3u ML / already-on / 5u | Bigger juice, or T fights itself | — | — | No |

Keep T, −375, ev-drift, unconfirmed 4u, believed-cut on **no-steam**, maxSR.

If we do one thing: **#1 + #2**. Extra tickets we already sized, plus a chip that finally names the 76% cell. **#3 is the size bump:** arriving is 76% ROI +51% at the **same** 2.6u as the 55% book. Cap it at native 2–3u → 4u. Leave fat arriving and the 1u floor alone.

Ship order and exact code hooks: [`STEAM_IMPLEMENT_2026-09-09.md`](./STEAM_IMPLEMENT_2026-09-09.md).
