# OneSignal Web Push — Paid Active Users Only

**App ID:** `d8fcb504-8d29-4354-a9e4-8b612d3eafeb`  
**Site origin:** `https://nhlsavant.com`  
**Who gets push:** paid active only — `tier` ∈ `scout|elite|pro` **and** `status` ∈ `active|trialing` (same as `useSubscription` → `isPremium`).

Brand colors: Primary `#10B981` · Secondary `#D4AF37`

---

## Entitlement (Option A)

| Event | Behavior |
|---|---|
| Paid user Enables on Account | Subscribe + tags `paid=true`, `lock_alerts=true`, External ID = Firebase uid |
| User signs out | Clear External ID only — **keep** browser subscription (alerts work offline) |
| Sub lapses / canceled | Tag `paid=false` (+ client optOut if they reopen) via Stripe webhook |
| Production send | Always filter `tag paid = true` — **never** `Active Subscriptions` |

---

## Repo

| Piece | Behavior |
|---|---|
| `index.html` | SDK init · **autoPrompt: false** |
| `public/OneSignalSDKWorker.js` | Service worker at site root |
| `public/manifest.json` | PWA (`display: standalone`) for iOS home-screen push |
| `PaidPushGate.jsx` | Paid → sync External ID + tags (no permission prompt). Logout ≠ optOut |
| `LockAlertsCard.jsx` | Account `#/account` — Enable / Turn off + iOS/Android directions |
| `scripts/sendLockAlerts.mjs` | Cron: newly frozen LOCKED at T−15 → OneSignal (`paid=true`) |
| `functions/src/onesignalTags.js` | Stripe webhook syncs `paid` tags by External ID |
| Tags | `paid`, `tier`, `status`, `email`, `lock_alerts` |

Free visitors never see a permission dialog. Paid users opt in from **Account → Lock Alerts**.

---

## T−15 lock automation

1. Market cron ([`.github/workflows/fetch-polymarket.yml`](.github/workflows/fetch-polymarket.yml)) runs `syncPickStateAuthoritative` every ~8 min.
2. Then `node scripts/sendLockAlerts.mjs`:
   - Today’s picks (`sharpFlowPicks` / Spreads / Totals)
   - Live side with `lockStage === 'LOCKED'`
   - Inside T−15 freeze (`now >= commenceTime - 15m` and `now <= commenceTime`)
   - Not yet stamped `sides[side].lockAlertSentAt`
3. Sends template **15-Min Lock Alert** with filter `paid=true`.
4. On success, stamps `lockAlertSentAt` + `lockAlertMessageId` (idempotent).

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

### Firebase Functions env

Same `ONESIGNAL_REST_API_KEY` (+ optional `ONESIGNAL_APP_ID`) on Cloud Functions so Stripe cancel/lapse updates tags even if the user never reopens the site.

---

## Lock alert assets

| Asset | ID / name |
|---|---|
| Template | **15-Min Lock Alert** · `451e41a3-2bdf-4758-a779-ec59a8fecf36` |
| Template vars | `custom_data.pick`, `custom_data.detail` |
| Click URL | `https://nhlsavant.com/#/` |
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
