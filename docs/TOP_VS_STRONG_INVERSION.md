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

**Still 4u+ when the late stack saw them (into-T):** 24-15 / +16.4u muted.

| mutedBy | N | W-L | PnL | Read |
|---------|--:|:---:|----:|------|
| **steam-tail** (unconfirmed 4u / fat, steam off) | 20 | 13-7 | **+19.3u** | WATCH — T’s “keep 4u iff A/B + steam” is cutting a hot no-steam 4u book this window |
| ev-drift-edge | 3 | 0-3 | −14.8u | WORKING |
| tape-weak | 5 | 3-2 | −4.7u | WORKING |
| top-crowded (still 4u at T) | 3 | 1-2 | −7.4u | WORKING at this gate |
| winner_align_fade | 4 | 4-0 | +19.4u | WATCH, pre-steam fade |

T fat / unconfirmed-fat with steam off is the sharpest TOP-inventory watch (includes the 5–6 fat winners). Thesis still says no-steam 4u is the cut. One window does not revert it.

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
