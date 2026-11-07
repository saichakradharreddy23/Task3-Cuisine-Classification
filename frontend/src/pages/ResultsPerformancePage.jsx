import React, { useState, useEffect } from 'react';
import { 
  History, 
  Download, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { fetchModelMetrics, fetchModelComparison } from '../services/api';

export default function ResultsPerformancePage({ predictionHistory = [] }) {
  const [metrics, setMetrics] = useState(null);
  const [comparison, setComparison] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortCol, setSortCol] = useState('support'); // 'name', 'precision', 'recall', 'f1', 'support'
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetchModelMetrics().then(res => setMetrics(res)).catch(err => console.error(err));
    fetchModelComparison().then(res => setComparison(res.models || [])).catch(err => console.error(err));
  }, []);

  const perCuisine = metrics?.detailed_report?.per_cuisine || {};
  const perCuisineList = Object.entries(perCuisine).map(([name, data]) => ({
    name,
    precision: data.precision,
    recall: data.recall,
    f1: data['f1-score'],
    support: data.support
  }));

  const filteredCuisines = perCuisineList.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const sortedCuisines = [...filteredCuisines].sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleDownloadReport = () => {
    if (!metrics) return;
    const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'classification_report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadComparison = () => {
    if (!comparison.length) return;
    const blob = new Blob([JSON.stringify(comparison, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model_comparison.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-[#F5F5F5] transition-colors duration-500 pb-20" style={{ backgroundColor: '#17191E' }}>
      
      {/* HEADER */}
      <div className="border-b border-[#272C33] py-14 relative overflow-hidden" style={{ backgroundColor: '#272C33' }}>
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#FF9252]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17191E] border border-[#FF9252]/40 text-xs font-semibold text-[#FFD1A8] mb-3">
            <History className="w-3.5 h-3.5 text-[#FF9252]" />
            <span>Audit & Verification Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Results, History & <span className="text-[#FF9252]">Performance</span>
          </h1>

          <p className="text-base sm:text-lg text-[#F5F5F5]/80 mt-2 max-w-2xl font-light">
            Review live inference sessions, audit per-cuisine classification metrics, and download raw machine learning evaluation artifacts.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17191E] hover:bg-[#303640] border border-[#FF9252]/40 text-xs font-semibold text-white transition-all shadow"
            >
              <Download className="w-3.5 h-3.5 text-[#FF9252]" />
              <span>Export Classification Report (JSON)</span>
            </button>

            <button
              onClick={handleDownloadComparison}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17191E] hover:bg-[#303640] border border-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#FFD1A8]" />
              <span>Export Model Comparison (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        
        {/* RECENT SESSION PREDICTIONS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#303640] border border-[#FF9252]/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#272C33] flex items-center justify-center border border-[#FF9252]/30">
                <Clock className="w-4 h-4 text-[#FF9252]" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Live Session Prediction History</h3>
            </div>
            <span className="text-xs text-[#F5F5F5]/60">
              {predictionHistory.length} query recorded this session
            </span>
          </div>

          {predictionHistory.length > 0 ? (
            <div className="space-y-3">
              {predictionHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#17191E] border border-[#FF9252]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#FFD1A8] font-mono">{item.timestamp}</span>
                      <span className="text-xs text-white/50">•</span>
                      <span className="text-xs text-white font-semibold">{item.input.City}</span>
                      <span className="text-xs text-white/50">•</span>
                      <span className="text-xs text-white/70">Cost ₹{item.input.Average_Cost_for_two}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#F5F5F5]/60">Predicted Cuisines:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.result.predicted_cuisines.map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded-md bg-[#272C33] text-[11px] font-bold text-[#FF9252] border border-[#FF9252]/30">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-[#272C33] text-xs font-mono text-[#FFD1A8] border border-white/10 shrink-0">
                    Primary: {item.result.primary_cuisine}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#F5F5F5]/50">
              No live predictions made yet. Try navigating to <strong>Predict Cuisine</strong> and submit a test restaurant.
            </div>
          )}
        </div>

        {/* DETAILED CUISINE-WISE PERFORMANCE TABLE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#303640] border border-[#FF9252]/20 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Per-Cuisine Performance Classification Report
              </h3>
              <p className="text-xs text-[#F5F5F5]/60 mt-1">
                Actual precision, recall, and F1 scores measured on 1,827 unseen test records.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#FFD1A8]/60" />
              <input
                type="text"
                placeholder="Filter by cuisine..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#17191E] border border-[#FF9252]/30 text-white text-xs outline-none focus:border-[#FF9252]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#272C33] text-[#FFD1A8] uppercase tracking-wider">
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => { setSortCol('name'); setSortAsc(!sortAsc); }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Cuisine Category</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => { setSortCol('f1'); setSortAsc(!sortAsc); }}
                  >
                    <div className="flex items-center gap-1">
                      <span>F1-Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => { setSortCol('precision'); setSortAsc(!sortAsc); }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Precision</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => { setSortCol('recall'); setSortAsc(!sortAsc); }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Recall</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => { setSortCol('support'); setSortAsc(!sortAsc); }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Test Support</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272C33]">
                {sortedCuisines.map((c) => (
                  <tr key={c.name} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                    <td className="py-3 px-4 text-[#FF9252] font-mono font-bold">
                      {c.f1.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 font-mono">{c.precision.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono">{c.recall.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono text-[#F5F5F5]/70">{c.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
