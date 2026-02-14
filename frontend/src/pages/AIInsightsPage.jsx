import React, { useState, useEffect, useCallback } from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useDevice } from '../context/DeviceContext.jsx';
import axios from 'axios';

export default function AIInsightsPage() {
  const { articles, loading: newsLoading } = useNews();
  const { isMobile } = useDevice();
  const [data, setData] = useState(null);         // full response from /api/ai/insights
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setAnalysisLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/ai/insights');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
      setError(err.response?.data?.error || 'Failed to generate insights. Please try again.');
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const insights = data?.insights;

  // Helpers
  const sentimentColor = (s) => {
    if (!s) return 'bg-gray-100 text-gray-700';
    const lc = s.toLowerCase();
    if (lc === 'bullish' || lc === 'positive') return 'bg-green-100 text-green-700';
    if (lc === 'bearish' || lc === 'negative') return 'bg-red-100 text-red-700';
    if (lc === 'mixed') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const impactColor = (impact) => {
    if (impact === 'High') return 'bg-red-100 text-red-700';
    if (impact === 'Medium') return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  const severityIcon = (sev) => sev === 'High' ? '🔴' : sev === 'Medium' ? '🟡' : '🟢';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Insights</h1>
            <p className="text-slate-500 font-medium">
              {data?.source === 'ai' ? 'Deep AI Analysis' : 'Data-Driven Analysis'} • {data?.articleCount || 0} articles processed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {data && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${data.source === 'ai' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              {data.source === 'ai' ? `Generative AI` : 'Statistical Model'}
            </span>
          )}
          <button
            onClick={fetchInsights}
            disabled={analysisLoading}
            className="btn-primary flex items-center gap-2"
          >
            {analysisLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>↺</span>
                <span>Refresh Analysis</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Loading State */}
      {analysisLoading && (
        <div className="premium-panel p-12 text-center rounded-2xl">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Analyzing Business Intelligence</h3>
          <p className="text-slate-500 max-w-md mx-auto">Our AI is processing today's news headlines to extract key trends, sentiment, and opportunities.</p>
        </div>
      )}

      {/* Error State */}
      {error && !analysisLoading && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-start gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-red-800 font-bold">Analysis Failed</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button onClick={fetchInsights} className="mt-3 text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-900 bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Insights */}
      {insights && !analysisLoading && (
        <div className="space-y-8">
          {/* Executive Summary */}
          {insights.executiveSummary && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-violet-900 text-white p-8 shadow-2xl shadow-indigo-900/20">
              <div className="absolute top-0 right-0 p-32 bg-white opacity-5 blur-3xl rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h2 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">Executive Summary</h2>
                <p className="text-lg md:text-xl leading-relaxed font-medium text-custom-white/95">
                  {insights.executiveSummary}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* ── Market Sentiment ───────────────────── */}
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                📈 Market Sentiment
              </h2>
              <div className="bg-slate-50 rounded-xl p-5 mb-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${insights.marketSentiment?.overall?.toLowerCase().includes('bull') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {insights.marketSentiment?.overall || 'Neutral'}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{insights.marketSentiment?.confidence || 0}%</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confidence</div>
                  </div>
                </div>
                {insights.marketSentiment?.reasoning && (
                  <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3 mt-2">
                    {insights.marketSentiment.reasoning}
                  </p>
                )}
              </div>
            </div>

            {/* ── Key Trends ───────────────────── */}
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                🔥 Key Trends
              </h2>
              {insights.keyTrends && insights.keyTrends.length > 0 ? (
                <ul className="space-y-3">
                  {insights.keyTrends.map((item, idx) => {
                    const trend = typeof item === 'string' ? item : item.trend;
                    const impact = typeof item === 'object' ? item.impact : null;
                    return (
                      <li key={idx} className="flex items-start gap-3 group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xs font-bold mt-0.5 group-hover:bg-rose-500 group-hover:text-white transition-colors">{idx + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{trend}</p>
                          {impact && (
                            <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${impact === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                              {impact} Impact
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">No trend data available</p>
              )}
            </div>

            {/* ── Sector Analysis ───────────────────── */}
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">🏢 Sector Performance</h2>
              <div className="space-y-4">
                {insights.sectorAnalysis && Object.entries(insights.sectorAnalysis).map(([sector, info], idx) => (
                  <div key={sector}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-bold text-slate-700 capitalize">{sector}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${info.sentiment === 'Positive' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {info.sentiment}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${info.sentiment === 'Positive' ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        style={{ width: `${Math.min(100, (info.articleCount / (data.articleCount || 1)) * 300)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Risk Factors ───────────────────── */}
            <div className="premium-card p-6 border-l-4 border-l-rose-500">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                ⚠️ Risk Radar
              </h2>
              {insights.riskFactors && insights.riskFactors.length > 0 ? (
                <div className="space-y-3">
                  {insights.riskFactors.map((item, idx) => {
                    const risk = typeof item === 'string' ? item : item.risk;
                    return (
                      <div key={idx} className="bg-red-50/50 p-3 rounded-lg border border-red-50">
                        <p className="text-sm text-red-900 font-medium">{risk}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No significant risks flagged.</p>
              )}
            </div>
          </div>

          {/* ── Articles Grid (Freshness & Sources) ───────────────────── */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="premium-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Content Freshness</h3>
              <div className="flex gap-2 h-32 items-end">
                {Object.entries(insights.freshness || {}).map(([key, val]) => {
                  const height = Math.max(10, Math.min(100, (val / (data.articleCount || 1)) * 100));
                  return (
                    <div key={key} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-indigo-100 rounded-t-md relative group-hover:bg-indigo-200 transition-colors" style={{ height: `${height}%` }}>
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="premium-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Top Sources</h3>
              <div className="flex flex-wrap gap-2">
                {insights.topSources && insights.topSources.map((src, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors cursor-default">
                    {src.name} <span className="text-slate-400 ml-1">{src.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="text-center pt-8 pb-4">
            <p className="text-xs text-slate-400">
              Market analysis generated by {data?.source === 'ai' ? 'Gemini Pro AI' : 'BizAI Statistical Engine'}. Not financial advice.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!insights && !analysisLoading && !error && (
        <div className="premium-panel p-16 text-center rounded-2xl">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            📊
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to Analyze</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Click the button below to generate deep insights from your current news feed.
          </p>
          <button onClick={fetchInsights} className="btn-primary">
            Start Analysis
          </button>
        </div>
      )}
    </div>
  );
}