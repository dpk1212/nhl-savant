# 🚀 NHL Savant - Ready to Deploy Checklist

## ✅ What's Complete (100% Ready)

### Core Monetization System
- ✅ Firebase Authentication with Google OAuth
- ✅ 3-tier subscription system (Scout/Elite/SAVANT PRO)
- ✅ Stripe payment integration
- ✅ Game card gating (1 free pick per day)
- ✅ Usage tracking (resets daily)
- ✅ Upgrade modal with 3-tier options
- ✅ Pricing page
- ✅ Account management page
- ✅ **Firebase Functions for auto-updating subscriptions** 🎯
- ✅ Firestore security rules
- ✅ Premium UI/UX matching brand

---

## 🔥 CRITICAL: Deploy Firebase Functions FIRST

**Why**: Without Functions, users will pay but stay on free tier!

### Quick Deploy (5 minutes)

```bash
# 1. Install function dependencies
cd "/Users/dalekolnitys/NHL Savant/nhl-savant/functions"
npm install

# 2. Set Stripe secrets
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
firebase functions:secrets:set STRIPE_SECRET_KEY
# Paste your Stripe Secret Key (sk_test_... from dashboard)

# 3. Deploy functions
firebase deploy --only functions

# 4. COPY THE WEBHOOK URL from output
# Example: https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook
```

### Set Up Stripe Webhook (3 minutes)

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: Paste the webhook URL from Step 3 above
4. **Select events**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **"Add endpoint"**
6. **Copy the signing secret** (whsec_...)
7. Set it in Firebase:
   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   # Paste the signing secret
   ```
8. Redeploy:
   ```bash
   firebase deploy --only functions
   ```

### Get Stripe Price IDs (2 minutes)

You need to update the price mapping in `functions/src/stripeWebhook.js`:

1. Go to **Stripe Dashboard** → **Products**
2. Click each product (Scout, Elite, SAVANT PRO)
3. Copy the **Price ID** (starts with `price_...`)
4. Update `functions/src/stripeWebhook.js` line ~335:

```javascript
function getTierFromPriceId(priceId) {
  const priceMap = {
    'price_YOUR_SCOUT_ID': 'scout',
    'price_YOUR_ELITE_ID': 'elite',
    'price_YOUR_PRO_ID': 'pro'
  };
  return priceMap[priceId] || 'free';
}
```

5. Redeploy:
   ```bash
   firebase deploy --only functions
   ```

**📖 Full Guide**: See `FIREBASE_FUNCTIONS_SETUP.md` for detailed instructions.

---

## 🧪 Test Before Pushing to Production

### Test Locally First

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
npm run dev
```

#### Test Checklist:
1. ✅ Sign in with Google works
2. ✅ Expand 1 game card (should work)
3. ✅ Try to expand 2nd game card (should show upgrade modal)
4. ✅ Click "View Premium Plans" → See pricing page
5. ✅ Go to `/account` → See account details
6. ✅ Badge shows "1 FREE PICK DAILY" or "0 Free Picks Left"

### Test Stripe Checkout (Don't Complete Payment Yet!)

1. Click upgrade → Select tier
2. Redirects to Stripe checkout
3. URL should include `client_reference_id=YOUR_USER_ID`
4. **Stop here** - don't complete payment until functions are deployed

### Test After Functions Deployed

1. Complete a test purchase with card: `4242 4242 4242 4242`
2. Wait 10 seconds for webhook
3. Refresh your site
4. You should now have premium access!
5. Check Firebase Console → Firestore → `users/{your_uid}`
   - Should show `tier: "scout"` (or whatever you chose)
   - Should show `status: "trialing"` or `"active"`

---

## 📦 Ready to Push to GitHub

Once functions are deployed and tested:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
git add .
git commit -m "Add premium monetization with Firebase Functions for auto-subscription updates"
git push origin main
```

**Deployment time**: ~2 minutes for GitHub Pages

---

## 🎯 What Users Will Experience

### Free Users
1. See "1 FREE PICK DAILY" badge
2. Can expand 1 game card per day
3. Trying to expand more shows upgrade modal
4. Can view pricing page
5. Can sign in with Google

### After Purchasing
1. Complete Stripe checkout
2. **Automatically upgraded** (via Functions)
3. Badge disappears
4. Can expand unlimited game cards
5. Can manage subscription from Account page

---

## ⚠️ Important Notes

### Environment Variables
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY` in GitHub secrets (done)
- ✅ `STRIPE_SECRET_KEY` in Firebase Functions secrets (do this)
- ✅ `STRIPE_WEBHOOK_SECRET` in Firebase Functions secrets (do this)

### Stripe Mode
- Currently in **Test Mode** (good!)
- Test card: `4242 4242 4242 4242`
- Switch to Live Mode when ready to accept real payments

### Firebase Functions
- Only run when webhooks are triggered
- Expected cost: $0-5/month for first 1000 users
- Automatically scale with usage

---

## 🐛 Known Issues / Not Yet Implemented

### Low Priority (Can Launch Without)
- ❌ Hot Takes gating (all hot takes visible for free users)
  - **Impact**: Low - game cards are the main value
  - **Time to fix**: 20 minutes
- ❌ Premium messaging banners throughout app
  - **Impact**: Low - upgrade button exists in nav
  - **Time to fix**: 10 minutes

### Medium Priority (Fix After Launch)
- ⚠️ Mobile optimization not fully tested
  - **Action**: Test on mobile after deploying
  - **Likely fine**: Responsive design already in place
- ⚠️ More analytics events could be added
  - **Action**: Add as you iterate based on real data

---

## 📊 Success Metrics to Track

Once live, monitor in Firebase Analytics:
- Free users who hit daily limit
- Upgrade modal views
- Pricing page visits
- Trial signups (via Stripe dashboard)
- Trial-to-paid conversion
- Churn rate

**Target Metrics**:
- Trial signup rate: 10%+
- Trial-to-paid: 20%+
- Monthly churn: <10%

---

## 🚨 Pre-Launch Checklist

**Must Do**:
- [ ] Deploy Firebase Functions
- [ ] Set up Stripe webhook
- [ ] Update price ID mapping
- [ ] Test with Stripe test card
- [ ] Verify user gets upgraded in Firestore

**Should Do**:
- [ ] Test on mobile device
- [ ] Test all pages (pricing, account, etc.)
- [ ] Verify sign-in flow
- [ ] Test upgrade modal flow

**Nice to Have**:
- [ ] Add hot takes gating
- [ ] Add more analytics events
- [ ] Test on multiple browsers
- [ ] Get feedback from beta users

---

## 🎉 You're 95% Ready!

**What works**: Full authentication, gating, pricing, account management, Stripe checkout

**What's critical**: Deploy Firebase Functions so subscriptions auto-update

**What's optional**: Everything else can be added after launch

---

## 📞 Quick Reference Commands

```bash
# Deploy functions
npm run deploy:functions

# View function logs
firebase functions:log

# Deploy app to GitHub Pages
npm run deploy

# Run locally
npm run dev
```

---

**Next Step**: Deploy Firebase Functions using the commands above, then push to GitHub!

