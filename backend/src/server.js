import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cron from 'node-cron';
import { getDailyBriefing, getDailyBriefingWithVerification, generateAIQuiz, getArticleStats } from './services/newsService.js';
import { getDailyQuiz } from './services/quizService.js';
import { getEcoMetrics } from './services/ecoService.js';
import { getMarketSnapshot } from './services/marketService.js';
import { verifyLink, verifyMultipleLinks, getLinkCacheStats, clearLinkCache } from './services/linkVerificationService.js';
import geminiService from './services/geminiService.js';
import firebaseService from './services/firebaseService.js';
import videoService from './services/videoService.js';
import rssService from './services/rssService.js';
import rssRoutes from './routes/rssRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Device detection from User-Agent (dynamic serving)
function detectDevice(ua) {
    if (/Mobi|Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
    if (/iPad|Android(?!.*Mobile)|Tablet|Silk|Kindle|PlayBook/i.test(ua)) return 'tablet';
    return 'desktop';
}

// Initialize RSS Database
await rssService.initDB();

// Fetch RSS feeds on startup
console.log('🚀 Fetching initial RSS feeds...');
await rssService.fetchRSSFeeds();

// Schedule RSS fetch every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    console.log('⏰ Scheduled RSS fetch triggered');
    await rssService.fetchRSSFeeds();
});

// Schedule AI enhancement every hour
cron.schedule('0 * * * *', async () => {
    console.log('⏰ Scheduled AI enhancement triggered');
    await rssService.enhanceArticlesWithAI(20);
});

// Schedule cleanup every day at 2 AM
cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Scheduled cleanup triggered');
    await rssService.cleanupOldArticles(7);
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Device detection middleware – attaches req.deviceType
app.use((req, _res, next) => {
    req.deviceType = detectDevice(req.headers['user-agent'] || '');
    next();
});

// RSS Routes
app.use('/api/rss', rssRoutes);

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        services: {
            rss: true,
            gemini: geminiService.isConfigured,
            firebase: firebaseService.isConfigured(),
            newsApis: {
                newsApiOrg: !!process.env.NEWSAPI_KEY,
                gNewsApi: !!process.env.GNEWS_API_KEY,
                newsDataIo: !!process.env.NEWSDATA_API_KEY,
                theNewsApi: !!process.env.THENEWSAPI_KEY
            },
            youtubeApi: !!process.env.YOUTUBE_API_KEY,
            totalConfiguredApis: [
                process.env.NEWSAPI_KEY,
                process.env.GNEWS_API_KEY,
                process.env.NEWSDATA_API_KEY,
                process.env.THENEWSAPI_KEY,
                process.env.YOUTUBE_API_KEY
            ].filter(Boolean).length
        },
        timestamp: new Date().toISOString()
    });
});

// Device detection endpoint for dynamic serving
app.get('/api/device', (req, res) => {
    res.json({
        deviceType: req.deviceType,
        userAgent: req.headers['user-agent'] || '',
        timestamp: new Date().toISOString()
    });
});

