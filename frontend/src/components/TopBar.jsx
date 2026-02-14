import React, { useRef } from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDevice } from '../context/DeviceContext.jsx';

const DAILY_BRIEFING_SECTIONS = [
  { value: 'all', label: 'All' },
  { value: 'economics', label: 'Economics' },
  { value: 'finance', label: 'Finance' },
  { value: 'geopolitics', label: 'Geopolitics' },
  { value: 'management', label: 'Management' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'share market', label: 'Share Market' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'trade', label: 'Trade' }
];

export default function TopBar({ currentPage, selectedDomain, setSelectedDomain }) {
  const { eco, articles, lastUpdated, isLiveMode, refreshNews, loading } = useNews();
  const { user, isAuthenticated } = useAuth();
  const { isMobile, isTablet } = useDevice();
  const sectionScrollRef = useRef(null);

  const scrollSection = (dir) => {
    if (!sectionScrollRef.current) return;
    const el = sectionScrollRef.current;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const formatLastUpdated = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const isDailyBriefing = currentPage === 'home';

  return (
    <header className="sticky top-0 z-10 bg-[#fff6f4] border-b border-[#ffd6d2]">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 lg:py-3">
        <div className="flex items-center gap-2">
          <div className="lg:hidden font-semibold text-base text-[#1a1a1a]">ABiZ</div>
          <div className="hidden lg:block font-semibold text-base text-[#1a1a1a]">
            {isAuthenticated && user ? user.displayName : 'Guest'}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted">
          {articles.length > 0 && (
            <span>{Array.from(new Set(articles.map(a => a.sourceName))).length} sources</span>
          )}
          {lastUpdated && <span>{formatLastUpdated(lastUpdated)}</span>}
          {isLiveMode && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshNews}
            disabled={loading}
            className="p-1.5 rounded-md hover:bg-[#ffd6d2] transition-colors disabled:opacity-50 text-[#1a1a1a]"
            title="Refresh"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {eco && (
            <div className="hidden sm:block text-right px-2.5 py-1.5 rounded-md bg-green-50 border border-green-100">
              <p className="text-[10px] text-muted leading-tight">CO₂ saved</p>
              <p className="text-xs font-semibold text-green-600 leading-tight">{eco.co2SavedFormatted}</p>
            </div>
          )}
        </div>
      </div>

      {/* Single category bar – Daily Briefing only */}
      {isDailyBriefing && setSelectedDomain && (
        <div className="border-t border-[#ffd6d2] bg-white/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSection('left')}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              ref={sectionScrollRef}
              className="flex-1 flex gap-1.5 overflow-x-auto scroll-smooth scrollbar-hide py-0.5"
            >
              {DAILY_BRIEFING_SECTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedDomain(value)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${selectedDomain === value
                      ? 'bg-amber-400 text-amber-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollSection('right')}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

