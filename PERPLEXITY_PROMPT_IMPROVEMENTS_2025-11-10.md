# Perplexity Prompt Improvements - November 10, 2025

## 🎯 Goal
1. Strengthen anti-hallucination rules and humanize the content
2. **🚨 CRITICAL FIX:** Ensure AI writes about the CORRECT team (was recommending wrong team!)

## ❌ CRITICAL BUG FIXED
**Problem:** AI narratives were recommending the OPPOSITE team from our model's pick!
- Example: Model picks Nashville +158, but AI writes about why Rangers should win
- This completely undermines credibility and confuses users

**Root Cause:** Prompts didn't explicitly state which team we're betting on. AI was analyzing matchups generically and writing about whichever team it thought was "better" rather than explaining our specific pick.

**Solution:** Added explicit "🎯 WE ARE BETTING ON: [TEAM]" markers and instructions throughout prompts.

## 📝 Changes Made

### 1. **Matchup Insight Cards (Hot Takes)** - `generateAnalysis()`

#### Anti-Hallucination Improvements:
- ✅ Changed from "STRICTLY ENFORCE" to **"ZERO TOLERANCE"** with emoji warnings (🚨🚨🚨)
- ✅ Added explicit **FORBIDDEN list** with ❌ symbols for visibility:
  - Never cite specific player stats unless verifiable RIGHT NOW
  - Never invent team records, win/loss streaks, or recent game scores
  - Never make up injuries, line changes, or roster moves
  - Never fabricate "according to" statements or fake citations
  - Never invent shooting percentages, save percentages, or statistical data
  - Never create fake recent game narratives
- ✅ Added **"WHAT TO DO INSTEAD"** section with ✅ symbols showing alternatives:
  - Focus on general team trends you can verify
  - Discuss matchup dynamics without specific numbers
  - Use conditional language ("tends to", "has been")
  - When in doubt, be more general
- ✅ Added explicit instruction: **"IF YOU CANNOT VERIFY A STAT OR FACT, DO NOT INCLUDE IT. WRITE AROUND IT."**
- ✅ Strengthened examples with "BAD HOOKS" section showing what NOT to do

