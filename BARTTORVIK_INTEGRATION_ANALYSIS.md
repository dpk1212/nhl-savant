# Barttorvik Data Integration Analysis

## 📊 Executive Summary

**Goal:** Integrate Barttorvik advanced stats into the Model Breakdown section for each game to showcase matchup analytics.

**Current Status:**
- ✅ Barttorvik data: **365 teams** with comprehensive stats
- ✅ CSV mapping: **327 teams** (OddsTrader names)
- ⚠️ Direct matches: **232 teams** (63.5% coverage)
- ⚠️ Need mapping: **133 teams** (36.5% missing)

---

## 🎯 Available Barttorvik Data Points

### Key Metrics Per Team:
1. **T-Rank** (Overall ranking 1-365)
2. **Adjusted Offensive Efficiency** (Adj Off)
3. **Adjusted Defensive Efficiency** (Adj Def)
4. **Effective FG%** (eFG% - Offense & Defense)
5. **Turnover Rate** (TO% - Offense & Defense)
6. **Offensive Rebound%** (OReb%)
7. **Free Throw Rate** (FTRate)
8. **2P% and 3P%** (Shooting splits)

### Example Data (Georgia vs Florida State):
```
GEORGIA (#73):
- Adj Off: 117.7 (Rank: 37)
- Adj Def: 99.2 (Rank: 32)
- eFG%: 55.1 Off / 44.2 Def
- T-Rank: #73

FLORIDA STATE (#170):
- Adj Off: 109.9 (Rank: 119)
- Adj Def: 100.5 (Rank: 47)
- eFG%: 51.1 Off / 47.4 Def
- T-Rank: #170
```

---

## 🔧 Implementation Strategy

### Option 1: Add Barttorvik Column to CSV ✅ RECOMMENDED
**Pros:**
- Clean, maintainable mapping
- Easy to update when team names change
- Consistent with current CSV structure
- Fast lookup during bet generation

**Implementation:**
1. Add Column 9: `barttorvik_name`
2. Map naming differences (e.g., "Colorado State" → "Colorado St.")
3. Create parser: `barttorvik Parser.js`
4. Update `gameMatchingCSV.js` to include Barttorvik data

**CSV Structure (updated):**
```
oddstrader_name,haslametrics_name,dratings_name,full_name,conference,ncaa_name,verified,espn_name,barttorvik_name
Georgia,Georgia,Georgia Bulldogs,Georgia,SEC,Georgia,✓,Georgia,Georgia
Colorado State,Colorado State,Colorado State Rams,Colorado State,MWC,Colorado St.,✓,Colorado State,Colorado St.
```

### Option 2: Runtime Fuzzy Matching
**Pros:**
- No CSV changes needed

**Cons:**
- Slower performance
- Potential for incorrect matches
- Harder to debug
- Not recommended for production

---

## 📋 Naming Differences to Map

### Common Patterns:
1. **"State" → "St."**
   - Arizona State → Arizona St.
   - Colorado State → Colorado St.
   - Arkansas State → Arkansas St.

2. **"OH" vs "(OH)"**
   - Miami OH → Miami (OH) in CSV, but "Miami OH" in Barttorvik

3. **Abbreviations**
   - Penn State → Penn St.
   - Miami (FL) → Miami FL
   - Connecticut → UConn (sometimes)

### Missing from CSV (sample):
- Cal Baptist
- Cal St. Bakersfield
- Chicago St.
- East Texas A&M
- Many smaller D1 schools

---

## 💡 UI Display Mockup for Model Breakdown

### Current Model Breakdown:
```
Model Breakdown
├── D-Ratings: 65.0% win probability
├── Haslametrics: [metrics]
└── Ensemble Prediction: 64.7%
```

