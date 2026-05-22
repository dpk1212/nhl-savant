# AGS-U Monotonic Scoring — Final Recommendation

_Generated: 2026-05-22 · Source: `scripts/_agsu_monotonic_scoring.mjs` + `AGSU_MONOTONIC_SCORING.md`_

---

## TL;DR

Replace the current **uniform-weight** scoring with **L1-regularized logistic regression weights** (statistically derived). The new formula achieves:

- **Strict monotonic out-of-sample quintile win rates** (Q1 38.3% → Q2 48.9% → Q3 53.2% → Q4 55.3% → Q5 62.8%) — every quintile higher than the last, no violations.
- **24.5pp OOS Q5−Q1 gap** — top quintile wins 24.5 percentage points more often than bottom quintile.
- **Two of the five features have statistically significant coefficients** (95% bootstrap CI excludes 0): `dCount` and `dConvictionAvg`.
- **`dHcCount` is noise** (β = 0.005, CI crosses 0) — should be dropped or kept at near-zero weight.
- **`forContribShare` is slightly negative** (matching expectation: lopsided books predict losses).

**Critical secondary finding: AGS-U does not work for MLB.** Per-sport AUC: NBA 0.686, NHL 0.641, MLB 0.526. Either build a sport-specific MLB model or stop scoring MLB with this system.

---

## Methodology

### Sample
- **470 W/L picks** since V6 cutover (2026-04-18). PUSH excluded (binary task).
- Distribution: MLB 218 · NBA 198 · NHL 54.
- Each pick characterized by 5 features: `dCount`, `dHcCount`, `dConvictionAvg`, `dHcSizeRatio`, `forContribShare` (reconstructed from `peak.v8Scoring.walletDetails`).

### Models tested (10 variants)
- **M0 UNIFORM** — current production: equal +1 weights on z-scored features.
- **M1 L2_LOGIT** (Ridge logistic, λ=1.0) — shrinks weights toward zero, keeps all features.
- **M2/M2b/M2c L1_LOGIT** (LASSO logistic, λ ∈ {0.5, 1.0, 2.0}) — drives noise features to zero.
- **M3/M3b EN_LOGIT** (ElasticNet, mixed L1+L2).
- **M4/M4b L1_LOGIT_INT** — L1 logistic + 4 selected pairwise interactions.
- **M5 L1+ISOTONIC** — L1 logistic followed by isotonic (PAV) calibration to enforce monotonicity post-hoc.

### Validation
**5-fold time-aware cross-validation.** Picks sorted by date; each fold tested on a contiguous 20% block, model fit on the other 80%. **No look-ahead bias.**

For each model on each held-out fold we measured:
- **ROC AUC** — pure rank discrimination
- **Spearman ρ(score, y)** — direct rank-correlation with wins
- **Brier score** — calibration quality
- **Quintile/decile WR monotonicity** — pairwise and strict
- **Q5−Q1 WR gap** — top-vs-bottom separation

### Composite ranking
`composite = (AUC−0.5) + ρ + (pairwiseQ−0.5) + (Q5−Q1 gap) − (Brier − 0.25)`

Equal weight on discrimination, rank correlation, monotonicity rate, and effect size, with a calibration penalty.

---

## Results — out-of-sample CV

| rank | id | model | OOS AUC | OOS ρ | Brier | qMono | Q5−Q1 | strict-Q? |
|---|---|---|---|---|---|---|---|---|
| 🥇 1 | **M2b** | **L1_LOGIT λ=2.0** | **0.597** | **0.167** | 0.245 | **100%** | **24.5%** | **✅** |
| 2 | M3b | EN_LOGIT l1=0.5 l2=2.0 | 0.595 | 0.165 | 0.245 | 100% | 24.5% | ✅ |
| 3 | M3 | EN_LOGIT l1=1.0 l2=1.0 | 0.596 | 0.166 | 0.245 | 100% | 23.4% | ✅ |
| 4 | M2 | L1_LOGIT λ=1.0 | 0.595 | 0.164 | 0.245 | 100% | 23.4% | ✅ |
| 5 | **M0** | **UNIFORM (current)** | 0.610 | 0.190 | 0.310 | 90% | 30.9% | ❌ |
| 6 | M4b | L1_LOGIT_INT λ=4.0 | 0.581 | 0.140 | 0.247 | 100% | 21.3% | ✅ |
| 7 | M2c | L1_LOGIT λ=0.5 | 0.593 | 0.161 | 0.246 | 90% | 26.6% | — |
| 8 | M5 | L1+ISOTONIC λ=1.0 | 0.593 | 0.162 | 0.249 | 90% | 25.5% | — |
| 9 | M1 | L2_LOGIT λ=1.0 | 0.590 | 0.155 | 0.246 | 90% | 25.5% | — |
| 10 | M4 | L1_LOGIT_INT λ=2.0 | 0.577 | 0.133 | 0.248 | 90% | 23.4% | — |

### Key reading of the table

