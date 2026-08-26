# Sub-4 mute vs 4u+ infection — counterfactual
Window: pick date ≥ **2026-08-19** (flinch live; maxSR mute from 2026-08-20)
Generated: 2026-08-26T13:51:41.895Z
AGS-U graded sides in window: **280**

Rules:
- **Sub-4 ACTUAL** = shipped `finalUnits` in (0, 4)
- **Sub-4 as-if-no-mute** = ACTUAL + restored picks muted by `believed-cut` / `fail-open-sub4` / `maxsr-sub4` at pre-mute units
- **4u+ ACTUAL** = shipped `finalUnits ≥ 4`
- **4u+ cleaned** = drop FAIL_OPEN OR maxSR&lt;1 (the ≥4 exempt infection)

## A) Sub-4 — ACTUAL (with mutes) vs AS-IF no mute

### With current change (ACTUAL shipped sub-4)
n=81  41–40  WR 50.6%  stake 114.5u  PnL +1.38u  ROI +1.2%

### As if no change (shipped sub-4 + restored mutes at pre-mute units)
n=140  65–75  WR 46.4%  stake 218.0u  PnL -12.84u  ROI -5.9%

### Muted picks only (what we cut — CF flat at pre-mute size)
n=59  24–35  WR 40.7%  stake 103.5u  PnL -14.22u  ROI -13.7%
Muted count: **59**

### Improvement (actual − as-if-no-mute)
ΔPnL: **+14.22u** (positive = mutes helped)
ΔWR: actual 50.6% vs no-mute 46.4%
ΔROI: actual +1.2% vs no-mute -5.9%

### Muted by reason
| mutedBy | n | W–L | WR | CF stake | CF PnL | CF ROI |
|---------|--:|:---:|---:|---------:|-------:|-------:|
| believed-cut | 21 | 10–11 | 47.6% | 43.50u | +4.65u | +10.7% |
| fail-open-sub4 | 9 | 8–1 | 88.9% | 15.00u | +10.25u | +68.4% |
| maxsr-sub4 | 29 | 6–23 | 20.7% | 45.00u | -29.12u | -64.7% |

## A2) Sub-4 muted pick list (results)

