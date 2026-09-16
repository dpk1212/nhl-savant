# Steam mute revisit — extra week after the Sep 8 papers

_Pulled 2026-09-16. Graded AGS-U Aug 19–Sep 15. Paper window Aug 19–Sep 8. New nights: Sep 9–15 (leftover A/B arriving HOLD + native 2–3u arriving → 4u live since Sep 9)._
_Re-run: `node scripts/analyzeSteamMuteRevisit.mjs`. Machine dump: [`STEAM_MUTE_REVISIT_DUMP_2026-09-16.md`](./STEAM_MUTE_REVISIT_DUMP_2026-09-16.md). Full T-era unit-tier + mute ticket ledger: [`STEAM_T_ERA_UNIT_TIERS_2026-09-16.md`](./STEAM_T_ERA_UNIT_TIERS_2026-09-16.md)._
_**No live policy in this commit.**_

Mute CF sign: **positive = we left money on the table. Negative = the mute saved us.**

---

## Direct answers

| Question | Answer |
|----------|--------|
| Are we leaving too many **steam** plays muted? | **Not the T gates.** Steam-tail T-era is **131 · 69-62 · −2.8u · −1%**. The 1u mute is most of the count and a coin flip. Unconfirmed 4u **saved −12u**. Unconfirmed fat’s 5-0 scare **did not hold** (extra week 4-5 **−15u**). |
| Then why does the board still look empty? | **~80% of graded sides still mute.** T-era live is **8.2/day** (first 9 T days 6.6; extra week 10.3 because Sep 12 was 18). Steam-tail is **22%** of those mutes. Another **21%** is unlabeled 0u MONITORING. Tape / maxSR / believed-cut are the rest. |
| Did leftover HOLD stop killing arriving winners? | **Mostly yes.** Extra week leftover would have killed **7** arriving stubs that we **shipped: 4-3 · +5.6u**. One leak still died: Sep 11 CFB Over 51.5 Q1 3u, tape BOOST, A/B arriving, **W +3.1u**. |
| Did the 2–3u → 4u bump pay? | **Barely.** 16 arriving mids **8-8**. Extra **+23u stake → +1.3u**. Arriving itself went cold: **25 · 11-14 · −8%** vs the paper’s **34 · 26-8 · +51%**. Combined arriving is still the better cell (**59 · 37-22 · 63% · +21%** vs rest **+5%**). |
| Is there an over-mute left? | **FAIL_OPEN leftover, the 2–3u slice.** Headline 26 · 20-6 · +17u. T would still kill the 1u half. Shippable: **13 · 9-4 · +11.5u**. Extra week added one (Dodgers 3u MINI **W +2.6u**). Same watch as Sep 8, not a new law. |

---

## 0. What the extra week actually was

The Sep 8 paper’s T window was hot: **59 · 41-18 · +61u · +34% · 6.6/day**. Extra 7 nights: **72 · 36-36 · +0.5u · +0.2% · 10.3/day**. Combined T-era: **131 · 77-54 · +62u · +15%**.

That is the mean-reversion the hold-up already named. The *mix* did not break. The 70% WR did.

Mute stack still pays:

| Window | Live | All mutes CF |
|--------|------|----------------|
| Paper Aug 19–Sep 8 | 249 · +74u · +11% | 619 · 301-318 · **−85u · −8%** |
| Extra Sep 9–15 | 72 · +0.5u · +0% | 288 · 144-144 · **−52u · −9%** |
| Full T Aug 31–Sep 15 | 131 · +62u · +15% | 604 · 301-303 · **−69u · −7%** |

If the fear is “we mute too much **edge**,” the pile we cut is still a slightly-losing book. If the fear is “the slate is too small,” that is volume, and it is mostly the 1u mute plus MONITORING 0u — not a hidden +EV steam cell.

---

## 1. Policy T — three gates, extra data on each

### 1u `lean_no_arriving` — high volume, no edge

| Window | N | W-L | CF |
|--------|--:|:---:|----:|
| Through Sep 8 | 67 | 36-31 | **+3.8u · +6%** |
| Sep 9–15 | 32 | 15-17 | **−3.3u · −10%** |
| Full T | **99** | **51-48** | **+0.5u · +0.5%** |

