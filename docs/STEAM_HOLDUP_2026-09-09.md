# Steam hold-up — 10 more days after Policy T

_Pulled 2026-09-09. Same cells as [`CLOSING_DIME_STEAM_EDGE.md`](./CLOSING_DIME_STEAM_EDGE.md). Discovery window = Aug 19–30 (the paper, n=187 tape-log). Hold-up = Aug 31–Sep 8 (T live). Reconstructs muted tails at `v8_unitsPreSteamTail` so T cannot hide the tickets it cut._

_Re-run: `node scripts/analyzeSteamHoldup.mjs`_

Pairs with [`FILTER_SIZE_IMPACT_2026-09-09.md`](./FILTER_SIZE_IMPACT_2026-09-09.md). Follow-up: [`MID_STEAM_BUMP_2026-09-09.md`](./MID_STEAM_BUMP_2026-09-09.md) (not enough data to bump steam-aligned 2–3u to 4–5u).

---

## Direct answers

| Question | Answer |
|----------|--------|
| Did steam-tail T change 2–3u? | **No.** Native 2–3u all stamped `HOLD`. The only T size change into this band is **3 arriving floors** (1u→2u, 2-1 **+2.92u**). |
| Can we bump steam-aligned 2–3u to 4–5u? | **Not yet.** Arriving 2–3u is **10 · 8-2 · 80% (49–94) · +62%**. Wilson lo 49%, MLB-only. The August paper refused to size arriving at n=24 / Wilson lo 55%. [`MID_STEAM_BUMP_2026-09-09.md`](./MID_STEAM_BUMP_2026-09-09.md). |
| Did muting top tiers cost profit? | **Fat, yes, in this sample. 4u, no.** Unconfirmed 5.4u/6u went **5-0 +23.2u** on the cutting-room floor. Unconfirmed 4u went 6-5 **−2.7u** (mute saved money). Fat *with* A/B steam, which T **kept**, went 4-1 **+12.9u**. |
| Are the last 10 days luck? | **The 70% WR is hot. The book change is not luck.** 41-18 on 59 tickets vs the old 54% book is p≈**0.012**. vs the T *paper’s* 61% it is p≈**0.11** (consistent). 2–3u 61%→68% is p≈**0.19** (lucky-ish). Fat mute 5-0 is n=5 noise. |
| Do original steam patterns still hold? | **The ones we sized on, yes.** A/B arriving 75%→80%. A/B steam-at-lock 64%→72%. Combined A/B arriving **34 · 26-8 · 76.5% (60–88) · +50% ROI**. Already-on steam is still not the edge. Gold+limits is still n=3. |
| Are we maximizing? | **Maximizing the repeatable book: yes, T is still the mix.** Maximizing *this* 10-day sample: no — keeping unconfirmed fat would have been +23u more. Requiring steam on 2–3u would have **thrown away +26u**. Only-shipping arriving is +15u on 10 tickets — a featured slate, not the product. |

---

## 1. Steam did not resize 2–3u

Policy T’s 2–3u rule is HOLD. Code path: `steamTailBand` `mid` → `return hold('HOLD')`. Climate-halved fat can still get muted using *pre-climate* band — those never show up as live 2–3u.

| Book | N | W-L | WR | PnL | ROI |
|------|--:|:---:|---:|----:|----:|
| 2–3u **live** Aug 19–30 (T off) | 41 | 25-16 | 61% (46–74) | +11.9u | +11% |
| 2–3u **live native** Aug 31–Sep 8 (T on, not floors) | 50 | 34-16 | 68% (54–79) | **+39.5u** | +28% |
| Arriving floor 1u→2u (the only T size change here) | 3 | 2-1 | 67% | +2.9u | +49% |

Every native 2–3u live ticket after T has `v8_steamTailAction = HOLD` and `mutedBy = none`. T did not haircut them, boost them, or mute them.

