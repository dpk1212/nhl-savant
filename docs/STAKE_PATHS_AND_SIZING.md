# Stake paths & unit sizing (production)

_Status: **LIVE** · stack `v12abcde` + **tape** (2026-07-15) + **EDGE/net Path C · TOP mute · board-wide soft size** (2026-07-19)_  
_Code: `scripts/syncPickStateAuthoritative.js` · HC ladder: `src/lib/ags.js` (`agsV12HcStake`) · tape: `src/lib/walletClvSkill.js`_  
_Related: [`TAPE_SIZING.md`](./TAPE_SIZING.md) · [`SKILL_FEATURES.md`](./SKILL_FEATURES.md) · [`WINNER_ALIGN_IMPLEMENTATION.md`](./WINNER_ALIGN_IMPLEMENTATION.md)_

---

## Where we are (2026-07-19)

| Layer | Role | Live rule |
|-------|------|-----------|
| **AGS v12** | Side select | `score > 0` or no stake |
| **Paths A–D** | Who + base u | HC → RANK → SHARP/LEAN → DISSENT |
| **TOP NEITHER mute** | Hard kill | TOP/TOP+ with E&lt;5 **and** net&lt;5 → **0u** |
| **FadeTop** | Toxic AG | top AG WR ≥ 60 beating FOR → **0u** |
| **EDGE/net size** | Soft dial | BOTH ×**1.25** · ONE hold · NEITHER ×**0.5** on MINI/SHARP/CONFIRMED · **RANK exempt** |
| **Tape** | Final dial | `&lt;0` mute (except **RANK**) · mid hold · `≥2.89` ×**1.35** · fail-open if missing |
| **T-15** | Freeze | No further rewrite |

**Paths pick who. EDGE/net scales size. Tape is the last dial.**

Skill metrics (EDGE / netCLV / Tape / bucket) stamp every pre–T-15 cycle — see [`SKILL_FEATURES.md`](./SKILL_FEATURES.md).

---

## End-to-end pipeline (every pre–T-15 sync)

