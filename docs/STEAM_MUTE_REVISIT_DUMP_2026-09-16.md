# Steam mute revisit — extra data after the Sep 8 papers

_Pulled 2026-09-16T14:34:54.711Z. Graded AGS-U sides 2026-08-19+. Leftover mute Aug 19. Policy T Aug 31. Leftover A/B arriving HOLD + native 2–3u arriving → 4u shipped Sep 9 (bc44b00d4d)._
_Paper window for comparison: 2026-08-19–2026-09-08. New days: 2026-09-09+._

Sign of mute CF: **positive = we left money on the table** (over-mute). **Negative = the mute saved us.**

## 0. Live book vs the Sep 8 paper
- **Paper window 2026-08-19–2026-09-08**: live 249 · 144-105 · 57.8% (51.6–63.8) · 660.1u · +74.32u · +11.3% · 11.86/day · 2.65u/tix · muted 619 (71% of graded)
- **Discovery leftover, T off (2026-08-19–2026-08-30)**: live 190 · 103-87 · 54.2% (47.1–61.1) · 480.5u · +13.02u · +2.7% · 15.83/day · 2.53u/tix · muted 303 (61% of graded)
- **T live, pre-ship (2026-08-31–2026-09-08)**: live 59 · 41-18 · 69.5% (56.9–79.7) · 179.6u · +61.30u · +34.1% · 6.56/day · 3.04u/tix · muted 316 (84% of graded)
- **Post-ship 2026-09-09+**: live 72 · 36-36 · 50% (38.7–61.3) · 233.6u · +0.52u · +0.2% · 10.29/day · 3.24u/tix · muted 288 (80% of graded)
- **Full steam era 2026-08-19+**: live 321 · 180-141 · 56.1% (50.6–61.4) · 893.6u · +74.84u · +8.4% · 11.46/day · 2.78u/tix · muted 907 (74% of graded)
- **Full T era 2026-08-31+**: live 131 · 77-54 · 58.8% (50.2–66.8) · 413.1u · +61.82u · +15% · 8.19/day · 3.15u/tix · muted 604 (82% of graded)

Post-ship live mix: 72 tickets on 7 nights.

## 1. Are we leaving too many muted? — mute CF by reason

### 1a. Whole mute stack (graded, pre-policy units)
**Paper window through Sep 8**
live 249 · 144-105 · 57.8% (51.6–63.8) · 660.1u · +74.32u · +11.3%
all mutes CF 619 · 301-318 · 48.6% (44.7–52.6) · 1027.6u · -85.02u · -8.3%
  (none): 144 · 66-78 · 45.8% (37.9–54) · 170.0u · -29.83u · -17.5%
  steam-tail: 83 · 47-36 · 56.6% (45.9–66.8) · 138.6u · +23.05u · +16.6%
  maxsr-sub4: 75 · 32-43 · 42.7% (32.1–53.9) · 113.0u · -19.36u · -17.1%
  tape-weak: 62 · 32-30 · 51.6% (39.4–63.6) · 88.5u · -1.21u · -1.4%
  believed-cut: 56 · 24-32 · 42.9% (30.8–55.9) · 104.5u · -14.61u · -14%
  fools-gold-flat: 40 · 18-22 · 45% (30.7–60.2) · 121.4u · -16.79u · -13.8%
  winner_align_fade: 40 · 21-19 · 52.5% (37.5–67.1) · 59.3u · +17.39u · +29.3%
  ags-quality-veto: 36 · 19-17 · 52.8% (37–68) · 70.0u · -7.45u · -10.6%
  qconv-q1: 34 · 13-21 · 38.2% (23.9–55) · 45.0u · -11.87u · -26.4%
  fail-open-sub4: 21 · 15-6 · 71.4% (50–86.2) · 35.5u · +10.99u · +31%
  top-crowded: 16 · 8-8 · 50% (28–72) · 32.8u · -14.25u · -43.4%
  ev-drift-edge: 6 · 2-4 · 33.3% (9.7–70) · 31.0u · -15.86u · -51.2%
  fav-juice: 6 · 4-2 · 66.7% (30–90.3) · 18.0u · -5.22u · -29%

**Post-ship Sep 9+**
live 72 · 36-36 · 50% (38.7–61.3) · 233.6u · +0.52u · +0.2%
all mutes CF 288 · 144-144 · 50% (44.3–55.7) · 545.6u · -51.65u · -9.5%
  (none): 75 · 35-40 · 46.7% (35.8–57.8) · 85.5u · -0.78u · -0.9%
  steam-tail: 48 · 22-26 · 45.8% (32.6–59.7) · 108.7u · -25.85u · -23.8%
  tape-weak: 27 · 17-10 · 63% (44.2–78.5) · 46.0u · +4.63u · +10.1%
  maxsr-sub4: 25 · 14-11 · 56% (37.1–73.3) · 42.5u · +9.58u · +22.5%
  believed-cut: 22 · 10-12 · 45.5% (26.9–65.3) · 41.0u · +2.22u · +5.4%
  fools-gold-flat: 20 · 7-13 · 35% (18.1–56.7) · 70.9u · -28.39u · -40%
  ags-quality-veto: 16 · 11-5 · 68.8% (44.4–85.8) · 20.4u · +0.61u · +3%
  qconv-q1: 12 · 5-7 · 41.7% (19.3–68) · 17.4u · -4.87u · -28%
  winner_align_fade: 11 · 3-8 · 27.3% (9.7–56.6) · 15.9u · -8.21u · -51.6%
  ev-lt2-no-steam: 10 · 3-7 · 30% (10.8–60.3) · 27.0u · -13.00u · -48.1%
  top-crowded: 10 · 7-3 · 70% (39.7–89.2) · 27.3u · +7.80u · +28.6%
  fail-open-sub4: 5 · 5-0 · 100% (56.6–100) · 7.0u · +5.77u · +82.4%
  ev-drift-edge: 5 · 3-2 · 60% (23.1–88.2) · 25.2u · -3.40u · -13.5%
  fav-juice: 2 · 2-0 · 100% (34.2–100) · 10.8u · +2.23u · +20.7%

