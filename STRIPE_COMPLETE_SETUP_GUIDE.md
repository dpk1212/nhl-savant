# 🎯 Complete Stripe Subscription Setup - EASIEST WAY

## ✨ What You're Getting

A **complete, production-ready subscription system** with:
- ✅ **Payment Links** - No code checkout pages
- ✅ **Customer Portal** - Users can cancel subscriptions themselves
- ✅ **Automatic sync** - Subscription status always accurate
- ✅ **Trial periods** - Built-in trial management
- ✅ **Direct Stripe checks** - No webhook dependency

---

## 📋 Prerequisites

1. A Stripe account (create at [stripe.com](https://stripe.com))
2. Firebase project with Cloud Functions enabled
3. Your app deployed (or local for testing)

---

## 🚀 Step-by-Step Setup (15 minutes)

### Step 1: Create Stripe Products & Payment Links

Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/payment-links)

#### Create Scout Plan ($7.99/week)
1. Click **"+ New"** button
2. Select **"Create a new product"**
3. **Product details:**
   - Name: `Scout`
   - Description: `Weekly access to NHL Savant predictions`
   - Price: `$7.99 USD`
   - Billing period: `Weekly`
   - Add trial: `2 days`
4. **Payment page:**
   - Collect customer email: ✅ Yes
   - Success page: Enter your domain + `/?checkout=success` (e.g., `https://nhlsavant.com/?checkout=success`)
5. **Important:** Click "Add metadata" and add:
   - Key: `tier`
   - Value: `scout`
6. Click **"Create link"**
7. **Copy the payment link URL** (e.g., `https://buy.stripe.com/test_abc123...`)

#### Create Elite Plan ($25.99/month)
Repeat above steps with:
- Name: `Elite`
- Price: `$25.99 USD`
- Billing period: `Monthly`
- Trial: `3 days`
- Metadata: `tier` = `elite`

#### Create Pro Plan ($150/year)
Repeat above steps with:
- Name: `SAVANT PRO`
- Price: `$150.00 USD`
- Billing period: `Yearly`
- Trial: `5 days`
- Metadata: `tier` = `pro`

---

### Step 2: Update Payment Links in Your Code

Open: `/Users/dalekolnitys/NHL Savant/nhl-savant/src/utils/stripe.js`

Replace the placeholder URLs with your actual payment links:

```javascript
const paymentLinks = {
  scout: 'https://buy.stripe.com/test_YOUR_SCOUT_LINK',    // Paste your Scout link
  elite: 'https://buy.stripe.com/test_YOUR_ELITE_LINK',    // Paste your Elite link
  pro: 'https://buy.stripe.com/test_YOUR_PRO_LINK'         // Paste your Pro link
};
```

---

### Step 3: Configure Stripe API Keys

#### Get Your Stripe Secret Key
1. Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_...`)
3. ⚠️ **Never commit this to Git!**

#### Set it in Firebase Functions
```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant

# Set Stripe secret key in Firebase config
firebase functions:config:set stripe.secret_key="sk_test_YOUR_SECRET_KEY_HERE"
```

#### Add Publishable Key to Your App
1. Copy your **Publishable key** (starts with `pk_test_...`)
2. Create/update `.env` file in your project root:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

---

### Step 4: Enable Stripe Customer Portal

The Customer Portal allows users to:
- Cancel subscriptions
- Update payment methods
- View invoices
- Download receipts

#### Enable in Stripe Dashboard
1. Go to [Stripe Customer Portal Settings](https://dashboard.stripe.com/test/settings/billing/portal)
2. Click **"Activate"**
3. **Configure settings:**
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to update payment methods
   - ✅ Show subscription history
   - Default redirect URL: Your domain (e.g., `https://nhlsavant.com/account`)
4. Click **"Save"**

#### Update Return URL (Optional)
If you want to customize where users go after using the portal:

In `/Users/dalekolnitys/NHL Savant/nhl-savant/functions/src/createPortalSession.js`, change:
```javascript
const returnUrl = data.returnUrl || 'https://yourdomain.com/account';
```

---

### Step 5: Deploy Firebase Functions

Deploy your updated Cloud Functions:

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant

# Deploy all functions
npm run deploy:functions

# OR deploy individually
firebase deploy --only functions:checkSubscription
firebase deploy --only functions:createPortalSession
```

Wait for deployment to complete (usually 1-2 minutes).

---

### Step 6: Test Everything

#### Test Subscription Flow

1. **Sign in** to your app
2. Go to **Pricing page** (`/pricing`)
3. Click **"Subscribe"** on any plan
4. You should be redirected to Stripe checkout
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
6. Complete payment
7. You'll be redirected back to your app
8. **Sign out and sign back in**
9. Your subscription should be active! ✅

#### Test Customer Portal

1. Go to **Account page** (`/account`)
2. Click **"Manage Billing"**
3. You should be redirected to Stripe Customer Portal
4. Try:
   - Viewing your subscription
   - Updating payment method
   - Canceling subscription (test it!)
5. Return to your app
6. Subscription status should update within 5 minutes (or refresh page)

---

## 🧪 Test Cards

Use these cards in **test mode**:

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Card declined |
| 4000 0000 0000 9995 | ❌ Insufficient funds |

All test cards:
- Any future expiry date
- Any 3-digit CVC
- Any 5-digit ZIP

---

## 🔍 Troubleshooting

### "No subscription found" after payment

**Check:**
1. Did you add metadata (`tier=scout`) to your Stripe products?
   - Go to: [Stripe Products](https://dashboard.stripe.com/test/products)
   - Click on each product → Edit → Add metadata
2. Is the Stripe secret key set?
   ```bash
   firebase functions:config:get
   ```
3. Are the functions deployed?
   - Check [Firebase Console → Functions](https://console.firebase.google.com)
4. Is the user's email the same in Firebase Auth and Stripe?

### "Portal button doesn't work"

**Check:**
1. Is Customer Portal activated in Stripe?
   - [Go here](https://dashboard.stripe.com/test/settings/billing/portal)
2. Is the function deployed?
   ```bash
   firebase deploy --only functions:createPortalSession
   ```
3. Check browser console for errors (F12 → Console)

### "Payment link not configured" error

**Check:**
1. Did you update `stripe.js` with actual payment links?
2. Make sure URLs start with `https://buy.stripe.com/`
3. Payment links should not contain `YOUR_` placeholders

### Check subscription manually (Debug)

Open browser console (F12) and run:

```javascript
// Import and call checkSubscription
const { functions } = await import('./src/firebase/config.js');
const { httpsCallable } = await import('firebase/functions');
const check = httpsCallable(functions, 'checkSubscription');
const result = await check({ email: 'your@email.com' });
console.log(result.data);
```

---

## 📊 Monitoring

### Firebase Console
- [Functions logs](https://console.firebase.google.com/project/_/functions/logs)
- [Firestore data](https://console.firebase.google.com/project/_/firestore/data)
- Look for `checkSubscription` and `createPortalSession` logs

### Stripe Dashboard
- [Customers](https://dashboard.stripe.com/test/customers) - Search by email
- [Subscriptions](https://dashboard.stripe.com/test/subscriptions) - View all subscriptions
- [Payment Links](https://dashboard.stripe.com/test/payment-links) - Check conversion rates
- [Logs](https://dashboard.stripe.com/test/logs) - Debug API calls

---

## 🔐 Security Best Practices

1. **Never commit API keys to Git**
   - Add `.env` to `.gitignore`
   - Use Firebase config for cloud functions

2. **Use separate keys for test and production**
   - Test mode: `sk_test_...` and `pk_test_...`
   - Live mode: `sk_live_...` and `pk_live_...`

3. **Restrict API key permissions**
   - In Stripe Dashboard → Developers → API Keys
   - Click "Restrict key" for extra security

4. **Enable webhook signatures** (if using webhooks)
   - Already implemented in `stripeWebhook.js`

---

## 🚢 Going Live (Production)

When ready to accept real payments:

### 1. Complete Stripe Onboarding
- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Complete business verification
- Add bank account for payouts

### 2. Create Production Payment Links
- Switch to "Live mode" in Stripe Dashboard
- Recreate payment links (same settings as test mode)
- Copy new live URLs

### 3. Update Production Keys
```bash
# Update Firebase config with LIVE key
firebase functions:config:set stripe.secret_key="sk_live_YOUR_LIVE_KEY"

# Update .env with LIVE publishable key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY

# Redeploy functions
firebase deploy --only functions
```

### 4. Update Payment Links
- Update `stripe.js` with live payment link URLs
- Deploy your app
- Test with real card (your own)

### 5. Activate Live Customer Portal
- Go to [Live Portal Settings](https://dashboard.stripe.com/settings/billing/portal)
- Click "Activate"
- Configure same settings as test mode

---

## 💰 Pricing Recommendations

Current setup:
- Scout: $7.99/week = **$31.96/month**
- Elite: $25.99/month = **$311.88/year**
- Pro: $150/year = **$12.50/month** (best value!)

Consider:
- Most SaaS conversions come from monthly plans
- Annual plans have best LTV (lifetime value)
- Trials increase conversion by 20-30%
- Too many choices = decision paralysis (3 options is perfect)

---

## 📈 Next Steps

Once everything is working:

1. **Test thoroughly** for 1-2 days with test cards
2. **Monitor logs** for any errors
3. **Set up email notifications** (Stripe can email receipts automatically)
4. **Add Stripe webhooks** for real-time updates (optional, already built)
5. **Go live** with real payment keys
6. **Market your premium features** 🚀

---

## 🆘 Need Help?

1. **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
2. **Firebase Functions Docs**: [firebase.google.com/docs/functions](https://firebase.google.com/docs/functions)
3. **Check logs**: 
   - Firebase Console → Functions → Logs
   - Stripe Dashboard → Developers → Logs
4. **Test mode**: Always test in test mode first!

---

## ✅ Checklist

Before going live, verify:

- [ ] Created 3 payment links (Scout, Elite, Pro)
- [ ] Added metadata (`tier`) to each product
- [ ] Updated `stripe.js` with actual payment links
- [ ] Set Stripe secret key in Firebase config
- [ ] Added publishable key to `.env`
- [ ] Enabled Customer Portal in Stripe
- [ ] Deployed Firebase functions successfully
- [ ] Tested subscription purchase with test card
- [ ] Tested customer portal access
- [ ] Tested subscription cancellation
- [ ] Verified subscription status updates correctly
- [ ] Checked Firebase logs for errors
- [ ] Tested sign-out and sign-in to verify persistence

---

## 🎉 You're Done!

Your subscription system is now **bulletproof** and **production-ready**!

Users can:
- ✅ Subscribe with trials
- ✅ Manage their own billing
- ✅ Cancel anytime
- ✅ Update payment methods
- ✅ View invoices

And you get:
- ✅ Automatic subscription management
- ✅ No webhook headaches
- ✅ Always-accurate subscription status
- ✅ Stripe handles all payment logic
- ✅ Built-in fraud prevention
- ✅ PCI compliance included

**Time to launch! 🚀**

