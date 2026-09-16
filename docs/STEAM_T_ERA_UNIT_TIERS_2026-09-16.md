# Policy T era — live unit tiers, tweak impacts, and policy mutes

_T live **2026-08-31–2026-09-15** (16 nights). Leftover A/B arriving HOLD + native 2–3u arriving → 4u from **2026-09-09**. Graded AGS-U only._
_Sign on mute CF / “left on table”: **positive = we cut winners. Negative = the mute saved us.**_

## A. Live book — headline

| Window | N | W–L | WR | Wilson | Stake | PnL | ROI | /day | u/tix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Full T (Aug 31–Sep 15) | 131 | 77–54 | 58.8% | 50.2–66.8 | 413.1 | +61.82 | +15% | 8.19 | 3.15 |
| T only, pre-HOLD/bump (Aug 31–Sep 8) | 59 | 41–18 | 69.5% | 56.9–79.7 | 179.6 | +61.30 | +34.1% | 6.56 | 3.04 |
| HOLD+bump live (Sep 9–15) | 72 | 36–36 | 50% | 38.7–61.3 | 233.6 | +0.52 | +0.2% | 10.29 | 3.24 |

## A1. Live W/L by **published** unit tier

What actually sat on the lock list. 1u is gone — T floors arriving leans to 2u and mutes the rest.

| Live tier | N | W–L | WR | Wilson | Stake | PnL | ROI | u/tix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ≤1u | 0 | — | — | — | — | — | — | — |
| 2–3u | 92 | 54–38 | 58.7% | 48.5–68.2 | 244.0 | +39.87 | +16.3% | 2.65 |
| 4u | 29 | 16–13 | 55.2% | 37.5–71.6 | 115.8 | +5.99 | +5.2% | 3.99 |
| 5u | 3 | 1–2 | 33.3% | 6.1–79.2 | 15.0 | -4.00 | -26.7% | 5 |
| 5.4u | 6 | 5–1 | 83.3% | 43.6–97 | 32.4 | +13.78 | +42.5% | 5.4 |
| 6u | 1 | 1–0 | 100% | 20.7–100 | 6.0 | +6.18 | +103% | 6 |

**All live:** 131 · 77–54 · 58.8% (50.2–66.8) · 413.1u · +61.82u · +15%

## A2. Same tickets by **pre-tweak** unit tier (what the sizer wanted)

Before T floor/boost and before climate/unlock shrink. This is the native size mix T saw.

| Pre tier | N | W–L | WR | Wilson | Stake (live $) | PnL (live $) | ROI | mean live u |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ≤1u | 6 | 3–3 | 50% | 18.8–81.2 | 12.0 | +0.52 | +4.3% | 2 |
| 2–3u | 101 | 61–40 | 60.4% | 50.6–69.4 | 297.0 | +55.22 | +18.6% | 2.94 |
| 4u | 11 | 6–5 | 54.5% | 28–78.7 | 43.8 | -2.88 | -6.6% | 3.98 |
| 5u | 3 | 1–2 | 33.3% | 6.1–79.2 | 15.0 | -4.00 | -26.7% | 5 |
| 5.4u | 9 | 5–4 | 55.6% | 26.7–81.1 | 39.4 | +6.78 | +17.2% | 4.38 |
| 6u | 1 | 1–0 | 100% | 20.7–100 | 6.0 | +6.18 | +103% | 6 |

## A3. Pre tier → live tier (where the tweaks moved tickets)

| Move | N | W–L | WR | Wilson | Stake | PnL | ROI | Δu vs pre |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ≤1u → 2–3u | 6 | 3–3 | 50% | 18.8–81.2 | 12.0 | +0.52 | +4.3% | +6.0 |
| 2–3u (unchanged) | 83 | 51–32 | 61.4% | 50.7–71.2 | 225.0 | +46.35 | +20.6% | -9.5 |
| 2–3u → 4u | 18 | 10–8 | 55.6% | 33.7–75.4 | 72.0 | +8.87 | +12.3% | +27.0 |
| 4u (unchanged) | 11 | 6–5 | 54.5% | 28–78.7 | 43.8 | -2.88 | -6.6% | 0 |
| 5u (unchanged) | 3 | 1–2 | 33.3% | 6.1–79.2 | 15.0 | -4.00 | -26.7% | 0 |
| 5.4u → 2–3u | 3 | 0–3 | 0% | 0–56.2 | 7.0 | -7.00 | -100% | -9.2 |
| 5.4u (unchanged) | 6 | 5–1 | 83.3% | 43.6–97 | 32.4 | +13.78 | +42.5% | 0 |
| 6u (unchanged) | 1 | 1–0 | 100% | 20.7–100 | 6.0 | +6.18 | +103% | 0 |

## A4. Live W/L by tweak (the actual Policy T / Sep 9 overlays)

Classified from `v8_steamTailAction` + live vs pre units. Stale `steamReason` stamps on HOLD tickets are ignored.

| Tweak | N | W–L | WR | Wilson | Stake | PnL | ROI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FLOOR 1→2 arriving | 6 | 3–3 | 50% | 18.8–81.2 | 12.0 | +0.52 | +4.3% |
| BOOST mid→4 arriving | 16 | 8–8 | 50% | 28–72 | 64.0 | +3.40 | +5.3% |
| HOLD as-sized mid | 74 | 47–27 | 63.5% | 52.1–73.6 | 208.0 | +51.37 | +24.7% |
| HOLD confirmed 4u | 11 | 6–5 | 54.5% | 28–78.7 | 43.8 | -2.88 | -6.6% |
| HOLD 5u always | 3 | 1–2 | 33.3% | 6.1–79.2 | 15.0 | -4.00 | -26.7% |
| HOLD confirmed fat | 7 | 6–1 | 85.7% | 48.7–97.4 | 38.4 | +19.96 | +52% |
| SHRINK climate/unlock | 12 | 4–8 | 33.3% | 13.8–60.9 | 24.0 | -12.02 | -50.1% |
| SIZE-UP other | 2 | 2–0 | 100% | 34.2–100 | 8.0 | +5.47 | +68.4% |

### Impact — what the tweak changed vs doing nothing

| Tweak | N | W–L | Live PnL | CF if no tweak | Extra $ from tweak | Extra stake |
| --- | --- | --- | --- | --- | --- | --- |
| FLOOR 1→2 (vs muted at 0u) | 6 | 3–3 | +0.52 | +0 (would not ship) | +0.52 | +12.0 |
| FLOOR 1→2 (vs shipping 1u) | 6 | 3–3 | +0.52 | +0.26 | +0.26 | +6.0 |
| BOOST mid→4 (vs native 2–3u) | 16 | 8–8 | +3.40 | +2.13 | +1.27 | +23.0 |
| SHRINK climate/unlock (vs pre size) | 12 | 4–8 | -12.02 | -23.39 | +11.37 | -18.7 |
| SIZE-UP other (2u→4u HOLD, not T BOOST) | 2 | 2–0 | +5.47 | +2.73 | +2.74 | +4.0 |

Leftover HOLD (Sep 9+) is not a size overlay — it *unmutes* arriving stubs so T can floor/boost them. Tickets leftover would have killed (`leftoverReason` set, `uPre < 4`, arriving, live):

**7 · 4–3 · 57.1% (25–84.2) · 24.0u · +5.55u · +23.1%**

```
2026-09-10  MLB  SPREAD Colorado Rockies              MINI              live    4u  pre  2.5u    127  L   -4.00  arriving_mid_4u leftover=fail_open+edge_ge10
2026-09-10  NFL  SPREAD Rams                          SUPER             live    2u  pre    3u   -104  L   -2.00  steam_confirmed leftover=tape_boost+edge_ge10
2026-09-11  MLB  ML     Arizona Diamondbacks          SHARP-LEAN        live    4u  pre    3u   -121  W   +3.31  arriving_mid_4u leftover=edge_ge10
2026-09-12  MLB  ML     Athletics                     CONFIRMED-Q1      live    4u  pre  2.5u    136  L   -4.00  arriving_mid_4u leftover=tape_boost
2026-09-12  MLB  ML     New York Mets                 CONFIRMED-Q1      live    4u  pre  2.5u    141  W   +5.64  arriving_mid_4u leftover=tape_boost
2026-09-13  MLB  ML     Texas Rangers                 MINI              live    4u  pre  2.5u    125  W   +5.00  arriving_mid_4u leftover=tape_boost+edge_ge10
2026-09-13  NFL  ML     Vikings                       CONFIRMED-UNOPP   live    2u  pre    1u   -125  W   +1.60  arriving_floor leftover=fail_open
```

## A5. Live unit tier × window

### Aug 31–Sep 8 (T live, leftover still killing arriving)
| Live tier | N | W–L | WR | Wilson | Stake | PnL | ROI | u/tix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ≤1u | 0 | — | — | — | — | — | — | — |
| 2–3u | 53 | 36–17 | 67.9% | 54.5–78.9 | 147.0 | +42.44 | +28.9% | 2.77 |
| 4u | 0 | — | — | — | — | — | — | — |
| 5u | 1 | 1–0 | 100% | 20.7–100 | 5.0 | +6.00 | +120% | 5 |
| 5.4u | 4 | 3–1 | 75% | 30.1–95.4 | 21.6 | +6.68 | +30.9% | 5.4 |
| 6u | 1 | 1–0 | 100% | 20.7–100 | 6.0 | +6.18 | +103% | 6 |

