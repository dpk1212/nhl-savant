import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loadNHLData, loadOddsFile } from './utils/dataProcessing';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TeamAnalytics from './components/TeamAnalytics';
import BettingOpportunities from './components/BettingOpportunities';
import DataInspector from './components/DataInspector';
import TodaysGames from './components/TodaysGames';
import Methodology from './components/Methodology';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [dataProcessor, setDataProcessor] = useState(null);
  const [oddsData, setOddsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const processor = await loadNHLData();
        setDataProcessor(processor);
        setError(null);
        
        // Load odds data (optional - doesn't fail if not available)
        const odds = await loadOddsFile();
        setOddsData(odds);
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
              <Route path="/" element={<Dashboard dataProcessor={dataProcessor} loading={loading} error={error} />} />
              <Route path="/teams" element={<TeamAnalytics dataProcessor={dataProcessor} />} />
              <Route path="/opportunities" element={<BettingOpportunities dataProcessor={dataProcessor} oddsData={oddsData} />} />
              <Route path="/games" element={<TodaysGames dataProcessor={dataProcessor} oddsData={oddsData} />} />
              <Route path="/inspector" element={<DataInspector dataProcessor={dataProcessor} />} />
              <Route path="/methodology" element={<Methodology />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;