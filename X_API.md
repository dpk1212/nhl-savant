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

## Write access vs Drafts (read this — easy to confuse)

Your OAuth token **does** include `tweet.write` (+ `media.write`, etc.).
That is real. It unlocks:

| Capability | Available with our token? | How |
|---|---|---|
| **Publish a post live** (`POST /2/tweets`) | YES | `xurl post "..."` or `xurl -X POST /2/tweets -d '{"text":"..."}'` |
| **Reply / quote / media** | YES | same endpoint + reply/quote/media fields |
| **Save into X's Drafts folder** (compose → Drafts) | **NO** | no consumer API for that folder |
| **Ads `draft_tweets`** | only with Ads API + ads account | different product |

So: we can post for you, or stage copy locally / via intent URLs.
We cannot silently drop text into the Drafts UI you open in the X app —
that folder is not on the pay-per-use Post API, scopes or not.

**Loop policy (safety):** never auto-publish without owner OK. Default =
save local drafts + compose links. Optional upgrade = `xurl post` only
when you explicitly say "post it" / "publish."

See `TWITTER.md` (SAVE DRAFTS) and `twitter_drafts/README.md`.