#### Humanization Improvements:
- ✅ Added **"WRITING STYLE - HUMANIZE THE CONTENT"** section at the top
- ✅ Explicit instructions to write like "a knowledgeable hockey fan texting a friend, NOT a corporate analyst"
- ✅ Encouraged conversational language: "look", "here's the thing", "honestly"
- ✅ Encouraged contractions (don't, it's, there's)
- ✅ Told to avoid buzzwords and corporate-speak
- ✅ Updated examples to sound more human:
  - ✅ GOOD: "Look, the betting public is way off on Toronto's road game..."
  - ❌ BAD: "Statistical analysis indicates favorable positioning..." (robotic)
  - ❌ BAD: "Both teams are trending upward based on recent performance metrics" (corporate nonsense)
- ✅ Updated system prompt to emphasize: **"WRITE LIKE A HUMAN, not a robot"**

---

### 2. **Bet Hook** - `generateBetHook()` 🚨 CRITICAL FIX APPLIED

#### ❌ Wrong Team Bug Fix:
- ✅ Added **"🎯 WE ARE BETTING ON: [TEAM] (AWAY/HOME)"** header
- ✅ Changed "KEY FACTORS FROM OUR MODEL" to **"KEY FACTORS WHY [TEAM] HAS VALUE"**
- ✅ Added explicit warning section: **"🚨 CRITICAL - YOU MUST EXPLAIN WHY [TEAM] IS THE PLAY"**
- ✅ Instructions now specify: "Your hook must be about why [TEAM] has betting value"
- ✅ Added: "DO NOT write about why [OTHER TEAM] is better"
- ✅ Updated system prompt: **"You MUST explain why the SPECIFIC TEAM mentioned in 'WE ARE BETTING ON' has value"**

#### Anti-Hallucination Improvements:
- ✅ Changed to **"ZERO TOLERANCE FOR HALLUCINATION"**
- ✅ Explicitly forbids:
  - Mentioning percentages, probabilities, EV figures
  - Adding player names, team records, injuries, recent game results
  - ANY data not explicitly in the provided factors list
- ✅ Added: **"If it's not in the factors, don't write it"**

#### Humanization Improvements:
- ✅ Added **"WRITING STYLE - SOUND HUMAN"** section
- ✅ Instruction to write like "explaining value to a sharp bettor friend, NOT writing a research report"
- ✅ Encouraged casual language: "look", "here's the thing", "honestly"
- ✅ Updated example to sound more natural: "Look, the market's sleeping on..."
- ✅ Updated system prompt: **"WRITE LIKE A HUMAN - use contractions, casual phrases, varied sentence structure"**

---

### 3. **Full Story** - `generateFullStory()` 🚨 CRITICAL FIX APPLIED

#### ❌ Wrong Team Bug Fix:
- ✅ Added **"🎯 WE ARE BETTING ON: [TEAM] (AWAY/HOME)"** header at the top
- ✅ Changed "KEY FACTORS FROM OUR MODEL" to **"KEY FACTORS WHY [TEAM] HAS VALUE"**
- ✅ Added explicit warning section: **"🚨 CRITICAL - YOU MUST EXPLAIN WHY [TEAM] IS THE PLAY"**
  - "Your entire analysis must be about why [TEAM] has betting value"
  - "DO NOT write about why [OTHER TEAM] is the better team"
  - "DO NOT analyze the matchup generically - explain specifically why [TEAM] creates value"
  - "If you write about the wrong team, this narrative is useless"
- ✅ All paragraph instructions now specify team: "Explain why [TEAM] sees value..." "Supporting context about [TEAM]'s advantages..."
- ✅ Updated system prompt: **"You MUST explain why the SPECIFIC TEAM mentioned in 'WE ARE BETTING ON' has value. Writing about the wrong team makes your analysis worthless."**

#### Anti-Hallucination Improvements:
- ✅ Changed to **"ZERO TOLERANCE"**
- ✅ Explicit forbidden list:
  - No percentages, EV%, win probabilities, or stats
  - No player names, team records, recent game results not in factors
  - No invented shooting/save percentages
  - No fake recent game narratives
- ✅ Added: **"If it's not explicitly in the factors list, don't mention it"**

#### Humanization Improvements:
- ✅ Added **"WRITING STYLE - HUMANIZE THE CONTENT"** section
- ✅ Instruction to write like "explaining a bet to a sharp friend over drinks, NOT writing a corporate report"
- ✅ Encouraged conversational phrases: "look", "here's the thing", "honestly", "the market's missing"
- ✅ Emphasized: "Be confident and opinionated, but sound natural"
- ✅ Tone guidance: "Confident sharp bettor talking to another sharp, NOT a textbook"
- ✅ Updated example to sound conversational: "Look, our model's picking up on something the market's completely missing here..."
- ✅ Updated system prompt: **"WRITE LIKE A REAL HUMAN"** with emphasis on natural language

---

## 🎯 Expected Impact

### 🚨 Wrong Team Bug Fix (CRITICAL):
1. **✅ Narratives now match our picks** - AI will explain why our ACTUAL pick has value
2. **✅ No more contradictions** - Won't write about Rangers when we're betting Nashville
3. **✅ Restored credibility** - Users won't be confused by mismatched recommendations
4. **✅ Consistent messaging** - "THE BET" and "THE FULL STORY" now align perfectly
5. **🎯 This was the most important fix** - Without this, AI narratives were actively harmful

### Anti-Hallucination:
1. **Reduced false claims** - AI will avoid inventing stats it can't verify
2. **Better source grounding** - Will stick to verifiable, general matchup analysis
3. **No fake data** - Won't fabricate player stats, team records, or recent game results
4. **Safer content** - Less risk of publishing inaccurate information

### Humanization:
1. **More engaging** - Content sounds like it's written by a human, not a bot
2. **Better readability** - Varied sentence structure, contractions, casual phrases
3. **More shareable** - Natural, conversational tone is more likely to be shared
4. **Brand authenticity** - Sounds like expert analysis, not generic AI output

---

## 📊 Testing Recommendation

After deploying these changes:
1. **🚨 PRIORITY: Check team alignment** - Verify AI narratives match the actual model picks (not opposite team!)
2. **Monitor next day's generated content** (GitHub Action runs at 9 AM ET)
3. **Check for hallucinations** - Review if any stats/claims seem fabricated
4. **Assess tone** - Does it sound human or still robotic?
5. **User feedback** - Do users engage more with the new style?

**Before this fix:** Users saw "Best Value: NSH +158" but read analysis about why Rangers should win ❌
**After this fix:** Users see "Best Value: NSH +158" and read analysis about why Nashville has value ✅

---

## 🔍 Key Files Modified

- `/scripts/generateExpertAnalysis.js`
  - Line 177-241: `generateAnalysis()` prompt (matchup insights)
  - Line 253-256: System prompt for matchup insights
  - Line 418-446: `generateBetHook()` prompt
  - Line 458-461: System prompt for bet hook
  - Line 523-560: `generateFullStory()` prompt
  - Line 572-575: System prompt for full story

---

## ✅ Next Steps

1. **Push changes to GitHub** - Deploy the updated prompts
2. **Monitor tomorrow's content** - Check quality after 9 AM ET run
3. **Gather feedback** - See if users respond better to the human tone
4. **Iterate if needed** - Fine-tune prompts based on results