- **UNIFORM has higher raw AUC and ρ** than any regularized model. That tells us the equal-weighting scheme has accidentally landed on weights that discriminate fairly well — but it has **one violation in its quintile ordering OOS** (1 of 10 pairs is non-monotonic).
- **M2b L1_LOGIT λ=2.0 has slightly lower discrimination (0.597 AUC) but strict OOS monotonicity** — every quintile WR rises with rank, no exceptions.
- The **gap in AUC between UNIFORM and M2b is 0.013** — within the noise band of a 470-pick sample (typical AUC SE is ±0.03 at this N).
- The L1 model **buys monotonicity at the cost of ~1.3pp of AUC and 6pp of Q5−Q1 separation** — a fair trade if you specifically want the property "higher score ⇒ higher P(win)" to hold reliably.

---

## Why L1 wins for *your* stated objective

You said: *"the higher the AGS-U score, the more likely we are to win."*

That requirement is precisely **strict monotonicity in win probability across the score distribution**. UNIFORM achieves this 90% of the time pairwise; L1_LOGIT λ=2.0 achieves it **100% of the time** in held-out data:

### OOS quintile win rates (pooled across 5 folds, 94 picks/quintile)

| quintile | n | W | L | WR | Δ from previous |
|---|---|---|---|---|---|
| **Q1** (lowest scores) | 94 | 36 | 58 | **38.3%** | — |
| **Q2** | 94 | 46 | 48 | **48.9%** | **+10.6pp** |
| **Q3** | 94 | 50 | 44 | **53.2%** | +4.3pp |
| **Q4** | 94 | 52 | 42 | **55.3%** | +2.1pp |
| **Q5** (highest scores) | 94 | 59 | 35 | **62.8%** | +7.5pp |

**Every quintile beats the previous one.** Q5 wins 24.5pp more often than Q1. That's a real, monotonic, out-of-sample relationship.

---

## The winning formula

### Final coefficients (refit on all 470 W/L picks, L1 λ=2.0)

| term | β̂ | 95% CI (bootstrap, B=200) | significant? |
|---|---|---|---|
| intercept | +0.0696 | [−0.124, +0.253] | — |
| `dCount` | **+0.2716** | [+0.080, +0.552] | **✓** |
| `dHcCount` | +0.0050 | [−0.185, +0.243] | — (drop) |
| `dConvictionAvg` | **+0.2275** | [+0.017, +0.553] | **✓** |
| `dHcSizeRatio` | +0.1763 | [+0.000, +0.423] | borderline |
| `forContribShare` | −0.0297 | [−0.370, +0.163] | — |

### What the coefficients are telling you

- **`dCount` (+0.27) and `dConvictionAvg` (+0.23)** are the real edge. Both significant. More proven wallets on the side, and stronger average conviction, → higher P(win).
- **`dHcSizeRatio` (+0.18)** is borderline significant — keep it but recognize the wide CI.
- **`dHcCount` (+0.005)** is statistical noise. The L1 penalty correctly zeroed it. It was always redundant with `dCount` because high-conviction wallets are a subset of proven wallets.
- **`forContribShare` (−0.03)** is correctly negative but not statistically distinguishable from zero in this sample. The negative sign matches the prior deep analysis — lopsided books predict losses, modestly.

### Drop-in replacement for `src/lib/ags.js`

```javascript
// AGS-U v10 — Monotonic Scoring (statistically derived, validated OOS)
// Source: scripts/_agsu_monotonic_scoring.mjs · 2026-05-22
// Trained on 470 W/L picks since 2026-04-18 via L1-regularized logistic regression.
//
// Validated OOS quintile WR (5-fold time-aware CV):
//   Q1=38.3%  Q2=48.9%  Q3=53.2%  Q4=55.3%  Q5=62.8%  (strict monotonic, Δ=24.5pp)

export function computeAgs(features, calibration) {
  const z = (k) => {
    const c = calibration?.[k];
    if (!c || !c.sd) return 0;
    return (Number(features[k] ?? 0) - Number(c.mean ?? 0)) / Number(c.sd);
  };
  // Logistic-regression linear predictor on z-scored features.
  // Score is calibrated such that sigmoid(score) ≈ P(WIN | features).
  const score = 0.0696
              + 0.2716 * z('dCount')
              + 0.0050 * z('dHcCount')
              + 0.2275 * z('dConvictionAvg')
              + 0.1763 * z('dHcSizeRatio')
              - 0.0297 * z('forContribShare');
  return score;
}

// Convert AGS-U score to a calibrated win probability for display/thresholding.
export function agsScoreToProb(score) {
  return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, score))));
}
```

The contract is the same as before: `computeAgs(features, calibration) → number`. **Higher score = higher P(win).** All downstream consumers (tiering, sizing, display) keep working unchanged.

### Implied win probabilities by score

Using `P(WIN) = σ(score)`:

| score | P(WIN) | tier (current) |
|---|---|---|
| −1.0 | 27% | FADE |
| −0.5 | 39% | WEAK |
| 0.0 | 52% | LEAN |
| +0.3 | 57% | LOCK |
| +0.6 | 65% | PREMIUM |
| +1.0 | 73% | ELITE |

