import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseBasketballOdds } from '../utils/basketballOddsParser';
import { parseHaslametrics } from '../utils/haslametricsParser';
import { parseDRatings } from '../utils/dratingsParser';
import { parseBarttorvik } from '../utils/barttorvik Parser';
import { matchGamesWithCSV, filterByQuality } from '../utils/gameMatchingCSV';
import { BasketballEdgeCalculator } from '../utils/basketballEdgeCalculator';
import { useBasketballResultsGrader } from '../hooks/useBasketballResultsGrader';
import { loadTeamMappings } from '../utils/teamCSVLoader';
import { startScorePolling } from '../utils/ncaaAPI';
import { gradePrediction, calculateGradingStats } from '../utils/basketballGrading';
import { gradeBasketballBet } from '../utils/basketballBetGrader';
import { BasketballLiveScore, GameStatusFilter } from '../components/BasketballLiveScore';
import { BasketballPerformanceDashboard } from '../components/BasketballPerformanceDashboard';
import { AdvancedMatchupCard } from '../components/AdvancedMatchupCard';
import { getUnitSize, getUnitDisplay, getUnitColor } from '../utils/staggeredUnits';
import { getConfidenceRating, getBetTier } from '../utils/abcUnits';
import { getDynamicTierInfo, getDynamicConfidenceRating, loadConfidenceWeights } from '../utils/dynamicConfidenceUnits';
import { CLVIndicator } from '../components/CLVBadge';
import { basketballBetTracker } from '../firebase/basketballBetTracker';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  ELEVATION, 
  TYPOGRAPHY, 
  MOBILE_SPACING, 
  GRADIENTS, 
  getGradeColorScale
} from '../utils/designSystem';
import { getBasketballContext } from '../utils/basketballContextGenerator';
// 🎯 CBB SOFT PAYWALL IMPORTS
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { 
  CBBEarlyAccessBanner, 
  CBBSoftPaywall, 
  CBBUpgradeModal 
} from '../components/CBBPaywall';
import SavantPickBadge from '../components/SavantPickBadge';
import SavantPickInfo from '../components/SavantPickInfo';

