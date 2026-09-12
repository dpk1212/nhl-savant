# Unit-tier + steam/EV cut scoreboard

_Generated 2026-09-12T12:25:30.449Z · AGSU sides Aug 31+ (T live) unless noted._

Re-run: `node scripts/analyzeUnitTierSteamBook.mjs`

WATCH ≠ revert. Two-phase steam/EV sample is still filling. Do not change production sizing from a WATCH row.

## Handle at a glance

Shipped tiles = Bankroll Lens (`agsV12UnitTierFromUnits`). Cuts scored at recoverable incoming size (counterfactual).

```
SHIPPED Aug31+                 79   48-31    60.8%  +   39.3u  roi=  16.2%  stake=243.1
MAX PLAY (6u)                   1    1-0    100.0%  +    6.2u  roi= 103.0%  stake=6.0  thin — keep logging
TOP PLAY (4-5.4u)              14    7-7     50.0%     -2.5u  roi=  -4.1%  stake=62.6  flat / under
STRONG (3u)                    46   32-14    69.6%  +   39.3u  roi=  28.4%  stake=138.0  the book
MID PLAY (1.5-2.5u)            18    8-10    44.4%     -3.6u  roi=  -9.9%  stake=36.5  flat / under
LEAN (≤1u)                    —  WORKING — T emptied ≤1u

unit-tier PROMOTE shipped       4    2-2     50.0%     -2.5u  roi= -15.8%  stake=16.0  Sep 11 old OR until Fetch restamps
unit-tier PROMOTE then muted    4    4-0    100.0%  +    7.6u  roi=  84.8%  stake=9.0  stamp then later 0u
T arriving FLOOR →2u            8    4-4     50.0%     -1.1u  roi= -10.8%  stake=10.0  hold — mixed
T arriving mid BOOST →4u        3    1-2     33.3%     -4.7u  roi= -39.1%  stake=12.0  thin — keep logging
CONFIRMED-Q1 floor shipped     40   25-15    62.5%  +   19.6u  roi=  17.2%  stake=114.0  WORKING — floor is +

Cuts @ incoming (is the mute still doing the job?):
T ≤1u junk (steam-tail lean)   74   39-35    52.7%  +    2.7u  roi=   3.7%  stake=72.5  hold — mixed
T unconfirmed 4u (steam-tail u4)   12    6-6     50.0%     -6.8u  roi= -14.1%  stake=48.0  WORKING — cut is trash
T unconfirmed fat (steam-tail fat)    5    5-0    100.0%  +   23.2u  roi=  84.1%  stake=27.6  WATCH — muted pile is winning (thin n)
T leftover mid (steam-tail mid)   11    8-3     72.7%  +    7.0u  roi=  26.4%  stake=26.7  WATCH — muted pile is winning
−375 fav-juice                  6    4-2     66.7%     -3.5u  roi= -29.0%  stake=12.0  thin — keep logging
EV < −2 no steam                2    2-0    100.0%  +    4.5u  roi=  75.0%  stake=6.0  thin — keep logging
believed-cut leftover          35   16-19    45.7%     -8.2u  roi= -13.4%  stake=61.4  WORKING — cut is trash
tape-weak                      42   22-20    52.4%     -3.7u  roi=  -5.6%  stake=65.8  WORKING — cut leaks units
maxsr-sub4                     41   22-19    53.7%  +    8.1u  roi=  13.3%  stake=61.0  hold — mixed
top-crowded                    15   11-4     73.3%  +    0.8u  roi=   3.3%  stake=24.4  WATCH — muted WR is healthy
ev-drift-edge                   3    0-3      0.0%    -10.4u  roi=-100.0%  stake=10.4  thin — keep logging
winner_align_fade              20   12-8     60.0%  +    9.8u  roi=  44.0%  stake=22.3  WATCH — muted WR is healthy
muted-unstamped                69   20-49    29.0%    -30.8u  roi= -36.4%  stake=84.5  WORKING — cut is trash
```

## What is live (sizing stack, last step wins)

