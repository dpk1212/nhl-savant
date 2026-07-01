# Twitter Improvement Guide — 2026-07-01

> The single biggest lever this week is to turn every pick-first post into a public-vs-sharp market board before naming the bet; labeled data is tiny, but the weak posts all miss that structure.

## The one thing that matters this week
Stop treating the pick as the opener; make the opener the market map.
Last week's hot-hand/live-card advice did get applied in the writer drafts, but post `2072083386584203447` still led with "one of these dogs" and only earned 1 labeled like.
This beats last week's advice because @PatrickE_Vegas-style `sharp_public_board` posts give people a reason to repost the read, not just react to whether the pick won.
Stop spending the first two lines on suspense, streak flexes, or "calling my shot" unless the next block shows public money versus sharp money.

## How we're actually performing (truth layer)
- n=5 of 21 posts have real likes/RTs — directional only
- Data rule followed: performance claims below use labeledEngagement only
- Avg likes: 4 · total RTs: 0 · 0-like count: 0
- Best labeled post: `2072054188683694469`, `recap_checkmarks`, 8 likes — it opened with conflict, then receipts, then a stale-screen warning
- Why it worked structurally: the hook created tension before the proof stack
- Worst labeled post: no 0-like labeled post; floor is `2072083386584203447` and `2071408949979464073` at 1 like each
- Why the floor failed structurally: both posts ask readers to care before showing the market evidence
- Format leaderboard: `recap_checkmarks` 7 avg likes (n=2) · `other` 2.5 (n=2) · `record_plus_picks` 1 (n=1)
- Unlabeled formats stay unranked: `sharp_public_board`, `pick_with_proof`, `pick_card`, and `product_reveal` have no current labeled likes/RTs
- Diagnosis: the sample is too small for certainty, but every bottom labeled post is missing the sharp/public split
- Did last week's advice move anything? Partly: recent `ready_to_post` drafts used Brazil/Germany live-card mechanics and binary closes
- What did not move: labeled reposts are still 0, and the weak dog post stayed pick-first instead of board-first
- Writer adoption check: the 2026-06-29 and 2026-06-30 drafts followed the live-card advice, but not the current `formatMatchups` board split

## What the niche does better (steal the structure)
### sharp_public_board — @PatrickE_Vegas
- Line 1 job · Name the slate and promise "where the sharps/public are"
- Proof block · Side-by-side public %, sharp $, line move, and notable sharp action
- Close job · One verdict line about which side the market is mispricing
- Our gap: `formatMatchups` says Dale's comparable post `2069897190915600661` became a long single-tweet wall instead of hook + board + verdict
- Same lane signal: @invisiblestats also wins with "Public vs Sharps" first, then bullets for bets, dollars, books, and move
- Steal this: every proof line should answer either "where is the public?" or "where did the market move?"

### pick_card — @AlexCaruso
- Line 1 job · Label the card/recap immediately so the reader knows the job
- Proof block · Compact results or numbers, not a paragraph explaining the model
- Close job · Question or next-action after the proof is visible
- Our gap: `2072083386584203447` mixed a dog choice, monthly record, pending plays, and verdict; the proof never became a clean card
- Steal this: if a post is a card, make the card visible before the commentary
- Do not steal: generic recap virality outside our lane; the useful part is compact proof order

## Current X growth tactics (from web research)
- **Optimize for action heads, not likes** — source xAI `x-algorithm`, May 2026 open-source release.
  Maps to gap: 0 total reposts in labeled sample.
  How we apply it to betting content: make line 1 a quotable market read, then close with a verdict question tied to the split.
- **Create dwell with scannable native proof** — source RankSaga/VoiceMoat technical reads of Phoenix, 2026.
  Maps to gap: `2069897190915600661` was a long wall.
  How we apply it: cap the hero at Line 1 / public side / sharp side / line move / verdict; put deeper wallet tape in replies.
- **Reply fast to real comments after publishing** — source Buffer X algorithm guide, 2026.
  Maps to gap: last week's drafts planned companion replies but not a response protocol.
  How we apply it: for the first 30 minutes, answer any tail/fade reply with one extra receipt, not a generic thanks.
- **Keep links out of the hero when distribution matters** — source Towards AI analysis of the 2026 X open-source release.
  Maps to gap: older writer drafts put site CTAs inside the hero.
  How we apply it: hero is native market read only; link or screenshot receipt goes in the first self-reply.
- **Use specific numbers in the first two lines** — source `growth_tips.json` and Quip 2026 operator playbook, 2026.
  Maps to gap: "one of these dogs" is too vague.
  How we apply it: lead with "public X%, sharp Y%, line moved Z" before the team name.

## Before → After (2 rewrites)
- Post ID `2072083386584203447` (1 like) — current hook: "One of these dogs is getting there tonight."
- Problem: pick-first suspense with no visible market split; the proof arrives as a tier record instead of a board
- After: Line 1 / "Tonight's dog board is not about team names; it's where the public and sharp money split."
- After: Proof / public side %, sharp side %, line move, 17-10 tier record
- After: Close / "Verdict: take the side the market moved toward, not the logo the crowd likes."

- Post ID `2071408949979464073` (1 like) — current hook: "Went 6-3 today... This one was one of the 3... nobody likes this team"
- Problem: honesty is there, but no market evidence tells readers why the ugly side deserved the bet
- After: Line 1 / "We went 6-3, and the ugly loss was the exact kind of side sharps still bet."
- After: Proof / closing number, public fade, sharp money for, what we would bet again
- After: Close / "Verdict: bad result, good process, same trigger stays on the board."

## This week's ONE experiment
Switch from the top `format_double_down` recommendation to `sharp_public_board_test` because recap_checkmarks already proved likes, while reach still needs market-map repostability.
- Hypothesis · Market-map openers outperform pick-first cards because they give followers a screenshot-ready reason before the bet
- Test protocol · Publish one hero using `sharp_public_board`: line 1 names slate + split, body shows public % vs sharp $ + line move, close gives one verdict
- Baseline · 4 avg likes across labeled sample; 0 total RTs; 29% of current posts use this shape
- Success metric · Beats 4 likes and earns at least 1 repost or quote
- Fail signal · Under 3 likes with no replies, or replies ask "why" because the split was not clear
- Measurement note · Judge only the next labeled scrape; do not use view-ish or unlabeled numbers

## Mandates for the Content Brief agent (max 5)
- For every pick post, open with the sharp/public split before naming the pick; trace: @PatrickE_Vegas `sharp_public_board`
- Rewrite any "one of these dogs" or "nobody likes this team" hook into a named market board; trace: `2072083386584203447`, `2071408949979464073`
- Keep the proof block to four slots max: public side, sharp side, line move, record/grade; trace: `2069897190915600661` wall gap
- If using recap_checkmarks, keep the conflict opener from `2072054188683694469` and add one market-read verdict line
- Put external links and deep wallet receipts in the first reply, not the hero; trace: older ready_to_post link CTAs and 2026 X native-content guidance

## Stop list (max 4)
- Pick-first dog suspense with no public/sharp split
- Long single-tweet proof walls that hide the verdict
- Vague proof phrases like "smart money likes it" when the board has percentages or line movement
- Generic tail/fade closes that are not tied to a specific market disagreement
