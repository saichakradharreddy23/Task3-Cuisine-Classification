import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  DollarSign, 
  Star, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Utensils, 
  Layers, 
  Sliders, 
  ChevronRight,
  Info
} from 'lucide-react';
import { predictCuisine } from '../services/api';

const PRESETS = [
  {
    name: 'Luxury Fine Dining',
    desc: 'Expensive, 4-tier price, high rating, table booking',
    data: {
      City: 'New Delhi',
      Country_Code: 1,
      Has_Table_booking: 'Yes',
      Has_Online_delivery: 'No',
      Is_delivering_now: 'No',
      Rating_text: 'Excellent',
      Average_Cost_for_two: 3500,
      Price_range: 4,
      Aggregate_rating: 4.8,
      Votes: 1200,
      Longitude: 77.2167,
      Latitude: 28.6448
    }
  },
  {
    name: 'Casual Fast Food Corner',
    desc: 'Budget tier, high votes, online delivery enabled',
    data: {
      City: 'Noida',
      Country_Code: 1,
      Has_Table_booking: 'No',
      Has_Online_delivery: 'Yes',
      Is_delivering_now: 'Yes',
      Rating_text: 'Good',
      Average_Cost_for_two: 350,
      Price_range: 1,
      Aggregate_rating: 3.7,
      Votes: 450,
      Longitude: 77.3910,
      Latitude: 28.5355
    }
  },
  {
    name: 'Urban Specialty Cafe',
    desc: 'Moderate cost, cozy ambience, pastry & beverage focus',
    data: {
      City: 'Gurgaon',
      Country_Code: 1,
      Has_Table_booking: 'No',
      Has_Online_delivery: 'Yes',
      Is_delivering_now: 'No',
      Rating_text: 'Very Good',
      Average_Cost_for_two: 800,
      Price_range: 2,
      Aggregate_rating: 4.2,
      Votes: 320,
      Longitude: 77.0266,
      Latitude: 28.4595
    }
  },
  {
    name: 'Traditional Mughlai Diner',
    desc: 'Mid-to-high tier family dining in historic food hub',
    data: {
      City: 'New Delhi',
      Country_Code: 1,
      Has_Table_booking: 'Yes',
      Has_Online_delivery: 'Yes',
      Is_delivering_now: 'No',
      Rating_text: 'Very Good',
      Average_Cost_for_two: 1400,
      Price_range: 3,
      Aggregate_rating: 4.3,
      Votes: 850,
      Longitude: 77.2300,
      Latitude: 28.6500
    }
  }
];

