import axios from 'axios';
import { verifyLink, verifyMultipleLinks } from './linkVerificationService.js';
import geminiService from './geminiService.js';

const CACHE_MS = 30 * 60 * 1000; // 30 minutes cache
let lastFetchedAt = 0;
let cachedArticles = null;

// API Keys from environment
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
const THENEWSAPI_KEY = process.env.THENEWSAPI_KEY;

const DOMAIN_LABELS = [
    'geopolitics',
    'trade',
    'sports',
    'economics',
    'share market',
    'finance',
    'marketing',
    'technology'
];

// Multi-API Configuration
const NEWS_APIS = [{
        name: 'NewsAPI.org',
        enabled: !!NEWSAPI_KEY,
        endpoints: [{
                name: 'Business Headlines',
                url: 'https://newsapi.org/v2/top-headlines',
                params: {
                    category: 'business',
                    language: 'en',
                    pageSize: 15,
                    apiKey: NEWSAPI_KEY
                }
            },
            {
                name: 'Everything Business',
                url: 'https://newsapi.org/v2/everything',
                params: {
                    q: 'business OR finance OR economy OR market',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 10,
                    from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    apiKey: NEWSAPI_KEY
                }
            }
        ],
        parser: (data) => data.articles || []
    },
    {
        name: 'GNews API',
        enabled: !!GNEWS_API_KEY,
        endpoints: [{
                name: 'Business News',
                url: 'https://gnews.io/api/v4/top-headlines',
                params: {
                    category: 'business',
                    lang: 'en',
                    country: 'us',
                    max: 15,
                    apikey: GNEWS_API_KEY
                }
            },
            {
                name: 'Technology News',
                url: 'https://gnews.io/api/v4/top-headlines',
                params: {
                    category: 'technology',
                    lang: 'en',
                    country: 'us',
                    max: 10,
                    apikey: GNEWS_API_KEY
                }
            }
        ],
        parser: (data) => data.articles || []
    },
    {
        name: 'NewsData.io',
        enabled: !!NEWSDATA_API_KEY,
        endpoints: [{
                name: 'Business Headlines',
                url: 'https://newsdata.io/api/1/news',
                params: {
                    apikey: NEWSDATA_API_KEY,
                    category: 'business',
                    language: 'en',
                    country: 'us',
                    size: 15
                }
            },
            {
                name: 'Technology Headlines',
                url: 'https://newsdata.io/api/1/news',
                params: {
                    apikey: NEWSDATA_API_KEY,
                    category: 'technology',
                    language: 'en',
                    country: 'us',
                    size: 10
                }
            }
        ],
        parser: (data) => data.results || []
    },
    {
        name: 'TheNewsAPI.com',
        enabled: !!THENEWSAPI_KEY,
        endpoints: [{
                name: 'Business News',
                url: 'https://api.thenewsapi.com/v1/news/top',
                params: {
                    api_token: THENEWSAPI_KEY,
                    categories: 'business',
                    language: 'en',
                    limit: 15
                }
            },
            {
                name: 'Technology News',
                url: 'https://api.thenewsapi.com/v1/news/top',
                params: {
                    api_token: THENEWSAPI_KEY,
                    categories: 'tech',
                    language: 'en',
                    limit: 10
                }
            }
        ],
        parser: (data) => data.data || []
    }
];

function classifyDomains(title = '', summary = '', sourceName = '') {
    const text = `${title} ${summary} ${sourceName}`.toLowerCase();
    const domains = new Set();

    if (/\b(war|sanction|diplomacy|election|border|conflict|geopolitic)/.test(text)) {
        domains.add('geopolitics');
    }
    if (/\b(trade|tariff|export|import|supply chain|logistics)\b/.test(text)) {
        domains.add('trade');
    }
    if (/\b(sport|league|tournament|match|world cup|olympic)/.test(text)) {
        domains.add('sports');
    }
    if (/\b(gdp|inflation|recession|macro|economy|economic)\b/.test(text)) {
        domains.add('economics');
    }
    if (/\b(index|s&p|nasdaq|dow|ftse|nifty|sensex|stock market|equity|shares?)\b/.test(text)) {
        domains.add('share market');
    }
    if (/\b(bank|interest rate|loan|funding|capital|investment|investor|finance)\b/.test(text)) {
        domains.add('finance');
    }
    if (/\b(marketing|brand|campaign|advertis(ing|ement)|customer|consumer)\b/.test(text)) {
        domains.add('marketing');
    }
    if (/\b(ai |artificial intelligence|machine learning|cloud|software|startup|tech\b)/.test(text)) {
        domains.add('technology');
    }

    if (domains.size === 0) {
        domains.add('general');
    }

    return Array.from(domains);
}