**Full T era Aug 31+**
live 131 · 77-54 · 58.8% (50.2–66.8) · 413.1u · +61.82u · +15%
all mutes CF 604 · 301-303 · 49.8% (45.9–53.8) · 1049.3u · -68.68u · -6.5%
  steam-tail: 131 · 69-62 · 52.7% (44.2–61) · 247.3u · -2.80u · -1.1%
  (none): 128 · 49-79 · 38.3% (30.3–46.9) · 141.5u · -25.97u · -18.4%
  tape-weak: 61 · 33-28 · 54.1% (41.7–66) · 95.5u · +1.01u · +1.1%
  maxsr-sub4: 59 · 32-27 · 54.2% (41.7–66.3) · 90.5u · +11.84u · +13.1%
  believed-cut: 47 · 22-25 · 46.8% (33.3–60.8) · 80.5u · -1.88u · -2.3%
  ags-quality-veto: 40 · 22-18 · 55% (39.8–69.3) · 71.4u · -13.82u · -19.4%
  winner_align_fade: 29 · 14-15 · 48.3% (31.4–65.6) · 47.8u · +9.85u · +20.6%
  qconv-q1: 27 · 14-13 · 51.9% (34–69.3) · 36.4u · +0.06u · +0.2%
  fools-gold-flat: 25 · 10-15 · 40% (23.4–59.3) · 84.9u · -27.56u · -32.5%
  top-crowded: 20 · 14-6 · 70% (48.1–85.5) · 43.7u · +6.65u · +15.2%
  fail-open-sub4: 11 · 10-1 · 90.9% (62.3–98.4) · 14.0u · +8.11u · +57.9%
  ev-lt2-no-steam: 10 · 3-7 · 30% (10.8–60.3) · 27.0u · -13.00u · -48.1%
  ev-drift-edge: 8 · 3-5 · 37.5% (13.7–69.4) · 40.0u · -18.20u · -45.5%
  fav-juice: 8 · 6-2 · 75% (40.9–92.9) · 28.8u · -2.99u · -10.4%

### 1b. Policy T steam-tail mutes (the 1u / unconfirmed 4u / fat gates)
**Through Sep 8** steam-tail CF 83 · 47-36 · 56.6% (45.9–66.8) · 138.6u · +23.05u · +16.6%
  lean_no_arriving: 67 · 36-31 · 53.7% (41.9–65.1) · 67.0u · +3.81u · +5.7%
  unconfirmed_4u: 11 · 6-5 · 54.5% (28–78.7) · 44.0u · -3.97u · -9%
  unconfirmed_fat: 5 · 5-0 · 100% (56.6–100) · 27.6u · +23.21u · +84.1%

**Sep 9+** steam-tail CF 48 · 22-26 · 45.8% (32.6–59.7) · 108.7u · -25.85u · -23.8%
  lean_no_arriving: 32 · 15-17 · 46.9% (30.9–63.6) · 32.0u · -3.27u · -10.2%
  unconfirmed_fat: 9 · 4-5 · 44.4% (18.9–73.3) · 48.6u · -14.59u · -30%
  unconfirmed_4u: 7 · 3-4 · 42.9% (15.8–75) · 28.1u · -7.99u · -28.4%

**Full T era** steam-tail CF 131 · 69-62 · 52.7% (44.2–61) · 247.3u · -2.80u · -1.1%
  lean_no_arriving: 99 · 51-48 · 51.5% (41.8–61.1) · 99.0u · +0.54u · +0.5%
  unconfirmed_4u: 18 · 9-9 · 50% (29–71) · 72.1u · -11.96u · -16.6%
  unconfirmed_fat: 14 · 9-5 · 64.3% (38.8–83.7) · 76.2u · +8.62u · +11.3%

### 1c. Leftover mute (believed-cut + fail-open-sub4), split by steam cell
**Through Sep 8**
leftover all CF 77 · 39-38 · 50.6% (39.7–61.5) · 140.0u · -3.62u · -2.6%
  believed-cut 56 · 24-32 · 42.9% (30.8–55.9) · 104.5u · -14.61u · -14%
    no steam 44 · 16-28 · 36.4% (23.8–51.1) · 79.5u · -22.25u · -28%
    A/B already-on 5 · 3-2 · 60% (23.1–88.2) · 11.0u · +0.76u · +6.9%
    A/B arriving 5 · 5-0 · 100% (56.6–100) · 10.0u · +10.87u · +108.7%
  fail-open-sub4 21 · 15-6 · 71.4% (50–86.2) · 35.5u · +10.99u · +31%
    no steam 16 · 12-4 · 75% (50.5–89.8) · 29.5u · +10.35u · +35.1%
    A/B arriving 2 · 2-0 · 100% (34.2–100) · 2.0u · +2.59u · +129.6%
    all steam-on 5 · 3-2 · 60% (23.1–88.2) · 6.0u · +0.64u · +10.7%

**Sep 9+ (HOLD should have zeroed arriving leftovers)**
leftover all CF 27 · 15-12 · 55.6% (37.3–72.4) · 48.0u · +7.99u · +16.6%
  believed-cut 22 · 10-12 · 45.5% (26.9–65.3) · 41.0u · +2.22u · +5.4%
    no steam 18 · 9-9 · 50% (29–71) · 31.5u · +5.60u · +17.8%
    A/B already-on 3 · 0-3 · 0% (0–56.2) · 6.5u · -6.50u · -100%
    A/B arriving 1 · 1-0 · 100% (20.7–100) · 3.0u · +3.12u · +104%
  fail-open-sub4 5 · 5-0 · 100% (56.6–100) · 7.0u · +5.77u · +82.4%
    no steam 4 · 4-0 · 100% (51–100) · 6.0u · +4.55u · +75.8%
    A/B arriving —
    all steam-on 1 · 1-0 · 100% (20.7–100) · 1.0u · +1.22u · +122%

**Full leftover era Aug 19+**
leftover all CF 104 · 54-50 · 51.9% (42.4–61.3) · 188.0u · +4.37u · +2.3%
  believed-cut 78 · 34-44 · 43.6% (33.1–54.6) · 145.5u · -12.39u · -8.5%
    no steam 62 · 25-37 · 40.3% (29–52.7) · 111.0u · -16.64u · -15%
    A/B already-on 8 · 3-5 · 37.5% (13.7–69.4) · 17.5u · -5.74u · -32.8%
    A/B arriving 6 · 6-0 · 100% (61–100) · 13.0u · +13.99u · +107.6%
  fail-open-sub4 26 · 20-6 · 76.9% (57.9–89) · 42.5u · +16.75u · +39.4%
    no steam 20 · 16-4 · 80% (58.4–91.9) · 35.5u · +14.89u · +41.9%
    A/B arriving 2 · 2-0 · 100% (34.2–100) · 2.0u · +2.59u · +129.6%
    all steam-on 6 · 4-2 · 66.7% (30–90.3) · 7.0u · +1.86u · +26.6%

