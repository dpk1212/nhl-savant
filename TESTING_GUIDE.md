# 🧪 Testing Guide - Timezone Fix Validation

This guide will help you validate that the timezone fix is working correctly.

---

## 🎯 Quick Test Checklist

- [ ] Hot Takes visible before 8 PM ET
- [ ] Hot Takes visible after 8 PM ET (CRITICAL TEST)
- [ ] Hot Takes visible after 11 PM ET
- [ ] Firebase cache keys use ET dates
- [ ] Console shows correct timezone logging
- [ ] No "No cached document found" errors

---

## 📋 Test Procedure

### Test 1: Verify Date Utility Functions

Open browser console and run:

```javascript
// Import and test the date utility
import { getETDate, getETDateTime, logDateDebug } from './src/utils/dateUtils.js';

// Test 1: Get ET date
console.log('ET Date:', getETDate());
// Should show today's date in ET (not UTC)

// Test 2: Get detailed ET time
console.log('ET DateTime:', getETDateTime());
// Should show current ET hour, minute, etc.

// Test 3: Debug logging
logDateDebug('Manual Test');
// Should show UTC vs ET comparison
```

### Test 2: Hot Takes Visibility Test

**Time**: After 8 PM ET (9 PM, 10 PM, or 11 PM)

1. Open NHL Savant website
2. Navigate to "Hot Takes" page
3. Select any game (e.g., PIT @ TOR)
4. **Expected**: Hot Takes cards load successfully
5. **Check Console**: Look for:
   ```
   🔍🔍🔍 FIREBASE QUERY FOR HOT TAKES 🔍🔍🔍
      Away Team: PIT
      Home Team: TOR
      Cache Key: PIT-TOR-2025-11-03  ← Should be ET date
      Collection: perplexityCache
   🕐 Hot Takes Lookup:
      UTC Date: 2025-11-04
      ET Date:  2025-11-03  ← Should differ from UTC after 8 PM
      ℹ️ Using ET date instead of UTC to match GitHub Action cache keys
   ✅ Found cached document!
   ```

6. **If Error**: Should NOT see:
   ```
   ❌ No cached document found at: PIT-TOR-2025-11-04
   ```

### Test 3: Firebase Console Validation

1. Open Firebase Console: https://console.firebase.google.com
2. Navigate to: Firestore Database → `perplexityCache` collection
3. Look for document IDs
4. **Expected Format**: `PIT-TOR-2025-11-03` (ET date, not UTC)
5. **Timestamp Check**: Document timestamp should match ET date in ID

**Example Documents to Look For:**
```
PIT-TOR-2025-11-03          ← Main hot takes
PIT-TOR-2025-11-03-bet-hook ← Bet hook
PIT-TOR-2025-11-03-full-story ← Full story
starting-goalies-2025-11-03  ← Goalie data
```

### Test 4: GitHub Action Validation

1. Go to: https://github.com/dpk1212/nhl-savant/actions
2. Click: "Generate Expert Analysis" workflow
3. Check latest run (should run at 9 AM ET and 2 PM ET daily)
4. Open logs and verify:
   ```
   🕐 GitHub Action - getTodaysGames:
      UTC Date: 2025-11-04
      ET Date:  2025-11-03
   🔍 Looking for games on: 11/3/2025 (ET)
   📝 Cache key: PIT-TOR-2025-11-03
      ℹ️ UTC date (2025-11-04) differs from ET date (2025-11-03)
   ```

### Test 5: Manual Trigger Test

**Trigger GitHub Action manually** to generate new cache:

1. Go to: https://github.com/dpk1212/nhl-savant/actions
2. Click: "Generate Expert Analysis"
3. Click: "Run workflow" → Select "main" branch → "Run workflow"
4. Wait for completion (~2-3 minutes)
5. Check Firebase for new documents with ET dates
6. Refresh website and verify Hot Takes load

### Test 6: Cross-Timezone Test

**If you have access to a server in a different timezone:**

```bash
# SSH into server
ssh your-server

# Run local test
cd nhl-savant
node -e "
const { getETDate } = require('./src/utils/dateUtils.js');
console.log('Server timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('ET Date:', getETDate());
console.log('UTC Date:', new Date().toISOString().split('T')[0]);
"
```

