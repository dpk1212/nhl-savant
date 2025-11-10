# ✅ YOUR LIVE STRIPE SETUP - READY TO GO!

## 🎉 Status: PRODUCTION READY

### What's Configured

✅ **Stripe Secret Key** - LIVE mode (`sk_live_...`)  
✅ **Payment Links** - Configured in code  
✅ **Cloud Functions** - Both deployed  
  - `checkSubscription` ✓  
  - `createPortalSession` ✓  

---

## 🚨 FINAL STEPS (2 Minutes)

### 1. Activate Stripe Customer Portal (LIVE Mode)

**Required for users to cancel subscriptions!**

1. Go to: **https://dashboard.stripe.com/settings/billing/portal**  
   (Make sure you're in **LIVE mode**, not test mode)

2. Click **"Activate"**

3. Configure:
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to update payment methods
   - Default redirect: Your domain (e.g., `https://nhlsavant.com/account`)

4. Click **"Save"**

---

### 2. Verify Payment Links (LIVE Mode)

1. Go to: **https://dashboard.stripe.com/payment-links**  
   (Switch to **LIVE mode**)

2. Verify you have 3 payment links:
   - Scout ($7.99/week)
   - Elite ($25.99/month)
   - Pro ($150/year)

3. **Check each product has metadata:**
   - Click payment link → View product
   - Scroll to "Metadata"
   - Should have: `tier` = `scout` (or `elite` or `pro`)

**If missing metadata:**
- Go to: https://dashboard.stripe.com/products
- Click each product → Edit → Add metadata
- Key: `tier`, Value: `scout` (or `elite`/`pro`)

---

### 3. Add Stripe Publishable Key (Frontend)

Create or update `.env` file:

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant
```

Create `.env` file with:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
```

Get your live publishable key: **https://dashboard.stripe.com/apikeys**

---

### 4. Build & Deploy Your Site

```bash
# Build the app with new .env
npm run build

# Deploy to your hosting
# (Vercel, Netlify, Firebase Hosting, etc.)
```

---

## 🧪 HOW TO TEST ON LIVE SITE

### Test Subscription Flow

1. **Go to your live site** (e.g., https://nhlsavant.com)

2. **Sign in** with your account

3. **Go to Pricing page** (`/pricing`)

4. **Click "Subscribe"** on any plan

5. **Complete payment with REAL card**
   - Use your own card (you can cancel immediately after)
   - OR use Stripe test card in live mode: **4242 4242 4242 4242**

6. **Return to your site**

7. **Sign out and sign back in**

8. **Check subscription is active:**
   - Go to `/account`
   - Should show your tier (Scout/Elite/Pro)
   - Should show "Active" status

---

### Test Customer Portal

1. **Go to Account page** (`/account`)

2. **Click "Manage Billing"**

3. **Should redirect to Stripe Customer Portal**

4. **Try these actions:**
   - View subscription details
   - Update payment method
   - Cancel subscription (test it!)
   - View invoices

5. **Return to your site**

6. **Refresh or wait 5 minutes**
   - Status should update to "canceled"

---

## 🔍 Debugging Live Issues

### "No subscription found" after payment

**Check:**

1. **Metadata on products?**
   - https://dashboard.stripe.com/products
   - Each product needs: `tier` = `scout`/`elite`/`pro`

2. **Email matches?**
   - Same email in Firebase Auth and Stripe payment?

3. **Wait 30 seconds**
   - Then sign out and back in

4. **Check Firebase logs:**
   ```bash
   firebase functions:log --only checkSubscription
   ```

---

### "Customer Portal doesn't open"

**Check:**

1. **Portal activated in LIVE mode?**
   - https://dashboard.stripe.com/settings/billing/portal
   - Click "Activate" if not active

2. **Check browser console for errors:**
   - Press F12 → Console tab
   - Look for error messages

3. **Check Firebase logs:**
   ```bash
   firebase functions:log --only createPortalSession
   ```

---

## 📊 Monitor Your Live Setup

### Firebase Console
- [Functions Logs](https://console.firebase.google.com/project/nhl-savant/functions/logs)
- Look for `checkSubscription` and `createPortalSession` calls

### Stripe Dashboard
- [Customers](https://dashboard.stripe.com/customers)
- [Subscriptions](https://dashboard.stripe.com/subscriptions)
- [Payment Links](https://dashboard.stripe.com/payment-links)
- [Events](https://dashboard.stripe.com/events) - Real-time activity

---

## ⚡ Quick Verification Checklist

Before testing on live site:

- [ ] Stripe Customer Portal activated (LIVE mode)
- [ ] Payment links have `tier` metadata
- [ ] `.env` has live publishable key (`pk_live_...`)
- [ ] Site rebuilt and deployed with new `.env`
- [ ] Firebase functions deployed (already done! ✓)
- [ ] Stripe secret key set to live (already done! ✓)

---

## 🎯 User Flow on Your Live Site

### New User Journey

```
1. User visits nhlsavant.com
   ↓
2. Signs up / Signs in
   ↓
3. Sees limited features (free tier)
   ↓
4. Goes to /pricing
   ↓
5. Clicks "Subscribe" on any plan
   ↓
6. Redirected to Stripe checkout
   ↓
7. Enters payment details
   ↓
8. Completes payment
   ↓
9. Redirected back to your site
   ↓
10. Signs out and back in
    ↓
11. Premium features unlocked! ✅
```

### Existing Subscriber

```
1. User signs in
   ↓
2. Subscription checked automatically
   ↓
3. Premium features unlocked
   ↓
4. Can click "Manage Billing" anytime
   ↓
5. Opens Stripe Customer Portal
   ↓
6. Can cancel, update card, view invoices
```

---

## 💰 Your Live Pricing

| Plan | Price | Billing | Trial |
|------|-------|---------|-------|
| Scout | $7.99 | Weekly | 2 days |
| Elite | $25.99 | Monthly | 3 days |
| Pro | $150 | Yearly | 5 days |

---

## 🚀 What Happens After First Payment

1. **Stripe automatically:**
   - Creates customer record
   - Starts subscription
   - Sends receipt email
   - Starts trial period

2. **Your app automatically:**
   - Detects subscription on next login
   - Updates user tier in Firestore
   - Unlocks premium features
   - Refreshes status every 5 minutes

3. **User can:**
   - Access all premium features
   - Manage subscription themselves
   - Cancel anytime (portal)
   - Update payment method (portal)

---

## 🎉 You're LIVE!

Everything is configured and deployed. Just:

1. ✅ Activate Customer Portal (live mode)
2. ✅ Verify metadata on products
3. ✅ Add publishable key to `.env`
4. ✅ Rebuild & deploy site
5. ✅ Test with real purchase

**Start accepting payments now! 💰**

---

## 📞 Support Resources

- **Your Firebase Console**: https://console.firebase.google.com/project/nhl-savant
- **Your Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Customer Portal Settings**: https://dashboard.stripe.com/settings/billing/portal
- **Stripe API Keys**: https://dashboard.stripe.com/apikeys

---

## 🔐 Security Notes

✅ **PCI Compliant** - Stripe handles all card data  
✅ **Secure** - Payment happens on Stripe's servers  
✅ **Private** - Secret key only in Cloud Functions  
✅ **Safe** - No card data touches your servers  

---

**Everything is ready. Time to make money! 🚀💰**