const Basketball = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Live scoring state
  const [gamesWithLiveScores, setGamesWithLiveScores] = useState([]);
  const [gameStatusFilter, setGameStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('confidence'); // 'confidence' | 'time' | 'edge' | 'savant'
  const [showSavantOnly, setShowSavantOnly] = useState(false); // Filter to show only Savant Picks
  const [teamMappings, setTeamMappings] = useState(null);
  
  // Bet outcomes state
  const [betsMap, setBetsMap] = useState(new Map());
  
  // Track which bets we've already attempted to grade (prevent duplicates)
  const [gradedGameIds, setGradedGameIds] = useState(new Set());
  
  // Track if we've already saved bets this session (prevent duplicate writes)
  const [betsSaved, setBetsSaved] = useState(false);
  
  // Auto-grade bets when results are available (CLIENT-SIDE!)
  const { grading, gradedCount } = useBasketballResultsGrader();
  
  // 🎯 CBB SOFT PAYWALL: Auth & subscription state
  const { user } = useAuth();
  const { isPremium, isFree, loading: subscriptionLoading } = useSubscription(user);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paywallDismissed, setPaywallDismissed] = useState(false); // Track if user dismissed paywall for free preview

  useEffect(() => {
    loadBasketballData();
  }, []);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch bet outcomes from Firebase
  useEffect(() => {
    async function fetchBets() {
      try {
        const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
        const betsData = new Map();
        
        betsSnapshot.forEach((doc) => {
          const bet = doc.data();
          // Create a normalized key for matching: awayTeam_homeTeam
          const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const key = `${normalizeTeam(bet.game.awayTeam)}_${normalizeTeam(bet.game.homeTeam)}`;
          betsData.set(key, bet);
        });
        
        setBetsMap(betsData);
      } catch (err) {
        console.error('Error fetching bets:', err);
      }
    }
    
    fetchBets();
    
    // Refresh bets every 15 seconds to catch newly graded bets
    const interval = setInterval(fetchBets, 15000);
    return () => clearInterval(interval);
  }, [gradedCount]); // Re-fetch when bets are graded
  
  
  // 💾 SMART BET SAVING: Only write NEW bets, only once per session
  // Waits for both recommendations AND betsMap to be loaded
  useEffect(() => {
    // Don't save if already saved this session, or data not ready
    if (betsSaved || recommendations.length === 0 || betsMap.size === 0) {
      return;
    }
    
    // Save only new bets (ones not in betsMap)
    basketballBetTracker.saveNewBetsOnly(recommendations, betsMap)
      .then(({ saved, skipped }) => {
        if (saved > 0) {
          console.log(`✅ Saved ${saved} new bets, skipped ${skipped} existing`);
        }
        setBetsSaved(true); // Mark as done for this session
      })
      .catch(err => {
        console.error('Failed to save bets:', err);
        setBetsSaved(true); // Don't retry on error
      });
  }, [recommendations, betsMap, betsSaved]);
  
  // Start live score polling when we have games and mappings
  useEffect(() => {
    if (!recommendations || recommendations.length === 0 || !teamMappings) {
      return;
    }
    
    const stopPolling = startScorePolling(
      recommendations,
      teamMappings,
      async (updatedGames) => {
        // 🎯 GRADE ALL FINAL GAMES FIRST (batch processing with error isolation)
        const finalGames = updatedGames.filter(g => g.liveScore?.status === 'final');
        
        for (const game of finalGames) {
          const gameId = `${game.awayTeam}_${game.homeTeam}`;
          
          // Only attempt to grade each game once
          if (!gradedGameIds.has(gameId)) {
            setGradedGameIds(prev => new Set(prev).add(gameId));
            
            try {
              const graded = await gradeBasketballBet(
                game.awayTeam, 
                game.homeTeam, 
                game.liveScore, 
                game.prediction
              );
              
              if (graded) {
                console.log(`✅ Successfully graded bet for ${gameId}`);
              }
            } catch (error) {
              console.error(`❌ Failed to grade ${gameId}:`, error);
              // Remove from set so we can retry on next poll
              setGradedGameIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(gameId);
                return newSet;
              });
            }
          }
        }
        
        // Add grades and bet outcomes for display
        const gamesWithGradesAndBets = updatedGames.map(game => {
          const gameData = { ...game };
          
          // Add prediction grade if game is final
          if (game.liveScore && game.liveScore.status === 'final') {
            gameData.grade = gradePrediction(game, game.liveScore);
          }
          
          // Match and attach bet outcome from Firebase
          const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const betKey = `${normalizeTeam(game.awayTeam)}_${normalizeTeam(game.homeTeam)}`;
          const bet = betsMap.get(betKey);
          
          if (bet && bet.result?.outcome) {
            // 🔧 FIX: Recalculate profit from ACTUAL units (not stored profit which may be wrong)
            const actualUnits = bet.bet?.units || bet.prediction?.unitSize || 1;
            const odds = bet.bet?.odds;
            const isWin = bet.result.outcome === 'WIN';
            
            let calculatedProfit;
            if (isWin && odds) {
              const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
              calculatedProfit = actualUnits * decimal;
            } else {
              calculatedProfit = -actualUnits;
            }
            
            gameData.betOutcome = {
              outcome: bet.result.outcome,
              profit: calculatedProfit,
              units: actualUnits
            };
          }
          
          return gameData;
        });
        
        setGamesWithLiveScores(gamesWithGradesAndBets);
      },
      15000 // Poll every 15 seconds
    );
    
    return stopPolling;
  }, [recommendations, teamMappings, betsMap, gradedGameIds]);

  async function loadBasketballData() {
    try {
      setLoading(true);
      
      // Cache-busting timestamp to force fresh data
      const cacheBuster = `?t=${Date.now()}`;
      
      // Load data files with cache busting
      const oddsResponse = await fetch(`/basketball_odds.md${cacheBuster}`);
      const haslaResponse = await fetch(`/haslametrics.md${cacheBuster}`);
      const drateResponse = await fetch(`/dratings.md${cacheBuster}`);
      const csvResponse = await fetch(`/basketball_teams.csv${cacheBuster}`);
      
      // Load Barttorvik data (using Bart.md - updated daily by scraper)
      const barttorvikResponse = await fetch(`/Bart.md${cacheBuster}`);
      
      const oddsMarkdown = await oddsResponse.text();
      const haslaMarkdown = await haslaResponse.text();
      const drateMarkdown = await drateResponse.text();
      const barttorvikMarkdown = await barttorvikResponse.text();
      const csvContent = await csvResponse.text();
      
      // Parse data (odds parser filters for TODAY only)
      const oddsGames = parseBasketballOdds(oddsMarkdown);
      
      const haslaData = parseHaslametrics(haslaMarkdown);
      const dratePreds = parseDRatings(drateMarkdown);
      const barttorvikData = parseBarttorvik(barttorvikMarkdown);
      
      // Load team mappings for live score matching
      const mappings = loadTeamMappings(csvContent);
      setTeamMappings(mappings);
      
      // Match games using CSV mappings (OddsTrader as base)
      const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, barttorvikData, csvContent);
      
      // TODAY'S GAMES ONLY (parser filters by today's date)
      const todaysGames = matchedGames.map(game => ({
        ...game,
        // Add verification fields
        hasOdds: !!game.odds,
        hasDRatings: !!game.dratings,
        hasHaslametrics: !!game.haslametrics,
        verificationStatus: game.dratings ? 'MATCHED' : 'MISSING'
      }));
      
      // Load dynamic confidence weights for unit calculation
      const confidenceData = await loadConfidenceWeights();
      console.log(`📊 Loaded confidence weights (${confidenceData.totalBets} bets analyzed)`);
      
      // Calculate predictions for TODAY'S games using the new profitable filter system
      const calculator = new BasketballEdgeCalculator();
      
      // Set confidence weights for dynamic unit calculation
      calculator.setConfidenceWeights(confidenceData);
      
      // Use processGames() which includes the shouldBet() filters (blocks D/F grades, <3% EV, etc.)
      const qualityGames = calculator.processGames(todaysGames);
      
      // 🔒 MERGE LOCKED PICKS: Always display today's Firebase bets (like NHL workflow)
      // Original picks stay visible even if odds change and they no longer pass filters
      // SHOW ALL BETS (pending AND completed) so users see their wins!
      // CRITICAL: Use ET date (bets stored in ET timezone)
      const now = new Date();
      const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const today = `${etDate.getFullYear()}-${String(etDate.getMonth() + 1).padStart(2, '0')}-${String(etDate.getDate()).padStart(2, '0')}`;
      
      const firebaseBetsSnapshot = await getDocs(
        query(
          collection(db, 'basketball_bets'),
          where('date', '==', today)
          // NO STATUS FILTER - show both pending and completed
        )
      );
      
      const lockedPicks = [];
      firebaseBetsSnapshot.forEach((doc) => {
        const bet = doc.data();
        lockedPicks.push(bet);
      });
      
      console.log(`🔒 Found ${lockedPicks.length} locked picks for today`);
      
      // Merge: Replace games in qualityGames with locked picks, or add new locked picks
      const mergedGames = [...qualityGames];
      const normalizeForMatch = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      for (const lockedBet of lockedPicks) {
        const betKey = `${normalizeForMatch(lockedBet.game.awayTeam)}_${normalizeForMatch(lockedBet.game.homeTeam)}`;
        
        // Check if this game already exists in qualityGames
        const existingIndex = mergedGames.findIndex(g => 
          `${normalizeForMatch(g.awayTeam)}_${normalizeForMatch(g.homeTeam)}` === betKey
        );
        
        // 🔧 FIX: Look up fresh model data from matchedGames even if game was filtered out
        // This ensures barttorvik/dratings/haslametrics data is preserved for locked picks
        const freshDataFromMatched = matchedGames.find(g =>
          `${normalizeForMatch(g.awayTeam)}_${normalizeForMatch(g.homeTeam)}` === betKey
        );
        
        // Build locked pick object
        const lockedGameObj = {
          awayTeam: lockedBet.game.awayTeam,
          homeTeam: lockedBet.game.homeTeam,
          odds: { 
            gameTime: lockedBet.game.gameTime,
            awayOdds: lockedBet.bet.team === lockedBet.game.awayTeam ? lockedBet.bet.odds : null,
            homeOdds: lockedBet.bet.team === lockedBet.game.homeTeam ? lockedBet.bet.odds : null
          },
          prediction: {
            ...lockedBet.prediction,
            bestTeam: lockedBet.bet.team,
            bestOdds: lockedBet.bet.odds,
            bestEV: lockedBet.prediction?.evPercent || lockedBet.initialEV || 0,
            bestBet: lockedBet.bet.team === lockedBet.game.awayTeam ? 'away' : 'home',
            grade: lockedBet.prediction?.grade || lockedBet.prediction?.qualityGrade || 'B',
            unitSize: lockedBet.prediction?.unitSize || 1.0,
            ensembleAwayProb: lockedBet.prediction?.ensembleAwayProb || 0.5,
            ensembleHomeProb: lockedBet.prediction?.ensembleHomeProb || 0.5,
            marketAwayProb: lockedBet.prediction?.marketAwayProb || 0.5,
            marketHomeProb: lockedBet.prediction?.marketHomeProb || 0.5,
            isLockedPick: true, // 🔒 Flag for UI display
            lockedAt: lockedBet.firstRecommendedAt,
            initialOdds: lockedBet.initialOdds,
            initialEV: lockedBet.initialEV
          },
          // 🔧 FIX: Use fresh model data from matchedGames, not Firebase (which doesn't have barttorvik)
          dratings: freshDataFromMatched?.dratings || null,
          haslametrics: freshDataFromMatched?.haslametrics || null,
          barttorvik: freshDataFromMatched?.barttorvik || null,
          // 📈 CLV data from Firebase
          clv: lockedBet.clv || null
        };
        
        if (existingIndex >= 0) {
          // 🔒 REPLACE prediction with locked version, but KEEP fresh model data
          console.log(`   🔒 Replacing with locked pick: ${lockedBet.game.awayTeam} @ ${lockedBet.game.homeTeam}`);
          const freshGame = mergedGames[existingIndex];
          mergedGames[existingIndex] = {
            ...freshGame, // Keep fresh dratings, haslametrics, barttorvik for insights
            prediction: lockedGameObj.prediction, // Override with locked prediction
            odds: lockedGameObj.odds, // Use locked odds
            clv: lockedBet.clv || null // 📈 Include CLV data
          };
        } else {
          // Add locked pick (game no longer in today's scraped data)
          console.log(`   🔒 Adding locked pick: ${lockedBet.game.awayTeam} @ ${lockedBet.game.homeTeam}`);
          mergedGames.push(lockedGameObj);
        }
      }
      
      console.log(`📊 Total games: ${mergedGames.length} (${qualityGames.length} current + ${mergedGames.length - qualityGames.length} locked)`);
      
      // SORT BY VALUE: Prioritize games where our model is MORE CONFIDENT than market
      // This ensures we recommend teams we believe in more than the market does
      const sortedGames = mergedGames.sort((a, b) => {
        // 🔒 PRIORITY 0: Locked picks always at top
        const aLocked = a.prediction?.isLockedPick || false;
        const bLocked = b.prediction?.isLockedPick || false;
        
        if (aLocked !== bLocked) {
          return bLocked ? 1 : -1; // Locked picks first
        }
        
        // Calculate "model advantage" - how much more confident we are than market
        const getModelAdvantage = (game) => {
          const pred = game.prediction;
          if (!pred) return 0;
          
          // Get the probabilities for the team we're picking
          const modelProb = pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb;
          const marketProb = pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb;
          
          return modelProb - marketProb; // Positive = we're more confident than market
        };
        
        const advantageA = getModelAdvantage(a);
        const advantageB = getModelAdvantage(b);
        
        // PRIORITY 1: Sort by whether we're MORE confident than market
        const aHasAdvantage = advantageA > 0;
        const bHasAdvantage = advantageB > 0;
        
        if (aHasAdvantage !== bHasAdvantage) {
          return bHasAdvantage ? 1 : -1; // Games with advantage first
        }
        
        // PRIORITY 2: Among similar advantage types, sort by grade
        const gradeOrder = { 'A+': 4, 'A': 3, 'B+': 2, 'B': 1, 'C': 0 };
        const gradeA = gradeOrder[a.prediction?.grade] || 0;
        const gradeB = gradeOrder[b.prediction?.grade] || 0;
        
        if (gradeA !== gradeB) {
          return gradeB - gradeA; // Higher grade first
        }
        
        // PRIORITY 3: Among same grade, sort by size of advantage
        if (Math.abs(advantageA - advantageB) > 0.001) {
          return advantageB - advantageA; // Bigger advantage first
        }
        
        // PRIORITY 4: Finally sort by time
        const timeA = a.odds?.gameTime || '';
        const timeB = b.odds?.gameTime || '';
        
        if (timeA === 'TBD') return 1;
        if (timeB === 'TBD') return -1;
        if (!timeA || !timeB) return 0;
        
        const parseTime = (timeStr) => {
          const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
          if (!match) return 0;
          let [_, hours, mins, period] = match;
          hours = parseInt(hours);
          mins = parseInt(mins);
          if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
          if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
          return hours * 60 + mins;
        };
        
        return parseTime(timeA) - parseTime(timeB);
      });
      
      setRecommendations(sortedGames);
      
      // Calculate stats including locked picks
      const lockedCount = sortedGames.filter(g => g.prediction?.isLockedPick).length;
      const freshCount = sortedGames.length - lockedCount;
      
      setStats({
        totalGames: oddsGames.length,
        qualityPicks: sortedGames.length,
        lockedPicks: lockedCount,
        freshPicks: freshCount,
        displayedGames: sortedGames.length,
        gamesWithDRatings: todaysGames.filter(g => g.hasDRatings).length,
        gamesWithHasla: todaysGames.filter(g => g.hasHaslametrics).length,
        missingDRatings: todaysGames.filter(g => !g.hasDRatings).length,
        avgEV: sortedGames.length > 0 
          ? (sortedGames.reduce((sum, g) => sum + (g.prediction?.bestEV || 0), 0) / sortedGames.length).toFixed(1)
          : '0.0'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading basketball data:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🏀</div>
        <div>Loading basketball data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>❌</div>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '0' }}>
      {/* 🎯 CBB EARLY ACCESS BANNER - Only for free users */}
      <CBBEarlyAccessBanner />
      
      <div style={{ padding: isMobile ? '1rem' : '20px' }}>
        {/* Header - NHL Standard */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: isMobile ? '1.5rem' : '2rem', padding: isMobile ? '1rem' : '0' }}>
          {/* Back to NHL Button */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              marginBottom: '1.5rem',
              borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            textDecoration: 'none',
            color: 'rgba(212, 175, 55, 0.9)',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)';
          }}
        >
          <span style={{ fontSize: '1.125rem' }}>←</span>
          <span>🏒 NHL Today's Games</span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <h1 style={{
            fontSize: isMobile ? TYPOGRAPHY.hero.size : '2rem',
            fontWeight: TYPOGRAPHY.hero.weight,
            color: '#FF8C42',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: TYPOGRAPHY.hero.lineHeight
          }}>
            🏀 Today's Best Picks
          </h1>
          <button
            onClick={() => {
              setLoading(true);
              loadBasketballData();
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 140, 66, 0.3)',
              background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.1) 0%, rgba(255, 140, 66, 0.05) 100%)',
              color: '#FF8C42',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 140, 66, 0.2) 0%, rgba(255, 140, 66, 0.1) 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 140, 66, 0.1) 0%, rgba(255, 140, 66, 0.05) 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>🔄</span>
            <span>Refresh Data</span>
          </button>
        </div>
        <p style={{ 
          fontSize: TYPOGRAPHY.body.size,
          fontWeight: TYPOGRAPHY.body.weight,
          color: 'rgba(255,255,255,0.8)', 
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          Value-driven recommendations with 2%+ expected edge
        </p>
      </div>

      {/* Unit Sizing Explainer - Premium (No Emoji) */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 1.5rem auto', 
        padding: isMobile ? '0 1rem' : '0' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.10) 0%, rgba(59, 130, 246, 0.10) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.25)',
          borderRadius: isMobile ? '14px' : '16px',
          padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 5px 18px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              fontWeight: '900',
              color: '#10B981',
              marginBottom: '0.375rem',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase'
            }}>
              Smart Unit Allocation
            </div>
            <div style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              color: 'rgba(255,255,255,0.80)',
              lineHeight: 1.5,
              fontWeight: '600'
            }}>
              {isMobile 
                ? 'Unit sizes based on historical pattern performance (0.5u-5.0u)' 
                : 'Every matchup is analyzed, but unit allocation is scaled by historical pattern performance. Strong patterns receive up to 5.0 units, while volatile patterns are allocated 0.5-1.0 units for optimal risk management.'}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Performance Dashboard - NHL Style */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', padding: isMobile ? '0 1rem' : '0' }}>
        <BasketballPerformanceDashboard />
        
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '1.5rem',
            marginTop: '1.5rem',
            padding: isMobile ? '1.5rem' : '2rem',
            background: GRADIENTS.hero,
            borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '16px',
            border: ELEVATION.elevated.border,
            boxShadow: ELEVATION.elevated.shadow
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.5rem' : TYPOGRAPHY.hero.size,
                fontWeight: TYPOGRAPHY.hero.weight,
                color: '#10B981',
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {stats.qualityPicks}
              </div>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size,
                fontWeight: TYPOGRAPHY.label.weight,
                color: 'rgba(255,255,255,0.7)',
                textTransform: TYPOGRAPHY.label.textTransform,
                letterSpacing: TYPOGRAPHY.label.letterSpacing
              }}>
                QUALITY PICKS
              </div>
            </div>
            
            {!isMobile && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: TYPOGRAPHY.hero.size,
                  fontWeight: TYPOGRAPHY.hero.weight,
                  color: '#3B82F6',
                  lineHeight: TYPOGRAPHY.hero.lineHeight
                }}>
                  +{stats.avgEV}%
                </div>
                <div style={{ 
                  fontSize: TYPOGRAPHY.label.size,
                  fontWeight: TYPOGRAPHY.label.weight,
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: TYPOGRAPHY.label.textTransform,
                  letterSpacing: TYPOGRAPHY.label.letterSpacing
                }}>
                  AVG EDGE
                </div>
              </div>
            )}
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.5rem' : TYPOGRAPHY.hero.size,
                fontWeight: TYPOGRAPHY.hero.weight,
                color: '#FF8C42',
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {stats.totalGames}
              </div>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size,
                fontWeight: TYPOGRAPHY.label.weight,
                color: 'rgba(255,255,255,0.7)',
                textTransform: TYPOGRAPHY.label.textTransform,
                letterSpacing: TYPOGRAPHY.label.letterSpacing
              }}>
                GAMES TODAY
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grading Stats - REMOVED */}
      
      {/* Game Status Filter + Sort Order */}
      {gamesWithLiveScores.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 1rem auto' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            {/* Status Filter */}
            <GameStatusFilter
              currentFilter={gameStatusFilter}
              onFilterChange={setGameStatusFilter}
              counts={{
                all: gamesWithLiveScores.length,
                scheduled: gamesWithLiveScores.filter(g => !g.liveScore || g.liveScore.status === 'pre').length,
                live: gamesWithLiveScores.filter(g => g.liveScore && g.liveScore.status === 'live').length,
                final: gamesWithLiveScores.filter(g => g.liveScore && g.liveScore.status === 'final').length
              }}
            />
            
            {/* Savant Picks Toggle Filter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => setShowSavantOnly(!showSavantOnly)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: showSavantOnly 
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: showSavantOnly 
                    ? '2px solid rgba(251, 191, 36, 0.5)'
                    : '1px solid rgba(71, 85, 105, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '12px' }}>⭐</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: showSavantOnly ? 'rgba(251, 191, 36, 0.95)' : '#cbd5e1',
                }}>
                  Savant Only
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: showSavantOnly ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255,255,255,0.5)',
                  background: showSavantOnly ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}>
                  {(() => {
                    const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
                    const gamesToCount = gamesWithLiveScores.length > 0 ? gamesWithLiveScores : recommendations;
                    return gamesToCount.filter(g => {
                      const key = `${normalizeTeam(g.awayTeam)}_${normalizeTeam(g.homeTeam)}`;
                      const bet = betsMap.get(key);
                      return bet?.savantPick === true;
                    }).length;
                  })()}
                </span>
              </button>
              <SavantPickInfo isMobile={isMobile} />
            </div>
            
            {/* Sort Order Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                fontSize: '12px', 
                color: 'rgba(255,255,255,0.6)', 
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Sort:
              </span>
              {[
                { value: 'confidence', label: 'Confidence', icon: '🎯' },
                { value: 'savant', label: 'Savant Picks', icon: '⭐' },
                { value: 'time', label: 'Start Time', icon: '🕐' },
                { value: 'edge', label: 'Edge %', icon: '📈' }
              ].map(option => {
                const isActive = sortOrder === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Sort clicked:', option.value);
                      setSortOrder(option.value);
                    }}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                        : 'rgba(15, 23, 42, 0.5)',
                      border: isActive 
                        ? '2px solid #8b5cf6'
                        : '1px solid rgba(71, 85, 105, 0.3)',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.3)';
                      }
                    }}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Game Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {recommendations.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '2px dashed rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
            padding: isMobile ? '3rem 1.5rem' : '4rem 2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              fontSize: isMobile ? '3rem' : '4rem',
              marginBottom: '1.5rem',
              opacity: 0.8
            }}>
              🏀
            </div>
            <div style={{
              fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.5rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em'
            }}>
              No Quality Picks Today
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.body.size,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: '1.6',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              Our model hasn't found any games with 2%+ expected value today. Check back later for updated odds.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: isMobile ? '1rem' : '1.5rem' }}>
            {(() => {
              // Use gamesWithLiveScores if available, otherwise use recommendations
              const gamesToShow = gamesWithLiveScores.length > 0 ? gamesWithLiveScores : recommendations;
              
              // Helper to check if a game is a Savant Pick (reads from betsMap)
              const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
              const isGameSavantPick = (game) => {
                const key = `${normalizeTeam(game.awayTeam)}_${normalizeTeam(game.homeTeam)}`;
                const bet = betsMap.get(key);
                return bet?.savantPick === true;
              };
              
              // Apply status filter
              let filteredGames = gamesToShow.filter(game => {
                if (gameStatusFilter === 'all') return true;
                if (!game.liveScore) return gameStatusFilter === 'pre';
                return game.liveScore.status === gameStatusFilter;
              });
              
              // 🏆 Apply Savant Picks filter (if showSavantOnly is enabled)
              if (showSavantOnly) {
                filteredGames = filteredGames.filter(game => isGameSavantPick(game));
              }
              
              // 🎯 APPLY SORT ORDER
              // Helper to get game time from various possible locations
              const getGameTime = (game) => {
                return game.dratings?.gameTime || 
                       game.haslametrics?.gameTime || 
                       game.odds?.gameTime ||
                       game.gameTime || 
                       '';
              };
              
              if (sortOrder === 'savant') {
                // Sort by Savant Pick status (Savant Picks first, then by confidence)
                filteredGames = [...filteredGames].sort((a, b) => {
                  const aIsSavant = isGameSavantPick(a);
                  const bIsSavant = isGameSavantPick(b);
                  if (aIsSavant && !bIsSavant) return -1;
                  if (!aIsSavant && bIsSavant) return 1;
                  // If both same savant status, sort by unit size (confidence)
                  const unitA = a.prediction?.unitSize || 0;
                  const unitB = b.prediction?.unitSize || 0;
                  return unitB - unitA;
                });
              } else if (sortOrder === 'time') {
                // Sort by start time (parse from gameTime string like "7:00 PM ET")
                filteredGames = [...filteredGames].sort((a, b) => {
                  const parseTime = (timeStr) => {
                    if (!timeStr) return 9999; // Put games without time at end
                    // Handle "LIVE" games - put them first
                    if (timeStr.toUpperCase() === 'LIVE') return -1;
                    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (!match) return 9999;
                    let hours = parseInt(match[1]);
                    const minutes = parseInt(match[2]);
                    const isPM = match[3].toUpperCase() === 'PM';
                    if (isPM && hours !== 12) hours += 12;
                    if (!isPM && hours === 12) hours = 0;
                    return hours * 60 + minutes;
                  };
                  return parseTime(getGameTime(a)) - parseTime(getGameTime(b));
                });
              } else if (sortOrder === 'edge') {
                // Sort by edge/EV percentage (highest first)
                filteredGames = [...filteredGames].sort((a, b) => {
                  const edgeA = a.prediction?.ev || a.prediction?.edge || 0;
                  const edgeB = b.prediction?.ev || b.prediction?.edge || 0;
                  return edgeB - edgeA;
                });
              }
              // Default 'confidence' keeps the tier grouping below
              
              // 🎯 CBB SOFT PAYWALL: Split games for free users
              // ⚠️ CRITICAL: Premium users OR users who dismissed paywall must see ALL games!
              const shouldShowPaywall = isFree && !subscriptionLoading && filteredGames.length > 1 && !paywallDismissed;
              const freePreviewGames = shouldShowPaywall ? filteredGames.slice(0, 1) : filteredGames;
              const lockedGames = shouldShowPaywall ? filteredGames.slice(1) : [];
              
              // Use freePreviewGames for display (premium users get all games in this variable)
              const gamesToDisplay = freePreviewGames;
              
              console.log(`🎯 PAYWALL CHECK: isPremium=${isPremium}, isFree=${isFree}, shouldShowPaywall=${shouldShowPaywall}`);
              console.log(`📊 GAMES: total=${filteredGames.length}, displaying=${gamesToDisplay.length}, locked=${lockedGames.length}`);
              
              // 🎯 GROUP BY CONVICTION TIER (all are bets!) - only for confidence sort
              const gamesByTier = {
                max: [],
                moderate: [],
                small: []
              };
              
              gamesToDisplay.forEach(game => {
                if (!game.prediction?.grade || !game.bet?.odds) {
                  gamesByTier.moderate.push(game); // Default to moderate if no tier data
                  return;
                }
                
                // Use dynamic tier from stored data when available
                const tier = getDynamicTierInfo(game.prediction);
                if (tier.tier <= 2) gamesByTier.max.push(game);  // ELITE or HIGH = max
                else if (tier.tier <= 4) gamesByTier.moderate.push(game);  // GOOD or MODERATE
                else gamesByTier.small.push(game);
              });
              
              // Calculate tier statistics for enhanced header
              const allTiers = {
                maximum: {
                  count: gamesByTier.max.length,
                  totalUnits: gamesByTier.max.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0),
                  games: gamesByTier.max
                },
                moderate: {
                  count: gamesByTier.moderate.length,
                  totalUnits: gamesByTier.moderate.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0),
                  games: gamesByTier.moderate
                },
                small: {
                  count: gamesByTier.small.length,
                  totalUnits: gamesByTier.small.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0),
                  games: gamesByTier.small
                }
              };
              
              let rankCounter = 1;
              
              // 🕐 TIME, 📈 EDGE, or ⭐ SAVANT SORT: Flat list without tier grouping
              if (sortOrder === 'time' || sortOrder === 'edge' || sortOrder === 'savant') {
                const sortConfig = {
                  time: { label: 'Start Time', icon: '🕐', desc: 'Earliest games first', color: '#a78bfa' },
                  edge: { label: 'Edge %', icon: '📈', desc: 'Highest edge first', color: '#a78bfa' },
                  savant: { label: 'Savant Picks', icon: '⭐', desc: 'Analyst picks first', color: 'rgba(251, 191, 36, 0.95)' }
                };
                const { label: sortLabel, icon: sortIcon, desc: sortDesc, color: sortColor } = sortConfig[sortOrder];
                
                // Count savant picks for header display
                const savantCount = gamesToDisplay.filter(g => isGameSavantPick(g)).length;
                
                return (
                  <>
                    {/* Sort Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isMobile ? '12px 14px' : '14px 20px',
                      background: sortOrder === 'savant' 
                        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(245, 158, 11, 0.05))'
                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))',
                      border: sortOrder === 'savant'
                        ? '1px solid rgba(251, 191, 36, 0.25)'
                        : '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      marginBottom: '12px'
                    }}>
                      <span style={{ fontSize: '20px' }}>{sortIcon}</span>
                      <div>
                        <div style={{
                          fontSize: isMobile ? '14px' : '15px',
                          fontWeight: '700',
                          color: sortColor,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Sorted by {sortLabel}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.6)'
                        }}>
                          {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} • 
                          {sortOrder === 'savant' 
                            ? ` ${savantCount} Savant Pick${savantCount !== 1 ? 's' : ''}`
                            : ` ${sortDesc}`
                          }
                        </div>
                      </div>
                    </div>
                    
                    {/* Flat list of all games - respects paywall state */}
                    {gamesToDisplay.map((game) => (
                      <BasketballGameCard 
                        key={rankCounter} 
                        game={game} 
                        rank={rankCounter++} 
                        isMobile={isMobile}
                        hasLiveScore={!!game.liveScore}
                        isSavantPick={isGameSavantPick(game)}
                        displayTime={sortOrder === 'time' ? getGameTime(game) : null}
                      />
                    ))}
                  </>
                );
              }
              
              // 🎯 CONFIDENCE SORT: Grouped by tier (default)
              return (
                <>
                  {/* TIER 1: MAXIMUM CONVICTION (5.0u) */}
                  {gamesByTier.max.length > 0 && (
                    <>
                      <TierHeader 
                        emoji="🔥" 
                        title={isMobile ? "MAX CONVICTION" : "MAXIMUM CONVICTION"}
                        subtitle={`${gamesByTier.max.length} game${gamesByTier.max.length !== 1 ? 's' : ''} • Top-tier opportunities with 5.0 unit allocation`}
                        color="#10B981"
                        unitRange="5.0u"
                        isMobile={isMobile}
                      />
                      {gamesByTier.max.map((game) => (
                        <BasketballGameCard 
                          key={rankCounter} 
                          game={game} 
                          rank={rankCounter++} 
                          isMobile={isMobile}
                          hasLiveScore={!!game.liveScore}
                          isSavantPick={isGameSavantPick(game)}
                        />
                      ))}
                    </>
                  )}
                  
                  {/* TIER 2: CORE PLAYS (1.5-4.0u) */}
                  {gamesByTier.moderate.length > 0 && (
                    <>
                      <EnhancedTierHeader 
                        emoji="⚡" 
                        title="CORE PLAYS" 
                        subtitle={`${gamesByTier.moderate.length} game${gamesByTier.moderate.length !== 1 ? 's' : ''} • Standard allocation between 1.5-4.0 units`}
                        color="#3B82F6"
                        unitRange="1.5-4.0u"
                        isMobile={isMobile}
                        tierGames={gamesByTier.moderate}
                        allTiers={allTiers}
                      />
                      {gamesByTier.moderate.map((game) => (
                        <BasketballGameCard 
                          key={rankCounter} 
                          game={game} 
                          rank={rankCounter++} 
                          isMobile={isMobile}
                          hasLiveScore={!!game.liveScore}
                          isSavantPick={isGameSavantPick(game)}
                        />
                      ))}
                    </>
                  )}
                  
                  {/* TIER 3: SMALL POSITION (0.5-1.0u) */}
                  {gamesByTier.small.length > 0 && (
                    <>
                      <TierHeader 
                        emoji="📊" 
                        title="SMALL POSITION" 
                        subtitle={`${gamesByTier.small.length} game${gamesByTier.small.length !== 1 ? 's' : ''} • Conservative 0.5-1.0 unit allocation for risk management`}
                        color="#8B5CF6"
                        unitRange="0.5-1.0u"
                        isMobile={isMobile}
                      />
                      {gamesByTier.small.map((game) => (
                        <BasketballGameCard 
                          key={rankCounter} 
                          game={game} 
                          rank={rankCounter++} 
                          isMobile={isMobile}
                          hasLiveScore={!!game.liveScore}
                          isSavantPick={isGameSavantPick(game)}
                        />
                      ))}
                    </>
                  )}
                </>
              );
            })()}
            
            {/* 🎯 CBB SOFT PAYWALL - Shows blurred locked games for free users */}
            {(() => {
              // Check if we should show the paywall
              const gamesToShow = gamesWithLiveScores.length > 0 ? gamesWithLiveScores : recommendations;
              const showPaywall = isFree && !subscriptionLoading && gamesToShow.length > 1 && !paywallDismissed;
              
              if (showPaywall) {
                console.log(`🔒 RENDERING SOFT PAYWALL: ${gamesToShow.length - 1} games locked`);
                return (
                  <CBBSoftPaywall 
                    games={gamesToShow}
                    onUpgradeClick={() => setShowUpgradeModal(true)}
                    onDismiss={() => {
                      console.log('👁️ User dismissed paywall - showing full preview');
                      setPaywallDismissed(true);
                    }}
                  />
                );
              }
              return null;
            })()}
          </div>
        )}
        
        {/* 🎯 CBB UPGRADE MODAL */}
        <CBBUpgradeModal 
          show={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
      </div>
    </div>
  );
};

