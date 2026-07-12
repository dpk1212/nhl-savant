# Winner-Align Implementation

_Status: **SHIPPED** on `pathd-v12abcd-live` · live from **2026-07-12** · rescue **E10@6u / E5@4u / E3@3u** · bad-EDGE cap **1u** · **Top-Winner Policy E** (unopposed floors + junk cut)._

Site thesis: **follow the real winners.**

Code: `scripts/syncPickStateAuthoritative.js` (WINNER-ALIGN block after Path D).

---

## Caveats (read before trusting CF)

1. **Same-window tune** — mute thresholds, size rules, and rescue sizes were fit on Jun1–Jul11. No holdout. Expect some regression.
2. **Causal CF ≠ leaky Path-A EDGE tables** — old “Path A EDGE5 76%” used current profiles on old dates. Live EDGE ~**61%**. Do not size like SUPER (82%) except at **E10+** (Q5) where we bump to 6u.
3. **Live WR source** — uses `sharpWalletProfiles.bySport[sport].picks.wr` (n≥8). Fine for live (today unsettled); historical CF rebuilt grades day-by-day.
4. **EDGE 3–5 thin** — muted n≈9–11. **3u** is aggressive vs sample; monitor and cut to 2u if it bleeds.
5. **Variance** — E10@6 / E5@4 / E3@3 adds stake vs actual; CF ΔPnL ≠ guaranteed live Δ.
6. **Null-tier book** — ~half of Jun1+ stakes lack `v8_hcStakeTier`; mute/size only hit stamped A/B/C. Rescues still fire on any muted score>0 + EDGE≥3.
7. **Correlation** — CF treats bets independent; same-slate correlation not modeled.
8. **No side flips** — mute/size/rescue only. T-15 freeze unchanged.
9. **Top-Winner E** — CF vs full v12abcd production (~+47u actual) ≈ **+30u** full / **+33u** OOS. Partly overlaps Path E rescue; unique meat is unopposed gate + no-Top5 junk cut.

---

## Causal integrity

| Lens | EDGE≥5 | WR | ROI |
|------|--------|---:|----:|
| Leaky (rejected) | n≈152 | 74% | +34% |
| **Causal (decision)** | n≈136 | **61%** | **+13%** |

---

## Live rules (`WINNER_ALIGN_LIVE_FROM = 2026-07-12`)

Order after Path A (HC) → B (RANK) → C (SHARP) → D (DISSENT):

### 1. MUTE
- Scope tiers: `SUPER|TOP|TOP+|MINI|MINI-|CONFIRMED|RANK|SHARP|SHARP-PRIME`
- → **0u** if ticket top sport-WR **against** us **≥ 60**, **OR** mean FOR−AG **≤ −5**
- `mutedBy = winner_align_fade`
- Does not flip sides

### 2. SIZE (needs both-side WR)
| Path | Rule |
|------|------|
| **A** HC | EDGE≥**10** → **6u**; EDGE≥5 → min(u+1, 6); EDGE≥3 keep; edge≥0 → u−1 (floor 1); else **1u** |
| **B** RANK | EDGE≥**10** → **6u**; EDGE≥5 → 4u; EDGE&lt;0 → **1u**; else ≤2u |
| **C** SHARP | EDGE≥**10** → **6u**; EDGE≥5 keep; EDGE≥3 ≤2u; EDGE&lt;0 → **1u**; else 1u |
| **D** DISSENT | EDGE≥3 → 1u; edge&lt;0 → 0 |
| **E** WINNER (pre-T-15 drift) | re-ladder 6 / 4 / 3 by EDGE band |

Odds-cap still applies. Universal: any A/B/C stake with EDGE&lt;0 hard-capped at **1u**.

### 3. RESCUE → `WINNER`
- Still 0u after above, score&gt;0, both-side WR, EDGE≥3
- **EDGE≥10 → 6u** · **EDGE 5–10 → 4u** · **EDGE 3–5 → 3u**
- `v8_hcStakeTier = WINNER`

### 4. TOP-WINNER POLICY E (follow unopposed elites / cut junk)
Built once per cycle from `sharpWalletProfiles`: per-sport **Top-5** by featured WR (n≥8) and **elite** = WR≥60.

