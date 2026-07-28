# OneSignal Web Push — Paid Active Users Only

**App ID:** `d8fcb504-8d29-4354-a9e4-8b612d3eafeb`  
**Site origin:** `https://nhlsavant.com`  
**Who gets push:** paid active only — `tier` ∈ `scout|elite|pro` **and** `status` ∈ `active|trialing` (same as `useSubscription` → `isPremium`).

Brand colors: Primary `#10B981` · Secondary `#D4AF37`

---

## Entitlement (Option A)

| Event | Behavior |
|---|---|
| Paid user Enables on Account | Subscribe + tag `paid=all` or `paid=edge11`, External ID = Firebase uid |
| Paid user visits while premium | `PaidPushGate` re-asserts entitlement — **preserves** `all` / `edge11` (migrates legacy `true` → `all`) |
| User signs out | Clear External ID only — **keep** browser subscription (alerts work offline) |
| Sub lapses / canceled | Tag `paid=false` via Stripe webhook (+ client untag if they reopen) |
| Production send | Filter by lock mode (below) — **never** `Active Subscriptions` |

### Lock alert modes (same `paid` tag)

| Tag value | Who gets the push |
|---|---|
| `all` | Every staked lock at T−15 |
| `edge11` | Only locks with stamped **EDGE ≥ 11** |
| `true` | Legacy — treated as `all` by send filters |
| `false` | No sends (free / lapsed) |

Account → Lock Alerts shows **All plays** vs **Top tier (EDGE 11+)**. Changing mode while enabled updates the tag without a new permission prompt.

### Tag hygiene (plan limit)

OneSignal org plan allows **one custom tag** for us (`entitlements-tag-limit`).  
**Only write `paid`.** Encode preference in its value (`all` / `edge11` / `false`). Do not add `tier` / `email` / `lock_alerts`.

Client free-path is delayed ~5s so Stripe sync can promote free→paid without a false untag on login.

---

## Repo

| Piece | Behavior |
|---|---|
| `index.html` | SDK init · **autoPrompt: false** |
| `public/OneSignalSDKWorker.js` | Service worker at site root |
| `public/manifest.json` | PWA (`display: standalone`) for iOS home-screen push |
| `PaidPushGate.jsx` | Paid → External ID + preserve `paid=all\|edge11`. Free → delayed `paid=false`. Logout ≠ optOut |
| `LockAlertsCard.jsx` | Account `#/account` — Enable / Turn off + All vs Top tier + iOS/Android directions |
| `src/lib/lockAlertMode.js` | Shared mode constants + OneSignal filter builder |
| `scripts/sendLockAlerts.mjs` | Cron: newly frozen LOCKED at T−15 → audience by EDGE |
| `functions/src/onesignalTags.js` | Stripe webhook syncs `paid` by External ID (preserves mode) |
| Tags | **`paid` only** — values `all` \| `edge11` \| `false` |

Free visitors never see a permission dialog. Paid users opt in from **Account → Lock Alerts**.

---

## T−15 lock automation

1. **Primary:** market cron ([`.github/workflows/fetch-polymarket.yml`](.github/workflows/fetch-polymarket.yml)) runs `syncPickStateAuthoritative` then `sendLockAlerts` each cycle.
2. **Safety net:** [`.github/workflows/send-lock-alerts.yml`](.github/workflows/send-lock-alerts.yml) runs every ~5 min (9am–midnight ET) — sync + alerts only — so a cancelled/stalled fetch loop cannot silently drop T−15 pushes (2026-07-18 Sox/Mets miss).
3. `node scripts/sendLockAlerts.mjs`:
   - Today’s picks (`sharpFlowPicks` / Spreads / Totals)
   - Live side with `lockStage === 'LOCKED'`
   - **Staked only:** `finalUnits > 0` and `v8_hcStakeTier` is a real
     display path (not MONITORING / FADE / missing) — same bar as Locked Picks
   - Inside freeze window: `now >= commenceTime - 15m` through
     `commenceTime + 10m` grace (late cycle still delivers)
   - Not yet stamped `sides[side].lockAlertSentAt`
4. Sends push with filters:
   - Always: `paid=all` **OR** legacy `paid=true`
   - If stamped EDGE ≥ 11: also **OR** `paid=edge11`
   - EDGE from `v8_winnerAlignEdge` (else meanFor − meanAg/prior)
   - Body is set explicitly (not the dashboard template body):
     `{pick} just locked — {TIER} · {Nu} · {WR}% WR. ~15 min to gametime.`
   - Heading: `Sharp Flow · Locked` · or `Sharp Flow · Top lock` when EDGE ≥ 11
5. On success, stamps `lockAlertSentAt` + `lockAlertMessageId` (+ `lockAlertEdge`) — idempotent.

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

1. Paid + Enable (All) → Audience user shows `paid=all`
2. Switch to Top tier → `paid=edge11`
3. EDGE ≥ 11 lock → both audiences; EDGE &lt; 11 → `all`/`true` only
4. After Functions secret is live: cancel test sub → `paid=false` without opening the app

### Backfill existing users

Migrates legacy `true` → `all` while preserving any `edge11` preference:

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
| Lock copy | Title `Sharp Flow · Locked` (or `Top lock`) · `{pick} just locked — {TIER} · {Nu} · {WR}% WR. ~15 min to gametime.` |
| Enable template | **Lock Alerts Enabled** · `43652cb9-f99a-47a7-a0ce-2eea9a1001e4` |
| Enable copy | Title `You're on for lock alerts` · welcome body |
| Stake gate | Alert only if Locked Picks would show it (`finalUnits > 0` + stake tier) |
| Click URLs | Lock → `/#/` · Enable → `/#/account` |
| Audience | `paid=all` \| `true` · plus `edge11` when EDGE ≥ 11 |

---

## Dashboard setup (one-time)

1. Site URL: **`https://nhlsavant.com`** (exact)
2. Prompt Editor → **Auto Prompt OFF**
3. Service worker at `/` — live at https://nhlsavant.com/OneSignalSDKWorker.js
4. Skip SDK verification if needed (paid-only means no public first subscription)