1. Path / tape / leftover / maxSR / no-CONFIRMED / crowded / Ev-drift / climate / sport unlock
2. **Policy T (Aug 31)** — cut ≤1u junk; floor A/B arriving ≤1u → 2u; native 2–3u A/B arriving → 4u; keep 4u and 5.4u+ iff A/B + steam on at lock; always keep 5u
3. **−375 mute (Sep 5)** — favorites juicier than −375 → 0u
4. **Unit-tier overlay (Sep 11 mute / Sep 12 timing promote)** — mute live EV < −2 with no steam; promote 2–<4u → 4u only if arriving or last-hour ≥ 3%, not LEAN/FADE, lock-EV < −1 veto

Tape-log coverage Aug 31+: **536/538** sides (100%). Steam/EV cuts only fire when the log or Pin game is observable — this is the database we are still filling.

## 1. Shipped unit tiles (Bankroll Lens)

These are **shipped size**, not path. 0u muted sides are not in a tile.

```
ALL shipped Aug31+             79   48-31    60.8%  +   39.3u  roi=  16.2%  stake=243.1
MAX PLAY (6u)                   1    1-0    100.0%  +    6.2u  roi= 103.0%  stake=6.0
TOP PLAY (4-5.4u)              14    7-7     50.0%     -2.5u  roi=  -4.1%  stake=62.6
STRONG (3u)                    46   32-14    69.6%  +   39.3u  roi=  28.4%  stake=138.0
MID PLAY (1.5-2.5u)            18    8-10    44.4%     -3.6u  roi=  -9.9%  stake=36.5
LEAN (≤1u)                    —

Steam-live Aug19+ shipped (includes pre-T 1u junk):
ALL shipped Aug19+            269  151-118   56.1%  +   52.3u  roi=   7.2%  stake=723.6
MAX PLAY (6u)                   8    6-2     75.0%  +   17.2u  roi=  35.8%  stake=48.0
TOP PLAY (4-5.4u)              62   37-25    59.7%     -1.8u  roi=  -0.6%  stake=299.6
STRONG (3u)                    74   49-25    66.2%  +   44.7u  roi=  20.1%  stake=222.0
MID PLAY (1.5-2.5u)            31   16-15    51.6%  +    2.9u  roi=   4.6%  stake=62.5
LEAN (≤1u)                     94   43-51    45.7%    -10.6u  roi= -11.6%  stake=91.5
```

## 2. Steam size bands on shipped T-window

```
lean                          —
mid                            64   40-24    62.5%  +   35.6u  roi=  20.4%  stake=174.5
u4                              9    3-6     33.3%    -15.2u  roi= -42.3%  stake=36.0
u5                              1    1-0    100.0%  +    6.0u  roi= 120.0%  stake=5.0
fat                             5    4-1     80.0%  +   12.9u  roi=  46.6%  stake=27.6
```

## 3. Lock tier inside the 3u (STRONG) tile — flatten check

T flattened quality into 3u. Units stopped meaning path quality.

```
3u all                         46   32-14    69.6%  +   39.3u  roi=  28.4%  stake=138.0
3u ELITE                        8    8-0    100.0%  +   20.6u  roi=  85.7%  stake=24.0
3u PREMIUM                      6    5-1     83.3%  +   10.6u  roi=  58.9%  stake=18.0
3u LOCK                         6    4-2     66.7%  +    5.4u  roi=  30.0%  stake=18.0
3u WEAK                        21   14-7     66.7%  +   11.8u  roi=  18.8%  stake=63.0
3u LEAN                         5    1-4     20.0%     -9.1u  roi= -60.9%  stake=15.0
3u FADE                       —
```

## 4. Promote paths (stamped), by incoming unit band

Incoming uses `v8_unitsPreUnitTierEvSteam` when present so a 4u stamp does not look like it arrived as 4u.
Sep 11 unit-tier PROMOTE stamps used the old OR (steam-on / EV[0,1) / lh≥2). Next Fetch restamps timing-only.

