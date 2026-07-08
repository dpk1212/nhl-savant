# X API ACCESS (the only surviving piece of the old Twitter loop)

Authenticated as **@Real_NHL_Savant** · user id `1991513001204281345`.

- **OAuth token**: cached in `~/.xurl` (auto-refreshes). Connected 7/6/2026.
- **MCP server**: `user-xapi` in Cursor — users/posts lookup, mentions,
  timelines, quoted-posts/reposters/likers, trends, news search.
  (Full-archive search is app-only-auth; use recent search instead.)
- **CLI bridge**: `npx -y @xdevplatform/xurl <path>` — e.g.:
  (alias below: `xurl` = `npx -y @xdevplatform/xurl`)
  - our timeline: `xurl "/2/users/1991513001204281345/tweets?max_results=15&tweet.fields=created_at,public_metrics&exclude=replies"`
  - mentions inbox: `xurl "/2/users/1991513001204281345/mentions"`
  - recent search: `xurl "/2/tweets/search/recent?query=...&sort_order=recency&max_results=10&tweet.fields=public_metrics,created_at&expansions=author_id"`

**Credits are pay-per-use — be surgical, not chatty.**

## Running from Cursor Cloud Agents (headless VMs)

Cloud runs start with no `~/.xurl`, so both the MCP server and the CLI fail
with `NoAuthMethod`. Setup (one-time, owner action):

1. On the logged-in machine: `base64 -i ~/.xurl | tr -d '\n'` (Linux:
   `base64 -w0 ~/.xurl`). The file holds the app's client id/secret plus the
   OAuth2 access+refresh tokens for @Real_NHL_Savant.
2. Cursor dashboard → Cloud Agents → Secrets → add a **Runtime Secret**
   named `XURL_TOKENS_B64` with that value, scoped to this repo.
3. In any cloud run: `bash scripts/restore_xurl.sh` rebuilds `~/.xurl`
   (mode 600) and prints `xurl auth status`. Tokens auto-refresh from there.
   To make it automatic, add that command to the environment's install/start
   script at cursor.com/dashboard → Cloud Agents → Environments.
4. Optional — restore the MCP tools in cloud runs: dashboard → Cloud Agents →
   MCP → add a stdio server: command `npx`, args
   `["-y","@xdevplatform/xurl","mcp","https://api.x.com/mcp"]`. It reuses the
   cached token from step 3 (repo `.cursor/mcp.json` is NOT read by cloud
   agents). The CLI bridge alone is enough to run the loop, though.

Everything else (loop docs, taste files, linters, ledgers, guardrails,
ready_to_post drafts) was gutted 7/7/2026 at the owner's direction after the
system produced a duplicate hook 90 minutes apart despite all its gates.
History is in git if anything ever needs recovering.
