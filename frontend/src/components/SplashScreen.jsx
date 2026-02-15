
import React from 'react';
import '../splash-theme.css';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#ff5e5b] via-[#ff7a77] to-[#ffb199] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Mild background photo1 */}
      <div className="splash-bg-photo1"></div>
      <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
        {/* Floating circle photo2 */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 shadow-2xl">
            <img src="/assets/photo2.jpg" alt="ABiZ" className="w-32 h-32 object-cover rounded-full" />
          </div>
        </div>
        {/* Floating ABiZ title */}
        <h1 className="text-7xl font-extrabold text-white drop-shadow-lg splash-title-float mb-4">ABiz</h1>
        <p className="text-white text-2xl font-bold mb-2">Connecting Students to Industries</p>
        <p className="text-white/90 text-lg font-semibold mb-12">Career Intelligence • Business News • Learning Hub</p>
        
        {/* Loading indicator */}
        <div className="flex items-center justify-center space-x-3 mt-8">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-white/90 text-lg font-semibold mt-8">Loading your daily briefing...</p>
        
        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl mb-1">📰</p>
            <p className="text-white font-semibold text-sm">Business News</p>
            <p className="text-white/80 text-xs mt-1">Daily insights</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">💼</p>
            <p className="text-white font-semibold text-sm">Interview Prep</p>
            <p className="text-white/80 text-xs mt-1">50K+ Q&As</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">🎯</p>
            <p className="text-white font-semibold text-sm">Career Trends</p>
            <p className="text-white/80 text-xs mt-1">Live updates</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-2 md:bottom-6 inset-x-0 flex justify-center z-20">
          <span className="text-white text-base font-semibold bg-white/15 px-8 py-3 rounded-full backdrop-blur-sm border border-white/30">Amrita School of Business</span>
        </div>
      </div>
    </div>
  );
}
