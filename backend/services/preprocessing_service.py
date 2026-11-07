from typing import Dict, Any

class PreprocessingService:
    @staticmethod
    def validate_and_sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates and provides sensible defaults for restaurant prediction inputs.
        """
        sanitized = {}
        sanitized["City"] = str(data.get("City", "New Delhi")).strip()
        
        try:
            sanitized["Country Code"] = int(data.get("Country Code", 1))
        except (ValueError, TypeError):
            sanitized["Country Code"] = 1
            
        sanitized["Has Table booking"] = "Yes" if str(data.get("Has Table booking", "No")).strip().lower() in ["yes", "true", "1"] else "No"
        sanitized["Has Online delivery"] = "Yes" if str(data.get("Has Online delivery", "No")).strip().lower() in ["yes", "true", "1"] else "No"
        sanitized["Is delivering now"] = "Yes" if str(data.get("Is delivering now", "No")).strip().lower() in ["yes", "true", "1"] else "No"
        
        rating_text = str(data.get("Rating text", "Good")).strip()
        valid_ratings = ["Excellent", "Very Good", "Good", "Average", "Poor", "Not rated"]
        sanitized["Rating text"] = rating_text if rating_text in valid_ratings else "Good"
        
        try:
            sanitized["Average Cost for two"] = max(0.0, float(data.get("Average Cost for two", 500.0)))
        except (ValueError, TypeError):
            sanitized["Average Cost for two"] = 500.0
            
        try:
            price = int(data.get("Price range", 2))
            sanitized["Price range"] = max(1, min(4, price))
        except (ValueError, TypeError):
            sanitized["Price range"] = 2
            
        try:
            rating = float(data.get("Aggregate rating", 3.5))
            sanitized["Aggregate rating"] = max(0.0, min(5.0, rating))
        except (ValueError, TypeError):
            sanitized["Aggregate rating"] = 3.5
            
        try:
            sanitized["Votes"] = max(0, int(data.get("Votes", 50)))
        except (ValueError, TypeError):
            sanitized["Votes"] = 50
            
        try:
            sanitized["Longitude"] = float(data.get("Longitude", 77.2090))
        except (ValueError, TypeError):
            sanitized["Longitude"] = 77.2090
            
        try:
            sanitized["Latitude"] = float(data.get("Latitude", 28.6139))
        except (ValueError, TypeError):
            sanitized["Latitude"] = 28.6139
            
        return sanitized