### Proposed with Barttorvik:
```
Model Breakdown
├── D-Ratings: 65.0% win probability
├── Haslametrics: [metrics]
├── Ensemble Prediction: 64.7%
└── Barttorvik Matchup Analysis ⭐ NEW
    ├── Team Rankings
    │   ├── Georgia: T-Rank #73
    │   └── Florida State: T-Rank #170
    │   └── Advantage: Georgia (+97 ranks)
    ├── Offensive Efficiency
    │   ├── Georgia: 117.7 (37th)
    │   └── Florida State: 109.9 (119th)
    │   └── Advantage: Georgia (+7.8 points)
    ├── Defensive Efficiency
    │   ├── Georgia: 99.2 (32nd) 
    │   └── Florida State: 100.5 (47th)
    │   └── Advantage: Georgia (better D)
    └── Key Matchup Factors
        ├── Georgia shoots 55.1% eFG vs FSU allows 47.4%
        ├── FSU turns ball over less (21.0%) vs Georgia forces 22.8%
        └── Pace: Georgia (slower) vs FSU (medium)
```

---

## 🚀 Recommended Implementation Plan

### Phase 1: CSV Mapping (2-3 hours)
1. Extract all 365 Barttorvik team names
2. Map to existing CSV (handle State→St., etc.)
3. Add `barttorvik_name` column (Column 9)
4. Verify all 50 today's games have Barttorvik mappings

### Phase 2: Parser Creation (1-2 hours)
1. Create `src/utils/barttorvik Parser.js`
2. Parse markdown table into structured JSON
3. Extract key metrics: T-Rank, Adj Off/Def, eFG%, etc.
4. Export parser function

### Phase 3: Integration (2-3 hours)
1. Update `gameMatchingCSV.js` to include Barttorvik lookup
2. Add Barttorvik data to matched games object
3. Pass data through to Firebase

### Phase 4: Frontend Display (3-4 hours)
1. Update Basketball game component
2. Add expandable "Barttorvik Analysis" section
3. Display key metrics with visual indicators
4. Show advantages/disadvantages

**Total Estimated Time: 8-12 hours**

---

## 📊 Data Quality Assessment

### Coverage Analysis:
- **Today's 50 Games:** Need to verify all teams are in Barttorvik
- **D1 Teams:** Barttorvik has 365, CSV has 327
- **Match Rate:** 63.5% direct, ~95% with mapping

### Data Freshness:
- Barttorvik updates: Daily
- Current file: Dec 2, 2025
- **Recommendation:** Add to daily FETCH action

---

## ✅ Next Steps

1. **Confirm Approach:** Do you want to proceed with Option 1 (CSV mapping)?
2. **Priority:** Which metrics matter most for display?
   - T-Rank (overall ranking)
   - Adj Efficiency (offensive/defensive strength)
   - eFG% (shooting efficiency)
   - Tempo/Pace
3. **UI Design:** Simple list or interactive visualizations?

---

## 🎨 UI Component Suggestions

### Compact View:
```
📊 Barttorvik: Georgia #73 vs Florida State #170
    Offensive Edge: Georgia (+7.8 AdjO)
    Defensive Edge: Georgia
```

### Expanded View:
- Bar charts for efficiency comparison
- Color-coded advantages (green/red)
- Tooltips explaining metrics
- Historical trend indicators

---

## 🔍 Sample Code Structure

```javascript
// barttorvik Parser.js
export function parseBarttorvik(markdown) {
  const teams = {};
  // Parse table rows
  // Extract: rank, team, adjOff, adjDef, eFG%, etc.
  return teams;
}

// gameMatchingCSV.js (updated)
export function matchGamesWithCSV(oddsGames, hasla, dratings, barttorvik, csv) {
  // ... existing code ...
  
  // Add Barttorvik lookup
  const barttName = getCSVValue(awayMapping, 'barttorvik_name');
  const awayBart = barttorvik[barttName];
  
  matchedGame.barttorvik = {
    away: awayBart,
    home: homeBart,
    rankDiff: awayBart.rank - homeBart.rank,
    offDiff: awayBart.adjOff - homeBart.adjDef,
    // ... more comparisons
  };
}
```

---

## ❓ Questions for You

1. **Scope:** Do you want Barttorvik for ALL games or just quality bets?
2. **Display:** Collapse/expand or always visible?
3. **Metrics:** Which 3-5 metrics are most important to show?
4. **Timing:** Implement now or after current issues are resolved?


