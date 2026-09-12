# I'd rather win than chase EV

_Status: analysis, not a sizer change. Pulled 2026-09-09 from public Firestore._  
_Re-run: `node scripts/analyzeClvVsEv.mjs` → `/opt/cursor/artifacts/clv_vs_ev.txt`_

People ask about **entry price**. The honest answer is not “we always get a good number.” It is: **I’d rather be on the side that wins than hunt 3–5% of juice vs a model.**

That is not anti-math. It is an argument about **which half of EV you trust**.

---

## Theory first (the thing to say before any table)

Expected value has two inputs:

1. **How often you are actually right** (true win rate)
2. **What they paid you** (the number / implied probability)

EV Twitter mostly watches (2), because you can screenshot it before the game. A model says fair is −110, you got +105, that’s “+4% EV.” Entry price, CLV, juice — same family. Observable. Identity.

(1) is the whole game. You cannot screenshot true probability at 11am. You only see it on Monday, or you proxy it by **who is on the side**.

So “chase EV” in practice means: **optimize the number vs a model’s fair, fire volume, hope the model’s true_p is right.**

“I’d rather win” means: **optimize the side from people we have tracked for months, accept a slightly worse number, hope those extra wins are bigger than the juice we gave up.**

Those two strategies only collide when they put you on **different tickets**. If the 3–5% EV number is the same side the sharps are on, you take it and you got paid. The interesting case is the one people actually ask about: *the number looks average or worse, why are you on it?*

### The inequality (no book required)

At ordinary juice (−110 / −120), a useful rule of thumb:

- **~2 extra wins per 100 tickets ≈ 3–4% of extra juice**
- So 3–5% EV at the *same* true win rate is a real, respectable edge
- And **2 extra wins per 100 at a slightly worse number is the same size edge** — it just never shows up as “entry EV”

Chasing EV outperforms following people only if the **soft number** is worth more than the **extra wins** you give up by leaving the side. Following people outperforms chasing EV only if the **extra wins** are worth more than the **juice you didn’t wait for**.

“I’d rather win” is the claim that, for us, the second thing is bigger. It is **false** if you donate more juice than those extra wins (buying any worse number is not a personality). It is **true** if passing a sharp-backed side to hunt 3% vs a model puts you onto coin flips with a prettier spreadsheet.

Cheap on the wrong side is −EV with a green cell.  
A bit expensive on the right side is +EV that looks −EV at flag.

### Why they ask about entry

- It’s the input they can argue about *before* the game
- Beating close became the IQ test on this timeline
- Their workflow has to be volume-on-price: if you don’t have a who, you only have a number

The inverted question: they’re asking **did you buy it cheap?** You’re answering **did we buy the right thing?**

Abstract forced take (numbers come after, if at all):

> Would you rather have 500 tickets that were 4% EV on a spreadsheet, or 500 tickets the people you actually trust were on — even if the number was worse? If two extra wins per hundred beat 4% of juice, you already know the answer. Entry is half of EV. The other half is being right.

Then, if someone wants the receipt, the 500 vs 500 below is the book version of that sentence.

---

## Book version (only after the theory)

Dale’s numeric tweet: **Would you rather have 500 tickets at 3–5% EV, or 500 tickets the sharps we track actually sat on — even if the price is worse or the ticket is −EV?**

**Yes, we can show we outperform EV betting — on that second pile.** Equalize ticket count. Give the EV shop their number as *true* expected ROI (charitable). Compare to our actual graded tickets.

We do **not** have 500 of our own 3–5% EV tickets (n=3 vs Pin fair). The fair test is: if a calibrated EV shop really had 3–5% edge, 500 tickets return 3–5% of the **same stake**. We put 500 of ours next to that.

---

## Verdict (the 500 vs 500)

