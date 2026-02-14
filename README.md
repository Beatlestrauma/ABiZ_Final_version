# BizAI - Premium Business Intelligence Platform

> **V1.2 Premium Update**: Now featuring a complete visual overhaul with Glassmorphism, tailored mobile experience, and intelligent data aggregation.

A comprehensive full-stack business intelligence application designed for students and professionals. BizAI integrates real-time news, video learning, and market data into a cohesive, premium SaaS-style interface.

## ✨ New in V1.2: Premium UI Transformation
- **Glassmorphism Design**: Modern, translucent panels with soft shadows and depth.
- **Slate & Rose Theme**: A sophisticated neutral palette with vibrant coral accents (#ff5e5b).
- **Mobile-First Experience**: 
  - Redesigned bottom navigation with "More" sheet.
  - iPhone X+ Safe Area support.
  - Touch-optimized interactive elements.
- **Visual Hierarchy**: Editorial-grade typography (`Playfair Display` + `Inter`) and "lifted" card interactions.

## 🚀 Key Features

### 📊 Intelligence Dashboard
- **Daily Briefing**: Curated business news from 10+ major sources.
- **AI Insights**: Real-time market sentiment analysis and trend predictions.
- **Market Data**: Live tracking of major indices and crypto markets.
- **Sustainability Tracking**: Personal and corporate ESG impact scores.

### 📚 Learning & Career
- **Video Library**: Dedicated sections for "Women in Business" and "Sustainability".
- **Career Intel**: Placement resources and interview repository.
- **Interactive Quizzes**: AI-generated daily challenges to test business acumen.
- **Gamification**: Earn points, climb the leaderboard, and unlock achievements.

### 🛠 Tech Stack

**Frontend**
- **React 18** + Vite (Fast HMR)
- **Tailwind CSS** (Custom "Premium" Config)
- **Framer Motion** (Smooth transitions)
- **Recharts** (Data visualization)

**Backend**
- **Node.js** + Express
- **Firebase Admin** (Real-time database)
- **Google Gemini AI** (Content validation & generation)
- **RSS Parser** (Multi-source aggregation)

**Mobile**
- **Capacitor** (Native Android runtime)
- **Responsive Web Design** (Tablet/Desktop adaptive)

## 📂 Project Structure

```
BizAI/
├── frontend/         # React Application (Vite)
│   ├── src/
│   │   ├── components/  # UI Components (Sidebar, Cards)
│   │   ├── pages/       # Route Views (Dashboard, Profile)
│   │   └── context/     # React Context (Auth, News, Device)
│   └── tailwind.config.js # Design System Configuration
│
├── backend/          # Node.js API Server
│   ├── routes/          # API Endpoints
│   └── services/        # AI, DB, and RSS Logic
│
└── android/          # Native Android Project (Capacitor)
```

## 🏎️ Quick Start

### 1. Prerequisites
- Node.js 18+ installed.
- (Optional) Google Gemini API Key for AI features.

### 2. Setup Backend
```bash
cd backend
npm install
# Create .env file (optional, defaults provided for dev)
npm run dev
```
_Server runs on http://localhost:4000_

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
_App runs on http://localhost:5173_

### 4. Credentials
- **Student Login**: `cb.sc.u4aie24001` (Password is same as username)
- **Guest Access**: Available without login for limited features.

## 🔧 Configuration

### Environment Variables (.env)
Create a `.env` file in `backend/` to enable full features:
```env
PORT=4000
GEMINI_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
FIREBASE_SERVICE_ACCOUNT=path/to/service-account.json
```

## 📱 Mobile Development
To run on Android emulator or device:
```bash
cd frontend
npm run build
npx cap sync
npx cap open android
```

## 📄 License
© 2026 BizAI Team. Built for educational excellence.