# A Twitter Research Report — 2026-06-27 6:54 PM ET · EVENING

> State of the account: ~2K followers, reach is fine (1.7K–2.5K/post) but **retweets are still ~0** — quotability is the one thing to fix. **Data freshness:** board scanned 6:35 PM ET, sharp tape scanned **6:52 PM ET** (live), timeline + niche + growth all re-pulled via Firecrawl this run. Growth corpus was just cleaned by a new English/relevance gate (dropped 15 foreign-fandom posts).

## Growth & trends (Phase 1)

**Viral hook shapes in our lane right now**
- **Obscure-game whale** (our top growth pick): six figures of sharp money on a game the public can't find — tonight $207K (79%) on Uzbekistan vs DR Congo. Curiosity gap + "we see what you don't" + whale tape in one line. Likeliest first retweet.
- **Sharp-vs-public market board** (@PatrickE_Vegas, six-figure engagement): name the game → public % vs sharp $ + line move → verdict. The single highest-engagement structure in our niche; we still under-post it.
- **"N bets Vegas likes" authority list** (@invisiblestats, @WizBetz "MLB Play of the Day"): clean scannable list — maps to our board if we open with a read, not a setup line.

**Tweet-construction tricks landing now (cleaned growth corpus, 41 posts)**
- **Bold-claim + "here's everything you need to know 🧵"** — @AlexFinn's algo thread (30K eng) makes a specific claim, then promises the payoff. Our version: "$207K just hit a game nobody's watching. Here's who's loading it 👇".
- **The growth-creator lane runs LONG** — 80% thread-shaped, ~2,288 avg chars, 51% emoji. When a play has depth, **thread it** (hook + reply) instead of a 6-line wall.
- **Volume + real voice** — @rachcorrine (15K eng): tweet more than feels comfortable, have an opinion, be a real person, reply/build community, keep 2–5 focus topics. Cadence is itself a lever.
- **Reach is throttled, not removed** — @GiveMeBanHammer (36K eng) on the 2026 algo: low-signal/over-posting gets deboosted; dense, high-signal posts get carried. Make every post earn its slot.

**Trends watchlist**
- Big sharp money on low-profile soccer: DR Congo ($207K, 79%, kicks ~7:30) and Argentina ($204K, 81%, ~10 PM). Mine these first — more novel than chalk on marquee games.
- Whale magnitude of the day: $2.77M poured onto one side of Ghana–Croatia (already in progress — context/recap only, not a live tail).

## How we're performing (Phase 2)

**Labeled stats (n = 5 of 20 — directional, not statistical; pulled live this run)**
- Avg likes **6.6**, retweets **~0**.
- **Best post:** `2070888202299174981` — *pick_with_proof* SUPER-lock explainer, **12 likes**.
- **Format leaderboard (avg likes):** pick_with_proof **12** · "other" **7.5** · pick_card **3** · sharp_public_board **3**.
- **Weakest:** `2070583160803619090` (*sharp_public_board*, 3) and `2070983093641511148` (*pick_card*, 3) — both buried the hook behind a setup line.

**What's working:** conviction + proof and human posts. **What's not:** zero retweets; bare card lists flop — today's 5:30 PM "Massive slate tonight" loaded-card post got just **3 likes**.

**The niche gap:** the sharp/public market-read board is the niche's best structure; our one attempt under-performed only because the opener buried the hook. Fix the opener, keep the format.

**Mandates this run:** lead with the dollar read; obscure-game whales first; one RT line every post; ≤3 proof slots (thread if deeper); reply within ~30 min with the lead wallet's rank/ROI; own the 0-1 only in the night recap.

**Stop list:** setup-line openers, soft "thoughts?" closes, 6+ proof-line walls, quoting settled/in-progress totals as if tailable.

## Loop maintenance done this run
- **Hardened `scripts/analyzeGrowthTips.mjs`**: added an English/relevance gate (`isEnglishAdvice`) + a fandom/foreign blocklist, and `lang:en` to every search query. The growth pull was returning Indonesian/Malay K-pop "AU/RP" fandom posts ("TIPS AMAN MAIN X", "reread AU lama") as "growth tips." The gate now drops ~15 noise posts/run; the corpus is real X-growth advice (algorithm, hooks, threads).
