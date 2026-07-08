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

5. **REPLY-FIRST DISTRIBUTION.** Out-of-network reach is the only path from
   2K to 10K. Every run: answer every inbound mention (inbound beats
   outbound — the asker is already engaged), and when a relevant event is
   live, land 1-3 substantive replies on high-velocity posts in-niche
   within their first 30 minutes.

---

## THE LOOP (every run, in order)

**PULL** (MCP `user-xapi` — credits are pay-per-use, be surgical):
- `get_users_me` (user.fields=public_metrics) — follower count → delta vs
  last run (logged below).
- `get_users_posts` (id=1991513001204281345, exclude=replies,
  post.fields=created_at,public_metrics,non_public_metrics, max~15) —
  grade recent posts: impressions, engagements, profile clicks, link
  clicks. This is also the anti-duplicate corpus (Rule 3).
- `get_users_mentions` — the inbox. Answer first.
- `search_posts_all` or recent search (sort_order=recency) on tonight's
  event — reply targets + what formats are winning right now.
- `get_trends_by_woeid` (23424977 = US) — only when hunting a hook for a
  mainstream-moment post.

**READ** (repo, free): tonight's board — `public/sharp_positions.json`
(+ spread/total variants), `public/pinnacle_history.json`, the site's
pick data. The receipts live here: per-wallet invested $, records, ROI,
sizing multiples, pool percentages.

**DECIDE**: one job for the next post — reach, convert, or retain — and
one moment. The measured best moment is the decision window: locked pick,
minutes before start. Recaps with no live moment measured 0.3-0.6x; skip
them or fuse them into a live pick (a fresh win is a hook, not a post).

**DRAFT**: 3 genuinely different angles. Kill anything whose hook shape
appears in the last 10 real posts. Apply Rules 2 and 4. Ship one.

**MEASURE**: the next run's PULL grades it. One line in the log below —
what was predicted, what happened, what changes. Prune the log to ~15
lines; old lessons either graduate into the Five Rules or die.

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

## LESSON LOG (max ~15 lines, prune every run)
- 7/7: v1's gates passed a hook that duplicated the live timeline 90 min
  prior. Root cause: compared drafts to drafts. Fix: Rule 1 + Rule 3.
- 7/7: ELITE-passing draft was still a skeleton (bare receipts, no ROI/
  model score/payout). Fix: Rule 4.
- 7/7: pinned tweet was 105 days old with 54K impressions — every profile
  click from a hot post landed on stale proof. Refresh pinned monthly.
