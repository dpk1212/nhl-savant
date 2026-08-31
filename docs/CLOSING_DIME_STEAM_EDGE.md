# Closing Dime gold card — do we have this edge?

_Status: verified on live book 2026-08-31 · tracking only, do not size yet_  
_Tweet: [Closing Dime · CIN @ CHC Over 8.5](https://x.com/closingdime/status/2094044189302411580)_  
_Code: `src/lib/steamMove.js` · `src/lib/ticketTapeCapture.js` · `scripts/analyzeGoldSteamAb.mjs` · daily § 5d_

## Verdict

**Their exact gold card (4.5%+ Pin steam AND limits exploding) is not verified on our plays.** We have **2** graded tickets. Both won. That is not a sample.

**A nearby signal is worth exploring:** steam that **turns on after we flag** (off→on), especially when a **Source A or B CONFIRMED** wallet is already on that side.

Live book 2026-08-31 (Firestore, AGSU staked + graded, tape log n=187):

| Cell | N | W-L | WR (95% Wilson) | ROI |
|------|--:|:---:|----------------:|----:|
| Tape-log book | 187 | 101-86 | 54% (47–61) | +1.9% |
| gold+limits (their card) | 2 | 2-0 | 100% (34–100) | +60% |
| any gold (4.5%+ steam) | 8 | 6-2 | 75% (41–93) | +69% |
| **steam arriving off→on** | **25** | **18-7** | **72% (52–86)** | **+46%** |
| no steam at lock | 137 | 70-67 | 51% (43–59) | −5.5% |
| EV 0–2% (their ~1.7% analog) | 44 | 26-18 | 59% (44–72) | +19% |
| **A/B + steam at lock** | **45** | **29-16** | **64% (50–77)** | **+25%** |
| A/B + no steam | 124 | 66-58 | 53% (44–62) | +0.5% |
| **A/B + steam arriving** | **24** | **18-6** | **75% (55–88)** | **+48%** |
| steam at lock, no A/B | 5 | 2-3 | 40% (12–77) | −13% |

Wilson lower bound on gold (n=8) is 41% — coin flip is still in the interval. Steam arriving (n=25) and A/B+steam (n=45) are the first cells whose lower bound sits at or above 50% with material ROI. That is “explore more,” not “size on it.”

Almost every gold ticket already has a Source A/B CONFIRMED on our side (7 of 8). We cannot claim gold-without-sharps vs gold-with-sharps. The testable combo is **wallet tape plus steam**, not gold instead of wallets.

---

## Since we implemented steam (2026-08-19 → 08-31)

Schema v15/v16 went live **2026-08-19**. That is the whole steam sample. **July cannot confirm steam** — 230 staked graded July tickets, **0** with a tape log.

Steam-live book: **187 · 101-86 · 54% · +1.9% ROI**. Split with no retune:

| Window | N | W-L | WR | ROI |
|--------|--:|:---:|---:|----:|
| Early 08-19–08-24 | 93 | 49-44 | 53% | +1.7% |
| Late 08-25–08-30 | 94 | 52-42 | 55% | +2.2% |

**Best chance of a new edge:** Source A/B CONFIRMED already on our side, then Pin steam **turns on after we flag** (off→on).

| Cell | Since 08-19 | Early | Late | Hold-up |
|------|-------------|-------|------|---------|
| **A/B + arriving** | **24 · 18-6 · 75% (55–88) · +48%** | 14 · 10-4 · 71% · +59% | 10 · 8-2 · 80% · +35% | direction holds, late thin |
| steam arriving (any) | 25 · 18-7 · 72% (52–86) · +46% | 15 · 10-5 · 67% · +55% | 10 · 8-2 · 80% · +35% | same 24 tickets + 1 loser |
| **A/B + steam at lock** | **45 · 29-16 · 64% (50–77) · +25%** | 24 · 15-9 · 62% · +41% | 21 · 14-7 · 67% · +14% | **HOLDS, n≥21 both halves** |
| steam on at lock | 50 · 31-19 · 62% · +23% | 28 · 16-12 · 57% · +32% | 22 · 15-7 · 68% · +16% | HOLDS (diluted by 5 no-A/B) |
| steam already on (on→on) | 25 · 13-12 · 52% · +0.9% | — | — | flat — not the edge |
| gold 4.5%+ | 8 · 6-2 · 75% (41–93) · +69% | 4 | 4 | thin both |
| gold+limits | 2 · 2-0 | 0 | 2 | not a sample |

Steam that was **already on** at first flag is a coin flip. Steam that **arrives after we have A/B** is the split. The thicker cell that survives the early/late cut with real n is **A/B + steam at lock** (n=45). Arriving is the hotter subset (n=24, Wilson lo 55%) and the realistic next edge to keep measuring — not to size.

Not one sport and not one night. A/B arriving: MLB 15 (10-5, +51%), WNBA 7 (6-1, +43%), NFL 2 (2-0). 08-23 WNBA was 4-0 and about half the arriving PnL (+14.6u of +29u). Strip that night and A/B arriving is still **20 · 14-6 · 70%**. Direction is not a one-card spike.

**Do not size this.** Fetch already stamps it at T-15. Product move if any: paint / don’t-cut when A/B is on our side and steam arrives. Gold+limits is not the play. Mute-no-steam still kills ~70 wins.

---

## Only-ship on the steam window (same sizer, rest 0u)

Universe: **187** graded tape-log tickets, 08-19–08-30. Units unchanged. Gate = ship iff the row matches, else 0u.

Today: **187 · 101-86 · 54% · +1.9% · +9.2u**.

| Gate | SHIP | WR | ROI | PnL | Wins kept / cut | Days with a lock |
|------|------|---:|----:|----:|----------------:|-----------------:|
| **A/B + arriving** | **24 · 18-6** | **75% (55–88)** | **+48%** | **+29.0u** | 18 / 83 | 11/12 (empty 08-20) |
| A/B + arriving, keep live Ev-drift | 23 · 18-5 | 78% (58–90) | +63% | **+34.4u** | 18 / 83 | 11/12 |
| steam arriving (no A/B required) | 25 · 18-7 | 72% | +46% | +28.0u | 18 / 83 | 12/12 |
| A/B + steam at lock | 45 · 29-16 | 64% (50–77) | +25% | +29.6u | 29 / 72 | 11/12 |
| any steam at lock | 50 · 31-19 | 62% | +23% | +28.6u | 31 / 70 | 12/12 |
| gold 4.5%+ | 8 · 6-2 | 75% (41–93) | +69% | +14.7u | 6 / 95 | 7/12 |
| A/B only (not a steam gate) | 169 · 95-74 | 56% | +7% | +31.3u | 95 / 6 | 12/12 |

Incremental build — this is the cut:

| Step | Add | N | W-L | PnL |
|------|-----|--:|:---:|----:|
| **1. CORE** | A/B + arriving | 24 | 18-6 | **+29.0u** |
| 2 | A/B already-on steam | 21 | 11-10 | **+0.6u** |
| 3 | steam, no A/B | 5 | 2-3 | **−1.1u** |
| 4 | gold not already in core | 2 | 2-0 | +5.8u |

**Optimal steam gate: Source A/B CONFIRMED on our side, and steam turns on after we flag.** Same units. Do not widen to “steam at lock” — that is 21 coin-flip tickets for +0.6u. Do not drop A/B — the extra arriving ticket is a loser and is the only thing filling 08-20. Keep the live Ev-drift mute; it would have zeroed the one arriving 5.4u loser (08-25 WNBA Under 167.5) and the core becomes **18-5 · +34u**. Do not add a wider fade cut on arriving (that also kills a win).

This is a **featured slate**, not the current lock list. Users would see **18 wins instead of 101** on this window (~2 locks/day). PnL of the window goes +9u → +29u because we stop shipping the −20u rest, not because we found more winners.

If the product still needs a full slate, do not turn this into a hard gate. Paint arriving; keep shipping the rest. The only volume-friendly cut in this window that is actually +PnL is “require A/B” (drop 18 no-A/B tickets, 6-12 · −42% · −22u) — that is a wallet-tape gate, not a steam gate.

---

## Can steam size the book?

Same 187 tickets, units change only. Early vs late, no retune.

**A little, as a BOOST permission — not as a new ladder.**

Size **up** A/B arriving (everyone else unchanged):

| Overlay | ΔPnL | Δstake | Early / late |
|---------|-----:|-------:|--------------|
| Floor arriving &lt;2u → 2u | **+4.3u** | +13.5u | +1.7 / +2.6 **HOLDS** |
| Arriving ×1.25 | +7.2u | +15.1u | +4.8 / +2.4 **HOLDS** |
| Lean arriving +1u | +6.8u | +17.0u | +2.8 / +4.0 **HOLDS** |
| Floor arriving &lt;4u → 4u | +15.8u | +45.5u | holds on paper, **13 tickets of 9-4** |

The 13 ≤1u arriving tickets were native 1u (`tape=HOLD`, preTape=1), not leftover cuts. They went **9-4 · +42%** vs the rest of 1u **33-46 · −21%**. A 2u floor is the only bump with both a hold-up and a sane jump. 1u→4u is not a size rule.

Size **down** fat tickets without steam:

| Overlay | ΔPnL | Δstake | Early / late |
|---------|-----:|-------:|--------------|
| Unboost tape BOOST unless **A/B + steam at lock** | **+5.8u** | **−37u** | +2.0 / +3.8 **HOLDS** |
| Cap 5.4u+ at 4u unless A/B steam at lock | +3.1u | −41u | HOLDS |

Tape BOOST with no A/B steam: **29 · 17-12 · −9.5% · −14.5u**. 5.4u+ with A/B steam at lock: **9 · 7-2 · +34%**. 5.4u+ without it: **28 · 16-12 · −8.9%**.

Combo (floor arriving at 2u **and** unboost BOOST without A/B steam): steam-window **+9.2u → +19.3u**, stake **476u → 453u**, both halves. That is the sizing shape that matches the fetch: tape still dials, steam says whether the ×1.35 is earned, and 1u arriving can take a 2u floor.

Do **not**: replace the sizer, size gold, or add more units to tickets that are already 5.4u/6u arriving (one of those five is the 5.4u Under 167.5 loser).

---

## August book, unit tiers, extra strength signal

Live pull 2026-08-31. These three cells already shipped — they are not a hypothetical filter.

| Book | N | W-L | ROI | PnL |
|------|--:|:---:|----:|----:|
| Full August staked | 372 | 198-174 | +4.9% | **+46.8u** |
| Aug 1–18 (no steam stamps) | 182 | 95-87 | +7.1% | +33.8u |
| Aug 19–31 tape-log | 187 | 101-86 | +1.9% | +9.2u |

| Cell | Tickets | Share of Aug tickets / units | PnL | Share of **full August** PnL | Aug 19–31 without them |
|------|--------:|-----------------------------:|----:|-----------------------------:|------------------------|
| **A/B + arriving** | 24 | 6% / 6% | **+29.0u** | **62%** | 163 · 83-80 · **−4.8%** |
| steam arriving (any) | 25 | 7% / 6% | +28.0u | 60% | 162 · 83-79 · −4.5% |
| **A/B + steam at lock** | 45 | 12% / 12% | **+29.6u** | **63%** | 142 · 72-70 · −5.7% |

24 tickets carried **62% of August profit**. Without them the steam-window book is underwater. The extra 21 tickets in “A/B + steam at lock” that were **already on** at first flag are **11-10 · +0.6u** — they add almost no dollars. Same PnL, fatter n, because arriving is doing the work.

### Unit tiers (HIT vs other tickets of the same size)

| Cell | ≤1u | 2–3u | 4u | 5.4u | 6u |
|------|-----|------|----|------|----|
| **A/B arriving** | **13 · 9-4 · 69% · +42%** vs rest 1u 42% / −21% | 4 · 3-1 thin | 1 thin | 2 · 1-1 thin | 3 · 3-0 thin |
| A/B steam at lock | 23 · 13-10 · 57% · +12% vs rest 1u 42% / −20% | 8 · 5-3 · +15% vs +6% | 3 thin | **5 · 4-1 · 80% · +44%** vs rest 5.4u −14% | 4 · 3-1 thin |

Lean vs believed inside arriving: **<4u 17 · 12-5 · 71% · +50%** and **4u+ 7 · 6-1 · 86% · +47%**. Not a 1u trick. The only band with real n for arriving is **≤1u**, and that is exactly where the August 1u book is bad (92 tickets, 46% WR, −12% ROI). Arriving is what separates those 1u tickets.

5.4u arriving is **1-1**. Do not size 5.4u tickets from arriving. A/B + steam at lock is the cell that still holds at 5.4u (5 tickets). Thin, but same direction.

### Counterfactuals (do not ship)

- Floor lean arriving at 4u → steam-window +9u becomes +25u. That is 13 tickets of 9-4 going 1u→4u. Looks pretty, not a sample for a size rule.
- ×1.25 on the 24 → +9u becomes +16u. Same objection.
- 0 muted 0u tickets in this window have a tape log, so we cannot count “don’t-cut a mute.” Don’t-cut here means: do not treat the 1u arriving tickets as junk. They already shipped. They went 9-4.

### Extra signal of strength?

**Yes — name arriving. No — do not size. No — do not lean on Gold Steam.**

The Locked card already paints **Steam With Entry** when steam is ON at lock. All 24 arriving tickets would light that. So would the 21 already-on A/B tickets that went **11-10 · +1%**. The chip the card has today **cannot tell the +48% cell from the coin-flip cell.**

Gold Steam is 6 of those 24 (4-2). Not the filter.

Practical paint: a distinct chip when Source A/B is on our side **and** steam turned on after first flag — “Pin moved with us” / “Steam arrived.” That is a strength label on tickets we already staked, especially the 1u ones. It does not change units. It does not replace Sharp Consensus or Steam With Entry; it is the lifecycle bit those two do not capture.

---

## What they are selling

Two stacked signals on CIN @ CHC **Over 8.5**, 2026-08-30:

1. **Soft-book lag.** Novig **−133** (57.1%) while Pinnacle no-vig fair is **−138** (58.0%) → they paint **~1.7% EV**.
2. **Sharp-book confirmation.** Pinnacle Over shortens ~**−118/−122 → ~−150** in the last hour **and** the limit jumps **~$1k → ~$4k**. Price + limit together = the gold card.

Their 1.7% is **dollar EV on the stake** (`p × profit − (1−p) × risk`). Our card EV is a **probability-point gap** (`(p_fair − p_offer) × 100`). Same ticket is ~**0.9pp** on our scale, ~**1.6%** on theirs. Their gold card lands in our **0–2% EV** bucket, not our 4%+ bucket.

Final: Reds 7–5 Cubs, total **12**. Over 8.5 **cashed**. We had Cubs ML / Cubs −1.5 staged and Under 8.5 locked — Pin steam on the Over was **against** those tickets.

---

## We already instrument this

Not a new idea in the code. Thresholds in `steamMove.js` were written against this product:

| Floor | Meaning |
|------:|---------|
| 2.0% | WATCH (stored, not painted) |
| 3.0% | STEAM (pinnapi event) |
| **4.5%** | **GOLD** (~their 4.75% last-hour card) |
| +$2,000 or ×1.45 limits | `limitRising` |
| GOLD **and** limits rising | **`goldConfirmed`** |

Card EV = flagged ticket vs **same-line Pinnacle no-vig**. Steam = last-hour / since-open decimal drop. Locked card already paints **Gold Steam** / **Limit Rising**. Lifecycle log (`v8_ticketTapeLog`) is tracking only — it does not size units.

What we bet is **Polymarket**, not Novig. EV here is “did we get a better number than Pin fair,” not “this sportsbook lagged.” Same math, different shop.

---

## Gold × Source A/B on the same side

Source A = featured-pick book (`whitelistSource` contains A). Source B = on-chain positions (contains B). CONFIRMED only.

Gold itself is rare (8 tickets). 7 of those 8 already have A **and** B on FOR. The one gold+limits without A/B is Washington Mystics ML (Path B RANK, 3u, won).

The split that has sample:

- A/B tickets **with** steam at lock: **+25% ROI** (45, 29-16)
- A/B tickets **without** steam: **+0.5% ROI** (124, 66-58)
- Steam **without** an A/B CONFIRMED: **−13% ROI** (5, 2-3)

Steam arriving on a Source B side is the same 24-ticket +48% cell (every arriving A/B ticket in this window had Source B). Source A is 19 of those 24.

All 8 gold tickets (2026-08-31 pull):

| Date | Play | Result | Gold | Path | A/B | EV |
|------|------|--------|------|------|-----|---:|
| 08-19 | Athletics ML | L 1u | gold-flat | ? | 1/2 | 6.6 |
| 08-22 | Ravens ML | W 1u | gold-flat | ? | 1/1 | 0 |
| 08-22 | Cowboys ML | W 5.4u | gold-flat | C | 1/1 | −2.3 |
| 08-23 | Tempo −spread | W 5.4u | gold-flat | C | 2/2 | −1 |
| 08-26 | Under 8.5 | W 1u | **gold+limits** | A | 1/1 | 2.1 |
| 08-27 | Mystics ML | W 3u | **gold+limits** | B | 0/0 | 3.1 |
| 08-28 | Falcons ML | W 4u | gold-flat | C | 2/1 | 3.2 |
| 08-29 | Under 7.5 | L 0.5u | gold-flat | C | 3/4 | 6.3 |

Two gold losers were the high-EV (6%+) tickets — same warning as the 4%+ EV bucket.

---

## What our booked plays already said (daily § 5d, 2026-08-30)

`DAILY_AGSU_REPORT.md` § 5d on `main`. Window then: **981** staked · **186** with log · **168** graded with log. Live pull above is 187 graded with log (one day later). Same shape: off→on is the monster, negative EV is the majority of the book.

---

## The directional filter (winners vs losers)

The staked tape-log book is **187 · 101-86 · 54% · +1.9% ROI**. One question splits it:

**After a Source A/B CONFIRMED is on our side, did Pinnacle move toward us or away from us?**

| Pole | Rule | N | W-L | WR | ROI | User effect |
|------|------|--:|:---:|---:|----:|-------------|
| **With us** | A/B + steam arriving (off→on) | 24 | 18-6 | **75% (55–88)** | **+48%** | more wins — paint / don’t-cut |
| Rest of book | not that | 163 | 83-80 | 51% | −4.8% | baseline |
| **Against us** | EV vs Pin faded (`dEv≤−1.5`) and still `EV&lt;−1` | 33 | 12-21 | 36% | **−46%** | less losses — mute |
| Live mute already | plus `EDGE≥15` (since 08-26) | 12 | 3-9 | 25% | **−70%** | already the rule; 11/12 are pre-08-26 |

If we had muted every fade+`EV&lt;−1` ticket, the remaining book is **154 · 89-65 · 58% · +15% ROI** (+46u vs leaving them on). Cost: **12 real wins** cut. The live `EDGE≥15` mute already captures almost all of that PnL (**+44u**) on the fat 5.4u tickets and only cuts **3 wins**. Widening to EDGE&lt;15 adds **9 more wins cut** for **12 more losses out** (~+2u). That is not how you show users more wins.

Do **not** mute “no steam.” That cuts **70 wins** (137 tickets, 51% WR). Coin-flip volume, not a loser pile.

**Product filter (one sentence for the card):** Pin is moving *with* our sharps, or Pin is moving *against* us. With → keep / badge. Against + high EDGE → already mute. Gold+limits is not this filter.

Live mute slip to check: 2026-08-26 Real Madrid ML 5u matched `EDGE≥15` + fade + `EV&lt;−1` and still shipped (it won).

---

## Detector check

Reconstructed CIN @ CHC Over 8.5 at Pin **−118 → −150**, limits **$1,000 → $4,000**:

- last-hour drop ≥ 4.5% → `tier = gold`
- limits +$3,000 and ×4 → `limitRising`
- both → `goldConfirmed`

Under on the same line is **not** goldConfirmed (steamed-against). Tests: `tests/testSteamMove.mjs`, `tests/testTicketTapeCapture.mjs`. Re-run: `node scripts/analyzeGoldSteamAb.mjs`.
