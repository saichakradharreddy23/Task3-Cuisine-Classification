# Restaurant Cuisine Classification Using Machine Learning
**Restaurant Cuisine Classification – Machine Learning Task 3**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20+%20Vite-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=flat-square&logo=scikitlearn)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 1. Project Overview

**CuisinePulse AI** is a production-grade machine learning platform and interactive web application developed for **Task 3: Cuisine Classification**.

The platform analyzes restaurant operational and dining characteristics—such as geographical coordinates, city, average cost for two, price tier, aggregate rating, customer review votes, online delivery availability, and table booking status—to accurately predict restaurant cuisine profiles without target leakage.

Rather than treating cuisine as a simplistic single label, the system rigorously analyzes the multi-label nature of dining establishments (where **64.4% of restaurants serve multiple complementary cuisines**) and delivers calibrated multi-label predictions alongside single-label benchmarks.

---

## 2. Project Objectives

- **Automated Dataset Inspection**: Inspect and analyze real restaurant records from `Dataset .csv`.
- **Target Leakage Prevention**: Exclude restaurant names and cuisine tokens entirely from feature sets, ensuring predictions rely purely on structural dining factors.
- **Multi-Label Formulation**: Encode comma-separated multi-cuisine offerings using `MultiLabelBinarizer` and train multi-output classifiers (`OneVsRestClassifier`).
- **Comprehensive Benchmarking**: Evaluate models across **Micro-F1, Macro-F1, Hamming Loss, and Subset Accuracy** rather than relying on misleading raw accuracy.
- **Production API & UI**: Provide high-performance FastAPI REST endpoints and a luxury multi-themed React 18 application with custom aesthetic color palettes for every page.

---

## 3. Dataset Details & Inspection Findings

