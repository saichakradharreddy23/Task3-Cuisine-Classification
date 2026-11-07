import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CuisineExplorerPage from './pages/CuisineExplorerPage';
import PredictionPage from './pages/PredictionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MethodologyPage from './pages/MethodologyPage';
import ResultsPerformancePage from './pages/ResultsPerformancePage';

const THEME_COLORS = {
  home: '#F08A4B',
  explorer: '#43D6A0',
  prediction: '#B69CFF',
  analytics: '#41C8F5',
  methodology: '#F1B85B',
  results: '#FF9252',
};

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [predictionHistory, setPredictionHistory] = useState([]);

  const handlePredictionMade = (item) => {
    setPredictionHistory(prev => [item, ...prev].slice(0, 20));
  };

  const currentColor = THEME_COLORS[activePage] || '#F08A4B';

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
        {activePage === 'explorer' && <CuisineExplorerPage setActivePage={setActivePage} />}
        {activePage === 'prediction' && <PredictionPage onPredictionMade={handlePredictionMade} />}
        {activePage === 'analytics' && <AnalyticsPage />}
        {activePage === 'methodology' && <MethodologyPage />}
        {activePage === 'results' && <ResultsPerformancePage predictionHistory={predictionHistory} />}
      </main>

      <Footer activeColor={currentColor} setActivePage={setActivePage} />
    </div>
  );
}
