# Winner-Align Implementation

_Status: **EDGE stamps LIVE** · **EDGE stake overrides FROZEN** from **2026-07-15** (tape sizing owns mute/boost). FadeTop≥60 mute still active._

Site thesis: **follow the real winners.**

Code: `scripts/syncPickStateAuthoritative.js` (WINNER-ALIGN block after Path D).  
Sizing owner from 2026-07-15: [`TAPE_SIZING.md`](./TAPE_SIZING.md).

---

## Live rules

### From 2026-07-15 (tape era)

| Step | Active? |
|------|---------|
| Stamp EDGE + top-winner diagnostics | **yes** |
| Mute fadeTop≥60 on A/B/C | **yes** |
| Mute EDGE≤−5 | **no** (tape covers weak composite) |
| SIZE by EDGE / WINNER rescue / Policy E units | **no** (frozen) |

### 2026-07-12 … 2026-07-14 (EDGE stake era — historical)

1. **MUTE** — fadeTop≥60 **or** EDGE≤−5 → 0u  
2. **SIZE** — path × EDGE (E10→6u, EDGE&lt;0→≤1u, …)  
3. **RESCUE** — WINNER @ 6/4/3 by EDGE band  
4. **TOP-WINNER E** — `top_cap` / `top_floor` / `top_junk`

---

## Stamps (unchanged)

`v8_winnerAlignEdge`, `MeanFor/Ag`, `TopFor/Ag`, `FadeTop60`, `MeanBehind5`, `HasTop5For/Ag`, `TopUnopp`, `EliteUnopp`, `TopVsTop`, `Action`, `EvaluatedAt`.

In tape era, `Action` is typically `mute` (fadeTop) or `null` — no `size`/`rescue`/`top_*` unit actions.

---

## Caveats

1. EDGE remains a **tape input**, not a stake authority.
2. Causal EDGE ≠ leaky profile replay — do not revive EDGE-only size tables from old CFs.
3. Pre-tape WINNER / Policy E tickets already frozen at T-15 keep historical units.
4. Monitor tape mute/boost rates in cron logs (`TAPE MUTE` / `TAPE BOOST`).
