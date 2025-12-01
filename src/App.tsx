import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RewardPage from './pages/RewardPage';
import SettingsPage from './pages/SettingsPage';
import GiftHistoryPage from './pages/GiftHistoryPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import './App.css';

// 통계 페이지는 recharts를 사용하므로 코드 스플리팅 적용
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));

// 로딩 컴포넌트
const LoadingFallback: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    로딩 중...
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rewards" element={<RewardPage />} />
          <Route path="/gift-history" element={<GiftHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route 
            path="/statistics" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <StatisticsPage />
              </Suspense>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PWAInstallPrompt />
      </div>
    </Router>
  );
};

export default App;

