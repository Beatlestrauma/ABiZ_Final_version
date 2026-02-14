import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Get articles from RSS with filters
export const getRSSArticles = async (options = {}) => {
  try {
    const { category, limit = 30, offset = 0, domains, search } = options;
    
    const response = await axios.get(`${API_BASE_URL}/api/rss/articles`, {
      params: { category, limit, offset, domains, search }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching RSS articles:', error);
    throw error;
  }
};

// Get single article by ID
export const getRSSArticleById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rss/articles/${id}`);
    return response.data.article;
  } catch (error) {
    console.error('Error fetching RSS article:', error);
    throw error;
  }
};

// Get RSS statistics
export const getRSSStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rss/stats`);
    return response.data.stats;
  } catch (error) {
    console.error('Error fetching RSS stats:', error);
    throw error;
  }
};

// Manually trigger RSS fetch
export const triggerRSSFetch = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/rss/fetch`);
    return response.data;
  } catch (error) {
    console.error('Error triggering RSS fetch:', error);
    throw error;
  }
};

// Cleanup old articles
export const cleanupOldArticles = async (days = 7) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/rss/cleanup`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error cleaning up articles:', error);
    throw error;
  }
};

// Enhance articles with AI
export const enhanceArticlesWithAI = async (limit = 10) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/rss/enhance`, { limit });
    return response.data;
  } catch (error) {
    console.error('Error enhancing articles:', error);
    throw error;
  }
};

// Hybrid endpoint - RSS with API fallback
export const getHybridNews = async (options = {}) => {
  try {
    const { enhanced = false, useRSS = true } = options;
    
    const response = await axios.get(`${API_BASE_URL}/api/news/daily-briefing`, {
      params: { 
        enhanced: enhanced ? 'true' : 'false',
        rss: useRSS ? 'true' : 'false'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching hybrid news:', error);
    throw error;
  }
};

export default {
  getRSSArticles,
  getRSSArticleById,
  getRSSStats,
  triggerRSSFetch,
  cleanupOldArticles,
  enhanceArticlesWithAI,
  getHybridNews
};
