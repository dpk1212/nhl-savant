# Trial overlay — X wording that actually starts trials

**Source locked:** Dale analysis 2026-09-14. GA4 nhl-savant property **509696488**, ET.  
**Window:** 211 `trial_started` events / 181 users, Jul 17–Sep 13 2026.  
**Account:** @Real_NHL_Savant (~2,304 followers).  
**Method:** same-day overlay of t.co trials against what you posted. **Per-tweet `?ref=` is broken** — this is not a pixel on each tweet. A spike is “this wording family ran that day,” not “this tweet caused these 7 trials.” Impressions/replies in the spike table are lifetime as of Sep 14.

**Pairs with:** `hormozi_tweet_process.md` (ASK / PURPOSE) · `analytics_csv_ingest.md` · content CSV for *attention*.  
**North star:** free trials started. Engagement CSV is the attention scoreboard. **This file is the compliance scoreboard.** High impressions without a fork do not count.

When Dale drops a new trial overlay, overwrite this file + the **TRIAL OVERLAY** block in `hormozi_tweet_process.md`. A content CSV ingest must **not** wipe this block.

---

## Headline

| Stat | Value |
|------|--------|
| Trial users from t.co | **89** |
| Share of trial users from X | **49%** |
| t.co sessions → trial | **2.4%** |
| Direct sessions → trial | **0.4%** |

**Proof plus an invite beats a promo code.** The days that convert are not the days with the most impressions. They are the days you posted a **hard number**, then asked people to raise a hand, comment, or take a seat — or put the free trial in the **same tweet** as a wallet receipt. Price-forward heroes (`$5.35/week`) and buried “first week is free” self-replies do not.

---

## Who starts a trial

GA4 `trial_started` by sessionSourceMedium · last 90 days through Sep 13.

| Claimed source | Events | Share |
|----------------|--------|-------|
| t.co (X) | 97 | 46% |
| Direct | 43 | 20% |
| Stripe return | 38 | 18% |
| Google organic | 27 | 13% |
| Other | 6 | 2.8% |
| **Total** | **211** | |

Stripe checkout/billing (38 events) is mostly people coming back from Stripe after `trial_started` fires on `/?checkout=success`. **Treat as pollution, not a channel.** `x.com / referral` is 1 event — almost every X click lands as t.co.

### Session → trial by channel

Same 90 days. GA4 sessions + `begin_checkout` + `trial_started`.

| Channel | Sessions | Checkouts | Trials | Sess → trial |
|---------|----------|-----------|--------|--------------|
| t.co / referral | 4,077 | 200 | 97 | **2.4%** |
| Google / organic | 3,494 | 85 | 27 | 0.8% |
| Direct | 10,090 | 129 | 43 | 0.4% |

t.co also converts checkout: 200 events / 109 users vs 97 trials / 89 users.

**Funnel:** 1,752 first-visit users → 754 paywall → 228 begin-checkout → 181 trial.

### Weekly volume (ET weeks Mon–Sun)

Chart starts Jul 20 (Jul 17–18’s first two trials omitted). Biggest X weeks:

- **Week of Aug 24** — wallet receipts + SUMMER
- **Aug 31–Sep 7** — hot streak, **no promo**
- **Week of Sep 7** — biggest overall because **direct/Google rose with it** — proof content leaks off X too

---

## Spike days vs the post you wrote

Overlay only.