### Sep 9–15 (HOLD + bump live)
| Live tier | N | W–L | WR | Wilson | Stake | PnL | ROI | u/tix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ≤1u | 0 | — | — | — | — | — | — | — |
| 2–3u | 39 | 18–21 | 46.2% | 31.6–61.4 | 97.0 | -2.57 | -2.6% | 2.49 |
| 4u | 29 | 16–13 | 55.2% | 37.5–71.6 | 115.8 | +5.99 | +5.2% | 3.99 |
| 5u | 2 | 0–2 | 0% | 0–65.8 | 10.0 | -10.00 | -100% | 5 |
| 5.4u | 2 | 2–0 | 100% | 34.2–100 | 10.8 | +7.10 | +65.7% | 5.4 |
| 6u | 0 | — | — | — | — | — | — | — |

## A6. Live unit tier × arriving

| Cell | N | W–L | WR | Wilson | Stake | PnL | ROI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2–3u arriving | 13 | 8–5 | 61.5% | 35.5–82.3 | 31.5 | +9.57 | +30.4% |
| 2–3u not arriving | 79 | 46–33 | 58.2% | 47.2–68.5 | 212.5 | +30.30 | +14.3% |
| 4u arriving | 19 | 9–10 | 47.4% | 27.3–68.3 | 76.0 | -2.34 | -3.1% |
| 4u not arriving | 10 | 7–3 | 70% | 39.7–89.2 | 39.8 | +8.33 | +21% |
| 5u arriving | 1 | 0–1 | 0% | 0–79.3 | 5.0 | -5.00 | -100% |
| 5u not arriving | 2 | 1–1 | 50% | 9.5–90.5 | 10.0 | +1.00 | +10% |
| 5.4u arriving | 2 | 2–0 | 100% | 34.2–100 | 10.8 | +6.79 | +62.9% |
| 5.4u not arriving | 4 | 3–1 | 75% | 30.1–95.4 | 21.6 | +6.99 | +32.4% |
| 6u arriving | 0 | — | — | — | — | — | — |
| 6u not arriving | 1 | 1–0 | 100% | 20.7–100 | 6.0 | +6.18 | +103% |

## A7. Every live T-era ticket, by published tier

### 2–3u  —  92 · 54–38 · 58.7% (48.5–68.2) · 244.0u · +39.87u · +16.3%

