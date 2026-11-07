import React from 'react';
import { UtensilsCrossed, Github, Award, Database, Cpu } from 'lucide-react';

export default function Footer({ activeColor = '#F08A4B', setActivePage }) {
  return (
    <footer className="border-t border-white/10 bg-black/40 text-white/70 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${activeColor}20`, border: `1px solid ${activeColor}50` }}
            >
              <UtensilsCrossed className="w-5 h-5" style={{ color: activeColor }} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              CuisinePulse
            </span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Production-grade restaurant cuisine intelligence and multi-label machine learning platform built for Restaurant Cuisine Classification Task 3.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform Pages</h4>
          <ul className="space-y-2 text-sm">
            {['home', 'explorer', 'prediction', 'analytics', 'methodology', 'results'].map(page => (
              <li key={page}>
                <button 
                  onClick={() => setActivePage(page)}
                  className="hover:text-white capitalize transition-colors"
                >
                  {page === 'explorer' ? 'Cuisine Explorer' : page === 'prediction' ? 'Cuisine Predictor' : page}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Technology</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Scikit-Learn (OneVsRest & Multi-Output)</span>
            </li>
            <li className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Pandas & NumPy Preprocessing</span>
            </li>
            <li className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>FastAPI REST Backend</span>
            </li>
            <li className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-purple-400" />
              <span>React 18 + Vite + Tailwind CSS</span>
            </li>
          </ul>
        </div>

        {/* Dataset Note */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Dataset Integrity</h4>
          <p className="text-xs text-white/50 leading-relaxed mb-3">
            Trained and benchmarked on the original 9,551 restaurant records from the restaurant dataset. Real evaluation metrics without fabrication.
          </p>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
            Target: 25 Multi-label Cuisines | 54 Engineered Features
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40">
        <p>© 2026 CuisinePulse AI. Restaurant Cuisine Classification Task 3.</p>
        <p className="mt-2 sm:mt-0">Single-label & Multi-label Architecture Enabled</p>
      </div>
    </footer>
  );
}
