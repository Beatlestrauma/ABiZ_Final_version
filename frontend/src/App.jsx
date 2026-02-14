import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import './splash-theme.css';
import TopBar from './components/TopBar.jsx';
import Footer from './components/Footer.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import LoginForm from './components/LoginForm.jsx';
import MobileNavBar from './components/MobileNavBar.jsx';
import DailyBriefingPage from './pages/DailyBriefingPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import MarketPage from './pages/MarketPage.jsx';
import AIInsightsPage from './pages/AIInsightsPage.jsx';
import SustainabilityPage from './pages/SustainabilityPage.jsx';
import WomenInBusinessPage from './pages/WomenInBusinessPage.jsx';
import PodcastsPage from './pages/PodcastsPage.jsx';
import EntrepreneursPage from './pages/EntrepreneursPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import GamesPage from './pages/GamesPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PlacementIntelligencePage from './pages/PlacementIntelligencePage.jsx';
import InterviewRepositoryPage from './pages/InterviewRepositoryPage.jsx';
import { NewsProvider } from './context/NewsContext.jsx';
import { SavedArticlesProvider } from './context/SavedArticlesContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DeviceProvider, useDevice } from './context/DeviceContext.jsx';
import { ReadingTimeProvider } from './context/ReadingTimeContext.jsx';

const PAGES = {
  home: 'home',
  library: 'library',
  saved: 'saved',
  market: 'market',
  ai: 'ai',
  podcasts: 'podcasts',
  women: 'women',
  entrepreneurs: 'entrepreneurs',
  sustainability: 'sustainability',
  quiz: 'quiz',
  games: 'games',
  leaderboard: 'leaderboard',
  profile: 'profile',
  placement: 'placement',
  interviews: 'interviews'
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(PAGES.home);
  const [showSplash, setShowSplash] = useState(true);
  const [dailyBriefingDomain, setDailyBriefingDomain] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds – was 6.5s; shorten so app appears sooner

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.home:
        return <DailyBriefingPage selectedDomain={dailyBriefingDomain} setSelectedDomain={setDailyBriefingDomain} />;
      case PAGES.library:
        return <LibraryPage />;
      case PAGES.saved:
        return <SavedPage />;
      case PAGES.market:
        return <MarketPage />;
      case PAGES.ai:
        return <AIInsightsPage />;
      case PAGES.podcasts:
        return <PodcastsPage />;
      case PAGES.women:
        return <WomenInBusinessPage />;
      case PAGES.entrepreneurs:
        return <EntrepreneursPage />;
      case PAGES.sustainability:
        return <SustainabilityPage />;
      case PAGES.quiz:
        return <QuizPage />;
      case PAGES.games:
        return <GamesPage />;
      case PAGES.leaderboard:
        return <LeaderboardPage />;
      case PAGES.profile:
        return <ProfilePage />;
      case PAGES.placement:
        return <PlacementIntelligencePage />;
      case PAGES.interviews:
        return <InterviewRepositoryPage />;
      default:
        return <DailyBriefingPage />;
    }
  };

  const { isMobile, isTablet, isDesktop } = useDevice();

  // Compute main content class based on device
  // Compute main content class based on device
  const mainWrapperClass = isMobile
    ? 'flex flex-1 flex-col min-w-0'
    : isTablet
      ? 'flex flex-1 flex-col min-w-0 tablet-main' // Keeps tablet logic
      : 'flex flex-1 flex-col min-w-0 ml-64 transition-all duration-300'; // Standard desktop margin

  return (
    <NewsProvider>
      <SavedArticlesProvider>
        <ReadingTimeProvider>
          <div className="flex min-h-screen w-full bg-transparent">
            {/* Desktop: full sidebar, Tablet: collapsible sidebar, Mobile: no sidebar */}
            {!isMobile && <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isTablet={isTablet} />}
            <div className={`${mainWrapperClass} animate-fadeIn`}>
              <TopBar currentPage={currentPage} selectedDomain={dailyBriefingDomain} setSelectedDomain={setDailyBriefingDomain} />
              <main className={`w-full flex-1 ${isMobile ? 'px-4 pt-4 pb-24' : 'px-8 py-8 w-full max-w-7xl mx-auto'}`}>
                {renderPage()}
              </main>
              {!isMobile && <Footer />}
            </div>
            {/* Mobile: bottom navigation bar */}
            <MobileNavBar currentPage={currentPage} onNavigate={setCurrentPage} />
          </div>
        </ReadingTimeProvider>
      </SavedArticlesProvider>
    </NewsProvider>
  );
}

export default function App() {
  return (
    <DeviceProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DeviceProvider>
  );
}

