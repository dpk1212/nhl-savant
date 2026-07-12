# Winner-Align Implementation

_Status: **SHIPPED** on `pathd-v12abcd-live` · live from **2026-07-12** · rescue **E5@4u / E3@3u**._

Site thesis: **follow the real winners.**

Code: `scripts/syncPickStateAuthoritative.js` (WINNER-ALIGN block after Path D).

---

## Caveats (read before trusting CF)

1. **Same-window tune** — mute thresholds, size rules, and rescue sizes were fit on Jun1–Jul11. No holdout. Expect some regression.
2. **Causal CF ≠ leaky Path-A EDGE tables** — old “Path A EDGE5 76%” used current profiles on old dates. Live EDGE ~**61%**. Do not size like SUPER (82%).
3. **Live WR source** — uses `sharpWalletProfiles.bySport[sport].picks.wr` (n≥8). Fine for live (today unsettled); historical CF rebuilt grades day-by-day.
4. **EDGE 3–5 thin** — muted n≈9–11. **3u** is aggressive vs sample; monitor and cut to 2u if it bleeds.
5. **Variance** — E5@4 / E3@3 adds stake vs actual; CF ΔPnL ≠ guaranteed live Δ.
6. **Null-tier book** — ~half of Jun1+ stakes lack `v8_hcStakeTier`; mute/size only hit stamped A/B/C. Rescues still fire on any muted score>0 + EDGE≥3.
7. **Correlation** — CF treats bets independent; same-slate correlation not modeled.
8. **No side flips** — mute/size/rescue only. T-15 freeze unchanged.

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
| **A** HC | EDGE≥5 → min(u+1, 6); EDGE≥3 keep; edge≥0 → u−1 (floor 1); else 1u |
| **B** RANK | EDGE≥5 → 4u; else ≤2u |
| **C** SHARP | EDGE≥5 keep; EDGE≥3 ≤2u; else 1u |
| **D** DISSENT | EDGE≥3 → 1u; edge&lt;0 → 0 |

Odds-cap still applies.

### 3. RESCUE → `WINNER`
- Still 0u after above, score&gt;0, both-side WR, EDGE≥3
- **EDGE≥5 → 4u** · **EDGE 3–5 → 3u**
- `v8_hcStakeTier = WINNER`

### Stamps
`v8_winnerAlignEdge`, `MeanFor/Ag`, `TopFor/Ag`, `FadeTop60`, `MeanBehind5`, `Action` (`mute`|`size`|`rescue`).

---

## WR peer-match → why 4/3

| Slice | WR | Peer size |
|-------|---:|----------|
| Causal / muted EDGE5+ | ~61–62% | **RANK/TOP → 4u** |
| EDGE 3–5 | ~62% (thin n) | **3u** (lean-up from 2u; watch) |
| SUPER | 82% | 6u — EDGE is **not** this |

---

## CF vs actual Jun1–Jul11 (full book)

| Policy | PnL | Δ vs actual |
|--------|----:|------------:|
| Actual | +55.6u | — |
| Mute + size | +70.9u | +15u |
| Full E5@4 / E3@2 | +112u | +57u |
| **Full E5@4 / E3@3 (shipped)** | ~mid between E3@2 and higher | expect **~+50u+** class |

Path-stamped A/B/C + rescues: same ΔPnL (~+48–57u depending on rescue ladder).

---

## Ship checklist

- [x] MUTE
- [x] SIZE A/B/C/D
- [x] RESCUE WINNER @ 4/3
- [x] Date gate + stamps
- [ ] Monitor first 2 weeks: WINNER WR, mute kill rate, E3-slice PnL
- [ ] UI badge for `WINNER` tier (if not already generic)
