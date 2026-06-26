# Twitter Improvement Guide — 2026-06-26

> Biggest lever: turn the first line into a record-backed sharp/public board, because the tiny labeled sample says proof-first market maps beat pick-first chatter.

## The one thing that matters this week
Make every pick post answer "where is public money, where is sharp money, and what is Dale doing with it?" before the audience sees the pick.
This beats last week's market-map advice by adding a stricter package: post 2070280660439204220 had the best labeled result because the hook gave wallet size, profit context, and late-slate tension before the close.
Stop spending main-feed space on loose lock notes or record flexes unless they become a board with proof and a verdict.

## How we're actually performing (truth layer)
- n=4 of 21 posts have real likes/RTs from x.com - directional only
- Data rule: labeledScore = likes + 3*RTs; nitterViews and unlabeled engagement are not used here
- Avg likes / RTs / 0-like count: 3.3 likes · 0.0 RTs/post (0 total) · 0 labeled posts with 0 likes
- Best labeled post: 2070280660439204220, sharp_public_board, 6 likes - line 1 made the wallet's +$937K record and 24x sizing the story before the late-slate close
- Worst labeled post: 2070279882475511865, other, 1 like - no 0-like labeled post; it was a context-free lock note with no market map
- Format leaderboard, labeled counts only:
- 1) record_plus_picks - 5 avg likes, 0 RTs, n=1
- 2) sharp_public_board - 3.5 avg likes, 0 RTs, n=2
- 3) other - 1 avg like, 0 RTs, n=1
- Unranked for performance: product_reveal, pick_with_proof, record_flex_cta, pick_card, recap_checkmarks; these have no labeled likes/RTs this sample
- Diagnosis: Only 4 posts have labeled likes, so conclusions are directional, not statistical; best labeled format is record_plus_picks, but the top individual post uses a sharp_public_board shape Dale still underuses
- Did last week's advice move anything?
- Last week said to lead with sharp/public market maps instead of generic opinion or team-name openers.
- Some of that appeared in the labeled feed: both 2070280660439204220 and 2070583160803619090 are sharp_public_board posts.
- The split result matters: 2070280660439204220 earned 6 likes because the first line carried proof, while 2070583160803619090 earned 1 like because "Haaland isn't starting" buried the actual board.
- The only ready_to_post file available, 2026-06-23_comeback-discipline.json, applied older identity/quotable-line advice, not the new market-map mandate.

## What the niche does better (steal the structure)
### sharp_public_board — @PatrickE_Vegas
- Line 1 job · Proof block · Close job
- Line 1 job: name the game/slate and promise sharp vs public positioning
- Proof block: side-by-side public %, sharp money, line move, or notable sharp action bullets
- Close job: one verdict line on which side the market is wrong about
- Our gap (formatMatchups): post 2069897190915600661 had a sharp wallet hook but became a long single-tweet wall; the peer pattern makes the board scannable before the verdict.

### pick_card — @AlexCaruso
- Line 1 job · Proof block · Close job
- Line 1 job: label the board or recap instantly
- Proof block: stack visible picks/results, numbers, and honest misses
- Close job: question, lesson, or next-action after the board is complete
- Our gap (structuralGaps): post 2070279882475511865 says "we had these lock in a bit ago" without turning the locks into a board, receipt, or lesson.

## Current X growth tactics (from web research)
- **Make the hook classifiable in the first sentence** - source xai-org/x-algorithm README, May 2026; RankSaga technical read, May 18 2026. Maps to gap: weak first lines like 2070583160803619090 and lock-note post 2070279882475511865.
  How we apply it to betting content: line 1 must contain sport/slate + market tension + proof type, not just injury news or "we locked."
- **Build for dwell with a compact proof board** - source xAI weighted_scorer.rs / README, May 2026; scraped @javilopen growth post, May 16 2026. Maps to gap: formatMatchups says 2069897190915600661 is a long single-tweet wall.
  How we apply it to betting content: cap the main post at Public / Sharp / Move / Verdict; put only overflow proof in replies.
- **Make the post saveable before it is debatable** - source Metadata Reactor X content strategy, 2026 era. Maps to gap: no labeled reposts and peer boards are reference cards.
  How we apply it to betting content: every slate post should be a mini betting board someone can screenshot, not a disposable pick list.
- **Use early replies as evidence extensions, not chatter** - source Postory X algorithm 2026; scraped @langitluruh reply strategy post, Jun 2026. Maps to gap: closes ask vague questions while proof gets crammed into the main post.
  How we apply it to betting content: Dale's first reply should add one extra wallet, line-move, or public-money receipt tied to the board.

## Before → After (2 rewrites)
- Post ID 2070583160803619090 (1 like) — current hook
- "Haaland isn't starting. The sharp money was already gone."
- Problem (structural): injury-first hook; the market split and line beat arrive after the scroll decision.
- After: Line 1 / Proof / Close skeleton in Dale's voice (not a finished tweet)
- Line 1: "[France/Norway slate]: the public is reacting to Haaland, but the sharp money moved before the news."
- Proof: "Entry: [-155 -> -290] · Sharp wallets: [13 / $1.27M / 99%] · Public side: [where the crowd is now]"
- Close: "I'm not chasing the headline; I'm following the money that got there first."

- Post ID 2070279882475511865 (1 like) — current hook
- "we had these lock in a bit ago"
- Problem (structural): context-free lock note; no reason to save, share, or trust the card.
- After: Line 1 / Proof / Close skeleton in Dale's voice (not a finished tweet)
- Line 1: "[Late slate] already locked because the sharp window closed fast."
- Proof: "Play: [team/market] · Wallet: [size vs normal] · Move: [open -> current] · Public: [late/absent/on other side]"
- Close: "If you missed it, don't chase worse numbers; wait for the next board."

## This week's ONE experiment
Pick top recommendedExperiment: format_double_down, with the protocol corrected to match the actual winning structure.
- Hypothesis · Test protocol · Baseline · Success metric · Fail signal
- Hypothesis: record context earns trust, but the board structure earns the read; record_plus_picks should open like 2070280660439204220, not like a generic record flex.
- Test protocol: publish 3 record_plus_picks posts where line 1 is a sharp/public board, proof is exactly 3 evidence slots, and the close is Dale's verdict.
- Baseline: 3.3 avg likes (n=4).
- Success metric: at least 8 avg likes on the 3-test batch.
- Fail signal: below 3.3 avg likes and no replies/reposts on all 3.

## Mandates for the Content Brief agent (max 5)
- Open pick posts with the board before the pick: sport/slate + sharp side + public side; trace: @PatrickE_Vegas sharp_public_board and post 2070280660439204220.
- If the draft starts with injury news like 2070583160803619090, rewrite line 1 so the market move is the story and the news is support.
- Kill or rebuild context-free lock notes like 2070279882475511865 unless they include Play / Wallet / Move / Public / Verdict.
- Proof blocks get exactly 3 main-feed evidence slots; trace: formatMatchups gap on 2069897190915600661 and the sharp_public_board recipe.
- Recaps must label the board immediately and include one honest lesson after the results; trace: @AlexCaruso pick_card.

## Stop list (max 4)
- Stop "we locked these" posts with no board, receipt, or lesson: 2070279882475511865.
- Stop injury-first hooks when the actual edge is the pre-news money: 2070583160803619090.
- Stop pick-first record flexes that never reveal public vs sharp positioning: 2070108473480642731.
- Stop long single-tweet proof walls; use the @PatrickE_Vegas board order or move overflow proof to replies.
