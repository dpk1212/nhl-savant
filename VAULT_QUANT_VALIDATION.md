# Vault Quant Score v1 — Shadow-Mode Validation Report

Two-axis 1.0–5.0 score for **every** position in `sharp_action_positions`
(Vault + Shadow tiers). Written to Firebase under the `vault_*` prefix only —
no UI surface yet. Runs on the 2h `writeSharpActions` cron, plus a daily
whitelist refresh via `backfill-vault-quant.yml`.

---

## Axes

| Axis | Source | Threshold | Why |
|---|---|---|---|
| **Winners margin (Δ_winner)** | Unique CONFIRMED/FLAT sport-winner wallets on my side − opposing side | — | V8_DAILY_PNL validated monotonic ladder: Δ≥+2 → 75% WR / +79% ROI ; Δ≤−2 → 0% WR / −100% ROI |
| **Quality margin (Δ_quality, T=30)** | Unique wallets with `v8_walletContribution ≥ 30` on my side − opposing side | 30 | V8_CONTRIBUTION_EDGE strongest single correlation: ρ(margin, flat ROI) = 0.365 |

## Formula

```
base  = 4.5 if Δ_winner ≥ +2 else 3.5 if Δ_winner = +1 else 2.5 if Δ_winner = 0
      else 1.5 if Δ_winner = -1 else 1.0 (Δ ≤ -2)

adj   = +0.5 if Δ_quality ≥ +3 else 0 if Δ_quality ≥ +1
      else -0.5 if Δ_quality = 0 else -1.0 (Δ < 0)

score = clamp(base + adj, 1.0, 5.0) rounded to nearest 0.5

// Hard rules (live-validated edges)
if Δ_winner ≤ -2              → score = 1.0   (0% WR in live sample)
if Δ_winner ≥ +2 AND Δ_q ≥ +1 → score = 5.0   (both elite)
```

## Labels

| Score | Label |
|---|---|
| 5.0 | ELITE |
| 4.0 – 4.5 | STRONG |
| 3.0 – 3.5 | SOLID |
| 2.0 – 2.5 | DEVELOPING |
| 1.0 – 1.5 | MUTED |

---

## Retro-validation — initial backfill 2026-04-20

679 positions (608 graded, 71 pending). Current `sharpWalletProfiles`
applied to historical picks to answer: *"do positions we now know to be
winners-stacked actually win?"*

### Score-bucket win rate (608 graded)

| Score | N | W | L | WR |
|---|---|---|---|---|
| **5★ ELITE** | 101 | 57 | 44 | **56.4%** |
| **4★ STRONG** | 29 | 21 | 8 | **72.4%** |
| 3.5★ SOLID+ | 76 | 34 | 42 | 44.7% |
| 3★ SOLID | 68 | 48 | 20 | 70.6% |
| 2.5★ DEV+ | 112 | 53 | 59 | 47.3% |
| 2★ DEV | 64 | 29 | 35 | 45.3% |
| 1.5★ MUTED+ | 72 | 36 | 36 | 50.0% |
| **1★ MUTED** | 86 | 30 | 56 | **34.9%** |

### Tiered bucket (the actionable signal)

| Tier | N | W | L | WR | vs. −110 ROI |
|---|---|---|---|---|---|
| **ELITE + STRONG (4-5★)** | 130 | 78 | 52 | **60.0%** | **+14.5%** |
| SOLID + DEVELOPING (2-3.5★) | 320 | 164 | 156 | 51.2% | −2.2% |
| **MUTED (1-1.5★)** | 158 | 66 | 92 | **41.8%** | **−20.1%** |

**18.2pt WR spread between top and bottom tiers** on 608 picks. The middle
buckets are intentionally noisier (two-axis interaction) — the money is in
the tails and the tails are clean.

### Distribution of current & historical positions

| Label | N | % |
|---|---|---|
| ELITE | 117 | 17.2% |
| STRONG | 35 | 5.2% |
| SOLID | 156 | 23.0% |
| DEVELOPING | 192 | 28.3% |
| MUTED | 179 | 26.4% |

Inputs look healthy — not top-heavy, not concentrated in any single bucket.

---

## Firebase schema (fields written)

```
vault_quantScore        number   1.0 | 1.5 | ... | 5.0
vault_quantLabel        string   ELITE | STRONG | SOLID | DEVELOPING | MUTED
vault_quantVersion      number   1

vault_winnerForW        number   CONFIRMED/FLAT wallets on my side
vault_winnerAgW         number   CONFIRMED/FLAT wallets on opp side
vault_winnerMargin      number   forW − agW

vault_qualityForT30     number   wallets w/ contribution ≥ 30 on my side
vault_qualityAgT30      number   same on opp side
vault_qualityMargin     number   forT30 − agT30

vault_quantScoredAt     timestamp (backfill only)
```

## Jobs

| When | What | Script |
|---|---|---|
| Every 2h (`30 */2 * * *`) | Fresh `vault_*` on live Vault/Shadow positions | `writeSharpActions.js` |
| Daily (`15 12 * * *` UTC) | Re-score every position (pending + graded) with latest whitelist | `backfillVaultQuant.js --write` |

## Rollout plan

1. **Days 1–3 (shadow):** collect `vault_*` on all new positions, monitor
   distribution via the daily backfill retro-validation block in its logs.
2. **Day 3+ review:** confirm ELITE/STRONG WR holds above 55% and MUTED
   stays below 45% on a rolling 72h window.
3. **Ship to card:** only after the rolling window matches or beats this
   initial backtest. Design is intentionally conservative — tweaks to the
   formula bump `VAULT_QUANT_VERSION` so we can separate v1 vs v2 samples in
   analysis.

## Tuning knobs (do NOT touch until review is in)

All thresholds live in both `writeSharpActions.js` and
`backfillVaultQuant.js` — keep them in sync.

- Quality threshold: **T = 30** (swap to T=50 by replacing `>= 30` in
  `computeVaultQuantSignals` if the T=30 bucket becomes noisy).
- Base-score ladder step: currently 1.0 per integer Δ_winner. Widening to 1.5
  would sharpen separation if the current 2.5 DEVELOPING bucket is too fat.
- Hard rules: the only places we short-circuit. Both are validated edges
  (Δ≤−2 was 0/5; Δ≥+2 paired with quality was 75%+).
