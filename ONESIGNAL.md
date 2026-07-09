# OneSignal Web Push — NHL Savant

**App ID:** `d8fcb504-8d29-4354-a9e4-8b612d3eafeb`  
**Site origin:** `https://nhlsavant.com`  
**Brand colors (dashboard / prompts):** Primary `#10B981` · Secondary `#D4AF37`

## What's in the repo

| File | Purpose |
|---|---|
| `index.html` | OneSignal v16 SDK init (`OneSignalSDK.page.js`) |
| `public/OneSignalSDKWorker.js` | Service worker (must stay at site root after deploy) |
| `src/lib/onesignal.js` | `login` / `logout` / `addTags` helpers |
| `src/hooks/useAuth.js` | On Google sign-in → `OneSignal.login(uid)` |

## Dashboard checklist (you do this in OneSignal)

1. **Settings → Push & In-App → Web**
   - Site Name: `NHL Savant` (or Sharp Flow)
   - Site URL: **`https://nhlsavant.com`** (exact origin — no trailing path)
   - Default Icon: square 256×256 PNG (use site logo / Sharp Flow mark)
   - Auto Resubscribe: on
2. **Permission prompts** — configure slide prompt / bell in the dashboard
   (Typical Site). Use brand green `#10B981` / gold `#D4AF37` if the UI asks.
3. **Service worker** — leave path at site root (`/`). After deploy, open:
   `https://nhlsavant.com/OneSignalSDKWorker.js`  
   You should see only:
   `importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");`
4. Click **I've installed the SDK** in the setup wizard.

## Verify after deploy

1. Open `https://nhlsavant.com` in Chrome (not Incognito).
2. Allow notifications when prompted.
3. OneSignal → **Audience → Subscriptions** — you should appear as Subscribed.
4. Mark yourself as a Test User → send a test push from the dashboard.

## Local testing

Vite: `http://localhost:5173` — init includes `allowLocalhostAsSecureOrigin: true`.
Prefer a **separate** OneSignal app for localhost if you test often (don't mix
prod subscribers with local).

## Sending later (not wired yet)

- Dashboard campaigns / segments
- REST API with your **App API Key** (Settings → Keys & IDs) — keep that key
  server-side only, never in the frontend
- Target by External ID = Firebase `uid` once users are signed in

## Deploy

```bash
npm run deploy
```

Then confirm the worker URL above is live before finishing the OneSignal wizard.