1. **The tweet sample is “worse price or −EV,” not “any 500 we shipped.”** Pool = lost Pin close **or** entry EV < 0 vs Pin fair. **567** tickets. First 500 (Jun 1–Aug 28): **283-217 · 56.6% · +106u · +7.7% ROI**. Mean CLV **−1.1%**. **438 / 500** lost close. 4% EV on that stake is **+55u**. 5% EV is **+69u**. We did **+106u**.
2. **Random 500s from that pool beat 5% EV every time.** 4,000 draws: mean ROI **+9.2%**, p10 **+7.2%**, **100%** clear 5% EV. That is the sentence the tweet needs.
3. **Tickets an EV screen would skip still print.** Entry EV < 0 vs Pin: **142 · 82-60 · 57.7% · +46u · +11.7% ROI**. 5% EV on that stake is +20u. They left +26u on the table. We do not have 500 of these (tape-era only); the rate is the point, not a fake 500.
4. **Sharps-we-track on our side (819 tickets) also clear 5%.** First 500 (Jun 1–Aug 12): **+5.5% ROI**, beats 5% by **+8u**, and **flat 1u is +6.6%** — the edge is the side, not just loading. Every rolling 500 on this pool is above 5% EV (min +5.5%). Bootstrap: **94%** of random 500s beat 5%, **99%** beat 3%.
5. **Do not tweet “any 500 of ours beat 5% EV.”** First 500 of the mixed book (Jun 1–Jul 23): **+4.5% ROI** — clears 3% and 4%, **loses to 5% by 7u**. Rolling 500s on the whole book: **96% beat 3%, only 20% beat 5%** (median +4.2%). The mixed book beats a 3% EV shop. It does not reliably beat a *true* 5% EV shop. The **worse-price / sharp-backed** cut does.

---

## The 500 vs 500 (equal tickets, same stake)

EV shop column = `our_stake × 3% / 4% / 5%`. If their EV is real, that is what 500 tickets are *supposed* to return. Ours is what actually happened.

| 500 tickets | Window | W-L | WR | Our ROI | Our PnL | 4% EV would pay | 5% EV would pay | We beat 5%? |
|-------------|--------|:---:|---:|--------:|--------:|----------------:|----------------:|:-----------:|
| **Worse price or −EV** | Jun 1–Aug 28 | 283-217 | 56.6% | **+7.7%** | **+106u** | +55u | +69u | **yes +37u** |
| Worse price or −EV | last 500 through Sep 8 | 293-207 | 58.6% | +11.4% | +163u | +58u | +72u | yes +91u |
| **Sharps we track on it** | Jun 1–Aug 12 | 288-212 | 57.6% | **+5.5%** | **+82u** | +59u | +74u | **yes +8u** |
| Sharps we track on it | last 500 through Sep 8 | 288-212 | 57.6% | +10.8% | +152u | +56u | +70u | yes +82u |
| Mixed live book | Jun 1–Jul 23 | 278-222 | 55.6% | +4.5% | +62u | +55u | +69u | **no −7u** |
| Mixed live book | last 500 through Sep 8 | 279-221 | 55.8% | +9.1% | +123u | +54u | +68u | yes +56u |

Worse-price first 500 mix: **438 lost Pin close**, mean CLV **−1.09%**, stamped entry EV **−0.79%**, 399/500 had a tracked sharp on the side. That is not a juice screen. That is “who is on it” at a worse number.

**−EV vs Pin (EV shop would pass):** 142 tickets, **+11.7% ROI**, +26u more than 5% EV on the same stake. Scaled at that rate to 500 tickets: **+162u** vs **+69u** for 5% EV. Label the scale; n is 142.

### Random 500-ticket books (4,000 shuffles)

| Pool | Mean ROI | 10th percentile | Share beating 3% EV | Share beating 5% EV |
|------|---------:|----------------:|--------------------:|--------------------:|
| Worse price or −EV | **+9.2%** | **+7.2%** | **100%** | **100%** |
| Sharps we track on it | +9.4% | +5.8% | 99% | **94%** |
| Mixed live book | +6.5% | +2.4% | 86% | 67% |

The 10th percentile on the worse-price pool is still **above 5% EV**. A cold 500 from that pile is not a coin flip against a 5% EV shop.

### Rolling 500 (chronological)

| Pool | Windows | Median ROI | Min | Beat 3% | Beat 5% |
|------|--------:|-----------:|----:|--------:|--------:|
| Worse price or −EV | 4 | +8.8% | +7.7% | 4/4 | **4/4** |
| Sharps we track on it | 16 | +6.9% | +5.5% | 16/16 | **16/16** |
| Mixed live book | 25 | +4.2% | +2.5% | 24/25 | **5/25** |

### Flat 1u (strip our sizing)

If the only edge was loading winners, flat 1u would die. It does not on the sharp-backed cut:

- Sharps we track, first 500: **flat 1u +6.6%** (clears 5% without size)
- Sharps we track, all 819: **flat 1u +7.2%**
- Worse-price first 500: flat 1u **+3.2%** (clears 3%, not 5% — **size is how that pile beats 5%**)
- Mixed book first 500: flat 1u +3.9%

Tweet implication: “500 sharp-backed even at a worse price” can beat 3–5% EV at **equal units**. The −EV / lost-close pile beats 5% once we still size the ones the sharps are on.

