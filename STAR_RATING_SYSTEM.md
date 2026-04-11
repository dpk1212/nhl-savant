# Sharp Flow — Star Rating V6, Bet Recommendation & Unit Sizing System

## Overview

The star rating is the **single source of truth** for every decision in Sharp Flow:
- Whether a play gets **locked** (auto-tracked)
- How many **units** to risk
- How it's **categorized** in performance tracking

Stars are not a separate visual layer — they ARE the system. What you see on the card is exactly what drives the bet.

---

## The Star Rating Model (V6)

Every play is scored using a **proprietary weighted signal model** that evaluates multiple dimensions of sharp activity, market pricing, and directional momentum. The model decomposes consensus into **breadth**, **conviction**, and **concentration**, and includes **counter-sharp detection**, **RLM interaction**, **CLV tracking**, **conditional context signals**, and **sport-specific adjustments**.

### V6 Changes (2026-04-11)

1. **Trimmed breadth ceiling** — max 2.5pts (was 3). Mid-range bumped. Prevents crowded boards from auto-inflating stars while keeping healthy consensus strong.
2. **Bumped conviction** — max 2.5pts (was 1.5). Added 0.6 tier. Rewards "fewer, stronger wallets" — the #1 independent predictive signal in the deep audit.
3. **Conditional Pinnacle** — full bonus only on borderline plays (LEAN/CONTESTED consensus), halved on STRONG/DOMINANT. Audit showed "No Pinn" outperformed "Pinn confirms" at every breadth level.
4. **Sport-specific bonuses** — MLB gets broader consensus bonus (5-7+ wallets). NHL/CBB get specialist-group bonus (sport-verified sharps in tight groups). NBA gets no bonus (weak across the board).

### Signal Weights (max ~15 points, normalized to 0.5–5.0 stars)

| Signal | Max Points | Notes |
|--------|-----------|-------|
| **Sharp Breadth** (quality-weighted) | 2.5 pts | Tier-weighted wallet diversity. Flattens past mid-range to prevent crowd inflation. |
| **Pinnacle Alignment** (conditional) | 2 pts / -1 penalty | Conditional on consensus tier. Full value on borderline plays, halved on strong plays. |
| **Sharp Conviction** | 2.5 pts | log-dollar per wallet, normalized. Primary signal — 4-tier curve. |
| **Concentration Penalty** | 0 to -1 pts | When one wallet dominates >80% of consensus money. Softened for ELITE-led with 4+ wallets. |
| **Counter-Sharp Penalty** | 0 to -3 pts | When ELITE/SHARP-tier wallets are on the opposing side. |
| **EV Edge** | 3.5 pts max | Steep 4-tier curve. Strongest contextual signal. |
| **Consensus Strength Bonus** | up to 2 pts | DOMINANT (+2) or STRONG (+1) sharp agreement. |
| **Prediction Market** (conditional) | up to 1.5 pts | Conditional on consensus tier (LEAN/CONTESTED benefit most). |
| **RLM Interaction** (ML only) | up to 1.5 pts | Public opposes + line confirms sharps = upgrade. |
| **Sport-Specific Bonus** | up to 1 pt | MLB broader consensus, NHL/CBB specialist group. |
| **Sport Specialist Bonus** | up to 1.5 pts | Wallets profitable in this specific sport. |
| **Implied Probability** | +0.5 / -0.5 pts | Small nudge based on Pinnacle line. |
| **Flip Penalty** (ML only) | 0 to -2 pts | Opposing side already locked at peak. |
| **Dog Penalty** | 0 to -2 pts | Long dogs +151/+200 historically lose at high rates. |
| **NBA Dog Penalty** | -1.5 pts | NBA dogs +100 and above. |

---

## Phase 1: Decomposed Consensus — `computeSharpFeatures()`

### Net-Position Approach

Wallets with positions on both sides are handled via net-position: if a wallet has $1K on one side and $500 on the other, the $500 difference counts on the dominant side. This prevents hedgers from being fully excluded while correctly netting out their exposure.

### How it works

`computeSharpFeatures(positions, consensusSide)` computes from raw position data:

- **breadth**: Quality-weighted unique wallet count on consensus side. ELITE=3x, SHARP=2x, PROVEN=1.5x, ACTIVE=1x. Normalized against max possible (if all wallets were ELITE).
- **conviction**: `log10(avgInvestedPerWallet)` normalized to 0–1. $100 avg = 0, $10K avg = 1.
- **concentration**: `maxSingleWalletInvested / totalConsensusInvested`. Penalty triggers above 80%.
- **counterSharpScore**: ELITE wallets opposing = 3 pts each, SHARP opposing = 2 pts each. Net of consensus side quality.
- **consensusTier**: Blended money% (60%) + wallet% (40%). DOMINANT ≥80, STRONG ≥65, LEAN ≥55, CONTESTED <55.
- **sportSharpCount**: Wallets with `sportVerified === true` on consensus side.

