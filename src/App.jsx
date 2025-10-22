import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loadNHLData, loadOddsFiles, loadStartingGoalies } from './utils/dataProcessing';
import { GoalieProcessor, loadGoalieData } from './utils/goalieProcessor';
import { extractGamesListFromOdds, parseBothFiles } from './utils/oddsTraderParser';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DataInspector from './components/DataInspector';
import TodaysGames from './components/TodaysGames';
import PerformanceDashboard from './components/PerformanceDashboard';
import Methodology from './components/Methodology';
import AdminGoalies from './components/AdminGoalies';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [dataProcessor, setDataProcessor] = useState(null);
  const [oddsData, setOddsData] = useState(null);
  const [goalieData, setGoalieData] = useState(null);
  const [startingGoalies, setStartingGoalies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // NEW: Load goalie data first
        console.log('🥅 Loading goalie data...');
        let goalieProcessor = null;
        let rawGoalieData = null;
        try {
          rawGoalieData = await loadGoalieData();
          goalieProcessor = new GoalieProcessor(rawGoalieData);
          setGoalieData(rawGoalieData); // Store for admin component
          console.log('✅ Goalie processor initialized with', rawGoalieData.length, 'goalie entries');
        } catch (goalieErr) {
          console.warn('⚠️ Failed to load goalie data, predictions will not include goalie adjustments:', goalieErr);
          // Continue without goalie data - model will work but without goalie adjustments
        }
        
        // Load team data with goalie processor
        console.log('🏒 Loading team data...');
        const processor = await loadNHLData(goalieProcessor);
        setDataProcessor(processor);
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
              <Route path="/" element={<TodaysGames dataProcessor={dataProcessor} oddsData={oddsData} startingGoalies={startingGoalies} />} />
              <Route path="/dashboard" element={<Dashboard dataProcessor={dataProcessor} loading={loading} error={error} />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/inspector" element={<DataInspector dataProcessor={dataProcessor} />} />
              <Route path="/admin/goalies" element={<AdminGoalies games={oddsData?.todaysGames || []} goalieData={goalieData} />} />
              <Route path="/performance" element={<PerformanceDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;