---

## What this is not

- **Not 500 real 3–5% EV tickets we graded.** We have **3**. EV vs Pin fair is a hard bar; EV shops measure vs *their model*. We are testing against their **claimed** 3–5%, not against a pile of our own +4% numbers.
- **Not “CLV doesn’t matter.”** Paying 1–3% vs close on the mixed book is **−3.7% ROI**. The 500 vs 500 win is **side selection + who is on it**, including tickets that *look* −EV, not a license to buy any worse number.
- **Not the hot T-live week alone.** First 500 worse-price ends **Aug 28**, before that week. First 500 sharp-backed ends **Aug 12**.

The tweetable forced take:

> Would you rather have 500 tickets at 4% EV, or 500 tickets the sharps we track were actually on — even when the number was worse? 500 of the worse-price pile: 57% win rate, −1.1% CLV, +7.7% ROI. 4% EV on that stake is +55u. It did +106u.

---

## Older CLV cut (supporting, not the tweet)

The first pass asked “can we take −1 to −3% CLV and crush.” **That exact cell cannot:** 183 · 54.6% · −18u · −3.7% ROI. The 500 vs 500 above is the version that survives. CLV detail still matters so we do not over-claim.

**The spirit is true. The exact −1 to −3% cell is not.** Paying a **hair** vs close (−1 to 0%), or simply **losing the close as a group**, is where the mixed book still wins more.

1. **We are not an EV shop.** On 229 tickets with a stamped entry EV vs Pin fair, mean EV is **~0%**. The 3–5% EV bucket the industry hammers is **3 tickets** on our entire V12 book.
2. **We barely beat close.** 976 tickets with CLV: we beat Pin close **41%** of the time. Mean CLV is **+0.14%**. Median is **0**. Winners and losers have the **same** mean CLV (+0.12 vs +0.15). CLV did not tell us who won.
3. **We still print.** Live book Jun 1 → Sep 8 2026: **980 · 545-435 · 55.6% · +175u · +6.5% ROI**. That is **+1.5 percentage points** more wins than the prices we paid required (implied 54.1%).
4. **Losing the close still won more than beating it.** Any −CLV: **57.1% WR · +6.9% ROI · +2.3pp vs price**. Beat close (CLV > 0): **54.0% WR · +7.6% ROI · +0.2pp vs price**.
5. **Do not tweet “−1 to −3% CLV and we crush.”** That bucket is **183 · 100-83 · 54.6% · −18u · −3.7% ROI**. The money is one bucket nicer: **−1 to 0% CLV = 249 · 147-102 · 59% · +112u · +15.8% ROI**.

---

## What the words mean here

| Term | Definition on this book |
|------|-------------------------|
| **Entry EV** | Ticket vs Pinnacle no-vig fair at first tape row (flag). Stamped from 2026-08-19. **246 / 980** tickets have it. |
| **CLV** | `closeProb − lockProb` in probability points. **+** = we beat Pin close (line moved toward us). **−** = we paid worse than close. Retail lock odds vs Pin `closingOdds`. Almost every live ticket has it (**976 / 980**). |
| **Excess WR** | Actual win rate minus mean implied probability of the prices we paid. **This is “win more.”** Positive = we cleared the number. |
| **Live book** | AGS-U promoted, COMPLETED, WIN/LOSS, `finalUnits > 0`, `tracked ≠ true`, date ≥ 2026-06-01. |

EV shops usually measure EV vs **their model’s fair**, then fire 3–5% and hunt volume. Our entry EV is vs **Pin fair** — a much harder bar. That is why we almost never show +3–5% EV: Pin is already tight, and we are not waiting for a soft number. We are following **who is on it**.

---

## The live book

| Slice | N | W-L | WR (95% Wilson) | ROI | PnL | mean CLV | excess vs price |
|-------|--:|:---:|----------------:|----:|----:|---------:|----------------:|
| **All V12+** | **980** | **545-435** | **55.6% (52.5–58.7)** | **+6.5%** | **+175u** | +0.14% | **+1.5pp** |
| Has CLV | 976 | 543-433 | 55.6% | +6.8% | +182u | +0.14% | +1.5pp |
| Has entry EV (tape era) | 246 | 142-104 | 57.7% | +10.8% | +71u | +0.66% | +2.6pp |

---

## CLV buckets — where “win more” actually lives

CLV = beat / lose Pin close. Excess = win rate minus the implied of **our** lock price.

