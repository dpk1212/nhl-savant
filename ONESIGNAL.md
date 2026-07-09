# OneSignal Web Push — Paid Active Users Only

**App ID:** `d8fcb504-8d29-4354-a9e4-8b612d3eafeb`  
**Site origin:** `https://nhlsavant.com`  
**Who gets push:** paid active only — `tier` ∈ `scout|elite|pro` **and** `status` ∈ `active|trialing` (same as `useSubscription` → `isPremium`).

Brand colors: Primary `#10B981` · Secondary `#D4AF37`

---

## Entitlement (Option A)

| Event | Behavior |
|---|---|
| Paid user Enables on Account | Subscribe + tag `paid=true`, External ID = Firebase uid |
| Paid user visits while premium | `PaidPushGate` re-asserts `paid=true` (no permission prompt) |
| User signs out | Clear External ID only — **keep** browser subscription (alerts work offline) |
| Sub lapses / canceled | Tag `paid=false` via Stripe webhook (+ client optOut if they reopen) |
| Production send | Always filter `tag paid = true` — **never** `Active Subscriptions` |

### Tag hygiene (plan limit)

OneSignal org plan allows **one custom tag** for us (`entitlements-tag-limit`).  
**Only write `paid` = `"true"` | `"false"`.** Do not add `tier` / `email` / `lock_alerts`.

Client free-path is delayed ~5s so Stripe sync can promote free→paid without a false untag on login.

---

## Repo

| Piece | Behavior |
|---|---|
| `index.html` | SDK init · **autoPrompt: false** |
| `public/OneSignalSDKWorker.js` | Service worker at site root |
| `public/manifest.json` | PWA (`display: standalone`) for iOS home-screen push |
| `PaidPushGate.jsx` | Paid → External ID + `paid=true`. Free → delayed `paid=false` + optOut. Logout ≠ optOut |
| `LockAlertsCard.jsx` | Account `#/account` — Enable / Turn off + iOS/Android directions |
| `scripts/sendLockAlerts.mjs` | Cron: newly frozen LOCKED at T−15 → OneSignal (`paid=true`) |
| `functions/src/onesignalTags.js` | Stripe webhook syncs only `paid` by External ID |
| Tags | **`paid` only** |

Free visitors never see a permission dialog. Paid users opt in from **Account → Lock Alerts**.

---

## T−15 lock automation

1. Market cron ([`.github/workflows/fetch-polymarket.yml`](.github/workflows/fetch-polymarket.yml)) runs `syncPickStateAuthoritative` every ~8 min.
2. Then `node scripts/sendLockAlerts.mjs`:
   - Today’s picks (`sharpFlowPicks` / Spreads / Totals)
   - Live side with `lockStage === 'LOCKED'`
   - **Staked only:** `finalUnits > 0` and `v8_hcStakeTier` is a real
     display path (not MONITORING / FADE / missing) — same bar as Locked Picks
   - Inside T−15 freeze (`now >= commenceTime - 15m` and `now <= commenceTime`)
   - Not yet stamped `sides[side].lockAlertSentAt`
3. Sends push with filter `paid=true`. Body is set explicitly (not the
   dashboard template body) so tier win-rate copy is not stripped:
   `{pick} just locked — {TIER} · {WR}% WR. ~15 min to gametime.`
4. On success, stamps `lockAlertSentAt` + `lockAlertMessageId` (idempotent).

Owner-only test (no paid audience, no Firestore stamp):
```bash
node scripts/sendLockAlerts.mjs --test-owner --force --side=DOC_ID:sideKey
```

```bash
# Local inspect
node scripts/sendLockAlerts.mjs --dry-run

# Live (needs REST key)
ONESIGNAL_REST_API_KEY=... node scripts/sendLockAlerts.mjs
```

### GitHub Actions secrets

| Secret | Purpose |
|---|---|
| `ONESIGNAL_APP_ID` | App ID (optional; script has prod default) |
| `ONESIGNAL_REST_API_KEY` | REST API key — **required** for cron sends |

### Firebase Functions env (required for cancel → untag)

Add to `functions/.env` (same pattern as Stripe keys), then redeploy functions:

```bash
# functions/.env
ONESIGNAL_APP_ID=d8fcb504-8d29-4354-a9e4-8b612d3eafeb
ONESIGNAL_REST_API_KEY=your_rest_api_key

npm run deploy:functions
```

Without this, cancel/lapse only updates Firestore; OneSignal `paid` stays stale until the user reopens the site.

### Verify tag sync

1. Paid + Enable → Audience user shows `paid=true`
2. Ask agent to send filter `paid=true` → you receive; `paid=false` → rejected
3. After Functions secret is live: cancel test sub (or set Firestore free + webhook) → `paid=false` without opening the app

### Backfill existing users

```bash
ONESIGNAL_REST_API_KEY=... node scripts/syncOnesignalPaidTags.mjs --dry-run
ONESIGNAL_REST_API_KEY=... node scripts/syncOnesignalPaidTags.mjs
# single user:
ONESIGNAL_REST_API_KEY=... node scripts/syncOnesignalPaidTags.mjs --uid=FIREBASE_UID
```

---

## Lock alert assets

| Asset | ID / name |
|---|---|
| Lock template | **15-Min Lock Alert** · `451e41a3-2bdf-4758-a779-ec59a8fecf36` |
| Lock copy | Title `Sharp Flow · Locked` · `{pick} just locked — {TIER} · {WR}% WR. ~15 min to gametime.` (WR from `DAILY_AGSU_REPORT.md`; script sets `contents` directly — do not rely on template body) |
| Enable template | **Lock Alerts Enabled** · `43652cb9-f99a-47a7-a0ce-2eea9a1001e4` |
| Enable copy | Title `You're on for lock alerts` · welcome body |
| Stake gate | Alert only if Locked Picks would show it (`finalUnits > 0` + stake tier) |
| Click URLs | Lock → `/#/` · Enable → `/#/account` |
| Audience | filter `tag paid = true` |

---

## Dashboard setup (one-time)

1. Site URL: **`https://nhlsavant.com`** (exact)
2. Prompt Editor → **Auto Prompt OFF**
3. Service worker at `/` — live at https://nhlsavant.com/OneSignalSDKWorker.js
4. Skip SDK verification if needed (paid-only means no public first subscription)

---

## Mobile

### Android
Open site in Chrome → sign in paid → Account → Enable Lock Alerts → Allow.

### iPhone / iPad (iOS 16.4+)
1. Open site → Share → **Add to Home Screen**
2. Open from **home-screen icon**
3. Sign in paid → Account → Enable Lock Alerts → Allow

See [iOS web push](https://documentation.onesignal.com/docs/en/web-push-for-ios).

---

## OneSignal MCP (Cursor)

```json
"onesignal": {
  "url": "https://server.smithery.ai/onesignal/onesignal"
}
```

Authenticate with App ID + REST API key (not Key ID).  
Docs: https://documentation.onesignal.com/docs/en/model-context-protocol

**Never commit the REST API key.**
