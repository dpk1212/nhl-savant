# THE TWITTER LOOP v2 — MCP-first, judgment over gates

GOAL: 10,000 followers · 1,000 subscribers.
BASELINE (7/7/26): 2,015 followers · median post ~1.5-2K impressions ·
best posts 4.2-4.4K · zero recorded link clicks · 0-3 replies per post.

The v1 system (gutted 7/7) died from rule accumulation: linters, gates,
taste files, ledgers — and it still shipped a duplicate hook 90 minutes
apart, because it compared drafts to drafts instead of to the real
timeline. v2 keeps memory in the API. Nothing in this file is a cached
"fact" that can go stale; every run re-derives state from live pulls.

---

## THE FIVE RULES (all of them — resist adding more)

1. **LIVE DATA OR NOTHING.** Every run starts with MCP pulls (see THE LOOP).
   Never draft from memory of what was posted — pull the real timeline and
   read the real hooks verbatim. Every number in a tweet must come from a
   file or API read made THIS run.

2. **THE BEAT-THE-BOARD TEST.** A draft ships only if, placed on a screen
   next to (a) our last 10 real posted tweets and (b) 2-3 current top
   performers in the niche pulled this run, it would visibly be the best
   thing there. This is a judgment call made fresh every time. No scores.
   If it doesn't clearly win, iterate or don't post.

3. **NO HOOK SHAPE REPEATS WITHIN 10 POSTS.** Checked against the real
   timeline pull, not against drafts. "I've been tracking 500 wallets..."
   twice in one day is how v1 died.

4. **USE EVERYTHING YOU HAVE.** A post that passes every structural check
   can still be a skeleton. Before shipping ask: did I use every verified
   data point available (records + ROI + sizing + model score + payout
   math), or the minimum that looks acceptable? Substance is the moat —
   nobody else has wallet-level receipts.

5. **DISTRIBUTION IS HALF THE JOB (raised 7/9).** Heroes alone will not
   get us to 10K. Measured on our own account (7/7–7/8):
   - Inbound reply to our mention: ~30–60 impressions
   - Outbound reply on @BookitWithTrent (87K–445K parent posts):
     **936 and 1,130 impressions** — matching a weekday hero
   Out-of-network replies are the growth engine. Every run ships BOTH a
   content deliverable AND a distribution deliverable (see ENGINE below).
   More empty volume is not the answer; more *high-velocity, high-substance*
   replies/QTs is.

6. **LOCK DISCIPLINE (added 7/9).** Never tweet a play as locked / "here's
   the pick" before the site's 15-min lock window. Pre-lock: "on the board /
   check the site" only — no odds, no units, no "locked." Post-lock: full
   receipt stack is fair game. Cause: plays get muted/unstaked after we
   tweet them, or users see a pre-lock lean that later disappears — both
   destroy trust. If a mention asks "what happened to X on the site?",
   answer honestly: it fell off / got muted before lock. Never invent a
   grade for a play that never locked.

---

## THE LOOP (every run, in order)

**PULL** (MCP `user-xapi` — credits are pay-per-use, be surgical):
- `get_users_me` (user.fields=public_metrics) — follower count → delta vs
  last run (logged below).
- `get_users_posts` (id=1991513001204281345, exclude=replies,
  post.fields=created_at,public_metrics,non_public_metrics, max~15) —
  grade recent HERO posts: impressions, engagements, profile clicks, link
  clicks. This is also the anti-duplicate corpus (Rule 3).
- `get_users_posts` AGAIN (same id, **do NOT exclude replies**,
  expansions=referenced_tweets.id,in_reply_to_user_id,
  post.fields=created_at,public_metrics,referenced_tweets,
  in_reply_to_user_id, max~20) — OUR outbound replies. Process them:
  which mentions did we already answer? which need a follow-up? did we
  promise a grade / lock / DM that is still owed? Never draft a reply
  that duplicates one we already sent.
- `get_users_mentions` — the inbox. Cross-check against our replies pull
  before drafting answers. Answer unanswered inbound first.