**Expected**: ET date should be consistent regardless of server timezone.

---

## 🔍 What to Look For

### ✅ Success Indicators

1. **Hot Takes Load**: Cards display with content
2. **Console Logs**: Show ET dates in cache keys
3. **Firebase Docs**: Document IDs match ET dates
4. **No Errors**: No "cached document not found" errors
5. **Timezone Warning**: If UTC ≠ ET, see informational log (not error)

### ❌ Failure Indicators

1. **"Waiting for Expert Articles"**: Content not loading
2. **Console Error**: "No cached document found at: [UTC-DATE]"
3. **Firebase Mismatch**: Document IDs use UTC dates instead of ET
4. **GitHub Action Error**: Script fails or uses wrong dates

---

## 🐛 Troubleshooting

### Issue: Hot Takes Still Not Loading After 8 PM

**Check 1**: Verify dateUtils.js is being imported
```javascript
// In browser console
import { getETDate } from './src/utils/dateUtils.js';
console.log('Can import:', typeof getETDate === 'function');
```

**Check 2**: Verify GitHub Action ran today
- Go to Actions tab
- Check latest run timestamp
- Verify it completed successfully

**Check 3**: Clear browser cache
```javascript
// In console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Check 4**: Check Firebase rules
- Ensure read access is enabled for `perplexityCache` collection

### Issue: GitHub Action Creates Wrong Cache Keys

**Check 1**: Verify script has correct import
```bash
cat scripts/generateExpertAnalysis.js | grep "dateUtils"
# Should show: import { getETDate, formatDateForSchedule, logDateDebug } from '../src/utils/dateUtils.js';
```

**Check 2**: Re-run action manually
- Sometimes first run after deploy needs manual trigger

**Check 3**: Check action environment
```yaml
# In .github/workflows/generate-expert-analysis.yml
# Should have timezone set to America/New_York
```

### Issue: Console Shows Wrong Dates

**Check**: Verify your local machine timezone
```javascript
console.log('Your timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('ET Date:', new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
```

---

## 📊 Success Metrics

After testing, verify these metrics:

| Metric | Before Fix | After Fix | Status |
|--------|-----------|-----------|--------|
| Hot Takes at 9 PM ET | ❌ Not loading | ✅ Loading | |
| Hot Takes at 10 PM ET | ❌ Not loading | ✅ Loading | |
| Hot Takes at 11 PM ET | ❌ Not loading | ✅ Loading | |
| Cache hit rate | ~60% | ~100% | |
| Console errors | Frequent | None | |
| User reports | Multiple | None | |

---

## 📝 Test Results Template

Copy this template and fill in your results:

```
# Timezone Fix Test Results

**Test Date**: [DATE]
**Test Time**: [TIME] ET
**Tester**: [NAME]

## Test 1: Date Utility ✅ / ❌
- getETDate(): [RESULT]
- getETDateTime(): [RESULT]
- logDateDebug(): [RESULT]

## Test 2: Hot Takes Visibility ✅ / ❌
- Before 8 PM: [RESULT]
- After 8 PM: [RESULT]
- After 11 PM: [RESULT]
- Console logs: [RESULT]

## Test 3: Firebase Console ✅ / ❌
- Cache keys format: [RESULT]
- Date consistency: [RESULT]

## Test 4: GitHub Action ✅ / ❌
- Logs show ET dates: [RESULT]
- Cache created successfully: [RESULT]

## Test 5: Manual Trigger ✅ / ❌
- Action completed: [RESULT]
- Cache updated: [RESULT]
- Website updated: [RESULT]

## Issues Found
[LIST ANY ISSUES]

## Overall Status
✅ PASS / ❌ FAIL

## Notes
[ADDITIONAL NOTES]
```

---

## 🎉 Final Validation

Once all tests pass:

1. ✅ Mark test-validation todo as complete
2. ✅ Update TIMEZONE_FIX_COMPLETE.md with test results
3. ✅ Monitor for 24 hours to ensure stability
4. ✅ Check user feedback/reports

---

**Last Updated**: November 4, 2025  
**Status**: Ready for Testing

