# The Algorithm × Psychology Playbook

> Ground truth from X's open-sourced For You algorithm (github.com/xai-org/x-algorithm,
> read 2026-07-06 — the actual production Rust in `home-mixer/scorers/weighted_scorer.rs`),
> fused with the psychology that moves each scored action. The Twitter Loop reads
> this in Phase 3; every hero is checked against it before it ships.

## How the feed actually works (no more guessing)

A Grok-based transformer reads each viewer's engagement history and predicts,
for every candidate post, the probability of ~19 actions. The final score is a
weighted sum — positive weights for engagement actions, **negative weights for
not_interested / block / mute / report**. Key structural facts:

- **No hand-engineered features.** The model learns purely from engagement
  sequences. There is no keyword bonus, no format bonus — only "will THIS user
  do one of the scored actions to THIS post."
- **Out-of-network discovery is embedding similarity** (two-tower retrieval):
  we get shown to non-followers whose engagement history looks like our
  engagers'. **Topical consistency is therefore a distribution strategy** —
  every off-niche post blurs our embedding and mismatches us to the wrong pool.
- **Author diversity scorer attenuates repeated authors** — burst-posting
  makes each successive post worth less in followers' feeds. Space posts hours
  apart (supports the G7 cadence, kills the "post 5 things at once" instinct).
- **Candidate isolation:** our score never depends on what else is in the
  batch. There's no slot luck — the post either earns actions or it doesn't.
- **Filters to respect:** already-seen posts are filtered (never repost the
  same content), old posts age out (freshness), and grox runs spam/category
  classifiers (link-stuffing and engagement-bait patterns are classifier food).

## The scored actions → our lever → the psychology

| Scored action | What earns it | Psychology principle |
|---|---|---|
| P(reply), P(quote) | A close that people MUST answer; taking a side | **Identity signaling** — people reply to show their tribe who they are. The USA/Belgium moral question works because answering it says something about the answerer, not about us. |
| P(favorite) | Relatable emotion, agreement | **Self-recognition** — "that's so me." The confession beats the flex. |
| P(repost), P(share) | One line worth showing others | **Social currency** — people share what makes THEM look smart/funny/insider. The RT line must transfer status to the sharer. |
| P(share_via_dm) | "Send this to your degenerate friend" content | **In-group gifting** — group-chat-worthy beats timeline-worthy. A wild verified stat or a perfect one-liner gets DM'd. Underused lever for us. |
| P(click), P(dwell), dwell_time | Fold engineering; a story that holds | **Curiosity gap + Zeigarnik effect** — opened loops demand closing. "Show more" taps and read-time are both scored. Long posts that HOLD attention literally outrank short ones that don't. |
| P(photo_expand) | The attached screenshot | **Information scent** — the screenshot must look like it CONTAINS the answer (visible tier/units/consensus, slightly too small to read without tapping). An expand is a scored action — design for the tap. |
| P(profile_click) | Replies/QTs under big accounts with our data edge | **Curiosity about the speaker** — say something only we could know, sign it with confidence, don't explain. The click is them asking "who IS this?" |
| P(follow_author) | The account being a STORY they need the next episode of | **Parasocial serialization + Zeigarnik** — open loops across days (a graded shot, a running streak, a flip promised) make following the only way to see the ending. This is a DIRECTLY scored action: posts designed to convert followers are literally rewarded by the ranker. |
| P(not_interested) NEGATIVE | Off-niche content, repetitive templates | Boredom is a ranked signal against us. |
| P(block/mute/report) NEGATIVE | Rage-bait, dunking on people, spam patterns | **Polarize the QUESTION, never attack the PERSON.** A moral dilemma splits the room safely; a dunk gets us muted by the target's fans. This is why "tease the moment, not the man" is algo law, not just manners. |

## The psychological stack for a 10/10 post (in order of operation)

1. **Stop the scroll** — pattern interrupt in line 1 (specific number + unexpected stance). Specificity beats superlatives: "8 of the 14" > "most".
2. **Open the loop** — the fold hides the payoff (dwell + click).
3. **Make it about THEM** — a question the reader answers to express identity (reply/quote).
4. **Give them a gift** — one line that makes the sharer look good (repost/DM).
5. **Be a person mid-story** — unresolved stakes, a promise to return ("I'll post the flip") (follow).
6. **Prove, don't claim** — verified numbers + the screenshot (trust → photo_expand → site visit).
7. **Never trigger the negatives** — no dunks, no rage-bait, no off-niche, no template fatigue, no link/hashtag spam patterns.

## Standing checks (Phase 3 enforces on every hero)

- **Action targeting:** name the 2–3 scored actions this post is built to win
  (e.g. reply + follow_author + photo_expand) in the draft JSON (`algoActions`).
- **Negative-signal audit:** one sentence on why this post won't earn
  mute/not_interested from either tribe it engages.
- **Follow-conversion beat:** does something in this post make following
  NECESSARY (an unresolved loop, a promised grade, a next episode)? If not, add it.
- **Embedding discipline:** is this in-lane (sports betting / sharp money)?
  Off-niche posts pollute retrieval matching — don't.
- **Spacing:** ≥2–3 hours from our previous post (author diversity attenuation).
