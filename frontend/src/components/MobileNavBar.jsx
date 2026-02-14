import React, { useState } from 'react';
import { useDevice } from '../context/DeviceContext.jsx';

const PRIMARY_ITEMS = [
    { id: 'home', icon: '📰', label: 'Home' },
    { id: 'market', icon: '📊', label: 'Market' },
    { id: 'ai', icon: '🤖', label: 'AI' },
    { id: 'quiz', icon: '❓', label: 'Quiz' },
    { id: 'profile', icon: '👤', label: 'Profile' },
];

const MORE_ITEMS = [
    { id: 'placement', icon: '🎯', label: 'Career Intel' },
    { id: 'interviews', icon: '💼', label: 'Interviews' },
    { id: 'library', icon: '📚', label: 'Library' },
    { id: 'saved', icon: '⭐', label: 'Saved' },
    { id: 'podcasts', icon: '🎙️', label: 'Podcasts' },
    { id: 'women', icon: '👩‍💼', label: 'Women in Biz' },
    { id: 'entrepreneurs', icon: '🚀', label: 'Entrepreneurs' },
    { id: 'sustainability', icon: '🌱', label: 'Sustainability' },
    { id: 'games', icon: '🎮', label: 'Games' },
    { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
];

export default function MobileNavBar({ currentPage, onNavigate }) {
    const { isMobile } = useDevice();
    const [showMore, setShowMore] = useState(false);

    if (!isMobile) return null;

    const isMoreActive = MORE_ITEMS.some(item => item.id === currentPage);

    return (
        <>
            {/* More overlay sheet */}
            {showMore && (
                <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)}>
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />
                    <div
                        className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 animate-slideUp z-50 border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">More Pages</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {MORE_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { onNavigate(item.id); setShowMore(false); }}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-95 ${currentPage === item.id
                                        ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100'
                                        : 'hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom nav bar - Fixed positioning restored by removing transform from parent */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-around px-2 py-2">
                    {PRIMARY_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { onNavigate(item.id); setShowMore(false); }}
                            className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all active:scale-95 ${currentPage === item.id
                                ? 'text-rose-600'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <span className={`text-xl transition-transform ${currentPage === item.id ? '-translate-y-0.5' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-medium ${currentPage === item.id ? 'text-rose-600 font-bold' : 'text-slate-400'
                                }`}>{item.label}</span>

                            {/* Active Indicator Dot */}
                            {currentPage === item.id && (
                                <span className="absolute -top-0.5 w-1 h-1 bg-rose-500 rounded-full shadow-sm" />
                            )}
                        </button>
                    ))}
                    {/* More button */}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all active:scale-95 ${isMoreActive || showMore
                            ? 'text-rose-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <span className="text-xl">☰</span>
                        <span className={`text-[10px] font-medium ${isMoreActive || showMore ? 'text-rose-600 font-bold' : 'text-slate-400'
                            }`}>More</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
