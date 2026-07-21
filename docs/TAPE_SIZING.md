# Tape sizing (shipped 2026-07-15)

_Status: **LIVE** from `TAPE_SIZING_LIVE_FROM = 2026-07-15` · **RANK mute-exempt** from **2026-07-19**_  
_Full stack: [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md) · metrics: [`SKILL_FEATURES.md`](./SKILL_FEATURES.md)_

## Rule

```
tape = 2 · (EDGE / 10) + 1.5 · (netCLV / 10)
EDGE  = mean(FOR sport WR) − (mean(AG sport WR) ?? 50)
netCLV = mean(FOR causal %+CLV) − (mean(AG %+CLV) ?? 62)
```

Weights flipped **2026-07-21** to EDGE-heavy (~57% / 43%; was 1.5/2 Net-heavy). Mute/boost cutpoints unchanged (`0` / `2.89`); total coefficient sum still 3.5.
FOR-side components always stamp when FOR skill exists (including unopposed). EDGE uses AG prior **50** when nobody is against; netCLV uses AG prior **62**.

| Tape | Action |
|------|--------|
| missing | **fail-open** — keep units entering tape |
| `< 0` | **mute** → 0u (`mutedBy = tape-weak`) · **except RANK → HOLD** |
| mid | **hold** |
| `≥ 2.89` | **boost** × 1.35 (oddsCap, 6u max) — all tiers including RANK |

Thresholds ≈ June 15+ path-stamped p40 / p80.

## Pipeline order (pre-T-15)

1. Paths A → B → C → D (base units + tier)  
2. TOP/TOP+ NEITHER hard mute  
3. Winner-align **fadeTop≥60 mute only**  
4. **EDGE band size on A/C** (mute E&lt;5 · half 5–10 · boost ≥10) · else EDGE/net soft size  
5. **Tape** mute / hold / boost (RANK mute-exempt)  
6. Odds cap + global 6u inside tape boost  

`v8_unitsPreTape` = units **after** EDGE band / soft size, **before** tape.

## RANK mute exempt (2026-07-19+)

Jun1+ CF: RANK tickets with weak tape / NEITHER still printed ~**+11% ROI**. Tape still **boosts** strong RANK; it no longer zeros weak RANK.

Stamp: `v8_tapeAction = HOLD` with reconcile reason `rank_tape_mute_exempt`.

## What was frozen (2026-07-15)

EDGE-driven stake overrides from winner-align (2026-07-12 … 2026-07-14):

- EDGE size ladders · WINNER rescue · Policy E · EDGE≤−5 mute  

fadeTop60 mute **kept**. EDGE still computed — feeds tape + EDGE band / edge-net size.

## Stamps

| Field | Meaning |
|-------|---------|
| `v8_tapeScore` | composite tape |
| `v8_tapeEdgeTerm` / `v8_tapeNetTerm` | addends |
| `v8_tapeAction` | `MUTE` \| `HOLD` \| `BOOST` \| `FAIL_OPEN` \| `PASS` |
| `v8_unitsPreTape` | units entering tape |
| `v8_edgeNetBucket` | BOTH / ONE / NEITHER |
| `v8_edgeBandAction` / `v8_edgeBand` | A/C EDGE ladder before tape |
| `v8_edgeNetSizeAction` | soft size action before tape (non–A/C) |

## Code

- `src/lib/walletClvSkill.js` — `computeTapeScore`, `applyTapeUnitPolicy`
- `scripts/syncPickStateAuthoritative.js` — create + reconcile (RANK exempt at call site)
- `scripts/dailyAgsUReport.js` — § 5e TAPE impact

## Evidence

Path-stamped CF: mute weak + boost strong ≈ **+60u** vs path-only on Jun1+ actuals (most of the skill-sizing lift). Soft edge-net on top adds ~**+11u** with flat ticket volume.