```
1. AGS v12 score
   └─ score ≤ 0 → FADE / muted → 0u  (stop)

2. Path A — HC margin ladder          → SUPER/TOP/MINI/CONFIRMED/MONITORING
   └─ overlays: MINI- (no proven-$) · TOP+ (legacy pre-retune only)
   └─ TOP/TOP+ EDGE-net hard mute: NEITHER → 0u

3. If still 0u → Path B RANK rescue   → RANK @ 4u
4. If still 0u → Path C SHARP rescue  → SHARP @ 3u (BOTH) / SHARP-LEAN @ 1.5u (ONE)
5. If still 0u → Path D DISSENT       → DISSENT @ 1u  (MLB only)

6. Winner-align fadeTop≥60 mute       → 0u if toxic AG top WR
   └─ EDGE size / WINNER rescue / Policy E  → FROZEN (no unit effect)

7. EDGE/net size overlay (soft)
   └─ BOTH → path × 1.25 (≤6u)
   └─ ONE  → hold
   └─ NEITHER → ×0.5 on MINI / MINI- / SHARP* / CONFIRMED
   └─ RANK / SUPER / DISSENT / null → hold (RANK never shrunk here)
   └─ missing EDGE and net → fail-open (hold)

8. Tape mute / hold / boost           → final units
   └─ RANK exempt from tape mute only (still boosts)

9. Odds cap + global 6u cap
10. T-15 → freeze
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
| **2026-07-19** | **Path C = EDGE/net two-gate** · **TOP NEITHER hard mute** · **board-wide BOTH×1.25 / NEITHER×0.5** · **RANK tape-mute exempt** · proven-$ Path C retired |

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

### Path A overlays

| Starting tier | Gate | Result | Notes |
|---------------|------|--------|-------|
| `TOP` | proven-$ + mean FOR wr ≥ 50 | `TOP+` @ 5u | **OFF from 2026-07-12** |
| `MINI` | no proven-$ backer | `MINI-` @ **1u** | kept |
| `TOP` / `TOP+` | EDGE/net **NEITHER** | **0u** hard mute | from 2026-07-19 |

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

**Skill exemptions (2026-07-19+):** RANK is **not** shrunk by EDGE/net NEITHER soft size, and is **not** muted by tape `&lt; 0` (still eligible for tape boost). Jun1+ CF: RANK NEITHER stayed ~+11% ROI.

Does **not** up-size SUPER/TOP/MINI already staked.

---

## Path C — SHARP (EDGE / netCLV rescue door)

**What it is:** When A and B leave **0u**, rescue from wallet skill signals.

**Live from 2026-07-19** (replaces proven-$ / SHARP-PRIME Path C):

| Gate | Tier | Units |
|------|------|------:|
| EDGE ≥ 5 **and** netCLV ≥ 5 | `SHARP` | **3u** |
| Exactly one of those | `SHARP-LEAN` | **1.5u** |
| Neither | — | **0u** |

Requires `score > 0`, still `0u`, not RANK-rescued. Then oddsCap + soft size + tape. Never up-sizes A/B.

**Legacy** (2026-06-26 … 2026-07-18): proven-$ + mean `picks.wr` + forCount. Historical tickets keep those stamps.

---

## Path D — DISSENT (contrib-margin rescue)

**Qualifies when**
- `score > 0`, still `0u` after A/B/C  
- **MLB only** · odds ≤ **+200**  
- `contribMargin ≤ 0` · max FOR share **&lt; 0.35**

| Tier | Units |
|------|------:|
| `DISSENT` | **1u** → oddsCap |

Live from **2026-07-12**. Not in the soft-NEITHER shrink set (hold through edge-net size).

---

## Path E — WINNER / winner-align (historical stake era)

**2026-07-12 … 2026-07-14:** EDGE mute/size/rescue + Policy E could change units.  
**2026-07-15+:** EDGE still stamped; **fadeTop≥60 mute only**; EDGE size/rescue/Policy E **frozen**.

---

## EDGE/net size overlay (2026-07-19+)

Runs **after** paths + fadeTop, **before** tape. Does not change path tier — only units.

| Bucket | Action | Applies to |
|--------|--------|------------|
| **BOTH** (E≥5 & net≥5) | path × **1.25** (≤6u, oddsCap) | all staked tiers except already 0u |
| **ONE** | hold | all |
| **NEITHER** | path × **0.5** | `MINI`, `MINI-`, `SHARP`, `SHARP-PRIME`, `SHARP-LEAN`, `CONFIRMED` |
| **NEITHER** | hold | `RANK`, `SUPER`, `DISSENT`, untiered |
| no EDGE **and** no net | fail-open hold | all |

**TOP/TOP+ NEITHER** is already **0u** upstream (hard mute) — soft shrink never sees those tickets.

Stamps: `v8_edgeNetSizeAction` (`BOOST` \| `HALF` \| `HOLD` \| `PASS`) · `v8_unitsPreEdgeNetSize`

---

## Tape — final size modifier (2026-07-15+)

```
EDGE   = mean(FOR sport WR) − (mean(AG) ?? 50)
netCLV = mean(FOR causal %+CLV) − (mean(AG) ?? 62)
tape   = 1.5·(EDGE/10) + 2·(netCLV/10)
```

| Tape | Action | Units |
|------|--------|-------|
| missing | **FAIL_OPEN** | keep post–edge-net units |
| **&lt; 0** | **MUTE** → 0u | except **RANK** → HOLD |
| mid | **HOLD** | unchanged |
| **≥ 2.89** | **BOOST** | × **1.35**, oddsCap, ≤ **6u** |

Details: [`TAPE_SIZING.md`](./TAPE_SIZING.md).

---

## How every final unit size is reached

| Situation | Path | After edge-net | After tape | Final |
|-----------|------|----------------|------------|------:|
| TOP, BOTH, tape mid | 4u | ×1.25 → 5u | hold | **5u** |
| TOP, NEITHER | 4u | hard mute | — | **0u** |
| MINI, NEITHER, tape mid | 3u | ×0.5 → 1.5u | hold | **1.5u** |
| MINI, BOTH, tape ≥2.89 | 3u | ×1.25 → 3.75u | ×1.35 | **~5.1u** |
| RANK, tape &lt; 0 | 4u | hold | mute-exempt HOLD | **4u** |
| RANK, tape ≥2.89 | 4u | hold | ×1.35 | **5.4u** |
| SHARP BOTH (Path C) | 3u | ×1.25 → 3.75u | hold | **3.75u** |
| Any, fadeTop≥60 | Nu | — | — | **0u** |

### Odds caps

| American odds | Max units |
|---------------|----------:|
| ≥ +200 | 1.0 |
| ≥ +151 | 1.5 |
| ≥ +100 | 2.5 |
| else | uncapped by odds (still ≤ **6u** global) |

---

## Unit cheat sheet (base → possible finals)

| Tier | Base u | After soft size + tape (typical) |
|------|-------:|----------------------------------|
| SUPER | 6 | 0 (tape mute) · 6 (hold/boost-capped) |
| TOP | 4 | 0 (NEITHER or tape) · 4 · **5** (BOTH) · **5.4** (tape boost) |
| MINI | 3 | 0 · **1.5** (NEITHER half) · 3 · **~5** (BOTH+boost) |
| MINI- | 1 | 0 · **0.5** · 1 · **1.35** |
| CONFIRMED | 1 | 0 · **0.5** · 1 · **1.35** |
| RANK | 4 | 4 (tape-mute exempt) · **5.4** (boost) |
| SHARP | 3 | 0 · **1.5** · **3.75** · **~5** |
| SHARP-LEAN | 1.5 | 0 · **0.75** · **1.875** · **~2.5** |
| DISSENT | 1 | 0 · 1 · **1.35** |
| MONITORING / FADE | 0 | 0 |

---

## Key stamps (Firestore)

| Field | Meaning |
|-------|---------|
| `v8_hcStakeTier` | Path tier |
| `finalUnits` | Canonical stake |
| `v8_edgeNetBucket` | `BOTH` \| `ONE` \| `NEITHER` |
| `v8_edgeNetSizeAction` | `BOOST` \| `HALF` \| `HOLD` \| `PASS` |
| `v8_unitsPreEdgeNetSize` | Units before soft size |
| `v8_tapeScore` / `v8_tapeAction` | Tape + `MUTE\|HOLD\|BOOST\|FAIL_OPEN` |
| `v8_unitsPreTape` | Units entering tape (after soft size) |
| `v8_winnerAlignEdge` / `v8_netMeanPrior` | EDGE / netCLV |
| `mutedBy` | `winner_align_fade` · `tape-weak` · … |

Full schema: [`SKILL_FEATURES.md`](./SKILL_FEATURES.md).

---

## Display grouping (UI / report)

| Display | Paths | Typical u |
|---------|-------|-----------|
| MAX PLAY | SUPER | 6 |
| TOP PICK | TOP, TOP+ | 4–5.4 |
| SHARP PLAY | RANK, SHARP, SHARP-LEAN, SHARP-PRIME, WINNER | 0.75–6 |
| STRONG | MINI | 1.5–5 |
| LEAN | CONFIRMED, MINI-, DISSENT | 0.5–1.35 |

---

## Evidence snapshot (Jun1+ actual staked CF)

| Policy | Tickets/day | PnL | ROI |
|--------|------------:|----:|----:|
| Path only | ~9.7 | +43u | 3.4% |
| Tape alone | ~7.0 | +103u | 10.5% |
| Soft gate on tape (shipped intent) | ~7.0 | +114u | 11.9% |

Soft stack ≈ **+11u / +1.4pp ROI** on top of live tape with **flat daily ticket count**.

---

## Operator checklist

1. Score must be **> 0** or nothing stakes.  
2. Read **`v8_hcStakeTier` + `finalUnits` + `v8_edgeNetBucket` + `v8_edgeNetSizeAction` + `v8_tapeAction`**.  
3. `0u` + `tape-weak` = tape skip (RANK should not get this).  
4. `0u` + TOP tier + bucket NEITHER = intentional TOP mute.  
5. `HALF` = soft NEITHER shrink — ticket stays on the board at half size.  
6. Missing tape → fail-open; missing both EDGE and net → soft-size fail-open.  
7. Deploy `main` so fetch cron runs this SHA; restamp pre–T-15 ACTIVE; graded/T-15 frozen keep old units.
