import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

# Ensure training directory is in sys.path so unpickling custom transformers succeeds
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
training_dir = os.path.join(base_dir, "training")
if training_dir not in sys.path:
    sys.path.insert(0, training_dir)

class ModelService:
    _instance = None

    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.models_dir = os.path.join(self.base_dir, "models")
        self.reports_dir = os.path.join(self.base_dir, "reports")
        self.dataset_dir = os.path.join(self.base_dir, "dataset")

        self.model = None
        self.prep_dict = None
        self.metadata = {}
        self.model_comparison = []
        self.classification_report = {}
        self.dataset_info = {}
        self.sample_restaurants = []

        self._load_all()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelService()
        return cls._instance

    def _load_all(self):
        # 1. Load model & preprocessing pipeline if available
        model_path = os.path.join(self.models_dir, "best_model.pkl")
        prep_path = os.path.join(self.models_dir, "preprocessing_pipeline.pkl")
        meta_path = os.path.join(self.models_dir, "model_metadata.json")

        if os.path.exists(model_path) and os.path.exists(prep_path):
            self.model = joblib.load(model_path)
            self.prep_dict = joblib.load(prep_path)

        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

        # 2. Load reports
        comp_path = os.path.join(self.reports_dir, "model_comparison.json")
        if os.path.exists(comp_path):
            with open(comp_path, "r", encoding="utf-8") as f:
                self.model_comparison = json.load(f)

        rep_path = os.path.join(self.reports_dir, "classification_report.json")
        if os.path.exists(rep_path):
            with open(rep_path, "r", encoding="utf-8") as f:
                self.classification_report = json.load(f)

        # 3. Load sample restaurants and dataset stats from actual CSV
        csv_path = os.path.join(self.dataset_dir, "Dataset .csv")
        if not os.path.exists(csv_path):
            csv_path = os.path.join(self.base_dir, "Dataset .csv")

        if os.path.exists(csv_path):
            try:
                df = pd.read_csv(csv_path, encoding='utf-8')
                self.dataset_info = {
                    "total_restaurants": int(df.shape[0]),
                    "total_columns": int(df.shape[1]),
                    "cities_count": int(df['City'].nunique()),
                    "countries_count": int(df['Country Code'].nunique()),
                    "average_rating": round(float(df['Aggregate rating'].mean()), 2),
                    "average_cost": round(float(df['Average Cost for two'].median()), 2),
                    "online_delivery_pct": round(float((df['Has Online delivery'] == 'Yes').mean() * 100), 1),
                    "table_booking_pct": round(float((df['Has Table booking'] == 'Yes').mean() * 100), 1)
                }

                # Get top featured restaurants from the actual dataset
                top_rated = df[df['Aggregate rating'] >= 4.0].dropna(subset=['Cuisines']).head(12)
                featured = []
                for _, r in top_rated.iterrows():
                    featured.append({
                        "id": int(r["Restaurant ID"]),
                        "name": str(r["Restaurant Name"]),
                        "city": str(r["City"]),
                        "locality": str(r["Locality"]),
                        "cuisines": str(r["Cuisines"]),
                        "rating": float(r["Aggregate rating"]),
                        "votes": int(r["Votes"]),
                        "cost": int(r["Average Cost for two"]),
                        "currency": str(r["Currency"]),
                        "price_range": int(r["Price range"]),
                        "online_delivery": str(r["Has Online delivery"]) == "Yes",
                        "table_booking": str(r["Has Table booking"]) == "Yes"
                    })
                self.sample_restaurants = featured
            except Exception as e:
                print("Error inspecting dataset for metadata:", e)

    def reload(self):
        self._load_all()

    def get_cuisines_data(self) -> List[Dict[str, Any]]:
        if not self.prep_dict:
            return []
        
        top_cuisines = self.prep_dict.get("top_cuisines", [])
        per_cuisine_metrics = self.classification_report.get("per_cuisine", {})

        cuisine_cards = []
        for c in top_cuisines:
            metrics = per_cuisine_metrics.get(c, {})
            cuisine_cards.append({
                "name": c,
                "precision": metrics.get("precision", 0.0),
                "recall": metrics.get("recall", 0.0),
                "f1_score": metrics.get("f1-score", 0.0),
                "support": metrics.get("support", 0),
                "is_popular": metrics.get("support", 0) > 100
            })
        return cuisine_cards

    def predict(self, input_data: Dict[str, Any], top_k: int = 5) -> Dict[str, Any]:
        if self.model is None or self.prep_dict is None:
            self._load_all()
            if self.model is None:
                raise ValueError("Model is not loaded or training has not finished.")

        try:
            top_k = int(top_k)
        except Exception:
            top_k = 5

        preprocessor = self.prep_dict["feature_preprocessor"]
        classes = self.prep_dict["top_cuisines"]

        df_in = pd.DataFrame([input_data])
        X_trans = preprocessor.transform(df_in)

        # Probabilities
        probabilities = None
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X_trans)
            if isinstance(probs, list):
                probabilities = np.array([p[0, 1] if p.shape[1] > 1 else p[0, 0] for p in probs])
            else:
                probabilities = probs[0]
        elif hasattr(self.model, "decision_function"):
            scores = self.model.decision_function(X_trans)[0]
            probabilities = 1.0 / (1.0 + np.exp(-scores))

        binary_preds = self.model.predict(X_trans)
        if hasattr(binary_preds, "toarray"):
            binary_preds = binary_preds.toarray()
        binary_row = binary_preds[0]

        predicted = [classes[i] for i, val in enumerate(binary_row) if val == 1]

        ranked = []
        if probabilities is not None:
            sorted_indices = np.argsort(probabilities)[::-1]
            for idx in sorted_indices[:top_k]:
                ranked.append({
                    "cuisine": classes[idx],
                    "confidence": round(float(probabilities[idx]), 4),
                    "confidence_pct": f"{float(probabilities[idx]) * 100:.1f}%",
                    "is_predicted": bool(binary_row[idx] == 1)
                })
        else:
            for c in predicted[:top_k]:
                ranked.append({
                    "cuisine": c,
                    "confidence": 1.0,
                    "confidence_pct": "100.0%",
                    "is_predicted": True
                })

        if not predicted and ranked:
            predicted = [ranked[0]["cuisine"]]
            ranked[0]["is_predicted"] = True

        explanation = (
            f"Based on the restaurant's price tier ({input_data.get('Price range', 1)}/4), "
            f"cost (₹{input_data.get('Average Cost for two', 500)} for two), "
            f"location ({input_data.get('City', 'City')}), and rating ({input_data.get('Aggregate rating', 3.5)}★ with {input_data.get('Votes', 50)} votes), "
            f"the machine learning model identified strong markers for {', '.join(predicted)}."
        )

        return {
            "predicted_cuisines": predicted,
            "primary_cuisine": predicted[0] if predicted else "Unknown",
            "ranked_alternatives": ranked,
            "explanation": explanation,
            "input_received": input_data
        }