// Hybrid endpoint: RSS + API fallback
app.get('/api/news/daily-briefing', async (req, res) => {
    try {
        const enhanced = req.query.enhanced === 'true';
        const useRSS = req.query.rss !== 'false'; // Default to RSS

        let articles = [];

        if (useRSS) {
            // Fetch from RSS first
            articles = await rssService.getArticles({ limit: 30 });
            console.log(`📰 Fetched ${articles.length} articles from RSS`);

            // Fallback to API if RSS has less than 10 articles
            if (articles.length < 10) {
                console.log('⚠️ RSS count low, fetching from APIs as backup...');
                const apiArticles = enhanced ?
                    await getDailyBriefingWithVerification() :
                    await getDailyBriefing();
                articles = [...articles, ...apiArticles].slice(0, 30);
            }
        } else {
            // Use old API method
            articles = enhanced ?
                await getDailyBriefingWithVerification() :
                await getDailyBriefing();
        }

        const stats = getArticleStats(articles);

        res.json({
            articles,
            stats,
            enhanced,
            source: useRSS ? 'rss' : 'api',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error in /api/news/daily-briefing', err.message);
        res.status(500).json({ error: 'Failed to fetch daily briefing' });
    }
});

app.get('/api/quiz/daily', async (req, res) => {
    try {
        const articles = await getDailyBriefing();
        const useAI = req.query.ai === 'true' && geminiService.isConfigured;

        let quiz;
        if (useAI) {
            quiz = await generateAIQuiz(articles);
            if (!quiz) {
                // Fallback to traditional quiz if AI fails
                quiz = getDailyQuiz(articles);
                quiz.aiGenerated = false;
            } else {
                quiz.aiGenerated = true;
            }
        } else {
            quiz = getDailyQuiz(articles);
            quiz.aiGenerated = false;
        }

        res.json(quiz);
    } catch (err) {
        console.error('Error in /api/quiz/daily', err.message);
        res.status(500).json({ error: 'Failed to build quiz' });
    }
});

app.get('/api/eco', (_req, res) => {
    res.json(getEcoMetrics());
});

app.get('/api/market', (_req, res) => {
    res.json(getMarketSnapshot());
});

// Link verification endpoints
app.post('/api/verify/link', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const isValid = await verifyLink(url);
        res.json({ url, isValid, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/verify/link', err.message);
        res.status(500).json({ error: 'Failed to verify link' });
    }
});

app.post('/api/verify/links', async (req, res) => {
    try {
        const { urls } = req.body;
        if (!Array.isArray(urls)) {
            return res.status(400).json({ error: 'URLs array is required' });
        }

        const results = await verifyMultipleLinks(urls);
        res.json({ results, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/verify/links', err.message);
        res.status(500).json({ error: 'Failed to verify links' });
    }
});

app.get('/api/verify/stats', (_req, res) => {
    try {
        const stats = getLinkCacheStats();
        res.json(stats);
    } catch (err) {
        console.error('Error in /api/verify/stats', err.message);
        res.status(500).json({ error: 'Failed to get verification stats' });
    }
});

app.delete('/api/verify/cache', (_req, res) => {
    try {
        clearLinkCache();
        res.json({ message: 'Link cache cleared', timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/verify/cache', err.message);
        res.status(500).json({ error: 'Failed to clear cache' });
    }
});

// AI-powered endpoints
app.post('/api/ai/validate-article', async (req, res) => {
    try {
        if (!geminiService.isConfigured) {
            return res.status(503).json({ error: 'Gemini AI service not configured' });
        }

        const { article } = req.body;
        if (!article) {
            return res.status(400).json({ error: 'Article data is required' });
        }

        const validation = await geminiService.validateNewsArticle(article);
        res.json({ validation, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/ai/validate-article', err.message);
        res.status(500).json({ error: 'Failed to validate article' });
    }
});

app.post('/api/ai/enhance-summary', async (req, res) => {
    try {
        if (!geminiService.isConfigured) {
            return res.status(503).json({ error: 'Gemini AI service not configured' });
        }

        const { article } = req.body;
        if (!article) {
            return res.status(400).json({ error: 'Article data is required' });
        }

        const enhancedSummary = await geminiService.enhanceArticleSummary(article);
        res.json({
            original: article.summary,
            enhanced: enhancedSummary,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error in /api/ai/enhance-summary', err.message);
        res.status(500).json({ error: 'Failed to enhance summary' });
    }
});

// ── Real AI Insights Endpoint ─────────────────────────────────
app.get('/api/ai/insights', async (req, res) => {
    try {
        // Get current articles from RSS
        let articles = [];
        try {
            articles = await rssService.getArticles({ limit: 50 });
        } catch (e) {
            console.log('RSS fetch failed, trying API fallback');
        }

        if (!articles || articles.length === 0) {
            return res.json({
                source: 'none',
                insights: null,
                error: 'No articles available for analysis',
                timestamp: new Date().toISOString()
            });
        }

        // Try AI-powered analysis first
        if (geminiService.isConfigured) {
            try {
                console.log(`🤖 Generating AI insights from ${articles.length} articles...`);
                const aiInsights = await geminiService.generateInsights(articles);
                return res.json({
                    source: 'ai',
                    model: 'gemini-pro',
                    insights: aiInsights,
                    articleCount: articles.length,
                    timestamp: new Date().toISOString()
                });
            } catch (aiErr) {
                console.warn('AI insights failed, falling back to local analysis:', aiErr.message);
            }
        }

        // ── Smart Local Fallback ───────────────────────────────────
        // Real analysis from actual article data — no random numbers
        console.log(`📊 Generating data-driven insights from ${articles.length} articles...`);

        // 1. Extract trending keywords from titles
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'its', 'it', 'that', 'this', 'than', 'as', 'how', 'what', 'when', 'where', 'who', 'which', 'why', 'not', 'no', 'new', 'says', 'said', 'over', 'after', 'more', 'into', 'up', 'out', 'about', 'just', 'also']);
        const wordFreq = {};
        articles.forEach(a => {
            const words = (a.title || '').toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
            words.forEach(w => {
                if (w.length > 3 && !stopWords.has(w)) {
                    wordFreq[w] = (wordFreq[w] || 0) + 1;
                }
            });
        });
        const trendingKeywords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([word, count]) => ({ word, count }));

        // 2. Sector distribution from article domains
        const sectorMap = {};
        articles.forEach(a => {
            (a.domains || []).forEach(d => {
                if (d && d !== 'general') {
                    sectorMap[d] = (sectorMap[d] || 0) + 1;
                }
            });
        });

        // 3. Source analysis
        const sourceMap = {};
        articles.forEach(a => {
            const src = a.sourceName || a.source || 'Unknown';
            sourceMap[src] = (sourceMap[src] || 0) + 1;
        });
        const topSources = Object.entries(sourceMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, count]) => ({ name, count }));

        // 4. Sentiment from keywords (simple lexicon-based)
        const posWords = ['growth', 'surge', 'boost', 'gain', 'rise', 'launch', 'success', 'profit', 'record', 'innovation', 'breakthrough', 'expand', 'soar', 'bullish', 'recovery', 'opportunity', 'positive', 'strong', 'improve'];
        const negWords = ['fall', 'drop', 'crash', 'decline', 'loss', 'risk', 'warn', 'fear', 'crisis', 'layoff', 'cut', 'slump', 'bearish', 'downturn', 'threat', 'concern', 'weak', 'recession', 'fraud'];
        let posCount = 0, negCount = 0;
        articles.forEach(a => {
            const text = ((a.title || '') + ' ' + (a.summary || '')).toLowerCase();
            posWords.forEach(w => { if (text.includes(w)) posCount++; });
            negWords.forEach(w => { if (text.includes(w)) negCount++; });
        });
        const totalSent = posCount + negCount || 1;
        const sentimentRatio = posCount / totalSent;
        const sentiment = sentimentRatio > 0.6 ? 'Bullish' : sentimentRatio < 0.4 ? 'Bearish' : 'Mixed';
        const confidence = Math.round(Math.abs(sentimentRatio - 0.5) * 200);

        // 5. Article freshness
        const now = Date.now();
        const ageDistribution = { lastHour: 0, last6Hours: 0, last24Hours: 0, older: 0 };
        articles.forEach(a => {
            const ageMs = now - new Date(a.publishedAt || a.pubDate || now).getTime();
            const ageHours = ageMs / (1000 * 60 * 60);
            if (ageHours < 1) ageDistribution.lastHour++;
            else if (ageHours < 6) ageDistribution.last6Hours++;
            else if (ageHours < 24) ageDistribution.last24Hours++;
            else ageDistribution.older++;
        });

        // 6. Build key trends from trending keywords
        const keyTrends = trendingKeywords.slice(0, 5).map(kw => ({
            trend: kw.word.charAt(0).toUpperCase() + kw.word.slice(1) + '-related developments',
            evidence: `Mentioned in ${kw.count} articles`,
            impact: kw.count > 5 ? 'High' : kw.count > 2 ? 'Medium' : 'Low'
        }));

        // 7. Build sector analysis
        const sectorAnalysis = {};
        Object.entries(sectorMap).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([sector, count]) => {
            sectorAnalysis[sector] = {
                sentiment: 'Neutral',
                articleCount: count,
                keyTheme: `${count} articles covering ${sector}`
            };
        });

        const insights = {
            marketSentiment: {
                overall: sentiment,
                confidence: Math.max(30, confidence),
                reasoning: `Based on keyword analysis of ${articles.length} articles: ${posCount} positive signals, ${negCount} negative signals`
            },
            keyTrends,
            riskFactors: negWords.filter(w => {
                const count = articles.filter(a => ((a.title || '') + ' ' + (a.summary || '')).toLowerCase().includes(w)).length;
                return count > 0;
            }).slice(0, 4).map(w => ({
                risk: w.charAt(0).toUpperCase() + w.slice(1) + '-related concerns in the news',
                severity: 'Medium',
                affectedSectors: Object.keys(sectorMap).slice(0, 2)
            })),
            opportunities: posWords.filter(w => {
                const count = articles.filter(a => ((a.title || '') + ' ' + (a.summary || '')).toLowerCase().includes(w)).length;
                return count > 0;
            }).slice(0, 4).map(w => ({
                opportunity: w.charAt(0).toUpperCase() + w.slice(1) + ' trends identified in current coverage',
                timeframe: 'Short',
                sector: Object.keys(sectorMap)[0] || 'Business'
            })),
            sectorAnalysis,
            executiveSummary: `Analysis of ${articles.length} articles from ${Object.keys(sourceMap).length} sources. Market sentiment appears ${sentiment.toLowerCase()} with ${confidence}% confidence. Top trending topics: ${trendingKeywords.slice(0, 3).map(k => k.word).join(', ')}.`,
            trendingKeywords,
            topSources,
            freshness: ageDistribution,
            sentimentBreakdown: { positive: posCount, negative: negCount, ratio: sentimentRatio }
        };

        res.json({
            source: 'local',
            insights,
            articleCount: articles.length,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('Error in /api/ai/insights:', err.message);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

app.post('/api/ai/generate-alternative', async (req, res) => {
    try {
        if (!geminiService.isConfigured) {
            return res.status(503).json({ error: 'Gemini AI service not configured' });
        }

        const { article, reason } = req.body;
        if (!article) {
            return res.status(400).json({ error: 'Article data is required' });
        }

        const alternative = await geminiService.generateAlternativeContent(article, reason);
        res.json({ alternative, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/ai/generate-alternative', err.message);
        res.status(500).json({ error: 'Failed to generate alternative content' });
    }
});

// Placeholder: saved articles would be user-specific once auth is added
app.get('/api/saved', (_req, res) => {
    res.json({ saved: [] });
});

// Video endpoints
app.get('/api/videos/women-in-business', async (req, res) => {
    try {
        const useCache = req.query.cache !== 'false';
        const videos = await videoService.getWomenInBusinessVideos(useCache);
        res.json({
            videos,
            category: 'women-in-business',
            count: videos.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching women in business videos:', err.message);
        res.status(500).json({ error: 'Failed to fetch women in business videos' });
    }
});

app.get('/api/videos/sustainability', async (req, res) => {
    try {
        const useCache = req.query.cache !== 'false';
        const videos = await videoService.getSustainabilityVideos(useCache);
        res.json({
            videos,
            category: 'sustainability',
            count: videos.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching sustainability videos:', err.message);
        res.status(500).json({ error: 'Failed to fetch sustainability videos' });
    }
});

app.get('/api/videos/featured', async (req, res) => {
    try {
        const featured = await videoService.getFeaturedVideos();
        res.json({
            featured,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching featured videos:', err.message);
        res.status(500).json({ error: 'Failed to fetch featured videos' });
    }
});

app.get('/api/videos/search', async (req, res) => {
    try {
        const { q: query, category } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({ error: 'Query must be at least 2 characters' });
        }

        const results = await videoService.searchVideos(query, category);
        res.json({
            results,
            query,
            count: results.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error searching videos:', err.message);
        res.status(500).json({ error: 'Failed to search videos' });
    }
});

// Database endpoints
app.post('/api/db/save-article', async (req, res) => {
    try {
        const { article } = req.body;
        if (!article || !article.id) {
            return res.status(400).json({ error: 'Article with ID is required' });
        }

        const result = await firebaseService.saveArticle(article);
        res.json({ result, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error saving article:', err.message);
        res.status(500).json({ error: 'Failed to save article' });
    }
});

app.get('/api/db/articles', async (req, res) => {
    try {
        const articles = await firebaseService.getArticles();
        res.json({
            articles,
            count: articles.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching articles:', err.message);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.post('/api/db/user-preference', async (req, res) => {
    try {
        const { userId, preference } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await firebaseService.saveUserPreference(userId, preference);
        res.json({ result, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error saving preference:', err.message);
        res.status(500).json({ error: 'Failed to save preference' });
    }
});

app.get('/api/db/user-preference/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const preferences = await firebaseService.getUserPreferences(userId);
        res.json({
            userId,
            preferences,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching preferences:', err.message);
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
});

app.post('/api/db/quiz-result', async (req, res) => {
    try {
        const { userId, result } = req.body;
        if (!userId || !result) {
            return res.status(400).json({ error: 'User ID and result are required' });
        }

        const saveResult = await firebaseService.saveQuizResult(userId, result);
        res.json({ saveResult, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error saving quiz result:', err.message);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
});

app.get('/api/db/leaderboard', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        const leaderboard = await firebaseService.getLeaderboard(limit);
        res.json({
            leaderboard,
            count: leaderboard.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching leaderboard:', err.message);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// Placeholder: saved articles would be user-specific once auth is added
app.get('/api/saved', (_req, res) => {
    res.json({ saved: [] });
});

app.listen(PORT, () => {
    console.log(`BizAI backend listening on http://localhost:${PORT}`);
});