| Date | Sport | Pick | Path | Pre-u | mutedBy | Tape | maxSR | Odds | R | CF PnL |
|------|-------|------|------|------:|---------|------|------:|-----:|:-:|-------:|
| 2026-08-19 | MLB | Under 8.5 | CONFIRMED-UNOPP | 1.00 | fail-open-sub4 | FAIL_OPEN | 0.16 | -104 | W | +0.96u |
| 2026-08-19 | MLB | Miami Marlins | TOP | 1.00 | believed-cut | HOLD | 3.35 | 124 | L | -1.00u |
| 2026-08-19 | MLB | Milwaukee Brewers | RANK | 1.50 | believed-cut | HOLD | 1.00 | 170 | L | -1.50u |
| 2026-08-20 | MLB | Chicago White Sox | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | HOLD | 0.56 | -104 | L | -1.00u |
| 2026-08-20 | MLB | San Francisco Giants | CONFIRMED-Q1 | 1.50 | maxsr-sub4 | HOLD | 0.84 | 188 | L | -1.50u |
| 2026-08-20 | WNBA | Las Vegas Aces | CONFIRMED-Q1 | 2.00 | maxsr-sub4 | HOLD | 0.55 | 112 | W | +2.24u |
| 2026-08-20 | WNBA | Dallas Wings | SHARP-LEAN | 1.50 | fail-open-sub4 | FAIL_OPEN | 1.24 | -105 | W | +1.43u |
| 2026-08-21 | MLB | Chicago Cubs | CONFIRMED-Q1 | 3.00 | believed-cut | BOOST | 2.20 | 104 | L | -3.00u |
| 2026-08-21 | MLB | Cincinnati Reds | SUPER | 1.00 | believed-cut | BOOST | 3.39 | 132 | L | -1.00u |
| 2026-08-21 | MLB | Colorado Rockies | SHARP-LEAN | 2.00 | fail-open-sub4 | FAIL_OPEN | 0.44 | 138 | L | -2.00u |
| 2026-08-21 | MLB | Under 10.5 | CONFIRMED-UNOPP | 1.00 | fail-open-sub4 | FAIL_OPEN | 0.32 | 106 | W | +1.06u |
| 2026-08-21 | MLB | Athletics | SHARP-LEAN | 1.50 | maxsr-sub4 | HOLD | 0.27 | 163 | L | -1.50u |
| 2026-08-21 | MLB | Under 9.5 | MINI | 3.00 | fail-open-sub4 | FAIL_OPEN | 1.35 | -170 | W | +1.76u |
| 2026-08-21 | MLB | Boston Red Sox | SHARP | 3.00 | believed-cut | BOOST | 0.34 | -172 | W | +1.74u |
| 2026-08-21 | MLB | Over 8.5 | TOP | 1.00 | believed-cut | HOLD | 4.80 | 175 | W | +1.75u |
| 2026-08-21 | MLB | Under 8.5 | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | PASS | 0.65 | -117 | L | -1.00u |
| 2026-08-21 | MLB | Tampa Bay Rays | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | HOLD | 0.93 | 117 | L | -1.00u |
| 2026-08-21 | WNBA | Golden State Valkyries | CONFIRMED-Q1 | 3.00 | maxsr-sub4 | HOLD | 0.81 | -102 | L | -3.00u |
| 2026-08-21 | WNBA | Washington Mystics | CONFIRMED-Q1 | 3.00 | maxsr-sub4 | HOLD | 0.41 | 110 | L | -3.00u |
| 2026-08-21 | WNBA | Washington Mystics | CONFIRMED-Q1 | 3.00 | maxsr-sub4 | MUTE | 1.19 | -104 | L | -3.00u |
| 2026-08-22 | MLB | Seattle Mariners | TOP | 1.50 | believed-cut | BOOST | 3.04 | 165 | L | -1.50u |
| 2026-08-22 | MLB | Arizona Diamondbacks | RANK | 3.00 | maxsr-sub4 | HOLD | 0.87 | -182 | L | -3.00u |
| 2026-08-22 | MLB | Colorado Rockies | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | HOLD | 0.46 | 131 | L | -1.00u |
| 2026-08-22 | MLB | Over 8.5 | TOP | 2.50 | believed-cut | BOOST | 4.35 | 122 | W | +3.05u |
| 2026-08-22 | MLB | Chicago White Sox | RANK | 3.00 | maxsr-sub4 | HOLD | 0.61 | -104 | L | -3.00u |
| 2026-08-22 | MLB | Chicago White Sox | SHARP | 1.00 | maxsr-sub4 | HOLD | 0.03 | -170 | L | -1.00u |
| 2026-08-22 | MLB | St. Louis Cardinals | SHARP-LEAN | 1.00 | maxsr-sub4 | HOLD | 0.03 | -233 | L | -1.00u |
| 2026-08-22 | MLB | Under 8.5 | TOP | 1.00 | maxsr-sub4 | HOLD | 0.91 | 118 | L | -1.00u |
| 2026-08-22 | NFL | Bills | SHARP | 2.50 | believed-cut | BOOST | 0.89 | 124 | W | +3.10u |
| 2026-08-22 | SOC | Brentford FC | SHARP | 2.50 | believed-cut | BOOST | 0.36 | 122 | W | +3.05u |
| 2026-08-22 | UFC | Anthony Hernandez | SHARP | 3.00 | believed-cut | BOOST | 2.60 | -200 | L | -3.00u |
| 2026-08-22 | UFC | Stan Dorsainvil | CONFIRMED-Q1 | 1.50 | fail-open-sub4 | FAIL_OPEN | 5.67 | 161 | W | +2.42u |
| 2026-08-22 | UFC | Jackson McVey | CONFIRMED-Q1 | 3.00 | fail-open-sub4 | FAIL_OPEN | 1.00 | -172 | W | +1.74u |
| 2026-08-23 | MLB | Chicago Cubs | DISSENT | 1.00 | maxsr-sub4 | HOLD | 0.23 | -118 | W | +0.85u |
| 2026-08-23 | MLB | Colorado Rockies | SHARP-LEAN | 1.00 | maxsr-sub4 | HOLD | 0.15 | 156 | L | -1.00u |
| 2026-08-23 | MLB | Over 11.5 | DISSENT | 1.00 | maxsr-sub4 | HOLD | 0.28 | 133 | L | -1.00u |
| 2026-08-23 | MLB | Under 8.5 | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | HOLD | 0.91 | -100 | L | -1.00u |
| 2026-08-23 | SOC | Aston Villa FC | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | HOLD | 0.47 | 260 | L | -1.00u |
| 2026-08-23 | SOC | Liverpool FC | CONFIRMED-UNOPP | 1.00 | believed-cut | BOOST | 43.79 | -110 | L | -1.00u |
| 2026-08-23 | WNBA | Indiana Fever | MINI | 3.00 | believed-cut | BOOST | 2.20 | -105 | W | +2.86u |
| 2026-08-24 | MLB | Under 7.5 | CONFIRMED-Q1 | 2.00 | maxsr-sub4 | HOLD | 1.34 | 105 | W | +2.10u |
| 2026-08-24 | MLB | Chicago Cubs | SHARP-LEAN | 3.00 | believed-cut | HOLD | 0.92 | -131 | W | +2.29u |
| 2026-08-24 | MLB | San Francisco Giants | DISSENT | 1.00 | fail-open-sub4 | FAIL_OPEN | 0.91 | 163 | W | +1.63u |
| 2026-08-24 | MLB | Under 8.5 | SHARP | 1.00 | believed-cut | BOOST | 1.12 | 102 | L | -1.00u |
| 2026-08-24 | MLB | Athletics | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | MUTE | 0.45 | 133 | L | -1.00u |
| 2026-08-24 | MLB | Pittsburgh Pirates | RANK | 1.50 | believed-cut | HOLD | 1.34 | 170 | L | -1.50u |
| 2026-08-24 | MLB | Tampa Bay Rays | DISSENT | 1.00 | fail-open-sub4 | FAIL_OPEN | 4.27 | 125 | W | +1.25u |
| 2026-08-24 | WNBA | Atlanta Dream | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | PASS | 0.97 | -105 | L | -1.00u |
| 2026-08-24 | WNBA | Golden State Valkyries | RANK | 1.50 | believed-cut | HOLD | 2.94 | 180 | W | +2.70u |
| 2026-08-25 | MLB | Baltimore Orioles | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | MUTE | 0.47 | 117 | W | +1.17u |
| 2026-08-25 | MLB | Under 7.5 | CONFIRMED-Q1 | 2.00 | believed-cut | BOOST | 2.55 | -194 | W | +1.03u |
| 2026-08-25 | MLB | Los Angeles Angels | RANK | 2.50 | believed-cut | HOLD | 2.11 | 131 | L | -2.50u |
| 2026-08-25 | MLB | Los Angeles Angels | MINI- | 2.00 | maxsr-sub4 | HOLD | 0.90 | -127 | L | -2.00u |
| 2026-08-25 | MLB | Over 7.5 | RANK | 2.50 | believed-cut | HOLD | 0.69 | 123 | W | +3.08u |
| 2026-08-25 | MLB | Kansas City Royals | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | MUTE | 0.45 | 122 | W | +1.22u |
| 2026-08-25 | MLB | Tampa Bay Rays | SHARP | 3.00 | believed-cut | BOOST | 2.33 | -124 | L | -3.00u |
| 2026-08-25 | MLB | Texas Rangers | RANK | 3.00 | maxsr-sub4 | HOLD | 0.46 | -389 | L | -3.00u |
| 2026-08-25 | WNBA | Chicago Sky | CONFIRMED-UNOPP | 1.00 | maxsr-sub4 | HOLD | 0.25 | -220 | L | -1.00u |
| 2026-08-25 | WNBA | Dallas Wings | SHARP-LEAN | 1.00 | maxsr-sub4 | HOLD | 0.25 | -335 | W | +0.30u |