### 1d. Leftover × arriving — tickets leftover killed that T would have shipped
**Through Sep 8 (the original 8)** n=7
  at leftover pre-units 7 · 7-0 · 100% (64.6–100) · 12.0u · +13.47u · +112.2%
  at T would-ship size (2u floor on leans, mid HOLD, 4u/fat if A/B steam) 7 · 7-0 · 100% (64.6–100) · 16.0u · +18.66u · +116.6%
  2026-08-19 MLB TOTAL Under 8.5                  pre    1u → T    2u  CONFIRMED-UNOPP W CF   +0.96  -104  fail-open-sub4  tape=FAIL_OPEN flags=fail_open
  2026-08-21 MLB ML Boston Red Sox             pre    3u → T    3u  SHARP          W CF   +1.74  -172  believed-cut  tape=BOOST flags=tape_boost
  2026-08-21 MLB TOTAL Over 8.5                   pre    1u → T    2u  TOP            W CF   +1.75  175  believed-cut  tape=HOLD flags=plus_native4
  2026-08-24 MLB ML San Francisco Giants       pre    1u → T    2u  DISSENT        W CF   +1.63  163  fail-open-sub4  tape=FAIL_OPEN flags=fail_open
  2026-08-25 MLB TOTAL Over 7.5                   pre  2.5u → T  2.5u  RANK           W CF   +3.08  123  believed-cut  tape=HOLD flags=plus_native4
  2026-09-05 CFB SPREAD Baylor                     pre    1u → T    2u  CONFIRMED-UNOPP W CF   +0.85  -117  believed-cut  tape=MUTE flags=edge_ge10
  2026-09-06 MLB TOTAL Under 6.5                  pre  2.5u → T  2.5u  SHARP-LEAN     W CF   +3.45  138  believed-cut  tape=HOLD flags=edge_ge10

**Sep 9+ (should be empty if HOLD is live)** n=1
  at leftover pre-units 1 · 1-0 · 100% (20.7–100) · 3.0u · +3.12u · +104%
  at T would-ship size (2u floor on leans, mid HOLD, 4u/fat if A/B steam) 1 · 1-0 · 100% (20.7–100) · 3.0u · +3.12u · +104%
  2026-09-11 CFB TOTAL Over 51.5                  pre    3u → T    3u  CONFIRMED-Q1   W CF   +3.12  104  believed-cut HOLD tape=BOOST flags=tape_boost+edge_ge10

## 2. Did the Sep 9 leftover HOLD actually ship arriving leftovers?

Post-ship leftover×arriving still muted: **1** (want 0).
Post-ship live A/B arriving: 25 · 11-14 · 44% (26.7–62.9) · 94.4u · -7.71u · -8.2%
  T FLOOR (1u→2u): 3 · 1-2 · 33.3% (6.1–79.2) · 6.0u · -2.40u · -40%
  T BOOST (2–3u→4u): 16 · 8-8 · 50% (28–72) · 64.0u · +3.40u · +5.3%
  live arriving by band:
    2–3u 4 · 1-3 · 25% (4.6–69.9) · 8.0u · -4.40u · -55%  steamActions=FLOOR,HOLD
    4u 19 · 9-10 · 47.4% (27.3–68.3) · 76.0u · -2.34u · -3.1%  steamActions=BOOST,HOLD
    5u 1 · 0-1 · 0% (0–79.3) · 5.0u · -5.00u · -100%  steamActions=HOLD
    5.4u 1 · 1-0 · 100% (20.7–100) · 5.4u · +4.03u · +74.6%  steamActions=HOLD

Post-ship live A/B arriving tickets:
  2026-09-09 MLB TOTAL Under 8.5                     2u pre 1u SHARP-LEAN     L -2.00  FLOOR arriving_floor 2–3u
  2026-09-10 MLB ML Chicago White Sox             2u pre 1u MINI           L -2.00  FLOOR arriving_floor 2–3u
  2026-09-10 MLB SPREAD Colorado Rockies              4u pre 2.5u MINI           L -4.00  BOOST arriving_mid_4u 4u
  2026-09-10 NFL SPREAD Rams                          2u pre 3u SUPER          L -2.00  HOLD steam_confirmed 2–3u
  2026-09-10 MLB TOTAL Under 8.5                     4u pre 4u MINI           L -4.00  HOLD steam_confirmed 4u
  2026-09-11 MLB ML Arizona Diamondbacks          4u pre 3u SHARP-LEAN     W +3.31  BOOST arriving_mid_4u 4u
  2026-09-11 MLB TOTAL Under 7.5                     4u pre 2.5u CONFIRMED-Q1   L -4.00  BOOST arriving_mid_4u 4u
  2026-09-11 MLB TOTAL Under 7.5                     4u pre 4u MINI           L -4.00  HOLD steam_confirmed 4u
  2026-09-12 MLB ML New York Mets                 4u pre 2.5u CONFIRMED-Q1   W +5.64  BOOST arriving_mid_4u 4u
  2026-09-12 MLB ML Athletics                     4u pre 2.5u CONFIRMED-Q1   L -4.00  BOOST arriving_mid_4u 4u
  2026-09-12 UFC ML Curtis Blaydes                4u pre 1.5u CONFIRMED-Q1   W +6.40  BOOST arriving_mid_4u 4u
  2026-09-13 MLB ML Washington Nationals        5.4u pre 5.4u SHARP          W +4.03  HOLD steam_confirmed 5.4u
  2026-09-13 MLB ML Chicago Cubs                  4u pre 2u CONFIRMED-Q1   L -4.00  BOOST arriving_mid_4u 4u
  2026-09-13 MLB ML Texas Rangers                 4u pre 2.5u MINI           W +5.00  BOOST arriving_mid_4u 4u
  2026-09-13 NFL ML Vikings                       2u pre 1u CONFIRMED-UNOPP W +1.60  FLOOR arriving_floor 2–3u
  2026-09-13 MLB SPREAD Detroit Tigers                4u pre 2.5u CONFIRMED-Q1   W +5.52  BOOST arriving_mid_4u 4u
  2026-09-13 MLB TOTAL Over 7.5                      5u pre 5u CONFIRMED-Q1   L -5.00  HOLD steam_confirmed 5u
  2026-09-14 MLB ML San Diego Padres              4u pre 4u CONFIRMED-Q1   W +2.26  HOLD steam_confirmed 4u
  2026-09-14 MLB TOTAL Over 7.5                      4u pre 3u CONFIRMED-Q1   W +3.20  BOOST arriving_mid_4u 4u
  2026-09-14 NFL TOTAL Under 43.5                    4u pre 3u CONFIRMED-Q1   W +3.70  BOOST arriving_mid_4u 4u
  2026-09-15 MLB ML Cleveland Guardians           4u pre 3u CONFIRMED-Q1   W +2.63  BOOST arriving_mid_4u 4u
  2026-09-15 MLB SPREAD Cleveland Guardians           4u pre 1.5u CONFIRMED-Q1   L -4.00  BOOST arriving_mid_4u 4u
  2026-09-15 MLB SPREAD Pittsburgh Pirates            4u pre 3u CONFIRMED-Q1   L -4.00  BOOST arriving_mid_4u 4u
  2026-09-15 MLB TOTAL Over 8.5                      4u pre 3u CONFIRMED-Q1   L -4.00  BOOST arriving_mid_4u 4u
  2026-09-15 MLB TOTAL Over 7.5                      4u pre 3u MINI           L -4.00  BOOST arriving_mid_4u 4u

