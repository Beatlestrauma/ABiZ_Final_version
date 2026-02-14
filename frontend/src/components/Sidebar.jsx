import React from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { id: 'placement', label: 'Career & Placement Intelligence', icon: '🎯', section: 'Career' },
  { id: 'interviews', label: 'Interview Repository', icon: '💼', section: 'Career' },
  { id: 'home', label: 'Daily Briefing', icon: '📰', section: 'News' },
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'saved', label: 'Saved Articles', icon: '⭐' },
  { id: 'market', label: 'Market Data', icon: '📊' },
  { id: 'ai', label: 'AI Insights', icon: '🤖' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎙️' },
  { id: 'women', label: 'Women in Business', icon: '👩‍💼' },
  { id: 'entrepreneurs', label: 'Entrepreneurs', icon: '🚀' },
  { id: 'sustainability', label: 'Sustainability & Impact', icon: '🌱' },
  { id: 'quiz', label: 'Quizzes & Learning', icon: '❓' },
  { id: 'games', label: 'Games & Learning', icon: '🎮' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  { id: 'profile', label: 'User Profile & Progress', icon: '👤' }
];

export default function Sidebar({ currentPage, onNavigate, isTablet = false }) {
  const { eco } = useNews();
  const { user, isAuthenticated } = useAuth();

  // Premium Sidebar Styles - "Control Center"
  // If tablet, we keep the 'desktop-sidebar' class if needed by parent, but style content similarly
  const sidebarClass = isTablet
    ? 'hidden md:flex desktop-sidebar flex-col bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 z-20 shadow-xl transition-all duration-300'
    : 'hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 z-20 shadow-xl';

  return (
    <aside className={sidebarClass}>
      {/* 1. Header Area with Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center text-white font-serif font-bold text-lg shadow-md flex-shrink-0">
          B
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-xl font-bold text-slate-900 leading-none">
            Biz<span className="text-rose-500">AI</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">Premium</span>
        </div>
      </div>

      {/* 2. Navigation Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = currentPage === item.id;
          const showSection = item.section && (idx === 0 || NAV_ITEMS[idx - 1].section !== item.section);

          return (
            <div key={item.id}>
              {showSection && (
                <h3 className="px-3 mt-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.section}
                </h3>
              )}
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-3 py-2.5 mb-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 group ${isActive
                  ? 'bg-white shadow-sm border border-slate-100 text-rose-600 ring-1 ring-black/5 z-10'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500"></div>}
              </button>
            </div>
          );
        })}
      </nav>

      {/* 3. Footer / User Area - Floating Card Style */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        {/* Eco Card - Mini */}
        <div className="mb-3 px-3 py-2 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">🌱</span>
            <span className="text-xs font-semibold text-emerald-800">Impact</span>
          </div>
          <span className="text-xs font-bold text-emerald-700">{eco ? eco.papersSaved.toLocaleString() : '0'}</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-1">
          {isAuthenticated && user ? (
            <>
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 p-0.5 shadow-sm flex-shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  {(user.displayName || user.username || '?').charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.displayName || user.username || 'User'}</p>
                <p className="text-xs text-rose-500 font-medium">{(user.points ?? 0).toLocaleString()} pts</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shadow-sm">
                ?
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">Guest User</p>
                <p className="text-xs text-slate-500">Sign in to sync</p>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
