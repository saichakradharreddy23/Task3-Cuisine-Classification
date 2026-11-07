import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Utensils, 
  Sparkles, 
  BarChart, 
  Flame, 
  Layers, 
  TrendingUp,
  Tag,
  ArrowRight
} from 'lucide-react';
import { fetchCuisines } from '../services/api';

const CUISINE_DETAILS = {
  'North Indian': { icon: '🍛', origin: 'Indian Subcontinent', desc: 'Rich curries, tandoori preparations, naan breads, and aromatic spices.' },
  'Chinese': { icon: '🥢', origin: 'East Asia', desc: 'Wok-tossed noodles, dumplings, fried rice, and savory soy-garlic sauces.' },
  'Fast Food': { icon: '🍔', origin: 'Global', desc: 'Quick-service burgers, fries, wraps, and casual finger food items.' },
  'Mughlai': { icon: '🥘', origin: 'Mughal Empire', desc: 'Royal aromatics, saffron gravies, kormas, biryanis, and slow-cooked meats.' },
  'Italian': { icon: '🍕', origin: 'Mediterranean Europe', desc: 'Artisanal pizzas, pasta dishes, olive oil, basil, and aged cheeses.' },
  'Bakery': { icon: '🥐', origin: 'European / Artisanal', desc: 'Fresh oven breads, pastries, croissants, cakes, and gourmet confectioneries.' },
  'Continental': { icon: '🍝', origin: 'European Continental', desc: 'Grilled proteins, herb-roasted vegetables, steaks, and creamy pastas.' },
  'Cafe': { icon: '☕', origin: 'Modern Urban', desc: 'Espresso beverages, artisanal sandwiches, breakfast bowls, and casual bites.' },
  'Desserts': { icon: '🍰', origin: 'Global Confectionery', desc: 'Sweet treats, cheesecakes, puddings, mousses, and artisan desserts.' },
  'South Indian': { icon: '🥞', origin: 'Southern India', desc: 'Fermented crepes (dosas), steamed idlis, spicy sambar, and coconut chutneys.' },
  'Street Food': { icon: '🍢', origin: 'Local Markets', desc: 'Chaat, golgappas, kathi rolls, and fast savory regional roadside snacks.' },
  'American': { icon: '🥩', origin: 'North America', desc: 'Barbecue ribs, steakhouse cuts, gourmet burgers, buffalo wings, and shakes.' },
  'Pizza': { icon: '🍕', origin: 'Italian / Global', desc: 'Stone-baked thin crust and deep dish pies with assorted cheeses and toppings.' },
  'Mithai': { icon: '🍬', origin: 'Traditional Indian', desc: 'Traditional sweets made with condensed milk, ghee, cardamom, and nuts.' },
  'Burger': { icon: '🍔', origin: 'American Fast Casual', desc: 'Smash patties, brioche buns, craft toppings, and savory signature sauces.' },
  'Thai': { icon: '🍲', origin: 'Southeast Asia', desc: 'Fragrant lemongrass curries, pad thai, spicy-sour broths, and fresh herbs.' },
  'Asian': { icon: '🍱', origin: 'Pan-Asian', desc: 'Bao buns, dim sum, sushi rolls, ramen bowls, and fusion wok specialties.' },
  'Beverages': { icon: '🧃', origin: 'Beverage Bars', desc: 'Fresh pressed juices, mocktails, iced blends, artisanal teas, and coolers.' },
  'Ice Cream': { icon: '🍨', origin: 'Frozen Desserts', desc: 'Handcrafted gelatos, sundaes, ice cream scoops, and frozen sorbets.' },
  'Mexican': { icon: '🌮', origin: 'Central America', desc: 'Tacos, quesadillas, burritos, fresh guacamole, jalapeños, and salsa.' },
  'Biryani': { icon: '🍚', origin: 'Hyderabadi / Awadhi', desc: 'Fragrant layered basmati rice infused with whole spices and tender cuts.' },
  'Seafood': { icon: '🦐', origin: 'Coastal Global', desc: 'Catch-of-the-day fish, prawns, calamari, crabs, and lemon-butter preparations.' },
  'Healthy Food': { icon: '🥗', origin: 'Wellness & Fitness', desc: 'Superfood salads, grain bowls, grilled lean proteins, and organic greens.' },
  'European': { icon: '🧀', origin: 'Western Europe', desc: 'Fondue, charcuterie boards, classic stews, and delicate French/Swiss plates.' },
  'Japanese': { icon: '🍣', origin: 'Japan', desc: 'Fresh nigiri, sashimi, tempura, tonkotsu ramen, and delicate umami flavors.' }
};