## 3. Arriving still undersized? Live A/B arriving vs rest
**Through Sep 8**
  arriving 34 · 26-8 · 76.5% (60–87.6) · 89.2u · +45.74u · +51.3% · 2.62u/tix
  not arriving 215 · 118-97 · 54.9% (48.2–61.4) · 570.9u · +28.58u · +5% · 2.66u/tix
  native 2–3u arriving still sitting mid (not boosted) 10 · 8-2 · 80% (49–94.3) · 27.5u · +17.09u · +62.1%
  boosted 2–3u→4u —

**Sep 9+**
  arriving 25 · 11-14 · 44% (26.7–62.9) · 94.4u · -7.71u · -8.2% · 3.78u/tix
  not arriving 47 · 25-22 · 53.2% (39.2–66.7) · 139.2u · +8.23u · +5.9% · 2.96u/tix
  native 2–3u arriving still sitting mid (not boosted) 1 · 0-1 · 0% (0–79.3) · 2.0u · -2.00u · -100%
  boosted 2–3u→4u 16 · 8-8 · 50% (28–72) · 64.0u · +3.40u · +5.3%

**Full steam era**
  arriving 59 · 37-22 · 62.7% (50–73.9) · 183.6u · +38.03u · +20.7% · 3.11u/tix
  not arriving 262 · 143-119 · 54.6% (48.5–60.5) · 710.0u · +36.81u · +5.2% · 2.71u/tix
  native 2–3u arriving still sitting mid (not boosted) 11 · 8-3 · 72.7% (43.4–90.3) · 29.5u · +15.09u · +51.2%
  boosted 2–3u→4u 16 · 8-8 · 50% (28–72) · 64.0u · +3.40u · +5.3%

## 4. Steam-tail 1u mute — still junk, or over-mute?
**Through Sep 8** lean_no_arriving CF 67 · 36-31 · 53.7% (41.9–65.1) · 67.0u · +3.81u · +5.7%
  A/B no-steam 60 · 32-28 · 53.3% (40.9–65.4) · 60.0u · +3.07u · +5.1%
  already-on 7 · 4-3 · 57.1% (25–84.2) · 7.0u · +0.74u · +10.6%
  arriving (should be floored, not muted) —

**Sep 9+** lean_no_arriving CF 32 · 15-17 · 46.9% (30.9–63.6) · 32.0u · -3.27u · -10.2%
  A/B no-steam 27 · 14-13 · 51.9% (34–69.3) · 27.0u · +0.14u · +0.5%
  already-on 5 · 1-4 · 20% (3.6–62.4) · 5.0u · -3.41u · -68.2%
  arriving (should be floored, not muted) —

**Full T era** lean_no_arriving CF 99 · 51-48 · 51.5% (41.8–61.1) · 99.0u · +0.54u · +0.5%
  A/B no-steam 87 · 46-41 · 52.9% (42.5–63) · 87.0u · +3.21u · +3.7%
  already-on 12 · 5-7 · 41.7% (19.3–68) · 12.0u · -2.67u · -22.3%
  arriving (should be floored, not muted) —

## 5. Unconfirmed 4u vs unconfirmed fat — still the split?
**Through Sep 8**
  unconfirmed 4u MUTE CF 11 · 6-5 · 54.5% (28–78.7) · 44.0u · -3.97u · -9%
  unconfirmed fat MUTE CF 5 · 5-0 · 100% (56.6–100) · 27.6u · +23.21u · +84.1%
  fat WITH A/B steam (kept) 14 · 11-3 · 78.6% (52.4–92.4) · 78.6u · +30.00u · +38.2%
  fat muted tickets:
  2026-09-04 MLB TOTAL Over 7.5                   pre  5.4u → T    0u  RANK           W CF   +5.94  110  steam-tail unconfirmed_fat
  2026-09-04 MLB TOTAL Over 8.5                   pre    6u → T    0u  SUPER          W CF   +5.36  -112  steam-tail unconfirmed_fat
  2026-09-05 UFC ML Delphine Benouaich         pre  5.4u → T    0u  SHARP          W CF   +4.09  -132  steam-tail unconfirmed_fat
  2026-09-05 UFC ML Kurtis Campbell            pre  5.4u → T    0u  MINI-          W CF   +1.51  -358  steam-tail unconfirmed_fat
  2026-09-06 MLB SPREAD Los Angeles Dodgers        pre  5.4u → T    0u  SHARP-LEAN     W CF   +6.32  117  steam-tail unconfirmed_fat
  unconfirmed 4u tickets:
  2026-08-31 MLB ML Miami Marlins              pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -110  steam-tail unconfirmed_4u
  2026-09-01 MLB ML Colorado Rockies           pre    4u → T    0u  RANK           W CF   +5.08  127  steam-tail unconfirmed_4u
  2026-09-01 MLB ML New York Yankees           pre    4u → T    0u  RANK           W CF   +2.33  -172  steam-tail unconfirmed_4u
  2026-09-02 MLB TOTAL Under 8.5                  pre    4u → T    0u  TOP            L CF   -4.00  103  steam-tail unconfirmed_4u
  2026-09-05 UFC ML Michael Aljarouj           pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -109  steam-tail unconfirmed_4u
  2026-09-07 CFB ML SMU                        pre    4u → T    0u  CONFIRMED-Q1   W CF   +2.82  -142  steam-tail unconfirmed_4u
  2026-09-07 MLB ML Miami Marlins              pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -135  steam-tail unconfirmed_4u
  2026-09-08 MLB ML Toronto Blue Jays          pre    4u → T    0u  SHARP-LEAN     W CF   +2.35  -170  steam-tail unconfirmed_4u
  2026-09-08 MLB ML San Diego Padres           pre    4u → T    0u  CONFIRMED-Q1   W CF   +2.26  -177  steam-tail unconfirmed_4u
  2026-09-08 MLB SPREAD Toronto Blue Jays          pre    4u → T    0u  SHARP-LEAN     W CF   +1.19  -335  steam-tail unconfirmed_4u
  2026-09-08 MLB TOTAL Over 8.5                   pre    4u → T    0u  CONFIRMED-Q1   L CF   -4.00  104  steam-tail unconfirmed_4u

