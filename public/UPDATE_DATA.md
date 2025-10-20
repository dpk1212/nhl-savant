# How to Update NHL Data

## Quick Version

1. Get your new NHL CSV data
2. Name it: `nhl_data.csv`
3. Replace the file in this folder: `/nhl-savant/public/`
4. Open terminal and run:
   ```bash
   cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
   git add .
   git commit -m "Update NHL data"
   git push origin main
   ```
5. Done! Site updates in 2 minutes

## Details

### Where the CSV Lives
**File:** `/nhl-savant/public/nhl_data.csv`

This is the ONLY file you need to replace when updating data.

### Step-by-Step Update Process

#### Step 1: Prepare Your CSV
- Download fresh NHL data
- Ensure it has the same columns as the original
- Must be named: `nhl_data.csv` (no spaces, lowercase)

#### Step 2: Replace the File
- Navigate to: `/nhl-savant/public/`
- Delete old `nhl_data.csv`
- Copy new `nhl_data.csv` into this folder

#### Step 3: Push to GitHub
```bash
# Open Terminal and run:
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
git add .
git commit -m "Update NHL data - [DATE]"
git push origin main
```

#### Step 4: Wait for Deployment
- GitHub Pages will auto-deploy
- Takes 1-2 minutes
- Visit: https://dpk1212.github.io/nhl-savant/#/
- You'll see the updated data with green "Data Verified" badge

### What the App Does With Your Data

The app automatically:
1. **Reads the CSV** - Parses all rows
2. **Validates the data** - Checks for issues
3. **Calculates metrics:**
   - xG per 60 minutes
   - PDO (Puck Luck)
   - Shooting Efficiency
   - xG Differential
4. **Identifies opportunities:**
   - Regression candidates
   - Special teams mismatches
5. **Shows verification** - Green checkmark + data count

### Troubleshooting

**If data doesn't load:**
1. Check filename is `nhl_data.csv` (not with spaces)
2. Verify CSV has all expected columns
3. Look at browser console for errors

**If site doesn't update after push:**
1. Wait another minute
2. Hard refresh (Cmd+Shift+R on Mac)
3. Check GitHub Actions for build errors

### Questions?
All math is transparent. Click any metric to see the formula and calculation.
