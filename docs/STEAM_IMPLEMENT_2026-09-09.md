# How to implement Findings 1 and 2 — what we do today, what would change, $ impact

_Decision packet. **No live policy in this commit.** Pick from the menu; then we write the overlay._
_Numbers: live AGS-U book + graded mutes Aug 19–Sep 8. Policy T live Aug 31+._

Two independent changes. They stack. Paint is a third, $0, do either way.

| | Finding 1 | Finding 2 |
|--|-----------|-----------|
| **Job** | Stop killing tickets T would have shipped | Pay extra for the 76% cell we already ship |
| **Board** | ~**1 extra lock every 3–4 days** that currently never appears | Same lock, **2.5–3u shows 4u** when steam *arrived* (~4–6 / 9 days) |
| **Last 21 days** | **+18.7u on 7 tickets** after T’s 2u floor (8th is a 4u stamp quirk) | **+6.5u extra** on 10 tickets already on the board |
| **After T (9 days)** | **+5.2u on 2 tickets** (Baylor 2u, Under 6.5 2.5u) | **+4.5u extra** on 6 live tickets |
| **If we are wrong** | Next arriving leftovers go 4-4 — we ate stubs | Sep 8 Over 8.5 is −4u not −3u |

---

## What we are doing today (do not change this unless you pick below)

Same V12 sizer. Steam is **not** in leftover. Steam is **only** in Policy T, last size overlay:

| Incoming size | Today |
|---------------|--------|
| ≤1u junk | **0u** |
| ≤1u + Source A/B + steam **arriving** (off → on) | **floor 2u** |
| **2–3u** | **HOLD** (arriving and already-on get the same number) |
| 4u | keep iff A/B **and** steam on at lock |
| 5u | always |
| 5.4u+ | keep iff A/B steam on at lock |

Leftover mute (`applyFlinchFailOpenMuteOverlay`, from Aug 19): still **<4u** AND (native-4u path at plus money **or** tape BOOST **or** EDGE≥10 **or** tape FAIL_OPEN) → **0u**. Stamps `believed-cut` / `fail-open-sub4`. **Steam is not an input.** Q1/UNOPP floors run *before* leftover so they cannot revive a stub.

Pipe:

```
sizer → leftover mute     ← steam not available here today
      → maxSR / no-confirmed / crowded / ev-drift / climate / unlock
      → Policy T          ← arriving floor + 4u/fat gate
      → fav-juice −375
```

T is skipped when leftover already zeroed the ticket (`if (units > 0)`). Arriving never gets a vote on those.

Arriving = Pin **off** on the first tape-log row, **on** at lock. Already-on = on→on. That split is load-bearing. Source A/B = wallet `whitelistTier === CONFIRMED` with source A/B, not climate letters.

A/B arriving live: **34 · 26-8 · 76.5% · +51% ROI · +46u · 2.62u/ticket.** Rest of live book: **2.66u/ticket · +5% ROI.** Same stake, triple ROI.

---

## Finding 1 — leftover × arriving

### What the user notices

Today those tickets never post. If we ship F1: **~one extra lock every 3–4 days.** Mix of a **2u** (old 1u stub that T floors) and a **2.5–3u** MLB ML/total. Not a 16-ticket day. First cycle steam is still off — leftover still kills, card stays dark. Later cycle steam arrives — card appears. Same cadence as T’s 1u→2u floor.

### The seven tickets leftover killed that T would have shipped

Rays 4u MINI (09-04, +4.24) is a stamp quirk: leftover **already exempts ≥4u**. Do not write a special case for it. The shippable cell is these seven, all <4u, all A/B arriving, **7-0**.

| Date | Play | Why leftover killed it | Sizer | After leftover HOLD, T does | Result at T size |
|------|------|------------------------|------:|-----------------------------|------------------|
| 08-19 | Under 8.5 UNOPP | FAIL_OPEN | 1u | **Floor 2u** | W **+1.92** |
| 08-21 | Red Sox ML SHARP | tape BOOST leftover | 3u | **HOLD 3u** | W **+1.74** |
| 08-21 | Over 8.5 TOP +175 | plus-money native-4u stub | 1u | **Floor 2u** | W **+3.50** |
| 08-24 | Giants ML DISSENT | FAIL_OPEN | 1u | **Floor 2u** | W **+3.26** |
| 08-25 | Over 7.5 RANK +123 | plus-money native-4u | 2.5u | **HOLD 2.5u** | W **+3.08** |
| 09-05 | Baylor +spread UNOPP | EDGE=10 | 1u | **Floor 2u** | W **+1.70** |
| 09-06 | Under 6.5 SHARP-LEAN | EDGE≥10 | 2.5u | **HOLD 2.5u** | W **+3.45** |

**+18.7u on 7 tickets** after T’s 2u floor on the leans. At leftover’s raw 1u those four leans were only +5.2u — T is doing the size work, leftover is the gate.

After T (9 days): Baylor + Baylor-sized 2u and Under 6.5 2.5u = **+5.2u on 2 extra locks**.