**Sep 9+**
  unconfirmed 4u MUTE CF 7 · 3-4 · 42.9% (15.8–75) · 28.1u · -7.99u · -28.4%
  unconfirmed fat MUTE CF 9 · 4-5 · 44.4% (18.9–73.3) · 48.6u · -14.59u · -30%
  fat WITH A/B steam (kept) 2 · 2-0 · 100% (34.2–100) · 10.8u · +7.10u · +65.7%
  fat muted tickets:
  2026-09-11 CFB SPREAD Virginia                   pre  5.4u → T    0u  SHARP          W CF   +4.03  -134  steam-tail unconfirmed_fat
  2026-09-12 SOC ML Liverpool FC               pre  5.4u → T    0u  SHARP-LEAN     L CF   -5.40  -186  steam-tail unconfirmed_fat
  2026-09-12 SOC ML Real Madrid CF             pre  5.4u → T    0u  SHARP-LEAN     W CF   +0.86  -625  steam-tail unconfirmed_fat
  2026-09-12 UFC ML Édgar Cháirez              pre  5.4u → T    0u  TOP            L CF   -5.40  -179  steam-tail unconfirmed_fat
  2026-09-12 UFC ML Rongzhu                    pre  5.4u → T    0u  SHARP          W CF   +3.48  -155  steam-tail unconfirmed_fat
  2026-09-12 CFB SPREAD Vanderbilt                 pre  5.4u → T    0u  SHARP-LEAN     L CF   -5.40  -113  steam-tail unconfirmed_fat
  2026-09-13 NFL TOTAL Under 47.5                 pre  5.4u → T    0u  SHARP          L CF   -5.40  -112  steam-tail unconfirmed_fat
  2026-09-14 MLB ML Chicago Cubs               pre  5.4u → T    0u  TOP            W CF   +4.03  -134  steam-tail unconfirmed_fat
  2026-09-14 MLB ML Toronto Blue Jays          pre  5.4u → T    0u  MINI           L CF   -5.40  -124  steam-tail unconfirmed_fat
  unconfirmed 4u tickets:
  2026-09-09 MLB ML Minnesota Twins            pre    4u → T    0u  CONFIRMED-Q1   L CF   -4.00  114  steam-tail unconfirmed_4u
  2026-09-09 MLB ML St. Louis Cardinals        pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -111  steam-tail unconfirmed_4u
  2026-09-09 MLB TOTAL Over 7.5                   pre    4u → T    0u  CONFIRMED-Q1   W CF   +4.00  -100  steam-tail unconfirmed_4u
  2026-09-12 MLB ML Tampa Bay Rays             pre    4u → T    0u  CONFIRMED-Q1   W CF   +3.01  -133  steam-tail unconfirmed_4u
  2026-09-12 UFC ML Tommy Gantt                pre    4u → T    0u  SHARP-LEAN     W CF   +1.10  -362  steam-tail unconfirmed_4u
  2026-09-12 MLB TOTAL Over 8.5                   pre 4.05u → T    0u  CONFIRMED-Q1   L CF   -4.05  -107  steam-tail unconfirmed_4u
  2026-09-14 MLB ML Minnesota Twins            pre 4.05u → T    0u  CONFIRMED-Q1   L CF   -4.05  115  steam-tail unconfirmed_4u

**Full T era**
  unconfirmed 4u MUTE CF 18 · 9-9 · 50% (29–71) · 72.1u · -11.96u · -16.6%
  unconfirmed fat MUTE CF 14 · 9-5 · 64.3% (38.8–83.7) · 76.2u · +8.62u · +11.3%
  fat WITH A/B steam (kept) 7 · 6-1 · 85.7% (48.7–97.4) · 38.4u · +19.96u · +52%
  fat muted tickets:
  2026-09-04 MLB TOTAL Over 7.5                   pre  5.4u → T    0u  RANK           W CF   +5.94  110  steam-tail unconfirmed_fat
  2026-09-04 MLB TOTAL Over 8.5                   pre    6u → T    0u  SUPER          W CF   +5.36  -112  steam-tail unconfirmed_fat
  2026-09-05 UFC ML Delphine Benouaich         pre  5.4u → T    0u  SHARP          W CF   +4.09  -132  steam-tail unconfirmed_fat
  2026-09-05 UFC ML Kurtis Campbell            pre  5.4u → T    0u  MINI-          W CF   +1.51  -358  steam-tail unconfirmed_fat
  2026-09-06 MLB SPREAD Los Angeles Dodgers        pre  5.4u → T    0u  SHARP-LEAN     W CF   +6.32  117  steam-tail unconfirmed_fat
  2026-09-11 CFB SPREAD Virginia                   pre  5.4u → T    0u  SHARP          W CF   +4.03  -134  steam-tail unconfirmed_fat
  2026-09-12 SOC ML Liverpool FC               pre  5.4u → T    0u  SHARP-LEAN     L CF   -5.40  -186  steam-tail unconfirmed_fat
  2026-09-12 SOC ML Real Madrid CF             pre  5.4u → T    0u  SHARP-LEAN     W CF   +0.86  -625  steam-tail unconfirmed_fat
  2026-09-12 UFC ML Édgar Cháirez              pre  5.4u → T    0u  TOP            L CF   -5.40  -179  steam-tail unconfirmed_fat
  2026-09-12 UFC ML Rongzhu                    pre  5.4u → T    0u  SHARP          W CF   +3.48  -155  steam-tail unconfirmed_fat
  2026-09-12 CFB SPREAD Vanderbilt                 pre  5.4u → T    0u  SHARP-LEAN     L CF   -5.40  -113  steam-tail unconfirmed_fat
  2026-09-13 NFL TOTAL Under 47.5                 pre  5.4u → T    0u  SHARP          L CF   -5.40  -112  steam-tail unconfirmed_fat
  2026-09-14 MLB ML Chicago Cubs               pre  5.4u → T    0u  TOP            W CF   +4.03  -134  steam-tail unconfirmed_fat
  2026-09-14 MLB ML Toronto Blue Jays          pre  5.4u → T    0u  MINI           L CF   -5.40  -124  steam-tail unconfirmed_fat
  unconfirmed 4u tickets:
  2026-08-31 MLB ML Miami Marlins              pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -110  steam-tail unconfirmed_4u
  2026-09-01 MLB ML Colorado Rockies           pre    4u → T    0u  RANK           W CF   +5.08  127  steam-tail unconfirmed_4u
  2026-09-01 MLB ML New York Yankees           pre    4u → T    0u  RANK           W CF   +2.33  -172  steam-tail unconfirmed_4u
  2026-09-02 MLB TOTAL Under 8.5                  pre    4u → T    0u  TOP            L CF   -4.00  103  steam-tail unconfirmed_4u
  2026-09-05 UFC ML Michael Aljarouj           pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -109  steam-tail unconfirmed_4u
  2026-09-07 CFB ML SMU                        pre    4u → T    0u  CONFIRMED-Q1   W CF   +2.82  -142  steam-tail unconfirmed_4u
  2026-09-07 MLB ML Miami Marlins              pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -135  steam-tail unconfirmed_4u
  2026-09-08 MLB ML Toronto Blue Jays          pre    4u → T    0u  SHARP-LEAN     W CF   +2.35  -170  steam-tail unconfirmed_4u
  2026-09-08 MLB ML San Diego Padres           pre    4u → T    0u  CONFIRMED-Q1   W CF   +2.26  -177  steam-tail unconfirmed_4u
  2026-09-08 MLB SPREAD Toronto Blue Jays          pre    4u → T    0u  SHARP-LEAN     W CF   +1.19  -335  steam-tail unconfirmed_4u
  2026-09-08 MLB TOTAL Over 8.5                   pre    4u → T    0u  CONFIRMED-Q1   L CF   -4.00  104  steam-tail unconfirmed_4u
  2026-09-09 MLB ML Minnesota Twins            pre    4u → T    0u  CONFIRMED-Q1   L CF   -4.00  114  steam-tail unconfirmed_4u
  2026-09-09 MLB ML St. Louis Cardinals        pre    4u → T    0u  SHARP-LEAN     L CF   -4.00  -111  steam-tail unconfirmed_4u
  2026-09-09 MLB TOTAL Over 7.5                   pre    4u → T    0u  CONFIRMED-Q1   W CF   +4.00  -100  steam-tail unconfirmed_4u
  2026-09-12 MLB ML Tampa Bay Rays             pre    4u → T    0u  CONFIRMED-Q1   W CF   +3.01  -133  steam-tail unconfirmed_4u
  2026-09-12 UFC ML Tommy Gantt                pre    4u → T    0u  SHARP-LEAN     W CF   +1.10  -362  steam-tail unconfirmed_4u
  2026-09-12 MLB TOTAL Over 8.5                   pre 4.05u → T    0u  CONFIRMED-Q1   L CF   -4.05  -107  steam-tail unconfirmed_4u
  2026-09-14 MLB ML Minnesota Twins            pre 4.05u → T    0u  CONFIRMED-Q1   L CF   -4.05  115  steam-tail unconfirmed_4u

