import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ReadingTimeContext = createContext(null);

// Keys for localStorage
const STORAGE_KEY = 'bizai_reading_time';

function getToday() {
    return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function ReadingTimeProvider({ children }) {
    const [seconds, setSeconds] = useState(0); // seconds accumulated today in THIS session
    const [data, setData] = useState(() => loadData());
    const tickRef = useRef(null);
    const activeRef = useRef(true);

    // On mount, load today's existing seconds
    const today = getToday();
    const todayStoredSeconds = data[today] || 0;

    // Total seconds today = stored + session
    const todaySeconds = todayStoredSeconds + seconds;
    const todayMinutes = Math.round(todaySeconds / 60);

    // Weekly: sum last 7 days
    const weeklyMinutes = (() => {
        let total = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            total += data[key] || 0;
        }
        total += seconds; // add current session
        return Math.round(total / 60);
    })();

    // Monthly: sum last 30 days
    const monthlyMinutes = (() => {
        let total = 0;
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            total += data[key] || 0;
        }
        total += seconds;
        return Math.round(total / 60);
    })();

    // Total all time
    const totalMinutes = (() => {
        let total = Object.values(data).reduce((a, b) => a + b, 0);
        total += seconds;
        return Math.round(total / 60);
    })();

    // Persist every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                const updated = { ...loadData() };
                updated[today] = (updated[today] || 0) + seconds;
                saveData(updated);
                setData(updated);
                setSeconds(0); // reset session counter since we persisted
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [seconds, today]);

    // Persist on unmount / page hide
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (seconds > 0) {
                const updated = { ...loadData() };
                updated[today] = (updated[today] || 0) + seconds;
                saveData(updated);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                handleBeforeUnload();
                activeRef.current = false;
            } else {
                activeRef.current = true;
            }
        });

        return () => {
            handleBeforeUnload();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [seconds, today]);

    // Tick every second when the tab is active
    useEffect(() => {
        tickRef.current = setInterval(() => {
            if (activeRef.current && !document.hidden) {
                setSeconds(s => s + 1);
            }
        }, 1000);

        return () => clearInterval(tickRef.current);
    }, []);

    const value = {
        todaySeconds,
        todayMinutes,
        weeklyMinutes,
        monthlyMinutes,
        totalMinutes,
        // Formatted helper
        formatTime: useCallback((totalSec) => {
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;
            if (h > 0) return `${h}h ${m}m`;
            if (m > 0) return `${m}m ${s}s`;
            return `${s}s`;
        }, []),
    };

    return (
        <ReadingTimeContext.Provider value={value}>
            {children}
        </ReadingTimeContext.Provider>
    );
}

export function useReadingTime() {
    const ctx = useContext(ReadingTimeContext);
    if (!ctx) throw new Error('useReadingTime must be used within ReadingTimeProvider');
    return ctx;
}