```
2026-08-31  MLB  ML     Arizona Diamondbacks          CONFIRMED-Q1      live    2u  pre    2u    100  L   -2.00  lean_no_arriving  [HOLD as-sized mid]
2026-08-31  SOC  ML     Arsenal FC                    CONFIRMED-Q1      live    3u  pre    3u   -188  W   +1.60  HOLD  [HOLD as-sized mid]
2026-08-31  MLB  ML     Baltimore Orioles             MINI              live    3u  pre    3u   -118  W   +2.54  lean_no_arriving  [HOLD as-sized mid]
2026-08-31  SOC  ML     FC Barcelona                  CONFIRMED-Q1      live    3u  pre    3u   -752  W   +0.40  HOLD  [HOLD as-sized mid]
2026-08-31  MLB  TOTAL  Under 9.5                     RANK              live  1.5u  pre    3u   -125  W   +1.20  lean_no_arriving  [SHRINK climate/unlock]
2026-09-01  MLB  ML     Cincinnati Reds               CONFIRMED-Q1      live  2.5u  pre  2.5u    128  W   +3.20  HOLD  [HOLD as-sized mid]
2026-09-01  MLB  TOTAL  Over 8.5                      RANK              live    3u  pre    3u   -108  W   +2.78  HOLD  [HOLD as-sized mid]
2026-09-02  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      live    3u  pre    3u    113  W   +3.39  HOLD  [HOLD as-sized mid]
2026-09-02  MLB  TOTAL  Under 7.5                     CONFIRMED-Q1      live    3u  pre    3u    118  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-02  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live    3u  pre    3u   -106  W   +2.83  lean_no_arriving  [HOLD as-sized mid]
2026-09-02  MLB  TOTAL  Under 9.5                     CONFIRMED-Q1      live    3u  pre    3u   -106  L   -3.00  lean_no_arriving  [HOLD as-sized mid]
2026-09-03  MLB  ML     Los Angeles Dodgers           CONFIRMED-Q1      live    3u  pre    3u   -290  W   +1.03  lean_no_arriving  [HOLD as-sized mid]
2026-09-03  MLB  TOTAL  Over 7.5                      SUPER             live    3u  pre    3u    109  W   +3.27  lean_no_arriving  [HOLD as-sized mid]
2026-09-03  SOC  ML     Real Sociedad de Fútbol       CONFIRMED-Q1      live    3u  pre    3u   -120  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-03  MLB  ML     Texas Rangers                 DISSENT           live    2u  pre    1u    108  W   +2.16  arriving_floor  [FLOOR 1→2 arriving]
2026-09-03  MLB  TOTAL  Under 7.5                     MINI              live    3u  pre    3u   -102  W   +2.94  lean_no_arriving  [HOLD as-sized mid]
2026-09-03  MLB  TOTAL  Under 7.5                     CONFIRMED-Q1      live    3u  pre    3u   -106  W   +2.83  HOLD  [HOLD as-sized mid]
2026-09-04  MLB  ML     Cleveland Guardians           CONFIRMED-Q1      live    3u  pre    3u   -126  W   +2.38  HOLD  [HOLD as-sized mid]
2026-09-04  MLB  ML     Cleveland Guardians           RANK              live    3u  pre    3u   -128  W   +2.34  HOLD  [HOLD as-sized mid]
2026-09-04  CFB  ML     Miami (FL)                    CONFIRMED-Q1      live    2u  pre    3u  -1567  W   +0.13  HOLD  [SHRINK climate/unlock]
2026-09-04  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      live    3u  pre    3u    120  W   +3.60  HOLD  [HOLD as-sized mid]
2026-09-04  MLB  TOTAL  Over 8.5                      SHARP             live    3u  pre    3u    120  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-05  MLB  ML     Boston Red Sox                RANK              live    3u  pre    3u   -132  W   +2.27  lean_no_arriving  [HOLD as-sized mid]
2026-09-05  CFB  ML     California                    SHARP             live    2u  pre  2.5u    129  L   -2.00  HOLD  [SHRINK climate/unlock]
2026-09-05  MLB  ML     Cincinnati Reds               CONFIRMED-UNOPP   live    2u  pre    1u    138  W   +2.76  arriving_floor  [FLOOR 1→2 arriving]
2026-09-05  SOC  ML     Hull City AFC                 CONFIRMED-UNOPP   live    2u  pre    1u    338  L   -2.00  arriving_floor  [FLOOR 1→2 arriving]
2026-09-05  CFB  ML     James Madison                 CONFIRMED-Q1      live    2u  pre    3u   -203  W   +0.99  HOLD  [SHRINK climate/unlock]
2026-09-05  MLB  TOTAL  Over 7.5                      SHARP             live    3u  pre    3u    114  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-05  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      live  2.5u  pre  2.5u    124  W   +3.10  lean_no_arriving  [HOLD as-sized mid]
2026-09-05  MLB  ML     San Francisco Giants          CONFIRMED-Q1      live    2u  pre    2u    142  W   +2.84  HOLD  [HOLD as-sized mid]
2026-09-06  MLB  ML     Boston Red Sox                CONFIRMED-Q1      live    3u  pre    3u   -134  W   +2.24  HOLD  [HOLD as-sized mid]
2026-09-06  MLB  ML     Detroit Tigers                CONFIRMED-Q1      live  2.5u  pre  2.5u    141  L   -2.50  lean_no_arriving  [HOLD as-sized mid]
2026-09-06  MLB  ML     Milwaukee Brewers             CONFIRMED-Q1      live    3u  pre    3u   -146  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-06  MLB  TOTAL  Over 7.5                      SHARP             live    3u  pre    3u   -127  W   +2.36  HOLD  [HOLD as-sized mid]
2026-09-06  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      live    3u  pre    3u   -127  W   +2.36  HOLD  [HOLD as-sized mid]
2026-09-06  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      live    3u  pre    3u    107  W   +3.21  HOLD  [HOLD as-sized mid]
2026-09-06  MLB  TOTAL  Under 7.5                     CONFIRMED-Q1      live    3u  pre    3u   -117  W   +2.56  HOLD  [HOLD as-sized mid]
2026-09-07  MLB  ML     Arizona Diamondbacks          CONFIRMED-Q1      live    3u  pre    3u   -104  W   +2.88  unconfirmed_4u  [HOLD as-sized mid]
2026-09-07  MLB  TOTAL  Over 9.5                      CONFIRMED-Q1      live    3u  pre    3u    105  W   +3.15  lean_no_arriving  [HOLD as-sized mid]
2026-09-07  MLB  ML     Philadelphia Phillies         CONFIRMED-Q1      live    3u  pre    3u   -184  W   +1.63  HOLD  [HOLD as-sized mid]
2026-09-07  MLB  ML     Toronto Blue Jays             CONFIRMED-Q1      live    3u  pre    3u   -205  L   -3.00  unconfirmed_4u  [HOLD as-sized mid]
2026-09-07  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live    3u  pre    3u    113  L   -3.00  steam_confirmed  [HOLD as-sized mid]
2026-09-07  MLB  TOTAL  Under 9.5                     SHARP             live    3u  pre    3u   -117  W   +2.56  HOLD  [HOLD as-sized mid]
2026-09-07  MLB  TOTAL  Under 9.5                     CONFIRMED-Q1      live    3u  pre    3u   -100  W   +3.00  HOLD  [HOLD as-sized mid]
2026-09-08  MLB  ML     Arizona Diamondbacks          CONFIRMED-Q1      live    3u  pre    3u   -105  W   +2.86  HOLD  [HOLD as-sized mid]
2026-09-08  MLB  ML     Boston Red Sox                CONFIRMED-Q1      live    3u  pre    3u   -134  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-08  MLB  SPREAD Chicago Cubs                  CONFIRMED-Q1      live    3u  pre    3u   -105  W   +2.86  lean_no_arriving  [HOLD as-sized mid]
2026-09-08  MLB  ML     Detroit Tigers                SHARP-LEAN        live    2u  pre    2u   -130  L   -2.00  lean_no_arriving  [HOLD as-sized mid]
2026-09-08  MLB  TOTAL  Over 7.5                      SUPER             live    3u  pre    3u    106  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-08  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      live    3u  pre    3u    118  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-08  MLB  ML     Texas Rangers                 MINI              live    3u  pre    3u    119  W   +3.57  unconfirmed_4u  [HOLD as-sized mid]
2026-09-08  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live    3u  pre    3u    107  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-08  MLB  TOTAL  Under 9.5                     RANK              live    3u  pre    3u    104  W   +3.12  HOLD  [HOLD as-sized mid]
2026-09-09  MLB  ML     Los Angeles Dodgers           RANK              live    3u  pre    3u   -270  W   +1.11  lean_no_arriving  [HOLD as-sized mid]
2026-09-09  NFL  TOTAL  Over 44.5                     CONFIRMED-Q1      live    2u  pre    3u    105  L   -2.00  unconfirmed_4u  [SHRINK climate/unlock]
2026-09-09  MLB  ML     Pittsburgh Pirates            CONFIRMED-Q1      live    3u  pre    3u    115  W   +3.45  HOLD  [HOLD as-sized mid]
2026-09-09  MLB  ML     Toronto Blue Jays             CONFIRMED-Q1      live    3u  pre    3u   -160  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-09  MLB  TOTAL  Under 8.5                     SHARP-LEAN        live    2u  pre    1u   -102  L   -2.00  arriving_floor  [FLOOR 1→2 arriving]
2026-09-10  MLB  ML     Chicago White Sox             MINI              live    2u  pre    1u   -112  L   -2.00  arriving_floor  [FLOOR 1→2 arriving]
2026-09-10  MLB  TOTAL  Over 6.5                      CONFIRMED-Q1      live  1.5u  pre  1.5u    162  L   -1.50  arriving_mid_4u  [HOLD as-sized mid]
2026-09-10  NFL  SPREAD Rams                          SUPER             live    2u  pre    3u   -104  L   -2.00  steam_confirmed leftover=tape_boost+edge_ge10  [SHRINK climate/unlock]
2026-09-11  MLB  ML     Chicago White Sox             RANK              live    3u  pre    3u    102  L   -3.00  lean_no_arriving  [HOLD as-sized mid]
2026-09-11  MLB  ML     Detroit Tigers                RANK              live    3u  pre    3u   -169  W   +1.78  unconfirmed_4u  [HOLD as-sized mid]
2026-09-11  MLB  TOTAL  Over 7.5                      RANK              live    3u  pre    3u   -127  W   +2.36  HOLD  [HOLD as-sized mid]
2026-09-12  SOC  ML     Athletic Club                 RANK              live  1.5u  pre    3u   -231  L   -1.50  HOLD  [SHRINK climate/unlock]
2026-09-12  CFB  SPREAD Boise State                   RANK              live    3u  pre    3u   -108  W   +2.78  HOLD  [HOLD as-sized mid]
2026-09-12  MLB  ML     Miami Marlins                 CONFIRMED-Q1      live  2.5u  pre  2.5u    144  W   +3.60  HOLD  [HOLD as-sized mid]
2026-09-12  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      live    2u  pre    2u   -113  L   -2.00  arriving_mid_4u  [HOLD as-sized mid]
2026-09-12  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      live    2u  pre    2u    108  W   +2.16  HOLD  [HOLD as-sized mid]
2026-09-12  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      live    3u  pre    3u    116  W   +3.48  HOLD  [HOLD as-sized mid]
2026-09-12  MLB  ML     Texas Rangers                 CONFIRMED-Q1      live  2.5u  pre  2.5u    122  W   +3.05  arriving_mid_4u  [HOLD as-sized mid]
2026-09-12  MLB  ML     Toronto Blue Jays             CONFIRMED-Q1      live    3u  pre    3u   -135  W   +2.22  HOLD  [HOLD as-sized mid]
2026-09-12  CFB  TOTAL  Under 48.5                    SHARP             live    2u  pre  5.4u   -108  L   -2.00  steam_confirmed leftover=tape_boost+edge_ge10  [SHRINK climate/unlock]
2026-09-12  CFB  TOTAL  Under 51.5                    SHARP             live    3u  pre  5.4u   -122  L   -3.00  steam_confirmed leftover=tape_boost+edge_ge10  [SHRINK climate/unlock]
2026-09-12  CFB  TOTAL  Under 54.5                    SHARP             live    2u  pre  5.4u   -123  L   -2.00  steam_confirmed leftover=tape_boost+edge_ge10  [SHRINK climate/unlock]
2026-09-13  MLB  ML     Athletics                     CONFIRMED-Q1      live    3u  pre    3u    116  W   +3.48  arriving_mid_4u  [HOLD as-sized mid]
2026-09-13  NFL  SPREAD Bills                         CONFIRMED-Q1      live    2u  pre    3u    108  W   +2.16  lean_no_arriving  [SHRINK climate/unlock]
2026-09-13  MLB  ML     Chicago White Sox             RANK              live    3u  pre    3u   -105  L   -3.00  lean_no_arriving  [HOLD as-sized mid]
2026-09-13  NFL  ML     Cowboys                       CONFIRMED-Q1      live    3u  pre    3u   -166  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-13  NFL  SPREAD Eagles                        CONFIRMED-Q1      live    2u  pre    3u   -107  L   -2.00  HOLD  [SHRINK climate/unlock]
2026-09-13  MLB  TOTAL  Over 8.5                      MINI              live    3u  pre    3u    104  W   +3.12  HOLD  [HOLD as-sized mid]
2026-09-13  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live  2.5u  pre  2.5u    122  L   -2.50  lean_no_arriving  [HOLD as-sized mid]
2026-09-13  NFL  ML     Vikings                       CONFIRMED-UNOPP   live    2u  pre    1u   -125  W   +1.60  arriving_floor leftover=fail_open  [FLOOR 1→2 arriving]
2026-09-14  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live    2u  pre    2u   -133  W   +1.50  steam_confirmed  [HOLD as-sized mid]
2026-09-14  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live    3u  pre    3u   -105  L   -3.00  steam_confirmed  [HOLD as-sized mid]
2026-09-14  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live    3u  pre    3u   -129  L   -3.00  steam_confirmed  [HOLD as-sized mid]
2026-09-15  MLB  TOTAL  Over 6.5                      CONFIRMED-Q1      live    3u  pre    3u    108  L   -3.00  HOLD  [HOLD as-sized mid]
2026-09-15  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      live    3u  pre    3u    117  W   +3.51  HOLD  [HOLD as-sized mid]
2026-09-15  MLB  TOTAL  Over 8.5                      MINI              live    3u  pre    3u   -103  W   +2.91  lean_no_arriving  [HOLD as-sized mid]
2026-09-15  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      live    2u  pre    2u    108  W   +2.16  HOLD  [HOLD as-sized mid]
2026-09-15  MLB  ML     Pittsburgh Pirates            CONFIRMED-Q1      live  1.5u  pre  1.5u    197  L   -1.50  HOLD  [HOLD as-sized mid]
2026-09-15  MLB  TOTAL  Under 11.5                    CONFIRMED-Q1      live    2u  pre    2u   -111  L   -2.00  HOLD  [HOLD as-sized mid]
```

### 4u  —  29 · 16–13 · 55.2% (37.5–71.6) · 115.8u · +5.99u · +5.2%

