# Twitter drafts (local)

Every loop run that produces copy should end with:

```bash
node scripts/saveTwitterDrafts.mjs --file twitter_drafts/inbox.json
```

That writes a timestamped folder with `.txt` copy + `compose_links.md`
(one-tap open in X with text pre-filled).

**Why not native X Drafts?** The consumer Drafts folder is not on the
pay-per-use X API our MCP uses. Official `draft_tweets` is Ads API only.
If we get an Ads account linked to @Real_NHL_Savant, we can upgrade this
script to POST drafts into X directly. Until then: files + intent URLs.