// Helper Components

// Tier Header Component - Premium Mobile-Optimized
// Enhanced Tier Header with Visual Distribution + Top Plays
const EnhancedTierHeader = ({ 
  emoji, 
  title, 
  subtitle, 
  color, 
  unitRange, 
  isMobile,
  tierGames,
  allTiers
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate tier stats
  const totalUnits = tierGames.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0);
  const avgROI = tierGames.length > 0 
    ? tierGames.reduce((sum, g) => sum + (g.prediction?.historicalROI || 0), 0) / tierGames.length 
    : 0;
  const expectedProfit = totalUnits * (avgROI / 100);
  
  // Get top 3 plays by unit size
  const topPlays = [...tierGames]
    .sort((a, b) => (b.prediction?.unitSize || 0) - (a.prediction?.unitSize || 0))
    .slice(0, 3);
  
  // Calculate 5-tier granular distribution for PREMIUM visual
  const distributionTiers = {
    elite: { min: 5.0, max: 5.0, games: [], totalUnits: 0, color: '#10B981', label: 'Elite' },
    premium: { min: 4.0, max: 4.9, games: [], totalUnits: 0, color: '#14B8A6', label: 'Premium' },
    strong: { min: 2.5, max: 3.9, games: [], totalUnits: 0, color: '#3B82F6', label: 'Strong' },
    conservative: { min: 1.0, max: 2.4, games: [], totalUnits: 0, color: '#8B5CF6', label: 'Conservative' },
    minimal: { min: 0.5, max: 0.9, games: [], totalUnits: 0, color: '#6366F1', label: 'Minimal' }
  };
  
  // Distribute all games across tiers - SAFE ACCESS
  const allGames = [
    ...(allTiers?.maximum?.games || []), 
    ...(allTiers?.moderate?.games || []), 
    ...(allTiers?.small?.games || [])
  ];
  
  allGames.forEach(game => {
    const units = game.prediction?.unitSize || 0;
    
    if (units >= 5.0) {
      distributionTiers.elite.games.push(game);
      distributionTiers.elite.totalUnits += units;
    } else if (units >= 4.0) {
      distributionTiers.premium.games.push(game);
      distributionTiers.premium.totalUnits += units;
    } else if (units >= 2.5) {
      distributionTiers.strong.games.push(game);
      distributionTiers.strong.totalUnits += units;
    } else if (units >= 1.0) {
      distributionTiers.conservative.games.push(game);
      distributionTiers.conservative.totalUnits += units;
    } else if (units >= 0.5) {
      distributionTiers.minimal.games.push(game);
      distributionTiers.minimal.totalUnits += units;
    }
  });
  
  const grandTotal = Object.values(distributionTiers).reduce((sum, tier) => sum + tier.totalUnits, 0);
  
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}18 0%, ${color}10 100%)`,
      border: `2px solid ${color}40`,
      borderRadius: isMobile ? '14px' : '16px',
      padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
      marginBottom: isMobile ? '0.75rem' : '1rem',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 6px 20px ${color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
    onClick={() => setExpanded(!expanded)}
    >
      {/* Subtle glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at top left, ${color}15 0%, transparent 60%)`,
        pointerEvents: 'none'
      }} />
      
      {/* Main Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '0.875rem' : '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Emoji Badge */}
        <div style={{
          width: isMobile ? '42px' : '48px',
          height: isMobile ? '42px' : '48px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
          border: `2px solid ${color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '1.375rem' : '1.5rem',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${color}25, inset 0 1px 0 rgba(255,255,255,0.15)`
        }}>
          {emoji}
        </div>
        
        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? '0.938rem' : '1.063rem',
            fontWeight: '900',
            color: color,
            letterSpacing: '-0.02em',
            marginBottom: '0.375rem',
            textShadow: `0 2px 16px ${color}35`,
            lineHeight: 1.15
          }}>
            {title}
          </div>
          
          {/* PREMIUM STATS ROW when collapsed */}
          {!expanded && (
            <div style={{
              display: 'flex',
              gap: isMobile ? '0.625rem' : '0.75rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.5rem',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)'
              }}>
                <span style={{
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.60)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>Games</span>
                <span style={{
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: '900',
                  fontFeatureSettings: "'tnum'"
                }}>{tierGames.length}</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.5rem',
                background: `${color}15`,
                borderRadius: '6px',
                border: `1px solid ${color}30`
              }}>
                <span style={{
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.60)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>Units</span>
                <span style={{
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  color: color,
                  fontWeight: '900',
                  fontFeatureSettings: "'tnum'"
                }}>{totalUnits.toFixed(1)}</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.5rem',
                background: avgROI >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                borderRadius: '6px',
                border: avgROI >= 0 ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)'
              }}>
                <span style={{
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.60)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>ROI</span>
                <span style={{
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  color: avgROI >= 0 ? '#10B981' : '#EF4444',
                  fontWeight: '900',
                  fontFeatureSettings: "'tnum'"
                }}>{avgROI >= 0 ? '+' : ''}{avgROI.toFixed(1)}%</span>
              </div>
            </div>
          )}
          
          {/* Simple text when expanded */}
          {expanded && (
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(255,255,255,0.70)',
              lineHeight: 1.35,
              fontWeight: '600'
            }}>
              {tierGames.length} games • {totalUnits.toFixed(1)}u allocated • {avgROI >= 0 ? '+' : ''}{avgROI.toFixed(1)}% ROI
            </div>
          )}
        </div>
        
        {/* Expected Profit Badge - ONLY show if positive */}
        {expectedProfit >= 0 && (
          <div style={{
            padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.875rem',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.15) 100%)',
            border: '1.5px solid rgba(16,185,129,0.40)',
            borderRadius: '10px',
            fontSize: isMobile ? '0.75rem' : '0.813rem',
            fontWeight: '900',
            color: '#10B981',
            fontFeatureSettings: "'tnum'",
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(16,185,129,0.20)',
            whiteSpace: 'nowrap'
          }}>
            +{expectedProfit.toFixed(1)}u
          </div>
        )}
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div style={{
          marginTop: isMobile ? '0.875rem' : '1rem',
          paddingTop: isMobile ? '0.875rem' : '1rem',
          borderTop: `1px solid ${color}25`,
          position: 'relative',
          zIndex: 1
        }}>
          {/* Visual Distribution - 5-TIER PREMIUM GRANULAR */}
          <div style={{
            marginBottom: isMobile ? '1rem' : '1.25rem'
          }}>
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '900',
              marginBottom: isMobile ? '0.625rem' : '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: isMobile ? '3px' : '4px',
                height: isMobile ? '12px' : '14px',
                background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                borderRadius: '2px'
              }} />
              Today's Distribution
            </div>
            
            {/* Render 5 granular tiers */}
            {Object.entries(distributionTiers).map(([key, tier], idx) => {
              const percent = grandTotal > 0 ? (tier.totalUnits / grandTotal) * 100 : 0;
              const isLast = idx === Object.keys(distributionTiers).length - 1;
              
              // Only show tiers with games
              if (tier.games.length === 0) return null;
              
              return (
                <div key={key} style={{
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '10px',
                  padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 0.875rem',
                  border: `1px solid ${tier.color}20`,
                  backdropFilter: 'blur(8px)',
                  marginBottom: isLast ? 0 : (isMobile ? '0.5rem' : '0.625rem')
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      color: tier.color,
                      fontWeight: idx === 0 ? '800' : '700',
                      letterSpacing: '0.02em'
                    }}>
                      {tier.label.toUpperCase()} <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>
                        ({tier.min === tier.max ? `${tier.min}u` : `${tier.min}-${tier.max}u`})
                      </span>
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      fontWeight: '800',
                      color: tier.color,
                      fontFeatureSettings: "'tnum'",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.60)', fontWeight: '600' }}>
                        {tier.games.length} game{tier.games.length !== 1 ? 's' : ''}
                      </span>
                      <span style={{
                        padding: '0.125rem 0.375rem',
                        background: `${tier.color}15`,
                        borderRadius: '4px',
                        border: `1px solid ${tier.color}30`
                      }}>
                        {tier.totalUnits.toFixed(1)}u
                      </span>
                    </div>
                  </div>
                  <div style={{
                    height: isMobile ? '7px' : '9px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${tier.color} 0%, ${tier.color}DD 100%)`,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 0 10px ${tier.color}40`,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                        borderRadius: '6px 6px 0 0'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Top Plays - PREMIUM */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '12px',
            padding: isMobile ? '0.875rem' : '1rem',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '900',
              marginBottom: isMobile ? '0.75rem' : '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: isMobile ? '3px' : '4px',
                height: isMobile ? '12px' : '14px',
                background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                borderRadius: '2px'
              }} />
              Top Plays in This Tier
            </div>
            
            {topPlays.map((game, idx) => {
              const gradeColors = getGradeColorScale(game.prediction?.grade || 'B');
              const rankColors = ['#10B981', '#14B8A6', '#3B82F6'];
              const rankColor = rankColors[idx] || color;
              
              return (
                <div key={idx} style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 0.875rem',
                  marginBottom: idx < topPlays.length - 1 ? (isMobile ? '0.5rem' : '0.625rem') : 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '0.625rem' : '0.75rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  {/* Rank Badge - Gradient */}
                  <div style={{
                    width: isMobile ? '26px' : '30px',
                    height: isMobile ? '26px' : '30px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${rankColor}35 0%, ${rankColor}20 100%)`,
                    border: `2px solid ${rankColor}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '0.688rem' : '0.75rem',
                    fontWeight: '900',
                    color: rankColor,
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${rankColor}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at top, ${rankColor}20 0%, transparent 70%)`,
                      pointerEvents: 'none'
                    }} />
                    {idx + 1}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: isMobile ? '0.75rem' : '0.813rem',
                      fontWeight: '900',
                      color: 'rgba(255,255,255,0.95)',
                      marginBottom: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em'
                    }}>
                      {game.awayTeam} @ {game.homeTeam}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      color: 'rgba(255,255,255,0.60)',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.125rem 0.375rem',
                        background: `${gradeColors.borderColor}20`,
                        border: `1px solid ${gradeColors.borderColor}35`,
                        borderRadius: '4px',
                        color: gradeColors.color,
                        fontWeight: '800',
                        fontSize: isMobile ? '0.625rem' : '0.688rem'
                      }}>
                        {game.prediction?.grade}
                      </span>
                      <span style={{
                        color: 'rgba(255,255,255,0.55)',
                        fontFeatureSettings: "'tnum'"
                      }}>
                        {game.prediction?.bestOdds > 0 ? '+' : ''}{game.prediction?.bestOdds}
                      </span>
                    </div>
                  </div>
                  
                  {/* Unit Badge */}
                  <div style={{
                    padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
                    background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
                    border: `1.5px solid ${color}45`,
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.75rem' : '0.813rem',
                    fontWeight: '900',
                    color: color,
                    whiteSpace: 'nowrap',
                    boxShadow: `0 2px 8px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    fontFeatureSettings: "'tnum'",
                    letterSpacing: '-0.01em'
                  }}>
                    {game.prediction?.unitSize.toFixed(1)}u
                  </div>
                  
                  {/* ROI Badge */}
                  <div style={{
                    padding: isMobile ? '0.375rem 0.5rem' : '0.5rem 0.625rem',
                    background: game.prediction?.historicalROI >= 0 
                      ? 'linear-gradient(135deg, rgba(16,185,129,0.20) 0%, rgba(16,185,129,0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(245,158,11,0.20) 0%, rgba(245,158,11,0.12) 100%)',
                    border: game.prediction?.historicalROI >= 0
                      ? '1.5px solid rgba(16,185,129,0.35)'
                      : '1.5px solid rgba(245,158,11,0.35)',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.688rem' : '0.75rem',
                    fontWeight: '900',
                    color: game.prediction?.historicalROI >= 0 ? '#10B981' : '#F59E0B',
                    whiteSpace: 'nowrap',
                    fontFeatureSettings: "'tnum'",
                    boxShadow: game.prediction?.historicalROI >= 0
                      ? '0 2px 8px rgba(16,185,129,0.15)'
                      : '0 2px 8px rgba(245,158,11,0.15)'
                  }}>
                    {game.prediction?.historicalROI >= 0 ? '+' : ''}{game.prediction?.historicalROI.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Click to collapse hint - PREMIUM */}
          <div style={{
            marginTop: isMobile ? '1rem' : '1.125rem',
            paddingTop: isMobile ? '0.875rem' : '1rem',
            borderTop: `1px solid ${color}15`,
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              background: `linear-gradient(135deg, ${color}12 0%, ${color}08 100%)`,
              border: `1px solid ${color}20`,
              borderRadius: '8px',
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.55)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${color}20 0%, ${color}12 100%)`;
              e.currentTarget.style.borderColor = `${color}35`;
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${color}12 0%, ${color}08 100%)`;
              e.currentTarget.style.borderColor = `${color}20`;
              e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            }}
            >
              <span>Collapse Details</span>
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>↑</span>
            </div>
          </div>
        </div>
      )}
      
      {/* PREMIUM COLLAPSED VIEW */}
      {!expanded && (
        <>
          {/* Quick Stats Bar */}
          <div style={{
            marginTop: isMobile ? '0.75rem' : '0.875rem',
            paddingTop: isMobile ? '0.75rem' : '0.875rem',
            borderTop: `1px solid ${color}15`,
            position: 'relative',
            zIndex: 1
          }}>
            {/* Mini Distribution Preview */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '0.375rem' : '0.5rem',
              marginBottom: isMobile ? '0.625rem' : '0.75rem',
              alignItems: 'center'
            }}>
              {Object.entries(distributionTiers).map(([key, tier]) => {
                if (tier.games.length === 0) return null;
                const percent = grandTotal > 0 ? (tier.totalUnits / grandTotal) * 100 : 0;
                
                return (
                  <div key={key} style={{
                    flex: percent,
                    minWidth: '0',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      fontWeight: '800',
                      color: tier.color,
                      marginBottom: '0.375rem',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase'
                    }}>
                      {tier.games.length}
                    </div>
                    <div style={{
                      height: isMobile ? '5px' : '6px',
                      background: `linear-gradient(90deg, ${tier.color} 0%, ${tier.color}DD 100%)`,
                      borderRadius: '4px',
                      boxShadow: `0 3px 10px ${tier.color}45`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                        borderRadius: '4px 4px 0 0'
                      }} />
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.563rem' : '0.625rem',
                      fontWeight: '800',
                      color: 'rgba(255,255,255,0.55)',
                      marginTop: '0.375rem',
                      fontFeatureSettings: "'tnum'"
                    }}>
                      {tier.totalUnits.toFixed(1)}u
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Expand Button - PREMIUM */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: isMobile ? '0.5rem 1rem' : '0.625rem 1.25rem',
                background: `linear-gradient(135deg, ${color}18 0%, ${color}10 100%)`,
                border: `1.5px solid ${color}30`,
                borderRadius: '10px',
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: color,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 4px 12px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${color}28 0%, ${color}18 100%)`;
                e.currentTarget.style.borderColor = `${color}50`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${color}35, inset 0 1px 0 rgba(255,255,255,0.15)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${color}18 0%, ${color}10 100%)`;
                e.currentTarget.style.borderColor = `${color}30`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)`;
              }}
              >
                {/* Glow effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />
                
                <span style={{ position: 'relative', zIndex: 1 }}>View Full Breakdown</span>
                <span style={{ 
                  fontSize: isMobile ? '0.813rem' : '0.875rem',
                  position: 'relative',
                  zIndex: 1
                }}>↓</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Simple Tier Header (for non-moderate tiers)
const TierHeader = ({ emoji, title, subtitle, color, unitRange, isMobile }) => {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}18 0%, ${color}10 100%)`,
      border: `2px solid ${color}40`,
      borderRadius: isMobile ? '14px' : '16px',
      padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
      marginBottom: isMobile ? '0.75rem' : '1rem',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 6px 20px ${color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at top left, ${color}15 0%, transparent 60%)`,
        pointerEvents: 'none'
      }} />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '0.875rem' : '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Emoji Badge */}
        <div style={{
          width: isMobile ? '42px' : '48px',
          height: isMobile ? '42px' : '48px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
          border: `2px solid ${color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '1.375rem' : '1.5rem',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${color}25, inset 0 1px 0 rgba(255,255,255,0.15)`
        }}>
          {emoji}
        </div>
        
        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? '0.938rem' : '1.063rem',
            fontWeight: '900',
            color: color,
            letterSpacing: '-0.02em',
            marginBottom: '0.25rem',
            textShadow: `0 2px 16px ${color}35`,
            lineHeight: 1.15
          }}>
            {title}
          </div>
          <div style={{
            fontSize: isMobile ? '0.688rem' : '0.75rem',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.35,
            fontWeight: '600'
          }}>
            {subtitle}
          </div>
        </div>
        
        {/* Unit Range Badge (desktop only) */}
        {!isMobile && unitRange && (
          <div style={{
            padding: '0.5rem 0.875rem',
            background: `linear-gradient(135deg, ${color}25 0%, ${color}15 100%)`,
            border: `1.5px solid ${color}40`,
            borderRadius: '10px',
            fontSize: '0.813rem',
            fontWeight: '900',
            color: color,
            fontFeatureSettings: "'tnum'",
            letterSpacing: '0.02em',
            boxShadow: `0 2px 8px ${color}20`
          }}>
            {unitRange}
          </div>
        )}
      </div>
    </div>
  );
};