```
2026-09-10  MLB  SPREAD Colorado Rockies              MINI              live    4u  pre  2.5u    127  L   -4.00  arriving_mid_4u leftover=fail_open+edge_ge10  [BOOST mid→4 arriving]
2026-09-10  MLB  TOTAL  Under 8.5                     MINI              live    4u  pre    4u    105  L   -4.00  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-11  MLB  ML     Arizona Diamondbacks          SHARP-LEAN        live    4u  pre    3u   -121  W   +3.31  arriving_mid_4u leftover=edge_ge10  [BOOST mid→4 arriving]
2026-09-11  MLB  ML     Chicago Cubs                  SHARP-LEAN        live    4u  pre    2u   -171  W   +2.34  lean_no_arriving  [SIZE-UP other]
2026-09-11  CFB  SPREAD Kansas                        SHARP-LEAN        live    4u  pre    4u   -104  L   -4.00  steam_confirmed leftover=fail_open+edge_ge10  [HOLD confirmed 4u]
2026-09-11  CFB  SPREAD Rutgers                       RANK              live    4u  pre    4u   -134  L   -4.00  steam_confirmed  [HOLD confirmed 4u]
2026-09-11  MLB  TOTAL  Under 7.5                     CONFIRMED-Q1      live    4u  pre  2.5u    127  L   -4.00  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-11  MLB  TOTAL  Under 7.5                     MINI              live    4u  pre    4u    108  L   -4.00  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-11  MLB  TOTAL  Under 8.5                     CONFIRMED-Q1      live    4u  pre    2u   -128  W   +3.13  HOLD  [SIZE-UP other]
2026-09-12  MLB  ML     Athletics                     CONFIRMED-Q1      live    4u  pre  2.5u    136  L   -4.00  arriving_mid_4u leftover=tape_boost  [BOOST mid→4 arriving]
2026-09-12  MLB  ML     Boston Red Sox                CONFIRMED-Q1      live    4u  pre    4u   -225  W   +1.78  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-12  UFC  ML     Curtis Blaydes                CONFIRMED-Q1      live    4u  pre  1.5u    160  W   +6.40  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-12  MLB  ML     New York Mets                 CONFIRMED-Q1      live    4u  pre  2.5u    141  W   +5.64  arriving_mid_4u leftover=tape_boost  [BOOST mid→4 arriving]
2026-09-12  MLB  TOTAL  Under 9.5                     CONFIRMED-Q1      live    4u  pre    4u   -138  W   +2.90  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-12  MLB  ML     Washington Nationals          MINI              live    4u  pre    4u   -120  W   +3.33  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-13  MLB  SPREAD Athletics                     CONFIRMED-Q1      live    4u  pre    4u   -127  W   +3.15  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-13  MLB  ML     Chicago Cubs                  CONFIRMED-Q1      live    4u  pre    2u   -162  L   -4.00  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-13  MLB  SPREAD Detroit Tigers                CONFIRMED-Q1      live    4u  pre  2.5u    138  W   +5.52  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-13  MLB  TOTAL  Over 6.5                      CONFIRMED-Q1      live    4u  pre    4u   -116  W   +3.45  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-13  MLB  ML     Texas Rangers                 MINI              live    4u  pre  2.5u    125  W   +5.00  arriving_mid_4u leftover=tape_boost+edge_ge10  [BOOST mid→4 arriving]
2026-09-14  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      live    4u  pre    3u   -125  W   +3.20  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-14  MLB  ML     San Diego Padres              CONFIRMED-Q1      live    4u  pre    4u   -177  W   +2.26  steam_confirmed leftover=edge_ge10  [HOLD confirmed 4u]
2026-09-14  MLB  TOTAL  Under 10.5                    CONFIRMED-Q1      live 3.75u  pre 3.75u   -110  L   -3.75  steam_confirmed  [HOLD confirmed 4u]
2026-09-14  NFL  TOTAL  Under 43.5                    CONFIRMED-Q1      live    4u  pre    3u   -108  W   +3.70  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-15  MLB  ML     Cleveland Guardians           CONFIRMED-Q1      live    4u  pre    3u   -152  W   +2.63  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-15  MLB  SPREAD Cleveland Guardians           CONFIRMED-Q1      live    4u  pre  1.5u    158  L   -4.00  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-15  MLB  TOTAL  Over 7.5                      MINI              live    4u  pre    3u   -122  L   -4.00  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-15  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      live    4u  pre    3u    118  L   -4.00  arriving_mid_4u  [BOOST mid→4 arriving]
2026-09-15  MLB  SPREAD Pittsburgh Pirates            CONFIRMED-Q1      live    4u  pre    3u    114  L   -4.00  arriving_mid_4u  [BOOST mid→4 arriving]
```

### 5u  —  3 · 1–2 · 33.3% (6.1–79.2) · 15.0u · -4.00u · -26.7%

```
2026-09-04  MLB  TOTAL  Over 11.5                     RANK              live    5u  pre    5u    120  W   +6.00  lean_no_arriving leftover=edge_ge10  [HOLD 5u always]
2026-09-13  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      live    5u  pre    5u   -129  L   -5.00  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD 5u always]
2026-09-13  MLB  TOTAL  Under 9.5                     CONFIRMED-Q1      live    5u  pre    5u   -100  L   -5.00  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD 5u always]
```

### 5.4u  —  6 · 5–1 · 83.3% (43.6–97) · 32.4u · +13.78u · +42.5%

```
2026-09-01  MLB  SPREAD Washington Nationals          SHARP             live  5.4u  pre  5.4u   -116  W   +4.66  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD confirmed fat]
2026-09-02  MLB  TOTAL  Under 9.5                     SHARP             live  5.4u  pre  5.4u   -116  W   +4.66  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD confirmed fat]
2026-09-04  SOC  ML     Real Madrid CF                SHARP             live  5.4u  pre  5.4u   -210  L   -5.40  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD confirmed fat]
2026-09-05  UFC  ML     Felipe Lima                   SHARP             live  5.4u  pre  5.4u   -196  W   +2.76  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD confirmed fat]
2026-09-12  MLB  ML     San Diego Padres              MINI              live  5.4u  pre  5.4u   -176  W   +3.07  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD confirmed fat]
2026-09-13  MLB  ML     Washington Nationals          SHARP             live  5.4u  pre  5.4u   -134  W   +4.03  steam_confirmed leftover=tape_boost+edge_ge10  [HOLD confirmed fat]
```

### 6u  —  1 · 1–0 · 100% (20.7–100) · 6.0u · +6.18u · +103%

```
2026-09-01  MLB  TOTAL  Over 7.5                      SUPER             live    6u  pre    6u    103  W   +6.18  steam_confirmed leftover=edge_ge10  [HOLD confirmed fat]
```

---

# B. Policy mutes — separate book (counterfactual at pre-policy units)

These tickets graded 0u. CF sizes them at `v8_unitsPre*` so T cannot hide what it cut. Positive CF = left on the table.

Muted T-era: **604 · 301–303 · 49.8% (45.9–53.8) · 1049.3u · -68.68u · -6.5%** · 37.75/day vs live 8.19/day.

## B1. Every policy mute, T-era

| mutedBy | Family | N | W–L | WR | Wilson | Stake CF | PnL CF | ROI |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| steam-tail | Policy T | 131 | 69–62 | 52.7% | 44.2–61 | 247.3 | -2.80 | -1.1% |
| believed-cut | Leftover | 47 | 22–25 | 46.8% | 33.3–60.8 | 80.5 | -1.88 | -2.3% |
| fail-open-sub4 | Leftover | 11 | 10–1 | 90.9% | 62.3–98.4 | 14.0 | +8.11 | +57.9% |
| maxsr-sub4 | Other overlay | 59 | 32–27 | 54.2% | 41.7–66.3 | 90.5 | +11.84 | +13.1% |
| tape-weak | Other overlay | 61 | 33–28 | 54.1% | 41.7–66 | 95.5 | +1.01 | +1.1% |
| qconv-q1 | Other overlay | 27 | 14–13 | 51.9% | 34–69.3 | 36.4 | +0.06 | +0.2% |
| fools-gold-flat | Other overlay | 25 | 10–15 | 40% | 23.4–59.3 | 84.9 | -27.56 | -32.5% |
| winner_align_fade | Other overlay | 29 | 14–15 | 48.3% | 31.4–65.6 | 47.8 | +9.85 | +20.6% |
| ags-quality-veto | Other overlay | 40 | 22–18 | 55% | 39.8–69.3 | 71.4 | -13.82 | -19.4% |
| top-crowded | Other overlay | 20 | 14–6 | 70% | 48.1–85.5 | 43.7 | +6.65 | +15.2% |
| ev-drift-edge | Other overlay | 8 | 3–5 | 37.5% | 13.7–69.4 | 40.0 | -18.20 | -45.5% |
| ev-lt2-no-steam | Other overlay | 10 | 3–7 | 30% | 10.8–60.3 | 27.0 | -13.00 | -48.1% |
| fav-juice | Other overlay | 8 | 6–2 | 75% | 40.9–92.9 | 28.8 | -2.99 | -10.4% |
| (none) | Unlabeled 0u (mostly MONITORING) | 128 | 49–79 | 38.3% | 30.3–46.9 | 141.5 | -25.97 | -18.4% |

