# Firebase Functions Setup Guide

## 🚨 CRITICAL: This Must Be Done Before Launch

Without these functions, users will pay but remain on free tier. Their subscriptions won't auto-update.

---

## 📋 What These Functions Do

1. **stripeWebhook**: Listens to Stripe events and updates user subscriptions
2. **createUserDocument**: Creates a Firestore document when users sign up

When a user:
- Completes checkout → Upgraded to premium tier
- Trial expires → Auto-charged, stays premium
- Cancels subscription → Downgraded to free tier
- Payment fails → Marked as past_due

---

## 🔧 Setup Steps

### Step 1: Install Firebase CLI (if not already)

```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Install Function Dependencies

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant/functions"
npm install
```

### Step 3: Set Up Environment Variables

You need to set these secrets in Firebase:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"

# Set Stripe Secret Key (from Stripe Dashboard)
firebase functions:secrets:set STRIPE_SECRET_KEY

# Set Webhook Secret (you'll get this after setting up webhook in Stripe)
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

When prompted, enter the values from your Stripe Dashboard.

### Step 4: Get Your Stripe Price IDs

**IMPORTANT**: You need to update the `getTierFromPriceId` function with your actual Stripe Price IDs.

1. Go to Stripe Dashboard → Products
2. Click on each product (Scout, Elite, SAVANT PRO)
3. Copy the Price ID (starts with `price_...`)
4. Update `functions/src/stripeWebhook.js`:

```javascript
function getTierFromPriceId(priceId) {
  const priceMap = {
    'price_1ABC...': 'scout',      // Replace with your Scout price ID
    'price_1DEF...': 'elite',      // Replace with your Elite price ID
    'price_1GHI...': 'pro'         // Replace with your SAVANT PRO price ID
  };

  return priceMap[priceId] || 'free';
}
```

### Step 5: Deploy Functions

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
firebase deploy --only functions
```

This will:
- Deploy the Stripe webhook handler
- Deploy the user creation handler
- Give you the webhook URL (copy this!)

**Expected output:**
```
✔ functions[stripeWebhook(us-central1)] deployed
✔ functions[createUserDocument(us-central1)] deployed

Function URL (stripeWebhook):
https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook
```

**COPY THIS URL** - you'll need it for Stripe setup.

---

## 🔗 Step 6: Configure Stripe Webhook

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL**: Paste the Function URL from Step 5
4. **Select events to listen to**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Click "Add endpoint"**
6. **Copy the Signing Secret** (starts with `whsec_...`)
7. **Set it in Firebase**:
   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   # Paste the signing secret when prompted
   ```
8. **Redeploy functions** (so they use the new secret):
   ```bash
   firebase deploy --only functions
   ```

---

## ✅ Test the Webhook

### Test in Stripe Dashboard

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. Click "Send test webhook"
4. Select `checkout.session.completed`
5. Send it

### Check Firebase Logs

```bash
firebase functions:log
```

You should see:
```
✅ Stripe Event: checkout.session.completed
```

---

## 🔍 How to Get Stripe Price IDs (Detailed)

Your payment links contain price IDs. Here's how to extract them:

### Method 1: From Payment Links

Your links look like:
```
https://buy.stripe.com/aFa9ATg5U3UfdMl6a11Jm02
```

The last part (`a11Jm02`) is encoded. You need to:

1. Open each payment link in a browser
2. Open browser DevTools (F12)
3. Look at Network tab
4. Find the request that loads the checkout page
5. Look for `price_id` in the response

### Method 2: From Stripe Dashboard (EASIER)

1. Go to Stripe Dashboard → Products
2. You should see 3 products:
   - Scout ($7.99/week)
   - Elite ($25.99/month)
   - SAVANT PRO ($150/year)
3. Click on each product
4. Under "Pricing", you'll see the Price ID (starts with `price_`)
5. Copy each one

### Method 3: Create New Prices (CLEANEST)