No-steam leftovers stay dead: **42 · 15-27 · −21u · −27%.** Already-on steam leftovers: **5 · 3-2 · +0.8u** — do not save.

### How to implement it (pick one)

#### F1-A — **Recommended.** Leftover HOLDs when A/B arriving

Leftover already re-runs every sync from the sizer, not from last night’s 0u. Arriving is off→on, so leftover **cannot** see it on the first cycle. On a later cycle the tape log exists. Give leftover the same lifecycle T already computes, and HOLD.

**Code (small):**

1. In `scripts/syncPickStateAuthoritative.js` (create ~3219 and sync ~4791): capture tape / `resolveSteamLifecycle` **before** leftover, not only before ev-drift/T. Both paths already capture later; pull that block up so leftover and T share one snap.
2. In `applyFlinchFailOpenMuteOverlay` (`src/lib/walletClvSkill.js`): new optional args `steamArriving`, `sharpAB`. After the flags match, **if `sharpAB && steamArriving` → HOLD at incoming units** (`action: 'HOLD'`, `reason: 'arriving_exempt'`). No-steam and already-on still MUTE.
3. Then maxSR → no-confirmed → crowded → ev-drift → climate → T run as today. T floors 1u→2u; HOLDs 2–3u; confirms 4u.
4. Tests in `tests/testFlinchFailOpenMute.mjs`: arriving+A/B HOLD; arriving without A/B still mute; already-on still mute; no-steam still mute. Existing mute cases unchanged when steam args omitted (fail-closed).

**Why this hook, not “revive at T”:** leftover zeros the ticket *before* maxSR / no-confirmed / ev-drift. A T-only revive would skip those mutes. The 7-ticket CF happened to have none of them; the next one might. F1-A lets later hygiene still kill.

**Create path:** with no tape log, arriving is always false (`steamOnFirst = liveOn`). First post stays muted. Card appears on a later sync when the log is off→on. That is the product.

#### F1-B — Revive inside Policy T

Run T even when leftover already set units to 0, if `mutedBy` ∈ `{believed-cut, fail-open-sub4}` and A/B arriving; restore `unitsPrePolicy`, then apply T.

Same 7-ticket $ on this sample. **Worse:** maxSR / no-confirmed / ev-drift never ran on a 0u ticket. Do not pick this unless F1-A is blocked.

#### F1-C — Paint only

Show leftover-killed arriving on a muted card / internal flag. **$0.** Does not change the lock list.

### Do not implement

| Idea | Why |
|------|-----|
| Exempt leftover for any A/B, steam or not | No-steam leftovers **−21u** |
| Exempt leftover for steam-at-lock including already-on | Already-on leftovers **+0.8u** — not the cell |
| Turn leftover off | Hygiene mute is +EV without steam |
| Unwind *all* FAIL_OPEN leftover (Finding 3) | 21 tickets, ~1 extra lock/day, tape-blind. Hold-up n=6. Only the **2 arriving** FAIL_OPENs belong with F1 |
| Move leftover after T | Leftover would then kill arriving 2–3u that T just held (Red Sox 3u) |
| `if (abArriving) HOLD` in leftover **without** passing steam / moving tape capture | Arriving is not computed at leftover today. The `if` is a no-op |

---

## Finding 2 — arriving 2–3u → 4u

### What we are doing today

T HOLDs 2–3u. Arriving and already-on get the **same units**. August: arriving was 6% of tickets and 6% of units. T only changed the 1u tail (floor 2u). Mid arriving still gets whatever path/tape printed.

### What the user notices

A 3u Q1 Over or MINI ML that already locks shows **4u** when steam *arrived* (off→on), not when steam was already on. After T that was **six tickets in 9 days** (Orioles 3u, Overs 2.5/3/3u, Phillies 3u, Rangers 3u). 2u T-floors stay **2u**. Fat arriving stays fat (mean 5.4u, includes Under 167.5 −5.40).

### Last-21-day $ (live arriving only, same W/L)

| Rule | Extra stake | Extra PnL | Note |
|------|------------:|----------:|------|
| **Native 2–3u → 4u** | **+12.5u** | **+6.5u** | 10 · 8-2 · +62%. MLB-only. Wilson lo 49% |
| Same tickets +1u (cap 5) | +10u | +5.9u | Messier board (2.5→3.5). Not worth it |
| Same tickets → 5u | +22.5u | +12.4u | Too much heat on the two losers |
| Also send 1u floors → 4u | +6u on those 3 | +2.9u | Hull −2 becomes −4. August already rejected 1u→4u |
| Fat arriving → more | — | — | Under 167.5 −5.40. Do not |

After T (9 days) native 2–3u arriving extra at 4u: Orioles / Over 8.5 / Over 8.5 / Phillies / Rangers / Over 8.5 = **+4.5u extra** (the Sep 8 Over is −4u not −3u).

**Not this bump:** steam-at-lock including already-on. 2–3u already-on is **10 · 6-4 · −2%**. Barça −752 at 3u is already-on.

### How to implement it (pick one)