**All mutes:** 604 · 301–303 · 49.8% (45.9–53.8) · 1049.3u · -68.68u · -6.5%

## B2. Policy T steam-tail mutes by reason

| Reason | N | W–L | WR | Wilson | Stake CF | PnL CF | ROI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| lean_no_arriving | 99 | 51–48 | 51.5% | 41.8–61.1 | 99.0 | +0.54 | +0.5% |
| unconfirmed_4u | 18 | 9–9 | 50% | 29–71 | 72.1 | -11.96 | -16.6% |
| unconfirmed_fat | 14 | 9–5 | 64.3% | 38.8–83.7 | 76.2 | +8.62 | +11.3% |
| **all steam-tail** | 131 | 69–62 | 52.7% | 44.2–61 | 247.3 | -2.80 | -1.1% |

### Split by window

| Cell | N | W–L | WR | Wilson | Stake CF | PnL CF | ROI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aug 31–Sep 8 · lean_no_arriving | 67 | 36–31 | 53.7% | 41.9–65.1 | 67.0 | +3.81 | +5.7% |
| Aug 31–Sep 8 · unconfirmed_4u | 11 | 6–5 | 54.5% | 28–78.7 | 44.0 | -3.97 | -9% |
| Aug 31–Sep 8 · unconfirmed_fat | 5 | 5–0 | 100% | 56.6–100 | 27.6 | +23.21 | +84.1% |
| Sep 9–15 · lean_no_arriving | 32 | 15–17 | 46.9% | 30.9–63.6 | 32.0 | -3.27 | -10.2% |
| Sep 9–15 · unconfirmed_4u | 7 | 3–4 | 42.9% | 15.8–75 | 28.1 | -7.99 | -28.4% |
| Sep 9–15 · unconfirmed_fat | 9 | 4–5 | 44.4% | 18.9–73.3 | 48.6 | -14.59 | -30% |

### `lean_no_arriving` — every muted 1u

**99 · 51–48 · 51.5% (41.8–61.1) · 99.0u · +0.54u · +0.5%**

```
2026-08-31  MLB  ML     Milwaukee Brewers             CONFIRMED         pre    1u   -103  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-08-31  MLB  TOTAL  Under 10.5                    CONFIRMED-UNOPP   pre    1u    170  W CF   +1.70  steam-tail lean_no_arriving  ab_no_steam
2026-08-31  MLB  TOTAL  Over 7.5                      CONFIRMED-UNOPP   pre    1u    106  W CF   +1.06  steam-tail lean_no_arriving  ab_no_steam
2026-08-31  MLB  TOTAL  Over 8.5                      CONFIRMED-UNOPP   pre    1u    109  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-08-31  MLB  TOTAL  Over 8.5                      SHARP-LEAN        pre    1u   -108  W CF   +0.93  steam-tail lean_no_arriving  ab_already_on
2026-09-01  MLB  ML     Arizona Diamondbacks          CONFIRMED-UNOPP   pre    1u    118  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-01  MLB  ML     Boston Red Sox                SHARP-LEAN        pre    1u   -114  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-01  MLB  ML     Cleveland Guardians           CONFIRMED-UNOPP   pre    1u   -179  W CF   +0.56  steam-tail lean_no_arriving  ab_no_steam
2026-09-01  MLB  SPREAD Texas Rangers                 CONFIRMED-UNOPP   pre    1u    113  W CF   +1.13  steam-tail lean_no_arriving  ab_already_on
2026-09-01  MLB  TOTAL  Under 10.5                    CONFIRMED-UNOPP   pre    1u   -117  W CF   +0.85  steam-tail lean_no_arriving  ab_no_steam
2026-09-01  MLB  TOTAL  Over 10.5                     SUPER             pre    1u   -116  W CF   +0.86  steam-tail lean_no_arriving  ab_no_steam
2026-09-01  MLB  TOTAL  Over 7.5                      MINI              pre    1u   -104  W CF   +0.96  steam-tail lean_no_arriving  ab_no_steam
2026-09-01  MLB  TOTAL  Over 9.5                      MINI              pre    1u    110  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-01  MLB  TOTAL  Under 8.5                     MINI              pre    1u    156  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  ML     Milwaukee Brewers             CONFIRMED         pre    1u   -142  W CF   +0.70  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  ML     Cleveland Guardians           MINI              pre    1u    121  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  SPREAD Colorado Rockies              CONFIRMED-UNOPP   pre    1u    104  W CF   +1.04  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  SPREAD Miami Marlins                 MINI              pre    1u    170  W CF   +1.70  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  SPREAD Arizona Diamondbacks          MINI              pre    1u   -142  W CF   +0.70  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  SPREAD St. Louis Cardinals           MINI              pre    1u    123  W CF   +1.23  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  TOTAL  Over 11.5                     SHARP-LEAN        pre    1u    113  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  TOTAL  Over 8.5                      MINI              pre    1u   -104  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  TOTAL  Over 8.5                      MINI              pre    1u   -109  W CF   +0.92  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  TOTAL  Under 7.5                     MINI              pre    1u    117  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-02  MLB  TOTAL  Under 6.5                     CONFIRMED-UNOPP   pre    1u    108  L CF   -1.00  steam-tail lean_no_arriving  ab_already_on
2026-09-03  MLB  ML     Chicago White Sox             SHARP-LEAN        pre    1u    138  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-03  MLB  ML     Miami Marlins                 MINI              pre    1u    110  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-03  MLB  SPREAD Pittsburgh Pirates            MINI              pre    1u    150  W CF   +1.50  steam-tail lean_no_arriving  ab_no_steam
2026-09-03  MLB  TOTAL  Over 9.5                      SHARP-LEAN        pre    1u    122  W CF   +1.22  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  MLB  ML     Atlanta Braves                DISSENT           pre    1u    103  W CF   +1.03  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  SOC  ML     Liverpool FC                  CONFIRMED-UNOPP   pre    1u   -165  W CF   +0.61  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  CFB  SPREAD Miami (FL)                    CONFIRMED-UNOPP   pre    1u   -185  W CF   +0.54  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  MLB  SPREAD Miami Marlins                 MINI              pre    1u   -127  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  MLB  SPREAD San Francisco Giants          MINI              pre    1u   -122  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  MLB  TOTAL  Under 6.5                     DISSENT           pre    1u    122  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  MLB  TOTAL  Under 8.5                     DISSENT           pre    1u    112  W CF   +1.12  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  MLB  TOTAL  Under 6.5                     MINI              pre    1u    156  W CF   +1.56  steam-tail lean_no_arriving  ab_no_steam
2026-09-04  MLB  TOTAL  Under 9.5                     MINI              pre    1u    113  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  MLB  ML     Atlanta Braves                CONFIRMED-UNOPP   pre    1u    149  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  MLB  ML     Chicago Cubs                  CONFIRMED-UNOPP   pre    1u   -118  W CF   +0.85  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  MLB  ML     Los Angeles Dodgers           SUPER             pre    1u   -183  W CF   +0.55  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  UFC  ML     Daniil Donchenko              CONFIRMED-UNOPP   pre    1u   -206  W CF   +0.49  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  CFB  SPREAD LSU                           CONFIRMED-UNOPP   pre    1u   -108  W CF   +0.93  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  MLB  SPREAD Seattle Mariners              MINI              pre    1u    117  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  MLB  TOTAL  Under 8.5                     MINI              pre    1u   -104  W CF   +0.96  steam-tail lean_no_arriving  ab_no_steam
2026-09-05  MLB  TOTAL  Over 9.5                      MINI              pre    1u   -133  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-06  CFB  ML     Ole Miss                      CONFIRMED-UNOPP   pre    1u   -227  W CF   +0.44  steam-tail lean_no_arriving  ab_no_steam
2026-09-06  CFB  ML     Washington State              CONFIRMED-UNOPP   pre    1u  -1567  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-06  MLB  ML     Tampa Bay Rays                SHARP-LEAN        pre    1u   -104  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-06  SOC  ML     FC Barcelona                  CONFIRMED         pre    1u   -328  W CF   +0.30  steam-tail lean_no_arriving  ab_already_on
2026-09-06  SOC  ML     Manchester United FC          CONFIRMED-UNOPP   pre    1u   -105  L CF   -1.00  steam-tail lean_no_arriving  ab_already_on
2026-09-06  MLB  SPREAD Milwaukee Brewers             MINI              pre    1u    111  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-06  MLB  SPREAD St. Louis Cardinals           MINI              pre    1u    122  W CF   +1.22  steam-tail lean_no_arriving  ab_no_steam
2026-09-06  MLB  TOTAL  Over 7.5                      MINI              pre    1u    124  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-06  MLB  TOTAL  Over 8.5                      MINI              pre    1u    111  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-07  CFB  SPREAD Florida State                 MINI              pre    1u    111  L CF   -1.00  steam-tail lean_no_arriving  ab_already_on
2026-09-07  MLB  SPREAD Cincinnati Reds               MINI              pre    1u    129  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-07  MLB  TOTAL  Under 7.5                     DISSENT           pre    1u    108  W CF   +1.08  steam-tail lean_no_arriving  ab_no_steam
2026-09-07  MLB  TOTAL  Over 8.5                      MINI              pre    1u    104  W CF   +1.04  steam-tail lean_no_arriving  ab_no_steam
2026-09-08  MLB  ML     Los Angeles Dodgers           SHARP-LEAN        pre    1u   -278  W CF   +0.36  steam-tail lean_no_arriving  ab_no_steam
2026-09-08  MLB  ML     Miami Marlins                 SHARP-LEAN        pre    1u   -109  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-08  MLB  SPREAD Los Angeles Dodgers           MINI              pre    1u    122  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-08  MLB  TOTAL  Over 8.5                      MINI              pre    1u    122  W CF   +1.22  steam-tail lean_no_arriving  ab_no_steam
2026-09-08  MLB  TOTAL  Under 8.5                     MINI              pre    1u    103  W CF   +1.03  steam-tail lean_no_arriving  ab_no_steam
2026-09-08  MLB  TOTAL  Over 8.5                      MINI              pre    1u    104  W CF   +1.04  steam-tail lean_no_arriving  ab_no_steam
2026-09-08  MLB  TOTAL  Under 9.5                     SHARP-LEAN        pre    1u    138  W CF   +1.38  steam-tail lean_no_arriving  ab_already_on
2026-09-08  MLB  TOTAL  Under 7.5                     CONFIRMED-UNOPP   pre    1u    117  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-09  MLB  ML     Washington Nationals          MINI              pre    1u    165  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-09  MLB  SPREAD Detroit Tigers                MINI              pre    1u   -285  W CF   +0.35  steam-tail lean_no_arriving  ab_no_steam
2026-09-09  MLB  SPREAD St. Louis Cardinals           MINI              pre    1u    148  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-09  MLB  TOTAL  Over 8.5                      SHARP-LEAN        pre    1u    115  W CF   +1.15  steam-tail lean_no_arriving  ab_no_steam
2026-09-09  MLB  TOTAL  Under 8.5                     SHARP-LEAN        pre    1u    120  W CF   +1.20  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  CFB  ML     Missouri                      CONFIRMED-UNOPP   pre    1u   -197  W CF   +0.51  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  MLB  ML     Cleveland Guardians           SHARP-LEAN        pre    1u   -116  W CF   +0.86  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  MLB  ML     Los Angeles Dodgers           CONFIRMED-UNOPP   pre    1u   -190  W CF   +0.53  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  MLB  ML     Atlanta Braves                CONFIRMED-UNOPP   pre    1u   -170  W CF   +0.59  steam-tail lean_no_arriving  ab_already_on
2026-09-11  MLB  SPREAD Cleveland Guardians           MINI              pre    1u    156  W CF   +1.56  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  MLB  SPREAD Atlanta Braves                SHARP-LEAN        pre    1u   -270  W CF   +0.37  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  MLB  SPREAD San Francisco Giants          SHARP-LEAN        pre    1u   -127  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  MLB  TOTAL  Over 7.5                      MINI              pre    1u   -100  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-11  MLB  TOTAL  Under 10.5                    SUPER             pre    1u   -114  L CF   -1.00  steam-tail lean_no_arriving  ab_already_on
2026-09-11  MLB  TOTAL  Under 9.5                     SHARP-LEAN        pre    1u   -133  L CF   -1.00  steam-tail lean_no_arriving  ab_already_on
2026-09-12  MLB  ML     Cleveland Guardians           SHARP-LEAN        pre    1u   -100  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-12  SOC  ML     Arsenal FC                    CONFIRMED-UNOPP   pre    1u   -160  W CF   +0.63  steam-tail lean_no_arriving  ab_no_steam
2026-09-12  SOC  ML     Tottenham Hotspur FC          CONFIRMED-UNOPP   pre    1u    100  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-12  SOC  ML     Chelsea FC                    CONFIRMED-UNOPP   pre    1u   -450  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-12  SOC  ML     Aston Villa FC                CONFIRMED-UNOPP   pre    1u    128  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  MLB  ML     Cincinnati Reds               CONFIRMED-UNOPP   pre    1u    177  W CF   +1.77  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  MLB  ML     Philadelphia Phillies         SHARP-LEAN        pre    1u    110  W CF   +1.10  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  SOC  ML     Brighton & Hove Albion FC     CONFIRMED-UNOPP   pre    1u   -108  W CF   +0.93  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  MLB  SPREAD Chicago White Sox             MINI              pre    1u    144  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  NFL  SPREAD Colts                         CONFIRMED-UNOPP   pre    1u   -117  L CF   -1.00  steam-tail lean_no_arriving  ab_already_on
2026-09-13  MLB  TOTAL  Over 8.5                      MINI              pre    1u    127  W CF   +1.27  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  MLB  TOTAL  Under 6.5                     CONFIRMED-UNOPP   pre    1u   -108  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  NFL  TOTAL  Over 48.5                     CONFIRMED-UNOPP   pre    1u    116  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  NFL  TOTAL  Over 49.5                     CONFIRMED-UNOPP   pre    1u   -108  W CF   +0.93  steam-tail lean_no_arriving  ab_no_steam
2026-09-13  NFL  TOTAL  Under 44.5                    CONFIRMED-UNOPP   pre    1u   -117  L CF   -1.00  steam-tail lean_no_arriving  ab_already_on
2026-09-15  MLB  ML     Seattle Mariners              CONFIRMED-UNOPP   pre    1u   -169  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
2026-09-15  MLB  SPREAD Cincinnati Reds               MINI-             pre    1u    133  L CF   -1.00  steam-tail lean_no_arriving  ab_no_steam
```