The 2–3u *heater* (61%→68%, +12u → +40u) is mix + variance, not a steam-tail size change. Same band, same rule, more of them hit. Binomial vs their own pre-T 61%: **p = 0.19**. Do not write a new 2–3u rule because this week ran hot.

### Why we still must not steam-gate 2–3u

That was the original paper’s load-bearing result: **mid with no steam is not a dog.**

| 2–3u cell | Discovery (Aug 19–30) | Hold-up (Aug 31+) |
|-----------|------------------------|-------------------|
| A/B arriving | 4 · 3-1 · +61% ROI | 6 · 5-1 · +63% ROI |
| A/B steam at lock | 7 · 4-3 · +6% | 12 · 9-3 · +39% |
| **No steam at lock** | **31 · 17-14 · 55% · +3.0u** | **40 · 26-14 · 65% · +26.3u** |

No-steam 2–3u **printed +26u after T**. If we had required A/B steam on 2–3u we would have kept 12 tickets (+13.4u) and cut 40 tickets (+26.3u). Higher ROI, half the money, ~2 tickets/day. That is the trap the August paper already named: WR barely moves, volume collapses.

**Steam is hotter on 2–3u when it is there. Steam is not required for 2–3u to pay.** Leave them alone.

---

## 2. Muting “top” tiers — split the band

“Top unit tiers” is not one pile. T treats 4u, 5u, and 5.4u+ differently. The 10-day tape:

| Gate | What T did | N | W-L | CF PnL | |
|------|------------|--:|:---:|-------:|--|
| Unconfirmed **4u** | MUTE | 11 | 6-5 | **−2.7u** | Mute **saved** money |
| **5u** | always ship | 1 | 1-0 | **+6.0u** | Correct to keep 5u off the 4u pile |
| Fat **with** A/B steam | KEEP | 5 | 4-1 | **+12.9u** | This is the fat we wanted |
| Fat **without** A/B steam | MUTE | 5 | **5-0** | **+23.2u left on the table** | Cost of the gate *this sample* |

If T had also shipped the five unconfirmed fat tickets: **64 · 46-18 · +84.5u · +41% ROI** vs actual **59 · 41-18 · +61.3u**.

That +23u is five tickets:

- 09-04 MLB Over 8.5 SUPER 6u −112 WIN
- 09-04 MLB Over 7.5 RANK 5.4u +110 WIN
- 09-05 UFC Benouaich 5.4u −132 WIN
- 09-05 UFC Campbell 5.4u −358 WIN (would also fail −375)
- 09-06 MLB Dodgers −1.5 5.4u +117 WIN

Wilson on 5-0 is **57–100%**. Coin flip is still inside the interval. The *original* cell this gate was built on:

| Fat without A/B steam | N | W-L | WR | ROI | PnL |
|-----------------------|--:|:---:|---:|----:|----:|
| Discovery (the paper) | 29 | 17-12 | 59% (41–75) | **−4.9%** | **−7.7u** |
| Hold-up (new 10 days) | 5 | 5-0 | 100% (57–100) | +84% | +23.2u |
| Combined Aug 19–Sep 8 | 34 | 22-12 | 65% (48–79) | +8.3% | +15.5u |

Combined flipped positive **only because of those five**. Strip them and the cell is the discovery book again: 29 · 17-12 · −7.7u. Fat *with* A/B steam held in both halves: **9 · 7-2 · +34%** then **5 · 4-1 · +47%**, combined **14 · 11-3 · 79% (52–92) · +38%**.

So: muting unconfirmed fat **cost this week**. Muting unconfirmed 4u **paid**. Keeping confirmed fat **paid**. Do not unwind the fat gate on n=5. Do not mute confirmed fat (Real Madrid −5.40 is the 1 in 4-1; mute-all-fat on this window is +47u vs T’s +61u).

---

## 3. Luck vs a real change

Two different questions.

### Did a change actually help? **Yes.**

What T (plus the Aug 19–29 mute stack) observably did, independent of 70% WR:

