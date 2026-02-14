import React, { useState, useEffect } from 'react';
import { 
  getRSSStats, 
  triggerRSSFetch, 
  cleanupOldArticles, 
  enhanceArticlesWithAI 
} from '../services/rssNewsService.js';

export default function RSSAdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getRSSStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    try {
      setActionLoading(true);
      setMessage(null);
      const result = await triggerRSSFetch();
      setMessage({
        type: 'success',
        text: `✅ Fetched ${result.result.totalFetched} articles, saved ${result.result.totalSaved}`
      });
      await loadStats();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to fetch: ${error.message}`
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setActionLoading(true);
      setMessage(null);
      const result = await cleanupOldArticles(7);
      setMessage({
        type: 'success',
        text: `🧹 Cleaned up ${result.deleted} old articles`
      });
      await loadStats();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to cleanup: ${error.message}`
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnhance = async () => {
    try {
      setActionLoading(true);
      setMessage(null);
      const result = await enhanceArticlesWithAI(20);
      setMessage({
        type: 'success',
        text: `🤖 Enhanced ${result.enhanced} articles with AI`
      });
      await loadStats();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to enhance: ${error.message}`
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading RSS statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          📡 RSS Feed Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage your RSS news feeds
        </p>
      </header>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Articles
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.sources}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              RSS Sources
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.categories}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Categories
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.avgCredibility ? Math.round(stats.avgCredibility) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Avg Credibility
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleFetch}
            disabled={actionLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {actionLoading ? '⏳ Processing...' : '🔄 Fetch RSS Feeds'}
          </button>

          <button
            onClick={handleEnhance}
            disabled={actionLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {actionLoading ? '⏳ Processing...' : '🤖 Enhance with AI'}
          </button>

          <button
            onClick={handleCleanup}
            disabled={actionLoading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {actionLoading ? '⏳ Processing...' : '🧹 Cleanup Old Articles'}
          </button>
        </div>
      </div>

      {/* Category Distribution */}
      {stats?.categoryDistribution && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Category Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.categoryDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">
                    {category}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Source Distribution */}
      {stats?.sourceDistribution && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Top Sources
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.sourceDistribution)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {source}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={loadStats}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          🔄 Refresh Statistics
        </button>
      </div>
    </div>
  );
}
