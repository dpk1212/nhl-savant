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
| `PaidPushGate.jsx` | If `isPremium` → login + requestPermission + optIn; else optOut |
| Tags | `paid=true/false`, `tier`, `status`, `email` |

Free visitors and logged-out users never see a permission dialog.

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

App API Key (Settings → Keys & IDs) stays **server-side only** — never in the frontend. Use later for lock-time / pick alerts to the `paid=true` segment.