## 6. FAIL_OPEN leftover — the “maybe too wide” watch
**Through Sep 8** fail-open-sub4 CF 21 · 15-6 · 71.4% (50–86.2) · 35.5u · +10.99u · +31%
  arriving 2 · 2-0 · 100% (34.2–100) · 2.0u · +2.59u · +129.6%
  not arriving 19 · 13-6 · 68.4% (46–84.6) · 33.5u · +8.40u · +25.1%
  tickets:
  2026-08-19 MLB TOTAL Under 8.5                  pre    1u → T    2u  CONFIRMED-UNOPP W CF   +0.96  -104  fail-open-sub4  cell=ab_arriving
  2026-08-20 WNBA SPREAD Dallas Wings               pre  1.5u → T  1.5u  SHARP-LEAN     W CF   +1.43  -105  fail-open-sub4  cell=ab_no_steam
  2026-08-21 MLB ML Colorado Rockies           pre    2u → T    2u  SHARP-LEAN     L CF   -2.00  138  fail-open-sub4  cell=ab_no_steam
  2026-08-21 MLB TOTAL Under 10.5                 pre    1u → T    0u  CONFIRMED-UNOPP W CF   +1.06  106  fail-open-sub4  cell=ab_no_steam
  2026-08-21 MLB TOTAL Under 9.5                  pre    3u → T    3u  MINI           W CF   +1.76  -170  fail-open-sub4  cell=ab_no_steam
  2026-08-22 UFC ML Stan Dorsainvil            pre  1.5u → T  1.5u  CONFIRMED-Q1   W CF   +2.42  161  fail-open-sub4  cell=ab_no_steam
  2026-08-22 UFC ML Jackson McVey              pre    3u → T    3u  CONFIRMED-Q1   W CF   +1.74  -172  fail-open-sub4  cell=ab_no_steam
  2026-08-24 MLB ML San Francisco Giants       pre    1u → T    2u  DISSENT        W CF   +1.63  163  fail-open-sub4  cell=ab_arriving
  2026-08-24 MLB SPREAD Tampa Bay Rays             pre    1u → T    0u  DISSENT        W CF   +1.25  125  fail-open-sub4  cell=no_steam
  2026-08-28 MLB ML Minnesota Twins            pre    1u → T    0u  SHARP-LEAN     L CF   -1.00  -122  fail-open-sub4  cell=ab_already_on
  2026-08-28 MLB TOTAL Under 7.5                  pre    3u → T    3u  MINI           W CF   +3.03  101  fail-open-sub4  cell=ab_no_steam
  2026-08-28 MLB TOTAL Under 7.5                  pre    3u → T    3u  SHARP-LEAN     L CF   -3.00  -104  fail-open-sub4  cell=ab_no_steam
  2026-08-28 MLB TOTAL Under 7.5                  pre    3u → T    3u  MINI           W CF   +2.86  -105  fail-open-sub4  cell=ab_no_steam
  2026-08-29 MLB ML San Francisco Giants       pre    1u → T    0u  DISSENT        L CF   -1.00  117  fail-open-sub4  cell=no_steam
  2026-08-30 MLB SPREAD Milwaukee Brewers          pre  2.5u → T  2.5u  SHARP-LEAN     L CF   -2.50  126  fail-open-sub4  cell=no_steam
  2026-08-31 MLB TOTAL Over 8.5                   pre    1u → T    0u  DISSENT        W CF   +0.93  -108  fail-open-sub4  cell=no_steam
  2026-09-04 MLB SPREAD Milwaukee Brewers          pre    1u → T    0u  DISSENT        W CF   +1.02  102  fail-open-sub4  cell=no_steam
  2026-09-04 CFB TOTAL Under 59.5                 pre    2u → T    2u  FADE           L CF   -2.00  -117  fail-open-sub4  cell=ab_already_on
  2026-09-05 CFB ML Duke                       pre    1u → T    0u  CONFIRMED-UNOPP W CF   +0.35  -285  fail-open-sub4  cell=ab_no_steam
  2026-09-05 CFB SPREAD Iowa                       pre    1u → T    0u  MINI-          W CF   +1.00  -100  fail-open-sub4  cell=ab_no_steam
  2026-09-05 CFB TOTAL Under 58.5                 pre    1u → T    0u  CONFIRMED-UNOPP W CF   +1.05  105  fail-open-sub4  cell=steam_no_ab