### `unconfirmed_4u` — every muted 4u

**18 · 9–9 · 50% (29–71) · 72.1u · -11.96u · -16.6%**

```
2026-08-31  MLB  ML     Miami Marlins                 SHARP-LEAN        pre    4u   -110  L CF   -4.00  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-01  MLB  ML     Colorado Rockies              RANK              pre    4u    127  W CF   +5.08  steam-tail unconfirmed_4u  ab_no_steam  plus_native4
2026-09-01  MLB  ML     New York Yankees              RANK              pre    4u   -172  W CF   +2.33  steam-tail unconfirmed_4u  ab_no_steam
2026-09-02  MLB  TOTAL  Under 8.5                     TOP               pre    4u    103  L CF   -4.00  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-05  UFC  ML     Michael Aljarouj              SHARP-LEAN        pre    4u   -109  L CF   -4.00  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-07  CFB  ML     SMU                           CONFIRMED-Q1      pre    4u   -142  W CF   +2.82  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-07  MLB  ML     Miami Marlins                 SHARP-LEAN        pre    4u   -135  L CF   -4.00  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-08  MLB  ML     Toronto Blue Jays             SHARP-LEAN        pre    4u   -170  W CF   +2.35  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-08  MLB  ML     San Diego Padres              CONFIRMED-Q1      pre    4u   -177  W CF   +2.26  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-08  MLB  SPREAD Toronto Blue Jays             SHARP-LEAN        pre    4u   -335  W CF   +1.19  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-08  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      pre    4u    104  L CF   -4.00  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-09  MLB  ML     Minnesota Twins               CONFIRMED-Q1      pre    4u    114  L CF   -4.00  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-09  MLB  ML     St. Louis Cardinals           SHARP-LEAN        pre    4u   -111  L CF   -4.00  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-09  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      pre    4u   -100  W CF   +4.00  steam-tail unconfirmed_4u  ab_no_steam  tape_boost
2026-09-12  MLB  ML     Tampa Bay Rays                CONFIRMED-Q1      pre    4u   -133  W CF   +3.01  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-12  UFC  ML     Tommy Gantt                   SHARP-LEAN        pre    4u   -362  W CF   +1.10  steam-tail unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-12  MLB  TOTAL  Over 8.5                      CONFIRMED-Q1      pre 4.05u   -107  L CF   -4.05  steam-tail unconfirmed_4u  ab_no_steam  tape_boost
2026-09-14  MLB  ML     Minnesota Twins               CONFIRMED-Q1      pre 4.05u    115  L CF   -4.05  steam-tail unconfirmed_4u  ab_no_steam  tape_boost
```

### `unconfirmed_fat` — every muted 5.4u+

**14 · 9–5 · 64.3% (38.8–83.7) · 76.2u · +8.62u · +11.3%**

