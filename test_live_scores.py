#!/usr/bin/env python3
"""
Quick test of the NHL live score updater
Run: python test_live_scores.py
"""

import sys
from update_live_scores import NHLScoreUpdater
from datetime import datetime

def test_score_updater():
    print("🏒 Testing NHL Live Score Updater")
    print("=" * 50)
    print()
    
    # Initialize updater (no Firebase for testing)
    updater = NHLScoreUpdater(output_dir='public', firebase_enabled=False)
    
    # Test 1: Fetch today's games
    print("TEST 1: Fetching today's games...")
    print("-" * 50)
    today = datetime.now().strftime('%Y-%m-%d')
    games = updater.fetch_games(today)
    
    if games:
        print(f"\n✅ SUCCESS: Found {len(games)} games for {today}")
        print(f"   Saved to: {updater.output_file}")
        
        # Show first game as example
        if len(games) > 0:
            game = games[0]
            print(f"\n📊 Example Game:")
            print(f"   {game['awayTeam']} @ {game['homeTeam']}")
            print(f"   Score: {game['awayScore']}-{game['homeScore']}")
            print(f"   Status: {game['status']}")
            if game['status'] == 'LIVE':
                print(f"   Period: {game['period']} - {game['clock']}")
    else:
        print(f"\n⚠️  No games found for {today}")
        print("   This is normal if there are no games scheduled.")
    
    print("\n" + "=" * 50)
    print("✅ Test complete!")
    print()
    print("NEXT STEPS:")
    print("1. Check public/live_scores.json was created")
    print("2. Run full update: python update_live_scores.py")
    print("3. Run continuously: python update_live_scores.py --continuous")
    print()

if __name__ == '__main__':
    try:
        test_score_updater()
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)