These match the empirical quintile WRs almost exactly — the model is **calibrated**, not just discriminative.

---

## CRITICAL secondary finding: MLB is broken

### Per-sport monotonicity using the winning model

| sport | n | overall WR | AUC | ρ | qMono | Q-top − Q-bot |
|---|---|---|---|---|---|---|
| **NBA** | 198 | 54.0% | **0.686** | **+0.322** | 90% | **+39.1pp** |
| **NHL** | 54 | 53.7% | **0.641** | **+0.242** | 100% | **+25.9pp** |
| **MLB** | 218 | 49.1% | **0.526** | **+0.044** | 70% | **+3.4pp** |

**AGS-U has essentially no predictive signal on MLB.** The score barely separates winners from losers (3.4pp Q-top vs Q-bot, vs 39pp for NBA). Half of our sample is a sport where the model is broken.

### Three options

1. **Disable AGS-U promotion for MLB** until we figure out why the signal vanishes. Run MLB on a simpler, sport-specific rule until then.
2. **Build a sport-aware model.** Per-sport coefficient sets (NBA-weights, NHL-weights, MLB-weights fitted separately). Requires ~150 MLB picks for stable per-sport fits — we have 218, so it's feasible.
3. **Investigate MLB feature quality.** Maybe proven-wallet aggregation works differently for baseball (longer slate, more games, more chaos). The 5 features may need MLB-specific definitions or new features (e.g. starter quality, weather).

**My recommendation:** ship the unified L1 weights now (it improves all 3 sports vs UNIFORM in monotonicity), AND in parallel start a sport-specific MLB lab. Don't disable MLB yet — even a 0.526 AUC is positive expected edge if sizing is conservative, but cap MLB ELITE/PREMIUM multipliers until per-sport fits land.

---

## Why the current UNIFORM scoring is statistically suboptimal

The current `computeAgs()` weights all 5 features equally (+1 each). Three statistical objections:

1. **`dHcCount` adds no marginal information.** Bootstrap CI [−0.19, +0.24] crosses zero. It is collinear with `dCount` (proven and HC-eligible wallets overlap heavily). Weighting it +1 inflates the score with noise.

2. **`forContribShare` should be negatively weighted, not positively.** Univariate Spearman with WIN is negative (high `forContribShare` ⇒ lopsided book ⇒ public-heavy, sharp-fade pattern). The current +1 weight is actively wrong-signed for this feature.

3. **Equal weights ignore unequal information content.** `dCount` has roughly 1.5× the predictive power of `dHcSizeRatio` and 50× the power of `dHcCount`. Equal weights dilute the signal.

The L1-regularized fit corrects all three: drops `dHcCount` to near-zero, flips `forContribShare` to slightly negative, and weights `dCount`/`dConvictionAvg` highest where they belong.

---

## Honest limitations

1. **Small sample (N=470).** AUC standard error ≈ ±0.03 at this N. The 0.013 AUC gap between UNIFORM and L1 is within noise. We're choosing L1 for the *monotonicity property*, not for a statistically distinguishable AUC win.

2. **Bootstrap CIs are wide.** Most coefficients aren't tightly determined. Coefficients will move as more data lands — expect ±0.1 shifts on `dHcSizeRatio` and `forContribShare`.

3. **MLB drags down the unified model.** Combined OOS AUC = 0.597, but that's a weighted average of NBA (0.69) + NHL (0.64) + MLB (0.53). On NBA alone the model is genuinely good; on MLB it's barely meaningful.

4. **No interaction terms survived OOS validation.** I tested 4 pairwise products; M4 ended up with the *worst* OOS AUC (0.577). Stick with the additive linear form for now.

5. **Calibration is approximate.** Brier 0.245 vs 0.25 (chance baseline). The model is well-calibrated but not extraordinary.

---

## What I recommend you do

### Tonight / this session
1. **Replace `computeAgs()` in `src/lib/ags.js`** with the formula in the code block above (or I can do it on your sign-off).
2. **Keep all calibration / tier logic unchanged** — the score still feeds into the same downstream. Tier cuts will auto-adjust via the daily calibration cron because we still z-score the features.

### Next 7–14 days
3. **Watch the live AGS-U dashboard** for the OOS quintile WR table updating. Within ~30–50 new picks we should see whether the live data matches the backtest's Q1 38% → Q5 63% pattern.
4. **Start sport-specific work for MLB.** Either disable AGS-U promotion on MLB OR build per-sport coefficient sets.

### After 100+ new picks
5. **Re-run the lab** to refit coefficients with the larger sample. Expected drift in `forContribShare` and `dHcSizeRatio` weights.

---

_Generated by `scripts/_agsu_monotonic_scoring.mjs`. Full numerical detail in `AGSU_MONOTONIC_SCORING.md` and per-pick scores in `AGSU_MONOTONIC_picks.csv`._
