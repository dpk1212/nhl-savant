# Brand Messaging Kit — @Real_NHL_Savant / nhlsavant.com

> The single source of truth for how we describe ourselves — bio, pinned tweet,
> tweet framing lines, funnel language. The Twitter Loop reads this every run
> (G2). If the messaging here changes, it changes everywhere.
> Last tightened: 2026-07-06 (v2 — de-AI'd the tone).

## The tone rule (read this first)

We are a **quality brand**: understated, precise, confident enough that we
don't need to perform. The AI tells to kill on sight:

- **Fragment-stack swagger** — "Every pick graded. Every L public. That's the
  brand." Chopped two-word punch sentences reeking of a hype account. Write
  complete, calm sentences instead.
- **Self-conscious mantras** — "The Ls stay up." / "A tracker with receipts."
  Slogans that sound like they were written to be quoted. If a line is trying
  to be a tagline, cut it.
- **Over-parallel structure** — three matched clauses in a row is template
  smell. Humans vary their rhythm.

The test: **would a sharp, successful friend explain it this way over dinner?**
He'd say "the whole record's on the site, losses included" — he would never
say "Every L public." One understated line beats three punchy ones. Say it
once, plainly, and move on.

## Positioning (the one sentence)

**We track a small group of bettors who beat the market year after year, and
we post where their money goes — before the games start, every day.**

Not a capper. Not a model selling vibes. The differentiators, in order:
1. The MECHANISM — real winning bettors' money, followed in real time.
2. The PROOF — everything posted before lock and graded after, losses included.
3. The PRODUCT — the live board on the site. Twitter is the trailer; the site is the movie.

## The offer (funnel truth — from Pricing.jsx)

| Tier | Price | Trial |
|------|-------|-------|
| Scout | $7.99/wk | 5-day free trial |
| Elite (popular) | $25.99/mo | 7-day free trial |
| Savant Pro | $150/yr | 10-day free trial |

**Every tier has a free trial → the canonical soft ask: "the first week is
free — watch and grade it yourself."** Never quote prices in tweets; never say
"subscribe" or "sign up." The offer is framed as *see for yourself*, never *buy*.

## Bio (X profile)

**Recommended:**
```
We track a small group of bettors who beat the market year after year, and post where their money goes. Full graded record on the site — losses included.
```

Rules for the bio:
- NO hard-coded sport list (it dates instantly; the pinned tweet carries what's in season).
- NO unit counts or records (they rot; numbers live in the pin, refreshed weekly).
- Complete sentences. No slogans.
- Name field stays searchable: `NHL Savant`.
- Website field: `nhlsavant.com/?ref=bio` (attribution).

## Pinned tweet (the "start here" asset — refresh WEEKLY with current numbers)

Template (numbers from `scripts/socialRecords.mjs` only, + full tracker screenshot):
```
Quick intro, since a lot of you found us recently.

We don't handicap games. We track a small group of bettors who beat the market year after year, and we post where their money goes — before the games start, every day.

Since June 1 we're [record], up [X] units. The full graded history is on the site, losses included.

Worth knowing: sharp money moves all day, so the live board is always ahead of any tweet. Picks lock 15 minutes before start.

If you want to test us, the first week is free. Watch and grade it yourself.
```
Self-reply on the pin: `nhlsavant.com/?ref=pin`

## Phrase bank (natural shapes, not slogans — vary the wording around these ideas)

- **Mechanism:** "we track bettors who actually win, and follow their money" / "the winning wallets we track"
- **Proof:** "the whole record is on the site, losses included" / "we posted it before lock — go check"
- **Freshness (G4 — live-read framing, never legalese):** timestamp the read ("As of noon"), call it a lean not a pick until lock, and own the flip in advance: "if the money moves this afternoon, our board moves with it, and I'll post the update. Nothing locks until 15 minutes before start." If a lean flips, post the flip proudly — that's the product working, not us waffling.
- **Offer (G2):** "the first week is free — watch and grade it yourself" / "test us for a week before you believe anything"
- **Identity (use sparingly, max one per post):** "we bet the number, not the logo" — the ONE aphorism we keep, because it's a real bettors' saying, not something we invented to sound cool.
- **New-follower beat (~1x/day):** one plain mechanism sentence so a first-time reader knows what this is.

## Screenshot pairing (user attaches a site screenshot to EVERY tweet)

Every draft names WHICH screenshot to attach — the image should prove the
tweet's claim and quietly advertise the site:
- **Pick post** → the live pick card (tier, units, sharp consensus visible).
- **Recap / record flex** → the AGS-U dashboard record view (filters set to the window being flexed).
- **Whale/sharp story** → the sharp-flow / wallet view behind the claim.
- **Pinned tweet** → the full tracker board (the money shot).
The screenshot does the selling so the words don't have to.

## Never say

- "Sign up now" / "subscribe" / "link in bio" / prices / "🔒 premium".
- "The Ls stay up" / "receipts" / "that's the brand" / "that's the whole pitch" — retired 7/6 as AI-swagger tells.
- "Lock of the day/year", "can't lose", "guaranteed", parlay content.
- Sport lists that are out of season. Precise wallet $/ROI figures (directional only).
- Anything a tout would say — and anything that sounds like it WANTS to be screenshotted. Understatement is the flex.