### V6 Scoring

**Sharp Breadth (max 2.5 pts)** — trimmed ceiling, bumped mid-range
- breadth ≥ 0.50: +2.5 pts (was +3)
- breadth ≥ 0.35: +2 pts (unchanged)
- breadth ≥ 0.20: +1.5 pts (was +1)
- breadth ≥ 0.10: +0.5 pts (unchanged)

**Sharp Conviction (max 2.5 pts)** — bumped from 1.5, added tier
- conviction ≥ 0.80: +2.5 pts (was +1.5)
- conviction ≥ 0.60: +2 pts (new tier)
- conviction ≥ 0.40: +1.5 pts (was +1 at 0.50)
- conviction ≥ 0.25: +0.75 pts (was +0.5)

**Concentration Penalty (0 to -1 pts)** — context-aware
- concentration > 90%: -1 pt (or -0.5 if ELITE-led + 4+ wallets)
- concentration > 80%: -0.5 pts (or -0.25 if ELITE-led + 4+ wallets)

---

## Phase 2: Counter-Sharp Detection

When ELITE or SHARP-tier wallets are on the opposing side, consensus is less trustworthy regardless of dollar volume.

**Counter-Sharp Penalty (0 to -3 pts)**
- counterSharpScore ≥ 6: -3 pts (multiple elite wallets disagree)
- counterSharpScore ≥ 3: -2 pts (meaningful opposition)
- counterSharpScore ≥ 1: -1 pt (minor opposition)

---

## Phase 3: Conditional Pinnacle Alignment (V6)

Pinnacle alignment is now **conditional on consensus tier**. The deep audit revealed "No Pinn" (67% WR, +28.1u) outperformed "Pinn confirms" (56% WR, -26.3u) at every breadth level — Pinnacle was adding noise to plays that already had strong consensus.

**Borderline plays (LEAN / CONTESTED consensus):**
- Pinnacle confirms + line moving with play: +2 pts
- Pinnacle confirms only OR line moving with play: +1 pt

**Strong plays (STRONG / DOMINANT consensus):**
- Pinnacle confirms + line moving with play: +1 pt
- Pinnacle confirms only OR line moving with play: +0.5 pts

**All plays:**
- Line moving against consensus: -1 pt

---

## Phase 4: RLM (Reverse Line Movement) as Interaction Term (ML only)

RLM is only useful WHEN it confirms the wallet signal. It's not a standalone signal.

**Conditions for RLM upgrade:**
- Public tickets < 50% on consensus side
- Ticket divergence ≥ 10 points

**Scoring:**
- Full RLM (public opposes + Pinnacle line moving WITH sharps + divergence ≥ 10): +1.5 pts
- Partial RLM (public opposes + divergence ≥ 10, line not confirmed): +0.75 pts

---

## Phase 5: Sport-Specific Handling (V6 NEW)

Sharp wallet behavior differs by sport. The deep audit confirmed that different consensus patterns predict differently across sports.

**MLB — Broader Consensus Bonus:**
- 7+ consensus wallets: +1 pt
- 5+ consensus wallets: +0.5 pts
- Rationale: MLB 7+ sharps go 69% WR vs 56% average.

**NHL / CBB — Specialist Group Bonus:**
- 2+ sport-verified sharps in a tight group (≤5 wallets): +1 pt
- 1+ sport-verified sharp in a tight group (≤4 wallets): +0.5 pts
- Rationale: NHL/CBB 1-3 sharps go 67%/65% WR — specialist knowledge outperforms crowd size.

**NBA — No bonus.** Performance is weak across the board. Existing dog penalties apply.

This stacks on top of the general sport specialist bonus (wallets profitable in this specific sport, max 1.5 pts).

---

## Other Scoring

**EV Edge (max 3.5 pts)**
- Above 3%: +3.5 pts
- 2–3%: +2.5 pts
- 1–2%: +1.5 pts
- 0–1%: +0.5 pts

**Implied Probability (±0.5 pts)**
- Pinnacle implied ≥ 75%: +0.5 pts
- Pinnacle implied < 30%: -0.5 pts

**Consensus Strength Bonus (up to 2 pts)**
- DOMINANT: +2 pts
- STRONG: +1 pt

**Prediction Market (conditional, up to 1.5 pts)**
- LEAN/CONTESTED + pred aligns: +1.5 pts
- STRONG + pred aligns: +0.5 pts
- DOMINANT + pred aligns: +0.25 pts

