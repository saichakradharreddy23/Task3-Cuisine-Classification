import React from 'react';
import { 
  BookOpen, 
  Database, 
  Filter, 
  Cpu, 
  Layers, 
  BarChart, 
  CheckCircle2, 
  ArrowDown, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Flame
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Dataset Ingestion & Inspection',
    icon: Database,
    desc: 'Loaded the original restaurant dataset containing 9,551 restaurants and 21 columns. Found 0 duplicate IDs and only 9 records with null cuisines.'
  },
  {
    step: '02',
    title: 'Cuisine Parsing & Multi-label Formulation',
    icon: Layers,
    desc: 'Analyzed the cuisine tags and found that 64.4% of restaurants have 2 to 8 comma-separated cuisines. Formulated the task as a principled Multi-Label Classification problem rather than forcing a single label.'
  },
  {
    step: '03',
    title: 'Zero-Leakage Feature Engineering',
    icon: Filter,
    desc: 'Extracted operational features: City (top 20 grouped), Country Code, Table Booking, Online Delivery, Delivering Now, Rating Text, Price Range, Log-transformed Average Cost for two, Log-transformed Votes, Longitude, and Latitude. Target cuisine is strictly excluded from inputs.'
  },
  {
    step: '04',
    title: 'Column Transformers & Train/Test Split',
    icon: Cpu,
    desc: 'Split 80% train (7,308) and 20% test (1,827). Fit StandardScaler on numericals and OneHotEncoder on categoricals strictly on the training set to prevent data leakage.'
  },
  {
    step: '05',
    title: 'Multi-Label Algorithm Comparison',
    icon: Flame,
    desc: 'Trained and evaluated DummyClassifier baseline, OneVsRest Logistic Regression (balanced class weights), Random Forest Classifier, and Decision Tree Classifier.'
  },
  {
    step: '06',
    title: 'Evaluation & Pipeline Persistence',
    icon: BarChart,
    desc: 'Calculated Micro and Macro Precision, Recall, F1-scores, Hamming Loss, and per-cuisine metrics. Serialized the best model and preprocessing pipeline with Joblib for live production inference.'
  }
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen text-[#FFF2E8] transition-colors duration-500 pb-20" style={{ backgroundColor: '#301321' }}>
      
      {/* HEADER */}
      <div className="border-b border-[#4B1D32] py-14 relative overflow-hidden" style={{ backgroundColor: '#4B1D32' }}>
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#F1B85B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#301321] border border-[#F1B85B]/40 text-xs font-semibold text-[#FFE1A3] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#F1B85B]" />
            <span>Project Methodology & Technical Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Methodology & <span className="text-[#F1B85B]">ML Architecture</span>
          </h1>

          <p className="text-base sm:text-lg text-[#FFF2E8]/80 mt-2 max-w-2xl font-light">
            Comprehensive documentation of data handling, feature pipelines, multi-label mathematical formulations, and engineering decisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* PIPELINE FLOW */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#F1B85B] font-semibold block mb-1">
              End-to-End Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Machine Learning Engineering Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {WORKFLOW_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-3xl bg-[#612A43] border border-[#F1B85B]/20 shadow-xl flex flex-col justify-between group hover:border-[#F1B85B]/60 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#4B1D32] border border-[#F1B85B]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-[#F1B85B]" />
                      </div>
                      <span className="text-2xl font-black font-display text-[#F1B85B]/40">
                        {item.step}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2 group-hover:text-[#FFE1A3] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#FFF2E8]/70 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#4B1D32] flex items-center justify-between text-[11px] text-[#FFE1A3]/60">
                    <span>Phase {item.step} Complete</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F1B85B]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MATHEMATICAL FORMULATION CARD */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#4B1D32] border border-[#F1B85B]/30 shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FFE1A3] uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-[#F1B85B]" />
            <span>Mathematical & Algorithmic Formulation</span>
          </div>

          <h3 className="text-2xl font-bold text-white font-display">
            Multi-Label Classification Mechanics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#FFF2E8]/80 leading-relaxed">
            <div className="p-5 rounded-2xl bg-[#301321] border border-[#F1B85B]/20 space-y-3">
              <h5 className="font-bold text-white text-sm text-[#F1B85B]">1. MultiLabelBinarizer (Target Encoding)</h5>
              <p>
                Each restaurant has a set of ground-truth cuisine tags (e.g. North Indian, Mughlai, Chinese). The MultiLabelBinarizer transforms these discrete tags into a dense binary vector:
              </p>
              <div className="p-3 rounded-lg bg-[#4B1D32] font-mono text-[11px] text-[#FFE1A3]">
                y_i = [1 if c_k in Cuisines_i else 0 for k in 1..K]
              </div>
              <p>
                This allows a restaurant to legitimately be both "North Indian" and "Mughlai" simultaneously without discarding culinary identity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#301321] border border-[#F1B85B]/20 space-y-3">
              <h5 className="font-bold text-white text-sm text-[#F1B85B]">2. One-Vs-Rest Classification & Loss</h5>
              <p>
                Trains K=25 independent binary logistic classifiers. For each class k, the calibrated probability is computed as:
              </p>
              <div className="p-3 rounded-lg bg-[#4B1D32] font-mono text-[11px] text-[#FFE1A3]">
                P(y_ik = 1 | x_i) = 1 / (1 + exp(- (w_k * x_i + b_k)))
              </div>
              <p>
                Evaluated using <strong>Hamming Loss</strong> (fraction of incorrectly predicted labels) and <strong>Macro-F1</strong> to guarantee rare cuisines are fairly evaluated.
              </p>
            </div>
          </div>
        </div>

        {/* CHALLENGES & LIMITATIONS */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#612A43] border border-[#F1B85B]/20 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFE1A3] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#F1B85B]" />
            <span>Dataset Engineering Challenges & Mitigations</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Challenges Encountered & How We Solved Them
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-[#F1B85B]">Extreme Class Imbalance</h5>
              <p className="text-xs text-[#FFF2E8]/70 leading-relaxed">
                North Indian appears 3,960 times while Japanese appears only 135 times in the top 25 classes. We mitigated this by setting <code>class_weight='balanced'</code> in Logistic Regression and evaluating models using Macro-F1 rather than plain accuracy.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-bold text-[#F1B85B]">Multi-Currency Cost Skew</h5>
              <p className="text-xs text-[#FFF2E8]/70 leading-relaxed">
                Average cost varies from ₹100 to 800,000 Indonesian Rupiahs. We applied a <code>log1p(cost)</code> logarithmic transformation paired with Country Code One-Hot Encoding to normalize variance and prevent scale distortion.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-bold text-[#F1B85B]">Sparse Locality Labels</h5>
              <p className="text-xs text-[#FFF2E8]/70 leading-relaxed">
                With over 1,200 unique sub-localities, direct one-hot encoding would produce an over-parameterized, sparse matrix. Instead, we grouped cities to top 20 + 'Other' and used continuous Longitude & Latitude coordinates for dense spatial modeling.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
