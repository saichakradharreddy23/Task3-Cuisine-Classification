from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import os
import sys

# Ensure backend root is on sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.model_service import ModelService
from services.preprocessing_service import PreprocessingService

router = APIRouter()
model_service = ModelService.get_instance()

class RestaurantPredictionInput(BaseModel):
    City: Optional[str] = Field("New Delhi", description="City of the restaurant")
    Country_Code: Optional[int] = Field(1, alias="Country Code", description="Country code (e.g. 1 for India)")
    Has_Table_booking: Optional[str] = Field("No", alias="Has Table booking", description="Table booking ('Yes' or 'No')")
    Has_Online_delivery: Optional[str] = Field("Yes", alias="Has Online delivery", description="Online delivery ('Yes' or 'No')")
    Is_delivering_now: Optional[str] = Field("No", alias="Is delivering now", description="Currently delivering ('Yes' or 'No')")
    Rating_text: Optional[str] = Field("Good", alias="Rating text", description="Rating quality text (e.g. 'Very Good', 'Good')")
    Average_Cost_for_two: Optional[float] = Field(600.0, alias="Average Cost for two", ge=0, description="Estimated average dining cost for two")
    Price_range: Optional[int] = Field(2, alias="Price range", ge=1, le=4, description="Price tier from 1 (budget) to 4 (luxury)")
    Aggregate_rating: Optional[float] = Field(3.8, alias="Aggregate rating", ge=0.0, le=5.0, description="Overall restaurant rating out of 5")
    Votes: Optional[int] = Field(120, ge=0, description="Total number of customer votes/reviews")
    Longitude: Optional[float] = Field(77.2090, description="Geographical longitude")
    Latitude: Optional[float] = Field(28.6139, description="Geographical latitude")

    class Config:
        populate_by_name = True

@router.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Cuisine Classification API",
        "model_loaded": model_service.model is not None,
        "best_model": model_service.metadata.get("best_model_name", "N/A"),
        "total_target_cuisines": len(model_service.prep_dict.get("top_cuisines", [])) if model_service.prep_dict else 0
    }

@router.get("/model/status")
def model_status():
    return health_check()

@router.get("/locations")
def get_locations():
    return {
        "cities": [
            "New Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad",
            "Ahmedabad", "Bhubaneshwar", "Lucknow", "Amritsar", "Guwahati", "Other"
        ]
    }

@router.get("/dataset-info")
def get_dataset_info():
    return {
        "summary": model_service.dataset_info,
        "metadata": model_service.metadata,
        "sample_restaurants": model_service.sample_restaurants
    }

@router.get("/cuisines")
def get_cuisines():
    cuisines = model_service.get_cuisines_data()
    return {
        "total_cuisines": len(cuisines),
        "cuisines": cuisines
    }

@router.get("/model-metrics")
def get_model_metrics():
    if not model_service.classification_report:
        raise HTTPException(status_code=503, detail="Model reports not found. Train the model first.")
    return {
        "best_model_name": model_service.metadata.get("best_model_name"),
        "metrics": model_service.metadata.get("best_model_metrics", {}),
        "detailed_report": model_service.classification_report,
        "single_label_benchmark": model_service.metadata.get("single_label_metrics", {})
    }

@router.get("/model-comparison")
def get_model_comparison():
    return {
        "models": model_service.model_comparison,
        "best_model": model_service.metadata.get("best_model_name")
    }

@router.post("/predict")
def predict_cuisine(input_data: RestaurantPredictionInput, top_k: int = 5):
    raw_dict = input_data.model_dump(by_alias=True)
    sanitized = PreprocessingService.validate_and_sanitize_input(raw_dict)
    try:
        k = int(top_k) if isinstance(top_k, (int, float, str)) and str(top_k).isdigit() else 5
        result = model_service.predict(sanitized, top_k=k)
        return {
            "success": True,
            "prediction": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
