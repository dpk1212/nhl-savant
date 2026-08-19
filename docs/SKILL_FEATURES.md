# Skill features — EDGE · netCLV · Tape (analysis + sizing stamps)

_Status: **LIVE** · schema `v8_skillFeatureVersion = 13` from **2026-08-19**_  
_Code: `scripts/syncPickStateAuthoritative.js` (`buildSkillFeatureBundle` / `applySkillFeatureStamps` / EDGE abs / qConv mute / FOOLS-gold mute / flinch leftover mute / path×EDGE blend) · formulas: `src/lib/walletClvSkill.js`_  
_Sizing stack: [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md)_

These metrics are product core — Path C door, TOP mute, EDGE band size on A/C, tape, **qConv Q1 mute**, and **FOOLS-gold mute** all consume them. Every pre–T-15 sync stamps them so you can measure prediction / PnL **without rebuilding** from positions.

**Path × EDGE blend WR** (`v8_blendWr`) is **tracking / calibration only** — it does **not** size units.

---

## Definitions (point-in-time, causal)

```
EDGE   = mean(FOR sport featured WR) − (mean(AG) ?? 50)
netCLV = mean(FOR causal %+CLV)     − (mean(AG) ?? 62)
Tape   = 2·(EDGE/10) + 1.5·(netCLV/10)
qConv  = Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG
```

- Featured WR: `sharpWalletProfiles` sport `picks.wr` with n≥8  
- %+CLV: graded positions with date **&lt; pick date** (no lookahead)  
- Unopposed FOR still gets EDGE vs prior 50 and net vs prior 62  
- qConv: same WR source as EDGE; sizeRatio from walletDetails; fail-open if unscored  

**Gate bucket:** EDGE ≥ 5 · netCLV ≥ 5 → `BOTH` / `ONE` / `NEITHER`

---

## How sizing uses these metrics (2026-07-20+)

| Consumer | Rule |
|----------|------|
| Path C door | BOTH → SHARP 3u · ONE → SHARP-LEAN 1.5u · NEITHER → no rescue |
| TOP hard mute | TOP/TOP+ + NEITHER → 0u |
| **EDGE band (A/C)** | 2026-08-03+: E&lt;7 → **≤1u** · 7–11 → **[2,3]u** · ≥11 → **[4,6]u** (abs clamp; re-applied after tape). Prior: 07-22 mute&lt;7 · ×0.75 on 7–10 · ×1.25 ≥10. RANK/DISSENT exempt |
| Soft size overlay | ONLY when EDGE band did not apply (non–A/C) · BOTH ×1.25 · NEITHER ×0.5 · RANK exempt |
| Tape | `&lt;0` mute (RANK exempt) · `≥2.89` ×1.35 · else hold |
| **qConv Q1 mute** | 2026-08-03+: after tape · Path C SHARP* · `qConv < expanding Q1 thr` → **0u** · Path A + RANK + UNOPP/Q1 exempt · fail-open if missing · DISSENT/manual exempt |
| **CONFIRMED-Q1 promote** | 2026-08-08+: ≥1 FOR CONFIRMED × flatDollar Q1 × **sport-local** size≥0.5× → **2u** (3u if size≥1×) · opposed OK · hard floor after mutes · stamp `v8_confirmedQ1Promote` |
| **CONFIRMED-UNOPP promote** | 2026-08-08+: after SHARP/Q1 · still 0u · ≥1 CONFIRMED FOR **sport-local** size≥0.5× · zero CONFIRMED AG → **1u** · hard floor after mutes (2026-08-16) · stamp `v8_confirmedUnoppPromote` |
| **FOOLS-gold mute** | 2026-08-05+: after qConv · Path A/B/C + CONFIRMED-UNOPP · best proven FOR = **FLAT** → **0u MUTED** · fail-open if bestFOR missing · DISSENT/manual exempt |
| **Flinch / fail-open leftover mute** | 2026-08-19+: after Q1/UNOPP restore · still &lt;4u AND (odds-capped native-4u **or** tape BOOST **or** E≥10 **or** FAIL_OPEN) → **0u** · 4u+ never touched · `mutedBy=believed-cut` \| `fail-open-sub4` |

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
| `v8_edgeBandAction` | `MUTE` \| `SOFT` \| `HALF` \| `BOOST` \| `CAP` \| `CLAMP` \| `HOLD` \| `EXEMPT` \| `PASS` |
| `v8_edgeBand` | `LT7` \| `LT5` \| `MID` \| `MID7_11` \| `GE10` \| `GE11` \| `MISSING` |
| `v8_unitsPreEdgeBand` | units before EDGE band overlay |
| `v8_bothE10TapeAction` | `FLOOR` \| `HOLD` \| `PASS` — skill top size floor |
| `v8_bothE10TapeMode` | `BOTH` (→5u) \| `ONE` (→4u) |
| `v8_unitsPreBothE10` | units before skill top floor |
| `v8_qConv` | quality×size conviction (FOR−AG) |
| `v8_qConvThr` | expanding Q1 mute threshold used this cycle |
| `v8_qConvAction` | `MUTE` \| `HOLD` \| `FAIL_OPEN` \| `EXEMPT` \| `PASS` |
| `v8_unitsPreQConv` | units entering qConv mute |
| `v8_bestForTier` | best proven FOR whitelistTier (`CONFIRMED` \| `FLAT`) |
| `v8_nForProven` | count of proven (CONFIRMED/FLAT) FOR wallets |
| `v8_foolsGoldAction` | `MUTE` \| `HOLD` \| `FAIL_OPEN` \| `EXEMPT` \| `PASS` |
| `v8_unitsPreFoolsGold` | units entering FOOLS-gold mute |
| `v8_flinchFailOpenAction` | `MUTE` \| `HOLD` \| `EXEMPT` \| `PASS` |
| `v8_unitsPreFlinchFailOpen` | units entering flinch / fail-open leftover mute |
| `v8_confirmedQ1Promote` | `true` when CONFIRMED-Q1 floor/promote filled this side @ 2–3u |
| `v8_confirmedUnoppPromote` | `true` when CONFIRMED-UNOPP rescue filled this side @ 1u |
| `v8_blendWr` | path×EDGE expected WR % (logit 0.35/0.65) — tracking only |
| `v8_blendPathWr` / `v8_blendEdgeWr` | components (path prior WR % / meanFor %) |
| `v8_blendWp` / `v8_blendWe` | weights used |
| `v8_blendPathN` / `v8_blendPathSource` | prior n · `tier` \| `all_staked` \| `base` |
| `v8_mktImpliedWr` | vig-in implied WR % from side odds |
| `v8_skillAgsV12` | AGS v12 score at stamp time |
| `v8_skillFeatureVersion` | schema version (**13**) |
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