export default function CuisineExplorerPage({ setActivePage }) {
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('support'); // 'support', 'alpha', 'f1'
  const [filterTier, setFilterTier] = useState('all'); // 'all', 'high', 'medium', 'specialized'

  useEffect(() => {
    fetchCuisines()
      .then(res => {
        setCuisines(res.cuisines || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cuisines:', err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredCuisines = cuisines.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTier === 'high') return c.support >= 500;
    if (filterTier === 'medium') return c.support >= 150 && c.support < 500;
    if (filterTier === 'specialized') return c.support < 150;
    return true;
  });

  // Sort logic
  const sortedCuisines = [...filteredCuisines].sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name);
    if (sortBy === 'f1') return (b.f1_score || 0) - (a.f1_score || 0);
    return (b.support || 0) - (a.support || 0);
  });

  return (
    <div className="min-h-screen text-[#E9FFF4] transition-colors duration-500 pb-20" style={{ backgroundColor: '#092D27' }}>
      
      {/* HEADER */}
      <div className="border-b border-[#12463B] py-14 relative overflow-hidden" style={{ backgroundColor: '#12463B' }}>
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#43D6A0]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#092D27] border border-[#43D6A0]/40 text-xs font-semibold text-[#B7F7D0] mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#43D6A0]" />
            <span>Dataset Cuisines Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Cuisine <span className="text-[#43D6A0]">Explorer</span>
          </h1>

          <p className="text-base sm:text-lg text-[#E9FFF4]/80 mt-2 max-w-2xl font-light">
            Browse all 25 machine learning target cuisines extracted directly from the restaurant dataset, with per-category representation and performance metrics.
          </p>

          {/* Search and Controls */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#B7F7D0]/60" />
              <input
                type="text"
                placeholder="Search cuisine (e.g., 'Italian', 'Japanese')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#092D27] border border-[#43D6A0]/30 focus:border-[#43D6A0] text-[#E9FFF4] placeholder-[#E9FFF4]/40 text-sm outline-none"
              />
            </div>

            {/* Filter and Sort Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl bg-[#092D27] p-1 border border-[#43D6A0]/30 text-xs">
                {['all', 'high', 'medium', 'specialized'].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      filterTier === tier ? 'bg-[#43D6A0] text-black font-bold shadow' : 'text-[#E9FFF4]/70 hover:text-white'
                    }`}
                  >
                    {tier === 'all' ? 'All (25)' : tier === 'high' ? 'High (>500)' : tier === 'medium' ? 'Medium' : 'Specialized'}
                  </button>
                ))}
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#092D27] border border-[#43D6A0]/30 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#43D6A0]" />
                <span className="text-[#E9FFF4]/60">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[#B7F7D0] font-semibold outline-none cursor-pointer"
                >
                  <option value="support" className="bg-[#092D27] text-white">Records Count</option>
                  <option value="f1" className="bg-[#092D27] text-white">Model F1-Score</option>
                  <option value="alpha" className="bg-[#092D27] text-white">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CUISINE CARDS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#43D6A0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#E9FFF4]/60">Extracting cuisine categories from model artifacts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCuisines.map((c) => {
              const details = CUISINE_DETAILS[c.name] || {
                icon: '🍽️',
                origin: 'Global Flavors',
                desc: 'Specialty culinary preparation present in the restaurant dataset.'
              };

              return (
                <div
                  key={c.name}
                  className="p-6 rounded-2xl bg-[#185447] border border-[#43D6A0]/20 hover:border-[#43D6A0]/70 hover:shadow-xl hover:shadow-[#43D6A0]/10 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-[#092D27] border border-[#43D6A0]/30 group-hover:scale-110 transition-transform">
                          {details.icon}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#B7F7D0] transition-colors">
                            {c.name}
                          </h3>
                          <span className="text-[11px] text-[#B7F7D0]/70 font-medium">
                            {details.origin}
                          </span>
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-full bg-[#092D27] border border-[#43D6A0]/30 text-xs font-bold text-[#43D6A0]">
                        {c.support ? `${c.support} rec.` : 'Target'}
                      </div>
                    </div>

                    <p className="text-xs text-[#E9FFF4]/70 leading-relaxed mb-4">
                      {details.desc}
                    </p>

                    {/* Performance Chips */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#092D27]/70 border border-[#43D6A0]/15 mb-4 text-center">
                      <div>
                        <span className="text-[10px] text-[#E9FFF4]/50 uppercase tracking-wider block">F1-Score</span>
                        <strong className="text-xs text-[#43D6A0] font-bold">
                          {c.f1_score ? c.f1_score.toFixed(3) : '0.000'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#E9FFF4]/50 uppercase tracking-wider block">Precision</span>
                        <strong className="text-xs text-white font-bold">
                          {c.precision ? c.precision.toFixed(3) : '0.000'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#E9FFF4]/50 uppercase tracking-wider block">Recall</span>
                        <strong className="text-xs text-white font-bold">
                          {c.recall ? c.recall.toFixed(3) : '0.000'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 border-t border-[#12463B] flex items-center justify-between">
                    <span className="text-[11px] text-[#E9FFF4]/60">
                      Multi-label Target Class
                    </span>
                    <button
                      onClick={() => setActivePage('prediction')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#43D6A0] hover:text-[#B7F7D0] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Test in Predictor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sortedCuisines.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-lg text-[#E9FFF4]/60">No cuisine found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterTier('all'); }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#43D6A0] text-black font-semibold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
