# Basketball Teams CSV - Daily Mapping Guide

**Last Updated:** December 3, 2025  
**Current Status:** 394+ teams mapped | 55/55 games with picks | 55/55 games with live scoring (100%)

---

## 🎯 THE NEW STREAMLINED PROCESS

Today we perfected the daily mapping workflow! Follow these 3 simple steps:

---

## STEP 1: Run Diagnostic Scripts 🔍

### Check Pick Generation (Are all games making picks?)

```bash
node scripts/diagnoseBasketballPicks.js
```

**What to look for:**
- `✅ Valid picks: X/12` - Should be 12/12
- `❌ Filtered out: Y/12` - Should be 0/12

**If any games are filtered out:**
- The script shows which teams are missing D-Ratings or Haslametrics data
- Example: `❌ Temple @ Villanova - Missing D-Ratings`

---

### Check D-Ratings Names (What are the exact names?)

```bash
node scripts/checkDRatingsParsing.js
```

**What this shows:**
- ALL team names from D-Ratings parser
- Win probabilities for verification
- Predicted scores

**Key insight:** D-Ratings includes mascots inconsistently!
- ✅ "Temple **Owls**" (has mascot)
- ✅ "Cincinnati **Bearcats**" (has mascot)
- ❌ "Alabama" (no mascot)

**Action:** Copy the EXACT name from this output into CSV column 4 (dratings_name)

---

### Check NCAA API Matching (Are live scores working?)

```bash
node scripts/checkNCAAMatching.js
```

**What to look for:**
- `✅ MATCHED - Live scores working` (good!)
- `❌ NOT MATCHED - No live scores` (needs fixing!)

**If games not matched:**
- Shows which teams need NCAA/ESPN names
- Lists exact mappings from CSV
- Identifies missing names

---

## STEP 2: Get Exact Team Names from Sources 📝

### For D-Ratings Names (Column 4):

```bash
node scripts/checkDRatingsParsing.js | grep -i "TEAM_NAME"
```

**Example:**
```
3. Temple Owls @ Villanova Wildcats
```
→ Use "Temple Owls" (not "Temple") in CSV

---

### For NCAA API Names (Column 6):

**Fetch today's NCAA API data:**
```bash
curl -s "https://ncaaproxy-lviwud3q2q-uc.a.run.app?date=YYYYMMDD" | python3 -m json.tool | grep -B5 "short"
```

Replace `YYYYMMDD` with today's date (e.g., `20251201` for Dec 1, 2025)

**What you'll see:**
```json
"names": {
    "short": "West Ga."
}
```

**Key insight:** NCAA API abbreviates heavily!
- "West Georgia" → **"West Ga."**
- "Middle Tennessee" → **"Middle Tenn."**
- "Incarnate Word" → **"UIW"**
- "McNeese State" → **"McNeese"**

**Action:** Copy the exact `"short"` name into CSV column 6 (ncaa_name)

---

### For Haslametrics Names (Column 3):

```bash
grep -i "TEAM_NAME" public/haslametrics.md | head -3
```

**What to look for:**
- Team links like: `[Temple](https://haslametrics.com/...)`
- Use the exact text between `[` and `]`

---

## STEP 3: Fix the CSV 🔧

### CSV Structure (8 columns):
```csv
normalized_name,oddstrader_name,haslametrics_name,dratings_name,conference,ncaa_name,notes,espn_name
```

### Example Fix:

**Before (broken):**
```csv
Temple,Temple,Temple,Temple,TBD,Temple,✓,Temple
```

**After (working):**
```csv
Temple,Temple,Temple,Temple Owls,TBD,Temple,✓,Temple
```

**What changed:** Column 4 (dratings_name) now has "Temple Owls" (with mascot)

---

## 🚨 CRITICAL RULES

### Rule 1: EXACT MATCH REQUIRED
- Copy names EXACTLY as parsers return them
- Capitalization matters!
- Spaces matter!
- Periods matter!

### Rule 2: Three Name Columns to Update

| Column | Source | Example | Common Mistakes |
|--------|--------|---------|-----------------|
| **3** | Haslametrics | `Temple` | Usually simple, but check for abbreviations |
| **4** | D-Ratings | `Temple Owls` | ⚠️ Includes mascots (sometimes!) |
| **6** | NCAA API | `Temple` | ⚠️ Heavily abbreviated! |

### Rule 3: Check for Duplicates FIRST

```bash
grep -i "TEAM_NAME" public/basketball_teams.csv
```

**If team exists:**
- ✅ Update the existing row
- ❌ DON'T add a new row (causes conflicts)

**If team is truly missing:**
- ✅ Add at end of file
- ✅ Mark with "NEW" in notes column

### Rule 4: Mascot Detection

D-Ratings is INCONSISTENT with mascots:

**WITH mascots:**
- "Temple Owls"
- "Cincinnati Bearcats"
- "Troy Trojans"
- "West Georgia Wolves"

**WITHOUT mascots:**
- "Alabama"
- "Kansas"
- "Texas"

**How to know:** Run `checkDRatingsParsing.js` and copy EXACTLY what you see!

### Rule 5: NCAA API Abbreviations

NCAA API loves abbreviations:

| Full Name | NCAA API Name |
|-----------|---------------|
| West Georgia | `West Ga.` |
| Middle Tennessee | `Middle Tenn.` |
| Incarnate Word | `UIW` |
| McNeese State | `McNeese` |
| Saint Francis | `Saint Francis` |
| North Alabama | `North Ala.` |

**How to know:** Check the NCAA API endpoint directly!

---

## STEP 4: Verify the Fixes ✅

