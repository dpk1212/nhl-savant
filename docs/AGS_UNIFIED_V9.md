# AGS-Unified v9 — Current System Spec

> The single source of truth for lock / mute / sizing decisions.
> Replaces every v7.x and v8.x route, matrix, gate, and tier helper.
> Cutover: 2026-05-14. Sample at cutover: N=339 graded picks since
> the V6 cutover (2026-04-18).

## What it is

AGS-Unified v9 is a single composite z-score computed per side of every
sharp-flow pick. The score is a sum of five sign-validated, L1-pruned
features that quantify proven-wallet behavior on each side of a game.
One number drives every downstream decision:

| Decision           | Source                                              |
| ------------------ | --------------------------------------------------- |
| Lock / mute        | AGS-U value vs. calibration quintile thresholds     |
| Unit sizing        | 6-band sizing ladder keyed on the same quintiles    |
| Top-pick ribbon    | AGS-U tier (ELITE = SUPER, PREMIUM = TOP)           |
| Star badge         | `agsuStarsFromAgs` — direct quintile → star mapping |
| Card consensus     | `decideLockStage` reads AGS-U and nothing else      |

## The five features

Computed in `aggregateSideProven` from `peak.v8Scoring.walletDetails[]`:

| Feature           | Meaning                                                                                |
| ----------------- | -------------------------------------------------------------------------------------- |
| `dCount`          | Proven wallets backing the side − proven wallets on the other side                     |
| `dHcCount`        | High-conviction proven wallets backing − HC on the other side                          |
| `dConvictionAvg`  | Avg `convictionMult` of proven for-side wallets − same for opposing side               |
| `dHcSizeRatio`    | Sum of HC `sizeRatio` on the for side − sum on the opposing side                       |
| `forContribShare` | Share of total contribution (`walletBase × convictionMult`) on the for side            |

HC eligibility: `whitelistTier === 'CONFIRMED'` AND `sizeRatio ≥ 1.5×`.

All five features have a positive sign in the V6+ training sample. Signs
are re-validated daily in `scripts/computeAgsCalibration.js`.

## Tiers + sizing ladder

The AGS-U value lands in one of six tiers based on rolling quintile
boundaries (recomputed daily by `scripts/computeAgsCalibration.js` and
stored in `agsCalibration/current`):

| Tier      | Threshold | Sizing      | Star  | Card label    |
| --------- | --------- | ----------- | ----- | ------------- |
| `ELITE`   | ≥ q90     | 2.00× base  | 5.0   | ELITE PLAY    |
| `PREMIUM` | ≥ q80     | 1.50× base  | 4.5   | PREMIUM PLAY  |
| `LOCK`    | ≥ q60     | 1.10× base  | 4.0   | STRONG PLAY   |
| `LEAN`    | ≥ q40     | 0.50× base  | 3.0   | SOLID PLAY    |
| `WEAK`    | ≥ q20     | 0.20× base  | 2.5   | TRACKING      |
| `FADE`    | < q20     | 0.00× (mute)| 1.0   | HARD MUTE     |

Base size: 2.5u for ML, 1.5u for SPREAD/TOTAL. Odds caps preserve a
hard ceiling at long-shot prices.

## Ship floor

The lock-stage gate is the q20 (FADE) boundary. Picks above q20 with
≥ 2 proven wallets ship at their banded size; below q20 are SHADOW'd
and ungraded. This preserves 100% of the validated holdout volume
(N=67) while concentrating size on the highest AGS-U values.

Backtest (in-sample N=339; holdout N=67):

| Strategy                            | PnL    | ROI/unit |
| ----------------------------------- | ------ | -------- |
| Pre-v9 matrix all-shipped           | +5.93u | 8.9%     |
| AGS-U + 6-band aggressive sizing    | +18.77u | 24.0%   |

## Code surface

| File                                          | Role                                                   |
| --------------------------------------------- | ------------------------------------------------------ |
| `src/lib/ags.js`                              | Feature spec, calibration, scoring, tier/star helpers  |
| `scripts/computeAgsCalibration.js`            | Daily cron — refresh normalizers + quintile thresholds |
| `scripts/syncPickStateAuthoritative.js`       | Every-cycle promotion / demotion / sizing              |
| `src/pages/SharpFlow.jsx`                     | Card UI — consensus panel + star badge + ribbon        |
| `scripts/rankTopPicks.js`                     | Daily AGS-U-ranked top-picks export                    |

## Historical artifacts

Pre-v9 playbooks, implementation notes, and one-off analyses live in
`docs/historical/`. They are preserved for context but are not part of
the live decision path.