function normalizeArticle(raw, apiName, idx) {
    let article = {};

    // Normalize based on API structure
    switch (apiName) {
        case 'NewsAPI.org':
            article = {
                title: raw.title,
                sourceName: raw.source?.name || 'Unknown',
                summary: raw.description || raw.content || '',
                url: raw.url,
                imageUrl: raw.urlToImage,
                publishedAt: raw.publishedAt
            };
            break;

        case 'GNews API':
            article = {
                title: raw.title,
                sourceName: raw.source?.name || 'GNews',
                summary: raw.description || '',
                url: raw.url,
                imageUrl: raw.image,
                publishedAt: raw.publishedAt
            };
            break;

        case 'NewsData.io':
            article = {
                title: raw.title,
                sourceName: raw.source_id || 'NewsData',
                summary: raw.description || raw.content || '',
                url: raw.link,
                imageUrl: raw.image_url,
                publishedAt: raw.pubDate
            };
            break;

        case 'TheNewsAPI.com':
            article = {
                title: raw.title,
                sourceName: raw.source || 'TheNewsAPI',
                summary: raw.description || raw.snippet || '',
                url: raw.url,
                imageUrl: raw.image_url,
                publishedAt: raw.published_at
            };
            break;

        default:
            article = {
                title: raw.title || `News Update ${idx + 1}`,
                sourceName: raw.source?.name || raw.source || 'Unknown',
                summary: raw.description || raw.content || '',
                url: raw.url || raw.link,
                imageUrl: raw.urlToImage || raw.image || raw.image_url,
                publishedAt: raw.publishedAt || raw.pubDate || raw.published_at
            };
    }

    // Clean and validate
    const title = (article.title || '').replace(/\s*\[.*?\]\s*$/, '').trim();
    const summary = (article.summary || '').substring(0, 300).trim();
    const publishedAt = article.publishedAt || new Date().toISOString();
    const minutes = Math.max(2, Math.round(summary.length / 900));
    const domains = classifyDomains(title, summary, article.sourceName);

    return {
        id: article.url || `${apiName.toLowerCase()}-${idx}-${Date.now()}`,
        title,
        sourceName: article.sourceName || 'Unknown',
        summary,
        url: article.url,
        imageUrl: article.imageUrl,
        publishedAt,
        readMinutes: minutes,
        domains,
        apiSource: apiName,
        linkValid: null,
        isGenerated: false,
        credibilityScore: null,
        validationStatus: 'pending'
    };
}

async function fetchFromAPI(api) {
    if (!api.enabled) {
        console.log(`?? ${api.name}: API key not configured, skipping`);
        return [];
    }

    console.log(`?? Fetching from ${api.name}...`);
    const allArticles = [];

    for (const endpoint of api.endpoints) {
        try {
            console.log(`  ?? ${endpoint.name}...`);

            const response = await axios.get(endpoint.url, {
                params: endpoint.params,
                timeout: 10000,
                headers: {
                    'User-Agent': 'BizAI/1.0 (Educational Purpose)',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200 && response.data) {
                const articles = api.parser(response.data);

                if (articles && articles.length > 0) {
                    const normalizedArticles = articles
                        .filter(article =>
                            article &&
                            article.title &&
                            !article.title.includes('[Removed]') &&
                            (article.url || article.link)
                        )
                        .map((article, idx) => normalizeArticle(article, api.name, idx))
                        .filter(article => article.title && article.url);

                    allArticles.push(...normalizedArticles);
                    console.log(`    ? ${normalizedArticles.length} articles from ${endpoint.name}`);
                } else {
                    console.log(`    ?? No articles from ${endpoint.name}`);
                }
            }
        } catch (error) {
            console.error(`    ? ${endpoint.name} failed:`, error.response?.data?.message || error.message);
        }

        // Small delay between endpoint calls
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`?? ${api.name}: Total ${allArticles.length} articles`);
    return allArticles;
}

async function fetchFromAllAPIs() {
    console.log('?? Fetching news from multiple APIs...');
    const allArticles = [];
    const apiResults = [];

    // Fetch from all APIs concurrently
    const fetchPromises = NEWS_APIS.map(async(api) => {
        try {
            const articles = await fetchFromAPI(api);
            return { api: api.name, articles, success: true };
        } catch (error) {
            console.error(`? ${api.name} completely failed:`, error.message);
            return { api: api.name, articles: [], success: false };
        }
    });

    const results = await Promise.allSettled(fetchPromises);

    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            apiResults.push(result.value);
            if (result.value.articles.length > 0) {
                allArticles.push(...result.value.articles);
            }
        }
    });

    // Remove duplicates based on URL and title similarity
    const uniqueArticles = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    allArticles.forEach(article => {
        const titleKey = article.title.toLowerCase().substring(0, 50);
        if (!seenUrls.has(article.url) && !seenTitles.has(titleKey)) {
            seenUrls.add(article.url);
            seenTitles.add(titleKey);
            uniqueArticles.push(article);
        }
    });

    // Sort by published date (newest first)
    uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    console.log(`?? Summary:`);
    apiResults.forEach(result => {
        console.log(`  ${result.success ? '?' : '?'} ${result.api}: ${result.articles.length} articles`);
    });
    console.log(`?? Total unique articles: ${uniqueArticles.length}`);

    return uniqueArticles.slice(0, 30); // Limit to 30 articles
}

