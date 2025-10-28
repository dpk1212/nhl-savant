# 🔐 ADD GITHUB SECRETS - EXACT STEPS

## YOUR FIREBASE MEASUREMENT ID: G-CD4CG06J6B

---

## STEP 1: Get Your Other Firebase Credentials

Go to: https://console.firebase.google.com/
→ Select your project
→ Click ⚙️ → Project settings
→ Scroll to "Your apps"
→ You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-CD4CG06J6B"
};
```

**COPY ALL THOSE VALUES**

---

## STEP 2: Add to GitHub

### Go to your repo:
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

### Click: **Settings** → **Secrets and variables** → **Actions**

### Click: **New repository secret** and add these ONE BY ONE:

| Click this 7 times → | Name | Value (copy from Firebase) |
|----------------------|------|---------------------------|
| 1st secret | `VITE_FIREBASE_API_KEY` | Your `apiKey` |
| 2nd secret | `VITE_FIREBASE_AUTH_DOMAIN` | Your `authDomain` |
| 3rd secret | `VITE_FIREBASE_PROJECT_ID` | Your `projectId` |
| 4th secret | `VITE_FIREBASE_STORAGE_BUCKET` | Your `storageBucket` |
| 5th secret | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your `messagingSenderId` |
| 6th secret | `VITE_FIREBASE_APP_ID` | Your `appId` |
| 7th secret | `VITE_FIREBASE_MEASUREMENT_ID` | `G-CD4CG06J6B` |

---

## STEP 3: Push to Deploy

Run this command:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant" && git push origin main
```

GitHub Actions will build with all secrets and deploy to GitHub Pages.

---

## DONE! 

Check: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions

Once the green checkmark appears, analytics is LIVE! 🎉


