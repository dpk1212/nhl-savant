const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-nhl-gold mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading NHL Data</h2>
        <p className="text-gray-400">Processing advanced statistics...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