The dataset is located at [`dataset/Dataset .csv`](file:///c:/Users/saich/OneDrive/Desktop/Task3-Cuisine%20Classification/dataset/Dataset%20.csv) (and mirrored at the project root).

### Empirical Dataset Characteristics:
- **Total Records**: 9,551 restaurants
- **Total Columns**: 21 features
- **Duplicate Records**: 0 duplicate `Restaurant ID` entries
- **Missing Values**:
  - `Cuisines`: 9 missing records (0.09%) – cleanly dropped during preprocessing
  - All other 20 columns: **0 missing values**
- **Unique Distinct Cuisines**: **145** unique individual cuisine tags
- **Total Cuisine Mentions**: 19,710 total tags across all restaurants
- **Countries**: 15 countries (dominated by India `Country Code: 1` with 8,652 records, followed by US `Country Code: 216` with 434 records)
- **Cities**: 141 unique cities worldwide

### Cuisine Distribution Per Restaurant:
| Cuisines Listed | Restaurant Count | Percentage |
| :--- | :--- | :--- |
| **1 Cuisine (Single-label)** | 3,394 | 35.6% |
| **2 Cuisines** | 3,444 | 36.1% |
| **3 Cuisines** | 1,840 | 19.3% |
| **4 Cuisines** | 584 | 6.1% |
| **5 to 8 Cuisines** | 280 | 2.9% |
| **Total Multi-Label (≥2 Cuisines)** | **6,148** | **64.4%** |

---

## 4. Dataset Columns

| Column Name | Data Type | Role in Project | Description |
| :--- | :--- | :--- | :--- |
| `Restaurant ID` | `int64` | Identifier | Dropped to prevent identity leakage |
| `Restaurant Name` | `object` | Identifier | Dropped to prevent brand/name memorization |
| `Country Code` | `int64` | Input Feature | One-Hot Encoded country classification |
| `City` | `object` | Input Feature | Top 20 grouped + 'Other', One-Hot Encoded |
| `Address` | `object` | Raw Text | Handled through Longitude, Latitude & City |
| `Locality` / `Locality Verbose`| `object` | Raw Text | Represented via Longitude & Latitude coordinates |
| `Longitude` | `float64` | Input Feature | Continuous geospatial coordinate (StandardScaler) |
| `Latitude` | `float64` | Input Feature | Continuous geospatial coordinate (StandardScaler) |
| `Cuisines` | `object` | **Target Variable** | Multi-label target tokens (NEVER an input) |
| `Average Cost for two` | `int64` | Input Feature | Skewed dining expense (Transformed via `log1p`) |
| `Currency` | `object` | Contextual | Encoded in connection with Country Code |
| `Has Table booking` | `object` | Input Feature | Binary ('Yes'/'No' -> 1/0) |
| `Has Online delivery` | `object` | Input Feature | Binary ('Yes'/'No' -> 1/0) |
| `Is delivering now` | `object` | Input Feature | Binary ('Yes'/'No' -> 1/0) |
| `Switch to order menu` | `object` | Constant | Dropped (constant value `'No'` across all rows) |
| `Price range` | `int64` | Input Feature | Ordinal tier 1 to 4 (StandardScaler) |
| `Aggregate rating` | `float64` | Input Feature | Continuous quality rating 0.0 to 5.0 |
| `Rating color` | `object` | Categorical | Collinear with Rating Text |
| `Rating text` | `object` | Input Feature | Qualitative rating category, One-Hot Encoded |
| `Votes` | `int64` | Input Feature | Review volume (Transformed via `log1p`) |

---

## 5. Classification Formulation: Multi-Label vs. Single-Label

Because **64.4% of restaurants serve multiple cuisines**, forcing a single-label approach creates artificial misclassifications. 

- **Primary Pipeline (Multi-Label Classification)**:
  - Modeled across the **Top 25 cuisines** (covering **>94% of all cuisine tags** in the dataset).
  - Target representation: Binary matrix generated via `MultiLabelBinarizer`.
  - Classifier: `OneVsRestClassifier(LogisticRegression(class_weight='balanced'))`.
  - Metrics: Micro/Macro Precision, Recall, F1-score, and Hamming Loss.
- **Secondary Benchmark (Single-Label Primary Cuisine)**:
  - Modeled across top 10 dominant primary cuisines using `RandomForestClassifier`.
  - Evaluated with Accuracy (31.98%), Macro-F1 (0.2289), and Confusion Matrix Heatmap.

---

## 6. Preprocessing & Feature Pipeline

1. **Missing Data Imputation**: Dropped the 9 records lacking cuisine labels.
2. **Log-Transformations**: Skewed numerical features (`Average Cost for two` with range 0 to 800,000, and `Votes` with range 0 to 10,934) transformed with `np.log1p(x)` to handle skewness.
3. **Categorical Encoding**: Fitted `OneHotEncoder(handle_unknown='ignore')` on `City_grouped`, `Country Code`, `Has Table booking`, `Has Online delivery`, `Is delivering now`, and `Rating text`.
4. **Standardization**: Numerical features (`norm_cost`, `norm_votes`, `Aggregate rating`, `Price range`, `Longitude`, `Latitude`) scaled with `StandardScaler`.
5. **No Data Leakage**: All preprocessors and column transformers were fitted strictly on the 80% training set (7,308 samples) and applied to the 20% test set (1,827 samples).

---

## 7. Model Training & Actual Evaluation Results

All metrics were computed strictly from the holdout testing set (1,827 records) with random seed `42`.

### Multi-Label Model Comparison Table:
| Algorithm | Micro F1 | Macro F1 | Micro Precision | Micro Recall | Hamming Loss | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **OneVsRest Logistic Regression** | **0.2778** | **0.2271** | **0.2312** | **0.3478** | **0.2898** | **Best Model** |
| Random Forest Classifier | 0.2636 | 0.1229 | 0.4431 | 0.1873 | 0.0756 | Benchmark |
| Decision Tree Classifier | 0.2126 | 0.1342 | 0.2038 | 0.2223 | 0.1520 | Benchmark |
| Baseline (DummyClassifier) | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0785 | Baseline |

### Single-Label Primary Cuisine Benchmark:
- **Accuracy**: `31.98%`
- **Macro F1-Score**: `0.2289`
- **Weighted F1-Score**: `0.3204`

---

## 8. Per-Cuisine Performance Analysis (Sample)

| Cuisine Category | Precision | Recall | F1-Score | Test Support |
| :--- | :--- | :--- | :--- | :--- |
| **North Indian** | 0.5824 | 0.6978 | **0.6350** | 761 |
| **Chinese** | 0.4352 | 0.5480 | **0.4851** | 531 |
| **Fast Food** | 0.3218 | 0.4289 | **0.3678** | 394 |
| **Mughlai** | 0.1875 | 0.3645 | **0.2476** | 203 |
| **Italian** | 0.2245 | 0.3667 | **0.2785** | 150 |
| **Bakery** | 0.2105 | 0.2759 | **0.2388** | 145 |
| **Continental** | 0.1739 | 0.3310 | **0.2280** | 145 |
| **Cafe** | 0.1652 | 0.2692 | **0.2048** | 130 |
| **South Indian** | 0.2281 | 0.3881 | **0.2873** | 134 |
| **Desserts** | 0.1417 | 0.2667 | **0.1850** | 135 |

> **Analysis**: Common cuisines with strong geographical and cost clustering (e.g. North Indian and Chinese) achieve solid F1-scores up to **0.6350**. Highly specialized cuisines with lower representation (e.g. Desserts and Bakery) exhibit lower precision, benefiting heavily from class-balanced weighting.

---

## 9. Project Folder Structure

```
Task3-Cuisine Classification/
│
├── dataset/
│   └── Dataset .csv                    # Original restaurant dataset
│
├── backend/
│   ├── app.py                          # FastAPI application & static server
│   ├── routes/
│   │   └── prediction.py               # REST API endpoints & Pydantic models
│   ├── services/
│   │   ├── model_service.py            # Singleton model manager & inference
│   │   └── preprocessing_service.py    # Input sanitation & validation
│   └── requirements.txt                # Backend dependencies
│
├── training/
│   ├── data_loader.py                  # Dataset ingestion & inspection
│   ├── preprocessing.py                # Zero-leakage transformer pipeline
│   ├── train.py                        # Multi-label & single-label training
│   ├── evaluate.py                     # Evaluation metrics computation
│   ├── predict.py                      # Standalone CLI inference module
│   └── visualization.py                # Dark-themed report chart generator
│
├── models/
│   ├── best_model.pkl                  # Serialized best OneVsRest classifier
│   ├── preprocessing_pipeline.pkl      # Feature transformer & MultiLabelBinarizer
│   ├── single_label_model.pkl          # Single-label benchmark model
│   └── model_metadata.json             # Model training parameters & metadata
│
├── reports/
│   ├── classification_report.json      # Full per-cuisine evaluation metrics
│   ├── model_comparison.json           # All trained models comparison
│   ├── single_label_report.json        # Single-label benchmark report
│   ├── confusion_matrix.png            # Primary cuisine confusion matrix
│   ├── cuisine_distribution.png        # Dataset cuisine distribution chart
│   ├── cuisine_performance.png         # Per-cuisine precision/recall/F1 chart
│   └── model_comparison.png            # Multi-model benchmarking chart
│
├── frontend/
│   ├── dist/                           # Production compiled SPA bundle
│   ├── src/
│   │   ├── components/                 # Navbar, Footer
│   │   ├── pages/                      # 6 Themed Luxury Pages
│   │   │   ├── HomePage.jsx            # Warm Luxury Restaurant (#21130F)
│   │   │   ├── CuisineExplorerPage.jsx # Emerald Food Market (#092D27)
│   │   │   ├── PredictionPage.jsx      # Midnight Purple AI Kitchen (#17132D)
│   │   │   ├── AnalyticsPage.jsx       # Deep Ocean Blue (#071F35)
│   │   │   ├── MethodologyPage.jsx     # Burgundy & Gold (#301321)
│   │   │   └── ResultsPerformancePage.jsx # Charcoal & Neon Orange (#17191E)
│   │   ├── services/api.js             # API client
│   │   ├── App.jsx                     # Root router & page coordinator
│   │   ├── index.css                   # Tailwind styles & dark scrollbars
│   │   └── main.jsx                    # React DOM entry point
│   ├── package.json                    # Frontend dependencies
│   ├── tailwind.config.js              # Theme palettes & fonts configuration
│   └── vite.config.js                  # Vite bundler & reverse proxy
│
├── README.md                           # Master documentation
├── requirements.txt                    # Project dependencies
└── .gitignore                          # Git ignore rules
```

---

## 10. Frontend Color Palette System

Each page features a distinct, rich luxury theme with **zero plain white backgrounds**:

| Page | Theme Name | Background | Secondary | Accent | Highlight | Card |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Page 1: Home** | Warm Luxury Restaurant | `#21130F` | `#382019` | `#F08A4B` | `#FFC078` | `#472A20` |
| **Page 2: Explorer** | Emerald Food Market | `#092D27` | `#12463B` | `#43D6A0` | `#B7F7D0` | `#185447` |
| **Page 3: Prediction** | Midnight Purple AI Kitchen | `#17132D` | `#28204B` | `#B69CFF` | `#F4C96B` | `#352B5C` |
| **Page 4: Analytics** | Deep Ocean Blue | `#071F35` | `#103653` | `#41C8F5` | `#82E6FF` | `#164768` |
| **Page 5: Methodology** | Burgundy & Gold | `#301321` | `#4B1D32` | `#F1B85B` | `#FFE1A3` | `#612A43` |
| **Page 6: Results** | Charcoal & Neon Orange | `#17191E` | `#272C33` | `#FF9252` | `#FFD1A8` | `#303640` |

---

## 11. Quickstart & Installation Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. (Optional) Re-train Machine Learning Models
```bash
python training/train.py
```

### 4. Start the Application

You can run the integrated application in one command:
```bash
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```
Open your browser at: **`http://127.0.0.1:8000`**

### 5. Running the Frontend in Vite Dev Server (Optional)
If you want hot-reloading frontend development:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** (it automatically proxies API requests to port 8000).

---

## 12. REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status, model loading status, and target count |
| `GET` | `/api/dataset-info` | Real dataset summary and featured restaurants |
| `GET` | `/api/cuisines` | Catalog of 25 target cuisines with individual metrics |
| `GET` | `/api/model-metrics` | Test evaluation report for the best model |
| `GET` | `/api/model-comparison` | Multi-model benchmarking metrics |
| `POST`| `/api/predict` | Predict cuisines with confidence and explanation |

### Sample Prediction Request:
```json
POST /api/predict?top_k=5
Content-Type: application/json

{
  "City": "New Delhi",
  "Country Code": 1,
  "Average Cost for two": 1500,
  "Price range": 3,
  "Aggregate rating": 4.4,
  "Votes": 750,
  "Has Table booking": "Yes",
  "Has Online delivery": "Yes",
  "Is delivering now": "No",
  "Rating text": "Very Good"
}
```

### Sample Response:
```json
{
  "success": true,
  "prediction": {
    "primary_cuisine": "North Indian",
    "predicted_cuisines": ["North Indian", "Chinese", "Mughlai", "Continental"],
    "ranked_alternatives": [
      { "cuisine": "North Indian", "confidence": 0.8921, "confidence_pct": "89.2%", "is_predicted": true },
      { "cuisine": "Mughlai", "confidence": 0.8145, "confidence_pct": "81.5%", "is_predicted": true },
      { "cuisine": "Chinese", "confidence": 0.7680, "confidence_pct": "76.8%", "is_predicted": true }
    ],
    "explanation": "Based on the restaurant's price tier (3/4), cost (₹1500 for two), location (New Delhi), and rating (4.4★ with 750 votes), the machine learning model identified strong markers for North Indian, Chinese, Mughlai, Continental."
  }
}
```

---

## 13. Limitations & Future Work

- **Regional Specificity**: The dataset is heavily concentrated in the Delhi NCR region (New Delhi, Gurgaon, Noida). Expanding the dataset with greater global representations will enhance regional accuracy.
- **Deep Learning Text Embedding**: Future iterations can incorporate review text embeddings (e.g. BERT/RoBERTa) from customer review comments where available to capture subtle culinary nuances.
- **Dynamic Thresholding**: Implementing per-class probabilistic decision threshold tuning to balance precision and recall dynamically.

---

## 14. Project Information

Developed for **Task 3: Restaurant Cuisine Classification**.
Dataset is preserved in its original form and used strictly for academic and evaluation purposes.

