import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Papa from 'papaparse';
import { trackPageView, trackEngagement, trackFirstVisit, getPageName } from './utils/analytics';
import { loadNHLData, loadOddsFiles, loadStartingGoalies, loadGoaliesCSV } from './utils/dataProcessing';
import { GoalieProcessor } from './utils/goalieProcessor';
import { ScheduleHelper } from './utils/scheduleHelper';
import { extractGamesListFromOdds, parseBothFiles } from './utils/oddsTraderParser';
import { AdvancedStatsAnalyzer } from './utils/advancedStatsAnalyzer';
import { EdgeFactorCalculator } from './utils/edgeFactorCalculator';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DataInspector from './components/DataInspector';
import TodaysGames from './components/TodaysGames';
import PerformanceDashboard from './components/PerformanceDashboard';
import Methodology from './components/Methodology';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import LegalFooter from './components/LegalFooter';
import Disclaimer from './pages/Disclaimer';
import MatchupInsights from './pages/MatchupInsights';
import SplashScreenFallback from './components/SplashScreenFallback';
import { useSplashScreen } from './hooks/useSplashScreen';
import OnboardingModal from './components/onboarding/OnboardingModal';
import { hasCompletedOnboarding } from './components/onboarding/onboardingUtils';

// Lazy load 3D splash screen to reduce initial bundle size
const SplashScreen = lazy(() => import('./components/SplashScreen'));

