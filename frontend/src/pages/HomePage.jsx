import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  Search, 
  Star, 
  MapPin, 
  DollarSign, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Utensils,
  Layers
} from 'lucide-react';
import { fetchDatasetInfo, fetchCuisines } from '../services/api';

export default function HomePage({ setActivePage }) {
  const [dataInfo, setDataInfo] = useState(null);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [popularCuisines, setPopularCuisines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDatasetInfo().then(res => {
      setDataInfo(res.summary);
      if (res.sample_restaurants) {
        setFeaturedRestaurants(res.sample_restaurants);
      }
    }).catch(err => console.error("Error loading dataset info:", err));

    fetchCuisines().then(res => {
      if (res.cuisines) {
        setPopularCuisines(res.cuisines.slice(0, 8));
      }
    }).catch(err => console.error("Error loading cuisines:", err));
  }, []);

  const filteredFeatured = featuredRestaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisines.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-[#FFF1E6] transition-colors duration-500" style={{ backgroundColor: '#21130F' }}>
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden pt-12 pb-24 border-b border-[#382019]">
        {/* Decorative glow gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F08A4B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#FFC078]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#382019] border border-[#F08A4B]/40 text-xs font-semibold text-[#FFC078] tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 text-[#F08A4B]" />
              <span>Machine Learning Task 3 • Production Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-white">
              Discover the Taste. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F08A4B] via-[#FFC078] to-[#F08A4B]">
                Understand the Cuisine.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#FFF1E6]/80 leading-relaxed font-light">
              An intelligent machine learning platform that explores restaurant data and predicts cuisine categories based on operational and dining characteristics.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActivePage('prediction')}
                className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#F08A4B] to-[#FF9252] shadow-lg shadow-[#F08A4B]/30 hover:shadow-[#F08A4B]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Sparkles className="w-5 h-5" />
                <span>Predict Cuisine Now</span>
              </button>

              <button
                onClick={() => setActivePage('explorer')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-[#FFF1E6] bg-[#382019] border border-[#F08A4B]/40 hover:bg-[#472A20] hover:border-[#FFC078] transition-all duration-200"
              >
                <Compass className="w-5 h-5 text-[#FFC078]" />
                <span>Explore Cuisines</span>
              </button>

              <button
                onClick={() => setActivePage('analytics')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-[#FFF1E6] bg-[#382019]/60 hover:bg-[#382019] border border-white/10 transition-all duration-200"
              >
                <TrendingUp className="w-5 h-5 text-[#F08A4B]" />
                <span>Model Analytics</span>
              </button>
            </div>

            {/* Interactive Search Bar */}
            <div className="pt-6 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#FFC078]/70" />
                <input
                  type="text"
                  placeholder="Search dataset restaurants by name, cuisine, or city (e.g., 'Japanese', 'Delhi', 'Bakery')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#382019]/90 border border-[#F08A4B]/30 focus:border-[#F08A4B] focus:ring-2 focus:ring-[#F08A4B]/20 text-[#FFF1E6] placeholder-[#FFF1E6]/40 text-sm outline-none transition-all shadow-inner"
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* DATASET METRICS COUNTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#472A20] border border-[#F08A4B]/30 shadow-xl backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-[#FFC078] font-semibold block mb-1">
              Dataset Records
            </span>
            <div className="text-3xl font-extrabold text-white font-display">
              {dataInfo?.total_restaurants ? dataInfo.total_restaurants.toLocaleString() : '9,551'}
            </div>
            <p className="text-xs text-[#FFF1E6]/60 mt-1">Real restaurant dataset records</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#472A20] border border-[#F08A4B]/30 shadow-xl backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-[#FFC078] font-semibold block mb-1">
              Distinct Cuisines
            </span>
            <div className="text-3xl font-extrabold text-white font-display">
              145
            </div>
            <p className="text-xs text-[#FFF1E6]/60 mt-1">Top 25 modeled with MultiLabel</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#472A20] border border-[#F08A4B]/30 shadow-xl backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-[#FFC078] font-semibold block mb-1">
              Cities Covered
            </span>
            <div className="text-3xl font-extrabold text-white font-display">
              {dataInfo?.cities_count || 141}
            </div>
            <p className="text-xs text-[#FFF1E6]/60 mt-1">Across 15 countries worldwide</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#472A20] border border-[#F08A4B]/30 shadow-xl backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-[#FFC078] font-semibold block mb-1">
              Multi-label Structure
            </span>
            <div className="text-3xl font-extrabold text-white font-display">
              64.4%
            </div>
            <p className="text-xs text-[#FFF1E6]/60 mt-1">Restaurants serve multi-cuisines</p>
          </div>

        </div>
      </div>

      {/* POPULAR CUISINE TAGS SHOWCASE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#FFC078] font-semibold mb-2">
              <Utensils className="w-3.5 h-3.5 text-[#F08A4B]" />
              <span>Cuisine Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Frequently Modeled Cuisines
            </h2>
          </div>
          <button
            onClick={() => setActivePage('explorer')}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-semibold text-[#F08A4B] hover:text-[#FFC078] transition-colors"
          >
            <span>View all 25 categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {popularCuisines.map((c, i) => (
            <div 
              key={c.name}
              onClick={() => setActivePage('explorer')}
              className="p-4 rounded-xl bg-[#382019] border border-[#F08A4B]/20 hover:border-[#F08A4B] hover:scale-105 cursor-pointer transition-all duration-200 group text-center"
            >
              <div className="text-2xl mb-2">
                {['🍛', '🥢', '🍔', '🥘', '🍕', '🥐', '🍝', '☕'][i % 8]}
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#FFC078] truncate">
                {c.name}
              </h4>
              <span className="text-[10px] text-[#FFF1E6]/50 block mt-1">
                {c.support ? `${c.support} records` : 'Dataset Core'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED RESTAURANTS FROM ACTUAL DATASET */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#FFC078] font-semibold mb-2">
              <Award className="w-3.5 h-3.5 text-[#F08A4B]" />
              <span>Real Dataset Records</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Featured High-Rated Restaurants
            </h2>
            <p className="text-sm text-[#FFF1E6]/60 mt-1">
              Top rated records straight from <code className="text-[#FFC078]">Dataset .csv</code> without synthetic data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFeatured.slice(0, 6).map(r => (
            <div 
              key={r.id}
              className="p-6 rounded-2xl bg-[#472A20] border border-[#F08A4B]/20 hover:border-[#F08A4B]/60 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FFC078] transition-colors line-clamp-1">
                    {r.name}
                  </h3>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    <span>{r.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#FFF1E6]/70 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#F08A4B] shrink-0" />
                  <span className="truncate">{r.locality}, {r.city}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#382019] border border-[#F08A4B]/10 mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#FFC078]/80 font-semibold block mb-1">
                    Cuisine Label:
                  </span>
                  <p className="text-xs text-white font-medium line-clamp-2">
                    {r.cuisines}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#382019] flex items-center justify-between text-xs text-[#FFF1E6]/70">
                <span>Cost: <strong className="text-white">{r.currency} {r.cost.toLocaleString()}</strong></span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {r.votes} votes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY MULTI-LABEL MATTERS HIGHLIGHT CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#382019] to-[#472A20] border border-[#F08A4B]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#F08A4B]/5 rounded-full blur-2xl" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21130F] border border-[#F08A4B]/40 text-xs font-semibold text-[#FFC078]">
              <Layers className="w-3.5 h-3.5 text-[#F08A4B]" />
              <span>Methodological Transparency</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Why We Formulated This as a Multi-Label ML Problem
            </h3>

            <p className="text-sm sm:text-base text-[#FFF1E6]/80 leading-relaxed font-light">
              In the real restaurant dataset, <strong>64.4% of restaurants</strong> list two or more distinct cuisines (e.g. <em>"North Indian, Mughlai, Chinese"</em>). Treating this dataset as a traditional single-label problem discards vital cuisine tags and produces misleading accuracy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#21130F]/60 border border-[#F08A4B]/20">
                <CheckCircle2 className="w-5 h-5 text-[#F08A4B] mb-2" />
                <h5 className="text-sm font-semibold text-white">MultiLabelBinarizer</h5>
                <p className="text-xs text-[#FFF1E6]/60 mt-1">Converts comma-separated tags into binary multi-target vectors.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#21130F]/60 border border-[#F08A4B]/20">
                <CheckCircle2 className="w-5 h-5 text-[#F08A4B] mb-2" />
                <h5 className="text-sm font-semibold text-white">One-Vs-Rest Architecture</h5>
                <p className="text-xs text-[#FFF1E6]/60 mt-1">Trains independent binary estimators with class-balanced weighting.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#21130F]/60 border border-[#F08A4B]/20">
                <CheckCircle2 className="w-5 h-5 text-[#F08A4B] mb-2" />
                <h5 className="text-sm font-semibold text-white">Zero Target Leakage</h5>
                <p className="text-xs text-[#FFF1E6]/60 mt-1">Features strictly rely on operational data like price, rating, city, and cost.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setActivePage('methodology')}
                className="flex items-center gap-2 text-sm font-semibold text-[#FFC078] hover:text-white transition-colors"
              >
                <span>Read complete ML methodology</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
