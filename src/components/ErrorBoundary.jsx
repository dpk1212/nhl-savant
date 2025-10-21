import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-4">
              An unexpected error occurred. Please refresh the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-4 bg-gray-800 rounded text-left text-xs text-gray-300 overflow-auto max-h-40">
                <p className="font-bold mb-2">Error Details (Development Only):</p>
                <p className="text-red-400">{this.state.error.toString()}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-300 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