## B) 4u+ same window — ACTUAL vs if we muted FAIL_OPEN / maxSR&lt;1

### ACTUAL 4u+ (what we shipped)
n=30  17–13  WR 56.7%  stake 159.0u  PnL -1.91u  ROI -1.2%

### Counterfactual 4u+ (remove FAIL_OPEN + maxSR&lt;1)
n=21  11–10  WR 52.4%  stake 112.0u  PnL -12.65u  ROI -11.3%

### Would-mute 4u+ only (infection candidates)
n=9  6–3  WR 66.7%  stake 47.0u  PnL +10.74u  ROI +22.9%
Would-mute count: **9**

### Lift if we had cut them
ΔPnL: **-10.74u** (positive = cutting infection helps)
ΔWR: actual 56.7% → cleaned 52.4%
ΔROI: actual -1.2% → cleaned -11.3%

### Would-mute by reason
| Reason | n | W–L | WR | Stake | PnL | ROI |
|--------|--:|:---:|---:|------:|----:|----:|
| maxsr_lt1 | 9 | 6–3 | 66.7% | 47.00u | +10.74u | +22.9% |

## B2) 4u+ picks we WOULD have muted (results)

| Date | Sport | Pick | Path | Units | Reason | Tape | maxSR | Odds | R | Actual PnL |
|------|-------|------|------|------:|--------|------|------:|-----:|:-:|-----------:|
| 2026-08-20 | NFL | Raiders | SHARP-LEAN | 5.40 | maxsr_lt1 | BOOST | 0.67 | -126 | W | +4.29u |
| 2026-08-21 | NFL | Jaguars | SHARP | 5.40 | maxsr_lt1 | BOOST | 0.84 | 116 | L | -5.40u |
| 2026-08-21 | NFL | Over 37.5 | SHARP-LEAN | 5.40 | maxsr_lt1 | BOOST | 0.33 | -105 | L | -5.40u |
| 2026-08-22 | MLB | Under 9.5 | SHARP | 5.40 | maxsr_lt1 | BOOST | 0.03 | -186 | W | +2.90u |
| 2026-08-22 | NFL | Cowboys | SHARP-LEAN | 5.40 | maxsr_lt1 | BOOST | 0.29 | -125 | W | +4.32u |
| 2026-08-23 | WNBA | Washington Mystics | RANK | 6.00 | maxsr_lt1 | BOOST | 0.83 | 122 | W | +7.32u |
| 2026-08-24 | MLB | Chicago Cubs | SHARP-LEAN | 4.00 | maxsr_lt1 | HOLD | 0.77 | -400 | W | +1.00u |
| 2026-08-25 | MLB | San Francisco Giants | RANK | 6.00 | maxsr_lt1 | BOOST | 0.83 | -105 | W | +5.71u |
| 2026-08-25 | MLB | Philadelphia Phillies | SHARP-LEAN | 4.00 | maxsr_lt1 | HOLD | 0.19 | 104 | L | -4.00u |

## C) Side-by-side summary

| Book | Actual | Counterfactual | ΔPnL |
|------|--------|----------------|------|
| Sub-4 | n=81  41–40  WR 50.6%  stake 114.5u  PnL +1.38u  ROI +1.2% | no-mute n=140  65–75  WR 46.4%  stake 218.0u  PnL -12.84u  ROI -5.9% | +14.22u |
| 4u+ | n=30  17–13  WR 56.7%  stake 159.0u  PnL -1.91u  ROI -1.2% | cleaned n=21  11–10  WR 52.4%  stake 112.0u  PnL -12.65u  ROI -11.3% | -10.74u |

Read:
- Sub-4 mutes **helped** by 14.22u vs shipping those leftovers.
- Extending FAIL_OPEN/maxSR&lt;1 mute to 4u+ would have **hurt** by 10.74u in this window.
