# Closing Dime gold card — do we have this edge?

_Status: research · 2026-08-31 · tracking only, do not size yet_  
_Tweet: [Closing Dime · CIN @ CHC Over 8.5](https://x.com/closingdime/status/2094044189302411580)_  
_Code: `src/lib/steamMove.js` · `src/lib/ticketTapeCapture.js` · daily § 5d_

**Short answer:** Yes, there is something here, and we already collect the same two signals. On **our** booked plays the analog prints. We should not copy their product (Novig vs Pinnacle shop). We should measure gold+limits as its own slice, then decide whether to size.

---

## What they are selling

Two stacked signals on CIN @ CHC **Over 8.5**, 2026-08-30:

1. **Soft-book lag.** Novig still **−133** (57.1%) while Pinnacle no-vig fair is **−138** (58.0%) → they paint **~1.7% EV**.
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

## What our booked plays already say

`DAILY_AGSU_REPORT.md` § 5d, generated 2026-08-30 on `main`. Window: **981** staked · **186** with log · **168** graded with log.

### Steam on at first vs lock

| Path | N | W-L | WR | ROI | mean ΔEV |
|------|--:|:---:|---:|----:|---------:|
| on→on | 22 | 12-10 | 54.5% | **+6.1%** | −0.7 |
| on→off | 9 | 3-6 | 33.3% | **−47.4%** | −3.0 |
| **off→on** | 23 | 16-7 | **69.6%** | **+41.4%** | **+3.2** |
| off→off | 114 | 59-55 | 51.8% | −3.9% | −0.7 |

Steam **arriving** after we flagged (off→on) is the monster. Steam **dying** (on→off) is toxic. Steam that stays on is modestly fine. The majority of the book never sees steam and is slightly negative.

### EV at lock (our Novig-vs-Pin analog)

| EV@t15 | N | W-L | WR | ROI |
|--------|--:|:---:|---:|----:|
| **&lt;0** | 105 | 51-54 | 48.6% | **−5.9%** |
| **0–2** | 40 | 24-16 | 60.0% | **+22.2%** |
| **2–4** | 9 | 7-2 | 77.8% | **+22.1%** |
| **4+** | 14 | 8-6 | 57.1% | **−10.9%** |

The 0–2% bucket **is** their ~1.7% gold-card analog, and it prints. 2–4% also prints (small N). **4%+ is not a gold mine** — alt-line mismatch or a trap number is the live hypothesis. Most of the book is still **negative-EV vs Pin**; wallet flow is the engine, Pin EV is confirmation.

### Gap this report did not have

§ 5d grouped steam on/off and EV buckets. It did **not** split `goldConfirmed` vs gold-without-limits vs steam-only. The freeze scalar `v8_steam.goldConfirmed` exists on picks; the compact log dropped the flags. Next daily report run fills **Gold steam + rising limits** using freeze `v8_steam` (historical) plus log flags (new rows).

---

## Brainstorm — what to do with it

Keep this tracking. Do not ship a sizer from n=23 / n=9.

1. **Read the next § 5d gold+limits table.** That is the actual Closing Dime combo on *our* tickets. If gold+limits ≫ steam-only, paint it louder and consider a hold/boost overlay. If it does not separate, the 0–2% EV bucket is the usable piece and gold is theater.

2. **Steam-off is a mute candidate, not a law.** on→off is −47% on **9** tickets. Ev-drift × EDGE mute (`dEv≤−1.5` and `currentEv&lt;−1` and `EDGE≥15`) already covers the ugly cousin. Wait for more N before a dedicated steam-off mute.

3. **Steam-on (off→on) is a don’t-cut candidate.** +41% on 23 is the best cell in the lifecycle table. Natural join: proven-$ size-up **and** steam arriving **and** EV 0–4%. Unique to us — they do not have wallet tape.

4. **Do not chase 4%+ EV.** It lost money in this sample. Prefer 0–4% vs Pin fair.

5. **Do not become a Novig shopper.** Different product, different bankroll, different CLV. Only add sportsbook routing if we actually want to bet those numbers. Polymarket + Pin fair is the analog we can measure.

6. **NFL / CFB is where $1k→$4k will fire.** Pin totals/MLs start tiny; goldConfirmed events should cluster as those books open. Sport-unlock caps still 1u CFB / 2u NFL until the CONFIRMED pool deepens. Measure there first; do not override the cap because a gold card looked pretty.

7. **Same-game honesty.** Closing Dime Over 8.5 cashed. Our Cubs ML / −1.5 / Under 8.5 lost. Steam with the Over was a veto we did not take. A “steam against the ticket” flag on totals vs our ML/spread is worth a column in the next report, not a tweet.

---

## Detector check (this PR)

Reconstructed CIN @ CHC Over 8.5 at Pin **−118 → −150**, limits **$1,000 → $4,000**:

- last-hour drop ≥ 4.5% → `tier = gold`
- limits +$3,000 and ×4 → `limitRising`
- both → `goldConfirmed`

Under on the same line is **not** goldConfirmed (steamed-against). Tests: `tests/testSteamMove.mjs`, `tests/testTicketTapeCapture.mjs`.