- Tickets/day **15.8 → 6.6**
- 1u band **gone** (August 1u was 168 · 76-92 · **−20.3u**)
- Left tail: Aug 28 **−30.3u** / 22 tickets. After T the worst day is Sep 8 **−1.59u**
- 4u unconfirmed mute **−2.7u saved**
- Ev-drift 3/3 losers, **−10.4u saved**
- −375 juice mute **−3.5u saved**
- Arriving floor **+2.9u** on 3 tickets
- Confirmed fat kept **+12.9u**

41-18 vs shipping the *old* 54.2% book: **p = 0.012**. That is not “we got lucky on the same process.” The process deleted the junk and the unconfirmed 4u.

Drop Sep 1 (4-0 +16.8u): still **55 · 37-18 · 67% · +44.5u · +27% ROI · +5.6u/day**. The spike is real money. It is not the whole window.

### Is 70% WR luck? **Mostly yes, vs the paper.**

T’s August paper said going-forward steam-window T is **66% WR / ~6 tickets/day**. We printed **70% on 6.6/day**. vs 61% paper: **p = 0.11**. Hot, not a new law.

Native 2–3u 68% vs its own 61%: **p = 0.19**. The spine running hotter is the luck. T did not create that.

Expect mean-reversion toward **~60–66% WR, ~+4–7u/day**, not 70% forever. The *structural* lift (fewer tickets, no 1u, no −30u days, 4u gate, confirmed fat) should remain.

---

## 4. Do the original steam patterns still hold?

Discovery cells reproduced exactly (187 · 101-86 · 54% · A/B arriving 24 · 18-6 · 75%). The loader matches the paper. Hold-up is a fair test.

| Cell | Discovery (paper) | Hold-up (10 days) | Combined | Hold-up? |
|------|-------------------|-------------------|----------|----------|
| **A/B + arriving** | 24 · 18-6 · **75% (55–88) · +47%** | 10 · 8-2 · **80% (49–94) · +59%** | **34 · 26-8 · 76.5% (60–88) · +50%** | **YES. Thicker, Wilson lo still 60%** |
| **A/B + steam at lock** | 45 · 29-16 · **64% (50–77) · +27%** | 25 · 18-7 · **72% (52–86) · +41%** | **70 · 47-23 · 67% (56–77) · +32%** | **YES. This was the n≥21 cell. Still holds.** |
| Steam already on (on→on) | 25 · 13-12 · 52% · +5% | 17 · 11-6 · 65% · +29% | 42 · 24-18 · 57% · +15% | Still not the edge. Paper said coin flip. |
| A/B, **no** steam | 124 · 66-58 · 53% · +1% | 109 · 66-43 · 61% · +26% | 233 · 132-101 · 57% · +11% | Hold-up looks hot because **2–3u no-steam printed +26u** + five muted fat winners sit in this reconstructed book. Not a new “fade steam” law. |
| No steam at lock | 137 · 70-67 · 51% · **−5%** | 115 · 69-46 · 60% · +23% | 252 · 139-113 · 55% · +6% | Same story. Discovery was the leak. Hold-up is the 2–3u heater. |
| Steam, no A/B | 5 · 2-3 · −13% | 2 · 1-1 | 7 · 3-4 · −9% | Still do not drop the A/B requirement. |
| Gold 4.5%+ | 8 · 6-2 · 75% (41–93) | 2 · 1-1 | 10 · 7-3 · 70% (40–89) | Still not a sample we size on. |
| Gold+limits | 2 · 2-0 | 1 · 0-1 | 3 · 2-1 | Still n=3. |
| 5.4u+ **with** A/B steam | 9 · 7-2 · +34% | 5 · 4-1 · +47% | **14 · 11-3 · 79% (52–92) · +38%** | **YES. Keep shipping these.** |
| 5.4u+ **without** A/B steam | 29 · 17-12 · **−5%** | 5 · 5-0 · +84% | 34 · 22-12 · +8% (Wilson 48–79) | **Direction from the paper did not replicate in 10 days. Combined still has coin flip in the interval. Do not retune.** |

