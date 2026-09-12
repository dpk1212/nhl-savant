# Why 3u is beating 4–5.4u

_Snapshot 2026-09-12 · AGSU Aug 31+ graded · re-run `node scripts/analyzeTopVsStrongSlice.mjs`_  
_No production sizer change. WATCH ≠ bump / revert._

3u (STRONG) is **32-14 / +39.3u**. TOP (4–5.4u) is **7-7 / −2.5u**. That is not “4u is a bad size.” If those 14 TOP tickets had stayed 3u they would be **−4.1u**. The extra unit on the same tickets is **+1.6u**. The inversion is **who we put in TOP**, and **which 4u we muted**.

## What is in shipped TOP

| How they got to 4u+ | N | W-L | PnL |
|---------------------|--:|:---:|----:|
| Native 4u+ that T kept | 7 | 4-3 | **+4.7u** |
| Unit-tier PROMOTE (Sep 11 old OR) | 4 | 2-2 | −2.5u |
| T arriving mid BOOST → 4u | 3 | 1-2 | −4.7u |

Native TOP that survived T is fine. The steam-era *promotes* into TOP are **3-4 / −7.2u** (Kansas / Rutgers already-on; Rockies arriving BOOST; Under 7.5 arriving BOOST). Those “improvements” are what made the TOP tile look worse than 3u.

Sep 11 PROMOTE stamps are the old OR. Timing-only (Sep 12) would not have pushed Kansas / Rutgers / LEAN Under 8.5.

## Cuts / mutes that actually eat TOP inventory

Two different piles:

**Still 4u+ when T ran, then muted:** see [Policy T’s AND gate](#policy-t--the-and-gate-on-tails) below. Clean cut is **17 · 11-6 / +16.4u**, all A/B, all steam off. The +16.4u is almost entirely **fat 5-0 / +23.2u**. The 4u half is **6-6 / −6.8u** — T is working there.

| mutedBy | N | W-L | PnL | Read |
|---------|--:|:---:|----:|------|
| **steam-tail unconfirmed 4u** | 12 | 6-6 | **−6.8u** | WORKING — same leak August priced |
| **steam-tail unconfirmed fat** | 5 | 5-0 | **+23.2u** | WATCH — August said this cell leaks; this window it is the whole + |
| ev-drift-edge | 3 | 0-3 | −14.8u | WORKING |
| tape-weak | 5 | 3-2 | −4.7u | WORKING |
| top-crowded (still 4u at T) | 3 | 1-2 | −7.4u | WORKING at this gate |
| winner_align_fade | 4 | 4-0 | +19.4u | WATCH, pre-steam fade |

**top-crowded (earlier, path TOP):** 15 native-4u tickets, **11-4 / +18u** (u4 subset 11-2 / +29u). That mute is aimed at crowded TOP conviction, not steam. It is the other big eater of “would-have-been TOP.” WR is the watch; do not flip from n=15.

−375 and EV&lt;−2 are not eating TOP (those land mid / already 0u).

## What 3u slice looks like a bump

Blind 3u → 4u is **+13.1u** only because the 3u book is 70% WR. That is in-sample, not a rule.

| Slice | N | W-L | @3u | bumpΔ | Read |
|-------|--:|:---:|----:|------:|------|
| **ELITE+PREMIUM** | 14 | 13-1 | +31.2u | **+10.4u** | the only slice that matches the inversion |
| ELITE RANK (EDGE-SOFT 4→3) | 3 | 3-0 | +6.5u | +2.2u | RANK mid-EDGE ×0.75 is flattening quality into STRONG |
| ELITE MINI | 2 | 2-0 | +6.5u | +2.2u | MINI is supposed to be 3u |
| ELITE Q1 | 3 | 3-0 | +7.6u | +2.5u | Q1 floor after tape mute — do not silently undo leftover/tape |
| timing promote (live rule) | 3 | 3-0 | +9.3u | +3.1u | already shipped; too small to unflatten the tile |
| T arriving / WEAK + steam | 6 | 4-2 | +2.3u | +0.8u | do not bump — this is what already poisoned TOP |
| LEAN @ 3u | 5 | 1-4 | −9.1u | **−3.1u** | never bump |

Steam is not why ELITE/PREMIUM is winning: steam-off ELITE/PREM is **10-1 / +22.8u**. A steam timing bump will not fix the ladder. RANK EDGE-SOFT (`EDGE` 0–7 → ×0.75, 4u → 3u) is the mechanical flatten on quality RANK.

## If we change something (Dale picks)

1. **Do not** bump all 3u. **Do not** bump WEAK arriving / already-on — that is the current TOP leak.
2. **Do not** revert T’s 4u steam gate from this window. Keep logging fat + into-T steam-tail.
3. Candidate if we want the ladder back: **ELITE (maybe PREMIUM) floor 4u**, or **RANK ELITE/PREMIUM HOLD instead of EDGE-SOFT**. That is a quality restore, not another steam promote.
4. Second watch, not a ship: **top-crowded** on native 4u (11-2). Separate question from steam.
5. Third watch, not a ship: **unmute A/B fat when steam is off** (the 5-0). Do not unmute the 4u half with it.

## Policy T — the AND gate on tails

T does not re-size the book. It is a **permission slip on the tails**. The sizer already made a 4u or 5.4u+ ticket. T answers one question: *do we still believe that tail?*

```
keep 4u / 5.4u+  iff  Source A/B CONFIRMED on our side  AND  steam on at lock
keep 5u always
leave 2–3u alone
fail-open if steam is unobservable
```

The stamp reason `unconfirmed_4u` / `unconfirmed_fat` does **not** mean “no wallets.” It means the AND failed. In the Aug 31–Sep 11 window the AND failed the same way every time:

**17 tickets still 4u+ when T ran. All 17 had A/B. All 17 had steam off. T muted them. 11-6 / +16.4u left on the table (stake 75.6u).**

Zero of these were muted for missing A/B. Pin never printed steam at lock. T treated that as “tail not confirmed” and wrote 0u.

### The +16.4u is not one pile

| Cell | N | W-L | PnL | vs August T thesis |
|------|--:|:---:|----:|--------------------|
| 4u, A/B, steam off | 12 | 6-6 | **−6.8u** | August 4u-without-AND was **12 · 7-5 · −3.3u**. T is still doing that job. |
| 5.4u+, A/B, steam off | 5 | 5-0 | **+23.2u** | August 5.4u+ without AND was **28 · 16-12 · −8.9% · −13.7u**. This window fights that cell. |

If you unmute all 17, you buy the fat 5-0 **and** the 4u 6-6 drag. The impact you are feeling is the **fat** half.

Fat tickets T zeroed (all A/B, steam off, all won):

- 9/4 MLB Over 7.5 5.4u ELITE/RANK +5.9u
- 9/4 MLB Over 8.5 6u LEAN/SUPER +5.4u (A/B count 5/6 — wallets everywhere, path LEAN)
- 9/5 UFC Benouaich 5.4u PREMIUM/SHARP +4.1u
- 9/5 UFC Campbell 5.4u ELITE/MINI- +1.5u
- 9/6 MLB Dodgers 5.4u PREMIUM/SHARP-LEAN +6.3u

4u T zeroed is a different book: Rockies/Yankees RANK wins, then a WEAK/Q1 grind (Padres, both Jays, Twins, Overs) that nets **−6.8u**. That is not a TOP we miss. That is T working.

### What T let through this window

`steam_confirmed` (A/B **and** steam on) on 4u+: **9 · 4-5 · −3.1u**. Two of those nines are Kansas / Rutgers — overlay later pushed them to 4u and a later Fetch restamped T as confirmed. Strip the restamps and the native confirmed tail is still not the hot book.

So the permission slip flipped vs August: **the tails T trusted (steam on) are ≤flat; the fat tails T refused (wallets on, Pin quiet) went 5-0.**

That is a real inventory effect. It is also n=5 against an August cell of 28. Closing Dime said do not mute *all* fat — mute fat **unless** A/B steam. Live we have A/B and are missing only steam. August bundled “A/B + no steam” into the same AND-fail pile as “no A/B.” We have not isolated whether A/B-without-steam fat is actually the leak, or whether the leak was no-A/B fat.

### What this is not

- Not “T is broken.” The 4u AND-fail cut still matches August.
- Not “unmute everything T cut.” That reopens the 4u −6.8u.
- Not a reason to bump 3u. These tickets were already 4u+.
- Not a reason to drop A/B from the gate. Every muted winner already had A/B. Dropping A/B would not have saved them. **Dropping the steam half of the AND on fat would.**

Candidate if you pick it later: **HOLD 5.4u+ when A/B is on, even if steam is off. Keep muting 4u unless both.** That is a one-band relaxation, not a T revert. Still a watch until fat n is not 5.

## What “steam on at lock” actually means

It is **not** “Pin is moving right now.” T reads a snapshot classification at the lock row (`t15`, else last) **or** this cycle’s live snap. ON if that snapshot’s `tier` is `steam` or `gold`.

A snapshot is ON if **any** of these hold (`summarizeSteam` in `src/lib/steamMove.js`):

- last-hour juice drop ≥ **3%** (currently printing)
- since-open juice drop ≥ **3%** (the move is still stuck)
- a stored Pinnacle `steamDrops` event ≥3% toward the ticket (sticky has-event)
- 0.5pt main line toward the ticket (last hour **or** since open)

WATCH is 2% — stored, not ON. Last hour can be **0 or negative** and the snapshot stays ON if since-open is still ≥3%. That is “steamed a huge amount, now flat / gave a little back.”

What T **kept** this window (9 `steam_confirmed`) is that stuck-move book, not a printing book:

- 0 of 9 had last-hour ≥3% at lock
- 8 of 9 still ≥3% vs open (Nationals +4.3%, Under 9.5 **+12% while last hour −1.9%**, Madrid +16.6% last hour −0.2%, Rutgers +13.5% last hour 0)
- 6 already-on at first flag (August coin-flip cell) · 3 arriving

So “gave back a little” already keeps. T does not require the last hour to still be printing.

What T **muted** (17, A/B, steam off) is not “steamed then died”:

| Tape shape | N | W-L | PnL |
|------------|--:|:---:|----:|
| Never steam on any log row | 13 | 10-3 | **+23.1u** |
| Steamed then quiet at lock | 4 | 1-3 | −6.6u |
| Lock last-hour ≥3% | 0 | — | — |
| Lock since-open ≥3% | 0 | — | — |

The fat 5-0 (except Over 8.5 6u, which printed gold then t15 went 0/0) **never had steam on the tape**. Pin was flat — or we wrote 0/0. Widening “on at lock” to “ever steamed” would have kept the 1-3 died-print losers and still missed the quiet fat winners.

Tweaks the tape does **not** support: require last-hour ≥3% (would mute every confirmed tail we kept); ever-on / sticky log (keeps 1-3, −6.6u); lower the floor to WATCH 2% (Campbell peaked so=2.9 then zeroed; the one lock so=2.97 is Under 8.5, a loser).

The only steam-definition hole: after a real print, later rows sometimes write **0/0** (Over 8.5 6u gold → t15 off; Twins gold → t60 off; Campbell watch-all-day → t60 0/0). We treat 0/0 as “observable, no steam,” not fail-open. Fail-open is only empty log + no Pin game. That is a measurement bug, not a new steam meaning — and it still does not explain the all-day-zero fat winners.

A steam-meaning tweak does not recover the +23u quiet fat pile. That pile has no Pin move. The AND’s steam half is measuring a real stuck ≥3% vs open. Those tickets just never had one.
