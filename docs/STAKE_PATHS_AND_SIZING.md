# Stake paths & unit sizing (production)

_Status: **LIVE** · stack `v12abcde` + **tape sizing** from **2026-07-15**_  
_Code: `scripts/syncPickStateAuthoritative.js` · HC ladder: `src/lib/ags.js` (`agsV12HcStake`) · tape: `src/lib/walletClvSkill.js`_  
_Related: [`TAPE_SIZING.md`](./TAPE_SIZING.md) · [`WINNER_ALIGN_IMPLEMENTATION.md`](./WINNER_ALIGN_IMPLEMENTATION.md) · [`DATA_ASSET_MAP.md`](./DATA_ASSET_MAP.md)_

---

## Mental model

| Layer | Job |
|-------|-----|
| **AGS v12 score** | Select the side (`score > 0` required to stake) |
| **Paths A–D** | Decide *who* gets a ticket and the **base unit size** |
| **FadeTop mute** | Kill toxic “best wallet is against us” tickets |
| **Tape** | Final size: mute weak / keep mid / boost strong |
| **T-15 freeze** | Lock units; no further rewrite |

**Paths are routers. Tape is the size dial.** EDGE is stamped and fed into tape; it is **not** an independent stake table from 2026-07-15 onward.

---

## End-to-end pipeline (every pre–T-15 sync)

```
1. AGS v12 score
   └─ score ≤ 0 → FADE / muted → 0u  (stop)

2. Path A — HC margin ladder          → SUPER/TOP/MINI/CONFIRMED/MONITORING
   └─ Path C overlays on A:           → TOP+ (legacy) or MINI- (no proven-$)

3. If still 0u → Path B RANK rescue   → RANK @ 4u
4. If still 0u → Path C SHARP rescue  → SHARP @ 3u / SHARP-PRIME @ 4u
5. If still 0u → Path D DISSENT       → DISSENT @ 1u  (MLB only)

6. Winner-align fadeTop≥60 mute       → 0u if toxic AG top WR
   └─ EDGE size / WINNER rescue / Policy E  → FROZEN (no unit effect)

7. Tape mute / hold / boost           → final units
8. Odds cap + global 6u cap
9. T-15 → freeze
```

Rescues **never up-size** an already-staked Path A ticket — they only fill `0u` holes.

---

## Cutover dates

| Date | What went live |
|------|----------------|
| **2026-06-15** | Path A HC stake tiers (`v12.1`) |
| **2026-06-26** | Path C SHARP rescue (+ MINI- cut; TOP+ boost on) |
| **2026-07-12** | Path C retune · Path D · Path E winner-align (EDGE stake era) |
| **2026-07-15** | **Tape sizing** · EDGE stake overrides **frozen** |

---

## Path A — HC model (primary book)

**What it is:** High-conviction wallet margin. Count CONFIRMED wallets that are *sized up* on our side vs against.