function App() {
  // ALL HOOKS FIRST - Called on every render
  const { showSplash, hasWebGL, dismissSplash } = useSplashScreen();
  const [dataProcessor, setDataProcessor] = useState(null);
  const [oddsData, setOddsData] = useState(null);
  const [goalieData, setGoalieData] = useState(null);
  const [startingGoalies, setStartingGoalies] = useState(null);
  const [statsAnalyzer, setStatsAnalyzer] = useState(null);
  const [edgeFactorCalc, setEdgeFactorCalc] = useState(null);
  const [scheduleHelper, setScheduleHelper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // useEffect hook - MUST be before any returns
  useEffect(() => {
    const loadData = async () => {
      // Only load data if NOT showing splash
      if (showSplash) {
        return;
      }
      
      try {
        setLoading(true);
        
        // Load schedule data for B2B/rest adjustments
        console.log('📅 Loading schedule data for B2B adjustments...');
        let loadedScheduleHelper = null;
        try {
          // Use import.meta.env.BASE_URL to respect Vite's base path
          const schedulePath = `${import.meta.env.BASE_URL}nhl-202526-asplayed.csv`;
          console.log(`📂 Fetching schedule from: ${schedulePath}`);
          const scheduleResponse = await fetch(schedulePath);
          if (!scheduleResponse.ok) {
            throw new Error(`Failed to fetch schedule: ${scheduleResponse.status} ${scheduleResponse.statusText}`);
          }
          const scheduleText = await scheduleResponse.text();
          
          // Wrap Papa.parse in a Promise to properly await it
          loadedScheduleHelper = await new Promise((resolve, reject) => {
            Papa.parse(scheduleText, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                if (results.data && results.data.length > 0) {
                  const helper = new ScheduleHelper(results.data);
                  console.log(`✅ Loaded ${Object.keys(helper.gamesByTeam).length} teams into schedule helper`);
                  setScheduleHelper(helper);
                  resolve(helper);
                } else {
                  reject(new Error('No schedule data parsed'));
                }
              },
              error: (err) => {
                reject(err);
              }
            });
          });
        } catch (scheduleErr) {
          console.warn('⚠️ Could not load schedule data:', scheduleErr.message);
          console.warn('   B2B adjustments will be disabled');
        }
        
        // Load team data (no longer needs goalie processor in constructor)
        console.log('🏒 Loading team data...');
        const processor = await loadNHLData(loadedScheduleHelper);
        setDataProcessor(processor);
        
        // Load goalies.csv for advanced goalie statistics
        console.log('🥅 Loading goalie stats from CSV...');
        const goaliesCSV = await loadGoaliesCSV();
        setGoalieData(goaliesCSV);
        
        // Initialize advanced stats analyzer
        console.log('📊 Initializing advanced stats analyzer...');
        const analyzer = new AdvancedStatsAnalyzer(processor);
        setStatsAnalyzer(analyzer);
        
        // Initialize edge factor calculator
        console.log('🎯 Initializing edge factor calculator...');
        const factorCalc = new EdgeFactorCalculator(analyzer);
        setEdgeFactorCalc(factorCalc);
        
        setError(null);
        
        // Load both odds files (Money + Total)
        console.log('💰 Loading odds data...');
        const oddsFiles = await loadOddsFiles();
        
        // Parse and merge odds files to get games
        if (oddsFiles && oddsFiles.moneyText && oddsFiles.totalText) {
          const mergedGames = parseBothFiles(oddsFiles.moneyText, oddsFiles.totalText);
          oddsFiles.todaysGames = extractGamesListFromOdds(mergedGames);
          console.log(`📋 Extracted ${oddsFiles.todaysGames.length} games for admin`);
        }
        
        // FIX: Load starting goalies selections
        console.log('🥅 Loading starting goalie selections...');
        const goalieSelections = await loadStartingGoalies();
        setStartingGoalies(goalieSelections);
        
        setOddsData(oddsFiles);
        
        console.log('✅ All data loaded successfully');
        
        // Check if user should see onboarding (after data loads, with delay)
        setTimeout(() => {
          if (!hasCompletedOnboarding()) {
            console.log('👋 First-time visitor - showing onboarding');
            setShowOnboarding(true);
          }
        }, 2000); // 2 second delay after data loads
        
      } catch (err) {
        console.error('Failed to load NHL data:', err);
        setError('Failed to load NHL data. Please check if teams.csv is available.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showSplash]); // Add showSplash as dependency to re-trigger when splash dismisses
  
  // CONDITIONAL RENDERING - After all hooks
  if (showSplash) {
    return hasWebGL ? (
      <Suspense fallback={<SplashScreenFallback onComplete={dismissSplash} />}>
        <SplashScreen onComplete={dismissSplash} />
      </Suspense>
    ) : (
      <SplashScreenFallback onComplete={dismissSplash} />
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-300 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dataProcessor) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300">No Data Available</h1>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <AppContent 
          dataProcessor={dataProcessor}
          oddsData={oddsData}
          startingGoalies={startingGoalies}
          goalieData={goalieData}
          statsAnalyzer={statsAnalyzer}
          edgeFactorCalc={edgeFactorCalc}
          loading={loading}
          error={error}
          showOnboarding={showOnboarding}
          setShowOnboarding={setShowOnboarding}
        />
      </Router>
    </ErrorBoundary>
  );
}

// Separate component to use useLocation hook
function AppContent({ dataProcessor, oddsData, startingGoalies, goalieData, statsAnalyzer, edgeFactorCalc, loading, error, showOnboarding, setShowOnboarding }) {
  const location = useLocation();
  const pageStartTime = useRef(Date.now());

  // Track first visit
  useEffect(() => {
    trackFirstVisit();
  }, []);

  // Track page views and engagement on route change
  useEffect(() => {
    const pageName = getPageName(location.pathname);
    trackPageView(pageName);
    pageStartTime.current = Date.now();

    // Track time on page when leaving
    return () => {
      const timeSpent = Math.floor((Date.now() - pageStartTime.current) / 1000);
      if (timeSpent > 3) { // Only track if spent more than 3 seconds
        trackEngagement(pageName, timeSpent);
      }
    };
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Navigation />
      <main>
        <Routes>
              {/* Today's Games is the primary landing page */}
              <Route path="/" element={<TodaysGames 
                dataProcessor={dataProcessor} 
                oddsData={oddsData} 
                startingGoalies={startingGoalies}
                goalieData={goalieData}
                statsAnalyzer={statsAnalyzer}
                edgeFactorCalc={edgeFactorCalc}
              />} />
              <Route path="/dashboard" element={<Dashboard dataProcessor={dataProcessor} loading={loading} error={error} />} />
              <Route path="/matchup-insights" element={<MatchupInsights 
                dataProcessor={dataProcessor} 
                goalieData={goalieData}
                todaysGames={oddsData?.todaysGames || []}
              />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/inspector" element={<DataInspector dataProcessor={dataProcessor} />} />
              <Route path="/performance" element={<PerformanceDashboard />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </main>
        
        {/* Legal footer on every page */}
        <LegalFooter />
        
        {/* Premium Onboarding Modal for first-time visitors */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={() => {
            console.log('✅ Onboarding completed!');
            setShowOnboarding(false);
          }}
        />
      </div>
    );
  }

export default App;