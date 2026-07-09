# OneSignal Web Push — Paid Active Users Only

**App ID:** `d8fcb504-8d29-4354-a9e4-8b612d3eafeb`  
**Site origin:** `https://nhlsavant.com`  
**Who gets push:** paid active only — `tier` ∈ `scout|elite|pro` **and** `status` ∈ `active|trialing` (same as `useSubscription` → `isPremium`).

Brand colors: Primary `#10B981` · Secondary `#D4AF37`

---

## Repo (done)

| Piece | Behavior |
|---|---|
| `index.html` | SDK init · **autoPrompt: false** (no public prompt) |
| `public/OneSignalSDKWorker.js` | Service worker at site root |
| `public/manifest.json` | PWA manifest (`display: standalone`) for iOS home-screen push |
| `PaidPushGate.jsx` | Paid → sync External ID + tags only (no permission prompt) |
| `LockAlertsCard.jsx` | Account `#/account` — Enable / Turn off + iOS/Android directions |
| Tags | `paid`, `tier`, `status`, `email`, `lock_alerts` |

Free visitors and logged-out users never see a permission dialog. Paid users opt in from **Account → Lock Alerts**.

---

## Dashboard — finish BEFORE clicking "I've installed the SDK"

### 1. Site setup (Settings → Push & In-App → Web)
- Site Name: `NHL Savant` / Sharp Flow  
- Site URL: **`https://nhlsavant.com`** (exact)  
- Default Icon: 256×256 PNG  
- Auto Resubscribe: on  

### 2. Permission prompts — CRITICAL for paid-only
- Open the **Prompt Editor**
- Turn **Auto Prompt OFF** (and Save)
- Do **not** enable a site-wide Bell that shows to everyone  
- We trigger permission from code only (`PaidPushGate`)

### 3. Service worker
- Path: site root `/`  
- After deploy, this must return JS (not HTML 404):  
  **https://nhlsavant.com/OneSignalSDKWorker.js**  
  Expected body:
  ```js
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
  ```

### 4. Segments (recommended)
Create a segment for sends:
- Tag `paid` is `true`  
  (and/or External ID present — Firebase uid after login)

### 5. Then click **I've installed the SDK**

---

## Deploy + verify (owner)

```bash
npm run deploy
```

1. Confirm worker URL above loads the `importScripts` line.  
2. Visit site **logged out** → no notification prompt.  
3. Sign in as a **paid** account → allow when prompted.  
4. OneSignal → Audience → Subscriptions → you appear; tags include `paid=true`.  
5. Add yourself as Test User → send a test push.

---

## Local

`allowLocalhostAsSecureOrigin: true` is set. Prefer a separate OneSignal app for localhost so you don't mix test devices into prod.

## API keys

App API Key (Settings → Keys & IDs) stays **server-side only** — never in the frontend. Use for lock-time / pick alerts to the `paid=true` (and/or `lock_alerts=true`) segment.

## OneSignal MCP (Cursor)

So the agent can create the 15‑min lock template and send test pushes:

1. OneSignal → Settings → Keys & IDs → copy **App ID** + create/copy **REST API Key** (not Key ID).
2. Add to `~/.cursor/mcp.json`:

```json
"onesignal": {
  "url": "https://server.smithery.ai/onesignal/onesignal"
}
```

3. Restart Cursor → Settings → MCP & Integrations → **Authenticate** next to OneSignal → paste App ID + API key.
4. New chat: `Use onesignal_health to check if the server is connected.`

Docs: https://documentation.onesignal.com/docs/en/model-context-protocol

**Never commit the REST API key.**

---

## Mobile — paid users (lock alerts)

Desktop Chrome/Edge/Firefox: sign in as paid → Allow. Done.

### Android (Chrome / Edge / Samsung Internet)
1. Open **https://nhlsavant.com** in Chrome (not Incognito).
2. Sign in with a **paid** account.
3. When prompted, tap **Allow**.
4. Optional: Chrome menu → **Install app** / Add to Home screen (nicer UX; not required for push).
5. Keep notifications enabled for Chrome in Android Settings.

### iPhone / iPad (iOS / iPadOS **16.4+** only)
Apple requires a home-screen web app — Safari tab alone cannot subscribe. See [iOS web push setup](https://documentation.onesignal.com/docs/en/web-push-for-ios).

1. Open **https://nhlsavant.com** in Safari, Chrome, or Edge (not Private).
2. Share → **Add to Home Screen** → Add.
3. Open **NHL Savant from the home-screen icon** (not the browser tab).
4. Sign in as a **paid** user.
5. Tap through the permission prompt → **Allow**.
6. Test: send a push from OneSignal → should appear even if the app is closed.

**Re-test / denied permission:** delete the home-screen icon → clear site data → Add to Home Screen again.

**Site requirements (repo):** `public/manifest.json` with `display: "standalone"`, icons, and `<link rel="manifest">` in `index.html`. Service worker already at `/OneSignalSDKWorker.js`.