#### F2-A — **Recommended.** In Policy T, native mid + A/B arriving → 4u

`src/lib/steamTailPolicy.js` `applySteamTailPolicy`, **after** the lean return and **after** the unconfirmed 4u/fat muteBand check, **before** the final HOLD:

```js
if (band === 'mid' && abArriving) {
  return pack({ units: 4, action: 'BOOST', reason: 'arriving_mid_4u', ... });
}
```

Order is the whole rule:

1. **Lean returns first.** 1u arriving already FLOOR 2u and never reaches this line. Do not restack floors to 4u.
2. **Fat muteBand already ran.** Climate-halved 5.4u that now looks like 2.7u stays a fat mute, not a 4u boost.
3. Native 2–3u arriving → **4u**. T already requires A/B steam to *keep* a 4u. Arriving is a subset of steam-on. We are not fighting the 4u mute.
4. 5u still HOLD. 4u / fat still the existing steam gate.

Tests in `tests/testSteamTailPolicy.mjs`: 3u arriving+A/B → 4u BOOST; 2u arriving+A/B → 4u; 1u arriving stays FLOOR 2u; 3u already-on (on→on, `steamArriving=false`) stays 3u; 3u arriving without A/B stays 3u; climate-halved fat (`units: 2.7, bandUnits: 5.4`) still MUTE.

Stamp `steamTailReason: arriving_mid_4u` so the card/ledger can show why it is 4u.

#### F2-B — Conservative: only 3u arriving → 4u; leave 2u/2.5u

Smaller jump. The 10-ticket cell is mostly 3u (two 2u, one 2.5u). Leaves money on the table for a slightly quieter board. Only pick this if 2u→4u feels like the August 1u→4u mistake. It is not: these already cleared the mid band.

#### F2-C — Paint arriving vs already-on ($0)

`Steam With Entry` in `src/lib/marketAgreement.js` (~line 520) lights **both**. The pick already stamps `steamTailArriving` / `steamTailOnLock` from T. Card chip: **Steam arrived** vs **Steam already on** (Gold Steam unchanged). Do this whether or not F2-A ships. Overdue.

### Do not implement

| Idea | Why |
|------|-----|
| Bump all steam-at-lock 2–3u | Already-on **−2%** |
| 1u T-floors → 4u | Hull; August “13 tickets of 9-4, not a size rule” |
| Fat arriving → 6u / uncapped | Under 167.5 −5.40 |
| Require steam on 2–3u | No-steam 2–3u after T printed **+26u** |
| Floor 2u ML → 3u | **13 · 7-6 · −7%**, extra **−1.7u** |

---

## If both ship (they stack)

They do not fight. F1 adds tickets T never saw. F2 resizes tickets already on the board. Leftover mids that F1 revives then hit F2:

| Ticket | F1 only | F1 + F2 |
|--------|---------|---------|
| 1u stubs (4 tickets) | 2u floor | **stay 2u** (lean returned) |
| Red Sox 3u / Over 7.5 2.5u / Under 6.5 2.5u | HOLD mid | **4u** |

Extra on those three leftover mids if both ship: **+4.5u** on top of F1’s +18.7u (all three won). After T that is one ticket (Under 6.5): F1 alone +3.45 at 2.5u; both **+5.52 at 4u**.

**Last 21 days if both recommended options:** F1 **+18.7u** new + F2 **+6.5u** on live mids + **+4.5u** leftover-mid bump ≈ **+30u** on this slice. Sample is still small (7 new, 10 resized, MLB-heavy).

**Going forward under T, a normal week:** ~2 extra 2–3u locks from F1, and ~4 existing 2–3u locks print 4u from F2. Lock list stays ~7–8/day, not 16.

---

## Recommended ship order

1. **F2-C paint** — $0, names the 76% cell. Do it.
2. **F1-A leftover HOLD on A/B arriving** — extra tickets, same units T already defined. Best new rule. n=7, both halves still 5-0 / 2-0 on the <4u set (08-19–24 vs 08-25–09-06).
3. **F2-A native 2–3u arriving → 4u** — the size bump. n=10, MLB-only, Wilson lo 49%. T-compatible. Cap it there.

Pick 1, 1+2, or all three. Do not pick F1-B, leftover-off, already-on bump, or 1u→4u.

---

## Files that would change (when you say ship)

| File | F1-A | F2-A | F2-C |
|------|:----:|:----:|:----:|
| `src/lib/walletClvSkill.js` leftover overlay | yes | | |
| `scripts/syncPickStateAuthoritative.js` tape-before-leftover | yes | | |
| `src/lib/steamTailPolicy.js` mid BOOST 4u | | yes | |
| `src/lib/marketAgreement.js` + locked card chip | | | yes |
| `tests/testFlinchFailOpenMute.mjs` | yes | | |
| `tests/testSteamTailPolicy.mjs` | | yes | |
| `docs/STAKE_PATHS_AND_SIZING.md` overlay table | yes | yes | |

Date-gate: none new. Leftover already 2026-08-19+; T already 2026-08-31+. Arriving is undefined before a tape log exists.
