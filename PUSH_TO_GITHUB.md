# 🚀 Push to GitHub - What You Need

## ✅ What to Push (Frontend Changes)

These files were modified and need to be pushed:

### Modified Files
- ✅ `src/utils/stripe.js` - Payment links updated
- ✅ `src/pages/Account.jsx` - Customer portal button
- ✅ `functions/src/index.js` - Exports new function
- ✅ `functions/src/createPortalSession.js` - New function

### New Documentation
- ✅ All the STRIPE_*.md files (helpful for reference)

---

## ⚠️ DO NOT PUSH

**NEVER push these files:**
- ❌ `.env` - Contains secret keys!
- ❌ `node_modules/`
- ❌ `dist/` or `build/`

---

## 🎯 Quick Push Commands

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant

# Add the important files
git add functions/src/createPortalSession.js
git add functions/src/index.js
git add src/pages/Account.jsx
git add src/utils/stripe.js

# Add documentation (optional but helpful)
git add STRIPE_*.md
git add GO_LIVE_NOW.md
git add LIVE_SETUP_COMPLETE.md
git add START_HERE_STRIPE.md

# Commit
git commit -m "Add Stripe customer portal and update payment links"

# Push to GitHub
git push origin main
```

---

## 🔐 Important: .env File

**The .env file should NEVER be in GitHub!**

Check your `.gitignore` includes:
```
.env
.env.local
.env.production
```

Your `.env` file stays LOCAL only. Each environment (dev, production) has its own.

---

## 🚀 After Pushing

Once pushed to GitHub, your deployment will automatically trigger (GitHub Pages).

Then just:
1. Wait for deployment to complete
2. Test your live site
3. Try subscribing with test card
4. Check customer portal works

---

## ⚡ Super Fast Version

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant

# Add all Stripe-related changes
git add -A
git commit -m "Add Stripe customer portal for subscription management"
git push

# Done!
```

**Note:** This adds everything except files in `.gitignore` (like `.env`)

---

## ✅ After Push Checklist

- [ ] Changes pushed to GitHub
- [ ] GitHub Actions/deployment triggered
- [ ] Site deployed successfully
- [ ] Test subscription on live site
- [ ] Test customer portal works
- [ ] Monitor Firebase logs for errors

---

**Push now and you're live! 🚀**