const BasketballGameCard = ({ game, rank, isMobile, hasLiveScore, isSavantPick = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const pred = game.prediction;
  const odds = game.odds;
  const liveScore = game.liveScore;
  const grade = game.grade;
  
  // If no prediction, show minimal card with just game info
  if (!pred || pred.error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '20px',
        border: ELEVATION.elevated.border,
        boxShadow: ELEVATION.elevated.shadow,
        padding: isMobile ? '1rem' : '1.25rem',
        opacity: 0.6
      }}>
        <div style={{ color: 'white', fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {game.awayTeam} @ {game.homeTeam}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          {odds?.gameTime || 'TBD'}
        </div>
        {liveScore && (
          <div style={{ marginTop: '0.75rem', color: '#10B981', fontWeight: '700' }}>
            {liveScore.awayScore} - {liveScore.homeScore} ({liveScore.status})
          </div>
        )}
        {!pred && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>No prediction available</div>}
      </div>
    );
  }
  
  const gradeColors = getGradeColorScale(pred.grade);
  
  // Format game time (remove "ET" suffix for cleaner look)
  const formatGameTime = (time) => {
    if (!time || time === 'TBD') return 'TBD';
    return time.replace(/\s+ET$/i, '').trim();
  };

  // Determine border and shadow based on A+ grade OR Savant Pick status
  const getCardStyles = () => {
    if (pred.grade === 'A+') {
      return {
        border: `2px solid ${gradeColors.borderColor}`,
        boxShadow: `0 8px 32px ${gradeColors.borderColor}40, 0 0 60px ${gradeColors.borderColor}15`
      };
    }
    if (isSavantPick) {
      return {
        border: '1.5px solid rgba(251, 191, 36, 0.35)',
        boxShadow: '0 6px 24px rgba(251, 191, 36, 0.12), 0 0 40px rgba(251, 191, 36, 0.06)'
      };
    }
    return {
      border: ELEVATION.elevated.border,
      boxShadow: ELEVATION.elevated.shadow
    };
  };
  
  const cardStyles = getCardStyles();

  return (
    <div style={{
      background: isSavantPick 
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 35, 50, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '20px',
      border: cardStyles.border,
      boxShadow: cardStyles.boxShadow,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }}>
      {/* Animated gradient overlay for A+ picks */}
      {pred.grade === 'A+' && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '200%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${gradeColors.borderColor}15, transparent)`,
            animation: 'shimmer 3s infinite',
            pointerEvents: 'none',
            zIndex: 1
          }} />
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
          `}</style>
        </>
      )}
      
      {/* HEADER - Unit-First Design */}
      <div style={{ 
        padding: isMobile ? '1rem' : '1.125rem',
        borderBottom: ELEVATION.flat.border,
        background: isSavantPick 
          ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.06) 0%, rgba(0,0,0,0.15) 100%)'
          : 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 100%)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* ⭐ SAVANT PICK BADGE - positioned in top-right */}
        {isSavantPick && (
          <div style={{
            position: 'absolute',
            top: isMobile ? '0.75rem' : '0.875rem',
            right: isMobile ? '0.75rem' : '1rem',
            zIndex: 10
          }}>
            <SavantPickBadge isMobile={isMobile} showTooltip={true} />
          </div>
        )}
        
        {/* 🔒 LOCKED PICK BADGE (if from original bet) */}
        {pred.isLockedPick && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#D4AF37',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.2)'
          }}>
            <span>🔒</span>
            <span>ORIGINAL PICK</span>
            <span style={{ 
              color: 'rgba(212, 175, 55, 0.7)', 
              fontSize: '0.7rem',
              marginLeft: '0.25rem'
            }}>
              {pred.initialOdds ? `@ ${pred.initialOdds}` : ''}
            </span>
          </div>
        )}
        
        {/* 🎯 UNIT SIZE HERO + CONFIDENCE BADGE */}
        {(() => {
          // Use dynamic tier from stored Firebase data when available
          const tierInfo = getDynamicTierInfo(pred);
          const confidence = getDynamicConfidenceRating(pred);
          
          return (
            <div style={{
              marginBottom: isMobile ? '0.75rem' : '0.875rem'
            }}>
              {/* UNIT SIZE - HERO ELEMENT */}
              <div style={{
                marginBottom: '0.625rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}>
                {/* Left: BET label + HUGE unit */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    BET:
                  </span>
                  <span style={{
                    fontSize: isMobile ? '2rem' : '2.25rem',
                    fontWeight: '900',
                    color: tierInfo.color,
                    letterSpacing: '-0.04em',
                    fontFeatureSettings: "'tnum'",
                    textShadow: `0 2px 16px ${tierInfo.color}40, 0 0 40px ${tierInfo.color}20`,
                    lineHeight: 0.9
                  }}>
                    {pred.unitSize > 0 ? `${pred.unitSize}u` : '0.5u'}
                  </span>
                </div>
                
                {/* Right: Confidence badge (NO EMOJI - PREMIUM) */}
                <div style={{
                  background: `linear-gradient(135deg, ${confidence.color}20 0%, ${confidence.color}12 100%)`,
                  border: `2px solid ${confidence.color}50`,
                  borderRadius: '10px',
                  padding: isMobile ? '0.563rem 0.875rem' : '0.625rem 1rem',
                  boxShadow: `0 3px 12px ${confidence.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`
                }}>
                  <span style={{
                    fontSize: isMobile ? '0.75rem' : '0.813rem',
                    fontWeight: '900',
                    color: confidence.color,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textShadow: `0 1px 6px ${confidence.color}30`
                  }}>
                    {confidence.label}
                  </span>
                </div>
              </div>
              
              {/* Pattern Context */}
              <div style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255,255,255,0.70)',
                fontWeight: '600',
                lineHeight: 1.4,
                letterSpacing: '0.01em'
              }}>
                {pred.oddsRangeName || 'Standard odds'} pattern
              </div>
            </div>
          );
        })()}
        
        {/* Top Row: Rank + Teams + Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.75rem' }}>
          {/* Rank Badge */}
          <div style={{
            width: isMobile ? '28px' : '32px',
            height: isMobile ? '28px' : '32px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${gradeColors.borderColor}30 0%, ${gradeColors.borderColor}15 100%)`,
            border: `1.5px solid ${gradeColors.borderColor}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: '800',
            color: gradeColors.color,
            flexShrink: 0
          }}>
            {rank}
          </div>
          
          {/* Teams + Time */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: isMobile ? '0.938rem' : '1.063rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '0.188rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              {game.awayTeam} @ {game.homeTeam}
            </div>
            <div style={{ 
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <span style={{ color: gradeColors.color, fontSize: '0.5rem' }}>●</span> {formatGameTime(odds?.gameTime)}
            </div>
          </div>
        </div>
        
        {/* Premium Result Bar - FINAL GAMES */}
          {game.betOutcome && (
            <div style={{
            marginTop: '0.75rem',
              background: game.betOutcome.outcome === 'WIN' 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.06) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${game.betOutcome.outcome === 'WIN' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              borderRadius: '10px',
            padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            boxShadow: game.betOutcome.outcome === 'WIN'
              ? '0 4px 16px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 4px 16px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>
            {/* Left: Grade + Units (compact) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Grade */}
              <div style={{
                background: `linear-gradient(135deg, ${gradeColors.borderColor}20 0%, ${gradeColors.borderColor}10 100%)`,
                border: `1.5px solid ${gradeColors.borderColor}`,
                color: gradeColors.color,
                padding: isMobile ? '0.313rem 0.563rem' : '0.375rem 0.625rem',
                borderRadius: '7px',
              fontWeight: '900',
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                letterSpacing: '-0.01em',
                boxShadow: `0 2px 8px ${gradeColors.borderColor}20`
              }}>
                {pred.grade}
              </div>
              
              {/* Units - USE STORED VALUE, not recalculated */}
              {(() => {
                // Get unit color based on actual stored unit size
                const unitColor = pred.unitSize >= 5 ? '#10B981' 
                  : pred.unitSize >= 4 ? '#14B8A6'
                  : pred.unitSize >= 3 ? '#3B82F6'
                  : pred.unitSize >= 2 ? '#8B5CF6'
                  : pred.unitSize >= 1 ? '#A855F7'
                  : '#6366F1';
                return (
                  <div style={{
                    background: `linear-gradient(135deg, ${unitColor}15 0%, ${unitColor}08 100%)`,
                    border: `1.5px solid ${unitColor}`,
                    color: unitColor,
                    padding: isMobile ? '0.313rem 0.563rem' : '0.375rem 0.625rem',
                    borderRadius: '7px',
                    fontWeight: '900',
                    fontSize: isMobile ? '0.75rem' : '0.813rem',
                    letterSpacing: '0.01em',
                    fontFeatureSettings: "'tnum'",
                    boxShadow: `0 2px 8px ${unitColor}20`
                  }}>
                    {pred.unitSize}u
                  </div>
                );
              })()}
            </div>
            
            {/* Right: Profit (hero element) */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: isMobile ? '0.25rem 0.5rem' : '0.313rem 0.625rem',
              background: game.betOutcome.outcome === 'WIN'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
              borderRadius: '8px',
              border: `1px solid ${game.betOutcome.outcome === 'WIN' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div style={{
                fontSize: isMobile ? '1rem' : '1.125rem',
                lineHeight: 1,
                filter: game.betOutcome.outcome === 'WIN'
                  ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))'
                  : 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))'
              }}>
                {game.betOutcome.outcome === 'WIN' ? '✅' : '❌'}
              </div>
              <div style={{
                fontSize: isMobile ? '1.063rem' : '1.188rem',
                fontWeight: '900',
                color: game.betOutcome.outcome === 'WIN' ? '#10B981' : '#EF4444',
                letterSpacing: '-0.02em',
                fontFeatureSettings: "'tnum'",
                textShadow: game.betOutcome.outcome === 'WIN'
                  ? '0 2px 10px rgba(16, 185, 129, 0.3)'
                  : '0 2px 10px rgba(239, 68, 68, 0.3)'
              }}>
                {game.betOutcome.profit > 0 ? '+' : ''}{game.betOutcome.profit.toFixed(2)}u
              </div>
            </div>
            </div>
          )}
          
        {/* Bet Details for PENDING games - PREMIUM MOBILE-OPTIMIZED */}
        {!game.betOutcome && (
          <div style={{
            marginTop: isMobile ? '0.75rem' : '0.875rem',
            background: (() => {
              const tierInfo = getDynamicTierInfo(pred);
              return tierInfo.bgGradient;
            })(),
            border: (() => {
              const tierInfo = getDynamicTierInfo(pred);
              return `2.5px solid ${tierInfo.borderColor}`;
            })(),
            borderRadius: isMobile ? '14px' : '16px',
            padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
            boxShadow: (() => {
              const tierInfo = getDynamicTierInfo(pred);
              return `0 6px 22px ${tierInfo.color}28, inset 0 1px 0 rgba(255,255,255,0.12)`;
            })(),
            backdropFilter: 'blur(10px)'
          }}>
            {/* PREMIUM MOBILE-FIRST LAYOUT */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.875rem' : '1rem',
              marginBottom: isMobile ? '0.625rem' : '0.75rem'
            }}>
              {/* Grade Badge - HERO ELEMENT */}
              <div style={{
                background: `linear-gradient(135deg, ${gradeColors.borderColor}30 0%, ${gradeColors.borderColor}18 100%)`,
                border: `2.5px solid ${gradeColors.borderColor}`,
                color: gradeColors.color,
                padding: isMobile ? '0.625rem 0.875rem' : '0.688rem 1rem',
                borderRadius: '11px',
                fontWeight: '900',
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                letterSpacing: '-0.03em',
                boxShadow: `0 4px 14px ${gradeColors.borderColor}35, inset 0 1px 0 rgba(255,255,255,0.15)`,
                flexShrink: 0,
                lineHeight: 0.9,
                minWidth: isMobile ? '42px' : '48px',
                textAlign: 'center'
              }}>
                {pred.grade}
              </div>
              
              {/* Unit Size - PROMINENT */}
              <div style={{
                flex: 1
              }}>
                <div style={{
                  fontSize: isMobile ? '0.875rem' : '0.938rem',
                  fontWeight: '800',
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2
                }}>
                  {pred.unitSize} unit{pred.unitSize !== 1 ? 's' : ''} allocated
                </div>
                <div style={{
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: pred.historicalROI >= 0 ? '#10B981' : '#F59E0B',
                  fontWeight: '700',
                  letterSpacing: '0.01em'
                }}>
                  Pattern ROI: {pred.historicalROI >= 0 ? '+' : ''}{pred.historicalROI?.toFixed(1) || '0.0'}%
                </div>
              </div>
              
              {/* CLV Badge - Shows when available */}
              {game.clv && (
                <CLVIndicator clvData={game.clv} />
              )}
            </div>
            
            {/* Rationale - TERTIARY INFO */}
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(255,255,255,0.70)',
              lineHeight: 1.45,
              fontWeight: '600',
              paddingTop: isMobile ? '0.625rem' : '0.75rem',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              letterSpacing: '0.005em'
            }}>
              {(() => {
                const roi = pred.historicalROI || 0;
                
                // Custom premium descriptions based on unit size + ROI
                if (pred.unitSize >= 5.0) {
                  return roi > 20 
                    ? `Elite opportunity with strong historical performance`
                    : `Maximum allocation for highest conviction plays`;
                }
                if (pred.unitSize >= 4.0) {
                  return `Above-standard position backed by solid metrics`;
                }
                if (pred.unitSize >= 3.0) {
                  return roi > 15
                    ? `Strong pattern with proven profitability`
                    : `Standard allocation for balanced risk/reward`;
                }
                if (pred.unitSize >= 2.0) {
                  return roi > 0
                    ? `Moderate sizing for positive-expectation opportunity`
                    : `Measured approach to volatile pattern`;
                }
                if (pred.unitSize >= 1.0) {
                  return `Conservative sizing manages pattern volatility`;
                }
                return `Minimal allocation for tracking purposes`;
              })()}
            </div>
          </div>
        )}
      </div>
      
      {/* Live Score Display */}
      {liveScore && (
        <div style={{ padding: isMobile ? '0 0.875rem' : '0 1rem' }}>
          <BasketballLiveScore 
            liveScore={liveScore} 
            prediction={pred}
            awayTeam={game.awayTeam}
            homeTeam={game.homeTeam}
          />
        </div>
      )}

      {/* Compact Bet Card */}
      <div style={{ 
        background: GRADIENTS.hero,
        padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dynamic Pick Context */}
        {(() => {
          const isPositiveEV = pred.bestEV > 0;
          const context = getBasketballContext(game, pred, odds);
          
          return (
            <div style={{ 
              background: isPositiveEV
                ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                : 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: `1px solid ${isPositiveEV ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
              borderRadius: '8px',
              padding: isMobile ? '0.5rem 0.625rem' : '0.625rem 0.75rem',
              marginBottom: isMobile ? '0.5rem' : '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.5rem' : '0.625rem'
            }}>
              {/* Icon */}
              <div style={{ 
                fontSize: isMobile ? '1.375rem' : '1.5rem', 
                lineHeight: 1, 
                flexShrink: 0 
              }}>
                {context.icon}
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title */}
                <div style={{ 
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  fontWeight: '800',
                  color: isPositiveEV ? '#10B981' : '#EF4444',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.01em'
                }}>
                  {context.title}
                </div>
                
                {/* Subtitle */}
                <div style={{ 
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.4
                }}>
                  {context.subtitle}
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* Compact Stats Grid - Mobile Optimized */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '0.5rem' : '0.625rem',
          marginBottom: isMobile ? '0.5rem' : '0.75rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* OUR MODEL */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            borderRadius: '8px',
            padding: isMobile ? '0.5rem' : '0.625rem',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(16, 185, 129, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: '700',
              marginBottom: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <span>📊</span> OUR MODEL
            </div>
            <div style={{ 
              fontSize: isMobile ? '1.25rem' : '1.375rem',
              fontWeight: '900',
              color: '#10B981', 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem'
            }}>
              {((pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100).toFixed(1)}%
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.2
            }}>
              Win probability • <span style={{ color: '#10B981', fontWeight: '700' }}>{pred.bestEV > 0 ? '+' : ''}{pred.bestEV.toFixed(1)}% edge</span>
            </div>
          </div>

          {/* MARKET ODDS */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
            padding: isMobile ? '0.5rem' : '0.625rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
                <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
                  fontWeight: '700',
              marginBottom: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
                }}>
              <span>💵</span> MARKET
                </div>
                <div style={{ 
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: '900',
              color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.1,
              letterSpacing: '-0.01em',
              marginBottom: '0.25rem'
                }}>
              {pred.bestOdds > 0 ? `+${pred.bestOdds}` : pred.bestOdds}
                </div>
                  <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
                    color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.2
                  }}>
              {((pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb) * 100).toFixed(1)}% implied
                  </div>
        </div>
        
          {/* CONFIDENCE & UNIT SIZING */}
          <div style={{
            background: `linear-gradient(135deg, ${gradeColors.borderColor}15 0%, ${gradeColors.borderColor}08 100%)`,
            borderRadius: '8px',
            padding: isMobile ? '0.5rem' : '0.625rem',
            border: `1px solid ${gradeColors.borderColor}30`
          }}>
              <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: `${gradeColors.color}cc`,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              fontWeight: '700',
              marginBottom: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {(() => {
                const tierInfo = getDynamicTierInfo(pred);
                return <span>{tierInfo.emoji}</span>;
              })()} GRADE / BET SIZE
              </div>
              <div style={{ 
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <div style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                fontWeight: '900',
                color: gradeColors.color,
                lineHeight: 1.1,
                letterSpacing: '-0.01em'
              }}>
                {pred.grade}
              </div>
              <div style={{
                fontSize: isMobile ? '0.938rem' : '1rem',
                fontWeight: '900',
                color: (() => {
                  const tierInfo = getDynamicTierInfo(pred);
                  return tierInfo.color;
                })(),
                fontFeatureSettings: "'tnum'"
              }}>
                → {pred.unitSize > 0 ? `${pred.unitSize}u` : 'No Bet'}
              </div>
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.3
            }}>
              {pred.oddsRangeName || 'Unknown Odds'} • {pred.unitSize > 0 
                ? `Risk ${pred.unitSize} unit${pred.unitSize !== 1 ? 's' : ''}`
                : 'Below betting threshold'}
            </div>
              </div>
            </div>
            
        {/* Predicted Score - Compact Mobile */}
        {pred.ensembleTotal && (
            <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 100%)',
            borderRadius: '8px',
            padding: isMobile ? '0.5rem 0.625rem' : '0.75rem',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Label - Inline on Mobile */}
            <div style={{
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: isMobile ? '0.25rem' : '0.375rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}>
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>🔮</span>
              {isMobile ? 'Prediction' : 'Predicted Final Score'}
            </div>
            
            {/* Score Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: isMobile ? '0.5rem' : '0.75rem',
              alignItems: 'center'
            }}>
              {/* Away Team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.4)',
                fontWeight: '700',
                textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  marginBottom: isMobile ? '0.125rem' : '0.25rem'
              }}>
                  {isMobile && game.awayTeam.length > 8 ? game.awayTeam.substring(0, 7) + '...' : game.awayTeam.substring(0, 12)}
              </div>
              <div style={{ 
                  fontSize: isMobile ? '1.125rem' : '1.5rem',
                fontWeight: '900',
                color: 'white',
                lineHeight: 1,
                  letterSpacing: '-0.02em'
              }}>
                  {pred.ensembleAwayScore}
              </div>
            </div>
            
              {/* Separator */}
                <div style={{ 
                color: 'rgba(255,255,255,0.25)', 
                fontSize: isMobile ? '0.75rem' : '1rem',
                fontWeight: '700'
              }}>
                -
              </div>
              
              {/* Home Team */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.4)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  marginBottom: isMobile ? '0.125rem' : '0.25rem'
                  }}>
                  {isMobile && game.homeTeam.length > 8 ? game.homeTeam.substring(0, 7) + '...' : game.homeTeam.substring(0, 12)}
                  </div>
                  <div style={{ 
                  fontSize: isMobile ? '1.125rem' : '1.5rem',
                    fontWeight: '900',
                  color: 'white',
                    lineHeight: 1,
                  letterSpacing: '-0.02em'
                  }}>
                  {pred.ensembleHomeScore}
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Collapsible Details - Micro */}
      <div style={{
        padding: isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
        borderTop: ELEVATION.flat.border
      }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            width: '100%',
            background: game.barttorvik && !showDetails
              ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(99, 102, 241, 0.08) 100%)'
              : 'transparent',
            border: 'none',
            padding: isMobile ? '0.5rem 0' : '0.625rem 0',
            color: 'rgba(255,255,255,0.5)',
            fontSize: isMobile ? '0.688rem' : '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '0.5rem' : '0.625rem',
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            if (game.barttorvik && !showDetails) {
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(99, 102, 241, 0.15) 100%)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            if (game.barttorvik && !showDetails) {
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(99, 102, 241, 0.08) 100%)';
            }
          }}
        >
          <span style={{ fontSize: '0.625rem' }}>{showDetails ? '▼' : '▶'}</span>
          <span>Model Breakdown</span>
          
          {/* Premium Badge - Show when Advanced Stats available */}
          {game.barttorvik && !showDetails && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: isMobile ? '0.188rem 0.5rem' : '0.25rem 0.625rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '6px',
              fontSize: isMobile ? '0.563rem' : '0.625rem',
              fontWeight: '800',
              color: '#A5B4FC',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              <span style={{ fontSize: isMobile ? '0.625rem' : '0.688rem' }}>✨</span>
              <span>Advanced Stats</span>
            </span>
          )}
        </button>
        
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}</style>
        
        {showDetails && (
          <div style={{ 
            paddingTop: '1rem',
            display: 'grid',
            gap: '1rem'
          }}>
            {/* Market Odds Detail */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size,
                color: '#FF8C42',
                fontWeight: TYPOGRAPHY.label.weight,
                textTransform: TYPOGRAPHY.label.textTransform,
                marginBottom: '0.75rem'
              }}>
                💰 MARKET ODDS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    {game.awayTeam}
                  </div>
                  <div style={{ fontSize: TYPOGRAPHY.body.size, color: 'var(--color-text-primary)', fontWeight: TYPOGRAPHY.body.weight }}>
                    {odds.awayOdds > 0 ? '+' : ''}{odds.awayOdds}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    {game.homeTeam}
                  </div>
                  <div style={{ fontSize: TYPOGRAPHY.body.size, color: 'var(--color-text-primary)', fontWeight: TYPOGRAPHY.body.weight }}>
                    {odds.homeOdds > 0 ? '+' : ''}{odds.homeOdds}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced Statistical Analysis - Inside Model Breakdown */}
            {game.barttorvik && (
              <AdvancedMatchupCard
                barttorvik={game.barttorvik}
                awayTeam={game.awayTeam}
                homeTeam={game.homeTeam}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Basketball;