- **DISTRIBUTION HUNT** (mandatory every run — see ENGINE):
  `search_posts_all` / recent search, sort_order=recency, on tonight's
  event + 1-2 niche accounts' fresh posts. Rank by parent velocity
  (impressions + replies in first ~30–60 min). Pull 3–5 candidates.
- `get_trends_by_woeid` (23424977 = US) — only when hunting a hook for a
  mainstream-moment post.

**READ** (repo, free): tonight's board — `public/sharp_positions.json`
(+ spread/total variants), `public/pinnacle_history.json`, the site's
pick data. The receipts live here: per-wallet invested $, records, ROI,
sizing multiples, pool percentages.

**DECIDE**: two jobs every run —
1. CONTENT: one hero job (reach / convert / retain) + one moment
2. DISTRIBUTION: which 2–4 out-of-network replies/QTs to ship (ENGINE)

The measured best content moment is the decision window: locked pick,
minutes before start. Recaps with no live moment measured 0.3-0.6x; skip
them or fuse them into a live pick (a fresh win is a hook, not a post).

**DRAFT**: 3 genuinely different hero angles + copy-paste ready
distribution replies (ENGINE). Kill anything whose hook shape appears in
the last 10 real posts. Apply Rules 2 and 4 and the ARSENAL. Ship both.

**SAVE DRAFTS (mandatory end of every run that produces copy):**
We HAVE `tweet.write` (can publish live via `xurl post`). We do NOT have
an API into X's Drafts folder — that folder ≠ `tweet.write` (see
`X_API.md`). Default = stage, never auto-publish:
1. Write `twitter_drafts/inbox.json` (hero, self-reply, distribution,
   inbound — shape in `scripts/saveTwitterDrafts.mjs` header).
2. Run `node scripts/saveTwitterDrafts.mjs --file twitter_drafts/inbox.json`
3. Tell the owner the folder path + `compose_links.md` (one-tap pre-fill).
4. Only run `xurl post "..."` / `POST /2/tweets` when the owner explicitly
   says publish/post it — never as a silent end-of-run step.
Never leave copy only in chat.

**MEASURE**: the next run's PULL grades BOTH — hero impressions AND
outbound-reply impressions (profile clicks if available). One line in
the log. Prune to ~15 lines.

---

## THE DISTRIBUTION ENGINE (added 7/9 — this is how we get to 10K)

Heroes keep the tribe. Distribution grows the account. At 2K followers,
posting only into our own timeline is a closed loop. The algorithm pays
accounts that create conversations *on other people's posts*.

### Daily volume targets (quality floor, not spam)
| Slot | What | Count/day | Why |
|---|---|---|---|
| Hero / original | Locked pick, middle, milestone, receipt stack | 1–3 | Brand + convert |
| Self-reply | System explain / site / lock rules | 1 per hero | Funnel (link lives here) |
| Own-timeline QT | Pay off our earlier post (Zeigarnik) | 0–1 | Measured 1.8x |
| **Outbound reply** | High-velocity niche posts (first 30–60 min) | **3–6** | Growth engine |
| **Quote tweet** | Viral niche moment + our proprietary angle | **0–2** | Borrowed reach |
| Inbound reply | Mentions / questions | All of them | Retention + trust |
| Cold @-mention | Tagging big accounts unprompted | **0** | Looks needy; skip |

Total intentional outs: ~8–12/day. Not 40. Substance density stays high.

### Reply vs Quote vs Mention — when to use which
- **REPLY** (default growth move): land under a post that's already
  moving. Our reply rides their distribution. Best when we have a
  *specific* receipt/angle they don't. Target: posts <60 min old with
  rising reply count. Our Trent replies proved this (936 / 1,130 impr).
- **QUOTE TWEET**: when the parent is a moment (final score, viral take,
  public lean) and we add a *new* proprietary layer (wallet $ / middle /
  our locked card). QT puts us on *our* timeline AND theirs. Don't QT
  mid-tier takes — only moments.
- **@-MENTION in an original**: almost never. Tagging Trent/Wiz unprompted
  in our hero reads as hitchhiking. Exception: they asked, or we're
  answering them in a thread they started.
- **Self-QT of our own post**: keep — it's story continuation, not
  distribution. Different job.

