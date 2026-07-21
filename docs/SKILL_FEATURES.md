# Skill features — EDGE · netCLV · Tape (analysis + sizing stamps)

_Status: **LIVE** · schema `v8_skillFeatureVersion = 4` from **2026-07-20**_  
_Code: `scripts/syncPickStateAuthoritative.js` (`buildSkillFeatureBundle` / `applySkillFeatureStamps` / `applyEdgeBandSizeOverlay`) · formulas: `src/lib/walletClvSkill.js`_  
_Sizing stack: [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md)_

These metrics are product core — Path C door, TOP mute, EDGE band size on A/C, and tape all consume them. Every pre–T-15 sync stamps them so you can measure prediction / PnL **without rebuilding** from positions.

---

## Definitions (point-in-time, causal)

```
EDGE   = mean(FOR sport featured WR) − (mean(AG) ?? 50)
netCLV = mean(FOR causal %+CLV)     − (mean(AG) ?? 62)
Tape   = 2·(EDGE/10) + 1.5·(netCLV/10)
```

- Featured WR: `sharpWalletProfiles` sport `picks.wr` with n≥8  
- %+CLV: graded positions with date **&lt; pick date** (no lookahead)  
- Unopposed FOR still gets EDGE vs prior 50 and net vs prior 62  

**Gate bucket:** EDGE ≥ 5 · netCLV ≥ 5 → `BOTH` / `ONE` / `NEITHER`

---

## How sizing uses these metrics (2026-07-20+)

| Consumer | Rule |
|----------|------|
| Path C door | BOTH → SHARP 3u · ONE → SHARP-LEAN 1.5u · NEITHER → no rescue |
| TOP hard mute | TOP/TOP+ + NEITHER → 0u |
| **EDGE band (A/C)** | E&lt;5 → **0u** · 5–10 → ×**0.5** · ≥10 → ×**1.25** · RANK/DISSENT exempt |
| Soft size overlay | ONLY when EDGE band did not apply (non–A/C) · BOTH ×1.25 · NEITHER ×0.5 · RANK exempt |
| Tape | `&lt;0` mute (RANK exempt) · `≥2.89` ×1.35 · else hold |

---

## Where stamps live

### 1) Per-side fields (`sides.{home|away|…}.*`)

Written on every **LOCKED / LEAN** side each pre–T-15 cycle, and on any other side entry that already exists (metric-only pass — no unit changes).

| Field | Meaning |
|-------|---------|
| `v8_winnerAlignEdge` | EDGE |
| `v8_winnerAlignMeanFor` / `MeanAg` / `ForN` / `AgN` | EDGE components |
| `v8_winnerAlignHasBoth` | real AG side present |
| `v8_winnerAlignFadeTop60` | toxic AG top WR flag |
| `v8_netMeanPrior` | netCLV |
| `v8_netClvMeanFor` / `MeanAg` / `NFor` / `NAg` | netCLV components |
| `v8_tapeScore` | Tape |
| `v8_tapeEdgeTerm` / `v8_tapeNetTerm` | Tape addends |
| `v8_tapeAction` | `MUTE` \| `HOLD` \| `BOOST` \| `FAIL_OPEN` \| … |
| `v8_unitsPreTape` | units entering tape (after soft size) |
| `v8_edgeGateOk` | EDGE ≥ 5 |
| `v8_netGateOk` | netCLV ≥ 5 |
| `v8_edgeNetBucket` | `BOTH` \| `ONE` \| `NEITHER` |
| `v8_edgeGateThr` / `v8_netGateThr` | thresholds (5 / 5) |
| `v8_edgeNetSizeAction` | `BOOST` \| `HALF` \| `HOLD` \| `PASS` (soft size, non–A/C) |
| `v8_unitsPreEdgeNetSize` | units before soft size overlay |
| `v8_edgeBandAction` | `MUTE` \| `HALF` \| `BOOST` \| `HOLD` \| `EXEMPT` \| `PASS` |
| `v8_edgeBand` | `LT5` \| `MID` \| `GE10` \| `MISSING` |
| `v8_unitsPreEdgeBand` | units before EDGE band overlay |
| `v8_skillAgsV12` | AGS v12 score at stamp time |
| `v8_skillFeatureVersion` | schema version (**4**) |
| `v8_skillEvaluatedAt` | ms timestamp of stamp |

Frozen at **T-15** (last write sticks). **COMPLETED** docs never rewritten.

### 2) Both-sides sidecar (`agsBothSides`)

Doc-level, **both poles every cycle** (including the side we didn’t stake):

```
agsBothSides.home.edge / .netMeanPrior / .tape / .edgeNetBucket / …
agsBothSides.away.…
agsBothSides.updatedAt
```

**Use this for “what did the other side look like?”** without a `sides.away` stake entry.

---

## Analysis recipes (no rebuild)

**All staked tickets**

```
filter finalUnits > 0
group by v8_edgeNetBucket or quintile(v8_tapeScore / v8_netMeanPrior / v8_winnerAlignEdge)
→ W/L, ROI, PnL
```

**Soft-size impact**

```
v8_unitsPreEdgeNetSize → v8_edgeNetSizeAction → units entering tape (v8_unitsPreTape)
```

**Tape impact**

```
v8_unitsPreTape → v8_tapeAction → finalUnits
```

**Counterfactual Path C**

```
v8_edgeNetBucket == BOTH → 3u
ONE → 1.5u
NEITHER → 0u
(use v8_skillAgsV12 > 0 + path for door)
```

---

## Pipeline (when written)

1. Create pick → full skill bundle + soft size + tape on that side  
2. Reconcile LOCKED/LEAN → restamp skill + sizing every cycle  
3. Reconcile other existing sides → skill-only restamp  
4. `agsBothSides` refresh → both poles skill + AGS/HC  
5. T-15 → freeze all of the above  

---

## Schema history

| Version | From | Change |
|--------:|------|--------|
| 1 | early tape era | EDGE / net / tape stamps |
| 2 | 2026-07-19 | edgeNet gate flags + all-sides metric pass |
| **3** | **2026-07-19** | `v8_edgeNetSizeAction` / `v8_unitsPreEdgeNetSize` |

---

## Related

- [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md) — full grading/staking/sizing stack  
- [`TAPE_SIZING.md`](./TAPE_SIZING.md) — tape mute/boost + RANK exempt  
- `scripts/dailyAgsUReport.js` — § 5e / § 5f skill impact  
