# Skill features — EDGE · netCLV · Tape (analysis stamps)

_Status: **LIVE** · schema `v8_skillFeatureVersion = 2` from **2026-07-19**_  
_Code: `scripts/syncPickStateAuthoritative.js` (`buildSkillFeatureBundle` / `applySkillFeatureStamps`) · formulas: `src/lib/walletClvSkill.js`_

These metrics are product core — not just Path C sizing inputs. Every pre–T-15 sync stamps them so you can measure prediction / PnL **without rebuilding** from positions.

---

## Definitions (point-in-time, causal)

```
EDGE   = mean(FOR sport featured WR) − (mean(AG) ?? 50)
netCLV = mean(FOR causal %+CLV)     − (mean(AG) ?? 62)
Tape   = 1.5·(EDGE/10) + 2·(netCLV/10)
```

- Featured WR: `sharpWalletProfiles` sport `picks.wr` with n≥8  
- %+CLV: graded positions with date **&lt; pick date** (no lookahead)  
- Unopposed FOR still gets EDGE vs prior 50 and net vs prior 62  

**Gate (Path C / TOP overlay):** EDGE ≥ 5 · netCLV ≥ 5 → BOTH / ONE / NEITHER

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
| `v8_tapeEdgeTerm` / `v8_tapeNetTerm` | Tape addends (1.5·E/10, 2·N/10) |
| `v8_tapeAction` | `MUTE` \| `HOLD` \| `BOOST` \| `FAIL_OPEN` \| … |
| `v8_unitsPreTape` | path units before tape (CF) |
| `v8_edgeGateOk` | EDGE ≥ 5 |
| `v8_netGateOk` | netCLV ≥ 5 |
| `v8_edgeNetBucket` | `BOTH` \| `ONE` \| `NEITHER` |
| `v8_edgeGateThr` / `v8_netGateThr` | thresholds used (5 / 5) |
| `v8_skillAgsV12` | AGS v12 score for this side at stamp time |
| `v8_skillFeatureVersion` | schema version (2) |
| `v8_skillEvaluatedAt` | ms timestamp of stamp |

Frozen at **T-15** (last write sticks). **COMPLETED** docs never rewritten.

### 2) Both-sides sidecar (`agsBothSides`)

Doc-level, **both poles every cycle** (including the side we didn’t stake):

```
agsBothSides.home.edge / .netMeanPrior / .tape / .edgeNetBucket / …
agsBothSides.away.…
agsBothSides.updatedAt
```

Same skill fields as above (unprefixed: `edge`, `netMeanPrior`, `tape`, `edgeGateOk`, …) plus existing AGS/HC (`agsV12`, `hcMargin`, …).

**Use this for “what did the other side look like?”** without needing a `sides.away` stake entry.

---

## Analysis recipes (no rebuild)

**All staked tickets**

```
filter finalUnits > 0
group by v8_edgeNetBucket or quintile(v8_tapeScore / v8_netMeanPrior / v8_winnerAlignEdge)
→ W/L, ROI, PnL
```

**Directionality on full book**

```
WIN mean(v8_*) − LOSS mean(v8_*)
Q5 vs Q1 ROI by metric
```

**Counterfactual Path C / TOP**

```
v8_edgeNetBucket == BOTH → 3u
ONE → 1.5u
NEITHER → 0u
(use v8_skillAgsV12 > 0 + path for door)
```

**Opposite-side skill**

```
agsBothSides[otherPole].edge / .netMeanPrior / .tape
vs graded outcome on the staked pole
```

---

## Pipeline (when written)

1. Create pick → full skill bundle on that side  
2. Reconcile LOCKED/LEAN → restamp skill + sizing every cycle  
3. Reconcile other existing sides → skill-only restamp  
4. `agsBothSides` refresh → both poles skill + AGS/HC  
5. T-15 → freeze all of the above  

---

## Related

- [`STAKE_PATHS_AND_SIZING.md`](./STAKE_PATHS_AND_SIZING.md) — Path C uses BOTH/ONE/NEITHER  
- [`TAPE_SIZING.md`](./TAPE_SIZING.md) — tape mute/boost on path units  
- `scripts/dailyAgsUReport.js` — § 5e / § 5f skill impact  