| Step | Rule | Action |
|------|------|--------|
| Cap first | Top-5 FOR **and** Top-5 AG (topVsTop), **or** Top-5 on AG only | → **1u** max |
| Floor | Elite-unopp **or** Top5-unopp @ EDGE≥5 | → floor **4u** (E10→**6u**); if was 0u → `WINNER` |
| Floor | EDGE≥10 + Top5 FOR (not opposed) | → floor **6u** |
| Junk cut | A/B/C/D stake + **no** Top5 FOR + EDGE&lt;5 | → **0u** (preserves WINNER @ EDGE≥3) |

Actions stamped: `top_cap` | `top_floor` | `top_junk`.

### Stamps
`v8_winnerAlignEdge`, `MeanFor/Ag`, `TopFor/Ag`, `FadeTop60`, `MeanBehind5`, `HasTop5For/Ag`, `TopUnopp`, `EliteUnopp`, `TopVsTop`, `Action` (`mute`|`size`|`rescue`|`top_floor`|`top_cap`|`top_junk`).

---

## WR peer-match → why 6 / 4 / 3

| Slice | WR | Peer size |
|-------|---:|----------|
| Causal Q5 / EDGE≥10 | ~60% | **SUPER-class → 6u** (extreme bump) |
| Causal / muted EDGE5+ | ~61–62% | **RANK/TOP → 4u** |
| EDGE 3–5 | ~62% (thin n) | **3u** (lean-up from 2u; watch) |
| SUPER historical | 82% | 6u — only E10+ treated as this |

---

## CF vs actual Jun1–Jul12 (full v12abcd production book)

| Policy | PnL | Δ vs actual |
|--------|----:|------------:|
| **Actual v12abcd** (470 stakes) | **+46.9u** | — |
| Mute + size + rescue (Path E base) | (shipped earlier) | ~+50u class on prior CF window |
| **Top-Winner Policy E** (on top of actual) | **~+77u** | **+30.2u** (OOS **+33.3u**) |

Daily volume (Policy E CF): ~−1 ticket/day, ~+4u/day (fewer bets, bigger clean ones).

---

## Ship checklist

- [x] MUTE
- [x] SIZE A/B/C/D (+ E10→6u, EDGE&lt;0→≤1u)
- [x] RESCUE WINNER @ 6/4/3
- [x] Date gate + stamps
- [x] AGS-U §5d full EDGE monitor (ladder, findings watch, actions, vs AGS)
- [x] **TOP-WINNER POLICY E** (unopposed floors + opposed cap + junk cut)
- [ ] Monitor first 2 weeks: WINNER WR by band, mute kill rate, E3-slice PnL, E10 WR, EDGE&lt;0 staked bleed, top_floor / top_junk rates
- [ ] UI badge for `WINNER` tier (if not already generic)

## CRITICAL — Report vs causal (2026-07-12)

The first AGS-U §5d table used **current-profile EDGE replay** on historical picks (lookahead). That is **not** the causal analysis used to size Path E.

| Lens | E3–5 n | WR | Notes |
|------|-------:|---:|-------|
| Leaky report replay | ~41–59 | **~37–44%** | **INVALID** — different pick set |
| Causal (honest) | ~42–51 | **~57%** | decision lens |
| Causal muted score>0 | ~20 | **~65%** | rescue pool |

Leaky vs causal E3–5 overlap was **4/59**. Most leaky "E3–5" were misfiled causal E5+ losers (27 @ 33% WR). **Trust causal; ignore that report number.**

Report fixed to **stamped EDGE only** going forward.

## EDGE as stored feature (cron)

Every pre-T-15 reconcile (and create) stamps on the side:

| Field | Meaning |
|-------|---------|
| `v8_winnerAlignEdge` | mean FOR sport WR − mean AG sport WR (pp), or `null` if !hasBoth |
| `v8_winnerAlignMeanFor` / `MeanAg` | component means |
| `v8_winnerAlignTopFor` / `TopAg` | max WR each side |
| `v8_winnerAlignForN` / `AgN` | wallets with sport WR n≥8 |
| `v8_winnerAlignHasBoth` | both sides contributed |
| `v8_winnerAlignFadeTop60` / `MeanBehind5` | mute triggers |
| `v8_winnerAlignAction` | `mute` \| `size` \| `rescue` \| null |
| `v8_winnerAlignEvaluatedAt` | last compute time |