99 of 131 steam-tail mutes are this gate. Unwinding it would put ~6 extra 1u tickets on the board every T day, coin-flip. Arriving leans are **not** in this pile (T floors those to 2u; 0 arriving leaks). Already-on 1u is 12 · 5-7 · −2.7u — do not start flooring those.

**Keep.** This is why the board looks thin. It is not why we are leaving winners on the table.

### Unconfirmed 4u — mute still saved money

| Window | N | W-L | CF |
|--------|--:|:---:|----:|
| Through Sep 8 | 11 | 6-5 | **−4.0u** |
| Sep 9–15 | 7 | 3-4 | **−8.0u** |
| Full T | **18** | **9-9** | **−12.0u · −17%** |

**Keep.** Extra week made the case stronger.

### Unconfirmed fat — the 5-0 did not continue

Sep 8 paper: 5-0 **+23u** left on the table. Extra week: **9 · 4-5 · −15u**. Combined T: **14 · 9-5 · +8.6u · +11%**, Wilson **39–84**. Coin flip is still inside the interval.

Fat **with** A/B steam (the ones T keeps): T-era **7 · 6-1 · +20u · +52%**. That split still holds.

**Keep the fat gate.** Extra data argues *for* it, not against. Do not unwind on the old 5-0.

Steam-tail as a whole, extra week: **48 · 22-26 · −26u**. T was not over-muting last week. It was throwing back losers.

---

## 2. Leftover HOLD — did Sep 9 actually ship the arriving stubs?

Pipe still is: leftover → later mutes → T. HOLD means leftover skips A/B arriving so T can floor/boost.

**Working.** Extra week, leftover-flagged arriving with published size still **<4u** (the tickets leftover used to kill):

| Date | Play | Pre → live | Why leftover would have killed it | Result |
|------|------|------------|-----------------------------------|--------|
| 09-10 | Rockies +spread MINI | 2.5 → **4u** BOOST | FAIL_OPEN + EDGE≥10 | L −4 |
| 09-10 | Rams SUPER | 3 → 2u HOLD (climate shrink) | tape BOOST + EDGE≥10 | L −2 |
| 09-11 | D-backs ML SHARP-LEAN | 3 → **4u** BOOST | EDGE≥10 | W +3.3 |
| 09-12 | Mets ML Q1 | 2.5 → **4u** BOOST | tape BOOST | W +5.6 |
| 09-12 | Athletics ML Q1 | 2.5 → **4u** BOOST | tape BOOST | L −4 |
| 09-13 | Rangers ML MINI | 2.5 → **4u** BOOST | tape BOOST + EDGE≥10 | W +5.0 |
| 09-13 | Vikings ML UNOPP | 1 → **2u** FLOOR | FAIL_OPEN | W +1.6 |

**7 · 4-3 · +5.6u** that the Sep 8 paper would have never posted. Cadence matches the forecast (~1 extra lock every day or two, not a 16-ticket day).

**One leak:** 09-11 CFB Over 51.5 Q1, tape BOOST + EDGE≥10, 3u, A/B arriving, leftover still stamped `believed-cut`, **W +3.1u**. T even stamped `HOLD` on it. HOLD should have saved this. Inspect the cycle order / A/B-at-leftover-time — do not write a new rule around n=1.

Believed-cut **no-steam** still belongs dead: Aug 19–Sep 15 **62 · 25-37 · −17u · −15%**. Extra week 18 · 9-9 · +5.6u is a 7-day flicker, not a unwind. Already-on leftover extra week **3-0 the other way (−6.5u)**.

---

## 3. Arriving bump — extra week was the cold half

Paper (Aug 19–Sep 8): arriving **34 · 26-8 · 76% · +51% · 2.62u/ticket**. Rest of book **2.66u/ticket · +5%**. Same stake, triple ROI. That was the undersize.

Extra week we **did** pay extra (16 native 2–3u → 4u):

| | N | W-L | Stake | PnL | ROI |
|--|--:|:---:|------:|----:|----:|
| At native 2–3u (CF) | 16 | 8-8 | 41u | +2.1u | +5% |
| At live 4u | 16 | 8-8 | 64u | +3.4u | +5% |
| **Extra from the bump** | | | **+23u** | **+1.3u** | |