// Demo articles - high-quality professional content organized by category
function getDemoArticles() {
    const now = new Date().toISOString();
    return [
        // ===== TECHNOLOGY & INNOVATION =====
        {
            id: 'demo-1',
            title: 'Artificial Intelligence Reshapes Enterprise Software Development',
            sourceName: 'TechCrunch',
            summary: 'Major enterprise software companies report 40% faster development cycles using AI-assisted coding tools. This shift is fundamentally changing how organizations build, test, and deploy applications. Industry experts predict widespread adoption across Fortune 500 companies by Q3 2026.',
            url: 'https://techcrunch.com/',
            imageUrl: 'https://images.unsplash.com/photo-1677442d019cecf123d5315faee4dd462a853ee7b8746e95ebab4d8b5e3b2d7c?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            readMinutes: 7,
            domains: ['technology'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 9,
            validationStatus: 'verified'
        },
        {
            id: 'demo-2',
            title: 'Cloud Infrastructure Providers Accelerate Competition for Market Share',
            sourceName: 'InfoQ',
            summary: 'AWS, Microsoft Azure, and Google Cloud Platform intensify price competition while expanding AI and machine learning capabilities. Enterprise customers report increasing flexibility in multi-cloud strategies. The three providers now control 68% of the global cloud market.',
            url: 'https://www.infoq.com/',
            imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            readMinutes: 6,
            domains: ['technology', 'finance'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 9,
            validationStatus: 'verified'
        },
        {
            id: 'demo-3',
            title: 'Cybersecurity Threats Evolve: AI-Powered Attacks Show 150% Increase',
            sourceName: 'Gartner',
            summary: 'Cybersecurity teams face unprecedented challenges as threat actors leverage AI to launch sophisticated attacks. Organizations investing in AI-driven defense systems report 40% fewer successful breach attempts. The global cybersecurity market is projected to reach $250 billion by 2027.',
            url: 'https://www.gartner.com/',
            imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd582f23d5d?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            readMinutes: 8,
            domains: ['technology', 'finance'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 9,
            validationStatus: 'verified'
        },
        // ===== FINANCE & MARKETS =====
        {
            id: 'demo-4',
            title: 'Tech Stocks Surge 8% Following Strong Earnings Reports and AI Optimism',
            sourceName: 'Bloomberg',
            summary: 'NASDAQ reaches new all-time highs as major technology companies report beat earnings expectations. AI-focused businesses show exceptional growth rates. Market analysts attribute gains to reduced interest rate concerns and strong enterprise software demand.',
            url: 'https://www.bloomberg.com/',
            imageUrl: 'https://images.unsplash.com/photo-1590283603385-e32de2ceb4a8?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            readMinutes: 4,
            domains: ['share market', 'finance', 'economics'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 9,
            validationStatus: 'verified'
        },
        {
            id: 'demo-5',
            title: 'Global Venture Capital Investment Reaches $400B Milestone in 2025',
            sourceName: 'PitchBook',
            summary: 'Venture capital funding rebounds with AI, biotech, and fintech startups leading investment rounds. Early-stage companies secure record funding amounts, signaling investor confidence in emerging technologies. Top-funded sectors include autonomous vehicles, climate tech, and healthcare AI.',
            url: 'https://pitchbook.com/',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            readMinutes: 6,
            domains: ['finance', 'economics'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 8,
            validationStatus: 'verified'
        },
        {
            id: 'demo-6',
            title: 'Central Banks Navigate Inflation: Policy Shifts Impact Global Markets',
            sourceName: 'Reuters',
            summary: 'Federal Reserve signals measured approach to interest rates, balancing inflation concerns with economic growth. Central banks across major economies coordinate policy adjustments. Market volatility remains elevated amid geopolitical uncertainties and economic data releases.',
            url: 'https://www.reuters.com/',
            imageUrl: 'https://images.unsplash.com/photo-1611432579699-484f7990f956?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            readMinutes: 5,
            domains: ['finance', 'economics'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 9,
            validationStatus: 'verified'
        },
        // ===== CAREER & EMPLOYMENT =====
        {
            id: 'demo-7',
            title: 'Tech Hiring Reaches Historic Levels: Salaries Rise 15% Across Roles',
            sourceName: 'LinkedIn',
            summary: 'Major technology companies expand hiring to meet growing demand for software engineers, data scientists, and AI specialists. Average salaries for experienced engineers now range from 80-120 LPA in India. Companies like Google, Microsoft, and Amazon compete aggressively for top talent.',
            url: 'https://www.linkedin.com/',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            readMinutes: 6,
            domains: ['technology'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 8,
            validationStatus: 'verified'
        },
        {
            id: 'demo-8',
            title: 'Remote Work Revolution: 65% of Tech Companies Now Offer Hybrid Models',
            sourceName: 'McKinsey',
            summary: 'Hybrid work arrangements become standard in technology sector, reshaping office space requirements and employee satisfaction metrics. Companies report improved retention and talent acquisition with flexible work policies. Productivity metrics remain stable or improved according to studies.',
            url: 'https://www.mckinsey.com/',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
            readMinutes: 7,
            domains: ['technology', 'marketing'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 8,
            validationStatus: 'verified'
        },
        // ===== SUSTAINABILITY =====
        {
            id: 'demo-9',
            title: 'Green Technology Investments Surge: $500B Pledged in 2025',
            sourceName: 'GreenBiz',
            summary: 'Global organizations commit unprecedented capital to renewable energy, carbon capture, and sustainable technology initiatives. Government incentives and corporate ESG targets drive investment growth. Clean energy startups secure record venture funding with strong post-acquisition returns.',
            url: 'https://www.greenbiz.com/',
            imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e187b0?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
            readMinutes: 5,
            domains: ['technology', 'economics'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 8,
            validationStatus: 'verified'
        },
        {
            id: 'demo-10',
            title: 'Corporate Carbon Neutrality Goals: Reality Check on 2030 Targets',
            sourceName: 'Harvard Business Review',
            summary: 'Progress report shows 42% of Fortune 500 companies on track to meet their carbon neutrality goals. Remaining companies face challenges in supply chain decarbonization. Technology enables new accountability frameworks and transparent reporting mechanisms.',
            url: 'https://hbr.org/',
            imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
            readMinutes: 6,
            domains: ['economics', 'marketing'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 8,
            validationStatus: 'verified'
        },
        // ===== BUSINESS & ENTREPRENEURSHIP =====
        {
            id: 'demo-11',
            title: 'Startup Ecosystem Flourishes: New Unicorns Emerge Every 2 Weeks',
            sourceName: 'Forbes',
            summary: 'Global startup landscape transforms with 1,200+ companies now valued at $1 billion or more. India and Southeast Asia emerge as innovation hotspots alongside traditional Silicon Valley. Younger founders focus on AI, sustainability, and fintech disruption.',
            url: 'https://www.forbes.com/',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
            readMinutes: 7,
            domains: ['finance', 'technology'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 8,
            validationStatus: 'verified'
        },
        {
            id: 'demo-12',
            title: 'Women Entrepreneurs Secure Record Funding: 2025 a Landmark Year',
            sourceName: 'TechFemme',
            summary: 'Female-founded startups receive 17% of venture funding, doubling year-over-year. Women entrepreneur cohorts report exceptional company valuations and successful exits. Industry experts credit improved investor awareness and dedicated funding mechanisms.',
            url: 'https://www.techfemme.com/',
            imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?w=500&h=300&fit=crop',
            publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
            readMinutes: 5,
            domains: ['finance', 'marketing'],
            apiSource: 'Demo',
            linkValid: true,
            isGenerated: false,
            credibilityScore: 8,
            validationStatus: 'verified'
        }
    ];
}

function fallbackArticles() {
    return getDemoArticles();
}

export async function getDailyBriefing() {
    const now = Date.now();

    // Use demo content directly instead of calling APIs
    // This provides stable, demo data for development
    if (!cachedArticles) {
        cachedArticles = getDemoArticles();
    }

    lastFetchedAt = now;
    return cachedArticles;
}

// Enhanced functions with link verification and AI integration
export async function getDailyBriefingWithVerification() {
    const articles = await getDailyBriefing();

    // Verify links in batches to avoid overwhelming the services
    const batchSize = 5;
    const enhancedArticles = [];

    for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);

        // Verify links for this batch
        const linkResults = await verifyMultipleLinks(batch.map(a => a.url));

        // Process each article in the batch
        for (let j = 0; j < batch.length; j++) {
            const article = {...batch[j] };
            const linkResult = linkResults[j];

            article.linkValid = linkResult?.isValid || false;
            article.validationStatus = article.linkValid ? 'verified' : 'failed';

            // If link is broken and Gemini is available, try to generate alternative content
            if (!article.linkValid && geminiService.isConfigured) {
                try {
                    const alternativeContent = await geminiService.generateAlternativeContent(article, 'link_broken');
                    article.title = alternativeContent.title;
                    article.summary = alternativeContent.summary;
                    article.isGenerated = true;
                    article.alternativeSources = alternativeContent.alternativeSources;
                    article.disclaimer = alternativeContent.disclaimer;
                    article.credibilityScore = alternativeContent.confidence * 10;
                } catch (error) {
                    console.error('Failed to generate alternative content:', error);
                    article.disclaimer = 'Original source unavailable';
                }
            }

            // Validate article with Gemini if available and not already generated
            if (geminiService.isConfigured && !article.isGenerated) {
                try {
                    const validation = await geminiService.validateNewsArticle(article);
                    article.credibilityScore = validation.credibilityScore;
                    article.validationStatus = validation.recommendation;

                    // Enhance summary if validation is positive
                    if (validation.recommendation === 'approve') {
                        const enhancedSummary = await geminiService.enhanceArticleSummary(article);
                        if (enhancedSummary && enhancedSummary !== article.summary) {
                            article.summary = enhancedSummary;
                        }
                    }
                } catch (error) {
                    console.error('Article validation failed:', error);
                    // Keep original article if validation fails
                }
            }

            enhancedArticles.push(article);
        }

        // Add small delay between batches to be respectful to external services
        if (i + batchSize < articles.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return enhancedArticles;
}

export async function generateAIQuiz(articles) {
    if (!geminiService.isConfigured) {
        return null;
    }

    try {
        const quizData = await geminiService.generateQuizQuestions(articles);
        return quizData;
    } catch (error) {
        console.error('AI quiz generation failed:', error);
        return null;
    }
}

export function getArticleStats(articles) {
    const stats = {
        total: articles.length,
        verified: articles.filter(a => a.linkValid === true).length,
        failed: articles.filter(a => a.linkValid === false).length,
        generated: articles.filter(a => a.isGenerated === true).length,
        avgCredibility: 0,
        domainDistribution: {},
        apiDistribution: {},
        sources: Array.from(new Set(articles.map(a => a.sourceName))).length
    };

    // Calculate average credibility score
    const articlesWithScores = articles.filter(a => a.credibilityScore);
    if (articlesWithScores.length > 0) {
        stats.avgCredibility = articlesWithScores.reduce((sum, a) => sum + a.credibilityScore, 0) / articlesWithScores.length;
    }

    // Calculate domain distribution
    articles.forEach(article => {
        article.domains.forEach(domain => {
            stats.domainDistribution[domain] = (stats.domainDistribution[domain] || 0) + 1;
        });

        // API source distribution
        const apiSource = article.apiSource || 'Unknown';
        stats.apiDistribution[apiSource] = (stats.apiDistribution[apiSource] || 0) + 1;
    });

    return stats;
}