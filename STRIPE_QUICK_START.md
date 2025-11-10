# ⚡ Stripe Setup - Quick Start (5 mins)

## 🎯 What We Built For You

✅ **Payment Links** - Pre-built checkout pages  
✅ **Customer Portal** - Users cancel themselves  
✅ **Auto-sync** - Subscription status always accurate  

---

## 🏃 Super Fast Setup

### 1. Create Payment Links (2 min)

Go to: https://dashboard.stripe.com/test/payment-links

**Create 3 payment links:**

| Plan | Price | Billing | Trial | Metadata |
|------|-------|---------|-------|----------|
| Scout | $7.99 | Weekly | 2 days | tier=scout |
| Elite | $25.99 | Monthly | 3 days | tier=elite |
| Pro | $150 | Yearly | 5 days | tier=pro |

**Important:** 
- Add `tier` metadata to each product!
- Set success URL to your domain + `/?checkout=success`

---

### 2. Add Payment Links to Code (30 sec)

Edit: `src/utils/stripe.js`

```javascript
const paymentLinks = {
  scout: 'https://buy.stripe.com/test_YOUR_SCOUT_LINK',
  elite: 'https://buy.stripe.com/test_YOUR_ELITE_LINK',
  pro: 'https://buy.stripe.com/test_YOUR_PRO_LINK'
};
```

---

### 3. Set Stripe Keys (1 min)

Get keys: https://dashboard.stripe.com/test/apikeys

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant

# Set secret key in Firebase
firebase functions:config:set stripe.secret_key="sk_test_YOUR_KEY"

# Create .env file for publishable key
echo 'VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY' > .env
```

---

### 4. Enable Customer Portal (30 sec)

Go to: https://dashboard.stripe.com/test/settings/billing/portal

Click **"Activate"** → Save

---

### 5. Deploy (1 min)

```bash
npm run deploy:functions
```

---

## ✅ Test It

1. Go to `/pricing` in your app
2. Click "Subscribe"
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Go to `/account`
6. Click "Manage Billing"

**Done! 🎉**

---

## 🆘 Troubleshooting

### "No subscription found"
- Did you add `tier` metadata to products?
- Wait 30 seconds after payment
- Try signing out and back in

### "Portal doesn't work"
- Activate it in Stripe Dashboard (step 4)
- Redeploy functions

### "Payment link error"
- Make sure you replaced `YOUR_` placeholders
- Check URLs start with `https://buy.stripe.com/`

---

## 📚 Full Documentation

See `STRIPE_COMPLETE_SETUP_GUIDE.md` for:
- Detailed explanations
- Production setup
- Advanced configuration
- Security best practices

---

## 💡 Key Commands

```bash
# Deploy functions
npm run deploy:functions

# Check Firebase config
firebase functions:config:get

# View logs
firebase functions:log

# Test locally
firebase emulators:start
```

---

**Need help? Check the full guide or Firebase/Stripe logs!**


