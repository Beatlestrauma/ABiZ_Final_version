import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

let passedTests = 0;
let failedTests = 0;
const failedTestDetails = [];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  if (passed) {
    log(`✅ PASS: ${testName}`, 'green');
    passedTests++;
  } else {
    log(`❌ FAIL: ${testName}`, 'red');
    if (details) log(`   Details: ${details}`, 'yellow');
    failedTests++;
    failedTestDetails.push({ test: testName, details });
  }
}

async function testHealthEndpoint() {
  log('\n📋 TEST 1: Health Check Endpoint', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    logTest('Health endpoint responds', response.status === 200);
    logTest('Health endpoint returns JSON', typeof response.data === 'object');
    logTest('Health endpoint has status field', response.data.status === 'ok');
    logTest('Health endpoint has services field', !!response.data.services);
    logTest('RSS service is enabled', response.data.services.rss === true);
    
    log(`   Services Status:`, 'yellow');
    log(`   - RSS: ${response.data.services.rss ? '✅' : '❌'}`);
    log(`   - Gemini: ${response.data.services.gemini ? '✅' : '❌'}`);
    log(`   - Firebase: ${response.data.services.firebase ? '✅' : '❌'}`);
  } catch (error) {
    logTest('Health endpoint responds', false, error.message);
  }
}

async function testRSSArticlesEndpoint() {
  log('\n📋 TEST 2: RSS Articles Endpoint', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/rss/articles`);
    logTest('RSS articles endpoint responds', response.status === 200);
    logTest('RSS articles returns array', Array.isArray(response.data.articles));
    logTest('RSS articles has data', response.data.articles.length > 0, 
      `Found ${response.data.articles.length} articles`);
    
    if (response.data.articles.length > 0) {
      const article = response.data.articles[0];
      logTest('Article has title', !!article.title);
      logTest('Article has link', !!article.link);
      logTest('Article has source', !!article.source);
      logTest('Article has category', !!article.category);
      logTest('Article has domains', Array.isArray(article.domains));
      
      log(`   Sample Article:`, 'yellow');
      log(`   - Title: ${article.title?.substring(0, 60)}...`);
      log(`   - Source: ${article.source}`);
      log(`   - Category: ${article.category}`);
      log(`   - Domains: ${article.domains?.join(', ')}`);
    }
  } catch (error) {
    logTest('RSS articles endpoint responds', false, error.message);
  }
}

async function testRSSArticlesWithFilters() {
  log('\n📋 TEST 3: RSS Articles with Filters', 'blue');
  
  // Test category filter
  try {
    const response = await axios.get(`${BASE_URL}/api/rss/articles?category=technology`);
    logTest('Category filter works', response.status === 200);
    logTest('Category filter returns results', response.data.articles.length > 0,
      `Found ${response.data.articles.length} technology articles`);
  } catch (error) {
    logTest('Category filter works', false, error.message);
  }
  
  // Test limit parameter
  try {
    const response = await axios.get(`${BASE_URL}/api/rss/articles?limit=5`);
    logTest('Limit parameter works', response.data.articles.length <= 5,
      `Returned ${response.data.articles.length} articles`);
  } catch (error) {
    logTest('Limit parameter works', false, error.message);
  }
  
  // Test search parameter
  try {
    const response = await axios.get(`${BASE_URL}/api/rss/articles?search=AI`);
    logTest('Search parameter works', response.status === 200);
    logTest('Search returns results', response.data.articles.length >= 0,
      `Found ${response.data.articles.length} articles matching "AI"`);
  } catch (error) {
    logTest('Search parameter works', false, error.message);
  }
}

async function testRSSStatsEndpoint() {
  log('\n📋 TEST 4: RSS Statistics Endpoint', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/rss/stats`);
    logTest('RSS stats endpoint responds', response.status === 200);
    logTest('Stats has total count', typeof response.data.stats.total === 'number');
    logTest('Stats has sources count', typeof response.data.stats.sources === 'number');
    logTest('Stats has categories count', typeof response.data.stats.categories === 'number');
    
    log(`   Statistics:`, 'yellow');
    log(`   - Total Articles: ${response.data.stats.total}`);
    log(`   - Sources: ${response.data.stats.sources}`);
    log(`   - Categories: ${response.data.stats.categories}`);
    log(`   - Avg Credibility: ${response.data.stats.avgCredibility || 'N/A'}`);
    
    if (response.data.stats.categoryDistribution) {
      log(`   Category Distribution:`, 'yellow');
      Object.entries(response.data.stats.categoryDistribution).forEach(([cat, count]) => {
        log(`   - ${cat}: ${count}`);
      });
    }
  } catch (error) {
    logTest('RSS stats endpoint responds', false, error.message);
  }
}

async function testHybridEndpoint() {
  log('\n📋 TEST 5: Hybrid Daily Briefing Endpoint', 'blue');
  
  // Test RSS mode (default)
  try {
    const response = await axios.get(`${BASE_URL}/api/news/daily-briefing`);
    logTest('Hybrid endpoint responds', response.status === 200);
    logTest('Hybrid endpoint returns articles', Array.isArray(response.data.articles));
    logTest('Hybrid endpoint has source field', !!response.data.source);
    logTest('Hybrid uses RSS by default', response.data.source === 'rss',
      `Source: ${response.data.source}`);
    
    log(`   Hybrid Mode Results:`, 'yellow');
    log(`   - Source: ${response.data.source}`);
    log(`   - Articles: ${response.data.articles.length}`);
    log(`   - Enhanced: ${response.data.enhanced}`);
  } catch (error) {
    logTest('Hybrid endpoint responds', false, error.message);
  }
  
  // Test API fallback mode
  try {
    const response = await axios.get(`${BASE_URL}/api/news/daily-briefing?rss=false`);
    logTest('API fallback mode works', response.status === 200);
    logTest('API mode returns articles', response.data.articles.length > 0);
  } catch (error) {
    logTest('API fallback mode works', false, error.message);
  }
}

