# BizAI Setup Guide - Video & Database Features

## Overview
This guide covers the new video features and database integration added to BizAI.

## New Features Added

### 1. Women in Business Section
- **Location**: Sidebar navigation
- **Features**:
  - Video library for women entrepreneurs
  - Search functionality
  - Video player with YouTube integration
  - View count and publish date information
  - Pink-themed UI with empowerment messaging

### 2. Enhanced Sustainability Page
- **New Features**:
  - Embedded sustainability education videos
  - Green-themed video section
  - Video search and filter
  - Modal player for full-screen viewing

### 3. Video Management Service
- Supports YouTube API integration
- Fallback to sample videos when API unavailable
- Caching for optimal performance
- Video categorization (women-in-business, sustainability)

### 4. Firebase Database Integration
- User preferences storage
- Article saving and retrieval
- Quiz results tracking
- Leaderboard data
- Video metadata storage

## Setup Instructions

### Step 1: Install Dependencies

**Backend**:
```bash
cd backend
npm install
```

**Frontend**:
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` folder with the following:

```env
PORT=4000
NODE_ENV=development

# News APIs (get from newsapi.org, gnews.io, newsdata.io, thenewsapi.com)
NEWSAPI_KEY=your_key
GNEWS_API_KEY=your_key
NEWSDATA_API_KEY=your_key
THENEWSAPI_KEY=your_key

# Gemini AI (optional, get from https://aistudio.google.com)
GEMINI_API_KEY=your_key

# YouTube API (get from https://developers.google.com/youtube/v3)
YOUTUBE_API_KEY=your_key

# Firebase (optional, for real database)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

### Step 3: Start the Application

**Backend**:
```bash
cd backend
npm run dev
```

**Frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```

### Step 4: Access the Application

Open `http://localhost:5173` in your browser (Vite default port).

## API Endpoints

### Video Endpoints
```
GET /api/videos/women-in-business       - Get women in business videos
GET /api/videos/sustainability          - Get sustainability videos
GET /api/videos/featured               - Get featured videos across categories
GET /api/videos/search?q=query         - Search videos
```

### Database Endpoints
```
POST /api/db/save-article              - Save article to database
GET /api/db/articles                   - Get all saved articles
POST /api/db/user-preference           - Save user preference
GET /api/db/user-preference/:userId    - Get user preferences
POST /api/db/quiz-result               - Save quiz result
GET /api/db/leaderboard               - Get leaderboard scores
```

## Free Database Setup (Recommended)

### Option 1: Firebase Realtime Database (FREE TIER)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Realtime Database
4. Set security rules to:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
5. Download service account JSON
6. Add to `.env` as `FIREBASE_SERVICE_ACCOUNT`

### Option 2: Supabase (FREE TIER)
Alternative PostgreSQL solution with same functionality.

### Option 3: Local Storage (No Setup)
If you don't configure Firebase, the app uses in-memory storage. Data persists only during the session.

## YouTube Integration

### Getting YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create an API key
5. Add to `.env` as `YOUTUBE_API_KEY`

### Rate Limits
- YouTube API: 10,000 units/day (free)
- Each video search: ~100-150 units
- Fallback videos load automatically if API unavailable

## Video Features

### Women in Business Videos
- Search by title and description
- Filter by category
- Modal player with full details
- View counts and publication dates
- Channel attribution

### Sustainability Videos
- Green-themed interface
- Environmental impact information
- Expert resources
- Carbon footprint tracking integration

## Database Features

### Saved Articles
```javascript
POST /api/db/save-article
{
  "article": {
    "id": "unique-id",
    "title": "Article Title",
    "url": "https://...",
    "imageUrl": "https://...",
    "summary": "..."
  }
}
```

### User Preferences
```javascript
POST /api/db/user-preference
{
  "userId": "user123",
  "preference": {
    "theme": "dark",
    "categories": ["technology", "sustainability"]
  }
}
```

### Leaderboard
```javascript
GET /api/db/leaderboard?limit=100
```

## Troubleshooting

### Videos Not Loading
- Check if `YOUTUBE_API_KEY` is configured
- Falls back to sample videos automatically
- Check browser console for CORS errors

### Database Connection Issues
- Verify Firebase credentials in `.env`
- Check Firebase project security rules
- App works with in-memory storage as fallback

### News Feed Crashing
- Check API keys for news sources
- Falls back to sample articles
- Monitor backend logs for errors

## Performance Tips

### Caching
- Videos cached for 24 hours
- News articles cached for 30 minutes
- Links verified once and cached

### Optimization
- Images served with lazy loading
- Videos embedded via YouTube (no downloads)
- Database queries paginated

## Next Steps

1. **Configure API Keys**: Start with free API tiers
2. **Test Videos**: Try Women in Business and Sustainability sections
3. **Setup Database**: Optional but recommended for production
4. **Customize Content**: Edit sample videos in `videoService.js`

## Support

For issues:
1. Check `.env` configuration
2. Review backend console logs
3. Check browser dev console
4. Verify API quotas/limits