| CLV vs Pin close | N | W-L | WR | vs the price we paid | ROI | PnL |
|------------------|---:|:---:|---:|---------------------:|----:|----:|
| lost close **> 3%** | 34 | 19-15 | 55.9% | **−1.0pp** | −4.2% | −4u |
| lost close **1–3%** ← Dale’s cell | 183 | 100-83 | 54.6% | **+0.3pp** | **−3.7%** | **−18u** |
| lost close **0–1%** ← the real cell | **249** | **147-102** | **59.0%** | **+4.3pp** | **+15.8%** | **+112u** |
| beat close **0–1%** | 285 | 144-141 | 50.5% | **−3.2pp** | −2.3% | −18u |
| beat close **1–3%** | 162 | 96-66 | 59.3% | +4.1pp | +12.3% | +56u |
| beat close **> 3%** | 63 | 37-26 | 58.7% | +10.1pp | +39.1% | +54u |

| Group | N | WR | vs price | ROI | PnL | mean CLV |
|-------|--:|---:|---------:|----:|----:|---------:|
| **Any −CLV (lost close)** | **466** | **57.1%** | **+2.3pp** | **+6.9%** | **+90u** | −1.49% |
| **Beat close (CLV > 0)** | **404** | **54.0%** | **+0.2pp** | **+7.6%** | **+81u** | +2.05% |
| CLV ≥ 0 (includes 106 flats) | 510 | 54.3% | +0.8pp | +6.7% | +93u | +1.62% |
| CLV exactly 0 | 106 | 55.7% | +2.8pp | +3.8% | +12u | 0 |
| CLV −3 to 0% | 432 | 57.2% | +2.6pp | +7.8% | +93u | −1.02% |

Read it as a U, not a slope:

- **Paying a hair** (−1 to 0%) and **beating close for real** (+1% or more) both print.
- The mushy **0 to +1%** “we basically matched close” bucket is the trap: 50.5% WR, −3.2pp vs price, −18u.
- **Paying 1–3%** is the other trap: we do **not** win more than the worse number. ROI goes negative.

So: **you do not need to beat close.** You also cannot donate 1–3% of probability and expect the side to bail you out every time.

CLV distribution: n=976, mean **+0.14**, median **0**, p10 **−1.85**, p90 **+2.25**. Beat close: **404 / 976 (41.4%)**. Exactly 0: 106.

Winners’ mean CLV **+0.12%**. Losers’ mean CLV **+0.15%**. The close does not know our result.

---

## EV-shop analog — we almost never have their 3–5%

Entry EV is only on the tape-era book (from 2026-08-19). That is a feature: we did not wait around for a 4% number.

| Entry EV vs Pin fair | N | W-L | WR | ROI | PnL | mean CLV |
|----------------------|--:|:---:|---:|----:|----:|---------:|
| **< 0%** (no “price”) | **142** | **82-60** | **57.7%** | **+11.7%** | **+46u** | +0.44% |
| 0–2% | 81 | 44-37 | 54.3% | +10.0% | +20u | +1.04% |
| 2–3% | 11 | 6-5 | 54.5% | −13% | −5u | +0.27% |
| **3–5%** (their volume band) | **3** | **2-1** | **67%** | **−6%** | **−0.4u** | +2.78% |
| 5%+ | 9 | 8-1 | 89% | +59% | +11u | +0.51% |
| missing (pre-tape, still the book) | 734 | 403-331 | 54.9% | +5.1% | +104u | −0.04% |

**Tickets flagged at negative EV vs Pin still made +12% ROI.** That is the opposite of an EV-shop filter, and it is the sample (n=142), not a one-week spike.

EV ≥ 3% is **12 tickets, 10-2, +41% ROI** — real when it happens, not a volume engine. You cannot build a 10-ticket-a-day book waiting for Pin to be 4% wrong.

The industry move is: scrape a model, fire every +3–5% number, accept CLV variance, scale. Our move is: follow sharps for months, size when they size, and accept that the **ticket vs Pin fair is often flat or negative**. The profit is **excess win rate vs the price**, not a juice screen.

---

## Juice check — “win more” is not just heavy favorites

−1 to 0% CLV (the printer) is not a pile of −200s getting lucky:

| Price in the −1 to 0% cell | N | WR | vs price | ROI |
|----------------------------|--:|---:|---------:|----:|
| plus money | 67 | 49.3% | **+4.0pp** | +13.5% |
| −100 to −120 | **91** | **58.2%** | **+6.0pp** | **+22.2%** |
| −121 to −150 | 42 | 66.7% | **+9.3pp** | +23.1% |
| −151 to −200 | 24 | 58.3% | −4.8pp | +8.5% |
| < −200 | 25 | 76.0% | −1.0pp | −2.9% |