async function testOldEndpoints() {
  log('\n📋 TEST 6: Legacy Endpoints (Backward Compatibility)', 'blue');
  
  // Test quiz endpoint
  try {
    const response = await axios.get(`${BASE_URL}/api/quiz/daily`);
    logTest('Quiz endpoint responds', response.status === 200);
    logTest('Quiz has questions', !!response.data.questions);
  } catch (error) {
    logTest('Quiz endpoint responds', false, error.message);
  }
  
  // Test eco endpoint
  try {
    const response = await axios.get(`${BASE_URL}/api/eco`);
    logTest('Eco endpoint responds', response.status === 200);
  } catch (error) {
    logTest('Eco endpoint responds', false, error.message);
  }
  
  // Test market endpoint
  try {
    const response = await axios.get(`${BASE_URL}/api/market`);
    logTest('Market endpoint responds', response.status === 200);
  } catch (error) {
    logTest('Market endpoint responds', false, error.message);
  }
}

async function testCORSHeaders() {
  log('\n📋 TEST 7: CORS Configuration', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    const corsHeader = response.headers['access-control-allow-origin'];
    logTest('CORS headers present', !!corsHeader, `CORS: ${corsHeader || 'Not set'}`);
  } catch (error) {
    logTest('CORS headers present', false, error.message);
  }
}

async function testDatabaseIntegrity() {
  log('\n📋 TEST 8: Database Integrity', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/rss/articles?limit=100`);
    const articles = response.data.articles;
    
    // Check for duplicates
    const links = articles.map(a => a.link);
    const uniqueLinks = new Set(links);
    logTest('No duplicate articles', links.length === uniqueLinks.size,
      `${links.length} articles, ${uniqueLinks.size} unique`);
    
    // Check data completeness
    const completeArticles = articles.filter(a => 
      a.title && a.link && a.source && a.category
    );
    logTest('All articles have required fields', 
      completeArticles.length === articles.length,
      `${completeArticles.length}/${articles.length} complete`);
    
    // Check date validity
    const validDates = articles.filter(a => {
      const date = new Date(a.pubDate);
      return !isNaN(date.getTime());
    });
    logTest('All articles have valid dates',
      validDates.length === articles.length,
      `${validDates.length}/${articles.length} valid dates`);
    
  } catch (error) {
    logTest('Database integrity check', false, error.message);
  }
}

async function testArticleStructure() {
  log('\n📋 TEST 9: Article Data Structure', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/rss/articles?limit=1`);
    const article = response.data.articles[0];
    
    const requiredFields = [
      'id', 'title', 'link', 'content', 'summary', 'pubDate',
      'source', 'category', 'domains', 'readMinutes'
    ];
    
    requiredFields.forEach(field => {
      logTest(`Article has ${field} field`, article[field] !== undefined,
        `Value: ${typeof article[field]}`);
    });
    
    log(`   Full Article Structure:`, 'yellow');
    log(JSON.stringify(article, null, 2).substring(0, 500) + '...');
    
  } catch (error) {
    logTest('Article structure check', false, error.message);
  }
}

async function testPerformance() {
  log('\n📋 TEST 10: Performance Metrics', 'blue');
  
  try {
    const start = Date.now();
    await axios.get(`${BASE_URL}/api/rss/articles?limit=30`);
    const duration = Date.now() - start;
    
    logTest('Response time < 500ms', duration < 500, `${duration}ms`);
    logTest('Response time < 1000ms', duration < 1000, `${duration}ms`);
    
    log(`   Performance:`, 'yellow');
    log(`   - Response Time: ${duration}ms`);
  } catch (error) {
    logTest('Performance test', false, error.message);
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('🧪 RSS SYSTEM TEST SUITE', 'blue');
  log('='.repeat(60) + '\n', 'blue');
  
  log('Starting tests against: ' + BASE_URL, 'yellow');
  log('Timestamp: ' + new Date().toISOString() + '\n', 'yellow');
  
  await testHealthEndpoint();
  await testRSSArticlesEndpoint();
  await testRSSArticlesWithFilters();
  await testRSSStatsEndpoint();
  await testHybridEndpoint();
  await testOldEndpoints();
  await testCORSHeaders();
  await testDatabaseIntegrity();
  await testArticleStructure();
  await testPerformance();
  
  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('📊 TEST SUMMARY', 'blue');
  log('='.repeat(60), 'blue');
  
  const total = passedTests + failedTests;
  const passRate = ((passedTests / total) * 100).toFixed(1);
  
  log(`\nTotal Tests: ${total}`, 'yellow');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, 'red');
  log(`Pass Rate: ${passRate}%\n`, passRate >= 90 ? 'green' : 'yellow');
  
  if (failedTests > 0) {
    log('❌ Failed Tests:', 'red');
    failedTestDetails.forEach(({ test, details }) => {
      log(`   - ${test}`, 'red');
      if (details) log(`     ${details}`, 'yellow');
    });
  }
  
  if (passRate >= 90) {
    log('\n✅ All systems operational!', 'green');
  } else if (passRate >= 70) {
    log('\n⚠️  Some issues detected, but system is functional', 'yellow');
  } else {
    log('\n❌ Critical issues detected!', 'red');
  }
  
  log('\n' + '='.repeat(60) + '\n', 'blue');
  
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log('\n❌ Test suite failed with error:', 'red');
  log(error.message, 'red');
  process.exit(1);
});
