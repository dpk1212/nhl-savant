# You don’t need 3–5% EV — you need to be right

_Status: analysis, not a sizer change. Pulled 2026-09-09 from public Firestore._  
_Re-run: `node scripts/analyzeClvVsEv.mjs` → `/opt/cursor/artifacts/clv_vs_ev.txt`_

Dale’s Twitter idea: EV shops want **volume on price** (say **+3–5% EV** vs a model). We should be able to show we can take **−1 to −3% CLV** (worse than Pinnacle close), **win more**, and still outperform.

**The spirit is true. The exact cell is not.** Paying 1–3% vs close is not free. Paying a **hair** vs close (−1 to 0%), or simply **losing the close as a group**, is where the book actually wins more.

---

## Verdict (say this out loud)

1. **We are not an EV shop.** On 229 tickets with a stamped entry EV vs Pin fair, mean EV is **~0%**. The 3–5% EV bucket the industry hammers is **3 tickets** on our entire V12 book.
2. **We barely beat close.** 976 tickets with CLV: we beat Pin close **41%** of the time. Mean CLV is **+0.14%**. Median is **0**. Winners and losers have the **same** mean CLV (+0.12 vs +0.15). CLV did not tell us who won.
3. **We still print.** Live book Jun 1 → Sep 8 2026: **980 · 545-435 · 55.6% · +175u · +6.5% ROI**. That is **+1.5 percentage points** more wins than the prices we paid required (implied 54.1%).
4. **Losing the close still won more than beating it.** Any −CLV: **57.1% WR · +6.9% ROI · +2.3pp vs price**. Any +CLV: **54.3% WR · +6.7% ROI · +0.8pp vs price**. Same dollars, more wins on the “bad CLV” side.
5. **Do not tweet “−1 to −3% CLV and we crush.”** That bucket is **183 · 100-83 · 54.6% · −18u · −3.7% ROI · +0.3pp vs price**. Coin-flip excess. The money is one bucket nicer: **−1 to 0% CLV = 249 · 147-102 · 59% · +112u · +15.8% ROI · +4.3pp vs price**.

The tweetable contrast vs EV bettors:

> They need 3–5% of juice vs a model to fire. We flag at ~0% vs Pin, beat close 41% of the time, and still run 55.6% / +6.5% because we win more than the number we paid. CLV is not the same as being right.

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
| **Any +CLV (beat close)** | **510** | **54.3%** | **+0.8pp** | **+6.7%** | **+93u** | +1.62% |
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

- EV guys need 3–5% vs a model to pull the trigger. We don’t have that juice. Mean ticket vs Pin is ~0%. We still run **55.6% / +6.5%** because we **win more than the number**.
- We beat Pin close **41%** of the time. Mean CLV is a rounding error. Tickets that **lost** the close still won **57%**. Tickets that **beat** it won **54%**. Same ROI. Side > price.
- The fattest CLV cell on the book is not “steam with us.” It is **lost close by a hair** (−1 to 0%): **59% · +16% ROI · +4pp vs the price**.
- Negative EV vs Pin at flag (142 tickets) still **+12% ROI**. Price screens would have cut our actual edge.

**Must not say**

- “We take −1 to −3% CLV and easily outperform.” That cell is **−3.7% ROI**. It does not outperform.
- “CLV doesn’t matter.” Paying 1–3% vs close zeros the excess. Beating close by >3% is **+39% ROI**. CLV is not nothing; **it is not the filter**.
- “We have a 3–5% EV engine.” n=3. We do not.
- Internal labels in public copy: RANK, AGS, V12, GOLD, tape, leftover, Policy T.

**Hook shape (Dale’s idea, corrected)**

Felt moment: everyone in this corner of Twitter treats **beating close** and **3–5% model EV** as the receipt that you are sharp. Our receipt is the opposite: we **don’t** beat close, we **don’t** show 3–5% EV, and we still **win more than the juice we paid**.

Forced take: would you rather have a book that is +1.6% CLV at 54% or −1.5% CLV at 57% — same ROI, more wins on the “wrong” CLV side?

---

## Method

- Public Firestore `sharpFlowPicks` / `Spreads` / `Totals`, 2026-09-09.
- CLV from `result.clv` (close implied − lock implied). If missing, recompute from lock odds vs `closingOdds`.
- Entry EV from first tape-log row (`gate=first`), else `v8_ticketEvFirst` / stamped `v8_ticketEvPct`. Fair=0 rows dropped (known sentinel).
- Implied / excess uses **lock American odds**, not close. That is the price we actually paid.
- Wilson 95% on win rate. Units-weighted ROI.

This is a **description of the shipped book**, not a proposal to mute +CLV or to size into −CLV. The −3 to −1% cell losing money is a reason **not** to aim at worse numbers. The −1 to 0% cell and the −CLV vs +CLV win-rate gap are reasons **not** to worship beating close.

Re-run: `node scripts/analyzeClvVsEv.mjs`