### Test Pick Generation:
```bash
node scripts/diagnoseBasketballPicks.js | tail -10
```

**Expected:** `✅ Valid picks: 12/12`

### Test NCAA Matching:
```bash
node scripts/checkNCAAMatching.js | tail -10
```

**Expected:** `✅ Matched: 11/12 games` (or 12/12 if all games in NCAA API)

### Test End-to-End:
```bash
npm run write-basketball-bets
```

**Expected:** All 12 games should generate picks with proper unit allocation

---

## 📊 Today's Fixes (Dec 1, 2025)

### Problem 1: Missing D-Ratings Mappings (5 games)

**Root Cause:** CSV had names WITHOUT mascots, D-Ratings returns WITH mascots

**Fixed:**
1. Temple → **Temple Owls**
2. Bowling Green → **Bowling Green Falcons**
3. Jacksonville State → **Jacksonville State Gamecocks**
4. Cincinnati → **Cincinnati Bearcats**
5. Troy → **Troy Trojans**

**Result:** 7/12 → 12/12 games generating picks ✅

---

### Problem 2: Missing NCAA API Mappings (4 games)

**Root Cause:** CSV had full names, NCAA API returns abbreviated names

**Fixed:**
1. West Georgia → **West Ga.**
2. Middle Tennessee (MTSU) → **Middle Tenn.**
3. Incarnate Word → **UIW**

**Result:** 8/12 → 11/12 games with live scoring ✅

(South Carolina State @ Chicago State not in NCAA API today - not a mapping issue)

---

## 🛠️ Diagnostic Tools Reference

### Core Scripts (run these daily):

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `diagnoseBasketballPicks.js` | Shows which games generate picks | ALWAYS run first |
| `checkDRatingsParsing.js` | Shows exact D-Ratings names | When games filtered out |
| `checkNCAAMatching.js` | Shows NCAA API matching | When live scores missing |

### Helper Scripts:

| Script | Purpose |
|--------|---------|
| `testNCAANames.js` | Fetches live NCAA API data |
| `verifyTodaysMappings.js` | Verifies all teams exist in CSV |

---

## 🎯 Quick Reference: Common Fixes

### Haslametrics Abbreviations:
- "Southeast Missouri State" → `SE Missouri St.`
- "University of Massachusetts Lowell" → `UMass Lowell`
- "Jacksonville State" → `Jacksonville St.`

### D-Ratings Mascots:
- Run `checkDRatingsParsing.js` and copy EXACTLY what you see
- No pattern - some have mascots, some don't
- NEVER guess - always verify!

### NCAA API Abbreviations:
- Check endpoint: `https://ncaaproxy-lviwud3q2q-uc.a.run.app?date=YYYYMMDD`
- Look for `"names": { "short": "..." }`
- Common patterns: "St." for State, "Tenn." for Tennessee, acronyms for long names

---

## 📞 Troubleshooting

### Issue: "Only X/12 games generating picks"

**Solution:**
1. Run `diagnoseBasketballPicks.js`
2. Note which games are filtered out
3. Run `checkDRatingsParsing.js` to see exact names
4. Update CSV column 4 (dratings_name) with exact names
5. Re-run diagnostic

---

### Issue: "Live scores not working for some games"

**Solution:**
1. Run `checkNCAAMatching.js`
2. Note which games show "NOT MATCHED"
3. Fetch NCAA API: `curl -s "https://ncaaproxy-lviwud3q2q-uc.a.run.app?date=YYYYMMDD"`
4. Find the exact `"short"` names in the JSON
5. Update CSV column 6 (ncaa_name) with exact names
6. Re-run diagnostic

---

### Issue: "Duplicate team entries"

**Solution:**
1. Search CSV: `grep -i "TEAM_NAME" public/basketball_teams.csv`
2. If duplicate found, delete the old/incorrect row
3. Keep the row with most complete data
4. Never have multiple rows with same oddstrader_name (column 2)

---

## 🚀 Daily Workflow (The Easy Way!)

### Every Morning:

```bash
# 1. Fetch fresh data
npm run fetch-basketball

# 2. Check if all games work
node scripts/diagnoseBasketballPicks.js

# 3. If any issues, fix and verify
node scripts/checkDRatingsParsing.js  # for missing picks
node scripts/checkNCAAMatching.js      # for missing live scores

# 4. Update CSV as needed (see steps above)

# 5. Final verification
node scripts/diagnoseBasketballPicks.js | tail -5

# 6. Push to GitHub
git add public/basketball_teams.csv
git commit -m "Basketball CSV: Daily mapping update [DATE]"
git push origin main
```

**Expected Result:**
- ✅ 12/12 games generating picks
- ✅ 11-12/12 games with live scoring (depending on NCAA API coverage)
- ✅ All bets written to Firebase
- ✅ Site refreshes with new data

---

## 💡 Pro Tips

1. **Save time:** Run all diagnostic scripts FIRST before making any changes
2. **Verify sources:** Always check parser output, never guess names
3. **Test incrementally:** Fix 1-2 teams, test, then continue
4. **Keep notes:** Mark new teams with "NEW" in column 7
5. **Use grep:** Search CSV before adding any team to avoid duplicates

---

## 🎉 Success Metrics

You know the mapping is complete when:

- ✅ `diagnoseBasketballPicks.js` shows 12/12 valid picks
- ✅ `checkNCAAMatching.js` shows 11-12/12 matched games
- ✅ Site shows all 12 games with predictions
- ✅ Live scores appear during games (for matched teams)
- ✅ No console errors about missing teams

**That's it! You're done! 🏀**