If you don't see clear Price IDs:

1. Go to Stripe Dashboard → Products
2. Create 3 products:
   - **Scout**: $7.99/week, 2-day trial
   - **Elite**: $25.99/month, 3-day trial
   - **SAVANT PRO**: $150/year, 5-day trial
3. Copy the Price IDs
4. Update `functions/src/stripeWebhook.js`
5. Update `src/services/subscriptionService.js` with the same IDs

---

## 🧪 Testing the Full Flow

### Test with Stripe Test Mode

1. Make sure you're in Stripe Test Mode (toggle in dashboard)
2. Go to your deployed site
3. Sign in with Google
4. Try to view 2nd game card → See upgrade modal
5. Click upgrade → Select a tier
6. Use test card: `4242 4242 4242 4242`
7. Complete checkout
8. **Wait 5-10 seconds** (webhook processing)
9. Refresh your site
10. You should now have premium access!

### Verify in Firebase Console

1. Go to Firebase Console → Firestore
2. Open `users` collection
3. Find your user document
4. Should see:
   ```
   tier: "elite" (or whatever you chose)
   status: "trialing" or "active"
   stripeCustomerId: "cus_..."
   subscriptionId: "sub_..."
   ```

---

## 🚨 Troubleshooting

### Issue: "Webhook signature verification failed"

**Fix**: Make sure `STRIPE_WEBHOOK_SECRET` is set correctly:
```bash
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase deploy --only functions
```

### Issue: "User tier not updating after payment"

**Possible causes**:
1. Price ID mapping is wrong
2. `client_reference_id` not set in checkout URL
3. Webhook not firing

**Check**:
```bash
firebase functions:log
```

Look for errors.

### Issue: "No user found for customer"

**Fix**: Make sure you're passing `client_reference_id` in the Stripe checkout URL.

In `src/utils/stripe.js`:
```javascript
if (user?.uid) {
  url.searchParams.set('client_reference_id', user.uid);
}
```

### Issue: Functions deploy fails

**Fix**:
```bash
cd functions
rm -rf node_modules
npm install
cd ..
firebase deploy --only functions
```

---

## 💰 Cost Estimate

Firebase Functions pricing:
- **Invocations**: 2 million free per month
- **Compute time**: 400,000 GB-seconds free per month

For your use case (webhooks + user creation):
- **Expected cost**: $0-5/month for first 1000 users
- Webhooks are fast (< 1 second each)
- Only charged when actually used

---

## 📊 Monitoring

### View Function Logs

```bash
firebase functions:log
```

### View Function Metrics

Go to Firebase Console → Functions → Click on a function

You'll see:
- Invocations per day
- Execution time
- Error rate

---

## 🔒 Security Notes

- ✅ Webhook signature verification prevents fake requests
- ✅ Firestore rules prevent users from manually upgrading themselves
- ✅ All subscription updates go through verified Stripe webhooks
- ✅ Secrets are stored in Firebase, not in code

---

## 📝 Summary Checklist

Before launch:
- [ ] Install function dependencies (`npm install` in functions/)
- [ ] Set `STRIPE_SECRET_KEY` in Firebase secrets
- [ ] Update Price ID mapping in `stripeWebhook.js`
- [ ] Deploy functions (`firebase deploy --only functions`)
- [ ] Copy webhook URL
- [ ] Add webhook endpoint in Stripe Dashboard
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Firebase secrets
- [ ] Redeploy functions
- [ ] Test with Stripe test card
- [ ] Verify user gets upgraded in Firestore

---

## 🚀 Quick Commands

```bash
# Install dependencies
cd "/Users/dalekolnitys/NHL Savant/nhl-savant/functions"
npm install

# Set secrets
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET

# Deploy
firebase deploy --only functions

# View logs
firebase functions:log

# Test locally (optional)
firebase emulators:start --only functions
```

---

**CRITICAL**: Don't skip the webhook setup! Without it, payments won't update user accounts.

