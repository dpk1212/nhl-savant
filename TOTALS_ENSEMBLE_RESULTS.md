# ENSEMBLE TOTALS MODEL - TEST RESULTS

**Test Date:** 2025-10-31
**Sample Size:** 120 regulation games

## Executive Summary

**Goal:** Improve totals prediction (RMSE) without affecting win prediction accuracy (64.7%)

### Results

| Metric | Current Model | Ensemble Model | Change |
|--------|---------------|----------------|--------|
| RMSE | 2.371 | 2.330 | +1.7% |
| Bias | -0.154 | 0.010 | +0.144 |
| Win Accuracy | 62.5% | 62.5% | 0.0% |

## Ensemble Model Composition

The ensemble combines three independent models:

1. **xG-Based (40% weight):** Uses expected goals from current model
2. **Goals-Based (30% weight):** Uses actual goals/game with same regression
3. **Recency-Based (30% weight):** Uses last 5 games with weighted averaging

## Game-by-Game Results

| Date | Matchup | Actual | Current Total | Ensemble Total | Current Error | Ensemble Error | Win | |
|------|---------|--------|---------------|----------------|---------------|----------------|-----|--|
| 10/7/2025 | Chicago Blackhawks @ Florida Panthers | 2-3 (5) | 6.14 | 6.07 | 1.14 | 1.07 | 61.1% | ✅ |
| 10/7/2025 | Pittsburgh Penguins @ New York Rangers | 3-0 (3) | 6.28 | 6.08 | 3.28 | 3.08 | 51.3% | ❌ |
| 10/7/2025 | Colorado Avalanche @ Los Angeles Kings | 4-1 (5) | 5.65 | 5.97 | 0.65 | 0.97 | 38.2% | ✅ |
| 10/8/2025 | Montreal Canadiens @ Toronto Maple Leafs | 2-5 (7) | 6.04 | 6.23 | -0.96 | -0.77 | 60.8% | ✅ |
| 10/8/2025 | Boston Bruins @ Washington Capitals | 3-1 (4) | 6.24 | 6.20 | 2.24 | 2.20 | 61.3% | ❌ |
| 10/9/2025 | New York Rangers @ Buffalo Sabres | 4-0 (4) | 5.99 | 5.98 | 1.99 | 1.98 | 44.2% | ✅ |
| 10/9/2025 | Montreal Canadiens @ Detroit Red Wings | 5-1 (6) | 5.92 | 6.12 | -0.08 | 0.12 | 57.8% | ❌ |
| 10/9/2025 | Ottawa Senators @ Tampa Bay Lightning | 5-4 (9) | 5.73 | 6.14 | -3.27 | -2.86 | 51.6% | ❌ |
| 10/9/2025 | Philadelphia Flyers @ Florida Panthers | 1-2 (3) | 5.90 | 6.00 | 2.90 | 3.00 | 45.8% | ❌ |
| 10/9/2025 | New York Islanders @ Pittsburgh Penguins | 3-4 (7) | 6.66 | 6.48 | -0.34 | -0.52 | 57.7% | ✅ |
| 10/9/2025 | New Jersey Devils @ Carolina Hurricanes | 3-6 (9) | 6.14 | 6.38 | -2.86 | -2.62 | 56.9% | ✅ |
| 10/9/2025 | Minnesota Wild @ St. Louis Blues | 5-0 (5) | 6.02 | 6.23 | 1.02 | 1.23 | 52.5% | ❌ |
| 10/9/2025 | Columbus Blue Jackets @ Nashville Predators | 1-2 (3) | 6.43 | 6.29 | 3.43 | 3.29 | 52.6% | ✅ |
| 10/9/2025 | Dallas Stars @ Winnipeg Jets | 5-4 (9) | 7.09 | 6.71 | -1.91 | -2.29 | 48.2% | ✅ |
| 10/9/2025 | Calgary Flames @ Vancouver Canucks | 1-5 (6) | 6.29 | 6.29 | 0.29 | 0.29 | 58.9% | ✅ |
| 10/9/2025 | Anaheim Ducks @ Seattle Kraken | 1-3 (4) | 6.12 | 6.26 | 2.12 | 2.26 | 58.1% | ✅ |
| 10/11/2025 | Los Angeles Kings @ Winnipeg Jets | 2-3 (5) | 6.23 | 6.30 | 1.23 | 1.30 | 58.0% | ✅ |
| 10/11/2025 | St. Louis Blues @ Calgary Flames | 4-2 (6) | 5.72 | 6.17 | -0.28 | 0.17 | 46.4% | ✅ |
| 10/11/2025 | Buffalo Sabres @ Boston Bruins | 1-3 (4) | 5.96 | 6.14 | 1.96 | 2.14 | 55.3% | ✅ |
| 10/11/2025 | Toronto Maple Leafs @ Detroit Red Wings | 3-6 (9) | 5.75 | 6.09 | -3.25 | -2.91 | 51.5% | ✅ |
| 10/11/2025 | New Jersey Devils @ Tampa Bay Lightning | 5-3 (8) | 5.49 | 6.04 | -2.51 | -1.96 | 43.8% | ✅ |
| 10/11/2025 | Ottawa Senators @ Florida Panthers | 2-6 (8) | 5.71 | 6.01 | -2.29 | -1.99 | 55.4% | ✅ |
| 10/11/2025 | Washington Capitals @ New York Islanders | 4-2 (6) | 6.66 | 6.43 | 0.66 | 0.43 | 45.7% | ✅ |
| 10/11/2025 | New York Rangers @ Pittsburgh Penguins | 6-1 (7) | 6.27 | 6.07 | -0.73 | -0.93 | 53.0% | ❌ |
| 10/11/2025 | Montreal Canadiens @ Chicago Blackhawks | 3-2 (5) | 6.12 | 6.18 | 1.12 | 1.18 | 43.7% | ✅ |
| 10/11/2025 | Columbus Blue Jackets @ Minnesota Wild | 7-4 (11) | 6.35 | 6.21 | -4.65 | -4.79 | 57.9% | ❌ |
| 10/11/2025 | Vancouver Canucks @ Edmonton Oilers | 1-3 (4) | 6.29 | 6.17 | 2.29 | 2.17 | 59.8% | ✅ |
| 10/12/2025 | Washington Capitals @ New York Rangers | 1-0 (1) | 6.14 | 5.98 | 5.14 | 4.98 | 50.8% | ❌ |
| 10/13/2025 | Colorado Avalanche @ Buffalo Sabres | 3-1 (4) | 5.82 | 6.03 | 1.82 | 2.03 | 38.8% | ✅ |
| 10/13/2025 | Tampa Bay Lightning @ Boston Bruins | 4-3 (7) | 6.00 | 6.20 | -1.00 | -0.80 | 52.8% | ❌ |
| 10/13/2025 | Nashville Predators @ Ottawa Senators | 4-1 (5) | 5.81 | 6.13 | 0.81 | 1.13 | 52.1% | ❌ |
| 10/13/2025 | Winnipeg Jets @ New York Islanders | 5-2 (7) | 6.69 | 6.58 | -0.31 | -0.42 | 53.7% | ❌ |
| 10/13/2025 | Detroit Red Wings @ Toronto Maple Leafs | 3-2 (5) | 5.76 | 6.10 | 0.76 | 1.10 | 52.7% | ❌ |
| 10/13/2025 | Florida Panthers @ Philadelphia Flyers | 2-5 (7) | 5.85 | 5.98 | -1.15 | -1.02 | 59.1% | ✅ |
| 10/13/2025 | New Jersey Devils @ Columbus Blue Jackets | 3-2 (5) | 6.22 | 6.28 | 1.22 | 1.28 | 37.9% | ✅ |
| 10/13/2025 | St. Louis Blues @ Vancouver Canucks | 5-2 (7) | 6.38 | 6.40 | -0.62 | -0.60 | 47.5% | ✅ |
| 10/14/2025 | Nashville Predators @ Toronto Maple Leafs | 4-7 (11) | 6.01 | 5.86 | -4.99 | -5.14 | 63.5% | ✅ |
| 10/14/2025 | Edmonton Oilers @ New York Rangers | 2-0 (2) | 5.88 | 5.88 | 3.88 | 3.88 | 50.9% | ❌ |
| 10/14/2025 | Vegas Golden Knights @ Calgary Flames | 4-2 (6) | 6.11 | 5.74 | 0.11 | -0.26 | 39.2% | ✅ |
| 10/14/2025 | Minnesota Wild @ Dallas Stars | 2-5 (7) | 6.54 | 6.38 | -0.46 | -0.62 | 52.8% | ✅ |
| 10/14/2025 | Carolina Hurricanes @ San Jose Sharks | 5-1 (6) | 6.67 | 6.63 | 0.67 | 0.63 | 33.9% | ✅ |
| 10/14/2025 | Pittsburgh Penguins @ Anaheim Ducks | 3-4 (7) | 6.52 | 6.38 | -0.48 | -0.62 | 52.6% | ✅ |
| 10/15/2025 | Ottawa Senators @ Buffalo Sabres | 4-8 (12) | 5.86 | 5.14 | -6.14 | -6.86 | 50.2% | ✅ |
| 10/15/2025 | Florida Panthers @ Detroit Red Wings | 1-4 (5) | 5.78 | 6.04 | 0.78 | 1.04 | 59.5% | ✅ |
| 10/15/2025 | Chicago Blackhawks @ St. Louis Blues | 8-3 (11) | 5.84 | 5.91 | -5.16 | -5.09 | 55.5% | ❌ |
| 10/16/2025 | Florida Panthers @ New Jersey Devils | 1-3 (4) | 5.78 | 6.01 | 1.78 | 2.01 | 60.4% | ✅ |
| 10/16/2025 | Edmonton Oilers @ New York Islanders | 2-4 (6) | 6.32 | 5.72 | 0.32 | -0.28 | 47.3% | ❌ |
| 10/16/2025 | Winnipeg Jets @ Philadelphia Flyers | 5-2 (7) | 6.31 | 6.31 | -0.69 | -0.69 | 59.0% | ❌ |
| 10/16/2025 | Colorado Avalanche @ Columbus Blue Jackets | 4-1 (5) | 6.19 | 6.20 | 1.19 | 1.20 | 38.7% | ✅ |
| 10/16/2025 | Vancouver Canucks @ Dallas Stars | 5-3 (8) | 6.98 | 6.61 | -1.02 | -1.39 | 56.9% | ❌ |
| 10/16/2025 | Boston Bruins @ Vegas Golden Knights | 5-6 (11) | 6.20 | 6.39 | -4.80 | -4.61 | 58.9% | ✅ |
| 10/16/2025 | Carolina Hurricanes @ Anaheim Ducks | 4-1 (5) | 6.57 | 6.90 | 1.57 | 1.90 | 46.1% | ✅ |
| 10/16/2025 | Pittsburgh Penguins @ Los Angeles Kings | 4-2 (6) | 6.17 | 6.10 | 0.17 | 0.10 | 40.3% | ✅ |
| 10/17/2025 | Minnesota Wild @ Washington Capitals | 1-5 (6) | 6.19 | 6.11 | 0.19 | 0.11 | 57.8% | ✅ |
| 10/18/2025 | Florida Panthers @ Buffalo Sabres | 0-3 (3) | 5.95 | 5.90 | 2.95 | 2.90 | 48.3% | ❌ |
| 10/18/2025 | New York Islanders @ Ottawa Senators | 5-4 (9) | 6.18 | 6.39 | -2.82 | -2.61 | 49.0% | ✅ |
| 10/18/2025 | Edmonton Oilers @ New Jersey Devils | 3-5 (8) | 5.75 | 5.98 | -2.25 | -2.02 | 55.5% | ✅ |
| 10/18/2025 | New York Rangers @ Montreal Canadiens | 4-3 (7) | 5.97 | 6.01 | -1.03 | -0.99 | 49.0% | ✅ |
| 10/18/2025 | Tampa Bay Lightning @ Columbus Blue Jackets | 2-3 (5) | 6.00 | 5.95 | 1.00 | 0.95 | 48.4% | ❌ |
| 10/18/2025 | Dallas Stars @ St. Louis Blues | 1-3 (4) | 6.60 | 6.92 | 2.60 | 2.92 | 52.1% | ✅ |
| 10/18/2025 | Nashville Predators @ Winnipeg Jets | 1-4 (5) | 6.42 | 6.79 | 1.42 | 1.79 | 56.1% | ✅ |
| 10/18/2025 | Boston Bruins @ Colorado Avalanche | 1-4 (5) | 5.83 | 6.62 | 0.83 | 1.62 | 62.4% | ✅ |
| 10/18/2025 | Calgary Flames @ Vegas Golden Knights | 1-6 (7) | 6.12 | 6.35 | -0.88 | -0.65 | 64.0% | ✅ |
| 10/18/2025 | Pittsburgh Penguins @ San Jose Sharks | 3-0 (3) | 6.50 | 6.51 | 3.50 | 3.51 | 41.6% | ✅ |
| 10/19/2025 | Vancouver Canucks @ Washington Capitals | 4-3 (7) | 6.54 | 6.61 | -0.46 | -0.39 | 59.1% | ❌ |
| 10/19/2025 | Edmonton Oilers @ Detroit Red Wings | 2-4 (6) | 5.67 | 6.07 | -0.33 | 0.07 | 54.0% | ✅ |
| 10/20/2025 | Minnesota Wild @ New York Rangers | 3-1 (4) | 5.94 | 5.57 | 1.94 | 1.57 | 54.6% | ❌ |
| 10/20/2025 | Seattle Kraken @ Philadelphia Flyers | 2-5 (7) | 5.75 | 6.21 | -1.25 | -0.79 | 45.3% | ❌ |
| 10/20/2025 | Buffalo Sabres @ Montreal Canadiens | 2-4 (6) | 6.29 | 6.71 | 0.29 | 0.71 | 58.3% | ✅ |
| 10/20/2025 | Winnipeg Jets @ Calgary Flames | 2-1 (3) | 6.24 | 6.35 | 3.24 | 3.35 | 43.7% | ✅ |
| 10/20/2025 | Carolina Hurricanes @ Vegas Golden Knights | 1-4 (5) | 6.51 | 7.55 | 1.51 | 2.55 | 41.3% | ❌ |
| 10/21/2025 | New Jersey Devils @ Toronto Maple Leafs | 5-2 (7) | 5.81 | 6.71 | -1.19 | -0.29 | 52.6% | ❌ |
| 10/21/2025 | San Jose Sharks @ New York Islanders | 3-4 (7) | 6.66 | 6.58 | -0.34 | -0.42 | 57.9% | ✅ |
| 10/21/2025 | Vancouver Canucks @ Pittsburgh Penguins | 1-5 (6) | 6.61 | 6.67 | 0.61 | 0.67 | 60.8% | ✅ |
| 10/21/2025 | Seattle Kraken @ Washington Capitals | 1-4 (5) | 6.15 | 6.44 | 1.15 | 1.44 | 48.2% | ❌ |
| 10/21/2025 | Florida Panthers @ Boston Bruins | 4-3 (7) | 6.01 | 5.64 | -0.99 | -1.36 | 48.6% | ✅ |
| 10/21/2025 | Anaheim Ducks @ Nashville Predators | 5-2 (7) | 6.39 | 6.16 | -0.61 | -0.84 | 43.1% | ✅ |
| 10/21/2025 | Columbus Blue Jackets @ Dallas Stars | 5-1 (6) | 7.04 | 6.76 | 1.04 | 0.76 | 58.8% | ❌ |
| 10/22/2025 | Minnesota Wild @ New Jersey Devils | 1-4 (5) | 5.82 | 6.36 | 0.82 | 1.36 | 59.2% | ✅ |
| 10/22/2025 | Detroit Red Wings @ Buffalo Sabres | 2-4 (6) | 5.78 | 6.46 | -0.22 | 0.46 | 38.9% | ❌ |
| 10/23/2025 | Anaheim Ducks @ Boston Bruins | 7-5 (12) | 6.08 | 6.36 | -5.92 | -5.64 | 47.0% | ✅ |
| 10/23/2025 | Philadelphia Flyers @ Ottawa Senators | 1-2 (3) | 5.79 | 6.43 | 2.79 | 3.43 | 41.6% | ❌ |
| 10/23/2025 | Chicago Blackhawks @ Tampa Bay Lightning | 3-2 (5) | 6.06 | 6.18 | 1.06 | 1.18 | 56.6% | ❌ |
| 10/23/2025 | Pittsburgh Penguins @ Florida Panthers | 5-3 (8) | 6.24 | 6.15 | -1.76 | -1.85 | 47.5% | ✅ |
| 10/23/2025 | Detroit Red Wings @ New York Islanders | 2-7 (9) | 6.16 | 6.63 | -2.84 | -2.37 | 45.3% | ❌ |
| 10/23/2025 | Vancouver Canucks @ Nashville Predators | 1-2 (3) | 6.41 | 6.19 | 3.41 | 3.19 | 50.1% | ✅ |
| 10/23/2025 | Montreal Canadiens @ Edmonton Oilers | 5-6 (11) | 5.93 | 6.15 | -5.07 | -4.85 | 57.4% | ✅ |
| 10/24/2025 | Toronto Maple Leafs @ Buffalo Sabres | 3-5 (8) | 6.02 | 6.54 | -1.98 | -1.46 | 38.0% | ❌ |
| 10/24/2025 | San Jose Sharks @ New Jersey Devils | 1-3 (4) | 6.11 | 6.86 | 2.11 | 2.86 | 66.4% | ✅ |
| 10/24/2025 | Washington Capitals @ Columbus Blue Jackets | 5-1 (6) | 6.63 | 6.83 | 0.63 | 0.83 | 41.7% | ✅ |
| 10/24/2025 | Calgary Flames @ Winnipeg Jets | 3-5 (8) | 6.21 | 5.72 | -1.79 | -2.28 | 59.1% | ✅ |
| 10/25/2025 | Colorado Avalanche @ Boston Bruins | 2-3 (5) | 5.82 | 6.53 | 0.82 | 1.53 | 41.6% | ❌ |
| 10/25/2025 | Anaheim Ducks @ Tampa Bay Lightning | 3-4 (7) | 5.96 | 6.38 | -1.04 | -0.62 | 44.0% | ❌ |
| 10/25/2025 | Vegas Golden Knights @ Florida Panthers | 0-3 (3) | 6.05 | 6.53 | 3.05 | 3.53 | 48.5% | ❌ |
| 10/25/2025 | St. Louis Blues @ Detroit Red Wings | 4-6 (10) | 5.87 | 6.20 | -4.13 | -3.80 | 58.3% | ✅ |
| 10/25/2025 | Ottawa Senators @ Washington Capitals | 7-1 (8) | 5.95 | 6.63 | -2.05 | -1.37 | 60.3% | ❌ |
| 10/25/2025 | Montreal Canadiens @ Vancouver Canucks | 4-3 (7) | 6.50 | 6.48 | -0.50 | -0.52 | 46.0% | ✅ |
| 10/25/2025 | Carolina Hurricanes @ Dallas Stars | 2-3 (5) | 6.99 | 6.70 | 1.99 | 1.70 | 40.2% | ❌ |
| 10/25/2025 | Edmonton Oilers @ Seattle Kraken | 2-3 (5) | 5.78 | 6.21 | 0.78 | 1.21 | 58.2% | ✅ |
| 10/26/2025 | Los Angeles Kings @ Chicago Blackhawks | 3-1 (4) | 5.87 | 6.34 | 1.87 | 2.34 | 49.5% | ✅ |
| 10/26/2025 | Dallas Stars @ Nashville Predators | 3-2 (5) | 6.58 | 6.20 | 1.58 | 1.20 | 45.4% | ✅ |
| 10/26/2025 | New York Rangers @ Calgary Flames | 1-5 (6) | 5.87 | 5.66 | -0.13 | -0.34 | 39.8% | ❌ |
| 10/27/2025 | St. Louis Blues @ Pittsburgh Penguins | 3-6 (9) | 6.33 | 6.96 | -2.67 | -2.04 | 56.1% | ✅ |
| 10/27/2025 | Boston Bruins @ Ottawa Senators | 2-7 (9) | 5.87 | 6.67 | -3.13 | -2.33 | 51.7% | ✅ |
| 10/28/2025 | Calgary Flames @ Toronto Maple Leafs | 3-4 (7) | 5.99 | 6.27 | -1.01 | -0.73 | 69.3% | ✅ |
| 10/28/2025 | New York Islanders @ Boston Bruins | 2-5 (7) | 6.20 | 6.96 | -0.80 | -0.04 | 52.2% | ✅ |
| 10/28/2025 | Vegas Golden Knights @ Carolina Hurricanes | 6-3 (9) | 6.52 | 6.49 | -2.48 | -2.51 | 63.0% | ❌ |
| 10/28/2025 | Tampa Bay Lightning @ Nashville Predators | 5-2 (7) | 5.92 | 6.00 | -1.08 | -1.00 | 51.8% | ❌ |
| 10/28/2025 | Detroit Red Wings @ St. Louis Blues | 5-2 (7) | 5.87 | 6.52 | -1.13 | -0.48 | 46.7% | ✅ |
| 10/28/2025 | Washington Capitals @ Dallas Stars | 0-1 (1) | 6.73 | 6.49 | 5.73 | 5.49 | 48.1% | ❌ |
| 10/28/2025 | Ottawa Senators @ Chicago Blackhawks | 3-7 (10) | 5.83 | 6.74 | -4.17 | -3.26 | 48.6% | ❌ |
| 10/28/2025 | New Jersey Devils @ Colorado Avalanche | 4-8 (12) | 5.65 | 6.52 | -6.35 | -5.48 | 53.9% | ✅ |
| 10/28/2025 | New York Rangers @ Vancouver Canucks | 2-0 (2) | 6.33 | 6.10 | 4.33 | 4.10 | 46.5% | ✅ |
| 10/28/2025 | Los Angeles Kings @ San Jose Sharks | 4-3 (7) | 6.08 | 6.65 | -0.92 | -0.35 | 52.4% | ❌ |
| 10/29/2025 | Toronto Maple Leafs @ Columbus Blue Jackets | 3-6 (9) | 6.32 | 6.81 | -2.68 | -2.19 | 39.6% | ❌ |
| 10/30/2025 | Nashville Predators @ Philadelphia Flyers | 1-4 (5) | 6.03 | 6.21 | 1.03 | 1.21 | 61.8% | ✅ |
| 10/30/2025 | New York Islanders @ Carolina Hurricanes | 2-6 (8) | 6.87 | 7.03 | -1.13 | -0.97 | 64.5% | ✅ |
| 10/30/2025 | Pittsburgh Penguins @ Minnesota Wild | 4-1 (5) | 6.22 | 6.73 | 1.22 | 1.73 | 48.4% | ✅ |
| 10/30/2025 | Chicago Blackhawks @ Winnipeg Jets | 3-6 (9) | 6.45 | 6.63 | -2.55 | -2.37 | 59.3% | ✅ |
| 10/30/2025 | New Jersey Devils @ San Jose Sharks | 2-5 (7) | 6.08 | 6.97 | -0.92 | -0.03 | 37.7% | ❌ |

## Recommendation

**DEPLOY ENSEMBLE MODEL** ✅

- RMSE improved by 1.7%
- Bias reduced by 0.144 goals
- Win accuracy protected at 62.5%
- Use ensemble for over/under betting
- Keep current model for moneyline betting
