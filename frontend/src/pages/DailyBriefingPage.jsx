import React, { useMemo, useState } from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useSavedArticles } from '../context/SavedArticlesContext.jsx';
import { useDevice } from '../context/DeviceContext.jsx';

function ArticleCard({ article, onToggleSave, isSaved, featured = false }) {
  // RSS uses .link, API uses .url – support both
  const sourceUrl = article.url || article.link || '';
  const hasValidSource = sourceUrl && (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://'));
  const { isMobile } = useDevice();

  const getValidationBadge = () => {
    if (article.isGenerated) return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">AI Generated</span>;
    if (article.linkValid === false) return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">Link Issue</span>;
    if (article.linkValid === true) return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">Verified</span>;
    return null;
  };

  const getAPISourceBadge = () => {
    if (article.apiSource && article.apiSource !== 'Fallback') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
          {article.apiSource.split('.')[0]}
        </span>
      );
    }
    return null;
  };

  return (
    <article className={`group flex flex-col premium-card overflow-hidden h-full ${featured && !isMobile ? 'md:flex-row' : ''}`}>
      {article.imageUrl && (
        <div className={`relative overflow-hidden ${featured && !isMobile ? 'md:w-5/12' : 'w-full h-48'} bg-slate-100`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      <div className={`flex-1 flex flex-col ${featured && !isMobile ? 'p-6 md:p-8' : 'p-5'}`}>
        {/* Meta Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            {hasValidSource ? (
              <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-rose-500 uppercase tracking-wider hover:text-rose-600 truncate">
                {article.sourceName || article.source || 'News Source'}
              </a>
            ) : (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {article.sourceName || article.source || 'Source'}
              </span>
            )}
            <span className="text-slate-300 text-[10px]">•</span>
            <span className="text-xs text-slate-400 font-medium">{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex gap-1.5">{getValidationBadge()}{getAPISourceBadge()}</div>
        </div>

        {/* Content */}
        <h3 className={`font-display font-bold text-slate-900 leading-tight mb-2 group-hover:text-rose-600 transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
          <a href={sourceUrl} target="_blank" rel="noreferrer">{article.title}</a>
        </h3>

        {article.summary && (
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {article.summary}
          </p>
        )}

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              ⏱ {article.readMinutes}m
            </span>
            {article.credibilityScore && (
              <span className={`text-xs font-bold ${article.credibilityScore >= 7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                Score: {Math.round(article.credibilityScore)}/10
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(article)}
              className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-amber-50 text-amber-500' : 'text-slate-400 hover:bg-slate-50 hover:text-rose-500'
                }`}
              title={isSaved ? 'Unsave' : 'Save for later'}
            >
              <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </button>

            {hasValidSource && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs py-1.5 px-3"
              >
                Read Article
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DailyBriefingPage({ selectedDomain: selectedDomainProp, setSelectedDomain: setSelectedDomainProp }) {
  const { articles, loading, error, newsStats, isLiveMode, useRSS, toggleLiveMode, toggleRSSMode } = useNews();
  const { isSaved, toggleSave } = useSavedArticles();

  const [localDomain, setLocalDomain] = useState('all');
  const selectedDomain = setSelectedDomainProp != null ? selectedDomainProp : localDomain;
  const setSelectedDomain = setSelectedDomainProp != null ? setSelectedDomainProp : setLocalDomain;

  const availableDomains = useMemo(() => {
    const set = new Set();
    articles.forEach((a) => {
      (a.domains || []).forEach((d) => {
        if (d !== 'general') set.add(d);
      });
    });
    return Array.from(set).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedDomain === 'all') return articles;
    return articles.filter((a) => (a.domains || []).includes(selectedDomain));
  }, [articles, selectedDomain]);

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Group articles by category
  const categorizedArticles = useMemo(() => {
    const categories = {
      'Technology & Innovation': { icon: '💻', articles: [] },
      'Finance & Markets': { icon: '📊', articles: [] },
      'Career & Employment': { icon: '💼', articles: [] },
      'Sustainability': { icon: '🌱', articles: [] },
      'Business & Entrepreneurship': { icon: '🚀', articles: [] }
    };

    const domains = (article) => article.domains || [];
    const sourceName = (article) => article.sourceName || '';
    filteredArticles.forEach(article => {
      const d = domains(article);
      const sn = sourceName(article);
      if (d.includes('technology')) {
        if (!d.includes('finance') && !d.includes('economics')) {
          categories['Technology & Innovation'].articles.push(article);
        } else {
          categories['Finance & Markets'].articles.push(article);
        }
      } else if (d.includes('share market') || d.includes('finance') || d.includes('economics')) {
        categories['Finance & Markets'].articles.push(article);
      } else if (sn.includes('LinkedIn') || sn.includes('McKinsey')) {
        categories['Career & Employment'].articles.push(article);
      } else if (d.includes('GreenBiz') || sn.includes('Green') || sn.includes('Harvard')) {
        categories['Sustainability'].articles.push(article);
      } else {
        categories['Business & Entrepreneurship'].articles.push(article);
      }
    });

    // Remove empty categories and limit to first 4 articles per category
    return Object.entries(categories)
      .filter(([_, data]) => data.articles.length > 0)
      .map(([name, data]) => ({
        name,
        icon: data.icon,
        articles: data.articles.slice(0, 4)
      }));
  }, [filteredArticles]);

  const { isMobile } = useDevice();

  return (
    <div className={`pb-10 ${isMobile ? 'space-y-4 pb-20' : 'space-y-6'}`}>
      {/* Header – one row, clear hierarchy */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#000000] dark:text-white tracking-tight">
              Daily Briefing
            </h1>
            <p className="text-sm text-muted mt-0.5">
              Curated professional news by category
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleRSSMode}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${useRSS
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              title={useRSS ? 'Using RSS Feeds' : 'Using API Feeds'}
            >
              {useRSS ? 'RSS' : 'API'}
            </button>
            <button
              onClick={toggleLiveMode}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isLiveMode ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {isLiveMode ? 'Live' : 'Demo'}
            </button>
          </div>
        </div>

        {/* Stats – compact, single row */}
        {newsStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/80 dark:bg-gray-900/30 border border-[#ffd6d2] rounded-xl px-4 py-3">
            <div className="text-center">
              <div className="text-xl font-semibold text-[#1a1a1a] dark:text-white">{newsStats.total}</div>
              <div className="text-xs text-muted">Articles</div>
            </div>
            <div className="text-center">
              <span className="text-lg">✅</span>
              <div className="text-xs text-muted">{newsStats.verified} Verified</div>
            </div>
            {newsStats.avgCredibility > 0 && (
              <div className="text-center">
                <div className="text-xl font-semibold text-amber-600">{Math.round(newsStats.avgCredibility)}</div>
                <div className="text-xs text-muted">Avg score</div>
              </div>
            )}
            <div className="text-center">
              <span className="text-lg">📡</span>
              <div className="text-xs text-muted">Multi-Source</div>
            </div>
          </div>
        )}
      </header>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading professional news...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No articles found {selectedDomain !== 'all' && `in ${selectedDomain}`}
          </p>
          {selectedDomain !== 'all' && (
            <button
              onClick={() => setSelectedDomain('all')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View all articles
            </button>
          )}
        </div>
      )}

      {/* Articles Organized by Category */}
      <div className={isMobile ? 'space-y-6' : 'space-y-12'}>
        {/* Technology & Innovation */}
        {filteredArticles.filter(a => a.domains?.includes('technology') && !a.domains?.includes('finance')).length > 0 && (
          <section className="space-y-4">
            <div className={`flex items-center gap-2 pb-3 border-b-2 border-blue-200 dark:border-blue-800 ${isMobile ? 'flex-wrap' : 'gap-3'}`}>
              <span className={isMobile ? 'text-2xl' : 'text-4xl'}>💻</span>
              <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>Technology & Innovation</h2>
              <span className="ml-auto px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {filteredArticles.filter(a => a.domains?.includes('technology') && !a.domains?.includes('finance')).length}
              </span>
            </div>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
              {filteredArticles.filter(a => a.domains?.includes('technology') && !a.domains?.includes('finance')).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleSave={toggleSave}
                  isSaved={isSaved(article.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Finance & Markets */}
        {filteredArticles.filter(a => a.domains?.includes('finance') || a.domains?.includes('economics') || a.domains?.includes('share market')).length > 0 && (
          <section className="space-y-4">
            <div className={`flex items-center gap-2 pb-3 border-b-2 border-green-200 dark:border-green-800 ${isMobile ? 'flex-wrap' : 'gap-3'}`}>
              <span className={isMobile ? 'text-2xl' : 'text-4xl'}>📊</span>
              <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>Finance & Markets</h2>
              <span className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                {filteredArticles.filter(a => a.domains?.includes('finance') || a.domains?.includes('economics') || a.domains?.includes('share market')).length}
              </span>
            </div>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
              {filteredArticles.filter(a => a.domains?.includes('finance') || a.domains?.includes('economics') || a.domains?.includes('share market')).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleSave={toggleSave}
                  isSaved={isSaved(article.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Career & Employment */}
        {filteredArticles.filter(a => a.sourceName?.includes('McKinsey') || a.sourceName?.includes('LinkedIn') || a.title?.toLowerCase().includes('career')).length > 0 && (
          <section className="space-y-4">
            <div className={`flex items-center gap-2 pb-3 border-b-2 border-purple-200 dark:border-purple-800 ${isMobile ? 'flex-wrap' : 'gap-3'}`}>
              <span className={isMobile ? 'text-2xl' : 'text-4xl'}>💼</span>
              <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>Career & Employment</h2>
              <span className="ml-auto px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                {filteredArticles.filter(a => a.sourceName?.includes('McKinsey') || a.sourceName?.includes('LinkedIn') || a.title?.toLowerCase().includes('career')).length}
              </span>
            </div>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
              {filteredArticles.filter(a => a.sourceName?.includes('McKinsey') || a.sourceName?.includes('LinkedIn') || a.title?.toLowerCase().includes('career')).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleSave={toggleSave}
                  isSaved={isSaved(article.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Sustainability */}
        {filteredArticles.filter(a => a.domains?.includes('sustainability') || a.sourceName?.includes('Green') || a.title?.toLowerCase().includes('green') || a.title?.toLowerCase().includes('carbon')).length > 0 && (
          <section className="space-y-4">
            <div className={`flex items-center gap-2 pb-3 border-b-2 border-emerald-200 dark:border-emerald-800 ${isMobile ? 'flex-wrap' : 'gap-3'}`}>
              <span className={isMobile ? 'text-2xl' : 'text-4xl'}>🌱</span>
              <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>Sustainability & Environment</h2>
              <span className="ml-auto px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium">
                {filteredArticles.filter(a => a.domains?.includes('sustainability') || a.sourceName?.includes('Green') || a.title?.toLowerCase().includes('green') || a.title?.toLowerCase().includes('carbon')).length}
              </span>
            </div>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
              {filteredArticles.filter(a => a.domains?.includes('sustainability') || a.sourceName?.includes('Green') || a.title?.toLowerCase().includes('green') || a.title?.toLowerCase().includes('carbon')).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleSave={toggleSave}
                  isSaved={isSaved(article.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Business & Entrepreneurship */}
        {filteredArticles.length > 0 && (
          <section className="space-y-4">
            <div className={`flex items-center gap-2 pb-3 border-b-2 border-orange-200 dark:border-orange-800 ${isMobile ? 'flex-wrap' : 'gap-3'}`}>
              <span className={isMobile ? 'text-2xl' : 'text-4xl'}>🚀</span>
              <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>Business & Entrepreneurship</h2>
              <span className="ml-auto px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                {filteredArticles.length}
              </span>
            </div>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleSave={toggleSave}
                  isSaved={isSaved(article.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

