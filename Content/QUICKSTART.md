# Quick Start Configuration

## Fastest Way to Get BizAI Running

### Option 1: Run Immediately (No Configuration)
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```
✅ Works with sample data
✅ Women in Business shows sample videos
✅ Sustainability page loads
✅ News feed shows fallback articles

---

## Option 2: Add News APIs (Recommended - 5 minutes)

### Get Free API Keys
1. **NewsAPI.org** (https://newsapi.org)
   - Sign up (free tier: 100 req/day)
   - Copy API key

2. **GNews API** (https://gnews.io)
   - Sign up (free tier: 600 req/month)
   - Copy API key

3. **NewsData.io** (https://newsdata.io)
   - Sign up (free tier: 200 req/day)
   - Copy API key

4. **TheNewsAPI** (https://thenewsapi.com)
   - Sign up (free tier)
   - Copy API key

### Create `.env` File
```bash
cd backend
# Create file named .env
```

Add this content:
```
PORT=4000
NEWSAPI_KEY=your_key_here
GNEWS_API_KEY=your_key_here
NEWSDATA_API_KEY=your_key_here
THENEWSAPI_KEY=your_key_here
NODE_ENV=development
```

### Restart Backend
```bash
npm run dev
```

✅ Live news feed now loads

---

## Option 3: Add YouTube Videos (5 more minutes)

### Get YouTube API Key
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable "YouTube Data API v3"
4. Create API key (Credentials tab)
5. Copy the key

### Update `.env`
Add this line:
```
YOUTUBE_API_KEY=your_youtube_key_here
```

### Restart Backend
```bash
npm run dev
```

✅ Real YouTube videos now load in:
  - Women in Business page
  - Sustainability page
  - Video search functionality

---

## Option 4: Add Database (Optional - 10 minutes)

### Setup Firebase
1. Go to https://console.firebase.google.com
2. Create New Project
3. Select "Realtime Database"
4. Choose "Start in test mode" (easy for development)
5. Go to Project Settings → Service Accounts
6. Click "Generate New Private Key"
7. Copy the entire JSON content

### Update `.env`
Add these lines:
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...paste entire JSON...}
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### Restart Backend
```bash
npm run dev
```

✅ Articles can now be saved
✅ User preferences stored
✅ Leaderboard tracks scores
✅ Quiz results persisted

---

## Option 5: Add Gemini AI (Optional - 2 minutes)

### Get Gemini API Key
1. Go to https://aistudio.google.com
2. Sign in with Google
3. Click "Get API Key"
4. Create key

### Update `.env`
Add this line:
```
GEMINI_API_KEY=your_gemini_key_here
```

### Restart Backend
```bash
npm run dev
```

✅ AI Insights page now shows real analysis
✅ Article validation powered by AI
✅ Smart content generation

---

## Verify Everything Works

### Check Health Endpoint
```bash
curl http://localhost:4000/api/health
```

Should show:
```json
{
  "status": "ok",
  "services": {
    "gemini": true/false,
    "firebase": true/false,
    "newsApis": {...},
    "youtubeApi": true/false,
    "totalConfiguredApis": 0-5
  }
}
```

### Test Video Endpoints
```bash
# Women in Business Videos
curl http://localhost:4000/api/videos/women-in-business

# Sustainability Videos
curl http://localhost:4000/api/videos/sustainability
```

### Test News Feed
```bash
curl http://localhost:4000/api/news/daily-briefing
```

---

## Troubleshooting

### "npm not found"
- Install Node.js from https://nodejs.org

### "Port 4000 already in use"
```bash
# Change in backend/.env
PORT=5000
```

### "Cannot find module 'firebase-admin'"
```bash
cd backend
npm install
```

### Videos showing sample data
- YouTube API key not configured
- Check .env file
- Restart backend after adding key

### News showing fallback articles
- News API keys not configured
- Check .env file
- Check API quotas on each service
- Restart backend

### Database not saving
- Firebase not configured
- Check FIREBASE_SERVICE_ACCOUNT in .env
- Verify Firebase project is created
- Check database rules in Firebase console

### Gemini not working
- API key not configured
- Check GEMINI_API_KEY in .env
- Verify key is valid on https://aistudio.google.com
- Restart backend

---

## File Locations

### Configuration File
```
/backend/.env
```

### Backend Code
```
/backend/src/server.js              - Main API
/backend/src/services/
  - newsService.js
  - videoService.js
  - firebaseService.js
  - geminiService.js
```

### Frontend Code
```
/frontend/src/pages/
  - WomenInBusinessPage.jsx
  - SustainabilityPage.jsx
/frontend/src/components/
  - Sidebar.jsx
```

### Documentation
```
/SETUP_GUIDE.md          - Detailed setup
/FEATURES.md             - All features explained
/QUICKSTART.md           - This file
```

---

## Common Commands

### Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Check if running
- Backend: http://localhost:4000/api/health
- Frontend: http://localhost:5173

### View Logs
- Backend: Terminal where npm run dev is running
- Frontend: Browser DevTools (F12)

### Clear Cache
```bash
# Backend
curl -X DELETE http://localhost:4000/api/verify/cache
```

---

## Next Steps

1. ✅ Choose which APIs to configure
2. ✅ Get API keys from providers
3. ✅ Create .env file in /backend
4. ✅ Restart backend
5. ✅ Test on http://localhost:5173
6. ✅ Read FEATURES.md for all capabilities

---

## Support Links

- **NewsAPI**: https://newsapi.org/docs
- **GNews**: https://gnews.io/docs
- **NewsData.io**: https://newsdata.io/docs
- **YouTube API**: https://developers.google.com/youtube/v3
- **Firebase**: https://firebase.google.com/docs
- **Gemini AI**: https://ai.google.dev/tutorials/rest_quickstart

---

**You're all set! 🎉**

Start with Option 1 (no config), then add more features as needed.