### Target ladder (hunt these every run)
1. **Mega accounts, open prompts** — e.g. Trent "who wants to spoon feed
   me" / public lean asks. Highest ROI. Reply with receipts, not vibes.
2. **Niche leaders' live game posts** (<60 min): @PatrickE_Vegas,
   @WizBetz, @invisiblestats, @BookitWithTrent, @br_betting when relevant.
3. **Mid-size sharp accounts (5K–50K)** posting the same game we have
   locked data on — easier to get seen in a shorter thread.
4. **Viral score / highlight posts** (Barstool, team accounts) when our
   board just cashed or got wrecked on that game — costly-signal QT.

Search templates (recent, recency sort):
```
(MLB OR "moneyline" OR "sharp" OR "units") (bet OR pick OR lock) -is:retweet lang:en
from:BookitWithTrent -is:retweet
from:PatrickE_Vegas -is:retweet
```
Swap in tonight's teams once locked.

### The reply quality bar (non-negotiable)
A distribution reply must contain at least ONE of:
- a named wallet receipt or $ / % figure from our scan
- a verified record (W-L, units, ROI) tied to this side
- a real lock/grade fact from our board
- a precise disagreement with a number (not "fade this")

Kill: "lets go", "tailing", "thoughts?", emoji-only, "check my page",
any ask for a follow. If it could be posted by a random bettor, it dies.
The reply should make a stranger click our profile.

### Every run's DISTRIBUTION block (present to owner)
```
DISTRIBUTION (copy-paste):
1. REPLY → @user / post-id / ~X impr parent / why now
   [full reply text]
2. REPLY or QT → ...
3. ...
Inbound still owed: ...
Already answered (skip): ...
```
If the hunt finds nothing above the quality bar, say so and ship zero
outbound — empty replies are worse than silence.

### What NOT to optimize
- Raw tweet count. 40 thin posts/day trains the algo that we're noise.
- Ratio-following / engagement pods. Burns the brand.
- Replying to every mega account every hour. Diminishing + looks botty.
- Putting the site link in outbound replies. Profile click is the funnel;
  link in reply suppresses and looks spammy.

---

## THE ARSENAL — psychology that moves numbers, mapped to OUR content
Every draft must consciously deploy at least 3 of these. Name them when
presenting a draft ("this uses #1, #4, #9"). If you can't name them, the
draft is generic and dies.

1. **Information gap** (Loewenstein): the hook opens a loop the reader can
   only close by reading on — "one game made every wallet agree" forces
   "which game?" The gap must be SPECIFIC (a named unknown), not vague.
2. **High-arousal emotion** (Berger, *Contagious*): awe, surprise, anxiety,
   righteous anger get shared; contentment and sadness don't. Our natural
   arousal triggers: a whale betting 4.6x his average (surprise), a fortune
   moving quietly on a game nobody watches (conspiracy-tinged awe), the
   books getting beaten (righteous anger for the tribe).
3. **Odd-number specificity**: $15,706 is credible; $15K is marketing.
   145-125 is a real record; "winning record" is a claim. Precision is our
   costliest, least copyable signal — always the exact figure.
4. **Costly signal / anti-hero honesty**: posting losses, showing the -4u
   graded ❌, "losses included" — credibility bought with pain. One visible
   scar makes ten wins believable. (Lead green, but never hide red.)
5. **Tribal identity**: us = the small group who follow the wallets;
   them = the public, the books, the touts capping games on vibes. Every
   post should let a reader feel smarter than the crowd for following.
6. **Scarcity + deadline**: "locks 8:06 ET" is a real, non-manufactured
   deadline — the single strongest CTA we own. Countdown posts measured 2x
   baseline. Never fake urgency; the game clock provides it free.
7. **Zeigarnik effect** (unfinished stories nag): plant a prediction in the
   morning, pay it off at night with a QT — measured 1.8x. A graded pick is
   a story RESOLUTION; a locked pick is a story OPENING. Chain them.
8. **Character > data** (narrative transportation): "wallet f960" doing
   something anomalous is a character in a story; "89% of sharp money" is a
   statistic. People retell stories, not percentages. Receipts give both:
   the stat frames, the whale stars.