Arriving as a cell went 76% → **44% (11-14, −8% ROI)** while the rest of the live book stayed **+6%**. Combined Aug 19–Sep 15 arriving is still better: **59 · 37-22 · 63% (50–74) · +21% · 3.11u/tix** vs rest **55% · +5% · 2.71u/tix**. We now size arriving ~0.4u heavier. That is the bump doing its job on a colder week, not a new undersize.

Sep 15 is in this cell: Guardians −1.5 was a 1.5u arriving BOOST to 4u (**L −4** instead of −1.5). Pirates +1.5 was 3u → 4u. The bump made that night more expensive. Do not retune on one card.

1u arriving floors extra week: 3 · 1-2 · −2.4u. Leave them at 2u. Do not restack to 4u.

**Keep the bump. Do not add more size. Do not include already-on.**

---

## 4. FAIL_OPEN leftover — still the only over-mute worth naming

Tape never scored, published size still <4u, leftover zeros it.

| | N | W-L | CF | What T would do |
|--|--:|:---:|---:|-----------------|
| All FAIL_OPEN Aug 19–Sep 15 | **26** | **20-6** | **+16.8u · +39%** | mixed |
| 1u, T would still `lean_no_arriving` | 13 | 11-2 | +7.9u at 1u | **still dead if leftover HOLDs** |
| **2–3u / arriving floor — T would ship** | **13** | **9-4** | **+11.5u · +36%** | **the real extra locks** |

Wilson on the shippable 13 is **42–87**. Discovery (Aug 19–30) is 11 · 8-3 · +11u. T-era hold is **2 tickets** (CFB Under 59.5 L −2, Dodgers 3u W +2.6). Extra week did **not** bury the watch and did **not** make it a must-ship.

Unwinding the *whole* FAIL_OPEN mute still dumps 1u DISSENT/UNOPP onto T, which then mutes them anyway. The only board change is the 2–3u tape-blind mids: ~1 every other week after T, mixed sports.

**Same recommendation as Sep 8: wait.** If we pick one unwind later, it is “FAIL_OPEN leftover HOLDs at 2–3u,” not “turn leftover off.”

---

## 5. Other mutes (not steam, in case “too many muted” is the whole stack)

T-era CF on non-steam mutes that still see steam-on tickets: **−13%**. FOOLS **−28u**. Ev-drift **−18u**. Fav-juice **−3u**. Those are still doing work.

Two watches, **not steam rules**:

| Mute | Paper through Sep 8 | Extra week | Note |
|------|---------------------|------------|------|
| `maxsr-sub4` | 75 · 32-43 · **−19u** | 25 · 14-11 · **+10u** | Flipped. Combined T +12u. Hygiene mute going cold is a separate paper. |
| `tape-weak` | −1u | 27 · 17-10 · **+5u** | Same watch the daily report already flags. |
| `top-crowded` | −14u | 10 · 7-3 · **+8u** | n=10. |

Do not steam-save these. August already measured “steam-save any mute” at **−3u**.

---

## Menu — extra week, not a new stack

| # | Change | Extra week / combined | Recommendation |
|---|--------|------------------------|----------------|
| — | Keep T (1u mute, unconfirmed 4u, unconfirmed fat) | Steam-tail extra week **−26u**. Fat 5-0 reversed. | **Keep.** |
| — | Keep leftover HOLD on A/B arriving + 2–3u→4u bump | HOLD shipped 7 · 4-3 · +5.6u. Bump extra **+1.3u**. Arriving went 76%→44%. | **Keep.** Inspect Over 51.5 leak. |
| — | Keep believed-cut on no-steam / already-on | No-steam **−17u** lifetime leftover. | **Keep.** |
| 1 | FAIL_OPEN leftover HOLD at 2–3u only | Combined shippable **13 · 9-4 · +11.5u**. T-era n=2. | **Wait.** Same as Sep 8. |
| 2 | Unwind 1u steam-tail | 99 · 51-48 · +0.5u. Board +6 tickets/day of noise. | **No.** |
| 3 | Unwind unconfirmed fat | Extra week **−15u**. Combined still a coin flip. | **No.** |
| 4 | Unwind unconfirmed 4u | **−12u** saved. | **No.** |
| 5 | Bump arriving further / floor 1u arriving to 4u | Extra week arriving **−8%**. Sep 15 already paid extra on the losers. | **No.** |

If we do one thing: **nothing on T.** The over-mute that is still real is FAIL_OPEN 2–3u, and it is still too thin to ship off a 7-day add-on.