A/B arriving combined Wilson lower bound is **60%**. That is the first steam cell whose interval sits fully above 50% with n=34. The paper called it “explore / paint, do not size.” After 10 more days it is **stronger**, still not a reason to only-ship arriving (that is 10 tickets / +15u in the hold-up window).

Already-on steam heating up in the hold-up (65%) is n=17. Combined 57%. Do not start treating on→on like arriving.

---

## 5. Are we maximizing the daily book?

Hold-up window, reconstructed at pre-policy units:

| Recipe | N | W-L | PnL | ROI | Tickets/day | What it is |
|--------|--:|:---:|----:|----:|------------:|------------|
| **T as shipped (FINAL)** | **59** | **41-18** | **+61.3u** | **+34%** | **6.6** | **What we ran** |
| T but keep unconfirmed fat | 66 | 47-19 | +83.2u | +40% | 7.3 | Chasing the 5-0 |
| Cut 1u only (keep fat + 4u) | 75 | 52-23 | +80.4u | +33% | 8.3 | Puts junk 4u back (−2.7u) plus the five fat |
| Recipe C (keep 4u, mute unconfirmed fat) | 70 | 47-23 | +57.2u | +26% | 7.8 | Worse than T this window (4u mute was +EV) |
| Mute ALL fat (even confirmed) | 56 | 38-18 | +47.1u | +31% | 6.2 | Kills the +12.9u we wanted |
| **T + steam-gate 2–3u** | **21** | **16-5** | **+33.7u** | **+48%** | **~2.3** | Pretty ROI, **leaves +26u on the table** |
| Only A/B arriving | 10 | 8-2 | +15.3u | +59% | ~1.1 | Featured slate. Not the product |

Combined Aug 19–Sep 8 (the whole steam era, T applied as a counterfactual on discovery + live after):

| Recipe | N | PnL | ROI |
|--------|--:|----:|----:|
| **T** | 130 | **+104.6u** | **+27%** |
| T keep unconfirmed fat | 164 | +120.1u | +21% |
| T + steam-gate 2–3u | 57 | +73.4u | +40% |
| Only A/B arriving | 34 | +43.8u | +51% |

Keep-fat wins combined by **+15u**, and that +15u is **exactly** discovery fat −7.7u + hold-up fat +23.2u. One more 10-day chunk like discovery and keep-fat is behind again. One more chunk like this week and it is further ahead. That is why you do not retune a tail gate on 5 tickets.

**Maximum repeatable daily book for this product (a 5–8 ticket slate, not a 2-ticket steam museum):**

1. Keep T. 1u gone, 4u unconfirmed mute paid, 2–3u untouched, confirmed fat kept, 5u kept.
2. Do **not** require steam on 2–3u. That is the +26u we would light on fire for a prettier WR.
3. Do **not** only-ship arriving. +15u / 10 tickets is not the board we sell.
4. Do **not** mute confirmed fat. Real Madrid −5.40 is the cost of keeping the 4-1 +12.9u pile.
5. Watch unconfirmed fat to Sep 30. If the next 20 fat-no-steam tickets look like 5-0 again, *then* the gate is wrong. If they look like 17-12 −5%, T is right.
6. Floor arriving stays. 3-for-3 sample is tiny but matches the paper (+4.3u on the August bump).
7. Do **not** bump 2–3u to 4–5u on steam alignment. Arriving 2–3u is 10 tickets, Wilson lo 49%, MLB-only. Re-open at n≥24. [`MID_STEAM_BUMP_2026-09-09.md`](./MID_STEAM_BUMP_2026-09-09.md).

We are not leaving 2–3u edge on the table by ignoring steam there — we are *collecting* it. We *are* leaving unconfirmed-fat edge on the table **this week**. That is the price of the rule that stopped August’s −30u day and the −9% fat leak. Until n on that cell is tens, not five, T is still the maximum *process*, not the maximum *this sample*.