9. **Processing fluency**: one idea per line, short words, vertical
   escalation, the punch isolated on its own line. If line 1 doesn't read
   itself to a scroller in under a second, it's furniture.
10. **Concrete imagery** (*Made to Stick*): "while the burgers hit the
    grill, the sharps are already working" — a scene, not an abstraction.
    One concrete image per post maximum; more becomes purple.
11. **Reciprocity before the ask**: the pick, the receipts, the record —
    all given free in the post. The site link never begs; it lives in the
    self-reply, stated once as fact. Givers get profile clicks.
12. **Answerable controversy** (reply engine): close on a question a
    stranger can actually answer with an opinion ("Would you bet against
    the US at home?") — replies are the algorithm's currency. Never
    rhetorical questions; nobody replies to those.
13. **Authority stacking, one layer per claim**: the wallet's record, the
    model's score, the season's units — each claim gets exactly one
    authority attached. Unanchored claims read as touting; over-anchored
    reads as insecurity.

---

## WHAT THE DATA SAYS SO FAR (re-verify against PULL, don't trust blindly)

- Decision-window countdown ("Locked, 15 minutes to kickoff...") — best
  measured format, 4.2-4.3K impr, ~2x baseline.
- Story continuation / QT payoff of our own earlier post — 4.2K, 1.8x.
  Plant morning posts that can be paid off at night.
- Named wallet receipts (last-4 hex + $) are the proprietary format nobody
  can copy; anonymize to last-4 hex, never full addresses or display names.
- Negative-led hooks and pure recaps: 0.3-0.6x. Lead green, always.
- Link in tweet 1 kills reach; link clicks are ~zero anyway — the funnel is
  post → profile → bio → site. Profile clicks are the funnel metric.
- Replies are the algorithm's currency; posts closing on a genuinely
  answerable question earn them.

## FOLLOWER LOG
- 2026-07-07 8:15 PM: 2,015
- 2026-07-08 6:20 PM: 2,014 (flat — reach is the bottleneck; prioritize
  out-of-network: replies on high-velocity posts + shareable anomaly heroes)
- 2026-07-09 5:58 AM: 2,014 (still flat — middle + all-time chase is the
  shareable story today; pin refresh still owed)

## LESSON LOG (max ~15 lines, prune every run)
- 7/7: v1's gates passed a hook that duplicated the live timeline 90 min
  prior. Root cause: compared drafts to drafts. Fix: Rule 1 + Rule 3.
- 7/7: ELITE-passing draft was still a skeleton (bare receipts, no ROI/
  model score/payout). Fix: Rule 4.
- 7/7: pinned tweet was 105 days old with 54K impressions — every profile
  click from a hot post landed on stale proof. Refresh pinned monthly.
- 7/8: weekday MLB-only baseline is ~900-1,100 impr (WC soccer boost gone) —
  calibrate expectations to the slate, not to last week's peaks.
- 7/8: owner's "Late money changed this one" hook (early look → sharper
  close reversal) earned 3 replies — reversal/late-money is a keeper shape.
- 7/8: a warm lead ("tried to DM, won't go thru") sat 5+ hours — DMs are a
  funnel hole; check mentions for DM-intent every run and flag immediately.
- 7/9: LOCK DISCIPLINE became Rule 6 after mute/pre-lock visibility issues —
  never tweet a play as locked before the 15-min window; answer "what
  happened to X on the site?" with mute/fell-off honesty, never a fake grade.
- 7/9: Dodgers ML + Rockies +1.5 middle cashed (final 4-3) — both-sides
  precision is a shareable proprietary story; site users saw it live.
- 7/9: all-time chase is -12.12u from green; V12 era +58.82u since June 1
  after a May drawdown of 70+u — the comeback IS the brand story right now.
- 7/9: DISTRIBUTION ENGINE — our Trent outbound replies did 936 / 1,130
  impr vs inbound replies at 30–60. Out-of-network is the growth lever.
  Loop now requires a DISTRIBUTION block every run (3–6 quality replies/
  0–2 QTs/day). Cold @-mentions banned. Reply quality bar = proprietary
  data or it dies.
