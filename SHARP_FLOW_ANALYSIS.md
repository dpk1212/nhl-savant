# SharpFlow Deep Dive Analysis

> **Dataset**: 305 all-time graded picks (184-121, 60.3% WR, +13.50u, +2.9% ROI)
> **Date Range**: March 16 – April 3, 2026
> **Sports**: NHL (130), MLB (82), CBB (71), NBA (22)
> **Last Updated**: April 4, 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [The 9 Key Variables](#the-9-key-variables)
3. [The 6 Lock Criteria](#the-6-lock-criteria)
4. [Sharp Count Analysis](#sharp-count-analysis)
5. [EV Edge Analysis](#ev-edge-analysis)
6. [Odds & Implied Probability](#odds--implied-probability)
7. [Head-to-Head: Opposition Analysis](#head-to-head-opposition-analysis)
8. [Flip Games (Both Sides Locked)](#flip-games-both-sides-locked)
9. [2-Way Combos](#2-way-combos)
10. [3-Way Combos](#3-way-combos)
11. [4-Way Combos](#4-way-combos)
12. [Correlation Matrix](#correlation-matrix)
13. [Star System Calibration](#star-system-calibration)
14. [Logistic Regression Model](#logistic-regression-model)
15. [Current rateStars() Audit](#current-ratestars-audit)
16. [Composite V2 Model](#composite-v2-model)
17. [Hypothetical Profit Simulations](#hypothetical-profit-simulations)
18. [Actionable Recommendations](#actionable-recommendations)

---

## Executive Summary

The current star rating system is the **17th most predictive feature out of 19** measured. It correlates at -0.04 with outcomes — effectively random with a slight negative bias (higher stars = slightly worse outcomes). The system over-weights Pinnacle confirmation and breadth while completely missing implied probability, opposition data, and EV thresholds — the three strongest actual predictors.

**Top 3 findings:**
1. **EV 1%+ is the single best signal**: 76.0% WR, +36.2% ROI (n=50)
2. **Opposition kills everything**: Clean games 63.1% WR vs contested 30.8% WR
3. **Pinnacle confirmation is a sell signal**: NO Pinn = 68.6% WR vs Pinn confirms = 56.0% WR

---

## The 9 Key Variables

### Individual Performance (305 picks)

| Rank | Variable | Best Bin | WR | ROI | Worst Bin | WR | ROI |
|------|----------|----------|-----|------|-----------|-----|------|
| 1 | **EV Edge** | EV 1%+ | **76.0%** | **+36.2%** | EV 0-1% | 52.8% | -15.0% |
| 2 | **Opposition** | Clean | **63.1%** | **+5.6%** | Contested | 30.8% | -34.3% |
| 3 | **Pinnacle** | NO Pinn | **68.6%** | **+13.2%** | Pinn confirms | 56.0% | -2.9% |
| 4 | **Line Moving** | NOT moving | **63.6%** | **+14.0%** | Line moving | 59.6% | +0.7% |
| 5 | **Time Before Game** | 12h+ early | **62.0%** | **+12.8%** | 4-12h | 46.2% | -21.5% |
| 6 | **Consensus** | DOMINANT | **57.1%** | **+10.8%** | STRONG | 56.7% | -13.9% |
| 7 | **Avg Bet Size** | $1-3K | **65.3%** | **+9.6%** | $3-5K | 53.7% | -5.5% |
| 8 | **Pred Market** | Pred aligns | 61.5% | +0.3% | No pred | 58.4% | +7.8% |
| 9 | **Money vs Opp** | Clean | 63.1% | +5.6% | Opp $ > ours | 25.0% | -56.5% |

### Detailed Breakdown

#### Time Before Game
```
<4h before game      29-18   61.7% |    0.59u | ROI:   1.0%  | n=47
4-12h before game    36-42   46.2% |  -21.05u | ROI: -21.5%  | n=78
12h+ before game     31-19   62.0% |    7.82u | ROI:  12.8%  | n=50
```

#### Avg Bet Size
```
avg <$1K             41-30   57.7% |    5.18u | ROI:   6.4%  | n=71
avg $1-3K            66-35   65.3% |   13.49u | ROI:   9.6%  | n=101
avg $3-5K            22-19   53.7% |   -3.78u | ROI:  -5.5%  | n=41
avg $5K+             55-37   59.8% |   -1.39u | ROI:  -0.8%  | n=92
```

#### Sharps vs Opponent
```
clean (no opp)      176-103  63.1% |   24.49u | ROI:   5.6%  | n=279
contested            8-18    30.8% |  -10.99u | ROI: -34.3%  | n=26
```

#### Money vs Opponent (when contested)
```
our $ > opp $         4-6    40.0% |    0.88u | ROI:   8.0%  | n=10
opp $ > ours          4-12   25.0% |  -11.87u | ROI: -56.5%  | n=16
```

#### Pinnacle Confirms
```
Pinn confirms       112-88   56.0% |   -8.78u | ROI:  -2.9%  | n=200
NO Pinnacle          72-33   68.6% |   22.28u | ROI:  13.2%  | n=105
```

#### Prediction Market Aligns
```
Pred aligns         118-74   61.5% |    0.92u | ROI:   0.3%  | n=192
NO Pred              66-47   58.4% |   12.58u | ROI:   7.8%  | n=113
```

#### EV Edge
```
EV 1%+               38-12   76.0% |   29.59u | ROI:  36.2%  | n=50
EV 0-1%              57-51   52.8% |  -24.98u | ROI: -15.0%  | n=108
EV ≤0                89-58   60.5% |    8.89u | ROI:   4.1%  | n=147
```

#### Line Moving With (RLM proxy)
```
Line moving WITH    149-101  59.6% |    2.87u | ROI:   0.7%  | n=250
Line NOT moving      35-20   63.6% |   10.63u | ROI:  14.0%  | n=55
```

#### Consensus Grade
```
DOMINANT             24-18   57.1% |    6.06u | ROI:  10.8%  | n=42
STRONG               38-29   56.7% |  -13.68u | ROI: -13.9%  | n=67
LEAN                 29-22   56.9% |    4.13u | ROI:   7.2%  | n=51
CONTESTED             9-10   47.4% |   -4.41u | ROI: -33.9%  | n=19
```

---

## The 6 Lock Criteria

Each criterion individually — MET vs NOT MET:

| Criteria | MET WR | MET ROI | NOT MET WR | NOT MET ROI | Delta WR | Delta ROI |
|----------|--------|---------|------------|-------------|----------|-----------|
| **$7K+ Invested** | **67.5%** | **+10.6%** | 55.7% | -5.1% | **+11.8%** | **+15.7%** |
| Pred Market | 61.5% | +0.3% | 58.4% | +7.8% | +3.1% | -7.5% |
| 3+ Sharps | 59.8% | +0.3% | **64.1%** | **+30.1%** | -4.3% | -29.8% |
| Line Moving | 59.6% | +0.7% | 63.6% | +14.0% | -4.0% | -13.3% |
| +EV Edge | 60.0% | +1.4% | 60.6% | +4.3% | -0.6% | -2.9% |
| **Pinnacle Confirms** | **56.0%** | **-2.9%** | **68.6%** | **+13.2%** | **-12.6%** | **-16.2%** |

**Only $7K+ Invested actually predicts wins.** Pinnacle confirmation is inversely correlated.

### Criteria Count

```
1/6 criteria    3-2    60.0% |    2.58u | ROI:  57.3%  | n=5
2/6 criteria   12-4    75.0% |   11.37u | ROI:  52.9%  | n=16
3/6 criteria   19-20   48.7% |   -9.21u | ROI: -21.2%  | n=39
4/6 criteria   92-48   65.7% |   23.25u | ROI:  12.2%  | n=140
5/6 criteria   55-38   59.1% |   -1.24u | ROI:  -0.7%  | n=93
6/6 criteria    3-9    25.0% |  -13.25u | ROI: -44.5%  | n=12
```

**Sweet spot: 4/6 criteria (65.7% WR, +12.2% ROI). Meeting all 6 is a death sentence (25% WR).**

---

## Sharp Count Analysis

```
1-2 sharps     25-14   64.1% |   12.40u | ROI:  30.1%  | n=39
3 sharps       31-16   66.0% |    8.10u | ROI:  15.3%  | n=47
4-5 sharps     45-28   61.6% |   12.82u | ROI:  12.3%  | n=73
6-7 sharps     35-31   53.0% |  -13.53u | ROI: -11.8%  | n=66
8-9 sharps     19-16   54.3% |  -14.61u | ROI: -23.2%  | n=35
10-12 sharps    8-11   42.1% |  -11.25u | ROI: -29.0%  | n=19
13+ sharps     21-5    80.8% |   19.57u | ROI:  37.3%  | n=26
```

**Sweet spot: 1-5 sharps. Danger zone: 6-12 sharps. 13+ rebounds (smaller, older sample).**

---

## EV Edge Analysis

```
EV < 0         89-58   60.5% |    8.89u | ROI:   4.1%  | n=147
EV 0-1% TRAP   57-51   52.8% |  -24.98u | ROI: -15.0%  | n=108
EV 1-2%        24-9    72.7% |   19.87u | ROI:  41.0%  | n=33
EV 2-3%         4-1    80.0% |    1.34u | ROI:  20.6%  | n=5
EV 3-5%         4-0   100.0% |    1.71u | ROI:  23.6%  | n=4
EV 5%+          6-2    75.0% |    6.67u | ROI:  34.2%  | n=8
```

**The 0-1% EV trap is the single biggest hole. Real edge starts at 1%+.**

---

## Odds & Implied Probability

```
Heavy fav ≤-200       77-16   82.8% |    2.81u | ROI:   1.8%  | n=93
Fav -199 to -120      47-32   59.5% |   -2.07u | ROI:  -1.9%  | n=79
Slight fav -119/-101  13-14   48.1% |    1.82u | ROI:   4.0%  | n=27
Slight dog +100/+130  24-29   45.3% |   -2.08u | ROI:  -2.7%  | n=53
Dog +131/+200         20-19   51.3% |   15.38u | ROI:  25.4%  | n=39
Big dog +201+          3-11   21.4% |   -2.36u | ROI: -10.5%  | n=14
```

**Implied probability is the #1 predictor (r=+0.36). Hidden value in dogs +131-200 (+25.4% ROI).**

---

## Head-to-Head: Comparative Margin Analysis

The key insight: raw sharp count/money/avg bet are meaningless in isolation. What matters is the **margin over the other side**.

### Clean vs Contested
```
Clean (no opp)      176-103  63.1% |   24.49u | ROI:   5.6%  | n=279
Contested (opp)       8-18   30.8% |  -10.99u | ROI: -34.3%  | n=26
```

### Sharp Count Margin (our sharps − their sharps)
```
They have MORE sharps    3-7    30.0% |   -4.81u | ROI:  -37.0%  | n=10
TIED (margin = 0)        0-3     0.0% |   -2.00u | ROI: -100.0%  | n=3
+1 more sharp           11-6    64.7% |    4.11u | ROI:  +21.6%  | n=17
+2 more sharps          14-11   56.0% |    3.54u | ROI:  +13.5%  | n=25
+3 more sharps          31-14   68.9% |    9.69u | ROI:  +18.6%  | n=45
+4-5 more sharps        47-24   66.2% |   18.61u | ROI:  +17.9%  | n=71
```

**Margin of +3 or more sharps is the sweet spot (67%+ WR).** Even +1 margin recovers to 64.7% WR. Tied or negative margin = death.

### Clean Games by Our Sharp Count (when no opposition)
```
1-2 sharps (clean)     24-12   66.7% |   14.30u | ROI:  +38.4%  | n=36
3-4 sharps (clean)     54-27   66.7% |   13.62u | ROI:  +13.2%  | n=81
5-6 sharps (clean)     36-28   56.3% |  -12.03u | ROI:  -10.8%  | n=64
7-9 sharps (clean)     34-22   60.7% |   -0.78u | ROI:   -0.8%  | n=56
10+ sharps (clean)     28-14   66.7% |    9.38u | ROI:  +10.6%  | n=42
```

**Even in clean games, 5-6 sharps is a dead zone (56.3% WR, -10.8% ROI).** The sweet spot is 1-4 sharps clean, where WR is 66.7% and ROI is +13-38%.

### Money Margin (our $ − their $)
```
They have MORE money     4-12   25.0% |  -11.87u | ROI:  -56.5%  | n=16
We have $5-10K more      1-2    33.3% |   -0.96u | ROI:  -21.3%  | n=3
We have $10-25K more     2-0   100.0% |    2.99u | ROI:  +99.7%  | n=2
We have $25K+ more       1-3    25.0% |   -0.65u | ROI:  -21.7%  | n=4
```

**When they have more money than us: 25% WR, -56.5% ROI.** Money margin matters hugely.

### Avg Bet Size Margin
```
Their avg bet HIGHER     4-13   23.5% |  -13.37u | ROI:  -60.8%  | n=17
Our avg $0-1K higher     0-2     0.0% |   -3.00u | ROI: -120.0%  | n=2
Our avg $1-3K higher     2-0   100.0% |    5.08u | ROI: +169.3%  | n=2
```

**Avg bet margin is the strongest contested-game predictor.** When their average bet is higher, we win only 23.5% (-60.8% ROI). This means their sharps are more convicted per position.

### Sharp Money Ratio (our $ / total $, contested only)
```
<30% of total $          3-11   21.4% |  -10.81u | ROI:  -58.4%  | n=14
30-50%                   1-1    50.0% |   -1.06u | ROI:  -42.4%  | n=2
50-70%                   0-2     0.0% |   -4.00u | ROI: -133.3%  | n=2
70-90%                   1-3    25.0% |    0.54u | ROI:  +18.0%  | n=4
90%+ (overwhelming)      3-1    75.0% |    4.34u | ROI:  +86.8%  | n=4
```

**Need 90%+ of the sharp money to survive a contested game.** Anything less than overwhelming dominance is a losing proposition.

### Clean Money by Total Invested
```
<$5K invested (clean)    46-27   63.0% |   12.43u | ROI:  +15.7%  | n=73
$5-15K (clean)           48-23   67.6% |   12.63u | ROI:  +12.5%  | n=71
$15-30K (clean)          27-17   61.4% |    3.38u | ROI:   +4.4%  | n=44
$30-75K (clean)          27-14   65.9% |    6.29u | ROI:   +9.0%  | n=41
$75K+ (clean)            28-22   56.0% |  -10.24u | ROI:   -9.4%  | n=50
```

**$75K+ clean = value has been fully captured.** The $5-15K sweet spot is 67.6% WR. More money doesn't always mean more edge.

### Key Margin Combos (contested only)
```
MORE sharps + MORE $ + HIGHER avg bet    4-3   57.1% |    3.38u | ROI:  +37.6%  | n=7
MORE sharps + LESS money                 1-4   20.0% |   -6.06u | ROI:  -86.6%  | n=5
FEWER sharps + LESS $ + LOWER avg        3-6   33.3% |   -4.31u | ROI:  -34.5%  | n=9
We dominate ALL 3 by 2x+                3-0   100.0% |    6.03u | ROI: +134.0%  | n=3
They dominate ALL 3 margins              3-6   33.3% |   -4.31u | ROI:  -34.5%  | n=9
```

**Having more sharps doesn't help if they have more money (20% WR).** Money/avg bet margin matters more than headcount.

### Margin × EV Edge Cross-Analysis
```
CLEAN + EV 1%+                          34-12   73.9% |   19.86u | ROI:  +25.9%  | n=46
CLEAN + EV 0-1%                         56-41   57.7% |  -16.27u | ROI:  -10.5%  | n=97
CLEAN + EV ≤0                           86-50   63.2% |   20.90u | ROI:  +10.3%  | n=136
CONTESTED + EV 1%+                       4-0   100.0% |    9.73u | ROI: +194.6%  | n=4
CONTESTED + EV 0-1%                      1-10    9.1% |   -8.71u | ROI:  -75.7%  | n=11
CONTESTED + EV ≤0                        3-8    27.3% |  -12.01u | ROI:  -77.5%  | n=11
CLEAN + ≤5 sharps                       98-48   67.1% |   38.63u | ROI:  +20.9%  | n=146
CLEAN + 6+ sharps                       78-55   58.6% |  -14.14u | ROI:   -5.6%  | n=133
```

**The killer combo: CLEAN + EV 1%+ = 73.9% WR, +25.9% ROI (n=46).** The killer trap: CONTESTED + EV 0-1% = 9.1% WR (n=11).

### Contested Game Decision Framework

When opposition exists, survival requires ALL of:
1. **90%+ of the sharp money** on our side
2. **Higher average bet size** than their side
3. **EV 1%+** (only 4 contested picks with EV 1%+ exist — all 4 won)

If ANY of these fail, the pick is likely a loss.

---

## Flip Games (Both Sides Locked)

26 games where both sides triggered a lock:

### First Lock vs Second Lock (the flip)
```
1st Lock (original)   11-15   42.3% |   -5.85u | ROI: -16.5%
2nd Lock (the flip)   15-11   57.7% |    4.46u | ROI:  12.9%
Combined net:                        |   -1.39u on 70.0u risked
```

### What Predicts the Winner in Flip Games?
```
Higher-star side wins:     13/19  (68.4%)
Higher avg-bet side wins:  17/26  (65.4%)
More total money wins:     16/26  (61.5%)
Favorite side wins:        15/25  (60.0%)
Higher EV side wins:       15/26  (57.7%)
More sharps side wins:     12/23  (52.2%)  ← useless
```

**Decision framework**: When a flip happens, favor the side with higher stars, higher avg bet, and more total money. Sharp count is meaningless in flip scenarios.

---

## 2-Way Combos

### Top 10 (n≥5)

| Combo | Record | WR | ROI |
|-------|--------|-----|------|
| NO Pinn + EV 1%+ | 17-2 | 89.5% | +68.7% |
| 12h+ early + EV 1%+ | 9-2 | 81.8% | +68.0% |
| Contested + NO Pinn | 5-4 | 55.6% | +56.5% |
| NO Pinn + DOMINANT | 11-6 | 64.7% | +41.6% |
| Pred aligns + EV 1%+ | 19-5 | 79.2% | +44.7% |
| Avg $5K+ + EV 1%+ | 12-3 | 80.0% | +40.2% |
| Avg <$2K + EV 1%+ | 17-6 | 73.9% | +37.9% |
| EV 1%+ + Line moving | 32-10 | 76.2% | +37.6% |
| Avg $2-5K + DOMINANT | 7-3 | 70.0% | +37.0% |
| 12h+ + DOMINANT | 9-5 | 64.3% | +36.9% |

### Bottom 10 (n≥5)

| Combo | Record | WR | ROI |
|-------|--------|-----|------|
| Contested + Pinn confirms | 3-14 | 17.6% | -78.7% |
| Contested + EV ≤0 | 3-8 | 27.3% | -77.5% |
| Contested + EV 0-1% | 1-10 | 9.1% | -75.7% |
| <4h + EV 0-1% | 3-8 | 27.3% | -73.8% |
| Contested + Line moving | 4-14 | 22.2% | -57.7% |
| 4-12h + avg $5K+ | 4-9 | 30.8% | -63.6% |
| Opp $ > ours + Pinn | 2-9 | 18.2% | -90.1% |
| Opp $ > ours + EV 0-1% | 0-6 | 0% | -103.6% |
| Opp $ > ours + EV ≤0 | 1-6 | 14.3% | -107.7% |
| Our $ > opp + LEAN | 0-5 | 0% | -114.3% |

---

## 3-Way Combos

### Top 10 (n≥5)

| Combo | Record | WR | ROI |
|-------|--------|-----|------|
| avg $5K+ + NO Pinn + EV 1%+ | 6-0 | 100% | +105.9% |
| 12h+ + NO Pred + EV 1%+ | 6-0 | 100% | +102.5% |
| NO Pinn + Pred aligns + EV 1%+ | 10-0 | 100% | +90.6% |
| NO Pinn + NO Pred + DOMINANT | 9-2 | 81.8% | +90.0% |
| avg <$2K + NO Pinn + EV 1%+ | 6-0 | 100% | +81.9% |
| avg <$2K + NO Pinn + STRONG | 5-1 | 83.3% | +82.0% |
| NO Pinn + EV 1%+ + Line moving | 12-1 | 92.3% | +78.4% |
| 4-12h + avg <$2K + LEAN | 13-5 | 72.2% | +70.1% |
| Pred aligns + EV 1%+ + STRONG | 4-1 | 80.0% | +69.5% |
| avg <$2K + Pred aligns + LEAN | 17-6 | 73.9% | +51.2% |

### Bottom 5 (n≥5)

| Combo | Record | WR | ROI |
|-------|--------|-----|------|
| Contested + EV ≤0 + Line moving | 0-7 | 0% | -134.1% |
| Contested + NO Pred + LEAN | 0-6 | 0% | -133.3% |
| avg <$2K + Contested + EV ≤0 | 0-5 | 0% | -130.8% |
| Contested + EV 0-1% + LEAN | 0-5 | 0% | -114.3% |
| Contested + Pinn + EV ≤0 | 1-7 | 12.5% | -110.9% |

---

## 4-Way Combos

### Top 10 (n≥5)

| Combo | Record | WR | ROI |
|-------|--------|-----|------|
| 12h+ + NO Pred + EV 1%+ + Line moving | 5-0 | 100% | +106.0% |
| avg $5K+ + NO Pinn + EV 1%+ + Line moving | 6-0 | 100% | +105.9% |
| Clean + NO Pinn + NO Pred + DOMINANT | 6-1 | 85.7% | +99.0% |
| NO Pinn + Pred aligns + EV 1%+ + Line moving | 6-0 | 100% | +91.4% |
| NO Pinn + NO Pred + EV ≤0 + DOMINANT | 8-2 | 80.0% | +81.7% |
| avg <$2K + NO Pinn + Pred aligns + STRONG | 5-1 | 83.3% | +82.0% |
| 4-12h + avg <$2K + Clean + LEAN | 13-4 | 76.5% | +74.8% |
| avg <$2K + Pred aligns + EV 0-1% + LEAN | 5-1 | 83.3% | +76.0% |
| avg $2-5K + Clean + NO Pinn + DOMINANT | 4-2 | 66.7% | +73.1% |
| 12h+ + Clean + Pred aligns + DOMINANT | 5-1 | 83.3% | +78.9% |

### Bottom 5 (n≥5)

| Combo | Record | WR | ROI |
|-------|--------|-----|------|
| Contested + Pinn + EV ≤0 + Line moving | 0-7 | 0% | -134.1% |
| 4-12h + Contested + EV ≤0 + Line moving | 0-5 | 0% | -130.0% |
| 4-12h + avg $2-5K + Pinn + Pred aligns | 0-5 | 0% | -130.0% |
| Contested + Pinn + Line moving + LEAN | 0-6 | 0% | -125.0% |
| 4-12h + avg $2-5K + Clean + LEAN | 1-4 | 20.0% | -112.7% |

---

## Correlation Matrix

```
              hoursOut   avgBet contested pinnConf predAlign    EV    lineMove moneyPct OUTCOME
hoursOut        1.000   -0.158   +0.258   +0.238   -0.132  +0.002   +0.044   +0.628   -0.054
avgBet         -0.158    1.000   -0.005   -0.192   -0.047  -0.001   -0.000   -0.274   -0.003
contested      +0.258   -0.005    1.000   -0.001   -0.082  -0.012   -0.101   +0.240   -0.184
pinnConfirms   +0.238   -0.192   -0.001    1.000   -0.099  +0.022   +0.342   +0.248   -0.122
predAligns     -0.132   -0.047   -0.082   -0.099    1.000  -0.108   +0.117   -0.145   +0.030
EV             +0.002   -0.001   -0.012   +0.022   -0.108   1.000   +0.022   -0.058   -0.007
lineMoving     +0.044   -0.000   -0.101   +0.342   +0.117  +0.022    1.000   -0.137   -0.032
moneyPct       +0.628   -0.274   +0.240   +0.248   -0.145  -0.058   -0.137    1.000   -0.088
OUTCOME        -0.054   -0.003   -0.184   -0.122   +0.030  -0.007   -0.032   -0.088    1.000
```

**Key correlations:**
- Pinnacle ↔ Line Moving: **+0.342** (measuring the same thing: market adjustment)
- HoursOut ↔ MoneyPct: **+0.628** (earlier locks accumulate higher consensus)
- Contested → Outcome: **-0.184** (strongest negative predictor)
- Pinnacle → Outcome: **-0.122** (confirms = value already priced in)

---

## Star System Calibration

### Current Stars vs Outcomes (167 picks with stars)

```
2.5★   34-28   54.8% |   -2.09u | ROI:  -4.1%  | n=62
3★     39-26   60.0% |   11.82u | ROI:  13.9%  | n=65
3.5★   12-13   48.0% |  -10.85u | ROI: -26.5%  | n=25
4★      5-6    45.5% |   -6.75u | ROI: -29.7%  | n=11
4.5★    3-1    75.0% |    3.68u | ROI:  39.8%  | n=4
```

### Grouped (matches dashboard view)
```
4-4.5★     8-7    53.3% |   -3.07u | ROI:  -9.6%  | n=15
3-3.5★    51-39   56.7% |    0.97u | ROI:   0.8%  | n=90
2-2.5★    34-28   54.8% |   -2.09u | ROI:  -4.1%  | n=62
```

**Stars do NOT separate winners from losers.** The mid-tier (3.5-4★) is the worst at -27.6% ROI.

---

## Logistic Regression Model

### Feature Importance (305 picks, 1000 epochs)

| Rank | Feature | Weight | Direction |
|------|---------|--------|-----------|
| 1 | impliedProb | +0.431 | ↑ WIN |
| 2 | isHeavyFav | +0.301 | ↑ WIN |
| 3 | hasOppData | -0.179 | ↓ LOSS |
| 4 | lockCriteria | -0.157 | ↓ LOSS |
| 5 | cr_sharps3Plus | -0.121 | ↓ LOSS |
| 6 | cr_invested5kPlus | +0.111 | ↑ WIN |
| 7 | cr_pinnacleConfirms | -0.096 | ↓ LOSS |
| 8 | lockMoney | -0.084 | ↓ LOSS |
| 9 | lockAvgBet | -0.082 | ↓ LOSS |
| 10 | cr_lineMovingWith | -0.065 | ↓ LOSS |
| 11 | lockEV | +0.059 | ↑ WIN |
| 12 | cr_plusEV | +0.054 | ↑ WIN |
| 13 | cr_predMarketAligns | -0.053 | ↓ LOSS |
| 14 | lockWalletPct | -0.041 | ↓ LOSS |
| 15 | isUnderdog | -0.040 | ↓ LOSS |
| 16 | isFav | +0.040 | ↑ WIN |
| 17 | **stars** | **-0.040** | **↓ LOSS** |
| 18 | lockSharpCount | +0.021 | ↑ WIN |
| 19 | lockMoneyPct | -0.011 | ↓ LOSS |

**Model accuracy: 66.9% (vs 60.3% baseline). LOO-CV: 62.3%.**

### Confidence Calibration
```
Very Low (25-35%)     7-12   36.8% |    2.92u | ROI:   9.0%  | n=19
Low (35-45%)         12-31   27.9% |  -29.28u | ROI: -41.2%  | n=43
Below avg (45-50%)   22-12   64.7% |   22.16u | ROI:  48.4%  | n=34
Coin flip (50-55%)   17-13   56.7% |    8.21u | ROI:  20.5%  | n=30
Lean (55-60%)        17-16   51.5% |   -3.77u | ROI:  -7.3%  | n=33
Moderate (60-70%)    33-15   68.8% |    7.66u | ROI:  10.8%  | n=48
High (70-80%)        23-9    71.9% |    1.73u | ROI:   3.3%  | n=32
Very High (80%+)     51-5    91.1% |   10.63u | ROI:  11.6%  | n=56
```

---

## Current rateStars() Audit

### How Points Are Currently Allocated (max 12 pts → 5 stars)

```javascript
function rateStars({
  evEdge, pinnConfirms, pinnMovingWith, pinnMovingAgainst,
  polyMovingWith, oppPeakStars,
  breadth, conviction, concentration, counterSharpScore,
  consensusTier, isRLM, ticketDivergence, sportSharpCount
})
```

### Factor-by-Factor Breakdown

#### Factor 1: BREADTH — max +3 pts (25% of budget)
**Thresholds**: `≥0.5 → +3` | `≥0.35 → +2` | `≥0.2 → +1` | `≥0.1 → +0.5`

| Sharp Count (proxy) | Record | WR | ROI |
|---------------------|--------|-----|------|
| 1-2 sharps (low breadth) | 25-14 | 64.1% | +30.1% |
| 3 sharps | 31-16 | 66.0% | +15.3% |
| 4-5 sharps | 45-28 | 61.6% | +12.3% |
| 6-7 sharps (high breadth) | 35-31 | 53.0% | -11.8% |
| 8-9 sharps | 19-16 | 54.3% | -23.2% |
| 10+ sharps (max breadth) | 29-16 | 64.4% | +9.1% |

**VERDICT**: More breadth correlates with WORSE outcomes in the 6-9 wallet range. Low breadth (1-3 sharps) is actually the sweet spot.
**ACTION**: REDUCE from +3 max to +1 max. Cap bonus at 3-5 wallets.

---

#### Factor 2: PINNACLE ALIGNMENT — max +3 pts (25% of budget)
**Thresholds**: `confirms+moving → +3` | `confirms → +1.5` | `moving → +1.5` | `against → -2`

| Signal | Record | WR | ROI |
|--------|--------|-----|------|
| Pinn confirms | 112-88 | 56.0% | -2.9% |
| **NO Pinnacle** | **72-33** | **68.6%** | **+13.2%** |
| Line moving WITH | 149-101 | 59.6% | +0.7% |
| **Line NOT moving** | **35-20** | **63.6%** | **+14.0%** |

**VERDICT**: **COMPLETELY INVERTED**. Pinnacle confirmation = -12.6% WR delta, -16.2% ROI delta. When Pinnacle already confirms, the edge is PRICED IN — we get worse odds.
**ACTION**: FLIP. NO Pinn → +1.5 (pre-market edge). Pinn confirms → 0 (neutral). Keep against → -2.

---

#### Factor 3: CONVICTION — max +1.5 pts (13% of budget)
**Thresholds**: `≥0.8 → +1.5` | `≥0.5 → +1` | `≥0.25 → +0.5`

| Avg Bet Size (proxy) | Record | WR | ROI |
|----------------------|--------|-----|------|
| avg <$1K (low) | 41-30 | 57.7% | +6.4% |
| **avg $1-3K (moderate)** | **66-35** | **65.3%** | **+9.6%** |
| avg $3-5K (high) | 22-19 | 53.7% | -5.5% |
| avg $5K+ (very high) | 55-37 | 59.8% | -0.8% |

**VERDICT**: Moderate conviction ($1-3K avg) is the sweet spot. Max conviction drops off. Weak overall signal.
**ACTION**: KEEP at +1.5 max, do not increase.

---

#### Factor 4: CONCENTRATION PENALTY — max -1 pt
**Thresholds**: `>0.9 → -1` | `>0.8 → -0.5`

**VERDICT**: Cannot directly test from graded data. Direction is correct (single wallet dominance = risky).
**ACTION**: KEEP AS-IS.

---

#### Factor 5: COUNTER-SHARP PENALTY — max -1.5 pts
**Thresholds**: `≥6 → -1.5` | `≥3 → -1`

| Opposition | Record | WR | ROI |
|-----------|--------|-----|------|
| **Clean (no opp)** | **176-103** | **63.1%** | **+5.6%** |
| Contested | 8-18 | 30.8% | -34.3% |
| Our $ > opp $ | 4-6 | 40.0% | +8.0% |
| Opp $ > ours | 4-12 | 25.0% | -56.5% |

**VERDICT**: **MASSIVELY UNDER-WEIGHTED**. Contested = 30.8% WR, -34.3% ROI. Current max -1.5 only drops ~0.6 stars. This is the 2nd biggest problem in the system.
**ACTION**: INCREASE to `≥6 → -3` | `≥3 → -2` | `any opposition → -1`

---

#### Factor 6: EV EDGE — max +1 pt, -0.5 trap (8% of budget)
**Thresholds**: `>3% → +1` | `>1% → +0.5` | `>0% → -0.5`

| EV Range | Record | WR | ROI |
|----------|--------|-----|------|
| **EV 1%+** | **38-12** | **76.0%** | **+36.2%** |
| EV 0-1% (trap) | 57-51 | 52.8% | -15.0% |
| EV ≤0 | 89-58 | 60.5% | +4.1% |

**VERDICT**: **MASSIVELY UNDER-WEIGHTED**. EV 1%+ is THE #1 SIGNAL at 76.0% WR, +36.2% ROI. Gets only +1 pt (8% of budget) while Pinnacle gets +3 for a negative signal. The 0-1% EV trap is the single biggest money-losing zone.
**ACTION**: INCREASE to `EV 3%+ → +3` | `EV 1%+ → +2.5` | `EV 0-1% → -1`

---

#### Factor 7: PREDICTION MARKET — max +1.5 pts (13% of budget)
**Thresholds**: `polyMovingWith + LEAN → +1.5` | `STRONG → +0.5` | `DOMINANT → +0.25`

| Signal | Record | WR | ROI |
|--------|--------|-----|------|
| Pred aligns | 118-74 | 61.5% | +0.3% |
| NO Pred | 66-47 | 58.4% | +7.8% |

**VERDICT**: **OVER-WEIGHTED**. Prediction market alignment = +0.3% ROI — essentially zero predictive power. NO Pred actually has better ROI.
**ACTION**: REDUCE from +1.5 to +0.5 max. Tie-breaker only.

---

#### Factor 8: RLM — max +1.5 pts (13% of budget)
**Thresholds**: `RLM + pinnMoving + divergence≥10 → +1.5`

| Signal | Record | WR | ROI |
|--------|--------|-----|------|
| Line moving WITH | 149-101 | 59.6% | +0.7% |
| **Line NOT moving** | **35-20** | **63.6%** | **+14.0%** |

**VERDICT**: **INVERTED**. Same logic as Pinnacle — if the line already moved, the value is captured. Not moving = we still have edge.
**ACTION**: REDUCE from +1.5 to +0.5. Consider bonus for line NOT having moved.

---

#### Factor 9: SPORT SPECIALIST — max +1.5 pts (13% of budget)
**Thresholds**: `≥3 sport sharps → +1.5` | `≥2 → +1` | `≥1 → +0.5`

| Sport | Record | WR | ROI |
|-------|--------|-----|------|
| NHL | 70-60 | 53.8% | -1.5% |
| **MLB** | **53-29** | **64.6%** | **+22.5%** |
| NBA | 13-9 | 59.1% | -29.9% |
| **CBB** | **48-23** | **67.6%** | **+1.6%** |

**VERDICT**: Cannot measure sport-specialist wallet impact from graded data.
**ACTION**: KEEP, validate with more data.

---

#### Factor 10: FLIP PENALTY — max -2 pts
**Thresholds**: `oppPeakStars ≥4.5 → -2` | `≥3.5 → -1.5` | `≥3 → -1`

- Contested picks: 30.8% WR
- 1st lock (original): 42.3% WR
- 2nd lock (the flip): 57.7% WR

**VERDICT**: Direction correct but UNDER-WEIGHTED.
**ACTION**: INCREASE to `≥4.5 → -3` | `≥3.5 → -2.5` | `≥3 → -2`

---

#### MISSING FACTOR: IMPLIED PROBABILITY / ODDS
**Currently**: NOT IN SYSTEM AT ALL

| Odds Range | Record | WR | ROI |
|------------|--------|-----|------|
| **Heavy fav ≤-200** | **77-16** | **82.8%** | **+1.8%** |
| Fav -199 to -120 | 47-32 | 59.5% | -1.9% |
| Pick -119 to +130 | 37-43 | 46.3% | -0.2% |
| Dog +131 to +200 | 20-19 | 51.3% | +25.4% |
| Big dog +201+ | 3-11 | 21.4% | -10.5% |

**VERDICT**: This is the **#1 PREDICTOR** in the logistic regression (r=+0.36, weight +0.43). Heavy favorites win 82.8%. Completely absent from the star system.
**ACTION**: ADD `heavy fav → +1.5` | `moderate fav → +0.5` | `big dog → -1`

---

### Point Budget: Current vs Data-Optimal

| Factor | Current Pts | Data Says | Action |
|--------|------------|-----------|--------|
| Breadth | +3 (25%) | Weak/Inverted | **REDUCE to +1** |
| Pinnacle alignment | +3 (25%) | **INVERTED** | **FLIP: NO pinn → +1.5** |
| Conviction | +1.5 (13%) | Weak | KEEP |
| Concentration | -1 (pen) | Correct | KEEP |
| Counter-sharp | -1.5 (pen) | **UNDER-weighted** | **INCREASE to -3** |
| EV edge | +1 (8%) | **#1 SIGNAL** | **INCREASE to +3** |
| Pred market | +1.5 (13%) | Near-zero | **REDUCE to +0.5** |
| RLM | +1.5 (13%) | Inverted | **REDUCE to +0.5** |
| Sport specialist | +1.5 (13%) | Unknown | KEEP |
| Flip penalty | -2 (pen) | Under-weighted | **INCREASE to -3** |
| **IMPLIED PROB** | **0 (MISSING)** | **#1 PREDICTOR** | **ADD +1.5** |

### The Core Problem

Current system: **Pinnacle** gets 3 pts (25% of total) — it's the **worst** predictor.
Current system: **EV 1%+** gets only 1 pt (8% of total) — it's the **best** predictor.
Current system: **Implied probability** gets 0 pts — it's the **#1 predictor overall**.

---

## Proposed rateStars() V4

Based on the data audit, here is the proposed new point budget:

| Factor | Max Pts | Share | Logic |
|--------|---------|-------|-------|
| **EV edge** | **+3** | **21%** | `EV 3%+ → +3`, `EV 1%+ → +2.5`, `EV 0-1% → -1` |
| Implied probability | +1.5 | 11% | `Heavy fav → +1.5`, `Fav → +0.5`, `Big dog → -1` |
| Breadth | +1 | 7% | `3-5 wallets → +1`, `6+ → +0.5`, `10+ → 0` |
| Pinnacle (inverted) | +1.5 | 11% | `NO Pinn → +1.5`, `Pinn confirms → 0` |
| Conviction | +1.5 | 11% | Keep existing thresholds |
| Sport specialist | +1.5 | 11% | Keep existing thresholds |
| Pred market | +0.5 | 4% | Reduced from +1.5 |
| RLM | +0.5 | 4% | Reduced from +1.5 |
| Concentration | -1 | pen | Keep existing |
| **Counter-sharp** | **-4** | **pen** | Doubled from -1.5 |
| Flip penalty | -3 | pen | Increased from -2 |
| EV trap (0-1%) | -1 | pen | Increased from -0.5 |

**New max positive**: ~11.5 pts | **New max penalty**: -9 pts | **Scale**: `(pts / 14) * 5`, clamped 0.5-5.0

---

## Composite V2 Model

Data-driven scoring based on actual predictive power:

### Scoring Rules
```
IMPLIED PROBABILITY:
  ≥ 0.75 (heavy fav):  +3
  ≥ 0.55 (fav):        +1.5
  ≥ 0.45 (pick):        0
  < 0.45 (underdog):   -1

EV EDGE:
  ≥ 3%:   +3
  ≥ 1%:   +2
  0-1%:   -1  (trap)

OPPOSITION:
  Has opposition: -3

$7K+ INVESTED FLAG:
  Met: +1.5

SHARP COUNT:
  1-5:   +1
  13+:   +1.5
  10+:   -1
  6-9:   -0.5

CRITERIA COUNT:
  4/6:   +1
  ≤ 2:   +1
  6/6:   -2
  5+:    -0.5

TOTAL INVESTED:
  $3-7K:    +0.5
  $30-100K: +0.5
  $100K+:   -1

NO PINNACLE:
  Not confirmed: +0.5
```

### Composite V2 Performance (all 305)

```
ELITE (8+)          6-0    100.0% |    1.65u | ROI:  20.6%  | n=6
STRONG (5-7)       50-9     84.7% |   20.69u | ROI:  21.1%  | n=59
SOLID (3-4)        43-17    71.7% |   20.93u | ROI:  23.6%  | n=60
LEAN (1-2)         54-34    61.4% |   22.64u | ROI:  18.4%  | n=88
AVOID (≤0)         31-61    33.7% |  -52.41u | ROI: -35.1%  | n=92
```

### Composite V2 vs Current Stars (new format, 179 picks)

**Current Stars:**
```
4.5+★      3-1    75.0% |    3.68u | ROI:  39.8%  | n=4
3.5-4★    17-19   47.2% |  -17.60u | ROI: -27.6%  | n=36
2.5-3★    73-54   57.5% |    9.73u | ROI:   7.2%  | n=127
```

**Composite V2:**
```
STRONG 5-7    9-0   100.0% |    7.15u | ROI:  59.6%  | n=9
SOLID 3-4    26-11   70.3% |    9.37u | ROI:  22.2%  | n=37
LEAN 1-2     42-22   65.6% |   18.87u | ROI:  25.1%  | n=64
AVOID ≤0     22-46   32.4% |  -43.82u | ROI: -46.5%  | n=68
```

---

## Hypothetical Profit Simulations

| Strategy | Profit | Units Risked | ROI |
|----------|--------|-------------|------|
| Current flat sizing | +13.50u | 467.8u | +2.9% |
| **Skip AVOID picks (V2 > 0)** | **+56.98u** | 343.3u | **+16.6%** |
| **V2-based variable sizing** | **+48.73u** | 267.4u | **+18.2%** |

### Filter Backtesting

| Filter | Record | ROI | Picks Cut |
|--------|--------|------|-----------|
| Current (all) | 100-79 | -3.5% | 0 |
| Drop contested | 92-61 | +1.6% | 26 |
| Drop contested + 10+ sharps | 85-55 | +0.6% | 39 |
| CONSERVATIVE | 70-47 | -0.4% | 62 |

---

## Actionable Recommendations

### Immediate (High Confidence)

1. **Invert Pinnacle weighting**: Change from +3 bonus to a value-capture penalty. When Pinnacle already confirms, the edge is gone.
2. **Boost EV 1%+ weight**: From +1 pt to at least +2.5 pts. This is the single strongest signal.
3. **Penalize 0-1% EV harder**: Current -0.5 should be -1 or more. This zone is -15% ROI.
4. **Add implied probability**: Not in the system at all. It's the #1 predictor (r=+0.36).
5. **Increase opposition penalty**: Counter-sharp score caps at -1.5. Contested games are 30.8% WR — this needs to be -3 or more.

### Medium-Term (Needs More Data)

6. **Add time-before-game factor**: 4-12h window is -21.5% ROI. Either penalize or use as a modifier.
7. **Criteria count cap**: Penalize 6/6 games (25% WR). The "everything aligns" scenario is a trap.
8. **Sharp count sweet spot**: Penalize 6-12 sharps more aggressively.

### Monitor

9. **Prediction market signal**: Currently +1.5 pts for LEAN consensus. Data shows near-zero predictive power. Consider reducing.
10. **Sport specialist bonus**: Not measurable in graded data yet. Keep but validate as sample grows.

---

## How to Re-Run This Analysis

### Step 1: Pull data from Firebase
```javascript
// Run from /nhl-savant/ directory
// Uses serviceAccountKey.json for Firebase Admin access
// Saves to /tmp/alltime_v2.json
// Handles both old format (no sides) and new format (sides.home/away.lock)
```

### Step 2: Key data fields
- `outcome` (1/0), `profit`, `units`, `stars`
- `lockSharpCount`, `lockMoney`, `lockAvgBet`
- `lockMoneyPct`, `lockWalletPct`, `lockGrade`
- `lockOdds`, `implProb`, `lockEV`, `lockCriteria`
- `cr_pinnacleConfirms`, `cr_lineMovingWith`, `cr_predMarketAligns`, `cr_invested5kPlus`
- `hasOppData`, `oppSharpCount`, `oppMoney`, `sharpDiff`, `moneyDiff`
- `hoursOut` (calculated from `lock.lockedAt` and `commenceTime`)
- `sport`, `format` (old/new)

### Step 3: Benchmarks to track
- Overall WR/ROI
- Each of the 9 variables individually
- Top/bottom 2-way and 3-way combos
- Star calibration by tier
- Composite V2 performance by tier

---

*This analysis should be re-run weekly as the sample size grows. Key thresholds to watch: EV 1%+ maintaining 70%+ WR, contested games staying below 35% WR, and Pinnacle confirms continuing to underperform NO Pinnacle.*