**Definitions**
- **Full HC wallet:** `whitelistTier = CONFIRMED` and `sizeRatio ≥ 1.5` (`HC_RATIO`)
- **Mini-HC wallet:** `CONFIRMED` and `1.0 ≤ sizeRatio < 1.5` (`HC_MINI_FLOOR`)
- **hcMargin** = (# full-HC FOR) − (# full-HC AG)
- **miniHcMargin** = same for mini-HC band
- Requires `agsV12 score > 0` and score tier **≠ WEAK** (WEAK → MONITORING 0u)

### Path A unit ladder (before overlays / tape)

| Condition | Tier | Base u | UI label |
|-----------|------|-------:|----------|
| hcMargin **== 2** | `SUPER` | **6** | MAX PLAY |
| hcMargin **== 1** | `TOP` | **4** | TOP PICK |
| hcMargin **≥ 3** | `CONFIRMED` | **1** | CONFIRMED (late pile-on → small) |
| hcMargin ≤ 0, miniHcMargin ≥ 1 | `MINI` | **3** | STRONG |
| else | `MONITORING` | **0** | watch only |
| score ≤ 0 | `FADE` | **0** | muted |

Then **oddsCap** (see below).

### Path A overlays (Path C quality gate, still on the HC ticket)

Computed when Path C is live (`≥ 2026-06-26`), using proven-$ + featured WR:

| Starting tier | Gate | Result tier | Units |
|---------------|------|-------------|------:|
| `TOP` | proven-$ backer + mean FOR `picks.wr ≥ 50` | `TOP+` @ **5u** | **OFF from 2026-07-12** (retune) |
| `MINI` | **no** proven-$ backer | `MINI-` | **1u** (kept) |
| `SUPER` / gate-pass `MINI` / plain `TOP` / `CONFIRMED` | — | unchanged | — |

**Proven-$ backer:** ≥1 FOR wallet with `positions.dollarRoi ≥ 10%` on ≥8 settled positions.

---

## Path B — RANK (2-for-0 whitelist rescue)

**What it is:** When HC leaves the pick at **0u**, rescue if the whitelist stack is one-sided.

**Qualifies when**
- `score > 0`, still `0u` after Path A (+ overlays)
- ≥ **2** eligible wallets FOR, **0** AGAINST
- Eligible wallet: `whitelistTier ∈ {CONFIRMED, FLAT, WR50}` and sport featured `picks.n ≥ 8`

| Tier | Units |
|------|------:|
| `RANK` | **4u** → oddsCap |

Does **not** up-size SUPER/TOP/MINI already staked.

---

## Path C — SHARP (proven-$ mute rescue)

**What it is:** When A and B leave **0u**, rescue if FOR-side *money quality* clears the gate.

**Qualifies when** (all of)
1. `score > 0`, still `0u`, not RANK-rescued  
2. ≥1 FOR backer with `positions.dollarRoi ≥ 10%` (n≥8 positions)  
3. Mean FOR `picks.wr` (each n≥5 picks) ≥ **50** (SHARP) or ≥ **55** (PRIME)  
4. Distinct FOR sharps counted ≥ floor: **3** from 2026-07-12+ (was 2 before)  
5. From 2026-07-12+: skip if american odds **≤ −150** (no heavy chalk rescue)

| Tier | Units |
|------|------:|
| `SHARP` | **3u** |
| `SHARP-PRIME` | **4u** |

Then oddsCap. Never up-sizes A/B.

---

## Path D — DISSENT (contrib-margin rescue)

**What it is:** Thin “book is contested / against-weighted” poke when A/B/C all miss.

**Qualifies when**
- `score > 0`, still `0u` after A/B/C  
- **MLB only**  
- Odds ≤ **+200**  
- `contribMargin = Σ FOR contribution − Σ AG contribution ≤ 0`  
- Max single FOR wallet share of total contribution **&lt; 0.35** (dispersed)

| Tier | Units |
|------|------:|
| `DISSENT` | **1u** → oddsCap |

Live from **2026-07-12**.

---

## Path E — WINNER / winner-align (historical stake era)

**What it was (2026-07-12 … 2026-07-14):** EDGE mute/size/rescue + Top-Winner Policy E could set or change units (including `WINNER` @ 6/4/3).

**What it is now (2026-07-15+):**
- EDGE **still computed & stamped** (feeds tape)
- **fadeTop≥60 mute only** (top AG sport WR ≥ 60 and beats top FOR)
- EDGE size ladders, WINNER rescue, `top_cap` / `top_floor` / `top_junk` → **no unit effect**

Existing T-15-frozen WINNER tickets keep historical size; new cycles do not mint new EDGE rescues.

---

## Tape — final size modifier (2026-07-15+)

```
EDGE   = mean(FOR sport WR) − mean(AG sport WR)     // n≥8 featured WR each
netCLV = mean(FOR causal %+CLV) − (mean(AG) ?? 62)
tape   = 1.5·(EDGE/10) + 2·(netCLV/10)
```

| Tape | Action | Units |
|------|--------|-------|
| missing | **FAIL_OPEN** | keep path units |
| **&lt; 0** | **MUTE** | **0u** (`mutedBy = tape-weak`) |
| mid | **HOLD** | path units unchanged |
| **≥ 2.89** | **BOOST** | path × **1.35**, then oddsCap, then **≤ 6u** |

Thresholds ≈ June 15+ path-stamped book p40 / p80. Refresh if distribution drifts.

**Replaces** the old CLV-top2 cancel/boost unit gate (top2 still stamped for audit only).

---

## How every final unit size is reached

Worked examples (illustrative; oddsCap may shrink plus-money):

| Situation | Path base | After mute/tape | Final |
|-----------|-----------|-----------------|------:|
| HC margin 2, tape mid | SUPER 6u | hold | **6u** |
| HC margin 1, tape ≥ 2.89 | TOP 4u | ×1.35 | **5.4u** |
| HC margin 1, tape &lt; 0 | TOP 4u | mute | **0u** |
| Mini-HC, no proven-$ | MINI → MINI- 1u | hold | **1u** |
| HC 0u, 2-for-0 whitelist | RANK 4u | hold | **4u** |
| HC+RANK 0u, proven-$ prime, tape strong | SHARP-PRIME 4u | ×1.35 | **5.4u** |
| A/B/C 0u, MLB dissent qualifies | DISSENT 1u | hold | **1u** |
| Any path, fadeTop≥60 | (was Nu) | fade mute | **0u** |
| Any path, no tape score | Nu | fail-open | **Nu** |
| SUPER 6u already at cap, tape boost | 6u | ×1.35 → cap | **6u** |

### Odds caps (applied on path sizes and again on tape boost)

| American odds | Max units |
|---------------|----------:|
| ≥ +200 | 1.0 |
| ≥ +151 | 1.5 |
| ≥ +100 | 2.5 |
| else | uncapped by odds (still ≤ **6u** global) |

---

## Unit cheat sheet (base → possible finals)

| Tier | Base u | Common finals after tape |
|------|-------:|--------------------------|
| SUPER | 6 | 0 (mute) · 6 (hold/boost-capped) |
| TOP | 4 | 0 · 4 · **5.4** (boost) |
| TOP+ | 5 | legacy only (pre-2026-07-12) |
| MINI | 3 | 0 · 3 · **4.05** (boost) |
| MINI- | 1 | 0 · 1 · **1.35** (boost) |
| CONFIRMED | 1 | 0 · 1 · **1.35** |
| RANK | 4 | 0 · 4 · **5.4** |
| SHARP | 3 | 0 · 3 · **4.05** |
| SHARP-PRIME | 4 | 0 · 4 · **5.4** |
| DISSENT | 1 | 0 · 1 · **1.35** |
| WINNER | 3–6 | historical; not newly sized by EDGE |
| MONITORING / FADE | 0 | 0 |

---

## Key stamps (Firestore)

| Field | Meaning |
|-------|---------|
| `v8_hcStakeTier` | Path product tier (`SUPER`, `RANK`, `SHARP`, …) |
| `finalUnits` | Canonical stake size |
| `v8_winnerAlignEdge` | EDGE (tape input) |
| `v8_tapeScore` / `v8_tapeAction` | Tape composite + `MUTE\|HOLD\|BOOST\|FAIL_OPEN` |
| `v8_netMeanPrior` | netCLV |
| `v8_forTop2PctPos` | Legacy top2 (diagnostic only post-2026-07-15) |
| `mutedBy` | `winner_align_fade` · `tape-weak` · … |

---

## Display grouping (UI / report)

Internal paths roll up to five user-facing bands (`AGS_V12_DISPLAY_TIERS`):

| Display | Paths | Typical u |
|---------|-------|-----------|
| MAX PLAY | SUPER | 6 |
| TOP PICK | TOP, TOP+ | 4–5 |
| SHARP PLAY | RANK, SHARP, SHARP-PRIME, WINNER | 3–6 |
| STRONG | MINI | 3 |
| LEAN | CONFIRMED, MINI-, DISSENT | 1 |

---

## Operator checklist

1. Score must be **> 0** or nothing stakes.  
2. Prefer reading **`v8_hcStakeTier` + `finalUnits` + `v8_tapeAction`**.  
3. `0u` with `tape-weak` = intentional skip, not a sync bug.  
4. `0u` with `winner_align_fade` = fadeTop mute.  
5. Missing tape → fail-open path size (by design).  
6. Push `main` so cron runs this stack; T-15 already-frozen tickets keep old units.
