# Perplexity Anti-Hallucination Audit - November 2025

## 🚨 Critical Issue Identified

**Problem:** The Hot Takes prompt was asking Perplexity to "use player names, recent stats (last 3-5 games), and specific numbers" **WITHOUT providing any actual data**. This was encouraging the AI to hallucinate stats!

## ✅ Solutions Implemented

### 1. **HOT TAKES (generateAnalysis)** - MOST CRITICAL FIX

**File:** `scripts/generateExpertAnalysis.js` (Line 177-243)

**Changes:**
- ✅ Added strict **"🚨 ANTI-HALLUCINATION RULES"** section to prompt
- ✅ Requires source citation for any specific numbers (e.g., "according to DailyFaceoff...")
- ✅ Explicitly prohibits fabricating:
  - Player stats, team records, recent game results
  - Injuries, line changes, roster moves
- ✅ Instructions to focus on **VERIFIABLE** matchup dynamics over made-up numbers
- ✅ Updated system message: *"CRITICAL: Never fabricate stats, player data, or game results. Only cite information you can verify from current, reliable sources."*
- ✅ Temperature: Kept at 0.7 (balanced creativity and control)

**Example Before:**
```
"Use player names, recent stats (last 3-5 games), and specific numbers"
```

**Example After:**
```
"ONLY cite stats you can verify from current, reliable sources
If you cannot verify a stat, DO NOT include it
Cite your source for any specific numbers"
```

---

### 2. **BET HOOK (generateBetHook)** - STRENGTHENED

**File:** `scripts/generateExpertAnalysis.js` (Line 369-451)

**Changes:**
- ✅ Strengthened system message with **🚨 ANTI-HALLUCINATION** warning
- ✅ Explicit prohibition: *"DO NOT add player names, team records, recent results, or any data not in the provided factors"*
- ✅ Lowered temperature from **0.8 → 0.7** (more deterministic, less creative hallucination)
- ✅ Reinforces: *"NEVER INVENT STATS—only use what is explicitly provided in the factors list"*

**Already Had (Good):**
```
"DO NOT reference any stats not in the factors (no records, shooting %, player names, recent results)."
```

**Now Even Stronger:**
```
"🚨 ANTI-HALLUCINATION: NEVER INVENT STATS—only use what is explicitly provided in the factors list. 
DO NOT add player names, team records, recent results, or any data not in the provided factors. 
If a factor is not provided, do not mention it."
```

---

### 3. **FULL STORY (generateFullStory)** - STRENGTHENED

**File:** `scripts/generateExpertAnalysis.js` (Line 453-558)

**Changes:**
- ✅ Strengthened system message with **🚨 ANTI-HALLUCINATION** warning
- ✅ Explicit list of prohibited fabrications:
  - Player names (unless in provided factors)
  - Team records
  - Shooting percentages
  - Recent game results
  - Injuries
- ✅ Lowered temperature from **0.7 → 0.6** (most conservative setting)
- ✅ Forces strict adherence: *"Stick strictly to the given data"*

**Already Had (Good):**
```
"DO NOT invent ANY stats: no team records, shooting percentages, recent game results, player stats."
```

**Now Even Stronger:**
```
"🚨 ANTI-HALLUCINATION: NEVER INVENT STATS—only use data explicitly provided in the factors list. 
DO NOT fabricate player names, team records, shooting percentages, recent game results, injuries, 
or any information not in the provided factors. Stick strictly to the given data."
```

---

## 📊 Temperature Settings (Creativity vs Determinism)

| Prompt Type | Old Temp | New Temp | Reasoning |
|-------------|----------|----------|-----------|
| Hot Takes | 0.7 | 0.7 | Balanced - needs creativity for engagement, but now with strict rules |
| Bet Hook | 0.8 | **0.7** ⬇️ | Reduced - should stick closer to provided factors |
| Full Story | 0.7 | **0.6** ⬇️ | Most conservative - longest content, highest hallucination risk |

**Lower temperature = More deterministic, less creative, less hallucination**

---

## 🎯 What This Fixes

### Before:
- ❌ Perplexity could invent player stats
- ❌ Could fabricate team records and recent results
- ❌ Could make up injuries or roster moves
- ❌ No requirement to verify information
- ❌ Encouraged using "specific numbers" without providing any

### After:
- ✅ Perplexity must verify stats from real sources (DailyFaceoff, NHL.com, beat reporters)
- ✅ Bet narratives strictly use **only** model-provided factors
- ✅ Cannot fabricate player performances or team records
- ✅ Must cite sources for any specific numbers
- ✅ If uncertain about a stat, focuses on matchup dynamics instead
- ✅ More trustworthy, verifiable analysis for users

---

## 🔒 Key Safeguards Now in Place

1. **Explicit DO NOT Lists:**
   - DO NOT invent player stats
   - DO NOT fabricate team records
   - DO NOT make up injuries or roster moves
   - DO NOT reference data not in provided factors

2. **Source Citation Requirement:**
   - "Cite your source for any specific numbers (e.g., 'according to DailyFaceoff...')"

3. **Verification Requirement:**
   - "ONLY cite stats you can verify from current, reliable sources"
   - "If you cannot verify a stat, DO NOT include it"

4. **Fallback Strategy:**
   - "If uncertain about a stat, focus on the matchup dynamic instead"

5. **Strict Adherence:**
   - "If a factor is not provided, do not mention it"
   - "Stick strictly to the given data"

---

## 📝 Testing Next Steps

To verify these changes work:

1. **Monitor Next GitHub Action Run:**
   - Check generated Hot Takes for source citations
   - Verify no fabricated stats appear
   - Ensure analysis focuses on verifiable information

2. **Review Generated Content:**
   - Look for phrases like "according to DailyFaceoff"
   - Check that player names are relevant to tonight's game
   - Verify no made-up records or recent results

3. **Manual Test (if needed):**
   ```bash
   cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
   node scripts/generateExpertAnalysis.js
   ```

---

## 📦 Commit Details

**Commit:** `958f074`
**Message:** "CRITICAL: Add anti-hallucination safeguards to Perplexity prompts"
**Files Changed:** `scripts/generateExpertAnalysis.js` (1 file, +26 insertions, -16 deletions)

---

## 🚀 Impact

- **Users:** Will see more trustworthy, verifiable analysis
- **Brand:** Protects NHL Savant's credibility
- **Legal:** Reduces risk of misinformation
- **Engagement:** Analysis is still engaging, but now grounded in reality

---

## ✅ Audit Complete

All three Perplexity prompts now have **strict anti-hallucination safeguards** in place:
- ✅ Hot Takes (generateAnalysis) - CRITICAL FIX
- ✅ Bet Hook (generateBetHook) - STRENGTHENED
- ✅ Full Story (generateFullStory) - STRENGTHENED

**Next AI generation will use these improved prompts.**