```
2026-09-04  MLB  TOTAL  Over 7.5                      RANK              pre  5.4u    110  W CF   +5.94  steam-tail unconfirmed_fat  ab_no_steam  tape_boost
2026-09-04  MLB  TOTAL  Over 8.5                      SUPER             pre    6u   -112  W CF   +5.36  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-05  UFC  ML     Delphine Benouaich            SHARP             pre  5.4u   -132  W CF   +4.09  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-05  UFC  ML     Kurtis Campbell               MINI-             pre  5.4u   -358  W CF   +1.51  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-06  MLB  SPREAD Los Angeles Dodgers           SHARP-LEAN        pre  5.4u    117  W CF   +6.32  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-11  CFB  SPREAD Virginia                      SHARP             pre  5.4u   -134  W CF   +4.03  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-12  SOC  ML     Liverpool FC                  SHARP-LEAN        pre  5.4u   -186  L CF   -5.40  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-12  SOC  ML     Real Madrid CF                SHARP-LEAN        pre  5.4u   -625  W CF   +0.86  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-12  UFC  ML     Édgar Cháirez                 TOP               pre  5.4u   -179  L CF   -5.40  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-12  UFC  ML     Rongzhu                       SHARP             pre  5.4u   -155  W CF   +3.48  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-12  CFB  SPREAD Vanderbilt                    SHARP-LEAN        pre  5.4u   -113  L CF   -5.40  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-13  NFL  TOTAL  Under 47.5                    SHARP             pre  5.4u   -112  L CF   -5.40  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-14  MLB  ML     Chicago Cubs                  TOP               pre  5.4u   -134  W CF   +4.03  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-14  MLB  ML     Toronto Blue Jays             MINI              pre  5.4u   -124  L CF   -5.40  steam-tail unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
```

## B3. Leftover mutes (`believed-cut` / `fail-open-sub4`)

| Cell | N | W–L | WR | Wilson | Stake CF | PnL CF | ROI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| believed-cut all | 47 | 22–25 | 46.8% | 33.3–60.8 | 80.5 | -1.88 | -2.3% |
|   · no steam | 40 | 19–21 | 47.5% | 32.9–62.5 | 66.5 | -1.81 | -2.7% |
|   · A/B already-on | 3 | 0–3 | 0% | 0–56.2 | 6.5 | -6.50 | -100% |
|   · A/B arriving (HOLD leak) | 3 | 3–0 | 100% | 43.8–100 | 6.5 | +7.42 | +114.2% |
| fail-open-sub4 all | 11 | 10–1 | 90.9% | 62.3–98.4 | 14.0 | +8.11 | +57.9% |
|   · T would still mute (1u) | 9 | 9–0 | 100% | 70.1–100 | 9.0 | +7.55 | +83.9% |
|   · T would ship (2–3u / floor) | 2 | 1–1 | 50% | 9.5–90.5 | 5.0 | +0.56 | +11.3% |
| **leftover all** | 58 | 32–26 | 55.2% | 42.5–67.3 | 94.5 | +6.23 | +6.6% |

### Every leftover mute

```
2026-08-31  MLB  TOTAL  Over 9.5                      SHARP-LEAN        pre    1u    170  W CF   +1.70  believed-cut  ab_no_steam  tape_boost
2026-08-31  MLB  TOTAL  Over 8.5                      DISSENT           pre    1u   -108  W CF   +0.93  fail-open-sub4  no_steam  fail_open
2026-09-01  MLB  ML     Kansas City Royals            SHARP             pre    3u   -107  L CF   -3.00  believed-cut unconfirmed_fat  ab_no_steam  tape_boost
2026-09-01  MLB  ML     San Francisco Giants          TOP               pre  1.5u    156  L CF   -1.50  believed-cut  ab_no_steam  plus_native4
2026-09-01  MLB  TOTAL  Under 7.5                     MINI              pre    3u    112  L CF   -3.00  believed-cut  ab_no_steam  edge_ge10
2026-09-02  MLB  SPREAD New York Yankees              TOP               pre    1u    123  W CF   +1.23  believed-cut lean_no_arriving  ab_no_steam  plus_native4
2026-09-04  MLB  ML     Miami Marlins                 SHARP             pre  1.5u    153  L CF   -1.50  believed-cut  ab_no_steam  tape_boost+edge_ge10
2026-09-04  MLB  ML     Tampa Bay Rays                MINI              pre    3u    106  W CF   +3.18  believed-cut unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-04  MLB  ML     Los Angeles Dodgers           SUPER             pre    1u   -270  W CF   +0.37  believed-cut  ab_no_steam  tape_boost
2026-09-04  CFB  TOTAL  Over 47.5                     CONFIRMED-UNOPP   pre    1u   -104  W CF   +0.96  believed-cut  no_steam  edge_ge10
2026-09-04  MLB  SPREAD Milwaukee Brewers             DISSENT           pre    1u    102  W CF   +1.02  fail-open-sub4  no_steam  fail_open
2026-09-04  CFB  TOTAL  Under 59.5                    FADE              pre    2u   -117  L CF   -2.00  fail-open-sub4  ab_already_on  fail_open
2026-09-05  CFB  ML     Baylor                        CONFIRMED-UNOPP   pre    1u    257  L CF   -1.00  believed-cut  no_steam  edge_ge10
2026-09-05  CFB  ML     Hawai'i                       CONFIRMED-UNOPP   pre    1u    135  L CF   -1.00  believed-cut lean_no_arriving  ab_no_steam  tape_boost+edge_ge10
2026-09-05  MLB  ML     Detroit Tigers                SHARP-LEAN        pre    1u    148  W CF   +1.48  believed-cut lean_no_arriving  ab_no_steam  tape_boost
2026-09-05  SOC  ML     Club Atlético de Madrid       RANK              pre  1.5u    155  L CF   -1.50  believed-cut  ab_no_steam  plus_native4
2026-09-05  UFC  ML     Ryan Spann                    SHARP             pre    1u    335  L CF   -1.00  believed-cut  ab_no_steam  tape_boost+edge_ge10
2026-09-05  CFB  SPREAD Baylor                        CONFIRMED-UNOPP   pre    1u   -117  W CF   +0.85  believed-cut  ab_arriving  edge_ge10
2026-09-05  CFB  SPREAD Duke                          CONFIRMED-UNOPP   pre    1u   -156  W CF   +0.64  believed-cut  no_steam  edge_ge10
2026-09-05  MLB  TOTAL  Over 8.5                      RANK              pre  2.5u    127  L CF   -2.50  believed-cut lean_no_arriving  ab_no_steam  plus_native4
2026-09-05  CFB  ML     Duke                          CONFIRMED-UNOPP   pre    1u   -285  W CF   +0.35  fail-open-sub4  ab_no_steam  fail_open
2026-09-05  CFB  SPREAD Iowa                          MINI-             pre    1u   -100  W CF   +1.00  fail-open-sub4  ab_no_steam  fail_open
2026-09-05  CFB  TOTAL  Under 58.5                    CONFIRMED-UNOPP   pre    1u    105  W CF   +1.05  fail-open-sub4  steam_no_ab  fail_open
2026-09-06  MLB  ML     Athletics                     SHARP             pre  1.5u    180  L CF   -1.50  believed-cut  ab_no_steam  tape_boost+edge_ge10
2026-09-06  SOC  ML     RCD Espanyol de Barcelona     SHARP-LEAN        pre  2.5u    138  L CF   -2.50  believed-cut  ab_no_steam  edge_ge10
2026-09-06  CFB  TOTAL  Under 54.5                    CONFIRMED-UNOPP   pre    1u    104  L CF   -1.00  believed-cut  steam_no_ab  edge_ge10
2026-09-06  MLB  TOTAL  Under 6.5                     SHARP-LEAN        pre  2.5u    138  W CF   +3.45  believed-cut  ab_arriving  edge_ge10
2026-09-07  MLB  ML     Boston Red Sox                CONFIRMED-UNOPP   pre    1u   -162  W CF   +0.62  believed-cut  ab_no_steam  edge_ge10
2026-09-07  MLB  TOTAL  Under 6.5                     TOP               pre    1u    122  L CF   -1.00  believed-cut  ab_no_steam  plus_native4
2026-09-08  MLB  SPREAD Colorado Rockies              MINI              pre    1u   -113  W CF   +0.88  believed-cut lean_no_arriving  ab_no_steam  tape_boost
2026-09-08  MLB  TOTAL  Over 7.5                      TOP               pre    3u   -119  W CF   +2.52  believed-cut unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-09  MLB  ML     Texas Rangers                 RANK              pre  2.5u    135  L CF   -2.50  believed-cut  ab_no_steam  plus_native4
2026-09-09  MLB  SPREAD Cincinnati Reds               MINI              pre    3u    118  L CF   -3.00  believed-cut lean_no_arriving  ab_no_steam  tape_boost
2026-09-09  MLB  SPREAD Philadelphia Phillies         TOP               pre    1u    154  W CF   +1.54  believed-cut lean_no_arriving  ab_no_steam  plus_native4
2026-09-09  MLB  SPREAD Chicago White Sox             RANK              pre  1.5u    156  L CF   -1.50  believed-cut  ab_no_steam  plus_native4
2026-09-09  MLB  TOTAL  Under 8.5                     CONFIRMED         pre    1u    101  L CF   -1.00  believed-cut lean_no_arriving  ab_no_steam  tape_boost
2026-09-10  MLB  SPREAD Philadelphia Phillies         RANK              pre  2.5u    122  L CF   -2.50  believed-cut  ab_no_steam  plus_native4
2026-09-11  MLB  SPREAD Pittsburgh Pirates            CONFIRMED-UNOPP   pre    1u   -113  L CF   -1.00  believed-cut  ab_no_steam  tape_boost
2026-09-11  CFB  TOTAL  Over 51.5                     CONFIRMED-Q1      pre    3u    104  W CF   +3.12  believed-cut  ab_arriving  tape_boost+edge_ge10
2026-09-11  MLB  TOTAL  Over 7.5                      CONFIRMED-Q1      pre    3u   -116  W CF   +2.59  believed-cut arriving_mid_4u  ab_no_steam  tape_boost
2026-09-11  MLB  TOTAL  Over 8.5                      SHARP             pre    1u    122  W CF   +1.22  believed-cut lean_no_arriving  ab_no_steam  tape_boost
2026-09-11  MLB  SPREAD Milwaukee Brewers             SHARP-LEAN        pre    1u    122  W CF   +1.22  fail-open-sub4  ab_already_on  fail_open
2026-09-12  MLB  ML     Colorado Rockies              RANK              pre  2.5u    140  L CF   -2.50  believed-cut  ab_already_on  plus_native4
2026-09-12  UFC  ML     Alexa Grasso                  SHARP             pre    1u    243  W CF   +2.43  believed-cut  ab_no_steam  tape_boost+edge_ge10
2026-09-12  CFB  ML     Maryland                      MINI-             pre    1u   -426  W CF   +0.23  fail-open-sub4  ab_no_steam  fail_open
2026-09-12  MLB  ML     Atlanta Braves                DISSENT           pre    1u   -134  W CF   +0.75  fail-open-sub4  ab_no_steam  fail_open
2026-09-12  CFB  SPREAD Michigan                      CONFIRMED-UNOPP   pre    1u   -100  W CF   +1.00  fail-open-sub4  ab_no_steam  fail_open
2026-09-13  NFL  ML     Colts                         CONFIRMED-Q1      pre  2.5u    136  L CF   -2.50  believed-cut  ab_already_on  edge_ge10
2026-09-13  SOC  ML     Manchester City FC            SHARP             pre  2.5u    121  W CF   +3.02  believed-cut unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-13  MLB  SPREAD Chicago Cubs                  SHARP-LEAN        pre  1.5u    163  L CF   -1.50  believed-cut  ab_already_on  edge_ge10
2026-09-13  NFL  SPREAD Giants                        MINI              pre  2.5u   -109  W CF   +2.29  believed-cut unconfirmed_fat  ab_no_steam  tape_boost+edge_ge10
2026-09-14  MLB  ML     Miami Marlins                 SHARP             pre    1u    124  L CF   -1.00  believed-cut lean_no_arriving  ab_no_steam  tape_boost
2026-09-14  MLB  TOTAL  Over 8.5                      RANK              pre  2.5u    138  W CF   +3.45  believed-cut lean_no_arriving  ab_no_steam  plus_native4
2026-09-14  MLB  SPREAD Los Angeles Dodgers           MINI              pre    3u   -117  W CF   +2.56  fail-open-sub4  no_steam  fail_open
2026-09-15  MLB  ML     Detroit Tigers                RANK              pre  2.5u    125  W CF   +3.13  believed-cut  ab_no_steam  plus_native4+edge_ge10
2026-09-15  MLB  ML     Tampa Bay Rays                CONFIRMED-UNOPP   pre    1u   -230  W CF   +0.43  believed-cut unconfirmed_4u  ab_no_steam  edge_ge10
2026-09-15  UFC  ML     Antonio Monteiro              SHARP-LEAN        pre    1u    239  L CF   -1.00  believed-cut  ab_no_steam  tape_boost
2026-09-15  UFC  ML     Ednilson Santos               SHARP             pre    1u   1237  L CF   -1.00  believed-cut  no_steam  tape_boost+edge_ge10
```