```
unit-tier PROMOTE shipped       4    2-2     50.0%     -2.5u  roi= -15.8%  stake=16.0
  incoming mid 2–3u             4    2-2     50.0%     -2.5u  roi= -15.8%  stake=16.0
unit-tier PROMOTE then muted    4    4-0    100.0%  +    7.6u  roi=  84.8%  stake=9.0
T arriving FLOOR →2u            8    4-4     50.0%     -1.1u  roi= -10.8%  stake=10.0
T arriving mid BOOST →4u        3    1-2     33.3%     -4.7u  roi= -39.1%  stake=12.0
CONFIRMED-Q1 floor (shipped)   40   25-15    62.5%  +   19.6u  roi=  17.2%  stake=114.0
```
Unit-tier promote shipped:
  2026-09-11 MLB Chicago Cubs in=2 ship=4 WEAK/SHARP-LEAN arr=N ev=0.4 lh=— W +2.3
  2026-09-11 CFB Kansas in=2 ship=4 WEAK/SHARP-LEAN arr=N ev=2.7 lh=1.07 L -4.0
  2026-09-11 CFB Rutgers in=2 ship=4 PREMIUM/RANK arr=N ev=0 lh=0 L -4.0
  2026-09-11 MLB Under 8.5 in=2 ship=4 LEAN/CONFIRMED-Q1 arr=N ev=0.9 lh=0.57 W +3.1
Unit-tier promote then muted (counterfactual @ incoming):
  2026-09-11 MLB San Diego Padres in=2 ship=0 WEAK/MONITORING arr=Y ev=-2.3 lh=0 W +1.3 mutedBy=muted-unstamped
  2026-09-11 CFB Over 51.5 in=2 ship=0 WEAK/CONFIRMED-Q1 arr=N ev=2.2 lh=— W +2.1 mutedBy=believed-cut
  2026-09-11 MLB Over 7.5 in=3 ship=0 LEAN/CONFIRMED-Q1 arr=N ev=0.4 lh=— W +2.6 mutedBy=believed-cut
  2026-09-11 MLB Under 8.5 in=2 ship=0 LEAN/CONFIRMED-Q1 arr=N ev=-0.6 lh=— W +1.7 mutedBy=maxsr-sub4

## 5. Cut / mute paths — is the cut still working?

Muted sides graded as if they had shipped at recoverable pre-size (`incoming`).
WORKING = the pile we cut is ≤50% WR or −PnL. WATCH = muted pile is winning — sample or a leak. WATCH ≠ revert.

```
ALL muted Aug31+ @ incoming   389  196-193   50.4%     -9.5u  roi=  -1.6%  stake=604.0
  T steam-tail lean ≤1u        74   39-35    52.7%  +    2.7u  roi=   3.7%  stake=72.5  hold — mixed
  T steam-tail mid             11    8-3     72.7%  +    7.0u  roi=  26.4%  stake=26.7  WATCH — muted pile is winning
  T steam-tail u4              12    6-6     50.0%     -6.8u  roi= -14.1%  stake=48.0  WORKING — cut is trash
  T steam-tail fat              5    5-0    100.0%  +   23.2u  roi=  84.1%  stake=27.6  WATCH — muted pile is winning (thin n)
steam-tail                    102   58-44    56.9%  +   26.1u  roi=  14.9%  stake=174.8  WATCH — muted WR is healthy
    T Aug31 · ≤1u junk; unconfirmed 4u/fat
muted-unstamped                69   20-49    29.0%    -30.8u  roi= -36.4%  stake=84.5  WORKING — cut is trash
    pre-stamp / other · 0u with no mutedBy
tape-weak                      42   22-20    52.4%     -3.7u  roi=  -5.6%  stake=65.8  WORKING — cut leaks units
    pre-steam · tape score < 0
maxsr-sub4                     41   22-19    53.7%  +    8.1u  roi=  13.3%  stake=61.0  hold — mixed
    T-era Aug20 · sub-4 maxSR < 1
believed-cut                   35   16-19    45.7%     -8.2u  roi= -13.4%  stake=61.4  WORKING — cut is trash
    leftover Aug19 · sub-4 believed-then-cut
ags-quality-veto               24   11-13    45.8%     -1.1u  roi=  -3.3%  stake=33.0  WORKING — cut is trash
    AGS gate · v12 quality veto
winner_align_fade              20   12-8     60.0%  +    9.8u  roi=  44.0%  stake=22.3  WATCH — muted WR is healthy
    pre-steam · winner-align fade
qconv-q1                       17    9-8     52.9%     -2.5u  roi= -10.8%  stake=23.5  hold — mixed
    pre-steam · qConv Q1 Path C
top-crowded                    15   11-4     73.3%  +    0.8u  roi=   3.3%  stake=24.4  WATCH — muted WR is healthy
    T-era Aug26 · TOP crowded conviction
fail-open-sub4                  7    6-1     85.7%  +    3.6u  roi=  44.6%  stake=8.0  thin — keep logging
    leftover Aug19 · sub-4 FAIL_OPEN
fav-juice                       6    4-2     66.7%     -3.5u  roi= -29.0%  stake=12.0  thin — keep logging
    Sep5 · favorites juicier than −375
fools-gold-flat                 6    3-3     50.0%     -2.2u  roi= -12.8%  stake=17.0  thin — keep logging
    pre-steam · best FOR is FLAT
ev-drift-edge                   3    0-3      0.0%    -10.4u  roi=-100.0%  stake=10.4  thin — keep logging
    T-era Aug26 · EDGE≥15 and Ev faded
ev-lt2-no-steam                 2    2-0    100.0%  +    4.5u  roi=  75.0%  stake=6.0  thin — keep logging
    Sep11 overlay · live EV < −2, no steam
```

