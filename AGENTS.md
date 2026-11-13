# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
NHL Savant is a static analytics web app (React 19 + Vite). The product is the
frontend single-page app. The repo also contains a Firebase Cloud Functions
backend (`functions/`, Stripe payments) and a large set of one-off data/analysis
Node scripts (`scripts/`); these are auxiliary and not required to run the web app.

### Running / building / testing the web app
Standard scripts live in `package.json`:
- Dev server: `npm run dev` (Vite, serves on port `5173`). In the cloud VM run it
  as `npm run dev -- --host 0.0.0.0 --no-open` (the default config has `open: true`,
  which has no browser in the VM).
- Build: `npm run build` (outputs `dist/`).
- Lint: `npm run lint` (ESLint).

### Non-obvious gotchas
- **`.env` is required for the app to boot.** `src/firebase/config.js` calls
  `initializeApp` with `VITE_FIREBASE_*` values read from `import.meta.env`. With no
  `.env`, the app renders a blank/error screen. `.env` is gitignored, so it is NOT
  in the repo. The update script creates a placeholder `.env` if one is missing so
  the dev server boots. These placeholder Firebase values are enough to render the
  core analytics UI; replace them with real Firebase credentials only if you need
  live Firestore/Auth-backed features (e.g. the Performance page, account/login).
- **Firestore/Auth-backed views won't fully populate with placeholder credentials.**
  The Performance page may stay in a loading state and login won't work — this is
  expected without real Firebase creds and does not indicate the dev setup is broken.
- **App uses `HashRouter`**, so routes are under `/#/...` (e.g. `/#/methodology`).
  An initial 3D splash / onboarding modal appears on first load; dismiss it to reach
  the dashboard.
- **`npm run lint` reports thousands of pre-existing errors**, mostly in `scripts/`
  (Node files linted with browser globals) — this is the repo's existing state, not
  something introduced by setup.
- The `functions/` backend and `scripts/*` data jobs need external credentials
  (Firebase Admin service account, odds/Stripe/Perplexity API keys) and are not part
  of the local web-app dev loop.
