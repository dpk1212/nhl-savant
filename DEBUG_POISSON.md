# Debugging Poisson Win Probability

## SEA @ WSH Example

**Predictions:**
- SEA (away): 2.5 goals
- WSH (home): 2.8 goals

### Manual Poisson Calculation

**Step 1: Calculate win probabilities**

For WSH (home) to win:
```
P(WSH > SEA) = sum of P(WSH=i) × P(SEA=j) for all i > j
```

Key score combinations:
- P(WSH=3, SEA=2) = Poisson(3, 2.8) × Poisson(2, 2.5) = 0.231 × 0.257 = 0.059
- P(WSH=4, SEA=3) = Poisson(4, 2.8) × Poisson(3, 2.5) = 0.162 × 0.214 = 0.035
- ... (many more combinations)

**Approximate total: WSH wins ~52-54% in regulation**

Ties go to OT/SO:
- P(tie) = ~18-20%
- OT/SO: WSH favored 54/46

**EXPECTED: WSH ~62-64% win prob, SEA ~36-38% win prob**

---

## The Current Bug

**In edgeCalculator.js line 76-78:**

```javascript
const homeWinProb = this.dataProcessor.estimateWinProbability(homeTeam, awayTeam, true);
const awayWinProb = 1 - homeWinProb;
```

**Problem:** The function `estimateWinProbability(team, opponent, isHome)` calculates from the FIRST team's perspective.

When called with `(homeTeam, awayTeam, true)`:
- Predicts: WSH 2.8, SEA 2.5
- Calculates: P(WSH wins)
- Returns: ~62%

Then: `awayWinProb = 1 - 0.62 = 0.38` ✅ **This part is correct!**

---

## Wait... Let Me Check the EV Calculation

**SEA @ WSH:**
- Market: SEA +215 (implied 31.7%)
- Model: SEA 38% win prob
- Expected EV: `(0.38 × 3.15 × 100) - 100 = 119.7 - 100 = +19.7%`

**But screenshot shows +44.3% EV!**

So the Poisson is returning **WAY TOO HIGH** of a win probability for SEA.

Let me check what's happening inside `estimateWinProbability`:

**Line 600-613:**
```javascript
for (let teamGoals = 0; teamGoals <= 10; teamGoals++) {
  const pTeam = this.poissonPMF(teamGoals, teamScore);
  
  for (let oppGoals = 0; oppGoals <= 10; oppGoals++) {
    const pOpp = this.poissonPMF(oppGoals, oppScore);
    const pCombo = pTeam * pOpp;
    
    if (teamGoals > oppGoals) {
      winProb += pCombo;  // Team wins in regulation
    } else if (teamGoals === oppGoals) {
      tieProb += pCombo;  // Goes to OT/SO
    }
  }
}

// OT advantage
const otAdvantage = teamScore > oppScore ? 0.54 : 0.46;
winProb += tieProb * otAdvantage;
```

**AH HA! LINE 617 - THE BUG!**

```javascript
const otAdvantage = teamScore > oppScore ? 0.54 : 0.46;
```

**For SEA @ WSH when called from away perspective:**
- `teamScore` = SEA = 2.5
- `oppScore` = WSH = 2.8
- `teamScore > oppScore` = FALSE
- `otAdvantage` = 0.46 ✅ Correct!

**But wait - let me check what we're ACTUALLY calling...**

**From edgeCalculator.js line 76:**
```javascript
const homeWinProb = this.dataProcessor.estimateWinProbability(homeTeam, awayTeam, true);
```

**This calls:**
- `team` = homeTeam (WSH)
- `opponent` = awayTeam (SEA)
- `isHome` = true

**Inside estimateWinProbability (lines 584-590):**
```javascript
if (isHome) {
  teamScore = this.predictTeamScore(teamCode, oppCode, true);   // WSH home
  oppScore = this.predictTeamScore(oppCode, teamCode, false);   // SEA away
} else {
  teamScore = this.predictTeamScore(teamCode, oppCode, false);  
  oppScore = this.predictTeamScore(oppCode, teamCode, true);    
}
```

So for WSH vs SEA:
- `teamCode` = WSH
- `oppCode` = SEA
- `teamScore` = predictTeamScore(WSH, SEA, true) = 2.8 ✅
- `oppScore` = predictTeamScore(SEA, WSH, false) = 2.5 ✅

Then the Poisson loop calculates:
- P(WSH > SEA) in regulation
- P(tie) × 0.54 (WSH favored in OT)

**This should give WSH ~62-64%**

Then: `awayWinProb = 1 - 0.62 = 0.38`

**Which should give SEA EV = +19.7%, not +44.3%!**

---

## THE ACTUAL BUG

Either:

1. **The Poisson calculation is returning the WRONG value** (too high for underdogs)
2. **The EV formula is wrong**
3. **The predicted scores are different than what's displayed**

Let me check if `predictTeamScore` is being called correctly...

**Actually - I think I see it now!**

Look at the screenshot:
- "31.7% implied → 45.8% model"

**45.8%** is way higher than my expected 38%!

So the Poisson IS returning too high of a probability for SEA.

**Possible causes:**
1. The `predictTeamScore` inside `estimateWinProbability` is using DIFFERENT values than what's displayed
2. The Poisson PMF function has a bug
3. The OT/SO advantage is too strong (should be 52/48, not 54/46)
4. The loop isn't summing correctly

---

## Most Likely Cause: DUPLICATE CALCULATION BUG

Remember from earlier - we had a bug where:
- `TodaysGames.jsx` was recalculating scores
- `edgeCalculator.js` was calculating different scores

**I bet `estimateWinProbability` is calling `predictTeamScore` with DIFFERENT parameters than the displayed values!**

The displayed values (2.5, 2.8) might not match what `estimateWinProbability` is actually using!

Let me check if starting goalies are being passed correctly...

