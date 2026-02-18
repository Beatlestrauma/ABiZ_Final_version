// TEMP: Clear all articles from the database (for debugging only)
import express from 'express';
import rssService from '../services/rssService.js';
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const router = express.Router();

// TEMP: Clear all articles from the database (for debugging only)
router.delete('/clear', async (req, res) => {
  try {
    const db = await open({
      filename: "./data/rss_cache.db",
      driver: sqlite3.Database
    });
    await db.run("DELETE FROM articles");
    res.json({ message: 'All articles deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear articles', details: err.message });
  }
});

// Get articles with filters
router.get('/articles', async (req, res) => {
  try {
    const { category, limit = 30, offset = 0, domains, search } = req.query;

    const articles = await rssService.getArticles({
      category,
      limit: Number(limit),
      offset: Number(offset),
      domains,
      search
    });

    res.json({
      articles,
      count: articles.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching RSS articles:', err.message);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article by ID
router.get('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await rssService.getArticleById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ article, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Error fetching article:', err.message);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Get RSS statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await rssService.getStats();
    res.json({ stats, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Error fetching RSS stats:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Manually trigger RSS fetch
router.post('/fetch', async (req, res) => {
  try {
    const result = await rssService.fetchRSSFeeds();
    res.json({
      message: 'RSS feeds fetched successfully',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching RSS feeds:', err.message);
    res.status(500).json({ error: 'Failed to fetch RSS feeds' });
  }
});

// Cleanup old articles
router.delete('/cleanup', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const deleted = await rssService.cleanupOldArticles(Number(days));
    
    res.json({
      message: `Cleaned up ${deleted} old articles`,
      deleted,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error cleaning up articles:', err.message);
    res.status(500).json({ error: 'Failed to cleanup articles' });
  }
});

// Enhance articles with AI
router.post('/enhance', async (req, res) => {
  try {
    const { limit = 10 } = req.body;
    const enhanced = await rssService.enhanceArticlesWithAI(limit);
    
    res.json({
      message: `Enhanced ${enhanced} articles with AI`,
      enhanced,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error enhancing articles:', err.message);
    res.status(500).json({ error: 'Failed to enhance articles' });
  }
});

export default router;