**Sport Specialist Bonus (max 1.5 pts)**
- 3+ sport-verified sharps: +1.5 pts
- 2 sport-verified sharps: +1 pt
- 1 sport-verified sharp: +0.5 pts

**Flip Penalty (ML only)**
- Opposing side peaked at ≥4.5★: -2 pts
- Opposing side peaked at ≥3.5★: -1.5 pts
- Opposing side peaked at ≥3★: -1 pt

**Dog Penalty**
- Odds ≥ +200: -2 pts
- Odds ≥ +151: -1 pt

**NBA Dog Penalty**
- NBA + odds ≥ +100: -1.5 pts

---

## CLV (Closing Line Value) Tracking

### What CLV is

The difference between the Pinnacle odds when a pick was locked and the Pinnacle odds at game start (the "close"). Beating the close is the gold-standard measure of sharp betting — more predictive of long-term profitability than win rate.

### How it works

1. **`updateClosingOdds.js`** runs every 15 minutes alongside market data fetches. For each PENDING pick, it reads current Pinnacle odds from `pinnacle_history.json` and writes `closingOdds` / `closingPinnProb` to each side of the pick document. The last write before game start becomes the close.

2. **`betTracking.js`** computes CLV at grading time:
   ```
   lockProb  = impliedProb(sides.<side>.lock.pinnacleOdds)
   closeProb = impliedProb(sides.<side>.closingOdds)
   clv       = closeProb - lockProb  // positive = beat the close
   ```

3. **Performance dashboard** displays:
   - Average CLV per pick
   - CLV-positive rate (% of picks that beat the close)
   - Total CLV-tracked picks

---

## Star-to-Label Mapping

| Stars | Label | Meaning |
|-------|-------|---------|
| ★★★★★ (5.0) | **ELITE PLAY** | Maximum conviction — all signals aligned |
| ★★★★½ (4.5) | **ELITE PLAY** | Near-perfect signal alignment |
| ★★★★ (4.0) | **STRONG PLAY** | Dominant consensus + confirming signals |
| ★★★½ (3.5) | **STRONG PLAY** | Above-average conviction across multiple signals |
| ★★★ (3.0) | **SOLID PLAY** | Strong consensus with confirming signals |
| ★★½ (2.5) | **SOLID PLAY** | Good consensus support — meets conviction threshold |
| ★★ (2.0) | LEAN | Moderate sharp interest — limited confirmation |
| ★½ (1.5) | DEVELOPING | Early sharp activity — watching for more signals |
| ★ (1.0) | MONITORING | Low activity — not yet actionable |
| ½ (0.5) | MONITORING | Minimal data available |

---

## Lock Threshold & Minimum Invested Requirements

A play is **LOCKED IN** (auto-tracked, assigned units, tracked for performance) when it meets ALL of the following:

### Moneyline (ML) Picks
- Star rating ≥ **2.5 stars**
- Total consensus-side invested ≥ **$7,000**

### Spread Picks
- Star rating ≥ **2.5 stars**
- Consensus-side wallet count ≥ **2 wallets**
- Total consensus-side invested ≥ **$5,000**

### Total (O/U) Picks
- Star rating ≥ **2.5 stars**
- Consensus-side wallet count ≥ **2 wallets**
- Total consensus-side invested ≥ **$5,000**

**These thresholds are enforced in `SharpFlow.jsx` and are MANDATORY. No bet should ever be written to Firebase without meeting these minimums.** The star rating already accounts for all signal factors. The invested minimums ensure there is meaningful sharp conviction behind every tracked play.

### Code References

```javascript
// ML lock (SharpFlow.jsx line ~3349)
const isLocked = sr.stars >= 2.5 && consensusInvested >= 7000;

// Spread lock (SharpFlow.jsx line ~3477-3479)
const isSpreadLocked = spreadSr && spreadSr.stars >= 2.5
  && (spreadSharpFeatures?.conWalletCount || 0) >= 2
  && (spreadSharpFeatures?.conTotalInvested || 0) >= 5000;

// Total lock (SharpFlow.jsx line ~3555-3557)
const isTotalLocked = totalSr && totalSr.stars >= 2.5
  && (totalSharpFeatures?.conWalletCount || 0) >= 2
  && (totalSharpFeatures?.conTotalInvested || 0) >= 5000;
```

---

## Unit Sizing

Units are derived directly from the star rating. Higher-conviction plays receive proportionally larger positions.

### ML Unit Sizing

| Star Rating | Base Units | Tier |
|-------------|-----------|------|
| ★★★★★ (5.0) | 3.5u | MAX |
| ★★★★½ (4.5) | 3.0u | MAX |
| ★★★★ (4.0) | 2.5u | STRONG |
| ★★★½ (3.5) | 2.0u | STRONG |
| ★★★ (3.0) | 1.5u | STANDARD |
| ★★½ (2.5) | 1.0u | STANDARD |

