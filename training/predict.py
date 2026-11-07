import os
import sys
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List

def load_predictor():
    """Loads the trained model and preprocessing pipeline."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "models", "best_model.pkl")
    prep_path = os.path.join(base_dir, "models", "preprocessing_pipeline.pkl")
    
    if not os.path.exists(model_path) or not os.path.exists(prep_path):
        raise FileNotFoundError("Trained model or pipeline not found. Please run training/train.py first.")
        
    model = joblib.load(model_path)
    prep_dict = joblib.load(prep_path)
    return model, prep_dict

def predict_cuisines(restaurant_input: Dict[str, Any], top_k: int = 5) -> Dict[str, Any]:
    """
    Predicts restaurant cuisines from input features.
    """
    model, prep_dict = load_predictor()
    preprocessor = prep_dict["feature_preprocessor"]
    mlb = prep_dict["multilabel_binarizer"]
    classes = prep_dict["top_cuisines"]
    
    df_input = pd.DataFrame([restaurant_input])
    X_trans = preprocessor.transform(df_input)
    
    # Check if model has predict_proba
    probabilities = None
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(X_trans)
        if isinstance(probs, list):  # In case of list of binary classifier arrays
            probabilities = np.array([p[0, 1] if p.shape[1] > 1 else p[0, 0] for p in probs])
        else:
            probabilities = probs[0]
    elif hasattr(model, "decision_function"):
        scores = model.decision_function(X_trans)[0]
        # Sigmoid conversion
        probabilities = 1.0 / (1.0 + np.exp(-scores))
        
    binary_preds = model.predict(X_trans)
    if hasattr(binary_preds, "toarray"):
        binary_preds = binary_preds.toarray()
    binary_row = binary_preds[0]
    
    # Active predicted cuisines
    predicted_cuisines = [classes[i] for i, val in enumerate(binary_row) if val == 1]
    
    # Ranked alternatives with probabilities
    ranked_cuisines = []
    if probabilities is not None:
        sorted_indices = np.argsort(probabilities)[::-1]
        for idx in sorted_indices[:top_k]:
            ranked_cuisines.append({
                "cuisine": classes[idx],
                "confidence": round(float(probabilities[idx]), 4),
                "is_predicted": bool(binary_row[idx] == 1)
            })
    else:
        for c in predicted_cuisines[:top_k]:
            ranked_cuisines.append({
                "cuisine": c,
                "confidence": 1.0,
                "is_predicted": True
            })

    # If no binary prediction triggered, take highest probability cuisine
    if not predicted_cuisines and ranked_cuisines:
        predicted_cuisines = [ranked_cuisines[0]["cuisine"]]
        ranked_cuisines[0]["is_predicted"] = True

    return {
        "predicted_cuisines": predicted_cuisines,
        "ranked_cuisines": ranked_cuisines,
        "primary_predicted_cuisine": predicted_cuisines[0] if predicted_cuisines else "Unknown"
    }

if __name__ == "__main__":
    sample = {
        "City": "New Delhi",
        "Country Code": 1,
        "Has Table booking": "Yes",
        "Has Online delivery": "Yes",
        "Is delivering now": "No",
        "Rating text": "Very Good",
        "Average Cost for two": 1200,
        "Price range": 3,
        "Aggregate rating": 4.2,
        "Votes": 450,
        "Longitude": 77.2167,
        "Latitude": 28.6448
    }
    print("Testing predictor with sample input...")
    res = predict_cuisines(sample)
    print("Prediction Result:", res)
