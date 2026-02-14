# BizAI Production Deployment Guide

This guide covers deploying BizAI to production with all enhanced features including AI integration and link verification.

## 🚀 Pre-Deployment Checklist

### Required API Keys
- [ ] **NewsAPI Key** - Get from [newsapi.org](https://newsapi.org/)
- [ ] **Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Process manager (PM2 recommended)
- [ ] Reverse proxy (Nginx recommended)
- [ ] SSL certificate for HTTPS

## 🔧 Backend Deployment

### 1. Environment Configuration

Create production `.env` file:
```bash
cd backend
cp .env.example .env
```

Configure environment variables:
```env
# Required
NODE_ENV=production
PORT=4000

# API Keys (at least one recommended)
NEWSAPI_KEY=623eb06c35904e54bfcdac6d7c3bfad5
GEMINI_API_KEY=AIzaSyCx_sGxqETDFme4BALsH5hzmFpqw1UfJU4

# Environmental metrics
ECO_PAPERS_BASE=12847
ECO_CO2_PER_PAPER=200

# Optional: Custom cache settings
CACHE_DURATION_MS=300000
LINK_CACHE_DURATION_MS=1800000
```

### 2. Install Dependencies
```bash
npm ci --production
```

### 3. Process Management with PM2
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'bizai-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings for AI operations
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Frontend static files
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 🎨 Frontend Deployment

### 1. Build for Production
```bash
cd frontend
npm ci
npm run build
```

### 2. Configure Build Output
The build creates a `dist/` directory with optimized static files.

### 3. Environment Variables (Optional)
Create `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_APP_VERSION=1.0.0
```

## 🔍 Health Monitoring

### 1. API Health Checks
```bash
# Basic health check
curl https://your-domain.com/api/health

# Enhanced health check with service status
curl https://your-domain.com/api/health | jq
```

### 2. PM2 Monitoring
```bash
# View process status
pm2 status

# View logs
pm2 logs bizai-backend

# Monitor resources
pm2 monit
```

### 3. Log Rotation
```bash
# Install PM2 log rotate
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## 🛡️ Security Hardening

### 1. Firewall Configuration
```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 2. Rate Limiting (Nginx)
```nginx
# Add to nginx.conf http block
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Add to server block
location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ... other proxy settings
}
```

### 3. Environment Security
```bash
# Secure .env file
chmod 600 backend/.env
chown app:app backend/.env
```

## 📊 Performance Optimization

### 1. Backend Optimizations
- Enable gzip compression in Nginx
- Configure proper cache headers
- Use connection pooling for external APIs
- Implement request rate limiting

### 2. Frontend Optimizations
- Enable asset compression
- Configure CDN for static assets
- Implement service worker for caching
- Use lazy loading for components

### 3. Database Preparation (Future)
```sql
-- When adding database support
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_quiz_scores_user_date ON quiz_scores(user_id, created_at);
```

## 🔄 Deployment Automation

### 1. Deployment Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Deploying BizAI..."

# Backend deployment
cd backend
git pull origin main
npm ci --production
pm2 reload bizai-backend

# Frontend deployment
cd ../frontend
npm ci
npm run build
rsync -av --delete dist/ /var/www/bizai/

echo "✅ Deployment completed!"
```

### 2. GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Deploy to server
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## 🧪 Testing in Production

### 1. Smoke Tests
```bash
# Run the test script
cd backend
node test-api.js
```

### 2. Load Testing
```bash
# Install artillery
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'https://your-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/health"
      - get:
          url: "/api/news/daily-briefing"
      - get:
          url: "/api/quiz/daily"
EOF

# Run load test
artillery run load-test.yml
```

## 📈 Monitoring & Alerts

### 1. Application Monitoring
- Set up error tracking (Sentry, Bugsnag)
- Monitor API response times
- Track AI service usage and costs
- Monitor link verification success rates

### 2. Infrastructure Monitoring
- Server resource usage (CPU, Memory, Disk)
- Network connectivity
- SSL certificate expiration
- Database performance (when added)

### 3. Business Metrics
- Daily active users
- Quiz completion rates
- Article engagement
- Environmental impact metrics

## 🔧 Troubleshooting

### Common Issues

1. **API Keys Not Working**
   - Verify keys in `.env` file
   - Check API quotas and limits
   - Ensure proper environment loading

2. **High Memory Usage**
   - Monitor cache sizes
   - Implement cache cleanup
   - Consider Redis for distributed caching

3. **Slow Response Times**
   - Check external API latency
   - Optimize database queries
   - Implement proper caching

4. **AI Service Failures**
   - Verify Gemini API key and quotas
   - Check network connectivity
   - Ensure fallback mechanisms work

### Log Analysis
```bash
# View recent errors
pm2 logs bizai-backend --lines 100 | grep ERROR

# Monitor real-time logs
pm2 logs bizai-backend --follow

# Check Nginx access logs
tail -f /var/log/nginx/access.log
```

## 📋 Post-Deployment Checklist

- [ ] All API endpoints responding correctly
- [ ] Frontend loading and navigating properly
- [ ] Authentication system working
- [ ] AI features functioning (if configured)
- [ ] Link verification working
- [ ] Error handling and fallbacks tested
- [ ] Monitoring and alerts configured
- [ ] SSL certificate valid and auto-renewing
- [ ] Backup procedures in place
- [ ] Documentation updated

---

**🎉 Congratulations! Your BizAI application is now running in production with all enhanced features including AI integration and bulletproof error handling.**