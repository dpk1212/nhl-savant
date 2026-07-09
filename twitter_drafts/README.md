# Twitter drafts (local) — stage only, never auto-publish

## Every loop run
1. **Pulse first** (self-improvement):
   ```bash
   node scripts/growthPulse.mjs --save
   ```
   → `growth_pulse.json` with OVER/UNDER + `nextBet`

2. **Draft** against that pulse (`improvesOn` + `prediction` on each item)

3. **Save** (owner posts manually via compose links):
   ```bash
   node scripts/saveTwitterDrafts.mjs --file twitter_drafts/inbox.json
   ```
   → timestamped folder with `.txt` + `compose_links.md`

**Why not native X Drafts?** Consumer Drafts folder ≠ `tweet.write`.
We can publish live if asked; we stage by default.