The juice we actually paid (−110 / −130) is where that cell prints. Dogs in that cell still clear the number (+4pp excess). Big favorites in that cell hit at the rate the juice already demanded — they are not the edge.

By comparison, **−3 to −1%** at −100 to −150 is **flat-to-dead** (52% WR, negative ROI). Paying that extra 1–2% vs close on the same juice **erases** the excess.

Market split on Dale’s −3 to −1% cell: moneylines 116 · 56% · −1.5% ROI; totals 43 · 46.5% · −10% ROI. Totals that lose the close are a fade, not a flex.

---

## By window (honesty on the hot week)

| Window | Book | −3 to −1% CLV |
|--------|------|----------------|
| V12 pre-steam (Jun 1–Aug 18) | 731 · 54.9% · +5.0% | 161 · 54.7% · −0.8% ROI |
| Steam on, T off (Aug 19–30) | 190 · 54.2% · +2.7% | 14 · 50% · −58% ROI (thin, one 5.4u L) |
| **T live (Aug 31–Sep 8)** | **59 · 69.5% · +34%** | 8 · 62.5% · +22% ROI (n=8 — do not hang a tweet on it) |

T-live is a different animal (fewer tickets, higher WR). Do not launder that week into “negative CLV always prints.” The **full-book** −CLV vs +CLV split is the one that is thick enough to say out loud.

MLB (the volume): −CLV tickets in the −3 to −1% band are 153 · 54.9% · −1.4% ROI; **+CLV MLB is 51.1% WR**. Even inside baseball, losing the close still **won more often** than beating it. That is the clean sport-level receipt.

---

## What we can say on Twitter (and what dies)

**Can say**

- People ask about entry. I’d rather win than chase EV. Entry is half the formula. The other half is how often you’re right.
- ~2 extra wins per 100 tickets ≈ 3–4% of juice. That’s why a slightly worse number on the right side beats a pretty number on a coin flip.
- Would you rather 500 tickets at 4% EV, or 500 the sharps we track were on even when the number was worse? Worse-price 500: **57% · −1.1% CLV · +7.7% ROI · +106u** vs **+55u** for 4% EV.
- Tickets that were **−EV vs Pin** (the ones a juice screen skips): **+12% ROI**.
- 500 tickets with a tracked sharp on our side, **flat 1u still +6.6%**. Side, not just size.

**Must not say**

- “Any 500 of ours beat 5% EV.” First 500 of the mixed book is **+4.5%** (under 5%). Only 20% of rolling mixed-book 500s clear 5%.
- “We take −1 to −3% CLV and easily outperform.” That cell is **−3.7% ROI**.
- “We graded 500 tickets at 3–5% EV.” n=3. We beat their *claimed* EV, not a pile of our own +4% numbers.
- Internal labels in public copy: RANK, AGS, V12, GOLD, tape, leftover, Policy T, Source A/B.

**Hook shape**

Felt moment: people ask about entry. The answer is I’d rather win than chase EV — not because price is fake, because **being right is the other half of EV** and they only watch the screenshotable half.

Forced take: 500 of 4% EV on a spreadsheet, or 500 the people you trust sat on at a worse number?

---

## Method

- Public Firestore `sharpFlowPicks` / `Spreads` / `Totals`, 2026-09-09.
- CLV from `result.clv` (close implied − lock implied). If missing, recompute from lock odds vs `closingOdds`.
- Entry EV from first tape-log row (`gate=first`), else `v8_ticketEvFirst` / stamped `v8_ticketEvPct`. Fair=0 rows dropped (known sentinel).
- Implied / excess uses **lock American odds**, not close. That is the price we actually paid.
- Wilson 95% on win rate. Units-weighted ROI. 500 vs 500 uses the same stake; EV shop PnL = stake × 3/4/5%.
- Worse-price pool = `CLV < 0` OR `entry EV < 0`. Sharp-backed = Source A/B CONFIRMED on our side (public copy: sharps we track).
- Bootstrap: 4,000 shuffles of 500 without replacement. Rolling windows step 20.

This is a **description of the shipped book**, not a proposal to mute +CLV or to size into −CLV. The −3 to −1% cell losing money is a reason **not** to aim at worse numbers. The −1 to 0% cell and the −CLV vs +CLV win-rate gap are reasons **not** to worship beating close.

Re-run: `node scripts/analyzeClvVsEv.mjs`
