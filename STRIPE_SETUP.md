# 🔐 Stripe Payment Links Setup - Simpler & More Reliable

## Why This Approach?

**OLD (Complex & Unreliable):**
- ❌ Embedded checkout + webhooks
- ❌ Webhooks failing (race conditions)
- ❌ Complex webhook signature verification
- ❌ Subscription status out of sync

**NEW (Simple & Bulletproof):**
- ✅ **Payment Links** - Stripe hosted checkout pages
- ✅ **Direct API checks** - Always accurate, source of truth is Stripe
- ✅ **No webhook dependency** - Optional for nice-to-haves only
- ✅ **Auto-refresh** - Checks Stripe every 5 minutes

---

## 🚀 Deployment Steps

### 1. Deploy Cloud Functions

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant
npm run deploy:functions
```

This deploys the new `checkSubscription` function that queries Stripe directly.

### 2. Set Stripe Secret Key in Firebase

```bash
firebase functions:config:set stripe.secret_key="sk_test_YOUR_SECRET_KEY"
# For production, use: sk_live_YOUR_SECRET_KEY
```

### 3. Verify Payment Links

The payment links are already set in `/src/utils/stripe.js`:

```javascript
scout: 'https://buy.stripe.com/aFa9ATg5U3UfdMl6a11Jm02'
elite: 'https://buy.stripe.com/aFaeVdg5UduP6jT6a11Jm03'
pro: 'https://buy.stripe.com/aFa5kD06WcqL0Zz0PH1Jm00'
```

**Verify these links work:**
1. Go to Stripe Dashboard → Payment Links
2. Confirm each link is active
3. Test checkout flow with test card

### 4. Update Product Metadata in Stripe (Important!)

For each product in Stripe Dashboard, add metadata:

**Scout Product:**
```
tier: scout
```

**Elite Product:**
```
tier: elite
```

**Pro Product:**
```
tier: pro
```

This helps the Cloud Function correctly identify subscription tiers.

---

## 🔧 How It Works

### User Signs Up:
1. User clicks "Subscribe" → Redirects to Stripe Payment Link
2. User completes payment on Stripe's hosted page
3. Stripe creates subscription in their system

### Subscription Check (On Login):
1. User signs in → `useSubscription` hook calls Cloud Function
2. Cloud Function queries Stripe API directly
3. Finds customer by email → Gets active subscriptions
4. Updates Firestore cache → Returns subscription data
5. App shows premium content instantly

### Auto-Refresh:
- Checks Stripe API every 5 minutes while user is logged in
- Always shows current status (trial → paid, cancelled, etc.)
- No webhook delays or sync issues

---

## 🧪 Testing

### Test Card Numbers:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```

### Test Flow:
1. Sign out completely
2. Go to `/pricing`
3. Select a plan (e.g., Scout)
4. Complete checkout with test card
5. Sign back in
6. Console should show: `"Checking subscription status from Stripe..."`
7. Verify premium features unlock

---

## 🐛 Troubleshooting

### "No subscription found" after payment:

**Check:**
1. Is the Stripe secret key set? `firebase functions:config:get`
2. Did the Cloud Function deploy? Check Firebase Console → Functions
3. Is the user's email the same in Firebase Auth and Stripe?

### Check subscription manually:
```javascript
// In browser console:
const { functions } = await import('./src/firebase/config.js');
const { httpsCallable } = await import('firebase/functions');
const check = httpsCallable(functions, 'checkSubscription');
const result = await check({ email: 'user@example.com' });
console.log(result.data);
```

---

## 📊 Monitoring

### Firebase Console:
- **Functions** → `checkSubscription` → View logs
- **Firestore** → `users` collection → Check subscription data

### Stripe Dashboard:
- **Customers** → Search by email
- **Subscriptions** → Verify status
- **Payment Links** → Check success rate

---

## 🎯 Benefits

1. **Always Accurate**: Stripe is source of truth, not Firestore
2. **No Webhook Failures**: Works even if webhooks fail
3. **Instant Updates**: Checks on login + every 5 min
4. **Simpler Code**: ~50% less code than webhook approach
5. **Better UX**: Users see status immediately after payment

---

## 🔄 Migration Notes

### Old webhook flow still works (backward compatible)
- Existing subscriptions continue working
- Webhook updates Firestore (optional backup)
- Cloud Function overrides on login (always accurate)

### To fully remove webhooks (optional):
1. Test thoroughly for 1 week
2. Verify all subscription checks work
3. Delete `stripeWebhook` function
4. Remove webhook endpoint from Stripe Dashboard

---

## 📝 Next Steps

1. Deploy functions: `npm run deploy:functions`
2. Set Stripe key: `firebase functions:config:set stripe.secret_key="sk_..."`
3. Add metadata to Stripe products (tier: scout/elite/pro)
4. Test with test card
5. Monitor logs for 24 hours
6. Switch to live keys when ready

🎉 **Done!** Your subscription system is now bulletproof.

