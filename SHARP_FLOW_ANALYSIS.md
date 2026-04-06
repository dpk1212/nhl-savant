# SharpFlow Deep Dive Analysis

> **Dataset**: 305 all-time graded picks (184-121, 60.3% WR, +13.50u, +2.9% ROI)
> **Date Range**: March 16 – April 3, 2026
> **Sports**: NHL (130), MLB (82), CBB (71), NBA (22)
> **Last Updated**: April 6, 2026

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
9. [Star Delta & Top Picks](#star-delta--top-picks)
10. [Top Pick Profile Analysis](#top-pick-profile-analysis)
11. [2-Way Combos](#2-way-combos)
11. [3-Way Combos](#3-way-combos)
12. [4-Way Combos](#4-way-combos)
13. [Correlation Matrix](#correlation-matrix)
14. [Star System Calibration](#star-system-calibration)
15. [Logistic Regression Model](#logistic-regression-model)
16. [Current rateStars() Audit](#current-ratestars-audit)
17. [Composite V2 Model](#composite-v2-model)
18. [Hypothetical Profit Simulations](#hypothetical-profit-simulations)
19. [Actionable Recommendations](#actionable-recommendations)

---

## Executive Summary

The **absolute** star rating is the 17th most predictive feature out of 19 measured. It correlates at -0.04 with outcomes — effectively random with a slight negative bias (higher stars = slightly worse outcomes). The system over-weights Pinnacle confirmation and breadth while completely missing implied probability, opposition data, and EV thresholds — the three strongest actual predictors.

However, the **star delta** (peak stars minus lock stars) tells a completely different story. Picks where stars grew by 1.0+ from lock to peak — "Top Picks" — go **40-17 (70.2% WR, +20.5u, +15.4% ROI)** with clean monotonic tier separation. The absolute star level doesn't predict outcomes, but the *rate of change* does. Temporal convergence of independent sharp signals is one of the strongest features in the system.

**Top 4 findings:**
1. **Star Delta ≥ 1.0 (Top Picks) is the strongest subset**: 70.2% WR, +15.4% ROI (n=57)
2. **EV 1%+ is the single best standalone signal**: 76.0% WR, +36.2% ROI (n=50)
3. **Opposition kills everything**: Clean games 63.1% WR vs contested 30.8% WR
4. **Pinnacle confirmation is a sell signal**: NO Pinn = 68.6% WR vs Pinn confirms = 56.0% WR

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

## Star Delta & Top Picks

### The Discovery

The analysis above shows that *absolute* star level at peak doesn't predict outcomes — 4★ plays underperform 2.5★ plays. But this misses a critical distinction: **how a play reached its star level matters more than what that level is.**

A "Top Pick" is defined as any play where the star rating grew by **≥ 1.0 stars** from the initial lock to the peak:

```javascript
const starDelta = peakStars - lockStars;
const isTopPick = starDelta >= 1.0;
```

This measures **temporal convergence** — did independent sharp wallets pile on *after* the initial lock?

### Top Pick Performance (57 graded picks)

```
ALL TOP PICKS       40-17   70.2% |  +20.5u | ROI: +15.4%  | n=57
NON-TOP PICKS     ~144-104  58.1% |   ~-7.0u | ROI:  ~-2.4% | n=~248
```

**Top Picks outperform non-Top-Picks by +12.1 percentage points in WR and +17.8% in ROI.**

### Top Picks by Star Tier (monotonic separation)

```
★★★★★ (5.0)        5-1    83.3% |   +6.3u | n=6
★★★★ (3.5-4.5)    33-14   70.2% |  +18.8u | n=47
★★★ (2.5-3.0)      2-2    50.0% |   -4.6u | n=4
```

Within Top Picks, the star tiers separate cleanly: higher stars = better outcomes. This is the exact monotonic relationship the star system is supposed to produce but fails to achieve across all picks.

### Why Star Delta Works

**Absolute star level measures market consensus** — how much information has already been absorbed. A play that *starts* at 4.0 stars means the sharp consensus was already wide and likely priced in.

**Star delta measures information arrival** — independent confirmation accumulating over time. A play that *grows* from 2.5 to 4.0 stars means:

1. A few sharp wallets saw something early (initial lock at 2.5★)
2. Over hours, additional independent wallets arrived at the same conclusion
3. The signal strengthened through genuine convergence, not just breadth

This aligns with market efficiency theory: edge exists when information hasn't been fully priced. A growing star rating means the market is still catching up to the sharp consensus. A static high star rating means the market already reflects it.

### Unit Sizing Bonus (current implementation)

Top Picks already receive a unit bonus in the current system:

```
starDelta ≥ 1.5: +1.0u bonus
starDelta ≥ 1.0: +0.5u bonus
```

Given Top Picks' 70.2% WR vs 58.1% for non-Top-Picks, this bonus is directionally correct but may be undersized. See [Actionable Recommendations](#actionable-recommendations) for proposed changes.

### Top Pick × Other Signals (to be validated)

Key cross-analyses to run as sample grows:

| Cross | Expected Direction | Sample Needed |
|-------|-------------------|---------------|
| Top Pick + EV 1%+ | Strongest combo in system | 15+ |
| Top Pick + Clean (no opp) | Should be very strong | 30+ |
| Top Pick + Contested | Does growth survive opposition? | 10+ |
| Top Pick + NO Pinnacle | Growth before market adjusts | 15+ |
| Top Pick + Heavy Favorite | Does implied prob boost it further? | 15+ |
| StarDelta ≥ 1.5 vs 1.0-1.49 | Is bigger delta better? | 20+ per bucket |

### Implications for Model Design

Star delta should be treated as a **co-primary signal** alongside EV edge and opposition status. The three together form a hierarchy:

1. **Gate**: Is the play clean (no opposition)? If contested, does it meet the survival criteria?
2. **Rank**: Did the play grow (starDelta ≥ 1.0)? Top Picks get priority sizing.
3. **Confirm**: Does the play have EV 1%+? The strongest possible confirmation.

A play that is CLEAN + TOP PICK + EV 1%+ should receive maximum conviction. A play that is CONTESTED + FLAT STARS + EV 0-1% should be avoided entirely.

---

## Top Pick Profile Analysis

> **Run date**: April 6, 2026 | **Script**: `node scripts/analyzeSharpFlow.js` (§19) | **Re-run weekly**

### The Question

Are Top Picks (starDelta >= 1.0) structurally different from Non-Top-Picks in their measurable input features? Or do they look identical on paper and just perform better because of the temporal convergence mechanism?

### Headline Results

```
TOP PICK (Δ ≥ 1.0★):  n=50   35-15   70.0% WR   +17.71u   ROI +15.4%
NON-TOP  (Δ < 1.0★):  n=191  104-87  54.5% WR   -11.27u   ROI  -3.9%
```

### A. Distribution Statistics (mean / median)

```
                      TOP PICK              NON-TOP              Delta
Peak Stars            3.9 / 4.0            3.2 / 3.0            +0.7
Lock Stars            2.8 / 2.8            3.0 / 3.0            -0.3
Star Delta            1.1 / 1.0            0.2 / 0.0            +1.0
Sharp Count           4.4 / 4.0            6.1 / 5.0            -1.7
Total Invested        $11,704 / $5,401     $30,078 / $9,619     -$18,374
Avg Bet Size          $2,762 / $1,504      $4,385 / $1,681      -$1,623
EV Edge               0.01% / 0.00%       0.08% / -0.20%        -0.07
Lock EV              -0.16% / 0.00%        0.14% / -0.20%       -0.30
Criteria Met          4.7 / 5.0            4.2 / 4.0            +0.5
Odds                  -209 / -143          -96 / -130            -113
Implied Prob          0.608 / 0.588        0.565 / 0.565        +0.043
Hours Before Game     12.0h / 9.7h         7.9h / 6.8h          +4.1h
CLV                  -0.12% / -0.39%      -0.83% / -0.21%       +0.71
Units Risked          2.30u / 2.50u        1.51u / 1.50u        +0.79
```

**Key findings**: Top Picks have **FEWER sharps** (4.4 vs 6.1), **LESS money** ($11.7K vs $30K), **LOWER avg bets** ($2.8K vs $4.4K), and **SIMILAR or WORSE EV** (0.01% vs 0.08%) than Non-Top-Picks. They are NOT the "best" picks by traditional consensus metrics. They start from a **lower base** (2.8 vs 3.0 lock stars) and **grow**. They lock **earlier** (12.0h vs 7.9h before game) and are **more often favorites** (0.608 vs 0.565 implied prob).

### B. Categorical Feature Distributions

```
                      TOP PICK    NON-TOP     Delta (pp)
Pinnacle Confirms      98.0%       81.7%       +16.3pp  ← biggest signal gap
Line Moving With      100.0%       83.2%       +16.8pp  ← biggest signal gap
$7K+ Invested          80.0%       64.9%       +15.1pp
Pred Market Aligns     58.0%       62.3%        -4.3pp
+EV (any)              36.0%       33.0%        +3.0pp
EV >= 1%               14.0%       16.2%        -2.2pp  ← NO DIFFERENCE
EV 0-1% (trap)         22.0%       16.8%        +5.2pp
3+ Sharps              84.0%       92.1%        -8.1pp  ← TP has FEWER
Clean (no opp)         88.0%       86.4%        +1.6pp  ← same

Consensus:
DOMINANT               24.0%       22.5%        +1.5pp
STRONG                 46.0%       37.7%        +8.3pp
LEAN                   20.0%       27.2%        -7.2pp

Odds:
Heavy Fav (≤-200)      26.0%       23.6%        +2.4pp
Fav (-199 to -120)     38.0%       29.8%        +8.2pp
Dog (+131+)             8.0%       17.3%        -9.3pp  ← TP = fewer dogs

Sport:
NHL                    40.0%       33.0%        +7.0pp
MLB                    32.0%       45.0%       -13.0pp
NBA                    24.0%       14.7%        +9.3pp
```

**The two features that separate Top Picks from Non-Top-Picks**: Pinnacle Confirms (+16.3pp) and Line Moving With (+16.8pp). Everything else — EV, opposition, consensus — is essentially the same between groups. Top Picks are defined almost entirely by Pinnacle/line movement, not by consensus strength or EV edge.

### C. Same-Star Head-to-Head

**4-star Top Picks vs 4-star Non-Top-Picks (n=45 vs n=70):**

```
Performance:
  TP 4★:   31-14   68.9% WR   +12.61u   ROI +12.5%
  NT 4★:   40-30   57.1% WR    +2.45u   ROI  +1.8%

Features:                   TP mean     NT mean     Delta
  Lock Stars                   2.7         3.4       -0.7  ← TP started LOWER
  Star Delta                   1.1         0.3       +0.8
  Sharp Count                  4.3         6.6       -2.3  ← TP had FEWER sharps
  Total Invested            $11,117     $28,917   -$17,800  ← TP had LESS money
  Avg Bet                    $2,798      $3,909    -$1,111
  EV Edge                    -0.08%      +0.39%     -0.47  ← TP had WORSE EV
  Criteria Met                 4.6         4.7       -0.1

Signals:                    TP %        NT %        Delta
  Pinn Confirms             97.8%       95.7%      +2.1pp  ← same
  Line Moving              100.0%       95.7%      +4.3pp
  EV >= 1%                  11.1%       18.6%      -7.5pp  ← TP had LESS EV
  Clean (no opp)            91.1%       85.7%      +5.4pp
```

**This is the smoking gun.** At the same 4-star level, Top Picks have fewer sharps, less money, lower avg bets, and WORSE EV — yet they win at 68.9% vs 57.1%. The only meaningful difference is that Top Picks started at 2.7 stars and grew, while Non-Top-Picks started at 3.4 stars and barely moved. **The growth itself is the signal, not any input feature.**

**5-star head-to-head (n=5 vs n=5, small sample):**

```
  TP 5★:   4-1   80.0% WR   +5.10u   ROI +36.4%
  NT 5★:   2-3   40.0% WR   -4.47u   ROI -28.8%
```

Same pattern: TP 5-stars started at 3.1 lock stars (grew 1.5), NT 5-stars started at 4.3 (grew 0.2). TP had fewer sharps, less money, lower avg bet. Only difference was the growth trajectory.

**3-star tier: Zero Top Picks exist at 3-star.** All 116 three-star picks are Non-Top-Picks (53.4% WR, -6.8% ROI). This makes sense — by definition, a Top Pick that grows 1.0+ stars from lock cannot land at 3 stars unless it locked at 2.0 or below (which is below the lock threshold).

### D. Lock-State Profile

```
At lock time:            TOP PICK              NON-TOP              Delta
Lock Stars               2.8 / 2.8            3.0 / 3.0            -0.3
Lock EV                 -0.16% / 0.00%        0.14% / -0.20%       -0.30
Lock Sharp Count         4.4 / 4.0            6.1 / 5.0            -1.7
Lock Money              $11,704 / $5,401     $30,078 / $9,619     -$18,374
Lock Criteria Met        4.7 / 5.0            4.2 / 4.0            +0.5
```

**Top Picks are NOT identifiable at lock time.** Lock stars are 2.8 vs 3.0 (within 0.2 stars). EV is similar. Sharp count and money are actually WORSE for future Top Picks. There is no lock-time feature that reliably predicts which plays will grow into Top Picks.

### E. Growth Profile (Top Picks Only)

**EV trajectory from lock to peak (n=50):**

```
EV grew > +0.5%      9-3    75.0% WR   +10.76u   ROI +38.4%   n=12
EV stable (±0.5%)   15-7    68.2% WR    +6.20u   ROI +11.8%   n=22
EV dropped > -0.5%  11-5    68.8% WR    +0.75u   ROI  +2.2%   n=16
```

**Top Picks work even when EV doesn't improve.** 68.2% WR when EV was stable, 68.8% when EV dropped. The causal chain theory that "Pinnacle moves → EV opens → you exploit retail lag" is only partially correct. EV opening helps (75.0% WR when it grows) but is NOT required. Top Picks win because of the Pinnacle/line confirmation itself, not specifically because of the EV window.

**EV state transitions:**

```
EV ≤0 at lock → ≥1% at peak:    3-0   100.0% WR   +4.95u   n=3
EV ≥1% at lock → still ≥1%:     3-1    75.0% WR   +0.23u   n=4
EV ≥1% at lock → dropped <1%:   3-0   100.0% WR   +2.87u   n=3
```

**Avg EV at lock: -0.16% → Avg EV at peak: +0.01% (Δ +0.17%)**

The chain-confirmed subset (EV was <0.5% at lock, rose to ≥1% at peak): 3/50 picks (6%), all 3 won. Perfect but tiny sample.

**Star delta tiers:**

```
Δ 1.0 (base Top Pick):   27-11   71.1% WR   +14.58u   ROI +17.6%   n=38
Δ 1.5 (strong growth):    7-4    63.6% WR    +0.44u   ROI  +1.5%   n=11
Δ 2.0+ (extreme):         1-0   100.0% WR    +2.69u                n=1
```

### Key Conclusions

1. **Top Picks are NOT "better" picks by any traditional metric.** They have fewer sharps, less money, lower avg bets, and equal or worse EV compared to Non-Top-Picks. By every consensus measure, they look *worse* on paper.

2. **The only features that separate them are Pinnacle confirmation (+16.3pp) and line movement (+16.8pp).** Top Picks are plays where Pinnacle moved and the line confirmed — that's almost the entire story.

3. **Top Picks cannot be identified at lock time.** Lock stars (2.8 vs 3.0), lock EV (-0.16% vs +0.14%), and lock sharp count (4.4 vs 6.1) are all indistinguishable or *worse* for future Top Picks.

4. **The growth itself is the signal.** At the same 4-star level, Top Picks outperform Non-Top-Picks by 11.8 percentage points in WR (68.9% vs 57.1%) despite having objectively worse input features. The only difference is the path: TP grew from 2.7, NT started at 3.4.

5. **EV improvement is helpful but not required.** Top Picks win at 68-69% WR even when EV is stable or declining. The Pinnacle/line confirmation carries the signal independently of the EV gap.

6. **The causal chain is simpler than hypothesized**: Sharps position early (low stars) → Pinnacle confirms over time → stars grow → play wins at elevated rate. The retail-lag / EV-window mechanism adds value when it happens but isn't the primary driver.

### How to Re-Run

```bash
node scripts/analyzeSharpFlow.js
```

Section 19 of the output maps to this section. Update these tables as the sample grows. Key thresholds: n >= 30 per comparison group for reliability. Current 4-star head-to-head (n=45 vs n=70) is the most statistically meaningful comparison.

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

### Absolute Stars vs Outcomes (167 picks with stars)

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

**Absolute stars do NOT separate winners from losers.** The mid-tier (3.5-4★) is the worst at -27.6% ROI. A play's peak star level tells you how much market consensus exists, not how much remaining edge exists.

### Star Delta vs Outcomes (57 Top Picks where delta ≥ 1.0)

```
Top Pick ★★★★★     5-1    83.3% |   +6.3u | n=6
Top Pick ★★★★     33-14   70.2% |  +18.8u | n=47
Top Pick ★★★       2-2    50.0% |   -4.6u | n=4
```

**Star delta DOES separate winners.** Within the Top Pick subset, the tiers are monotonically ordered — the exact property the star system was designed to have. The crucial distinction: absolute stars measure *where you are*, star delta measures *how you got there*.

### The Two Dimensions of Stars

| Dimension | What It Measures | Predictive? | Current Use |
|-----------|-----------------|-------------|-------------|
| **Absolute level** (peak stars) | Total market consensus at peak | No (r = -0.04) | Unit sizing (BROKEN) |
| **Delta** (peak − lock stars) | Information arrival rate over time | Yes (70.2% WR for ≥1.0) | Top Pick filter + small unit bonus |

The system should weight delta more heavily than absolute level for sizing decisions. A 3.5★ play that grew from 2.0★ (delta 1.5) is far more valuable than a 4.0★ play that locked at 3.5★ (delta 0.5).

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
| **STAR DELTA** | **+0.5u bonus only** | **STRONGEST SUBSET (70.2% WR)** | **ADD +2.5 pts, increase unit bonus** |

### The Core Problem

Current system: **Pinnacle** gets 3 pts (25% of total) — it's the **worst** predictor.
Current system: **EV 1%+** gets only 1 pt (8% of total) — it's the **best** predictor.
Current system: **Implied probability** gets 0 pts — it's the **#1 predictor overall**.
Current system: **Star delta** drives only a small unit bonus — it's the **strongest subset filter** (70.2% WR).

---

## Proposed rateStars() V4

Based on the data audit, here is the proposed new point budget:

| Factor | Max Pts | Share | Logic |
|--------|---------|-------|-------|
| **EV edge** | **+3** | **19%** | `EV 3%+ → +3`, `EV 1%+ → +2.5`, `EV 0-1% → -1` |
| **Star delta** | **+2.5** | **16%** | `δ ≥ 1.5 → +2.5`, `δ ≥ 1.0 → +1.5`, `δ ≥ 0.5 → +0.5` |
| Implied probability | +1.5 | 10% | `Heavy fav → +1.5`, `Fav → +0.5`, `Big dog → -1` |
| Breadth | +1 | 6% | `3-5 wallets → +1`, `6+ → +0.5`, `10+ → 0` |
| Pinnacle (inverted) | +1.5 | 10% | `NO Pinn → +1.5`, `Pinn confirms → 0` |
| Conviction | +1.5 | 10% | Keep existing thresholds |
| Sport specialist | +1.5 | 10% | Keep existing thresholds |
| Pred market | +0.5 | 3% | Reduced from +1.5 |
| RLM | +0.5 | 3% | Reduced from +1.5 |
| Concentration | -1 | pen | Keep existing |
| **Counter-sharp** | **-4** | **pen** | Doubled from -1.5 |
| Flip penalty | -3 | pen | Increased from -2 |
| EV trap (0-1%) | -1 | pen | Increased from -0.5 |

**Note on star delta**: This factor is only available after a play has been locked for some time — at lock time, delta is always 0. The star delta bonus applies at **peak update** and **pregame snapshot** only. Initial lock decisions still use the remaining factors. This makes star delta a **sizing modifier** rather than a lock gate: it can upgrade a play's units after lock but cannot trigger the initial lock.

**New max positive**: ~14 pts | **New max penalty**: -9 pts | **Scale**: `(pts / 14) * 5`, clamped 0.5-5.0

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

STAR DELTA (peak − lock stars):
  δ ≥ 1.5:   +3   (strong temporal convergence)
  δ ≥ 1.0:   +2   (Top Pick threshold — 70.2% WR)
  δ ≥ 0.5:   +0.5
  δ < 0.5:    0   (flat signal — no growth)
```

**Note**: Star delta was not in the original Composite V2 backtest (April 4). Adding it retroactively to the 305-pick dataset would improve ELITE/STRONG tier separation further, but the backtest numbers below reflect the model WITHOUT star delta. Re-run needed to quantify the combined impact.

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

1. **Elevate star delta as a primary sizing signal**: Top Picks (δ ≥ 1.0) go 40-17 (70.2% WR, +15.4% ROI). The current +0.5u bonus is undersized — increase to +1.0u for δ ≥ 1.0 and +1.5u for δ ≥ 1.5. Star delta should be the primary driver of unit sizing above the lock threshold, not absolute star level.
2. **Boost EV 1%+ weight**: From +1 pt to at least +2.5 pts. This is the single strongest standalone signal (76.0% WR, +36.2% ROI).
3. **Increase opposition penalty**: Counter-sharp score caps at -1.5. Contested games are 30.8% WR — this needs to be -3 or more.
4. **Invert Pinnacle weighting**: Change from +3 bonus to neutral/penalty. When Pinnacle already confirms, the edge is priced in (56.0% WR vs 68.6% without).
5. **Add implied probability**: Not in the system at all. It's the #1 predictor (r=+0.36).
6. **Penalize 0-1% EV harder**: Current -0.5 should be -1 or more. This zone is -15% ROI.

### Medium-Term (Needs More Data)

7. **Run star delta cross-analyses**: Top Pick × EV 1%+, Top Pick × Clean, Top Pick × Contested. If CLEAN + TOP PICK + EV 1%+ proves out at 80%+ WR, it becomes the max-conviction profile.
8. **Decompose star delta further**: Is δ ≥ 1.5 meaningfully better than δ = 1.0-1.49? Is there a ceiling? Need 20+ picks per bucket.
9. **Add time-before-game factor**: 4-12h window is -21.5% ROI. Either penalize or use as a modifier.
10. **Criteria count cap**: Penalize 6/6 games (25% WR). The "everything aligns" scenario is a trap.
11. **Sharp count sweet spot**: Penalize 6-12 sharps more aggressively.

### Monitor

12. **Prediction market signal**: Currently +1.5 pts for LEAN consensus. Data shows near-zero predictive power. Consider reducing.
13. **Sport specialist bonus**: Not measurable in graded data yet. Keep but validate as sample grows.
14. **Star delta by sport**: Does temporal convergence work equally well across NHL, MLB, CBB, NBA? Or is it sport-dependent?

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
- `outcome` (1/0), `profit`, `units`, `stars`, `lockStars`
- `starDelta` (= `stars` − `lockStars`, the Top Pick signal)
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
- **NEW**: Star delta by bucket (δ < 0.5, 0.5-0.99, 1.0-1.49, 1.5+)
- **NEW**: Star delta × EV edge cross-analysis
- **NEW**: Star delta × opposition cross-analysis
- **NEW**: Star delta × sport breakdown
- **NEW**: Sharp margin (our sharps − opp sharps) by bucket
- **NEW**: Lock → pregame transformation analysis

---

## Data Capture Changes (April 4, 2026)

### Changes Deployed

1. **Opposition snapshot at lock time** — Every lock write now includes `opposition: { sharpCount, totalInvested, avgBet, stars, counterSharpScore, consensusTier }`. Previously, opposition data was only captured if the other side independently triggered a lock.

2. **Pregame snapshot (~30 min before game)** — A new `pregame` object is written to each locked side 30-35 minutes before game time. Captures the full state: our sharps/money/EV/odds, opposition sharps/money/avgBet/stars, criteria status, and minutes before game. This enables **lock → pregame transformation analysis**.

3. **Hedge wallet exclusion** — `computeSharpFeatures()` now filters out wallets that bet on BOTH sides of the same game before calculating breadth, conviction, and counter-sharp.

4. **EV edge weight boosted** — `rateStars()` EV: `>3% → +2.5`, `>1% → +2`, `0-1% → -1` (was +1/+0.5/-0.5).

5. **Counter-sharp penalty boosted** — `rateStars()` counter-sharp: `≥6 → -3`, `≥3 → -2`, `≥1 → -1` (was -1.5/-1/none).

### Data Gaps (Known Limitations)

| Data | Available From | Before That |
|------|---------------|-------------|
| Lock snapshot (our side) | March 16+ (all picks) | ✓ Full |
| Peak snapshot (our side) | March 25+ (new format) | Old format: no peak |
| Opposition at lock time | **April 4+** | Not captured |
| **Pregame snapshot** | **April 4+** | Not captured |
| Opposition at pregame | **April 4+** | Not captured |

The old format (126 picks, March 16-25) has no `sides` structure, no peak, and no opposition. The new format (179+ picks, March 25+) has lock/peak but opposition was only captured when the other side also triggered a lock (26 games = 52 pick-sides). Starting April 4, every pick captures opposition at lock time AND a full pregame snapshot.

---

## Future Analysis (Come Back in 3-5 Days)

### Priority 0: Star Delta Deep Dive (April 8+)

The Top Pick filter (starDelta ≥ 1.0) is the strongest subset in the dataset at 40-17 (70.2% WR, +15.4% ROI). Priority analyses:

- **Decompose delta buckets**: δ 0-0.49, δ 0.5-0.99, δ 1.0-1.49, δ 1.5+. Is the relationship linear or does it plateau?
- **Cross with EV edge**: Top Pick + EV 1%+ is the hypothesized strongest combo. How many picks qualify? What's the WR?
- **Cross with opposition**: Does star delta survive contested games? Or is Top Pick strong BECAUSE it's mostly clean games?
- **Cross with sport**: Is temporal convergence equally predictive across NHL, MLB, CBB, NBA?
- **Cross with implied probability**: Do Top Pick underdogs outperform? Or is the 70.2% WR mostly heavy favorites?
- **Time-to-growth**: How many hours between lock and peak for Top Picks? Is faster growth better?
- **Backtest Composite V2 + starDelta**: Add δ ≥ 1.0 → +2 pts to V2 scoring and re-run the tier analysis. Expected: STRONG tier improves from 84.7% to 87%+.

### Priority 1: Sharp Margin with Real Data (April 8+)

With opposition now captured at lock time AND pregame, re-run the margin analysis on ALL picks (not just the 26 where the other side also locked). Key questions:

- How many "clean" games at lock time actually had opposition by pregame?
- Does the sharp margin at PREGAME predict better than at LOCK?
- Is a pick that was "clean" at lock but "contested" by pregame a sell signal?

### Priority 2: Lock → Pregame Transformation

Compare the lock snapshot to the pregame snapshot:

| Transformation | Expected Impact | Sample Size Needed |
|---------------|----------------|-------------------|
| Sharps grew +3 or more | Positive? Negative (value captured)? | 20+ |
| Opposition appeared (0 → 1+) | Likely negative | 15+ |
| EV evaporated (1%+ → <0) | Likely very negative | 10+ |
| EV still strong at pregame | Likely very positive | 15+ |
| Stars dropped (peak > pregame) | Unknown | 10+ |
| Consensus shifted (DOMINANT → LEAN) | Likely negative | 10+ |

### Priority 3: Sharp Margin Deep Dive (Expand Sample)

Re-run the sharp margin analysis from this session with the larger dataset. Key findings to validate:

- **Sharp margin is 3-6x more predictive than raw sharp count** (r=+0.19 vs r=+0.03)
- **Negative margin or tied: 0-13 (0% WR)** — does this hold with more data?
- **Breakeven at margin ≥ +3** in contested games
- **NHL contested: 0-9 (0% WR)** — most critical finding to validate
- **6-sharp and 8-sharp death zones** in clean games (45% and 44% WR)
- **CLEAN + EV 1%+: 73.9% WR** — the golden filter

### Priority 4: Pregame Opposition as a Gate

If pregame data confirms that late-appearing opposition is a reliable kill signal, consider:
- Adding a **pregame alert system** that warns when opposition appears after lock
- Adjusting unit sizing downward if pregame shows opposition
- Building a "confidence decay" metric: `lock_confidence - pregame_confidence`

---

*This analysis should be re-run weekly as the sample size grows. Key thresholds to watch: Top Picks maintaining 65%+ WR, EV 1%+ maintaining 70%+ WR, contested games staying below 35% WR, and Pinnacle confirms continuing to underperform NO Pinnacle. **Next analysis target: April 8-9, 2026** — 4 days of pregame snapshot data + star delta decomposition.*

---

## Pinnacle + EV Quadrant Analysis

**Date**: April 6, 2026  
**Script**: `analyzeSharpFlow.js` §20  
**Hypothesis**: Regardless of star level, picks where Pinnacle confirms direction AND EV ≥1% exists will outperform picks without those signals.

### Quadrant Definitions

Every graded pick with EV data (n=248) is classified into one of four quadrants:

| Quadrant | Pinnacle Confirms/Moves | EV ≥ 1% | Meaning |
|----------|------------------------|---------|---------|
| **Q1** | Yes | Yes | Full chain — Pinnacle moved, retail hasn't caught up |
| **Q2** | Yes | No | Gap closed — Pinnacle moved but retail already adjusted |
| **Q3** | No | Yes | Pre-market edge — retail mispriced without Pinnacle movement |
| **Q4** | No | No | Baseline — no directional confirmation, no pricing gap |

"Pinnacle confirms" = `pinnacleConfirms` OR `lineMovingWith` is true.

### Overall Quadrant Results

| Quadrant | n | Record | Win% | ROI |
|----------|---|--------|------|-----|
| **Q1: Pinn + EV ≥1%** | 35 | 21-14 | 60.0% | **+7.1%** |
| Q2: Pinn + EV <1% | 184 | 107-77 | 58.2% | +1.1% |
| **Q3: No Pinn + EV ≥1%** | **4** | **4-0** | **100%** | **+95.0%** |
| Q4: No Pinn + No EV | 25 | 12-13 | 48.0% | -12.0% |

**Key finding**: Q3 (EV alone, no Pinnacle) is 4-0 at +95% ROI. Q2 (Pinnacle alone, no EV) is +1.1% ROI across 184 picks. **EV alone massively outperforms Pinnacle alone.** Q3 sample is small (n=4) but the directional signal is overwhelming.

### Star Level x Quadrant Matrix

#### By Half-Star

| Star | Q1: Pinn + EV | Q2: Pinn, No EV | Q3: No Pinn + EV | Q4: Neither |
|------|---------------|-----------------|-------------------|-------------|
| 4.5★ | 66.7% / +3.9% (n=3) | 57.1% / -6.0% (n=7) | — | — |
| 4★ | 63.6% / +4.1% (n=11) | 54.8% / +1.3% (n=42) | — | — |
| 3.5★ | 37.5% / -24.1% (n=8) | 72.7% / +23.8% (n=55) | — | 0% (n=1) |
| **3★** | **72.7% / +36.1% (n=11)** | 49.1% / -15.6% (n=55) | 100% / +134.7% (n=2) | 46.2% / -13.4% (n=13) |
| 2.5★ | 0% (n=1) | 52.0% / -40.0% (n=25) | 100% / +35.5% (n=2) | 54.5% / +7.4% (n=11) |

**At 3★ and 4-5★, the hypothesis holds strongly**: Q1 significantly outperforms Q2. The 3.5★ Q1 group (n=8, 37.5% WR) is a sample-size anomaly that should be monitored as data grows.

#### By Bucket (larger samples)

| Bucket | Q1: Pinn + EV | Q2: Pinn, No EV | Q3: No Pinn + EV | Q4: Neither |
|--------|---------------|-----------------|-------------------|-------------|
| 4-5★ | 66.7% / +10.7% (n=15) | 55.1% / +0.1% (n=49) | — | — |
| 3-3.5★ | 57.9% / +6.0% (n=19) | 60.9% / +7.2% (n=110) | 100% / +134.7% (n=2) | 42.9% / -21.4% (n=14) |
| 2.5★ | 0% (n=1) | 52.0% / -40.0% (n=25) | 100% / +35.5% (n=2) | 54.5% / +7.4% (n=11) |

### EV Granularity Within Q1 (Pinn + EV)

Not all EV is equal when Pinnacle confirms:

| Pinn + EV Level | n | Win% | ROI |
|-----------------|---|------|-----|
| Pinn + EV 1-2% | 25 | 56.0% | **-11.0%** |
| Pinn + EV 2-3% | 4 | 50.0% | +16.0% |
| **Pinn + EV 3%+** | **6** | **83.3%** | **+68.1%** |

**Critical insight**: The chain only fires at EV 3%+. At 1-2% EV, even with Pinnacle confirming, ROI is negative. The current EV weight brackets (+2 for EV >1%, +2.5 for EV >3%) don't reflect the **massive** performance gap between these tiers. The jump from 1-2% to 3%+ is a 79 percentage point ROI swing.

### Quadrant x Top Pick Cross

| Segment | n | Win% | ROI |
|---------|---|------|-----|
| **Q1 + Top Pick (δ≥1)** | **8** | **87.5%** | **+36.9%** |
| Q1 + Non-Top Pick | 27 | 51.9% | -7.1% |
| Q2 + Top Pick (δ≥1) | 49 | 67.3% | +11.2% |
| Q2 + Non-Top Pick | 135 | 54.8% | -4.4% |
| Q3 + Non-Top Pick | 4 | 100% | +95.0% |

The starDelta momentum signal remains essential even when both Pinnacle and EV are present. Q1 without Top Pick status is barely above .500.

### Conclusions

1. **EV alone (Q3) outperforms Pinnacle alone (Q2)**: 100% WR vs 58.2% WR, +95% ROI vs +1.1% ROI. Sample is small (n=4 vs n=184) but directional signal is clear. EV is the stronger standalone signal.

2. **Pinnacle without EV is near-baseline**: Q2's +1.1% ROI across 184 picks means Pinnacle confirmation alone provides almost no edge. The current +3 pts (22% of budget) for Pinnacle alignment is dramatically overweighted for what it delivers without an EV gap.

3. **EV 3%+ is the threshold that matters**: Within Q1, EV 1-2% is actually negative ROI (-11%). The chain fires at 3%+ (83.3% WR, +68.1% ROI). Current weighting gives +2 pts for EV >1% and +2.5 for >3% — only a 0.5pt difference for a 79pp ROI swing.

4. **Star delta remains the essential third signal**: Q1 + Top Pick = 87.5% WR vs Q1 + Non-Top Pick = 51.9% WR. Even the "full chain" of Pinn + EV needs momentum confirmation to be elite.

5. **Implication for EV weight rebalance**: EV should be (a) weighted higher overall, (b) given a much steeper curve at the 3% threshold, and (c) Pinnacle's weight should be conditional on EV presence — full Pinnacle credit only when the gap exists.

### Rebalance Direction (to be validated with more data)

| Signal | Current Weight | Data-Optimal Direction |
|--------|---------------|----------------------|
| EV 3%+ | +2.5 pts | **INCREASE** — 83.3% WR justifies top-tier weighting |
| EV 1-2% | +2 pts | **DECREASE** — negative ROI even with Pinnacle, near-trap territory |
| Pinnacle (with EV ≥3%) | +3 pts | KEEP or increase — the chain works when the gap is real |
| Pinnacle (with EV <1%) | +3 pts | **DECREASE sharply** — +1.1% ROI doesn't justify 22% of budget |
| Pinnacle (no EV) standalone | +3 pts | **REDUCE to +0.5 to +1** — minimal edge without the gap |

*Re-run when sample sizes grow, especially Q1 (n=35) and Q3 (n=4). The 3.5★ Q1 anomaly (n=8, 37.5% WR) should normalize with more data.*

---

## EV Curve Rebalance (Implemented April 6, 2026)

Based on the Pinnacle + EV Quadrant Analysis findings, the EV weight curve in `rateStars()` was updated:

### Old Curve
```
EV > 3%:  +2.5 pts
EV > 1%:  +2.0 pts
EV > 0%:  -1.0 pts (trap penalty)
Max: 2.5 pts (18.5% of 13.5 budget)
```

### New Curve
```
EV > 3%:  +3.5 pts   (83.3% WR, +68.1% ROI — max weight)
EV > 2%:  +2.5 pts   (50% WR, +16% ROI — strong credit)
EV > 1%:  +1.5 pts   (56% WR, -11% ROI — reduced from +2)
EV > 0%:  +0.5 pts   (any positive EV = gap exists, no penalty)
Max: 3.5 pts (24.1% of 14.5 budget)
```

### Key Changes
1. **EV is now the dominant signal** at 24.1% of the point budget (up from 18.5%)
2. **No penalty for any positive EV** — the 0-1% trap penalty was removed. Any positive EV indicates a Pinnacle-retail gap exists.
3. **Steep curve at 3%** — the jump from +1.5 (EV 1-2%) to +3.5 (EV 3%+) reflects the 79 percentage point ROI swing between these tiers.
4. **New 2% tier** — EV 2-3% gets its own bracket (+2.5) instead of being lumped with 1%+.
5. **maxPts updated** from 13.5 to 14.5.

### MaxEV Tracking (Also Implemented)

A new `maxEV` / `maxEVAt` field pair is now tracked per side in Firebase. On every 15-minute sync, if the current EV exceeds the stored maximum, `maxEV` is updated regardless of whether stars or units changed. This captures transient EV windows that the peak-gated update previously missed. Historical picks will show `null` for these fields; they will populate going forward.
