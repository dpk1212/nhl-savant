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

## Brainstorm — what to do with it

Keep this tracking. Do not ship a sizer from n=8 gold or n=2 gold+limits.

1. **Explore steam-arriving on A/B sides.** Best powered cell. Candidate overlay: don’t-cut / hold size when Path A/B/C already staked and steam flips on. Still wait for n≈50 before a mute/boost rule.
2. **Do not treat gold+limits as a standalone strategy yet.** n=2. Let § 5d fill.
3. **Steam without an A/B CONFIRMED is not our game.** n=5 and it lost. We are not Closing Dime; we need the wallet.
4. **Do not chase 4%+ / 6%+ card EV.** Two gold losers sat there. Prefer 0–4% vs Pin fair.
5. **Do not become a Novig shopper.**
6. **NFL / CFB is where $1k→$4k gold+limits should cluster** as Pin limits open. Sport-unlock caps stay 1u / 2u.

---

## Detector check

Reconstructed CIN @ CHC Over 8.5 at Pin **−118 → −150**, limits **$1,000 → $4,000**:

- last-hour drop ≥ 4.5% → `tier = gold`
- limits +$3,000 and ×4 → `limitRising`
- both → `goldConfirmed`

Under on the same line is **not** goldConfirmed (steamed-against). Tests: `tests/testSteamMove.mjs`, `tests/testTicketTapeCapture.mjs`. Re-run: `node scripts/analyzeGoldSteamAb.mjs`.