Dog caps (ML): +200 → max 0.5u, +151 → max 1.0u, +100 → max 2.0u.

### Spread/Total Unit Sizing

| Star Rating | Base Units |
|-------------|-----------|
| ★★★★★ (5.0) | 2.0u |
| ★★★★½ (4.5) | 1.75u |
| ★★★★ (4.0) | 1.5u |
| ★★★½ (3.5) | 1.25u |
| ★★★ (3.0) | 1.0u |
| ★★½ (2.5) | 0.5u |

Dog caps (Spread/Total): +200 → max 0.5u, +151 → max 0.75u, +100 → max 1.0u.

### Consensus Adjustment

After the base size is set, a consensus-quality adjustment is applied. Plays with dominant consensus keep their full size. Plays with weaker or split consensus are scaled down.

---

## Built-In Safeguards

### Minimum Invested Enforcement

**ML plays require $7K+ invested on the consensus side. Spread/Total plays require $5K+ invested AND 2+ wallets.** This prevents low-conviction noise from generating tracked bets. This is enforced at the lock-decision level in `SharpFlow.jsx` — no Firebase write occurs unless the threshold is met.

### Pinnacle Opposition Protection

When Pinnacle's line is actively moving against the sharp consensus side, the play receives a **-1 pt penalty**.

### Counter-Sharp Protection

When ELITE or SHARP-tier wallets are on the opposing side, the play receives up to **-3 pts penalty**. High dollar consensus is less meaningful when the best wallets disagree.

### Concentration Protection

When a single wallet accounts for >80% of consensus-side money, the play is penalized up to **-1 pt**. Softened to -0.5 when the dominant wallet is ELITE tier and 4+ other wallets confirm.

### RLM Upgrade (ML only)

When public bettors are heavily against the sharp side but the line still moves with sharps (Reverse Line Movement), the play gets up to **+1.5 pts**.

### EV Edge as Primary Contextual Signal

EV edge uses a steep 4-tier curve (+0.5 / +1.5 / +2.5 / +3.5). No positive EV interval is penalized.

### Conditional Context Signals (V6)

Pinnacle and prediction market signals are weighted conditionally based on consensus strength. This prevents context signals from inflating plays that already have overwhelming consensus, reducing signal clutter.

### Dog Penalties

Long dogs (+151/+200) receive star penalties AND unit caps. NBA dogs (+100 and above) receive an additional -1.5 pt penalty. These are based on historical data: +176+ dogs are 2-20 (9.1% WR), +251+ dogs are 0-12, NBA dogs are 3-20 (13% WR).

---

## Architecture

### Data Pipeline

| Script | Purpose | Schedule |
|--------|---------|----------|
| `snapshotPinnacle.js` | Captures Pinnacle + retail odds | Every 15 min |
| `fetchPolymarketData.js` | Polymarket event data | Every 15 min |
| `fetchKalshiData.js` | Kalshi event data | Every 15 min |
| `scanSharpPositions.js` | Sharp wallet positions | Every 15 min |
| `updateClosingOdds.js` | Closing Pinnacle odds to Firebase | Every 15 min |
| `betTracking.js` | Grading + CLV computation | Firebase Cloud Function |

### Sports Tracked

NHL, CBB, MLB, NBA — all use the same base star rating model with sport-specific bonuses layered on top.

---

## Design Principles

1. **Conviction is king.** Average bet size per wallet is the #1 independent predictive signal. Fewer, stronger wallets outperform large crowds.

2. **Breadth has diminishing returns.** Quality-weighted wallet diversity matters up to a point, then flattens. More sharps ≠ better play.

3. **Context is conditional.** Pinnacle alignment and prediction markets only help borderline plays. Strong consensus plays don't need external confirmation.

4. **Stars are the single source of truth.** No hidden gates, no overrides (except minimum invested thresholds). What you see is what the system believes.

5. **Penalties are baked in, not bolted on.** Counter-sharp opposition, concentration risk, Pinnacle opposition, dog penalties, and flip situations reduce the star count directly.

6. **Sports are not identical.** MLB rewards broader consensus, NHL/CBB reward specialist knowledge. The model respects these differences with targeted bonuses.

7. **Minimum invested thresholds prevent noise.** ML requires $7K, Spread/Total requires $5K. No bet is ever written without meaningful sharp conviction behind it.

8. **CLV is the ultimate validation.** Beating the closing line consistently is the gold-standard measure of sharp betting edge.

9. **Data-driven weights.** Signal weights are validated against historical outcomes (433+ graded picks) and refined based on deep audits.
