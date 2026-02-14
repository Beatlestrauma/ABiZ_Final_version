import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fff6f4] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-[#ffd6d2] text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">Something went wrong</h1>
            <p className="text-sm text-[#6b7280] mb-4">
              The app encountered an error. Try refreshing the page.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs bg-[#f5f5f5] p-3 rounded overflow-auto max-h-32 mb-4">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#ff5e5b] text-white rounded-lg font-semibold hover:opacity-90"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