## B4. Other overlays (not steam / leftover) — T-era CF

| mutedBy | N | W–L | WR | Wilson | Stake CF | PnL CF | ROI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| (none) | 128 | 49–79 | 38.3% | 30.3–46.9 | 141.5 | -25.97 | -18.4% |
| tape-weak | 61 | 33–28 | 54.1% | 41.7–66 | 95.5 | +1.01 | +1.1% |
| maxsr-sub4 | 59 | 32–27 | 54.2% | 41.7–66.3 | 90.5 | +11.84 | +13.1% |
| ags-quality-veto | 40 | 22–18 | 55% | 39.8–69.3 | 71.4 | -13.82 | -19.4% |
| winner_align_fade | 29 | 14–15 | 48.3% | 31.4–65.6 | 47.8 | +9.85 | +20.6% |
| qconv-q1 | 27 | 14–13 | 51.9% | 34–69.3 | 36.4 | +0.06 | +0.2% |
| fools-gold-flat | 25 | 10–15 | 40% | 23.4–59.3 | 84.9 | -27.56 | -32.5% |
| top-crowded | 20 | 14–6 | 70% | 48.1–85.5 | 43.7 | +6.65 | +15.2% |
| ev-lt2-no-steam | 10 | 3–7 | 30% | 10.8–60.3 | 27.0 | -13.00 | -48.1% |
| ev-drift-edge | 8 | 3–5 | 37.5% | 13.7–69.4 | 40.0 | -18.20 | -45.5% |
| fav-juice | 8 | 6–2 | 75% | 40.9–92.9 | 28.8 | -2.99 | -10.4% |

`(none)` is almost all path MONITORING at ≤1u with tape PASS — never published, no mutedBy stamp. Not a steam gate.

## B5. If we had shipped the mute (T-era live + that CF)

| Add back | N | W–L | CF PnL | Combined N | Combined PnL |
| --- | --- | --- | --- | --- | --- |
| (actual live book) | 131 | 77–54 | +61.82 | 131 | +61.82 |
| lean_no_arriving 1u | 99 | 51–48 | +0.54 | 230 | +62.36 |
| unconfirmed 4u | 18 | 9–9 | -11.96 | 149 | +49.86 |
| unconfirmed fat | 14 | 9–5 | +8.62 | 145 | +70.44 |
| all steam-tail | 131 | 69–62 | -2.80 | 262 | +59.02 |
| believed-cut no-steam | 40 | 19–21 | -1.81 | 171 | +60.01 |
| fail-open that T would ship | 2 | 1–1 | +0.56 | 133 | +62.38 |
| all leftover | 58 | 32–26 | +6.23 | 189 | +68.05 |
| maxsr-sub4 | 59 | 32–27 | +11.84 | 190 | +73.66 |
| tape-weak | 61 | 33–28 | +1.01 | 192 | +62.83 |

## B6. Daily board — live vs mutes

| Date | Live N | Live W–L | Live PnL | Muted N | Muted W–L | Muted CF | steam-tail | leftover |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-31 | 5 | 4–1 | +3.74 | 22 | 11–11 | -1.47 | 6 | 2 |
| 2026-09-01 | 4 | 4–0 | +16.82 | 31 | 16–15 | +5.56 | 11 | 3 |
| 2026-09-02 | 5 | 3–2 | +4.88 | 33 | 19–14 | +8.13 | 12 | 1 |
| 2026-09-03 | 6 | 5–1 | +9.23 | 16 | 4–12 | -7.43 | 4 | 0 |
| 2026-09-04 | 7 | 5–2 | +6.05 | 44 | 23–21 | +2.34 | 11 | 6 |
| 2026-09-05 | 9 | 6–3 | +7.72 | 80 | 34–46 | -40.41 | 11 | 11 |
| 2026-09-06 | 7 | 5–2 | +7.23 | 37 | 20–17 | +15.36 | 10 | 4 |
| 2026-09-07 | 7 | 5–2 | +7.22 | 28 | 14–14 | -6.17 | 6 | 2 |
| 2026-09-08 | 9 | 4–5 | -1.59 | 25 | 16–9 | +7.05 | 12 | 2 |
| 2026-09-09 | 5 | 2–3 | -2.44 | 33 | 16–17 | -9.01 | 8 | 5 |
| 2026-09-10 | 5 | 0–5 | -13.50 | 8 | 4–4 | -0.21 | 0 | 1 |
| 2026-09-11 | 10 | 5–5 | -6.08 | 32 | 19–13 | +14.05 | 11 | 5 |
| 2026-09-12 | 18 | 12–6 | +25.91 | 113 | 62–51 | -20.51 | 13 | 5 |
| 2026-09-13 | 16 | 9–7 | +7.01 | 50 | 18–32 | -32.78 | 11 | 4 |
| 2026-09-14 | 7 | 4–3 | +0.91 | 23 | 12–11 | -1.98 | 3 | 3 |
| 2026-09-15 | 11 | 4–7 | -11.29 | 29 | 13–16 | -1.22 | 2 | 4 |

