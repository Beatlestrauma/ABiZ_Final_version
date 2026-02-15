import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getRSSArticles, getRSSStats, getHybridNews } from '../services/rssNewsService.js';

const NewsContext = createContext(null);

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eco, setEco] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [newsStats, setNewsStats] = useState(null);
  const [useRSS, setUseRSS] = useState(true); // New: RSS mode toggle

  const fetchNews = async (enhanced = false) => {
    try {
      setLoading(true);

      let newsData;

      if (useRSS) {
        // Use RSS-based hybrid endpoint
        newsData = await getHybridNews({ enhanced, useRSS: true });
        console.log(`📰 RSS Mode: ${newsData.articles?.length || 0} articles loaded from ${newsData.source}`);
      } else {
        // Use old API endpoint
        const cacheBust = `cb=${Date.now()}`;
        let endpoint = enhanced ? '/api/news/daily-briefing?enhanced=true&rss=false' : '/api/news/daily-briefing?rss=false';
        endpoint += '&' + cacheBust;
        const response = await axios.get(endpoint);
        newsData = response.data;
        console.log(`🔌 API Mode: ${newsData.articles?.length || 0} articles loaded`);
      }

      // Fetch eco metrics
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const ecoRes = await axios.get(`${apiUrl}/api/eco`);

      setArticles(newsData.articles || []);
      setNewsStats(newsData.stats || null);
      setEco(ecoRes.data || null);
      setLastUpdated(new Date());
      setError(null);

      if (newsData.enhanced) {
        console.log('✨ Enhanced mode: AI validation enabled');
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      // Only set error if we have no articles at all (don't overwrite existing articles on refresh failure)
      if (articles.length === 0) {
        setError('Failed to load latest briefing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = () => {
    fetchNews(isLiveMode);
  };

  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    fetchNews(!isLiveMode);
  };

  const toggleRSSMode = () => {
    setUseRSS(!useRSS);
    fetchNews(isLiveMode);
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      if (!cancelled) {
        await fetchNews(isLiveMode);
      }
    }

    fetchAll();

    // Set up auto-refresh for live mode
    let interval;
    if (isLiveMode) {
      interval = setInterval(() => {
        if (!cancelled) {
          fetchNews(true);
        }
      }, 10 * 60 * 1000); // Refresh every 10 minutes in live mode
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [isLiveMode, useRSS]);

  const value = {
    articles,
    loading,
    error,
    eco,
    lastUpdated,
    isLiveMode,
    useRSS,
    newsStats,
    refreshNews,
    toggleLiveMode,
    toggleRSSMode,
    fetchNews
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return ctx;
}

