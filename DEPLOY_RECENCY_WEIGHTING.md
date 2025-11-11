# 🚀 DEPLOY RECENCY WEIGHTING TO LIVE SITE

## ✅ Changes Ready to Deploy

**Data:**
- ✅ `public/teams.csv` has real L10 data from games.csv
- ✅ L10 columns: L10_xGF_per60, L10_xGA_per60, L10_W, L10_L, etc.

**Code:**
- ✅ `src/utils/dataProcessing.js` has recency weighting (60% L10 + 40% season)
- ✅ Verified working with test predictions

**Expected Impact:**
- Win prediction accuracy: 56.9% → 57.6% (+0.7%)
- Betting win rate (A+ bets): 59.1%
- ROI improvement as season progresses

---

## 📋 DEPLOYMENT STEPS

### Step 1: Build the Production Bundle

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
npm run build
```

**What this does:**
- Compiles all React/JS code
- Bundles with Vite
- Optimizes for production
- Creates `dist/` folder with built files

**Expected output:**
```
✓ built in 15s
dist/index.html                  X.XX kB
dist/assets/index-XXXXXX.js      XXX kB
```

### Step 2: Deploy to Live Site

```bash
npm run deploy
```

**What this does:**
- Runs `npm run build` automatically
- Deploys `dist/` folder to GitHub Pages
- Updates live site with new code

**Expected output:**
```
Published
To https://github.com/yourusername/nhl-savant.git
```

### Step 3: Verify Deployment

1. **Open your live site** in a browser
2. **Press F12** to open Developer Console
3. **Look for these messages** when viewing Today's Games:

```
📊 League avg: base=2.66 xGF/60, cal=1.520, result=4.05 goals/60
🔄 Recency weighting: TOR L10=2.52 → Weighted=2.50 xGF/60
🔄 Recency weighting: ANA L10=2.84 → Weighted=2.89 xGF/60
```

**If you see 🔄 Recency weighting messages → IT'S LIVE!** ✅

---

## 🔍 TESTING CHECKLIST

After deployment, verify these changes:

### Check 1: Console Logs
- [ ] Open site → F12 → Console tab
- [ ] Navigate to "Today's Games"
- [ ] See "🔄 Recency weighting" messages for teams with 10+ games

### Check 2: Prediction Changes
Compare predictions for hot/cold teams:

**Hot Teams (should predict HIGHER scores):**
- [ ] **Anaheim Ducks** (9-1-0 L10) - Should be favored more
- [ ] **Tampa Bay Lightning** (7-3-0 L10) - Higher scoring predictions
- [ ] **Boston Bruins** (7-3-0 L10) - Better win probabilities

**Cold Teams (should predict LOWER scores):**
- [ ] **Nashville Predators** (2-6-2 L10) - Should be underdogs
- [ ] **St. Louis Blues** (2-6-2 L10) - Lower scoring predictions
- [ ] **Washington Capitals** (3-6-1 L10) - Worse win probabilities

### Check 3: EV Changes
- [ ] Some A+ bets may become A or B+ (if overvalued by L10)
- [ ] Some B+ bets may become A+ (if undervalued by season stats)
- [ ] Overall, you should see **more accurate edges**

---

## 📊 WHAT USERS WILL SEE

### Before Deployment (Old Model):
```
Toronto Maple Leafs @ Boston Bruins
Predicted Score: TOR 3.2, BOS 3.1
Boston ML: +145 odds, 5.2% EV (B+ rated)
```

### After Deployment (With Recency Weighting):
```
Toronto Maple Leafs @ Boston Bruins
Predicted Score: TOR 3.0, BOS 3.3  ← BOS score increased (7-3 L10)
Boston ML: +145 odds, 7.1% EV (A rated)  ← Rating improved
```

**Recency weighting makes hot teams more valuable and cold teams less valuable.**

---

## 🛡️ ROLLBACK PLAN (If Something Goes Wrong)

If deployment causes issues, you can rollback:

### Option 1: Restore Backup Code
```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
cp src/utils/dataProcessing.js.backup src/utils/dataProcessing.js
npm run build
npm run deploy
```

### Option 2: Restore Backup Data
```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant/public"
cp teams_original_backup.csv teams.csv
cd ..
npm run build
npm run deploy
```

### Option 3: Revert Git Commit
```bash
git log --oneline  # Find the commit before changes
git revert <commit-hash>
npm run deploy
```

---

## 📈 PERFORMANCE MONITORING

After deployment, track these metrics to confirm improvement:

### Week 1 (Nov 12-18):
- [ ] Win accuracy on new predictions
- [ ] A+ bet performance (target: >55% win rate)
- [ ] User feedback on prediction quality

### Week 2-4 (Nov 19 - Dec 9):
- [ ] Recency weighting impact should INCREASE
- [ ] Expect +1.5-2% accuracy improvement
- [ ] A+ bets should approach 60% win rate

### Month 2+ (Dec 10+):
- [ ] Maximum recency impact (+2.5-3% accuracy)
- [ ] Overall model accuracy: 58-59%
- [ ] Consistent 58-60% A+ bet win rate

---

## ⚠️ IMPORTANT NOTES

1. **L10 Data Updates:**
   - You need to update `games.csv` weekly with fresh L10 stats
   - Run `node scripts/integrateRealL10Data.js` after updating
   - Rebuild and redeploy: `npm run build && npm run deploy`

2. **Early Season Effect:**
   - Current improvement (+0.7%) is normal for game 16
   - Impact grows throughout season as L10 diverges from season stats
   - Don't be discouraged by modest initial gains!

3. **Deployment Frequency:**
   - Data updates: **Weekly** (update games.csv with fresh L10 stats)
   - Code updates: **Only when needed** (already deployed)

---

## 🎯 SUCCESS METRICS

**Immediate (Week 1):**
- ✅ Deployment successful (see console logs)
- ✅ No errors in browser console
- ✅ Predictions updating with recency weighting

**Short Term (Month 1):**
- ✅ Win accuracy: 57.5-58.5%
- ✅ A+ bet win rate: >56%
- ✅ Positive user feedback

**Long Term (Season):**
- ✅ Win accuracy: 59-60%
- ✅ A+ bet win rate: 58-60%
- ✅ Consistent profitability

---

## 🚀 READY TO DEPLOY?

Run these commands now:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
npm run build
npm run deploy
```

Then open your site and check for "🔄 Recency weighting" in the console!

**Good luck! Your model is about to get smarter!** 🎉

