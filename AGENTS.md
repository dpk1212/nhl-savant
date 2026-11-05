# AGENTS.md

## Cursor Cloud specific instructions

### Deploy / gh-pages

Never manual-deploy a Vite build that used the dummy workspace `.env` Firebase keys (`AIzaSyDummyKeyForLocalDev…`). That breaks live Sharp Flow (invalid API key → stuck on “Loading Sharp Flow…”).

- Prefer waiting for the market-data cycle Pages deploy, or `workflow_dispatch` on `deploy.yml` (secrets).
- For a local/manual Pages push: build with real `VITE_FIREBASE_*` (+ Stripe) via `.env.production.local` or env exports matching production, then push `dist` → `gh-pages`.
- Before calling it live: confirm the served `index-*.js` has a real `nhl-savant` Firebase `apiKey`, not `DummyKey`.

### Testing / walkthroughs

Do not run `computerUse`, screen recordings, or lab preview walkthroughs unless Dale asks. Use terminal / live-bundle checks for ship verification.