| Day | Trials | t.co | What you posted | Imp / replies | Pattern |
|-----|--------|------|-----------------|---------------|---------|
| Aug 4 | 9 | 7 | Looking for 5ish bettors · ONTHEHOUSE 10 seats · ATH 85.47u | 2.1k / 12 | Recruit + seats + code |
| Aug 27–28 | 16 | 10 | +$476k one wallet + **free trial in the same tweet** · DOWN 76 then ATH | 1.4k / 1 | Receipt + trial CTA |
| Sep 5 | 8 | 4 | +60.24u in 7 days · “if you joined this week the year is already paid. Raise your hand.” | 2.6k / 5 | Proof + social proof |
| Sep 7 | 11 | 4 | +60u MLB · Who’s with us? · Completely broken the MLB | 8.6k+6.6k / 8+21 | Comment-bait proof |
| Sep 9 | 11 | 4 | 10-day green streak ends 4-5 −1.6u · still “up nearly 100u in 30 days” | 4.0k / 5 | Honest L, month still green |
| Aug 2 | 2 | 2 | 82.8% WR / +82u · self-reply **$5.35/week** + SUMMER | **11.9k** / 4 | Highest reach, **weak convert** |
| Sep 13 | 6 | 1 | Member hole→+$1,926 story · buried MVP25 self-reply at 296 impressions | 1.5k+0.3k / 2+1 | Promo under the fold |

---

## Write this

1. **Hard number, then a fork.** `+60u in 7 days` / `broken the MLB +125u` / `$476k one wallet` — then “who’s with us,” “raise your hand,” or “comment so people know this isn’t fake.” Sep 7’s comment-bait is the reply champion (21 replies, 33 likes).
2. **Seats, not a storefront.** Aug 3 “looking for 5ish bettors, $5 or $10 units” (12 replies) plus next-day ONTHEHOUSE “10 more seats / 5+ days free / 50% off / direct help from me” is still the **biggest single t.co day (7)**.
3. **Trial in the hero, not the 270-imp reply.** Aug 27 put “Free trial — watch sharps like this live and grade it yourself” in the `$476k` post. SUMMER lived in a self-reply that actually got seen because the **parent converted**.
4. **Member receipts.** Camden, Jam Kam, “he found us after two losing months.” Fence-sitter DMs (“5+ day free.. just give it a shot”) close people **already in the thread**.
5. **An honest red day is fine if the 30-day number is still green.** Sep 9 still did 11 trials.

## Skip this

1. **Price as the punchline.** Aug 2’s 82.8% / +82u quote got 11,888 impressions — more than any converting post — and **2 t.co trials**. The self-reply was `$5.35/week`. Jul 10 “you’ll spend more on lunch” (`$5.35`, SUMMER) ran before `trial_started` even existed in GA.
2. **How-to lock-alert threads** and “first week is free” self-replies at 270–400 impressions. People do not click a product manual.
3. **A code with no heat.** Sep 13 MVP25 under a good member story: 296 impressions, 1 t.co trial. The story itself did fine (1,491 imp); the ask was invisible.
4. **Ticket-slip reach alone.** BetMGM most-bet quotes and `$79.5k` NFL totals get 4–6k impressions. They help the week only when a **proof/invite post is also up**.

---

## Ask law (this overlay — pathway)

| Move | Verdict |
|------|---------|
| Convert **paragraph** as line 1 (grind-EV / tired-of-losing / `$5.35/week` / lunch) | **Dead.** Attention and trials. |
| Promo code / “first week is free” as a 270–400 imp self-reply | **Dead.** Invisible. |
| Hard number in line 1, **fork in the same tweet** (raise your hand / who’s with us / comment / “free trial — watch and grade it yourself”) | **Converts.** |
| Seats + direct help (ONTHEHOUSE family) | **Converts.** Biggest single t.co day. |
| Link / `?ref=` in the hero | **Broken.** Do not use as measurement. URL-in-hero still ≈ 0–1 clicks on the content CSV. Invite is **words**, not a tracking URL. |
| Trial link in a self-reply | Only if the **parent already converted**. SUMMER under `$476k` got seen. MVP25 under the member story did not. |
| Fence-sitter DM in the thread | Close, not a hero. |

**Do not flip the desk to price-forward heroes.** Convert-as-open still dies. Proof-as-open + invite-as-close **in one tweet** is the ask shape.

---

## Operator note

- Overlay ≠ causality. Do not write “this tweet caused N trials.”
- Stripe return ≠ a channel.
- Content CSV still ranks hooks for **attention**. This file ranks wording families for **trials**. Both bind. When they conflict (Aug 2 high reach / low trials · Sep 9 mid eng / 11 trials), **trials win the ask decision; attention still wins the give-hook decision.**
