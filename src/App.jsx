import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
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

function App() {
  const [dataProcessor, setDataProcessor] = useState(null);
  const [oddsData, setOddsData] = useState(null);
  const [goalieData, setGoalieData] = useState(null);
  const [startingGoalies, setStartingGoalies] = useState(null);
  const [statsAnalyzer, setStatsAnalyzer] = useState(null);
  const [edgeFactorCalc, setEdgeFactorCalc] = useState(null);
  const [scheduleHelper, setScheduleHelper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load schedule data for B2B/rest adjustments
        console.log('📅 Loading schedule data for B2B adjustments...');
        let loadedScheduleHelper = null;
        try {
          const scheduleText = await fetch('/nhl-202526-asplayed.csv').then(r => r.text());
          Papa.parse(scheduleText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              if (results.data && results.data.length > 0) {
                loadedScheduleHelper = new ScheduleHelper(results.data);
                console.log(`✅ Loaded ${Object.keys(loadedScheduleHelper.gamesByTeam).length} teams into schedule helper`);
                setScheduleHelper(loadedScheduleHelper);
              }
            },
            error: (err) => {
              console.warn('⚠️ Schedule file not found, B2B adjustments disabled:', err.message);
            }
          });
        } catch (scheduleErr) {
          console.warn('⚠️ Could not load schedule data:', scheduleErr.message);
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
      } catch (err) {
        console.error('Failed to load NHL data:', err);
        setError('Failed to load NHL data. Please check if teams.csv is available.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/inspector" element={<DataInspector dataProcessor={dataProcessor} />} />
              <Route path="/performance" element={<PerformanceDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;