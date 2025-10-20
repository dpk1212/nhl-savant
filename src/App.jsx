import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loadNHLData } from './utils/dataProcessing';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TeamAnalytics from './components/TeamAnalytics';
import BettingOpportunities from './components/BettingOpportunities';
import Methodology from './components/Methodology';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [dataProcessor, setDataProcessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const processor = await loadNHLData();
        setDataProcessor(processor);
        setError(null);
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!dataProcessor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300">No Data Available</h1>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard dataProcessor={dataProcessor} />} />
            <Route path="/teams" element={<TeamAnalytics dataProcessor={dataProcessor} />} />
            <Route path="/opportunities" element={<BettingOpportunities dataProcessor={dataProcessor} />} />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;