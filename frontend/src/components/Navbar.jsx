import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Compass, 
  Sparkles, 
  BarChart3, 
  BookOpen, 
  History, 
  Activity, 
  Menu, 
  X 
} from 'lucide-react';
import { fetchHealth } from '../services/api';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: UtensilsCrossed, themeColor: '#F08A4B' },
  { id: 'explorer', label: 'Cuisine Explorer', icon: Compass, themeColor: '#43D6A0' },
  { id: 'prediction', label: 'Predict Cuisine', icon: Sparkles, themeColor: '#B69CFF' },
  { id: 'analytics', label: 'Model Analytics', icon: BarChart3, themeColor: '#41C8F5' },
  { id: 'methodology', label: 'Methodology', icon: BookOpen, themeColor: '#F1B85B' },
  { id: 'results', label: 'Results & History', icon: History, themeColor: '#FF9252' },
];

export default function Navbar({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState({ online: false, model: 'Loading...' });

  useEffect(() => {
    fetchHealth()
      .then(res => {
        setApiStatus({
          online: res.status === 'online',
          model: res.best_model || 'OneVsRest LR'
        });
      })
      .catch(() => {
        setApiStatus({ online: false, model: 'Offline' });
      });
  }, []);

  const activeItem = NAV_ITEMS.find(item => item.id === activePage) || NAV_ITEMS[0];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{ 
                backgroundColor: `${activeItem.themeColor}20`,
                border: `1px solid ${activeItem.themeColor}60`
              }}
            >
              <UtensilsCrossed className="w-6 h-6 transition-transform group-hover:rotate-12" style={{ color: activeItem.themeColor }} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-display block">
                Cuisine<span style={{ color: activeItem.themeColor }}>Pulse</span>
              </span>
              <span className="text-xs uppercase tracking-wider text-white/50 block font-medium">
                Machine Learning Platform • Task 3
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${item.themeColor}25` : 'transparent',
                    border: isActive ? `1px solid ${item.themeColor}80` : '1px solid transparent'
                  }}
                >
                  <Icon 
                    className="w-4 h-4 transition-transform group-hover:scale-110" 
                    style={{ color: isActive ? item.themeColor : 'currentColor' }} 
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
              <span className={`w-2 h-2 rounded-full ${apiStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
              <span>{apiStatus.online ? `ML: ${apiStatus.model}` : 'Connecting...'}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/90 border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
                style={{
                  backgroundColor: isActive ? `${item.themeColor}30` : 'transparent',
                  borderLeft: isActive ? `4px solid ${item.themeColor}` : 'none'
                }}
              >
                <Icon className="w-5 h-5" style={{ color: isActive ? item.themeColor : 'currentColor' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
