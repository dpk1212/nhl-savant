#!/usr/bin/env python3
"""
NHL Live Score Updater
======================
Fetches live scores from NHL API and updates a JSON file for display.
Does NOT rescrape odds - only updates scores 2-3 times during game time.

Usage:
  python update_live_scores.py                 # Update today's games
  python update_live_scores.py --date 2025-10-23  # Specific date
  python update_live_scores.py --continuous    # Run every 5 minutes

Requirements:
  pip install requests python-dotenv firebase-admin
"""

import requests
import json
import os
import sys
import time
import argparse
from datetime import datetime, timedelta
from pathlib import Path

# Optional Firebase support (if you want to also update Firebase)
FIREBASE_ENABLED = False
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    from dotenv import load_dotenv
    FIREBASE_ENABLED = True
except ImportError:
    print("⚠️  Firebase not installed. Score updates will only go to JSON file.")
    print("   To enable Firebase: pip install firebase-admin python-dotenv\n")


class NHLScoreUpdater:
    """Fetches live NHL scores and updates local JSON file"""
    
    def __init__(self, output_dir='public', firebase_enabled=False):
        self.output_dir = Path(output_dir)
        self.output_file = self.output_dir / 'live_scores.json'
        self.nhl_api_base = 'https://api-web.nhle.com/v1'
        self.firebase_enabled = firebase_enabled and FIREBASE_ENABLED
        self.db = None
        
        # Ensure output directory exists
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize Firebase if requested
        if self.firebase_enabled:
            self._init_firebase()
    
    def _init_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            load_dotenv()
            
            # Check if already initialized
            if not firebase_admin._apps:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": os.getenv('VITE_FIREBASE_PROJECT_ID'),
                    "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                })
                firebase_admin.initialize_app(cred)
            
            self.db = firestore.client()
            print("✅ Firebase initialized")
        except Exception as e:
            print(f"⚠️  Firebase initialization failed: {e}")
            self.firebase_enabled = False
    
    def fetch_games(self, date=None):
        """
        Fetch game data from NHL API for specified date
        
        Args:
            date (str): Date in YYYY-MM-DD format. Defaults to today.
        
        Returns:
            list: List of game dictionaries
        """
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        url = f'{self.nhl_api_base}/schedule/{date}'
        
        try:
            print(f"📡 Fetching NHL games for {date}...")
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            game_week = data.get('gameWeek', [])
            
            if not game_week:
                print(f"❌ No games found for {date}")
                return []
            
            games = game_week[0].get('games', [])
            print(f"✅ Found {len(games)} games\n")
            
            return self._process_games(games, date)
            
        except requests.RequestException as e:
            print(f"❌ Error fetching NHL data: {e}")
            return []
    
    def _process_games(self, games, date):
        """Process raw NHL API game data into clean format"""
        processed = []
        
        for game in games:
            try:
                game_data = {
                    'date': date,
                    'gameId': game.get('id'),
                    'awayTeam': game['awayTeam']['abbrev'],
                    'homeTeam': game['homeTeam']['abbrev'],
                    'awayScore': game['awayTeam'].get('score', 0),
                    'homeScore': game['homeTeam'].get('score', 0),
                    'totalScore': game['awayTeam'].get('score', 0) + game['homeTeam'].get('score', 0),
                    'gameState': game.get('gameState', 'FUT'),  # FUT, LIVE, FINAL, OFF
                    'period': game.get('period', 0),
                    'periodDescriptor': game.get('periodDescriptor', {}).get('periodType', ''),
                    'clock': game.get('clock', {}).get('timeRemaining', ''),
                    'gameTime': game.get('startTimeUTC', ''),
                    'lastUpdate': datetime.now().isoformat()
                }
                
                # Determine status
                if game_data['gameState'] in ['OFF', 'FINAL']:
                    game_data['status'] = 'FINAL'
                elif game_data['gameState'] == 'LIVE':
                    game_data['status'] = 'LIVE'
                elif game_data['gameState'] in ['FUT', 'PRE']:
                    game_data['status'] = 'SCHEDULED'
                else:
                    game_data['status'] = 'UNKNOWN'
                
                processed.append(game_data)
                
                # Print game info
                status_emoji = {
                    'LIVE': '🔴',
                    'FINAL': '✅',
                    'SCHEDULED': '📅',
                    'UNKNOWN': '❓'
                }
                
                emoji = status_emoji.get(game_data['status'], '❓')
                print(f"{emoji} {game_data['awayTeam']} @ {game_data['homeTeam']}: "
                      f"{game_data['awayScore']}-{game_data['homeScore']} ({game_data['status']})")
                
            except KeyError as e:
                print(f"⚠️  Skipping malformed game data: missing {e}")
                continue
        
        return processed
    
    def save_to_json(self, games):
        """Save game data to JSON file"""
        try:
            data = {
                'lastUpdate': datetime.now().isoformat(),
                'games': games,
                'gamesCount': len(games)
            }
            
            with open(self.output_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            print(f"\n✅ Saved {len(games)} games to {self.output_file}")
            return True
            
        except Exception as e:
            print(f"❌ Error saving to JSON: {e}")
            return False
    
    def update_firebase_scores(self, games):
        """Update scores in Firebase (optional)"""
        if not self.firebase_enabled or not self.db:
            return False
        
        try:
            print("\n📊 Updating Firebase...")
            updated = 0
            
            for game in games:
                # Only update games that have started or finished
                if game['status'] in ['LIVE', 'FINAL']:
                    # Find matching bets in Firebase
                    bets_ref = self.db.collection('bets')
                    query = bets_ref.where('game.awayTeam', '==', game['awayTeam']) \
                                   .where('game.homeTeam', '==', game['homeTeam']) \
                                   .where('status', '==', 'PENDING')
                    
                    docs = query.get()
                    
                    for doc in docs:
                        bet_data = doc.to_dict()
                        
                        # Calculate outcome if game is final
                        if game['status'] == 'FINAL':
                            outcome = self._calculate_outcome(game, bet_data['bet'])
                            profit = self._calculate_profit(outcome, bet_data['bet']['odds'])
                            
                            doc.reference.update({
                                'result.awayScore': game['awayScore'],
                                'result.homeScore': game['homeScore'],
                                'result.totalScore': game['totalScore'],
                                'result.winner': 'AWAY' if game['awayScore'] > game['homeScore'] else 'HOME',
                                'result.outcome': outcome,
                                'result.profit': profit,
                                'result.fetched': True,
                                'result.fetchedAt': firestore.SERVER_TIMESTAMP,
                                'result.source': 'NHL_API_LIVE',
                                'status': 'COMPLETED'
                            })
                            
                            print(f"   ✅ Updated {game['awayTeam']} @ {game['homeTeam']} → {outcome}")
                            updated += 1
                        else:
                            # Just update scores for live games
                            doc.reference.update({
                                'result.awayScore': game['awayScore'],
                                'result.homeScore': game['homeScore'],
                                'result.totalScore': game['totalScore'],
                                'result.fetchedAt': firestore.SERVER_TIMESTAMP,
                                'result.source': 'NHL_API_LIVE'
                            })
            
            print(f"✅ Updated {updated} bets in Firebase")
            return True
            
        except Exception as e:
            print(f"❌ Error updating Firebase: {e}")
            return False
    
    def _calculate_outcome(self, game, bet):
        """Calculate bet outcome"""
        total_score = game['totalScore']
        
        if bet['market'] == 'TOTAL':
            if bet['side'] == 'OVER':
                return 'WIN' if total_score > bet['line'] else 'LOSS' if total_score < bet['line'] else 'PUSH'
            else:
                return 'WIN' if total_score < bet['line'] else 'LOSS' if total_score > bet['line'] else 'PUSH'
        
        elif bet['market'] == 'MONEYLINE':
            winner = 'AWAY' if game['awayScore'] > game['homeScore'] else 'HOME'
            return 'WIN' if bet['side'] == winner else 'LOSS'
        
        elif bet['market'] in ['PUCK_LINE', 'PUCKLINE']:
            spread = bet.get('line', 1.5)
            if bet['side'] == 'HOME':
                home_spread = game['homeScore'] - game['awayScore']
                return 'WIN' if home_spread > spread else 'LOSS' if home_spread < spread else 'PUSH'
            else:
                away_spread = game['awayScore'] - game['homeScore']
                return 'WIN' if away_spread > spread else 'LOSS' if away_spread < spread else 'PUSH'
        
        return None
    
    def _calculate_profit(self, outcome, odds):
        """Calculate profit in units"""
        if outcome == 'PUSH':
            return 0
        if outcome == 'LOSS':
            return -1
        
        # WIN
        if odds < 0:
            return 100 / abs(odds)
        else:
            return odds / 100
    
    def update(self, date=None, update_firebase=False):
        """
        Main update method
        
        Args:
            date (str): Date to update (YYYY-MM-DD)
            update_firebase (bool): Whether to also update Firebase
        """
        games = self.fetch_games(date)
        
        if not games:
            return False
        
        # Always save to JSON
        json_success = self.save_to_json(games)
        
        # Optionally update Firebase
        if update_firebase and self.firebase_enabled:
            self.update_firebase_scores(games)
        
        return json_success


def main():
    parser = argparse.ArgumentParser(description='Update NHL live scores')
    parser.add_argument('--date', type=str, help='Date in YYYY-MM-DD format (default: today)')
    parser.add_argument('--continuous', action='store_true', help='Run continuously every 5 minutes')
    parser.add_argument('--firebase', action='store_true', help='Also update Firebase')
    parser.add_argument('--interval', type=int, default=5, help='Update interval in minutes (default: 5)')
    
    args = parser.parse_args()
    
    # Initialize updater
    updater = NHLScoreUpdater(firebase_enabled=args.firebase)
    
    print("🏒 NHL Live Score Updater")
    print("=" * 50)
    
    if args.continuous:
        print(f"🔄 Running continuously (every {args.interval} minutes)")
        print("   Press Ctrl+C to stop\n")
        
        try:
            while True:
                updater.update(args.date, update_firebase=args.firebase)
                print(f"\n⏰ Next update in {args.interval} minutes...")
                print(f"   {datetime.now().strftime('%I:%M:%S %p')}\n")
                time.sleep(args.interval * 60)
        except KeyboardInterrupt:
            print("\n\n👋 Stopped by user")
            sys.exit(0)
    else:
        # Single update
        success = updater.update(args.date, update_firebase=args.firebase)
        sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