**Sep 9+** fail-open-sub4 CF 5 · 5-0 · 100% (56.6–100) · 7.0u · +5.77u · +82.4%
  arriving —
  not arriving 5 · 5-0 · 100% (56.6–100) · 7.0u · +5.77u · +82.4%
  tickets:
  2026-09-11 MLB SPREAD Milwaukee Brewers          pre    1u → T    0u  SHARP-LEAN     W CF   +1.22  122  fail-open-sub4  cell=ab_already_on
  2026-09-12 CFB ML Maryland                   pre    1u → T    0u  MINI-          W CF   +0.23  -426  fail-open-sub4  cell=ab_no_steam
  2026-09-12 MLB ML Atlanta Braves             pre    1u → T    0u  DISSENT        W CF   +0.75  -134  fail-open-sub4  cell=ab_no_steam
  2026-09-12 CFB SPREAD Michigan                   pre    1u → T    0u  CONFIRMED-UNOPP W CF   +1.00  -100  fail-open-sub4  cell=ab_no_steam
  2026-09-14 MLB SPREAD Los Angeles Dodgers        pre    3u → T    3u  MINI           W CF   +2.56  -117  fail-open-sub4  cell=no_steam

**Full leftover era** fail-open-sub4 CF 26 · 20-6 · 76.9% (57.9–89) · 42.5u · +16.75u · +39.4%
  arriving 2 · 2-0 · 100% (34.2–100) · 2.0u · +2.59u · +129.6%
  not arriving 24 · 18-6 · 75% (55.1–88) · 40.5u · +14.16u · +35%
  tickets:
  2026-08-19 MLB TOTAL Under 8.5                  pre    1u → T    2u  CONFIRMED-UNOPP W CF   +0.96  -104  fail-open-sub4  cell=ab_arriving
  2026-08-20 WNBA SPREAD Dallas Wings               pre  1.5u → T  1.5u  SHARP-LEAN     W CF   +1.43  -105  fail-open-sub4  cell=ab_no_steam
  2026-08-21 MLB ML Colorado Rockies           pre    2u → T    2u  SHARP-LEAN     L CF   -2.00  138  fail-open-sub4  cell=ab_no_steam
  2026-08-21 MLB TOTAL Under 10.5                 pre    1u → T    0u  CONFIRMED-UNOPP W CF   +1.06  106  fail-open-sub4  cell=ab_no_steam
  2026-08-21 MLB TOTAL Under 9.5                  pre    3u → T    3u  MINI           W CF   +1.76  -170  fail-open-sub4  cell=ab_no_steam
  2026-08-22 UFC ML Stan Dorsainvil            pre  1.5u → T  1.5u  CONFIRMED-Q1   W CF   +2.42  161  fail-open-sub4  cell=ab_no_steam
  2026-08-22 UFC ML Jackson McVey              pre    3u → T    3u  CONFIRMED-Q1   W CF   +1.74  -172  fail-open-sub4  cell=ab_no_steam
  2026-08-24 MLB ML San Francisco Giants       pre    1u → T    2u  DISSENT        W CF   +1.63  163  fail-open-sub4  cell=ab_arriving
  2026-08-24 MLB SPREAD Tampa Bay Rays             pre    1u → T    0u  DISSENT        W CF   +1.25  125  fail-open-sub4  cell=no_steam
  2026-08-28 MLB ML Minnesota Twins            pre    1u → T    0u  SHARP-LEAN     L CF   -1.00  -122  fail-open-sub4  cell=ab_already_on
  2026-08-28 MLB TOTAL Under 7.5                  pre    3u → T    3u  MINI           W CF   +3.03  101  fail-open-sub4  cell=ab_no_steam
  2026-08-28 MLB TOTAL Under 7.5                  pre    3u → T    3u  SHARP-LEAN     L CF   -3.00  -104  fail-open-sub4  cell=ab_no_steam
  2026-08-28 MLB TOTAL Under 7.5                  pre    3u → T    3u  MINI           W CF   +2.86  -105  fail-open-sub4  cell=ab_no_steam
  2026-08-29 MLB ML San Francisco Giants       pre    1u → T    0u  DISSENT        L CF   -1.00  117  fail-open-sub4  cell=no_steam
  2026-08-30 MLB SPREAD Milwaukee Brewers          pre  2.5u → T  2.5u  SHARP-LEAN     L CF   -2.50  126  fail-open-sub4  cell=no_steam
  2026-08-31 MLB TOTAL Over 8.5                   pre    1u → T    0u  DISSENT        W CF   +0.93  -108  fail-open-sub4  cell=no_steam
  2026-09-04 MLB SPREAD Milwaukee Brewers          pre    1u → T    0u  DISSENT        W CF   +1.02  102  fail-open-sub4  cell=no_steam
  2026-09-04 CFB TOTAL Under 59.5                 pre    2u → T    2u  FADE           L CF   -2.00  -117  fail-open-sub4  cell=ab_already_on
  2026-09-05 CFB ML Duke                       pre    1u → T    0u  CONFIRMED-UNOPP W CF   +0.35  -285  fail-open-sub4  cell=ab_no_steam
  2026-09-05 CFB SPREAD Iowa                       pre    1u → T    0u  MINI-          W CF   +1.00  -100  fail-open-sub4  cell=ab_no_steam
  2026-09-05 CFB TOTAL Under 58.5                 pre    1u → T    0u  CONFIRMED-UNOPP W CF   +1.05  105  fail-open-sub4  cell=steam_no_ab
  2026-09-11 MLB SPREAD Milwaukee Brewers          pre    1u → T    0u  SHARP-LEAN     W CF   +1.22  122  fail-open-sub4  cell=ab_already_on
  2026-09-12 CFB ML Maryland                   pre    1u → T    0u  MINI-          W CF   +0.23  -426  fail-open-sub4  cell=ab_no_steam
  2026-09-12 MLB ML Atlanta Braves             pre    1u → T    0u  DISSENT        W CF   +0.75  -134  fail-open-sub4  cell=ab_no_steam
  2026-09-12 CFB SPREAD Michigan                   pre    1u → T    0u  CONFIRMED-UNOPP W CF   +1.00  -100  fail-open-sub4  cell=ab_no_steam
  2026-09-14 MLB SPREAD Los Angeles Dodgers        pre    3u → T    3u  MINI           W CF   +2.56  -117  fail-open-sub4  cell=no_steam

