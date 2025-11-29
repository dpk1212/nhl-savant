# Basketball Teams CSV - Daily Update Guide

## 📊 Current Status: 362 Teams Mapped (100% Coverage for Nov 29, 2025)

## 🔄 How to Update This CSV Daily (IMPORTANT!)

### **Step 1: Run the Diagnostic Script**
```bash
node detailed_game_audit.js
```

This will show you which games are missing data. Look for:
- ❌ Teams "NOT FOUND in CSV"
- ❌ "No match found" (wrong mapping)

### **Step 2: Find the EXACT Names from Data Sources**

For each missing/incorrect team, search the scraped markdown files:

**For Haslametrics names:**
```bash
grep -i "TEAM_NAME" public/haslametrics.md | head -5
```

**For D-Ratings names:**
```bash
grep -i "TEAM_NAME" public/dratings.md | head -5
```

**For NCAA API names:**
```bash
# Check the NCAA API or use existing mappings as reference
```

### **Step 3: Add/Fix Rows in basketball_teams.csv**

**CSV Format:**
```csv
normalized_name,oddstrader_name,haslametrics_name,dratings_name,conference,ncaa_name,notes,espn_name
```

**Example of a NEW team:**
```csv
Detroit Mercy,Detroit Mercy,Detroit Mercy,Detroit Titans,TBD,Detroit Mercy,NEW,Detroit Mercy
```

**⚠️ CRITICAL RULES:**

1. **EXACT MATCH REQUIRED** - Copy names EXACTLY as they appear in sources
   - Haslametrics: `[Georgia](https://haslametrics.com/...)` → Use "Georgia"
   - D-Ratings: `[Georgia Bulldogs](...)` → Use "Georgia Bulldogs"

2. **CHECK FOR PARTIAL MATCHES** - Avoid these common errors:
   - ❌ "Georgia" mapping to "Georgia State" (different schools!)
   - ❌ "Indiana" mapping to "Indiana State" (different schools!)
   - ❌ "USC Upstate" mapping to "USC" (different schools!)
   - ❌ "Nebraska" mapping to "Nebraska-Omaha" (different schools!)
   
3. **MASCOT NAMES MATTER** - D-Ratings includes full mascots:
   - "Detroit Mercy" → "Detroit Titans" (not "Detroit Mercy Titans")
   - "Air Force" → "Air Force Falcons" (not just "Air Force")
   - "Buffalo" → "Buffalo Bulls" (not just "Buffalo")

4. **ABBREVIATIONS VARY** - Haslametrics uses short forms:
   - "University of Texas Arlington" → "UT Arlington"
   - "Southeast Missouri State" → "SE Missouri St." (capital SE!)
   - "Tennessee Tech" → "Tenn. Tech"

5. **NO DUPLICATES** - Before adding, check if team already exists:
   ```bash
   grep -i "TEAM_NAME" public/basketball_teams.csv
   ```

### **Step 4: Verify the Fix**

```bash
node detailed_game_audit.js | tail -5
```

Should show: `📊 FINAL COUNT: X out of X games can be bet on`

### **Step 5: Test End-to-End**

```bash
# Run the bet writing script (dry run)
node scripts/writeBasketballBets.js
```

Check that quality picks increase appropriately.

---

## 🛠️ Common Issues & Solutions

### Issue: "Missing Haslametrics name"
**Solution:** Search haslametrics.md for the team. Look for table rows with team links.

### Issue: "Missing D-Ratings name"
**Solution:** Search dratings.md for predictions involving that team.

### Issue: "No match found" (but both names exist)
**Solution:** Names don't match exactly. Check for:
- Extra mascot names (e.g., "Golden Eagles" vs "Golden")
- Abbreviations (e.g., "St." vs "State")
- Capitalization (e.g., "SE" vs "Se")

### Issue: Wrong team mapping
**Solution:** The CSV is using fuzzy matching. Add specific row for correct team before the wrong match.

---

## 📝 Today's Fixes (Nov 29, 2025)

### Fixed Wrong Mappings:
1. Georgia → Was "Georgia State", now "Georgia" (University of Georgia)
2. Nebraska → Was "Nebraska-Omaha", now "Nebraska"
3. USC Upstate → Was "USC", now "USC Upstate"
4. Indiana → Was "Indiana State", now "Indiana"
5. Utah State → Was "Utah", now "Utah State"
6. Arizona → Was "Arizona State", now "Arizona"
7. South Carolina State → Was "South Carolina", now "South Carolina State"

### Added Missing Teams (57 total):
- Detroit Mercy, UCF, Army, Boston University, James Madison
- George Mason, Dartmouth, Saint Peter's, Morehead State, IUPUI
- Southern University, Northwestern State, Western Carolina, High Point
- Bryant University, Delaware State, UMBC, Georgia Southern, Weber State
- Montana State, Elon, Norfolk State, Winthrop, East Tennessee State
- Howard, Mount St. Mary's, Cal State Fullerton, UC Riverside, Utah Tech
- Canisius, Sacred Heart, Milwaukee, Akron, Fordham, Sacramento State
- California Baptist, Oregon State, Niagara, Penn State, Indiana
- Stephen F. Austin, Pacific, Texas-Arlington
- Plus many D-Ratings name corrections

### Result:
- **Before:** 7 out of 43 games (16.3%)
- **After:** 43 out of 43 games (100%)

---

## 🎯 Best Practices

1. **Update daily BEFORE running bet writing script**
2. **Always verify with diagnostic script**
3. **Keep notes column updated** (mark new teams with "NEW")
4. **Never delete existing rows** (only add/correct)
5. **Test with small batches** (add 5-10 teams, then verify)

---

## 📞 Need Help?

Run this to see ALL unmapped teams:
```bash
node detailed_game_audit.js 2>&1 | grep "NOT FOUND"
```

Run this to see games with wrong mappings:
```bash
node detailed_game_audit.js 2>&1 | grep "No match found"
```

