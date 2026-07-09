# X API ACCESS (the only surviving piece of the old Twitter loop)

Authenticated as **@Real_NHL_Savant** · user id `1991513001204281345`.

- **OAuth token**: cached in `~/.xurl` (auto-refreshes). Connected 7/6/2026.
- **MCP server**: `user-xapi` in Cursor — users/posts lookup, mentions,
  timelines, quoted-posts/reposters/likers, trends, news search.
  (Full-archive search is app-only-auth; use recent search instead.)
- **CLI bridge**: `npx -y @xdevplatform/xurl <path>` — e.g.:
  - our timeline: `xurl "/2/users/1991513001204281345/tweets?max_results=15&tweet.fields=created_at,public_metrics&exclude=replies"`
  - mentions inbox: `xurl "/2/users/1991513001204281345/mentions"`
  - recent search: `xurl "/2/tweets/search/recent?query=...&sort_order=recency&max_results=10&tweet.fields=public_metrics,created_at&expansions=author_id"`

**Credits are pay-per-use — be surgical, not chatty.**

## Drafts (important limitation)
Native X "Drafts" (compose → Save draft) are **not** on this MCP. Official
`POST .../draft_tweets` is **Ads API only**. Our loop saves drafts locally
via `node scripts/saveTwitterDrafts.mjs` → `twitter_drafts/<run>/` with
one-tap `intent/tweet` compose links. Upgrade path: link an Ads account
to @Real_NHL_Savant, then POST to ads-api draft_tweets.

See `TWITTER.md` (SAVE DRAFTS step) and `twitter_drafts/README.md`.