## 7. Other mutes that still eat steam tickets
**Full T era**
  any mute with steam-on or arriving CF 129 · 58-71 · 45% (36.6–53.6) · 231.6u · -30.29u · -13.1%
  of those, leftover 10 · 5-5 · 50% (23.7–76.3) · 18.0u · +0.19u · +1.1%
  of those, steam-tail 12 · 5-7 · 41.7% (19.3–68) · 12.0u · -2.67u · -22.3%
  of those, other 107 · 48-59 · 44.9% (35.8–54.3) · 201.6u · -27.81u · -13.8%
  tape-weak: all 61 · 33-28 · 54.1% · +1.0u · +1.1% · steam/arriving 10 · 6-4 · 60% · +1.0u · +5.2%
  qconv-q1: all 27 · 14-13 · 51.9% · +0.1u · +0.2% · steam/arriving 4 · 3-1 · 75% · +3.9u · +78.2%
  fools-gold-flat: all 25 · 10-15 · 40% · -27.6u · -32.5% · steam/arriving 11 · 5-6 · 45.5% · -9.5u · -22.4%
  maxsr-sub4: all 59 · 32-27 · 54.2% · +11.8u · +13.1% · steam/arriving 10 · 4-6 · 40% · -3.8u · -21.9%
  ev-drift-edge: all 8 · 3-5 · 37.5% · -18.2u · -45.5% · steam/arriving 2 · 0-2 · 0% · -9.4u · -100%
  fav-juice: all 8 · 6-2 · 75% · -3.0u · -10.4% · steam/arriving 3 · 2-1 · 66.7% · -0.8u · -5.6%
  winner_align_fade: all 29 · 14-15 · 48.3% · +9.8u · +20.6% · steam/arriving 8 · 4-4 · 50% · +6.2u · +46.4%
  top-crowded: all 20 · 14-6 · 70% · +6.7u · +15.2% · steam/arriving 6 · 4-2 · 66.7% · +0.8u · +4.1%
  ags-quality-veto: all 40 · 22-18 · 55% · -13.8u · -19.4% · steam/arriving 12 · 6-6 · 50% · -1.4u · -9.7%

**Sep 9+**
  any mute with steam-on or arriving CF 74 · 36-38 · 48.6% (37.6–59.8) · 146.3u · -15.49u · -10.6%
  of those, leftover 5 · 2-3 · 40% (11.8–76.9) · 10.5u · -2.16u · -20.6%
  of those, steam-tail 5 · 1-4 · 20% (3.6–62.4) · 5.0u · -3.41u · -68.2%
  of those, other 64 · 33-31 · 51.6% (39.6–63.4) · 130.8u · -9.92u · -7.6%
  tape-weak: all 27 · 17-10 · 63% · +4.6u · +10.1% · steam/arriving 4 · 1-3 · 25% · -6.3u · -70.6%
  qconv-q1: all 12 · 5-7 · 41.7% · -4.9u · -28% · steam/arriving 3 · 2-1 · 66.7% · +2.5u · +61.7%
  fools-gold-flat: all 20 · 7-13 · 35% · -28.4u · -40% · steam/arriving 11 · 5-6 · 45.5% · -9.5u · -22.4%
  maxsr-sub4: all 25 · 14-11 · 56% · +9.6u · +22.5% · steam/arriving 3 · 1-2 · 33.3% · -0.8u · -13.1%
  ev-drift-edge: all 5 · 3-2 · 60% · -3.4u · -13.5% · steam/arriving 1 · 0-1 · 0% · -5.4u · -100%
  fav-juice: all 2 · 2-0 · 100% · +2.2u · +20.7% · steam/arriving 2 · 2-0 · 100% · +2.2u · +20.7%
  winner_align_fade: all 11 · 3-8 · 27.3% · -8.2u · -51.6% · steam/arriving 3 · 1-2 · 33.3% · +0.6u · +20%
  top-crowded: all 10 · 7-3 · 70% · +7.8u · +28.6% · steam/arriving 5 · 4-1 · 80% · +6.2u · +45.7%
  ags-quality-veto: all 16 · 11-5 · 68.8% · +0.6u · +3% · steam/arriving 8 · 6-2 · 75% · +4.6u · +58%

## 8. Counterfactual menus (T era, extra days included)
Actual T-era live book: 131 · 77-54 · 58.8% (50.2–66.8) · 413.1u · +61.82u · +15%
  + leftover×arriving at T size (through today): would add 3 · 3-0 · 100% (43.8–100) · 7.5u · +8.28u · +110.4% → combined live 134 · +70.1u
  + fail-open-sub4 that T would ship (2–3u / arriving floor): would add 2 · 1-1 · 50% (9.5–90.5) · 5.0u · +0.56u · +11.3% → combined live 133 · +62.4u
  + ALL fail-open-sub4 at pre units: would add 11 · 10-1 · 90.9% (62.3–98.4) · 14.0u · +8.11u · +57.9% → combined live 142 · +69.9u
  + unconfirmed fat: would add 14 · 9-5 · 64.3% (38.8–83.7) · 76.2u · +8.62u · +11.3% → combined live 145 · +70.4u
  + unconfirmed 4u: would add 18 · 9-9 · 50% (29–71) · 72.1u · -11.96u · -16.6% → combined live 149 · +49.9u
  + lean_no_arriving 1u: would add 99 · 51-48 · 51.5% (41.8–61.1) · 99.0u · +0.54u · +0.5% → combined live 230 · +62.4u
  + believed-cut no-steam: would add 40 · 19-21 · 47.5% (32.9–62.5) · 66.5u · -1.81u · -2.7% → combined live 171 · +60.0u

## 9. Daily live board (T era)
| Date | Live | W-L | WR | PnL | Muted | steam-tail | leftover |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-31 | 5 | 4-1 | 80% | +3.74 | 22 | 6 | 2 |
| 2026-09-01 | 4 | 4-0 | 100% | +16.82 | 31 | 11 | 3 |
| 2026-09-02 | 5 | 3-2 | 60% | +4.88 | 33 | 12 | 1 |
| 2026-09-03 | 6 | 5-1 | 83.3% | +9.23 | 16 | 4 | 0 |
| 2026-09-04 | 7 | 5-2 | 71.4% | +6.05 | 44 | 11 | 6 |
| 2026-09-05 | 9 | 6-3 | 66.7% | +7.72 | 80 | 11 | 11 |
| 2026-09-06 | 7 | 5-2 | 71.4% | +7.23 | 37 | 10 | 4 |
| 2026-09-07 | 7 | 5-2 | 71.4% | +7.22 | 28 | 6 | 2 |
| 2026-09-08 | 9 | 4-5 | 44.4% | -1.59 | 25 | 12 | 2 |
| 2026-09-09 | 5 | 2-3 | 40% | -2.44 | 33 | 8 | 5 |
| 2026-09-10 | 5 | 0-5 | 0% | -13.50 | 8 | 0 | 1 |
| 2026-09-11 | 10 | 5-5 | 50% | -6.08 | 32 | 11 | 5 |
| 2026-09-12 | 18 | 12-6 | 66.7% | +25.91 | 113 | 13 | 5 |
| 2026-09-13 | 16 | 9-7 | 56.3% | +7.01 | 50 | 11 | 4 |
| 2026-09-14 | 7 | 4-3 | 57.1% | +0.91 | 23 | 3 | 3 |
| 2026-09-15 | 11 | 4-7 | 36.4% | -11.29 | 29 | 2 | 4 |

