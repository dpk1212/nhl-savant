# Tape sizing (shipped 2026-07-15)

_Status: **LIVE** from `TAPE_SIZING_LIVE_FROM = 2026-07-15` · paths keep base units · tape mutes/boosts._  
_Full path + unit walkthrough: [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md)._

## Rule

```
tape = 1.5 · (EDGE / 10) + 2 · (netCLV / 10)
netCLV = mean(FOR causal %+CLV) − (mean(AG %+CLV) ?? 62)
```

| Tape | Action |
|------|--------|
| missing | **fail-open** — keep path units |
| `< 0` | **mute** → 0u (`mutedBy = tape-weak`) |
| mid | **hold** path units |
| `≥ 2.89` | **boost** path × 1.35 (oddsCap, 6u max) |

Thresholds ≈ June 15+ path-stamped p40 / p80. Refresh later if distribution drifts.

## Pipeline order (pre-T-15)

1. Paths A HC → B RANK → C SHARP → D DISSENT (base units + tier)
2. Winner-align **fadeTop≥60 mute only** (EDGE size / rescue / Policy E **frozen**)
3. **Tape** mute / hold / boost
4. Odds cap + global 6u already inside tape boost

## What was frozen

EDGE-driven stake overrides from winner-align (live 2026-07-12 … 2026-07-14 only):

- EDGE size ladders on A/B/C/D/WINNER
- WINNER rescue @ 6/4/3 by EDGE band
- Top-Winner Policy E (`top_cap` / `top_floor` / `top_junk`)
- EDGE≤−5 mute (fadeTop60 mute **kept**)

EDGE is still **computed and stamped** — it feeds tape.

## Stamps

| Field | Meaning |
|-------|---------|
| `v8_tapeScore` | composite tape |
| `v8_tapeAction` | `MUTE` \| `HOLD` \| `BOOST` \| `FAIL_OPEN` \| `PASS` |
| `v8_netMeanPrior` | netCLV |
| `v8_netClvMeanFor` / `MeanAg` / `NFor` / `NAg` | components |
| `v8_winnerAlignEdge` | EDGE (input) |
| `v8_forTop2PctPos` | legacy top2 (diagnostic only; no unit effect post-cutover) |

## Code

- `src/lib/walletClvSkill.js` — `computeNetMeanPrior`, `computeTapeScore`, `applyTapeUnitPolicy`, `causalPctPos`
- `scripts/syncPickStateAuthoritative.js` — create + reconcile (stamps netCLV / tape from live ledger)
- `scripts/exportWalletProfiles.js` — persists per-wallet `clvSkill.pctPos` to `sharpWalletProfiles` every 2h (`grade-sharp-actions`) so UI + tape share one standing skill score

## Evidence (June 15+ path-stamped CF)

Mute weak + boost strong on path units: **+20u → +61u** (+41u), mostly from zeroing weak-tape losses.
