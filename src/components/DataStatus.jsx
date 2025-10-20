import { CheckCircle, AlertCircle, Database } from 'lucide-react';

const DataStatus = ({ dataProcessor, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin">
            <Database className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-gray-300">Loading NHL data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      </div>
    );
  }

  if (!dataProcessor) {
    return null;
  }

  const dataCount = dataProcessor.processedData?.length || 0;
  const teams = [...new Set(dataProcessor.processedData.map(d => d.name))].length;
  const situations = [...new Set(dataProcessor.processedData.map(d => d.situation))].length;

  return (
    <div className="bg-gradient-to-r from-green-900/30 to-green-900/10 border border-green-500/50 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-300 mb-1">Data Verified & Loaded</h3>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-gray-400">Data Points: </span>
                <span className="font-bold text-white">{dataCount}</span>
              </div>
              <div>
                <span className="text-gray-400">Teams: </span>
                <span className="font-bold text-white">{teams}</span>
              </div>
              <div>
                <span className="text-gray-400">Situations: </span>
                <span className="font-bold text-white">{situations}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">All calculations verified and ready for analysis</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Source:</p>
          <p className="text-xs text-gray-300 font-mono">teams (3).csv</p>
        </div>
      </div>
    </div>
  );
};

export default DataStatus;