export default function PredictionPage({ onPredictionMade }) {
  const [formData, setFormData] = useState({
    City: 'New Delhi',
    Country_Code: 1,
    Has_Table_booking: 'No',
    Has_Online_delivery: 'Yes',
    Is_delivering_now: 'No',
    Rating_text: 'Good',
    Average_Cost_for_two: 600,
    Price_range: 2,
    Aggregate_rating: 3.8,
    Votes: 150,
    Longitude: 77.2090,
    Latitude: 28.6139
  });

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (presetData) => {
    setFormData({ ...presetData });
    setPredictionResult(null);
    setErrorMsg('');
  };

  const handleReset = () => {
    setFormData({
      City: 'New Delhi',
      Country_Code: 1,
      Has_Table_booking: 'No',
      Has_Online_delivery: 'Yes',
      Is_delivering_now: 'No',
      Rating_text: 'Good',
      Average_Cost_for_two: 600,
      Price_range: 2,
      Aggregate_rating: 3.8,
      Votes: 150,
      Longitude: 77.2090,
      Latitude: 28.6139
    });
    setPredictionResult(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await predictCuisine(formData);
      if (res.success && res.prediction) {
        setPredictionResult(res.prediction);
        if (onPredictionMade) {
          onPredictionMade({
            timestamp: new Date().toLocaleTimeString(),
            input: formData,
            result: res.prediction
          });
        }
      } else {
        throw new Error('Invalid prediction response');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while contacting model backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#F5F0FF] transition-colors duration-500 pb-20" style={{ backgroundColor: '#17132D' }}>
      
      {/* HEADER */}
      <div className="border-b border-[#28204B] py-12 relative overflow-hidden" style={{ backgroundColor: '#28204B' }}>
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#B69CFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17132D] border border-[#B69CFF]/40 text-xs font-semibold text-[#F4C96B] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B69CFF]" />
            <span>Interactive Machine Learning Inference</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Cuisine <span className="text-[#B69CFF]">Prediction Studio</span>
          </h1>

          <p className="text-base sm:text-lg text-[#F5F0FF]/80 mt-2 max-w-2xl font-light">
            Enter restaurant operational features below. The trained machine learning model will infer the predicted multi-label cuisines with real posterior confidence scores.
          </p>

          {/* Preset Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#F5F0FF]/60 mr-2 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#B69CFF]" /> Presets:
            </span>
            {PRESETS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p.data)}
                className="px-3 py-1.5 rounded-lg bg-[#17132D] hover:bg-[#352B5C] border border-[#B69CFF]/30 hover:border-[#B69CFF] text-xs font-medium text-[#F5F0FF] transition-all"
              >
                {p.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* MAIN CONTENT GRID: FORM & RESULT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM CARD */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#352B5C] border border-[#B69CFF]/20 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-[#28204B] mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#28204B] flex items-center justify-center border border-[#B69CFF]/30">
                  <Utensils className="w-4 h-4 text-[#B69CFF]" />
                </div>
                <h3 className="text-lg font-bold text-white">Restaurant Profile</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-[#F5F0FF]/60 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: City & Country Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F4C96B] mb-2 uppercase tracking-wider">
                    City Location
                  </label>
                  <select
                    value={formData.City}
                    onChange={(e) => handleChange('City', e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#28204B] border border-[#B69CFF]/30 text-white text-sm focus:border-[#B69CFF] outline-none"
                  >
                    <option value="New Delhi">New Delhi (5,473 records)</option>
                    <option value="Gurgaon">Gurgaon (1,118 records)</option>
                    <option value="Noida">Noida (1,080 records)</option>
                    <option value="Faridabad">Faridabad (251 records)</option>
                    <option value="Ghaziabad">Ghaziabad (25 records)</option>
                    <option value="Ahmedabad">Ahmedabad (21 records)</option>
                    <option value="Bhubaneshwar">Bhubaneshwar (21 records)</option>
                    <option value="Lucknow">Lucknow (21 records)</option>
                    <option value="Amritsar">Amritsar (21 records)</option>
                    <option value="Other">Other International City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4C96B] mb-2 uppercase tracking-wider">
                    Price Range Tier (1 to 4)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(tier => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => handleChange('Price_range', tier)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                          formData.Price_range === tier
                            ? 'bg-[#B69CFF] text-[#17132D] shadow-lg shadow-[#B69CFF]/30 scale-105'
                            : 'bg-[#28204B] text-[#F5F0FF]/70 hover:bg-[#28204B]/80 border border-[#B69CFF]/20'
                        }`}
                      >
                        {'₹'.repeat(tier)}
                        <span className="block text-[9px] font-normal opacity-80">Tier {tier}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Average Cost for Two & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-[#F4C96B] uppercase tracking-wider">
                      Average Cost for Two
                    </label>
                    <span className="text-xs text-[#B69CFF] font-bold">
                      ₹{formData.Average_Cost_for_two.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={formData.Average_Cost_for_two}
                    onChange={(e) => handleChange('Average_Cost_for_two', parseFloat(e.target.value))}
                    className="w-full accent-[#B69CFF] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#F5F0FF]/40 mt-1">
                    <span>Budget (₹100)</span>
                    <span>Mid-range (₹1,500)</span>
                    <span>Luxury (₹5,000+)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-[#F4C96B] uppercase tracking-wider">
                      Aggregate Rating
                    </label>
                    <span className="text-xs text-[#F4C96B] font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#F4C96B]" />
                      {formData.Aggregate_rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={formData.Aggregate_rating}
                    onChange={(e) => handleChange('Aggregate_rating', parseFloat(e.target.value))}
                    className="w-full accent-[#F4C96B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#F5F0FF]/40 mt-1">
                    <span>1.0 (Poor)</span>
                    <span>3.5 (Average)</span>
                    <span>5.0 (Top)</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Total Votes & Rating Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F4C96B] mb-2 uppercase tracking-wider">
                    Total Customer Votes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    value={formData.Votes}
                    onChange={(e) => handleChange('Votes', parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#28204B] border border-[#B69CFF]/30 text-white text-sm focus:border-[#B69CFF] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4C96B] mb-2 uppercase tracking-wider">
                    Rating Qualitative Text
                  </label>
                  <select
                    value={formData.Rating_text}
                    onChange={(e) => handleChange('Rating_text', e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#28204B] border border-[#B69CFF]/30 text-white text-sm focus:border-[#B69CFF] outline-none"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                    <option value="Not rated">Not rated</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Operational Toggles */}
              <div className="p-4 rounded-2xl bg-[#28204B]/70 border border-[#B69CFF]/20">
                <span className="block text-xs font-semibold text-[#F4C96B] mb-3 uppercase tracking-wider">
                  Operational Features
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Table Booking */}
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-[#17132D] border border-[#B69CFF]/20 cursor-pointer hover:border-[#B69CFF]/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.Has_Table_booking === 'Yes'}
                      onChange={(e) => handleChange('Has_Table_booking', e.target.checked ? 'Yes' : 'No')}
                      className="w-4 h-4 rounded text-[#B69CFF] accent-[#B69CFF]"
                    />
                    <span className="text-xs text-white font-medium">Table Booking</span>
                  </label>

                  {/* Online Delivery */}
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-[#17132D] border border-[#B69CFF]/20 cursor-pointer hover:border-[#B69CFF]/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.Has_Online_delivery === 'Yes'}
                      onChange={(e) => handleChange('Has_Online_delivery', e.target.checked ? 'Yes' : 'No')}
                      className="w-4 h-4 rounded text-[#B69CFF] accent-[#B69CFF]"
                    />
                    <span className="text-xs text-white font-medium">Online Delivery</span>
                  </label>

                  {/* Delivering Now */}
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-[#17132D] border border-[#B69CFF]/20 cursor-pointer hover:border-[#B69CFF]/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.Is_delivering_now === 'Yes'}
                      onChange={(e) => handleChange('Is_delivering_now', e.target.checked ? 'Yes' : 'No')}
                      className="w-4 h-4 rounded text-[#B69CFF] accent-[#B69CFF]"
                    />
                    <span className="text-xs text-white font-medium">Delivering Now</span>
                  </label>

                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-[#17132D] bg-gradient-to-r from-[#B69CFF] via-[#F4C96B] to-[#B69CFF] shadow-lg shadow-[#B69CFF]/30 hover:shadow-[#B69CFF]/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-[#17132D] border-t-transparent rounded-full animate-spin" />
                    <span>Executing ML Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Predict Restaurant Cuisine</span>
                  </>
                )}
              </button>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </form>
          </div>

          {/* PREDICTION RESULT CARD */}
          <div className="lg:col-span-5 space-y-6">
            
            {predictionResult ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#352B5C] border-2 border-[#B69CFF]/50 shadow-2xl relative overflow-hidden animate-fadeIn">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#F4C96B]/10 rounded-full blur-2xl" />

                <div className="relative z-10 space-y-5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F4C96B] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4C96B]" />
                    <span>Machine Learning Prediction</span>
                  </div>

                  {/* Primary Predicted Cuisine Badge */}
                  <div>
                    <span className="text-xs text-[#F5F0FF]/60 block mb-1">Primary Predicted Cuisine:</span>
                    <div className="p-4 rounded-2xl bg-[#17132D] border border-[#B69CFF]/60 flex items-center justify-between shadow-inner">
                      <span className="text-2xl font-black text-white font-display">
                        {predictionResult.primary_cuisine}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#B69CFF]/20 border border-[#B69CFF] text-xs font-bold text-[#B69CFF]">
                        Confidence: {predictionResult.ranked_alternatives?.[0]?.confidence_pct || 'High'}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Label Predicted Tags */}
                  <div>
                    <span className="text-xs text-[#F5F0FF]/60 block mb-2">
                      All Active Multi-Label Cuisines:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {predictionResult.predicted_cuisines.map((c) => (
                        <span
                          key={c}
                          className="px-3 py-1.5 rounded-xl bg-[#28204B] border border-[#B69CFF]/40 text-xs font-bold text-white shadow-sm"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ranked Probability Bars */}
                  {predictionResult.ranked_alternatives && (
                    <div className="pt-2">
                      <span className="text-xs text-[#F4C96B] font-semibold block mb-3 uppercase tracking-wider">
                        Alternative Cuisine Posterior Probabilities:
                      </span>
                      <div className="space-y-2.5">
                        {predictionResult.ranked_alternatives.map((alt) => (
                          <div key={alt.cuisine} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-white font-medium">{alt.cuisine}</span>
                              <span className="text-[#B69CFF] font-mono font-bold">{alt.confidence_pct}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#17132D] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#B69CFF] to-[#F4C96B] transition-all duration-700"
                                style={{ width: `${Math.min(100, Math.max(5, alt.confidence * 100))}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation Note */}
                  <div className="p-4 rounded-xl bg-[#17132D]/80 border border-[#B69CFF]/20 text-xs text-[#F5F0FF]/80 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#F4C96B] shrink-0 mt-0.5" />
                      <span>{predictionResult.explanation}</span>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-[#352B5C]/60 border border-[#B69CFF]/20 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#28204B] border border-[#B69CFF]/30 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-[#B69CFF]" />
                </div>
                <h4 className="text-lg font-bold text-white font-display">Awaiting Restaurant Input</h4>
                <p className="text-xs text-[#F5F0FF]/60 max-w-sm mx-auto leading-relaxed">
                  Fill in the restaurant dining parameters on the left or click one of the quick presets, then press <strong>Predict Restaurant Cuisine</strong>.
                </p>
                <div className="p-3 rounded-xl bg-[#17132D] text-[11px] text-[#F5F0FF]/50 border border-white/5">
                  ML Model: OneVsRest Logistic Regression (Calibrated Probabilities)
                </div>
              </div>
            )}

            {/* Architecture Card */}
            <div className="p-5 rounded-2xl bg-[#28204B] border border-[#B69CFF]/20 text-xs space-y-2">
              <span className="font-semibold text-[#F4C96B] uppercase tracking-wider block">
                Target Leakage Protection
              </span>
              <p className="text-[#F5F0FF]/70 leading-relaxed">
                The cuisine label is the target variable. Inputs only include structural features (cost, votes, rating, geolocation, delivery). No restaurant name or cuisine tokens are fed into the model.
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
