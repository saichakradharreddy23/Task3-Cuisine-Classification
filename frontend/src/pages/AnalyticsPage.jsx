import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Database, 
  Cpu, 
  Layers, 
  PieChart, 
  ArrowUpRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { fetchModelMetrics, fetchModelComparison, fetchDatasetInfo } from '../services/api';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(null);
  const [comparison, setComparison] = useState([]);
  const [dataInfo, setDataInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('comparison'); // 'comparison', 'per_cuisine', 'visuals'

  useEffect(() => {
    fetchModelMetrics().then(res => setMetrics(res)).catch(err => console.error(err));
    fetchModelComparison().then(res => setComparison(res.models || [])).catch(err => console.error(err));
    fetchDatasetInfo().then(res => setDataInfo(res)).catch(err => console.error(err));
  }, []);

  const bestMetrics = metrics?.metrics || {
    micro_f1: 0.2778,
    macro_f1: 0.2271,
    hamming_loss: 0.2898,
    subset_accuracy: 0.0246,
    micro_precision: 0.2312,
    micro_recall: 0.3478
  };

  const perCuisine = metrics?.detailed_report?.per_cuisine || {};
  const perCuisineList = Object.entries(perCuisine).map(([name, data]) => ({
    name,
    ...data
  })).sort((a, b) => b.f1_score - a.f1_score);

  return (
    <div className="min-h-screen text-[#E9F8FF] transition-colors duration-500 pb-20" style={{ backgroundColor: '#071F35' }}>
      
      {/* HEADER */}
      <div className="border-b border-[#103653] py-12 relative overflow-hidden" style={{ backgroundColor: '#103653' }}>
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#41C8F5]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071F35] border border-[#41C8F5]/40 text-xs font-semibold text-[#82E6FF] mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-[#41C8F5]" />
            <span>Actual Machine Learning Evaluation Reports</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Model <span className="text-[#41C8F5]">Analytics & Metrics</span>
          </h1>

          <p className="text-base sm:text-lg text-[#E9F8FF]/80 mt-2 max-w-2xl font-light">
            Transparent empirical evaluation of models trained on the real restaurant dataset. All metrics derived strictly from the test set split.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center gap-2">
            {[
              { id: 'comparison', label: 'Model Benchmarking' },
              { id: 'per_cuisine', label: 'Per-Cuisine Breakdown' },
              { id: 'visuals', label: 'Generated Report Visualizations' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#41C8F5] text-[#071F35] shadow-lg shadow-[#41C8F5]/30'
                    : 'bg-[#071F35] text-[#E9F8FF]/70 hover:text-white border border-[#41C8F5]/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* CORE KPI CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="p-4 rounded-2xl bg-[#164768] border border-[#41C8F5]/30 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#82E6FF] font-semibold block">Total Records</span>
            <div className="text-2xl font-bold text-white mt-1">9,551</div>
            <span className="text-[10px] text-[#E9F8FF]/60">9,542 cleaned</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#164768] border border-[#41C8F5]/30 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#82E6FF] font-semibold block">Train / Test Split</span>
            <div className="text-2xl font-bold text-white mt-1">7,308 / 1,827</div>
            <span className="text-[10px] text-[#E9F8FF]/60">80% / 20% holdout</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#164768] border border-[#41C8F5]/30 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#82E6FF] font-semibold block">Best Model</span>
            <div className="text-lg font-bold text-white mt-1 truncate">OneVsRest LR</div>
            <span className="text-[10px] text-[#41C8F5]">Balanced weights</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#164768] border border-[#41C8F5]/30 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#82E6FF] font-semibold block">Micro-F1 Score</span>
            <div className="text-2xl font-bold text-[#41C8F5] mt-1">
              {(bestMetrics.micro_f1 || 0.2778).toFixed(4)}
            </div>
            <span className="text-[10px] text-[#E9F8FF]/60">Multi-label aggregated</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#164768] border border-[#41C8F5]/30 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#82E6FF] font-semibold block">Macro-F1 Score</span>
            <div className="text-2xl font-bold text-[#82E6FF] mt-1">
              {(bestMetrics.macro_f1 || 0.2271).toFixed(4)}
            </div>
            <span className="text-[10px] text-[#E9F8FF]/60">Unweighted across classes</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#164768] border border-[#41C8F5]/30 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#82E6FF] font-semibold block">Hamming Loss</span>
            <div className="text-2xl font-bold text-white mt-1">
              {(bestMetrics.hamming_loss || 0.2898).toFixed(4)}
            </div>
            <span className="text-[10px] text-[#E9F8FF]/60">Label error rate</span>
          </div>

        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* TAB 1: MODEL BENCHMARKING */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            
            {/* Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#164768] border border-[#41C8F5]/20 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Multi-Label Algorithm Comparison Table
                  </h3>
                  <p className="text-xs text-[#E9F8FF]/60 mt-1">
                    Evaluated on 1,827 test records with the exact same train-test split.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#071F35] border border-[#41C8F5]/40 text-xs font-semibold text-[#41C8F5]">
                  4 Algorithms Evaluated
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#103653] text-[#82E6FF] uppercase tracking-wider">
                    <th className="py-3 px-4">Classification Model</th>
                    <th className="py-3 px-4">Micro F1</th>
                    <th className="py-3 px-4">Macro F1</th>
                    <th className="py-3 px-4">Micro Precision</th>
                    <th className="py-3 px-4">Micro Recall</th>
                    <th className="py-3 px-4">Hamming Loss</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#103653]/60">
                  {comparison.map((m) => {
                    const isBest = m.model_name === metrics?.best_model_name;
                    return (
                      <tr 
                        key={m.model_name}
                        className={`transition-colors ${isBest ? 'bg-[#41C8F5]/10 font-bold' : 'hover:bg-white/5'}`}
                      >
                        <td className="py-4 px-4 text-white flex items-center gap-2">
                          {isBest && <Award className="w-4 h-4 text-[#41C8F5]" />}
                          <span>{m.model_name}</span>
                        </td>
                        <td className="py-4 px-4 text-[#41C8F5] font-mono">{m.micro_f1.toFixed(4)}</td>
                        <td className="py-4 px-4 text-[#82E6FF] font-mono">{m.macro_f1.toFixed(4)}</td>
                        <td className="py-4 px-4 font-mono">{m.micro_precision.toFixed(4)}</td>
                        <td className="py-4 px-4 font-mono">{m.micro_recall.toFixed(4)}</td>
                        <td className="py-4 px-4 font-mono">{m.hamming_loss.toFixed(4)}</td>
                        <td className="py-4 px-4">
                          {isBest ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#41C8F5] text-[#071F35] text-[10px] font-black uppercase">
                              Best Model
                            </span>
                          ) : (
                            <span className="text-[#E9F8FF]/50 text-[11px]">Benchmark</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Metric Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-3xl bg-[#164768] border border-[#41C8F5]/20">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#41C8F5]" />
                  <span>Macro-F1 (Balances Class Imbalance)</span>
                </h4>
                <div className="space-y-4">
                  {comparison.map(m => (
                    <div key={m.model_name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white">{m.model_name}</span>
                        <span className="text-[#41C8F5] font-mono font-bold">{(m.macro_f1 * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#071F35] overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#103653] to-[#41C8F5]"
                          style={{ width: `${Math.max(4, m.macro_f1 * 100 * 3.5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#164768] border border-[#41C8F5]/20">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#82E6FF]" />
                  <span>Hamming Loss (Lower Is Better)</span>
                </h4>
                <div className="space-y-4">
                  {comparison.map(m => (
                    <div key={m.model_name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white">{m.model_name}</span>
                        <span className="text-[#82E6FF] font-mono font-bold">{m.hamming_loss.toFixed(4)}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#071F35] overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#41C8F5] to-emerald-400"
                          style={{ width: `${Math.max(10, m.hamming_loss * 250)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Single Label vs Multi Label Note */}
            <div className="p-6 rounded-3xl bg-[#103653] border border-[#41C8F5]/30">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Single-Label Primary Cuisine Benchmark Comparison
              </h4>
              <p className="text-xs text-[#E9F8FF]/80 leading-relaxed">
                When trained strictly on the primary cuisine (top 10 categories), a single-label Random Forest achieves <strong>31.98% accuracy</strong> and a <strong>macro-F1 of 0.2289</strong>. While single-label simplifies evaluation, it fails to capture the 64.4% of restaurants that serve complementary cuisines (e.g. Italian + Cafe + Desserts). The multi-label OneVsRest architecture predicts complete restaurant cuisine profiles simultaneously.
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: PER-CUISINE BREAKDOWN */}
        {activeTab === 'per_cuisine' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#164768] border border-[#41C8F5]/20 shadow-xl">
            <h3 className="text-xl font-bold text-white font-display mb-2">
              Per-Cuisine Precision, Recall, and F1 Breakdown
            </h3>
            <p className="text-xs text-[#E9F8FF]/60 mb-6">
              Empirical metrics for each of the 25 modeled cuisines on unseen test data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perCuisineList.map(c => (
                <div key={c.name} className="p-4 rounded-2xl bg-[#071F35] border border-[#41C8F5]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-sm">{c.name}</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {c.support} test samples
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/10 text-center">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#E9F8FF]/50 block">F1-Score</span>
                      <strong className="text-xs text-[#41C8F5] font-mono">{c['f1-score'].toFixed(3)}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#E9F8FF]/50 block">Precision</span>
                      <strong className="text-xs text-white font-mono">{c.precision.toFixed(3)}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#E9F8FF]/50 block">Recall</span>
                      <strong className="text-xs text-white font-mono">{c.recall.toFixed(3)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GENERATED VISUALS */}
        {activeTab === 'visuals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="p-6 rounded-3xl bg-[#164768] border border-[#41C8F5]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Top Cuisines Distribution</h4>
                <a href="/reports/cuisine_distribution.png" target="_blank" rel="noreferrer" className="text-xs text-[#41C8F5] flex items-center gap-1 hover:underline">
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#41C8F5]/20 bg-[#071F35]">
                <img src="/reports/cuisine_distribution.png" alt="Cuisine Distribution" className="w-full object-cover" />
              </div>
              <p className="text-xs text-[#E9F8FF]/60">
                Visual representation of restaurant count across popular cuisines in the restaurant dataset.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#164768] border border-[#41C8F5]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Model Comparison Metrics</h4>
                <a href="/reports/model_comparison.png" target="_blank" rel="noreferrer" className="text-xs text-[#41C8F5] flex items-center gap-1 hover:underline">
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#41C8F5]/20 bg-[#071F35]">
                <img src="/reports/model_comparison.png" alt="Model Comparison" className="w-full object-cover" />
              </div>
              <p className="text-xs text-[#E9F8FF]/60">
                Side-by-side comparison of F1-scores and Hamming losses across all tested models.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#164768] border border-[#41C8F5]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Per-Cuisine Performance</h4>
                <a href="/reports/cuisine_performance.png" target="_blank" rel="noreferrer" className="text-xs text-[#41C8F5] flex items-center gap-1 hover:underline">
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#41C8F5]/20 bg-[#071F35]">
                <img src="/reports/cuisine_performance.png" alt="Per Cuisine Performance" className="w-full object-cover" />
              </div>
              <p className="text-xs text-[#E9F8FF]/60">
                Precision, recall, and F1 scores charted across top individual restaurant cuisine tags.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#164768] border border-[#41C8F5]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Primary Cuisine Confusion Matrix</h4>
                <a href="/reports/confusion_matrix.png" target="_blank" rel="noreferrer" className="text-xs text-[#41C8F5] flex items-center gap-1 hover:underline">
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#41C8F5]/20 bg-[#071F35]">
                <img src="/reports/confusion_matrix.png" alt="Confusion Matrix" className="w-full object-cover" />
              </div>
              <p className="text-xs text-[#E9F8FF]/60">
                Heatmap of true vs predicted classes for single-label primary cuisine benchmarking.
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