## 6. Steam-era cuts × incoming unit band

```
steam-tail
  all                         102   58-44    56.9%  +   26.1u  roi=  14.9%  stake=174.8
  incoming lean                74   39-35    52.7%  +    2.7u  roi=   3.7%  stake=72.5
  incoming mid                 11    8-3     72.7%  +    7.0u  roi=  26.4%  stake=26.7
  incoming u4                  12    6-6     50.0%     -6.8u  roi= -14.1%  stake=48.0
  incoming fat                  5    5-0    100.0%  +   23.2u  roi=  84.1%  stake=27.6
ev-lt2-no-steam
  all                           2    2-0    100.0%  +    4.5u  roi=  75.0%  stake=6.0
  incoming mid                  2    2-0    100.0%  +    4.5u  roi=  75.0%  stake=6.0
fav-juice
  all                           6    4-2     66.7%     -3.5u  roi= -29.0%  stake=12.0
  incoming mid                  6    4-2     66.7%     -3.5u  roi= -29.0%  stake=12.0
ev-drift-edge
  all                           3    0-3      0.0%    -10.4u  roi=-100.0%  stake=10.4
  incoming mid                  2    0-2      0.0%     -5.0u  roi=-100.0%  stake=5.0
  incoming fat                  1    0-1      0.0%     -5.4u  roi=-100.0%  stake=5.4
believed-cut
  all                          35   16-19    45.7%     -8.2u  roi= -13.4%  stake=61.4
  incoming lean                21   11-10    52.4%  +    2.3u  roi=  10.8%  stake=21.0
  incoming mid                 11    3-8     27.3%    -11.8u  roi= -43.8%  stake=27.0
  incoming u4                   2    2-0    100.0%  +    6.7u  roi=  83.9%  stake=8.0
  incoming fat                  1    0-1      0.0%     -5.4u  roi=-100.0%  stake=5.4
maxsr-sub4
  all                          41   22-19    53.7%  +    8.1u  roi=  13.3%  stake=61.0
  incoming lean                28   13-15    46.4%     -2.0u  roi=  -7.0%  stake=28.0
  incoming mid                 12    8-4     66.7%  +    7.7u  roi=  26.6%  stake=29.0
  incoming u4                   1    1-0    100.0%  +    2.4u  roi=  58.8%  stake=4.0
```

## 7. Database fill — tape / steam / EV

```
T-window sides              538
  shipped                   85  graded 79
  muted                     453  graded 389
  tape log                  536 (100%)
  shipped + tape            85/85
  muted + tape              451/453
  arriving (tape)           45
  steam on lock (tape)      117
  lock EV present           513
```

Sep 12 timing promote just landed. Unit-tier PROMOTE stamps before today used the old OR (steam-on / EV[0,1) / lh≥2). Read those stamps as the wide rule; new stamps after the next Fetch are timing-only.
