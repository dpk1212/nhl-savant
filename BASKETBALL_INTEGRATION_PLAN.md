# 🏀 BASKETBALL INTEGRATION PLAN - HIDDEN NAVIGATION APPROACH

**Date:** November 24, 2025  
**Objective:** Add College Basketball page to NHL Savant with no visible navigation link  
**Risk Level:** 🟢 MINIMAL - Adding new page only, zero impact on existing NHL functionality  
**Timeline:** 1-2 hours for initial implementation

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Access URLs](#access-urls)
3. [Files to Create](#files-to-create)
4. [Files to Modify](#files-to-modify)
5. [Implementation Steps](#implementation-steps)
6. [Testing Protocol](#testing-protocol)
7. [Deployment Checklist](#deployment-checklist)
8. [Future Development Path](#future-development-path)

---

## 📚 DATA SOURCE REFERENCES

This plan uses the following external data sources for college basketball analytics:

1. **OddsTrader NCAAB**  
   URL: https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money  
   Purpose: Live betting odds (moneyline, spread, totals) from multiple sportsbooks

2. **Haslametrics**  
   URL: https://haslametrics.com/  
   Purpose: Team efficiency ratings, tempo-free analytics, game predictions

3. **D-Ratings Basketball Predictions**  
   URL: https://www.dratings.com/predictor/ncaa-basketball-predictions/  
   Purpose: Win probabilities, score predictions, rating consensus

**Scraping Method:** All sources will be scraped using Firecrawl API (same as NHL data)  
**Update Frequency:** Daily (ideally 1-2 times per day before games)  
**Data Format:** Markdown files saved to `public/` folder

---

## 🎯 OVERVIEW

### What We're Building
A fully functional College Basketball page that exists in production but has **no visible navigation link**. Only accessible via direct URL.

### Why This Approach
- ✅ **Zero risk** - Can't break NHL functionality
- ✅ **Test in production** - Validate real environment
- ✅ **Easy to iterate** - Build features over time
- ✅ **Simple launch** - Just add nav link when ready

### What Users See
- **Nothing** - No hint basketball exists
- All existing NHL pages work identically
- No new buttons, links, or menu items

### What You See
- Bookmark the direct URL
- Full basketball page with game cards
- Development roadmap visible
- Can iterate and test privately

---

## 🔗 ACCESS URLS

### Local Development
```
http://localhost:5173/#/basketball
```

### Production (After Deploy)
```
https://[YOUR-GITHUB-USERNAME].github.io/nhl-savant/#/basketball
```

Replace `[YOUR-GITHUB-USERNAME]` with your actual GitHub username.

### Example URLs
```
# If using custom domain:
https://nhlsavant.com/#/basketball

# If using GitHub Pages default:
https://dalekolnitys.github.io/nhl-savant/#/basketball
```

### 📌 BOOKMARK THIS
Create a browser bookmark with the production URL for instant access.

---

## 📊 DATA SOURCES

### Primary Data Sources for CBB

#### 1. OddsTrader NCAAB Odds
**URL:** `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money`
**What we get:**
- Live moneyline odds
- Spread betting lines  
- Total (over/under) lines
- Multiple sportsbook comparisons
- Game times and matchups
- Team records

**Usage:** Similar to NHL odds scraping, provides market probabilities for edge calculation

#### 2. Haslametrics
**URL:** `https://haslametrics.com/`
**What we get:**
- Team efficiency ratings (offense/defense)
- Tempo-free analytics
- Performance metrics
- Conference quality ratings
- Projected tournament seeds
- Game predictions with scores

**Usage:** Primary rating system for model calibration (like MoneyPuck for NHL)

#### 3. D-Ratings Basketball Predictions
**URL:** `https://www.dratings.com/predictor/ncaa-basketball-predictions/`
**What we get:**
- Win probability predictions
- Score predictions
- Game-by-game matchup analysis
- Rating consensus

**Usage:** Secondary validation source, ensemble calibration with Haslametrics

### Data Integration Strategy

**Model Calibration (Phase 2 - Initial Launch):**
```
D-Ratings (60%) + Haslametrics (40%) = Calibrated Prediction
Compare to Market Odds → Calculate Edge → Assign Grade
```

**Model Evolution (Phase 3 - Future):**
```
D-Ratings (40%) + Haslametrics (30%) + Your Model (30%) = Calibrated Prediction
```

**Why This Approach:**
- **Phase 2:** Launch quickly with proven external models
- **D-Ratings (60%):** Primary prediction source, established system
- **Haslametrics (40%):** Tempo-free validation, efficiency metrics
- **Market Odds:** Reality check for edge calculation
- **Phase 3:** Build your own model later, integrate into ensemble

---

## 📁 FILES TO CREATE

### File 1: `src/pages/Basketball.jsx`

**Location:** `src/pages/Basketball.jsx`  
**Type:** New file  
**Size:** ~350 lines  
**Purpose:** Main basketball page component

**Key Features:**
- Basketball-themed UI (orange/purple gradients)
- Mock game cards with spread/total display
- Development roadmap section
- "Hidden from users" badge
- Conference and KenPom rank display
- Responsive design matching NHL aesthetic

**Full Code:** See appendix or separate code file

---

## ✏️ FILES TO MODIFY

### File 2: `src/App.jsx`

**Location:** `src/App.jsx`  
**Type:** Existing file - Minor modification  
**Changes:** Add 2 lines only

**Step 1: Add Import** (at top of file with other imports)
```javascript
import Basketball from './pages/Basketball';
```

**Step 2: Add Route** (inside `<Routes>` section)
```javascript
<Route path="/basketball" element={<Basketball />} />
```

**Example Placement:**
```javascript
<Routes>
  <Route path="/" element={<TodaysGames ... />} />
  <Route path="/my-picks" element={<MyPicks />} />
  <Route path="/top-scorers" element={<TopScorersTonight ... />} />
  
  {/* Basketball - Hidden from navigation */}
  <Route path="/basketball" element={<Basketball />} />
  
  <Route path="/dashboard" element={<Dashboard ... />} />
  {/* ... rest of routes ... */}
</Routes>
```

**Lines Added:** 2  
**Lines Modified:** 0  
**Risk:** 🟢 ZERO - Only adds new route, doesn't touch existing routes

---

## 🔨 IMPLEMENTATION STEPS

### Step 1: Prepare Environment (5 minutes)
```bash
# Navigate to project directory
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"

# Check git status
git status  # Should be clean

# Ensure on main branch
git branch  # Check current branch

# Pull latest changes
git pull
```

### Step 2: Create Basketball Page (10 minutes)

**Option A: Using Terminal**
```bash
# Create the file
touch src/pages/Basketball.jsx

# Open in your editor and paste the code
```

**Option B: Using VS Code/Cursor**
1. Navigate to `src/pages/` folder
2. Right-click → New File
3. Name it: `Basketball.jsx`
4. Paste the complete Basketball.jsx code

**Code Location:** See full Basketball.jsx code in appendix

### Step 3: Update App.jsx (5 minutes)

1. Open `src/App.jsx`
2. Find the imports section (top of file)
3. Add: `import Basketball from './pages/Basketball';`
4. Find the `<Routes>` section
5. Add: `<Route path="/basketball" element={<Basketball />} />`
6. Save the file

### Step 4: Test Locally (15 minutes)

```bash
# Start development server
npm run dev

# Server should start at http://localhost:5173
```

**Testing Checklist:**

1. **NHL Pages (Should be identical):**
   - [ ] `http://localhost:5173/#/` - Homepage works
   - [ ] `http://localhost:5173/#/my-picks` - My Picks works
   - [ ] `http://localhost:5173/#/top-scorers` - Top Scorers works
   - [ ] `http://localhost:5173/#/performance` - Performance works
   - [ ] Check: NO basketball link in navigation

2. **Basketball Page (New):**
   - [ ] `http://localhost:5173/#/basketball` - Loads successfully
   - [ ] Game cards display
   - [ ] "HIDDEN FROM USERS" badge visible
   - [ ] Orange/purple theme applied
   - [ ] Roadmap section shows

3. **Console Check:**
   - [ ] No errors in browser console
   - [ ] No warnings about broken routes

### Step 5: Commit Changes (5 minutes)

```bash
# Check what changed
git status
# Should show:
#   modified:   src/App.jsx
#   new file:   src/pages/Basketball.jsx

# Stage the changes
git add src/App.jsx
git add src/pages/Basketball.jsx

# Commit with descriptive message
git commit -m "Add hidden basketball page (no navigation link)"

# Push to GitHub
git push origin main
```

### Step 6: Build for Production (5 minutes)

```bash
# Build the project
npm run build

# Check for any errors
# If errors appear, fix them before deploying
```

**Common Build Checks:**
- [ ] Build completes successfully
- [ ] No TypeScript/ESLint errors
- [ ] dist/ folder created
- [ ] File sizes reasonable

### Step 7: Deploy to Production (5 minutes)

```bash
# Deploy to GitHub Pages
npm run deploy

# Wait for deployment (usually 1-2 minutes)
```

**Deployment process:**
1. Builds production bundle
2. Pushes to `gh-pages` branch
3. GitHub Pages picks up changes
4. Site updates (1-2 min delay)

### Step 8: Verify Production (10 minutes)

1. **Visit NHL Site:**
   - Go to: `https://[USERNAME].github.io/nhl-savant/`
   - Test all existing pages
   - Confirm nothing changed

2. **Visit Basketball Page:**
   - Go to: `https://[USERNAME].github.io/nhl-savant/#/basketball`
   - Should see basketball page
   - Should see "HIDDEN FROM USERS" badge

3. **Incognito Test:**
   - Open incognito/private window
   - Browse NHL site normally
   - Confirm: NO mention of basketball anywhere
   - Confirm: NO navigation link

4. **Bookmark URL:**
   - Save basketball URL for easy access
   - Test bookmark works

---

## 🧪 TESTING PROTOCOL

### Critical Tests (MUST PASS before deploying)

#### Test Suite 1: NHL Functionality Unchanged
```
✅ Homepage (/) loads without errors
✅ Game cards display correctly
✅ Betting picks show proper grades
✅ My Picks page works
✅ Top Scorers page works
✅ Performance dashboard works
✅ Authentication works (sign in/out)
✅ Premium features work
✅ Stripe checkout works
✅ Firebase tracking works
```

#### Test Suite 2: Basketball Page Functions
```
✅ Direct URL works: /#/basketball
✅ Page loads without errors
✅ Game cards render properly
✅ Styling matches theme (orange/purple)
✅ Cards are interactive (hover effects)
✅ "HIDDEN FROM USERS" badge visible
✅ Roadmap section displays
✅ Responsive on mobile
```

#### Test Suite 3: Navigation Verification
```
✅ NO basketball link in header navigation
✅ NO basketball link in footer
✅ NO basketball link in mobile menu
✅ NO basketball mention in any tooltips
✅ NO basketball in sitemap/meta
```

#### Test Suite 4: User Perspective Test
```
1. Open incognito/private browser window
2. Navigate to your NHL site
3. Browse all pages normally
4. Search for any mention of "basketball"
5. Expected result: NOTHING found
```

#### Test Suite 5: Production Validation
```
✅ NHL site loads on production domain
✅ All NHL pages work identically
✅ Basketball URL accessible directly
✅ No console errors in production
✅ Performance metrics unchanged
✅ No broken links
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment Checklist
- [ ] Basketball.jsx file created in `src/pages/`
- [ ] App.jsx updated (import + route added)
- [ ] Local testing completed (all tests pass)
- [ ] No console errors in dev mode
- [ ] NHL pages work perfectly (spot check 3-5 pages)
- [ ] Basketball page renders correctly
- [ ] No navigation link visible anywhere
- [ ] Git commits created and pushed
- [ ] Working directory clean (`git status`)

### Build Checklist
- [ ] `npm run build` executes successfully
- [ ] No build errors in terminal
- [ ] No build warnings (or all acceptable)
- [ ] dist/ folder generated
- [ ] File sizes look reasonable
- [ ] No missing dependencies

### Deployment Checklist
- [ ] `npm run deploy` runs successfully
- [ ] Deployment completes without errors
- [ ] GitHub Pages deployment triggered
- [ ] Wait 2-3 minutes for propagation

### Post-Deployment Verification
- [ ] NHL homepage loads on production
- [ ] My Picks page works on production
- [ ] Top Scorers page works on production
- [ ] Performance page works on production
- [ ] Basketball URL works (direct access)
- [ ] Basketball page displays correctly
- [ ] "HIDDEN" badge shows on basketball page
- [ ] No basketball nav link visible
- [ ] Tested in incognito mode (users see nothing)
- [ ] Basketball URL bookmarked for easy access

### Rollback Plan (If Issues)
```bash
# Quick rollback command
git revert HEAD
git push origin main
npm run deploy

# Expected time: 2-3 minutes
```

---

## 🚀 FUTURE DEVELOPMENT PATH

### Phase 1: Foundation ✅ (Week 1)
**Status:** THIS PLAN
- [x] Create planning document
- [ ] Create basketball page file
- [ ] Add routing to App.jsx
- [ ] Deploy hidden page
- [ ] Verify in production
- [ ] Test accessibility

### Phase 2: Data Infrastructure (Week 2)
**Goal:** Connect real CBB data sources
- [ ] Create `scripts/fetchBasketballData.js`
- [ ] Scrape CBB odds from OddsTrader: `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money`
- [ ] Scrape Haslametrics ratings: `https://haslametrics.com/`
- [ ] Scrape D-Ratings predictions: `https://www.dratings.com/predictor/ncaa-basketball-predictions/`
- [ ] Create `public/basketball_odds.md` (OddsTrader)
- [ ] Create `public/haslametrics.csv` (Haslametrics ratings)
- [ ] Create `public/dratings.csv` (D-Ratings predictions)
- [ ] Test data pipeline locally

### Phase 3: Prediction Model (Week 3)
**Goal:** Build CBB analytics engine with 60/40 ensemble
- [ ] Create `src/utils/basketballDataProcessing.js`
- [ ] Parse Haslametrics data (offensive/defensive efficiency, tempo)
- [ ] Parse D-Ratings predictions (win probabilities, scores)
- [ ] Parse OddsTrader odds (spreads, totals, moneylines)
- [ ] Implement ensemble model (Phase 2 weights):
  - **D-Ratings: 60% weight** (primary predictions)
  - **Haslametrics: 40% weight** (tempo-free validation)
- [ ] Generate spread predictions
- [ ] Calculate Expected Value vs market odds
- [ ] Assign quality grades (A+/A/B+/B/C)
- [ ] Test predictions against historical data

### Phase 3.5: Build Your Own Model (Future)
**Goal:** Add proprietary CBB model to ensemble
- [ ] Research CBB statistical modeling
- [ ] Collect historical CBB data
- [ ] Build tempo-free prediction model
- [ ] Backtest model performance
- [ ] Integrate into ensemble:
  - Your model: 30%
  - D-Ratings: 40%
  - Haslametrics: 30%
- [ ] A/B test new vs old ensemble

### Phase 4: UI Enhancement (Week 4)
**Goal:** Polish user experience
- [ ] Add live score integration
- [ ] Generate AI narratives (Perplexity)
- [ ] Implement quality grading (A+/A/B+/B)
- [ ] Add conference context
- [ ] Show top 25 rankings
- [ ] Mobile optimization
- [ ] Performance testing

### Phase 5: Beta Testing (Week 5)
**Goal:** Validate with select users
- [ ] Share URL with 5-10 trusted users
- [ ] Collect feedback
- [ ] Fix reported bugs
- [ ] Adjust UI based on feedback
- [ ] Performance optimization
- [ ] Final QA testing

### Phase 6: Public Launch (Week 6+)
**Goal:** Make basketball visible to all users
- [ ] Add navigation link to header
- [ ] Update pricing page (if adding CBB value)
- [ ] Create announcement post
- [ ] Email existing users
- [ ] Social media push
- [ ] Monitor performance metrics
- [ ] Track user engagement

---

## 📂 FILE STRUCTURE REFERENCE

### Current Structure (Before Changes)
```
nhl-savant/
├── src/
│   ├── App.jsx
│   ├── pages/
│   │   ├── Account.jsx
│   │   ├── Disclaimer.jsx
│   │   ├── MatchupInsights.jsx
│   │   ├── MyPicks.jsx
│   │   ├── Pricing.jsx
│   │   └── TopScorersTonight.jsx
│   └── components/
│       └── (100+ NHL components)
```

### After Implementation
```
nhl-savant/
├── src/
│   ├── App.jsx                    ← MODIFIED (2 lines added)
│   ├── pages/
│   │   ├── Account.jsx
│   │   ├── Basketball.jsx         ← NEW FILE
│   │   ├── Disclaimer.jsx
│   │   ├── MatchupInsights.jsx
│   │   ├── MyPicks.jsx
│   │   ├── Pricing.jsx
│   │   └── TopScorersTonight.jsx
│   └── components/
│       └── (unchanged - 100+ files)
```

### Future Structure (After Full Build)
```
nhl-savant/
├── src/
│   ├── pages/
│   │   └── Basketball.jsx
│   ├── utils/
│   │   ├── basketballDataProcessing.js  ← Future
│   │   └── basketballEdgeCalculator.js  ← Future
│   └── components/
│       └── BasketballGameCard.jsx       ← Future (if needed)
├── public/
│   ├── basketball_odds.md               ← Future (OddsTrader)
│   ├── haslametrics.md                  ← Future (Haslametrics ratings)
│   └── dratings.md                      ← Future (D-Ratings predictions)
└── scripts/
    └── fetchBasketballData.js           ← Future
```

---

## 🔄 DATA FETCHING SCRIPT (PHASE 2)

### `scripts/fetchBasketballData.js`

**Purpose:** Automated daily scraping of CBB odds and analytics using Firecrawl API

**What It Does:**
1. Scrapes OddsTrader for today's CBB games and odds
2. Scrapes Haslametrics for team ratings and predictions
3. Scrapes D-Ratings for win probabilities
4. Saves all data to `public/` folder
5. Logs summary of games found

**Script Structure:**

```javascript
/**
 * Automated CBB Data Fetcher using Firecrawl
 * Scrapes odds and ratings from multiple sources
 * 
 * Usage: npm run fetch-basketball
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

async function fetchBasketballData() {
  console.log('🏀 Fetching College Basketball data...');
  const results = {
    odds: false,
    haslametrics: false,
    dratings: false
  };
  
  try {
    // 1. Fetch OddsTrader NCAAB Odds
    console.log('📊 Fetching odds from OddsTrader...');
    const oddsResult = await firecrawl.scrape(
      'https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money',
      {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000,
        timeout: 300000
      }
    );
    
    await fs.writeFile(
      join(__dirname, '../public/basketball_odds.md'),
      oddsResult.markdown,
      'utf8'
    );
    console.log('✅ Odds saved to basketball_odds.md');
    results.odds = true;
    
    // 2. Fetch Haslametrics Ratings
    console.log('📈 Fetching Haslametrics ratings...');
    const haslametricsResult = await firecrawl.scrape(
      'https://haslametrics.com/',
      {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 2000,
        timeout: 300000
      }
    );
    
    await fs.writeFile(
      join(__dirname, '../public/haslametrics.md'),
      haslametricsResult.markdown,
      'utf8'
    );
    console.log('✅ Haslametrics saved to haslametrics.md');
    results.haslametrics = true;
    
    // 3. Fetch D-Ratings Predictions
    console.log('🎯 Fetching D-Ratings predictions...');
    const dratingsResult = await firecrawl.scrape(
      'https://www.dratings.com/predictor/ncaa-basketball-predictions/',
      {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 2000,
        timeout: 300000
      }
    );
    
    await fs.writeFile(
      join(__dirname, '../public/dratings.md'),
      dratingsResult.markdown,
      'utf8'
    );
    console.log('✅ D-Ratings saved to dratings.md');
    results.dratings = true;
    
    // Summary
    console.log('\n========================================');
    console.log('✅ ALL CBB DATA FETCHED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nUpdated files:');
    console.log('  ✓ public/basketball_odds.md (OddsTrader)');
    console.log('  ✓ public/haslametrics.md (Ratings)');
    console.log('  ✓ public/dratings.md (Predictions)');
    console.log('\nNext steps:');
    console.log('  1. Review files to ensure data looks good');
    console.log('  2. git add public/basketball_*.md public/haslametrics.md public/dratings.md');
    console.log('  3. git commit -m "Update CBB data $(date +%Y-%m-%d)"');
    console.log('  4. git push && npm run deploy\n');
    
    return results;
    
  } catch (error) {
    console.error('\n❌ ERROR FETCHING CBB DATA:');
    console.error('========================');
    console.error(error.message);
    console.error('\nPartial results:', results);
    throw error;
  }
}

// Run the scraper
fetchBasketballData()
  .then(() => {
    console.log('🎉 CBB data fetch completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 CBB data fetch failed!');
    console.error('Please check the error above and try again.\n');
    process.exit(1);
  });
```

**Package.json Script:**
```json
"fetch-basketball": "node scripts/fetchBasketballData.js"
```

**Daily Usage:**
```bash
# Fetch CBB data
npm run fetch-basketball

# Review output
cat public/basketball_odds.md
cat public/haslametrics.md
cat public/dratings.md

# If looks good, commit and deploy
git add public/basketball*.md public/haslametrics.md public/dratings.md
git commit -m "Update CBB data $(date +%Y-%m-%d)"
git push
npm run deploy
```

**Data Flow:**
```
OddsTrader → basketball_odds.md → Parse odds → Market probabilities
D-Ratings → dratings.md → Parse predictions → Primary model (60%)
Haslametrics → haslametrics.md → Parse ratings → Validation (40%)
→ Weighted ensemble → Compare to market → Calculate edge → Assign grade (A+/A/B+/B)

Future: Add Your Model (30%) → 3-way ensemble
```

---

## 📝 DATA PARSERS (PHASE 3)

### Parser Files Needed

#### 1. `src/utils/basketballOddsParser.js`
**Purpose:** Parse OddsTrader NCAAB markdown into structured data

**What to Extract:**
```javascript
{
  awayTeam: "Duke",
  homeTeam: "UNC", 
  gameTime: "7:00 PM ET",
  spread: -4.5,
  spreadOdds: -110,
  total: 145.5,
  totalOdds: -110,
  awayML: -180,
  homeML: +155,
  sportsbooks: ['DraftKings', 'FanDuel', 'BetMGM']
}
```

**Example Structure:**
```javascript
export function parseBasketballOdds(markdown) {
  const games = [];
  const lines = markdown.split('\n');
  
  // Parse markdown structure from OddsTrader
  // Similar to parseMoneylineOdds() in NHL code
  // Extract team names, odds, spreads, totals
  
  return games;
}
```

#### 2. `src/utils/haslametricsParser.js`
**Purpose:** Parse Haslametrics ratings and predictions

**What to Extract:**
```javascript
{
  team: "Duke Blue Devils",
  offensiveEff: 118.5,    // Points per 100 possessions
  defensiveEff: 95.2,     // Points allowed per 100 possessions
  tempo: 72.1,            // Possessions per game
  rating: 28.3,           // Overall rating (OE - DE)
  rank: 5,                // National rank
  conference: "ACC",
  conferenceRank: 2
}
```

**Example Structure:**
```javascript
export function parseHaslametrics(markdown) {
  const teams = [];
  
  // Parse Haslametrics table structure
  // Extract efficiency ratings, tempo, ranks
  // Build team database
  
  return teams;
}

export function getGamePrediction(awayTeam, homeTeam, haslametricsData) {
  // Use tempo-free calculations
  // Predict score based on efficiency + tempo
  // Account for home court advantage
  
  return {
    awayScore: 72.5,
    homeScore: 75.8,
    awayWinProb: 0.42,
    homeWinProb: 0.58
  };
}
```

#### 3. `src/utils/dratingsParser.js`
**Purpose:** Parse D-Ratings predictions

**What to Extract:**
```javascript
{
  awayTeam: "Duke",
  homeTeam: "UNC",
  awayScore: 73,
  homeScore: 76,
  awayWinProb: 0.41,
  homeWinProb: 0.59,
  spread: -3.0,
  confidence: "Medium"
}
```

**Example Structure:**
```javascript
export function parseDRatings(markdown) {
  const predictions = [];
  
  // Parse D-Ratings prediction format
  // Extract win probabilities
  // Extract predicted scores
  
  return predictions;
}
```

#### 4. `src/utils/basketballEdgeCalculator.js`
**Purpose:** Calculate betting edges using 60/40 ensemble model

**Key Function:**
```javascript
export class BasketballEdgeCalculator {
  constructor(haslametricsData, dratingsData, oddsData) {
    this.haslametrics = haslametricsData;
    this.dratings = dratingsData;
    this.odds = oddsData;
  }
  
  calculateEnsemblePrediction(game) {
    // Get predictions from each source
    const dratePred = this.dratings.predict(game);     // 60% weight (primary)
    const haslaPred = this.haslametrics.predict(game); // 40% weight (validation)
    
    // 60/40 Weighted ensemble (Phase 2 - Initial)
    const ensembleAwayProb = 
      (dratePred.awayWinProb * 0.60) +
      (haslaPred.awayWinProb * 0.40);
    
    // Compare to market odds
    const marketProb = this.oddsToProb(game.awayML);
    
    // Calculate edge
    const edge = ensembleAwayProb - marketProb;
    const evPercent = (edge / marketProb) * 100;
    
    // Assign grade
    const grade = this.getGrade(evPercent);
    
    return {
      ensembleProb: ensembleAwayProb,
      marketProb: marketProb,
      edge: edge,
      evPercent: evPercent,
      grade: grade,
      confidence: this.getConfidence(edge),
      
      // Transparency: Show component predictions
      dratingsProb: dratePred.awayWinProb,
      haslametricsProb: haslaPred.awayWinProb
    };
  }
  
  getGrade(evPercent) {
    if (evPercent >= 5.0) return 'A+';
    if (evPercent >= 3.5) return 'A';
    if (evPercent >= 2.5) return 'B+';
    if (evPercent >= 1.5) return 'B';
    return 'C';
  }
}

// Future: Add your own model to ensemble
// calculateEnsemblePrediction_v2(game) {
//   const dratePred = this.dratings.predict(game);     // 40% weight
//   const haslaPred = this.haslametrics.predict(game); // 30% weight
//   const yourPred = this.yourModel.predict(game);     // 30% weight
//   
//   const ensembleAwayProb = 
//     (dratePred.awayWinProb * 0.40) +
//     (haslaPred.awayWinProb * 0.30) +
//     (yourPred.awayWinProb * 0.30);
//   ...
// }
```

### Integration Example

**How the parsers work together:**

```javascript
// 1. Load scraped data
const oddsMarkdown = await loadFile('public/basketball_odds.md');
const haslaMarkdown = await loadFile('public/haslametrics.md');
const drateMarkdown = await loadFile('public/dratings.md');

// 2. Parse each source
const games = parseBasketballOdds(oddsMarkdown);
const teams = parseHaslametrics(haslaMarkdown);
const predictions = parseDRatings(drateMarkdown);

// 3. Calculate edges for each game
const calculator = new BasketballEdgeCalculator(teams, predictions, games);

games.forEach(game => {
  const edge = calculator.calculateEnsemblePrediction(game);
  
  if (edge.grade === 'A+' || edge.grade === 'A' || edge.grade === 'B+') {
    // Display this game as a recommended bet
    console.log(`${game.awayTeam} @ ${game.homeTeam}`);
    console.log(`Edge: +${edge.evPercent.toFixed(1)}% | Grade: ${edge.grade}`);
  }
});
```

---

## 🔧 MAINTENANCE NOTES

### Daily Workflow (No Change)
Your existing workflow remains identical:
```bash
# Morning routine (same as before)
npm run fetch-data      # NHL odds and goalies
git add public/*.md public/*.json
git commit -m "Update NHL $(date +%Y-%m-%d)"
git push
npm run deploy
```

Basketball doesn't affect this until Phase 2.

### Future Daily Workflow (After Phase 2)
```bash
# NHL updates (same as before)
npm run fetch-data

# Basketball updates (new, optional)
npm run fetch-basketball

# Deploy both
git add public/*
git commit -m "Update NHL + CBB $(date +%Y-%m-%d)"
git push
npm run deploy
```

### Showing Basketball to Users (When Ready)

Simply add this to `src/components/Navigation.jsx`:

```javascript
<Link 
  to="/basketball"
  style={{
    color: location.pathname === '/basketball' ? '#F97316' : 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontWeight: location.pathname === '/basketball' ? '600' : '500'
  }}
>
  🏀 Basketball
</Link>
```

That's it! No other changes needed to make it public.

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues & Solutions

#### Issue: Basketball page shows blank white screen
**Symptoms:** URL loads but page is empty
**Solutions:**
1. Check browser console for errors (F12)
2. Verify Basketball.jsx was created correctly
3. Confirm import path in App.jsx is correct
4. Clear browser cache (Cmd+Shift+R)
5. Check if LoadingSpinner component exists

#### Issue: 404 error on basketball URL
**Symptoms:** "Page not found" when visiting /basketball
**Solutions:**
1. Verify route was added to App.jsx
2. Check route syntax: `<Route path="/basketball" element={<Basketball />} />`
3. Confirm deployed successfully (`npm run deploy`)
4. Wait 2-3 minutes for GitHub Pages to update
5. Clear browser cache

#### Issue: Navigation link appears (should be hidden)
**Symptoms:** Basketball link visible to users
**Solutions:**
1. Confirm you only modified App.jsx (NOT Navigation.jsx)
2. Check no conditional rendering was added
3. Search codebase for `/basketball` links
4. Redeploy if needed

#### Issue: NHL pages broken after deployment
**Symptoms:** Existing pages show errors
**Solutions:**
1. **IMMEDIATE:** Rollback deployment
   ```bash
   git revert HEAD
   git push origin main
   npm run deploy
   ```
2. Check what was changed (should only be 2 files)
3. Test locally before redeploying
4. Review Basketball.jsx for import conflicts

#### Issue: Build fails with errors
**Symptoms:** `npm run build` shows errors
**Solutions:**
1. Read error message carefully
2. Check for syntax errors in Basketball.jsx
3. Verify all imports are correct
4. Check for missing dependencies
5. Run `npm install` to ensure packages are installed

#### Issue: Styling doesn't match NHL theme
**Symptoms:** Basketball page looks different
**Solutions:**
1. Check CSS variables are imported
2. Verify `var(--color-background)` is used
3. Confirm LoadingSpinner is imported
4. Check browser dev tools for CSS issues

---

## 🎯 SUCCESS CRITERIA

### You'll know it worked when:

**For Users (External Perspective):**
1. ✅ All NHL pages work exactly as before
2. ✅ No visible changes to navigation
3. ✅ No mention of basketball anywhere
4. ✅ Site performance unchanged
5. ✅ Zero user complaints about changes

**For You (Internal Perspective):**
1. ✅ Basketball URL loads successfully
2. ✅ Game cards display properly
3. ✅ Theme matches NHL aesthetic
4. ✅ Can bookmark for easy access
5. ✅ Can iterate and develop privately

**Technical Validation:**
1. ✅ No console errors
2. ✅ Build succeeds without warnings
3. ✅ Lighthouse score unchanged
4. ✅ All tests pass
5. ✅ Git history clean

---

## 📊 IMPACT ANALYSIS

### Code Changes Summary
- **Files Created:** 1 (`Basketball.jsx`)
- **Files Modified:** 1 (`App.jsx`)
- **Lines Added:** ~352
- **Lines Modified:** 0
- **Lines Deleted:** 0
- **Risk Level:** 🟢 MINIMAL

### User Impact
- **Visible Changes:** None
- **Functional Changes:** None
- **Performance Impact:** None
- **Breaking Changes:** None

### Development Impact
- **Build Time:** No change
- **Bundle Size:** +15KB (basketball page)
- **Dependencies:** None added
- **Maintenance:** No additional burden until Phase 2

---

## 📝 NOTES & CONSIDERATIONS

### Why This Approach Works
1. **Isolation:** Basketball is completely separate from NHL
2. **Safety:** Can't break existing functionality
3. **Flexibility:** Easy to iterate and test
4. **Reversibility:** Can remove in 5 minutes
5. **Scalability:** Foundation for future sports

### Alternative Approaches Considered
1. **Separate repository** - Rejected (too complex)
2. **Feature flag system** - Rejected (overkill)
3. **Admin panel** - Rejected (unnecessary)
4. **Secret URL parameter** - Rejected (confusing)
5. **Direct URL (chosen)** - Simple and effective

### Key Decisions Made
1. No navigation link (hidden by default)
2. Orange/purple theme (distinct from NHL green/blue)
3. Mock data initially (real data in Phase 2)
4. Same repo (easier maintenance)
5. Gradual rollout (phases 1-6)
6. **Data Sources Selected:**
   - **OddsTrader** for betting odds ([source](https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money))
   - **Haslametrics** for team ratings/efficiency ([source](https://haslametrics.com/))
   - **D-Ratings** for predictions ([source](https://www.dratings.com/predictor/ncaa-basketball-predictions/))
7. **Ensemble Model Weights (Initial):**
   - **60% D-Ratings** (primary predictions)
   - **40% Haslametrics** (tempo-free validation)
   - Build your own model later for 3-way ensemble

### Security Considerations
- Page is public but not linked
- No sensitive data exposed
- No authentication required initially
- Can add access control later if needed

---

## 🎓 LEARNING RESOURCES

### If You Need to Understand:

**React Router:**
- How routes work: https://reactrouter.com/
- Hash routing: Why we use `#/basketball`

**React Components:**
- Component structure
- Props and state
- Hooks (useState, useEffect)

**Styling:**
- Inline styles in React
- CSS variables
- Responsive design

**Git Workflow:**
- Branching strategies
- Commit best practices
- Rollback procedures

---

## 📅 TIMELINE ESTIMATE

### Optimistic (Everything goes right)
- **Total Time:** 1 hour
- Planning: 15 min (reading this doc)
- Implementation: 20 min
- Testing: 15 min
- Deployment: 10 min

### Realistic (Some troubleshooting)
- **Total Time:** 1.5-2 hours
- Planning: 20 min
- Implementation: 30 min
- Testing: 25 min
- Troubleshooting: 15 min
- Deployment: 15 min

### Pessimistic (Issues encountered)
- **Total Time:** 3 hours
- Planning: 30 min
- Implementation: 45 min
- Testing: 30 min
- Troubleshooting: 45 min
- Deployment: 30 min

---

## 🎉 COMPLETION CRITERIA

Mark this plan complete when:
- [x] Planning document created ← YOU ARE HERE
- [ ] Basketball.jsx file created
- [ ] App.jsx updated with route
- [ ] Tested locally (all checks pass)
- [ ] Committed to git
- [ ] Deployed to production
- [ ] Verified in production
- [ ] Basketball URL bookmarked
- [ ] Ready for Phase 2 development

---

## 📧 NEXT STEPS

**After completing this plan:**
1. Review this document thoroughly
2. Decide when to implement (schedule 1-2 hours)
3. Follow implementation steps exactly
4. Test thoroughly before deploying
5. Bookmark basketball URL for easy access
6. Begin Phase 2 planning when ready

**Questions before starting?**
- Review the troubleshooting section
- Check the testing protocol
- Understand the rollback plan
- Ensure you have 1-2 hours available

---

**Document Version:** 1.0  
**Last Updated:** November 24, 2025  
**Status:** Ready for Implementation  
**Approved By:** Dale Kolnitys

---

## APPENDIX A: Basketball.jsx Full Code

See separate file or implementation guide for complete Basketball.jsx code (~350 lines).

Key sections:
- Imports and dependencies
- Mock game data
- Main Basketball component
- StatCard helper component
- RoadmapItem helper component
- BasketballGameCard component
- Styling and responsive design

---

## APPENDIX B: Data Source Summary

### Quick Reference: CBB Data Sources

| Source | URL | Data Provided | Update Frequency | Role in Model |
|--------|-----|---------------|------------------|---------------|
| **OddsTrader** | [Link](https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money) | Betting odds, spreads, totals | Real-time | Market probability baseline |
| **D-Ratings** | [Link](https://www.dratings.com/predictor/ncaa-basketball-predictions/) | Win probabilities, predictions | Daily | **Primary predictions (60%)** |
| **Haslametrics** | [Link](https://haslametrics.com/) | Efficiency ratings, tempo metrics | Daily | **Tempo-free validation (40%)** |

### Files Created in Phase 2

```bash
# Data files (scraped markdown)
public/basketball_odds.md        # From OddsTrader
public/haslametrics.md           # From Haslametrics
public/dratings.md               # From D-Ratings

# Parser utilities
src/utils/basketballOddsParser.js      # Parse OddsTrader markdown
src/utils/haslametricsParser.js        # Parse Haslametrics data
src/utils/dratingsParser.js            # Parse D-Ratings predictions
src/utils/basketballEdgeCalculator.js  # Ensemble model & edge calc

# Data fetching script
scripts/fetchBasketballData.js   # Firecrawl scraper for all 3 sources
```

### Ensemble Model Formula (Phase 2 - Initial)

```
Calibrated Win Probability = 
  (D-Ratings × 0.60) +      ← Primary predictions
  (Haslametrics × 0.40)     ← Tempo-free validation

Market Probability = Convert odds to implied probability

Edge = Calibrated Probability - Market Probability

EV% = (Edge / Market Probability) × 100

Grade Assignment:
  A+ → EV ≥ 5.0%
  A  → EV ≥ 3.5%
  B+ → EV ≥ 2.5%
  B  → EV ≥ 1.5%
  C  → EV < 1.5% (filtered out)
```

### Future Ensemble (Phase 3+)

```
Calibrated Win Probability = 
  (D-Ratings × 0.40) +
  (Haslametrics × 0.30) +
  (Your Model × 0.30)
```

---

END OF PLANNING DOCUMENT

